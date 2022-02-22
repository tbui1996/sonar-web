import {
  Box,
  Card,
  Container,
  Grid,
  InputAdornment,
  List,
  Pagination,
  TextField,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import useWebSocket from 'react-use-websocket';
import SearchIcon from '@material-ui/icons/Search';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

// Local
import Page from '../../components/Page';
import MessageList from '../../components/chat/MessageList';
import HeaderDashboard from '../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../routes/paths';
import {
  ChatSessionStatus,
  Message,
  SocketMessageType
} from '../../@types/support';
import MyAvatar from '../../components/MyAvatar';
import AccordionSidebar from '../../components/chat/AccordionSidebar';
import UserListItem from '../../components/chat/UserListItem';
import ChatStatus from '../../components/chat/ChatStatus';
import ChatHeader from '../../components/chat/ChatHeader';
// hooks
import useActiveSession from '../../hooks/useActiveSession';
// redux
import { RootState, useAppDispatch } from '../../redux/store';
import {
  addMessage,
  getInitialState,
  getSessionMessages,
  postAssignSessionToUser,
  postSwitchSessionOpen,
  activateSession,
  addPendingSession,
  readMessages,
  checkUnreadMessages
} from '../../redux/slices/support';
import {
  isChatSessionDTO,
  isMessage,
  isSocketMessage
} from '../../utils/type-guards';
import AlertSnackbar from '../../components/AlertSnackbar';
import { AlertState } from '../../@types/alert';
import ChatMessageBar from '../../components/chat/ChatMessageBar';
import LoadingScreen from '../../components/LoadingScreen';

const useStyles = makeStyles({
  justify: {
    justifyContent: 'center'
  }
});

const rowsPerPage = 6;
// const INTERVAL = 120000;
export const socketUrl = `wss://ws-sonar-internal.${
  process.env.REACT_APP_BASE_API_DOMAIN
}?authorization=${localStorage.getItem('accessToken')}`;

export default function Chat() {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'error'
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [openUsersSidebar, setOpenUsersSidebar] = useState(true);
  const [openInfoSidebar, setOpenInfoSidebar] = useState(true);

  // Redux
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.authJwt);
  const { loadingInitialState, messageSending, sessions } = useSelector(
    (state: RootState) => state.support
  );

  const { activeSession } = useActiveSession();

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onMessage: async (event) => {
      if (loadingInitialState) {
        console.log(`Received chat message while initial state was loading.`);
        return;
      }

      const socketMessage = JSON.parse(event.data);

      console.log('received message: ', socketMessage);

      if (!isSocketMessage(socketMessage)) {
        console.log(
          `Received message with incorrect structure: `,
          socketMessage
        );
        return;
      }

      switch (socketMessage.type) {
        case SocketMessageType.Message:
          if (!isMessage(socketMessage.payload)) {
            return;
          }

          addMessageFromSocket(socketMessage.payload);
          break;
        case SocketMessageType.NewPendingSession:
          console.log('Might have received new pending chat session.');
          if (!isChatSessionDTO(socketMessage.payload)) {
            console.log(
              'New pending chat session is not a chat session.',
              socketMessage.payload
            );
            return;
          }

          console.log(
            'Received new pending chat session',
            socketMessage.payload
          );
          dispatch(addPendingSession(socketMessage.payload));
          break;
        default:
          console.log('Received a message with unknown type.');
          break;
      }
    },
    // Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: () => true
  });

  useEffect(() => {
    if (isMobile) {
      return setOpenUsersSidebar(false);
    }
    return setOpenUsersSidebar(true);
  }, [isMobile]);

  useEffect(() => {
    if (isTablet) {
      return setOpenInfoSidebar(false);
    }
    return setOpenInfoSidebar(true);
  }, [isTablet]);

  useEffect(() => {
    // Initially fetch all data
    dispatch(getInitialState());
  }, [dispatch]);

  useEffect(() => {
    if (!activeSession) {
      return;
    }

    console.log('sending read receipt');
    dispatch(readMessages());
    sendJsonMessage({
      action: 'support',
      payload: {
        type: 'read_receipt',
        message: JSON.stringify({
          sessionID: activeSession.ID,
          userID: user.id
        })
      }
    });
  }, [dispatch, sendJsonMessage, activeSession, user]);

  async function addMessageFromSocket(message: Message) {
    const session = sessions.byId[message.sessionID];
    if (!session) {
      // if we don't have the session loaded, ignore the message
      // it will be hydrated the next time the user views the chat
      console.log(`Could not find session for message (${message.sessionID}).`);
      return;
    }

    if (session.status !== ChatSessionStatus.HYDRATED) {
      try {
        await dispatch(getSessionMessages(session.ID));
      } catch (e) {
        console.log(
          `Couldn't add message to session because it failed to hydrate (${session.ID}) (${message}).`
        );

        return;
      }
    }

    // Olive Helps messages are parsed as fileID === '', but backend returns null. Normalize to null.
    if (message.fileID === '') {
      message.fileID = null;
    }

    dispatch(addMessage(message));

    if (activeSession && activeSession.ID === session.ID) {
      // TODO send read receipt for message if active
      return;
    }

    console.log('Received unread message for session: ', session.ID);
    dispatch(checkUnreadMessages(session.ID));
  }

  function onSwitchSessionOpenState(rideScheduled: boolean) {
    dispatch(postSwitchSessionOpen(rideScheduled));
  }

  async function onOpenSession(id: string) {
    const session = sessions.byId[id];

    if (!session) {
      setAlertState({
        ...alertState,
        open: true,
        message: 'Unable to open chat, the session does not exist'
      });
      console.log(`expected session to exist when activating (${id})`);
      return;
    }

    dispatch(activateSession(id));

    if (session.pending) {
      const response = await dispatch(
        postAssignSessionToUser({ sessionID: id, internalUserID: user.id })
      );

      if (!response.payload) {
        setAlertState({
          ...alertState,
          open: true,
          message: 'Chat session has already been assigned'
        });
        dispatch(getInitialState());
      }
    }

    if (session.status === ChatSessionStatus.UNHYDRATED) {
      dispatch(getSessionMessages(id));
    }
  }

  function getChatSessionsView() {
    return sessions.allIds
      .map((id) => sessions.byId[id])
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((session) => (
        <UserListItem
          key={session.ID}
          isActive={Boolean(activeSession && session.ID === activeSession.ID)}
          session={session}
          onOpenChat={() => onOpenSession(session.ID)}
          internalUserID={user.id}
        />
      ));
  }

  let content;
  if (loadingInitialState) {
    content = (
      <Box
        width="100%"
        display="flex"
        padding="3rem"
        alignItems="center"
        justifyContent="center"
      >
        <LoadingScreen />
      </Box>
    );
  } else {
    content = (
      <Grid container sx={{ flexGrow: 1 }}>
        {openUsersSidebar && (
          <Grid
            item
            xs={3}
            sx={{
              borderRight: '1px solid rgba(145, 158, 171, 0.24)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <MyAvatar sx={{ margin: '.8em', width: '48px', height: '48px' }} />
            <div
              style={{
                marginTop: '.8em',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                flexGrow: 1
              }}
            >
              <TextField
                placeholder="Search..."
                disabled
                size="small"
                sx={{ paddingLeft: '16px', paddingRight: '16px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
              <List sx={{ flexGrow: 1 }}>{getChatSessionsView()}</List>
              <Pagination
                classes={{ ul: classes.justify }}
                count={Math.ceil(sessions.allIds.length / rowsPerPage)}
                onChange={(event, value) => setPage(value - 1)}
                page={page + 1}
                shape="rounded"
                size="small"
                sx={{ paddingBottom: '12px' }}
              />
            </div>
          </Grid>
        )}
        <Grid container item xs>
          <Grid item xs>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              <ChatHeader session={activeSession} />
              {activeSession?.ID && (
                <>
                  <MessageList session={activeSession} />
                  <ChatMessageBar
                    activeSession={activeSession}
                    loadingInitialState={loadingInitialState}
                    messageSending={messageSending}
                    alertState={alertState}
                    setAlertState={setAlertState}
                  />
                </>
              )}
            </div>
          </Grid>
          {openInfoSidebar && (
            <Grid container item xs={3}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%'
                }}
              >
                <ChatStatus
                  session={activeSession}
                  callback={onSwitchSessionOpenState}
                />
                <div
                  style={{
                    borderLeft: '1px solid rgba(145, 158, 171, 0.24)',
                    flexGrow: 1,
                    width: '100%'
                  }}
                >
                  {activeSession && (
                    <AccordionSidebar activeSession={activeSession} />
                  )}
                </div>
              </div>
            </Grid>
          )}
        </Grid>
      </Grid>
    );
  }

  return (
    <Page title="Chat | Sonar">
      <Container maxWidth="xl">
        <HeaderDashboard
          heading="Chat"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Chat' }
          ]}
        />
        <Card
          sx={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            overflow: 'unset'
          }}
        >
          <AlertSnackbar
            open={alertState.open}
            message={alertState.message}
            onAlertClose={() =>
              setAlertState({ ...alertState, open: false, message: '' })
            }
            severity={alertState.severity}
          />
          {content}
        </Card>
      </Container>
    </Page>
  );
}
