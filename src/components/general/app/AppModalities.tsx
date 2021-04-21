import {
  Grid,
  Box,
  Card,
  Button,
  Divider,
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
              <TableRow key="note">
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.linkButton}
                    startIcon={<AddIcon />}
                  >
                    Note
                  </Button>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">
                    Add a quick note triggered by a keyword/sensor
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow key="broadcast">
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.linkButton}
                    startIcon={<AddIcon />}
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
              <TableRow key="message">
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.linkButton}
                    startIcon={<AddIcon />}
                  >
                    Message
                  </Button>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">
                    Send a message to a provider
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow key="datasheet">
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.linkButton}
                    startIcon={<AddIcon />}
                  >
                    Datasheet
                  </Button>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">
                    Add a spreadsheet of searchable data
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
