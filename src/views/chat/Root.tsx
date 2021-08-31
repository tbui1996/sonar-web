import {
  Avatar,
  Box,
  Card,
  Container,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Tooltip,
  Typography
} from '@material-ui/core';
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import SendIcon from '@material-ui/icons/Send';
import SearchIcon from '@material-ui/icons/Search';
import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import { useSnackbar, VariantType } from 'notistack';
import { InsertEmoticon } from '@material-ui/icons';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../routes/paths';
import LoadingScreen from '../../components/LoadingScreen';
import { ChatSessionRequest, Message, Provider } from '../../@types/support';
import { MIconButton } from '../../components/@material-extend';
import MyAvatar from '../../components/MyAvatar';
import AccordionSidebar from '../../components/chat/AccordionSidebar';

const getAvatar = (provider: Provider): string =>
  provider.email[0].toUpperCase();

const getDisplayName = (provider: Provider | null): string => {
  if (!provider) {
    return 'Unknown';
  }

  const name = provider.email.split('@')[0];

  const firstLetter = name.substr(0, 1).toUpperCase();
  const restOfName = name.slice(1, name.length);

  return `${firstLetter}${restOfName}`;
};

const getMessages = (messages: Message[], providerName: string) =>
  messages.map((message, index) => (
    <ListItem key={index}>
      <Grid
        container
        direction="column"
        flexWrap="nowrap"
        alignItems={message.sender === 'sonar' ? 'flex-end' : 'flex-start'}
      >
        <Grid item xs={12}>
          <ListItemText
            secondary={
              message.sender === 'sonar'
                ? message.timestamp
                : `${providerName}, ${message.timestamp}`
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              background: (theme) =>
                message.sender === 'sonar'
                  ? theme.palette.primary.lighter
                  : theme.palette.grey[300],
              maxWidth: '375px'
            }}
          >
            <ListItemText
              primary={message.message}
              sx={{ padding: '10px', color: '#242832' }}
            />
          </Paper>
        </Grid>
      </Grid>
    </ListItem>
  ));

const socketUrl = `wss://ws-sonar-internal.${process.env.REACT_APP_BASE_API_DOMAIN}`;

export default function Chat() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [messageTextInput, setMessageTextInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSession, setChatSession] = useState<string>('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const notificationMessage = (message: string, variant: VariantType) => {
    enqueueSnackbar(message, {
      variant,
      action: (key) => (
        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      )
    });
  };

  const getListOfProviders = (providers: Provider[]) =>
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
            <Avatar sx={{ width: '48px', height: '48px' }}>
              {getAvatar(provider)}
            </Avatar>
          </ListItemIcon>
          <ListItemText primary={getDisplayName(provider)}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: '600', fontSize: '14px', lineHeight: '22px' }}
            >
              {getDisplayName(provider)}
            </Typography>
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

  const handleMessageTextInput = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageTextInput(e.currentTarget.value);
  };

  const sendMessage = async () => {
    if (messageTextInput === '') {
      notificationMessage('Please include message text', 'error');
      return;
    }

    if (!selectedProvider?.id) {
      notificationMessage('You have not selected a provider', 'error');
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
            <Grid container sx={{ flexGrow: 1 }}>
              <Grid
                item
                xs={3}
                sx={{ borderRight: '1px solid rgba(145, 158, 171, 0.24)' }}
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
                    height: '100%',
                    marginTop: '.8em'
                  }}
                >
                  <List>{getListOfProviders(providers)}</List>
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
                    <div
                      style={{
                        height: '70px',
                        borderBottom: '1px solid rgba(145, 158, 171, 0.24)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <div style={{ marginLeft: '1em' }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        >
                          {selectedProvider
                            ? getDisplayName(selectedProvider)
                            : 'Please Select a Provider'}
                        </Typography>
                        {selectedProvider && (
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#637381'
                            }}
                          >
                            Circulo
                          </Typography>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        flexGrow: 1,
                        borderBottom: '1px solid rgba(145, 158, 171, 0.24)'
                      }}
                    >
                      <List>
                        {getMessages(
                          messages,
                          getDisplayName(selectedProvider)
                        )}
                      </List>
                    </div>
                    <div>
                      <Input
                        sx={{ padding: '10px' }}
                        fullWidth
                        value={messageTextInput}
                        id="message-input"
                        placeholder="Type a message"
                        onChange={handleMessageTextInput}
                        type="text"
                        startAdornment={
                          <InputAdornment>
                            <InsertEmoticon sx={{ marginRight: '10px' }} />
                          </InputAdornment>
                        }
                        endAdornment={
                          <InputAdornment position="end">
                            <InsertPhotoOutlinedIcon />
                            <AttachFileOutlinedIcon />
                            <IconButton
                              onClick={sendMessage}
                              disabled={
                                readyState !== ReadyState.OPEN ||
                                !selectedProvider ||
                                !chatSession
                              }
                            >
                              <SendIcon />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </div>
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
                    <div
                      style={{
                        height: '70px',
                        width: '100%',
                        borderBottom: '1px solid rgba(145, 158, 171, 0.24)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="body2">Status: No Status</Typography>
                    </div>
                    <div
                      style={{
                        borderLeft: '1px solid rgba(145, 158, 171, 0.24)',
                        flexGrow: 1,
                        width: '100%'
                      }}
                    >
                      <AccordionSidebar
                        providerName={
                          selectedProvider
                            ? getDisplayName(selectedProvider)
                            : null
                        }
                      />
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
