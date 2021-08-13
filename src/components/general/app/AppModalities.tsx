import {
  Card,
  Button,
  CardHeader,
  Typography,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import Scrollbar from '../../Scrollbar';

const useStyles = makeStyles(() => ({
  root: {
    paddingBottom: 20
  },
  linkButton: {
    width: '100%'
  }
}));

const AppModalities = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader title="Modalities" sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableBody>
              <TableRow key="broadcast">
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.linkButton}
                    startIcon={<AddIcon />}
                    href="/dashboard/broadcast"
                  >
                    Broadcast
                  </Button>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">
                    Send a message to all or some providers
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow key="forms">
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.linkButton}
                    startIcon={<AddIcon />}
                    href="/dashboard/forms"
                  >
                    Forms
                  </Button>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">
                    Send a form to a provider
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow key="support">
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.linkButton}
                    startIcon={<AddIcon />}
                    href="/dashboard/support"
                  >
                    Support
                  </Button>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">
                    Respond to or start a support chat with a provider
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
};

export default AppModalities;
