import {
  Box,
  Card,
  Container,
  Grid,
  InputAdornment,
  List,
  Pagination,
  TextField
} from '@material-ui/core';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import SearchIcon from '@material-ui/icons/Search';
import { ChangeEvent, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

// Local
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../routes/paths';
import LoadingScreen from '../../components/LoadingScreen';
import {
  ChatSessionStatus,
  Message,
  SocketMessageType
} from '../../@types/support';
import MyAvatar from '../../components/MyAvatar';
import AccordionSidebar from '../../components/chat/AccordionSidebar';
import NotificationMessage from '../../utils/notificationMessage';
import MessageList from '../../components/chat/MessageList';
import UserListItem from '../../components/chat/UserListItem';
import ChatStatus from '../../components/chat/ChatStatus';
import ChatHeader from '../../components/chat/ChatHeader';
import ChatMessageBar from '../../components/chat/ChatMessageBar';

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
  postUploadFile,
  activateSession,
  addPendingSession,
  readMessages,
  checkUnreadMessages
} from '../../redux/slices/support';
import {
  isChatSessionDTO,
  isFileUploadResponse,
  isMessage,
  isSocketMessage
} from '../../utils/type-guards';

const useStyles = makeStyles({
  justify: {
    justifyContent: 'center'
  }
});

const rowsPerPage = 6;
// const INTERVAL = 120000;

export default function Chat() {
  const classes = useStyles();
  const [messageTextInput, setMessageTextInput] = useState<string>('');
  const [file, setFile] = useState<File>();
  const [page, setPage] = useState(0);

  // Redux
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.authJwt);
  const { loadingInitialState, sessions, messageSending } = useSelector(
    (state: RootState) => state.support
  );

  const { activeSession } = useActiveSession();

  const socketUrl = `wss://ws-sonar-internal.${
    process.env.REACT_APP_BASE_API_DOMAIN
  }?authorization=${localStorage.getItem('accessToken')}`;

  const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
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

  function onSwitchSessionOpenState() {
    dispatch(postSwitchSessionOpen());
  }

  async function onOpenSession(id: string) {
    const session = sessions.byId[id];

    if (!session) {
      console.log(`expected session to exist when activating (${id})`);
      return;
    }

    dispatch(activateSession(id));

    if (session.pending) {
      dispatch(
        postAssignSessionToUser({ sessionID: id, internalUserID: user.id })
      );
    }

    if (session.status === ChatSessionStatus.UNHYDRATED) {
      dispatch(getSessionMessages(id));
    }
  }

  function onChangeMessage(e: ChangeEvent<HTMLInputElement>) {
    setMessageTextInput(e.currentTarget.value);
  }

  function onChangeFile(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;

    if (files === null) {
      return;
    }

    if (files.length <= 0) {
      return;
    }

    const file = files[0];
    setFile(file);
    setMessageTextInput(file.name);
  }

  function onDeleteFile() {
    setFile(undefined);
    setMessageTextInput('');
  }

  async function onClickSend() {
    if (!activeSession?.ID) {
      console.log(`expected a session to be active when sending a file.`);
      return;
    }

    if (file === undefined) {
      onSendMessage(null);
      return;
    }

    let response;
    try {
      response = await dispatch(postUploadFile(file));
    } catch (e) {
      console.log(e);
      return;
    }

    if (!isFileUploadResponse(response?.payload)) {
      console.log(
        'Response is not a file upload response: ',
        response?.payload
      );
      return;
    }

    onSendMessage(response.payload.fileID);
  }

  async function onSendMessage(fileID: string | null) {
    if (!activeSession?.ID) {
      NotificationMessage('You have not selected a chat', 'error');
      return;
    }

    if (messageTextInput === '' && fileID === null) {
      NotificationMessage('Please include message text', 'error');
      return;
    }

    // Optimistic Response add message
    dispatch(
      addMessage({
        id: `unknown-${Date.now() / 1000}`,
        sessionID: activeSession.ID,
        senderID: user.id,
        message: messageTextInput,
        createdTimestamp: Date.now() / 1000,
        fileID
      })
    );

    dispatch(readMessages());

    // Send through websocket
    sendJsonMessage({
      action: 'support',
      payload: {
        type: 'chat',
        message: JSON.stringify({
          session: activeSession.ID,
          sender: user.id,
          message: messageTextInput,
          file: fileID
        })
      }
    });

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

    setMessageTextInput('');
    setFile(undefined);
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
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <TextField
              placeholder="Search Contact"
              disabled
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div
            style={{
              marginTop: '.8em',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1
            }}
          >
            <List sx={{ flexGrow: 1 }}>{getChatSessionsView()}</List>
            <Pagination
              classes={{ ul: classes.justify }}
              count={Math.ceil(sessions.allIds.length / rowsPerPage)}
              onChange={(event, value) => setPage(value - 1)}
              page={page + 1}
              shape="rounded"
              size="small"
            />
          </div>
        </Grid>
        <Grid container item xs={9}>
          <Grid item xs={9}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              <ChatHeader session={activeSession} />
              <MessageList session={activeSession} />
              <ChatMessageBar
                onChangeText={onChangeMessage}
                messageText={messageTextInput}
                disabled={
                  readyState !== ReadyState.OPEN ||
                  !user ||
                  !activeSession?.chatOpen ||
                  messageSending
                }
                messageSending={messageSending}
                file={file}
                onChangeFile={onChangeFile}
                onClickSend={onClickSend}
                onDeleteFile={onDeleteFile}
              />
            </div>
          </Grid>
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
                <AccordionSidebar
                  providerName={activeSession?.user?.displayName}
                />
              </div>
            </div>
          </Grid>
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
          {content}
        </Card>
      </Container>
    </Page>
  );
}
