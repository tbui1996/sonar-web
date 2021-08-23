import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import ConfirmDialog from '../components/general/app/ConfirmDialog';
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
  },
  autocomplete: {
    marginBottom: 16
  }
}));

interface Provider {
  email: string;
  id: string;
}

export default function Broadcast() {
  const classes = useStyles();

  const [message, setMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [showBroadcastAlert, setShowBroadcastAlert] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const getProviders = () =>
    axios({
      url: `https://api.${process.env.REACT_APP_BASE_API_DOMAIN}/router/users`
    })
      .then((response) => setProviders(response.data))
      .catch((err) => console.error(err));

  useEffect(() => {
    getProviders();
  }, []);

  const handleSendBroadcast = () => {
    if (message === '') return;

    if (selectedProviders.length === 0) {
      setShowBroadcastAlert(true);
      return;
    }

    sendBroadcast();
  };

  const getRecipients = () => {
    if (selectedProviders.length === 0) {
      return providers.map((provider) => provider.id);
    }
    return selectedProviders.map((provider) => provider.id);
  };

  const sendBroadcast = () => {
    setSending(true);
    axios({
      method: 'post',
      url: `https://api.${process.env.REACT_APP_BASE_API_DOMAIN}/router/broadcast`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        sender: 'sonar',
        message,
        recipients: getRecipients()
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

  const handleAccept = () => {
    sendBroadcast();
    setShowBroadcastAlert(false);
  };

  const handleDismiss = () => {
    setShowBroadcastAlert(false);
  };

  return (
    <Page title="Broadcast | Sonar">
      <ConfirmDialog
        open={showBroadcastAlert}
        title="Are you sure you want to create this broadcast?"
        description="This broadcast will be sent out to all providers and cannot be undone."
        onConfirm={handleAccept}
        onCancel={handleDismiss}
      />
      <Container maxWidth="xl">
        <HeaderDashboard
          heading="Broadcast"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Broadcast' }
          ]}
        />
        <Card sx={{ height: 'auto' }}>
          {sending && <MLinearProgress />}
          <CardHeader title="Send a message to all providers, or select from list" />
          <CardContent>
            <Autocomplete
              className={classes.autocomplete}
              multiple
              id="providers-list"
              loading={providers.length === 0}
              loadingText="Looking for Providers..."
              options={providers}
              getOptionLabel={(provider) => provider.email}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="filled"
                  label="Select Providers"
                />
              )}
              onChange={(event, selectedProviders) => {
                setSelectedProviders(selectedProviders);
              }}
            />
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
              onClick={handleSendBroadcast}
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
