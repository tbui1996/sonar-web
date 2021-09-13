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
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../routes/paths';
import LoadingScreen from '../../components/LoadingScreen';
import {
  ChatSession,
  ChatSessionUpdateRequest,
  Message,
  SessionID
} from '../../@types/support';
import MyAvatar from '../../components/MyAvatar';
import AccordionSidebar from '../../components/chat/AccordionSidebar';
import NotificationMessage from '../../utils/notificationMessage';
import MessageList from '../../components/chat/MessageList';
import { User, Users } from '../../@types/users';
import useInterval from '../../hooks/useInterval';
import UserListItem from '../../components/chat/UserListItem';
import ChatStatus from '../../components/chat/ChatStatus';
import ChatHeader from '../../components/chat/ChatHeader';
import ChatMessageBar from '../../components/chat/ChatMessageBar';
import mapUserDisplayName from '../../utils/mapUserDisplayName';
import axios from '../../utils/axios';

const socketUrl = `wss://ws-sonar-internal.${process.env.REACT_APP_BASE_API_DOMAIN}`;

const useStyles = makeStyles({
  justify: {
    justifyContent: 'center'
  }
});

export default function Chat() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  // const [providers, setProviders] = useState<Provider[]>([]);
  const [messageTextInput, setMessageTextInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 6;
  const INTERVAL = 120000;
  const [selectedChatSession, setSelectedChatSession] = useState<ChatSession>();
  const [users, setUsers] = useState<Users>();
  const [user, setUser] = useState<User>();
  const [pendingChatSessions, setPendingChatSessions] = useState<ChatSession[]>(
    []
  );
  const classes = useStyles();

  function getResource<T>(type: string, url: string) {
    return axios
      .get<T>(url)
      .then((response) => {
        if (!response.data) {
          throw new Error(`Unable to get data for ${type}`);
        }

        return response.data;
      })
      .catch((err) => err);
  }

  function mapMessageTimestamp(message: Message) {
    const localItem = message;
    localItem.createdTimestamp = new Date(
      parseInt(localItem.createdTimestamp, 10) * 1000
    ).toLocaleTimeString();
    return localItem;
  }

  async function assignSessionToUser(chatSession: ChatSession) {
    const data: SessionID = {
      sessionID: chatSession.ID,
      internalUserID: 'sonar'
    };

    const res = await axios.post<Message[]>(
      `/support/assign_pending_chat_session`,
      data
    );

    if (res.data) {
      const messages = res.data.map((item: Message) =>
        mapMessageTimestamp(item)
      );
      setMessages(messages);
    }
  }

  const setOpenClose = (
    status: 'open' | 'close',
    session: ChatSession | undefined
  ) => {
    if (!session) {
      return;
    }

    const sessionsCopy = chatSessions;
    const theSessionIndex = sessionsCopy.findIndex(
      (item) => item.ID === session.ID
    );

    if (theSessionIndex === -1) {
      return;
    }

    const theSession = sessionsCopy[theSessionIndex];
    theSession.chatOpen = status !== 'close';
    sessionsCopy.splice(theSessionIndex, 1);

    axios
      .post(`/support/chat_session_update`, {
        open: theSession.chatOpen,
        id: theSession.ID
      } as ChatSessionUpdateRequest)
      .then((res) => {
        setChatSessions([...sessionsCopy, theSession]);
      })
      .catch((err) => console.log(err));
  };

  async function getMessageBySessionId(chatSessionId: string) {
    const res = await axios.get<Message[]>(
      `/support/messages/${chatSessionId}`
    );
    const messages = res.data.map((item: Message) => mapMessageTimestamp(item));
    setMessages(messages);
  }

  function getChatSessions(
    pendingChats: ChatSession[],
    activeChats: ChatSession[],
    users: User[] | undefined
  ) {
    const allSessions = pendingChats
      .map((item) => {
        item.pending = true;
        item.chatOpen = true;
        return item;
      })
      .concat(activeChats);

    const lastMessage = (session: ChatSession) => {
      const filteredMessages = messages.filter(
        (item) => item.sessionID === session.ID
      );
      if (filteredMessages) {
        return filteredMessages.length === 1
          ? filteredMessages[0]
          : filteredMessages[messages.length - 1];
      }

      return undefined;
    };

    return (
      allSessions
        // eslint-disable-next-line no-nested-ternary
        .sort((x, y) => y.createdTimestamp - x.createdTimestamp)
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((session, index) => {
          const foundUser = users?.find((user) => user.sub === session.userID);
          return (
            <UserListItem
              key={index}
              userDetails={foundUser}
              selected={
                selectedChatSession !== undefined &&
                session.ID === selectedChatSession.ID
              }
              onClickCallback={async () => {
                setUser(foundUser);
                setOpen(false);

                if (session.pending) {
                  await assignSessionToUser(session);
                  const pendingChats = pendingChatSessions;
                  const indexOfChat = pendingChats.findIndex(
                    (item) => item.ID === session.ID
                  );

                  pendingChats[indexOfChat].pending = false;
                  pendingChats[indexOfChat].internalUserID = 'sonar';
                  pendingChats[indexOfChat].chatOpen = true;

                  const copyOfIndex = pendingChats[indexOfChat];
                  pendingChats.splice(indexOfChat, 1);

                  setPendingChatSessions(pendingChats);
                  setChatSessions([copyOfIndex, ...chatSessions]);
                  setSelectedChatSession(copyOfIndex);
                } else {
                  await getMessageBySessionId(session.ID);
                  setSelectedChatSession(session);
                }
              }}
              open={session.chatOpen}
              lastMessage={lastMessage(session)}
            />
          );
        })
    );
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getResource<ChatSession[]>(
        'Pending Chat Sessions',
        `/support/pending_chat_sessions`
      ),
      getResource<ChatSession[]>('Active Chat Sessions', `/support/sessions`),
      getResource('Users', `/users/user_list`)
      // TODO: get providers so that we can start a chat session from frontend && determining online / offline
    ])
      .then((values) => {
        setPendingChatSessions(values[0] || ([] as ChatSession[]));
        setChatSessions(values[1] || ([] as ChatSession[]));

        const users = values[2];
        if (users && users.users) {
          users.users = mapUserDisplayName(users.users);
          setUsers(users);
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useInterval(async () => {
    const res = await getResource<ChatSession[]>(
      'Pending Chat Sessions',
      `/support/pending_chat_sessions`
    );

    if (res.length > 0) {
      const pendingChats = res as ChatSession[];
      pendingChats.forEach((item) => {
        if (pendingChatSessions && pendingChatSessions.length > 0) {
          const foundSession = pendingChatSessions.find(
            (p) => p.ID === item.ID
          );

          if (!foundSession) {
            setPendingChatSessions([item, ...pendingChatSessions]);
          }
        } else {
          setPendingChatSessions(pendingChats);
        }
      });
    }
  }, INTERVAL /* 1000 120000 */);

  const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
    onMessage: (event) => {
      const { sender, timestamp, message, session } = JSON.parse(event.data);
      setMessages([
        ...messages,
        {
          senderID: sender,
          createdTimestamp: new Date(timestamp * 1000).toLocaleTimeString(),
          message,
          sessionID: session
        }
      ]);
    },
    // Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true
  });

  const handleMessageTextInput = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageTextInput(e.currentTarget.value);
  };

  const sendMessage = async () => {
    if (messageTextInput === '') {
      NotificationMessage('Please include message text', 'error');
      return;
    }

    if (!selectedChatSession?.ID) {
      NotificationMessage('You have not selected a chat', 'error');
      return;
    }

    const message = {
      action: 'support',
      payload: {
        type: 'chat',
        message: JSON.stringify({
          session: selectedChatSession.ID,
          sender: 'sonar',
          message: messageTextInput
        })
      }
    };

    setMessages([
      ...messages,
      {
        senderID: 'sonar',
        createdTimestamp: new Date().toLocaleTimeString(),
        message: messageTextInput,
        sessionID: selectedChatSession.ID
      }
    ]);

    setMessageTextInput('');

    sendJsonMessage(message);
  };

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
          {loading && (
            <Box
              width="100%"
              display="flex"
              padding="3rem"
              alignItems="center"
              justifyContent="center"
            >
              <LoadingScreen />
            </Box>
          )}
          {!loading && (
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
                <MyAvatar
                  sx={{ margin: '.8em', width: '48px', height: '48px' }}
                />
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
                  <List sx={{ flexGrow: 1 }}>
                    {getChatSessions(
                      pendingChatSessions,
                      chatSessions,
                      users?.users || undefined
                    )}
                  </List>
                  <Pagination
                    classes={{ ul: classes.justify }}
                    count={Math.ceil(
                      (pendingChatSessions.length + chatSessions.length) /
                        rowsPerPage
                    )}
                    onChange={(event, value) => setPage(value - 1)}
                    page={page}
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
                    <ChatHeader chatSession={selectedChatSession} user={user} />
                    <MessageList
                      chatSession={selectedChatSession}
                      messages={messages}
                      providerName={user?.displayName}
                    />
                    <ChatMessageBar
                      changeCallback={handleMessageTextInput}
                      textInput={messageTextInput}
                      sendCallback={sendMessage}
                      disabled={
                        readyState !== ReadyState.OPEN ||
                        !user ||
                        !selectedChatSession ||
                        !selectedChatSession.chatOpen
                      }
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
                      chatSession={selectedChatSession}
                      callback={setOpenClose}
                      open={open}
                      onChange={() => setOpen(!open)}
                    />
                    <div
                      style={{
                        borderLeft: '1px solid rgba(145, 158, 171, 0.24)',
                        flexGrow: 1,
                        width: '100%'
                      }}
                    >
                      <AccordionSidebar providerName={user?.displayName} />
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Card>
      </Container>
    </Page>
  );
}
