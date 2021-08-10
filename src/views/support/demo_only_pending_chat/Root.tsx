import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Card,
  Grid,
  Container,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Fab,
  Tooltip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Page from '../../../components/Page';
import HeaderDashboard from '../../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../../routes/paths';
import {
  PendingChatSession,
  Message,
  SessionID
} from '../../../@types/support';
import LoadingScreen from '../../../components/LoadingScreen';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  chatSection: {
    width: '100%',
    height: 'auto'
  },
  headBG: {
    backgroundColor: '#e0e0e0'
  },
  borderColor: {
    borderRight: '1px solid rgba(145, 158, 171, 0.24)'
  },
  messageArea: {
    minHeight: '45vh',
    overflowY: 'auto'
  },
  online: {
    backgroundColor: '#F47F65'
  },
  offline: {
    backgroundColor: '#FFE9C9'
  }
});

const getAvatar = (pendingChatSession: PendingChatSession): string =>
  pendingChatSession.email[0].toUpperCase();

const getDisplayName = (pendingChatSession: PendingChatSession): string =>
  pendingChatSession.email.split('@')[0];

const getMessages = (messages: Message[]) =>
  messages.map((message, index) => (
    <ListItem key={index}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        textAlign={message.sender === 'sonar' ? 'right' : 'left'}
      >
        <Grid item xs={12}>
          <ListItemText primary={message.message} />
        </Grid>
        <Grid item xs={12}>
          <ListItemText secondary={message.timestamp} />
        </Grid>
      </Grid>
    </ListItem>
  ));

const socketUrl = 'wss://ws-sonar-internal.sonar.circulo.dev';

export default function Chat() {
  const classes = useStyles();

  const [pendingChatSessions, setPendingChatSessions] = useState<
    PendingChatSession[]
  >([]);
  const [
    selectedChatSession,
    setSelectedChatSession
  ] = useState<PendingChatSession | null>(null);
  const [messageTextInput, setMessageTextInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const assignSessionToUser = async (
    pendingChatSession: PendingChatSession,
    userID: string
  ) => {
    const data: SessionID = {
      sessionID: pendingChatSession.sessionID,
      internalUserID: userID
    };

    axios
      .post(
        'https://api.sonar.circulo.dev/support/assign_pending_chat_session',
        data
      )
      .then(({ data }) =>
        data.map(({ sender, timestamp, message }: Message) => ({
          sender,
          timestamp: new Date(+timestamp * 1000).toLocaleTimeString(),
          message
        }))
      )
      .then((messages: Message[]) => setMessages(messages))
      .catch((err) => console.error(err));
  };

  const getListOfProviders = (pendingChatSessions: PendingChatSession[]) =>
    pendingChatSessions.map((pendingChatSession, index) => (
      <Tooltip
        title={pendingChatSession.email}
        key={index}
        placement="right-start"
      >
        <ListItem
          button
          selected={
            selectedChatSession !== null &&
            selectedChatSession.userID === pendingChatSession.userID
          }
          onClick={() => {
            if (selectedChatSession?.userID === pendingChatSession.userID) {
              setSelectedChatSession(null);
            } else {
              assignSessionToUser(pendingChatSession, 'sonar');
              setSelectedChatSession(pendingChatSession);
            }
          }}
        >
          <ListItemIcon>
            <Avatar>{getAvatar(pendingChatSession)}</Avatar>
          </ListItemIcon>
          <ListItemText primary={getDisplayName(pendingChatSession)}>
            {getDisplayName(pendingChatSession)}
          </ListItemText>
        </ListItem>
      </Tooltip>
    ));

  const getPendingChatSessions = () =>
    axios({
      url: 'https://api.sonar.circulo.dev/support/pending_chat_sessions'
    })
      .then((response) => setPendingChatSessions(response.data))
      .catch((err) => console.error(err));

  useEffect(() => {
    getPendingChatSessions();
  }, []);

  const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
    onMessage: (event) => {
      console.log('Processing...');
      console.log(event.data);

      const { sender, timestamp, message } = JSON.parse(event.data);
      setMessages([
        ...messages,
        {
          sender,
          timestamp: new Date(timestamp * 1000).toLocaleTimeString(),
          message
        }
      ]);
    },
    shouldReconnect: (closeEvent) => true
  });

  const handleMessageTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageTextInput(e.currentTarget.value);
  };

  const sendMessage = async () => {
    if (messageTextInput === '') {
      // TODO: replace with something better
      alert("can't send empty messages");
      return;
    }

    if (!selectedChatSession?.sessionID) {
      return;
    }

    setMessages([
      ...messages,
      {
        sender: 'sonar',
        timestamp: new Date().toLocaleTimeString(),
        message: messageTextInput
      }
    ]);

    const message = {
      action: 'support',
      payload: {
        type: 'chat',
        message: JSON.stringify({
          session: selectedChatSession.sessionID,
          sender: 'sonar',
          message: messageTextInput
        })
      }
    };

    console.log('SENDING MESSAGE...');
    console.log(message);

    sendJsonMessage(message);
  };

  return (
    <Page title="Support | Sonar">
      <Container maxWidth="xl">
        <HeaderDashboard
          heading="Support"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Support' },
            { name: 'Pending Chat' }
          ]}
        />
        <Card
          sx={{
            minHeight: '50vh',
            paddingTop: '2rem',
            paddingBottom: '2rem',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {pendingChatSessions.length === 0 && (
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
          {pendingChatSessions.length > 0 && (
            <Grid container component={Paper} className={classes.chatSection}>
              <Grid item xs={3} className={classes.borderColor}>
                <List>{getListOfProviders(pendingChatSessions)}</List>
              </Grid>
              <Grid item xs={9}>
                <List className={classes.messageArea}>
                  {getMessages(messages)}
                </List>
                <Divider sx={{ my: 3 }} />
                <Grid container style={{ padding: '20px' }}>
                  <Grid item xs={11}>
                    <TextField
                      id="outlined-basic-email"
                      label="Type Here"
                      fullWidth
                      onChange={handleMessageTextInput}
                    />
                  </Grid>
                  <Grid item xs={1} style={{ paddingLeft: '20px' }}>
                    <Fab
                      color="primary"
                      aria-label="add"
                      onClick={sendMessage}
                      disabled={
                        readyState !== ReadyState.OPEN || !selectedChatSession
                      }
                    >
                      <SendIcon />
                    </Fab>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Card>
      </Container>
    </Page>
  );
}
