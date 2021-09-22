import { Alert, Snackbar } from '@material-ui/core';
import { SyntheticEvent } from 'react';
import { AlertProps } from '../@types/alert';

export default function AlertSnackbar({
  severity,
  open,
  message,
  onAlertClose
}: AlertProps) {
  const handleClose = (event?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    onAlertClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ marginTop: '80px' }}
    >
      <Alert severity={severity} onClose={handleClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}
