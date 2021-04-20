import { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  linkButton: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    width: 200
  },
  helpText: {
    marginTop: 20,
    margin: 'auto'
  },
  headerText: {
    marginBottom: theme.spacing(1)
  },
  list: {
    height: 300,
    overflowY: 'scroll',
  },
  card: {
    width: '100%'
  }
}));

const DashboardPage: FunctionComponent = () => {
  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Link to="/note">
              <Button variant="contained" color="primary" className={classes.linkButton} startIcon={<AddIcon />}>
                Note
              </Button>
            </Link>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="h5" className={classes.helpText}>Add a quick note triggered by a keyword/sensor</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Link to="/broadcast">
              <Button variant="contained" color="primary" className={classes.linkButton} startIcon={<AddIcon />}>
                Broadcast
              </Button>
            </Link>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="h5" className={classes.helpText}>Send a message to all or some providers</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Link to="/message">
              <Button variant="contained" color="primary" className={classes.linkButton} startIcon={<AddIcon />}>
                Message
              </Button>
            </Link>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="h5" className={classes.helpText}>Send a message to a provider</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Link to="/datasheet">
              <Button variant="contained" color="primary" className={classes.linkButton} startIcon={<AddIcon />}>
                Datasheet
              </Button>
            </Link>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="h5" className={classes.helpText}>Add a spreadsheet of searchable data</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper className={classes.root}>
        <Typography variant="h5" className={classes.headerText}>Current Sonar Files</Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={3}>
            <Typography variant="h6">Notes</Typography>
            <List className={classes.list}>
              <ListItem>
                <Card className={classes.card}>
                  <CardHeader
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    subheader="Member Identification"
                  />
                </Card>
              </ListItem>
              <ListItem>
                <Card className={classes.card}>
                  <CardHeader
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    subheader="Vaccine Eligibility"
                  />
                </Card>
              </ListItem>
              <ListItem>
                <Card className={classes.card}>
                  <CardHeader
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    subheader="Insurance Plan"
                  />
                </Card>
              </ListItem>
              <ListItem>
                <Card className={classes.card}>
                  <CardHeader
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    subheader="Update Calendar Reminder"
                  />
                </Card>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6">Broadcasts</Typography>
            <List className={classes.list}>
              <ListItem>
                <Card className={classes.card}>
                  <CardHeader
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    subheader="Circulo Insurance Update"
                  />
                </Card>
              </ListItem>
              <ListItem>
                <Card className={classes.card}>
                  <CardHeader
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    subheader="Claims System Maintenance"
                  />
                </Card>
              </ListItem>
              <ListItem>
                <Card className={classes.card}>
                  <CardHeader
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    subheader="Pizza Lunch!"
                  />
                </Card>
              </ListItem>
              <ListItem>
                <Card className={classes.card}>
                  <CardHeader
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    subheader="Power Outage"
                  />
                </Card>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6">Message</Typography>
            <List className={classes.list}>
              <ListItem>
                <Card className={classes.card}>
                  <CardHeader
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    subheader="OhioHealth Updated Policy"
                  />
                </Card>
              </ListItem>
              <ListItem>
                <Card className={classes.card}>
                  <CardHeader
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    subheader="Circulo Referral"
                  />
                </Card>
              </ListItem>
              <ListItem>
                <Card className={classes.card}>
                  <CardHeader
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    subheader="Updated Phone Number"
                  />
                </Card>
              </ListItem>
              <ListItem>
                <Card className={classes.card}>
                  <CardHeader
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    subheader="Medicaid Updated Policy"
                  />
                </Card>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6">Datasheet</Typography>
            <List className={classes.list}>
              <ListItem>
                <Card className={classes.card}>
                  <CardHeader
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    subheader="Circulo Q4 Member Data"
                  />
                </Card>
              </ListItem>
              <ListItem>
                <Card className={classes.card}>
                  <CardHeader
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    subheader="Claim TAT Data"
                  />
                </Card>
              </ListItem>
              <ListItem>
                <Card className={classes.card}>
                  <CardHeader
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    subheader="Available Providers"
                  />
                </Card>
              </ListItem>
              <ListItem>
                <Card className={classes.card}>
                  <CardHeader
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    subheader="Referral List"
                  />
                </Card>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default DashboardPage;

