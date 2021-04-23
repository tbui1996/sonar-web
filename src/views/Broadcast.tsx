import { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  TextField,
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import Page from '../components/Page';
import HeaderDashboard from '../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../routes/paths';
import { MLinearProgress, MIconButton } from '../components/@material-extend';

const useStyles = makeStyles(() => ({
  button: {
    width: 100,
    marginTop: 16
  },
  input: {
    width: '100%'
  }
}));

export default function Broadcast() {
  const classes = useStyles();

  const [message, setMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const sendBroadcast = () => {
    setSending(true);
    axios({
      method: 'post',
      url: 'https://api.sonar.circulo.dev/broadcast',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        sender: 'sonar',
        message
      })
    })
      .then(() => {
        setMessage('');
        setSending(false);
        enqueueSnackbar('Broadcast sent', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      })
      .catch(() => {
        setMessage('');
        setSending(false);
        enqueueSnackbar('Broadcast sent', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      });
  };

  return (
    <Page title="Broadcast | Sonar">
      <Container maxWidth="xl">
        <HeaderDashboard
          heading="Broadcast"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Broadcast' }
          ]}
        />
        <Card sx={{ height: '32vh' }}>
          {sending && <MLinearProgress />}
          <CardHeader title="Send a message to all providers" />
          <CardContent>
            <TextField
              className={classes.input}
              variant="outlined"
              label="Broadcast"
              multiline
              rows={10}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <Button
              disabled={sending}
              className={classes.button}
              variant="contained"
              onClick={sendBroadcast}
            >
              Send
            </Button>
          </CardContent>
          <CardActions />
        </Card>
      </Container>
    </Page>
  );
}
