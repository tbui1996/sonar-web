import {
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
import Page from '../../../components/Page';
import HeaderDashboard from '../../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { Provider, Message } from '../../../@types/support';

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
  borderRight500: {
    borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    height: '50vh',
    overflowY: 'auto'
  },
  online: {
    backgroundColor: '#F47F65'
  },
  offline: {
    backgroundColor: '#FFE9C9'
  }
});

const providers: Provider[] = [
  {
    email: 'drpepper@iddllc.com',
    userID: '7',
    online: true
  },
  {
    email: 'someone@else.com',
    userID: '9',
    online: false
  }
];

const getAvatar = (provider: Provider): string =>
  provider.email[0].toUpperCase();

const getDisplayName = (provider: Provider): string =>
  provider.email.split('@')[0];

const getListOfProviders = (classes: any) =>
  providers.map((provider) => (
    <Tooltip title={provider.email} key={provider.userID}>
      <ListItem button>
        <ListItemIcon>
          <Avatar
            className={provider.online ? classes.online : classes.offline}
          >
            {getAvatar(provider)}
          </Avatar>
        </ListItemIcon>
        <ListItemText primary={getDisplayName(provider)}>
          {getDisplayName(provider)}
        </ListItemText>
        <ListItemText secondary={provider.online ? 'online' : 'offline'} />
      </ListItem>
    </Tooltip>
  ));

const messages: Message[] = [
  {
    sender: 'drpepper@iddllc.com',
    senderType: 'provider',
    timestamp: '09:30',
    message:
      "Hello, I NEED to know more about the Circulator I've been hearing about"
  },
  {
    sender: 'tony@circulohealth.com',
    senderType: 'circuloEmployee',
    timestamp: '09:31',
    message:
      "Sure thing! We're actively recruiting for a position, would you like to hear more?"
  },
  {
    sender: 'drpepper@iddllc.com',
    senderType: 'provider',
    timestamp: '09:32',
    message: 'Yes! Please!!'
  }
];

const getMessages = (messages: Message[]) =>
  messages.map((message, index) => (
    <ListItem key={index}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        textAlign={message.senderType === 'circuloEmployee' ? 'right' : 'left'}
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

export default function Chat() {
  const classes = useStyles();

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
          <Grid container component={Paper} className={classes.chatSection}>
            <Grid item xs={3} className={classes.borderRight500}>
              <List>{getListOfProviders(classes)}</List>
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
                  />
                </Grid>
                <Grid xs={1} style={{ paddingLeft: '20px' }}>
                  <Fab color="primary" aria-label="add">
                    <SendIcon />
                  </Fab>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Page>
  );
}
