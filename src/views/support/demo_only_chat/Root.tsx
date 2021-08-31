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
import { Provider, Message, ChatSessionRequest } from '../../../@types/support';
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

const getAvatar = (provider: Provider): string =>
  provider.email[0].toUpperCase();

const getDisplayName = (provider: Provider): string =>
  provider.email.split('@')[0];

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

const socketUrl = `wss://ws-sonar-internal.${process.env.REACT_APP_BASE_API_DOMAIN}`;

export default function Chat() {
  const classes = useStyles();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [messageTextInput, setMessageTextInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSession, setChatSession] = useState<string>('');

  const getListOfProviders = (providers: Provider[], classes: any) =>
    providers.map((provider) => (
      <Tooltip title={provider.email} key={provider.id} placement="right-start">
        <ListItem
          button
          selected={
            selectedProvider !== null && selectedProvider.id === provider.id
          }
          onClick={() => {
            if (selectedProvider?.id === provider.id) {
              setSelectedProvider(null);
            } else {
              setSelectedProvider(provider);
              getChatSession({
                internalUserID: 'sonar',
                userID: provider.id
              }).then((sessionID) => {
                if (sessionID) {
                  setChatSession(sessionID);
                }
              });
            }
          }}
        >
          <ListItemIcon>
            <Avatar>{getAvatar(provider)}</Avatar>
          </ListItemIcon>
          <ListItemText primary={getDisplayName(provider)}>
            {getDisplayName(provider)}
          </ListItemText>
        </ListItem>
      </Tooltip>
    ));

  const getProviders = () =>
    axios({
      url: `https://api.${process.env.REACT_APP_BASE_API_DOMAIN}/router/connected_users`
    })
      .then((response) => setProviders(response.data))
      .catch((err) => console.error(err));

  useEffect(() => {
    getProviders();
  }, []);

  const getChatSession = (data: ChatSessionRequest): Promise<string | void> =>
    axios
      .post(
        `https://api.${process.env.REACT_APP_BASE_API_DOMAIN}/support/chat_session`,
        data
      )
      .then((response) => setChatSession(response?.data?.id))
      .catch((err) => console.error(err));

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
    // Will attempt to reconnect on all close events, such as server shutting down
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

    if (!selectedProvider?.id) {
      return;
    }

    const message = {
      action: 'support',
      payload: {
        type: 'chat',
        message: JSON.stringify({
          session: chatSession,
          sender: 'sonar',
          message: messageTextInput
        })
      }
    };

    setMessages([
      ...messages,
      {
        sender: 'sonar',
        timestamp: new Date().toLocaleTimeString(),
        message: messageTextInput
      }
    ]);
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
            { name: 'Chat' }
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
          {providers.length === 0 && (
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
          {providers.length > 0 && (
            <Grid container component={Paper} className={classes.chatSection}>
              <Grid item xs={3} className={classes.borderColor}>
                <List>{getListOfProviders(providers, classes)}</List>
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
                        readyState !== ReadyState.OPEN ||
                        !selectedProvider ||
                        !chatSession
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
