import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BroadcastIcon from '@material-ui/icons/SpeakerPhone';
import EchoIcon from '@material-ui/icons/Hearing';
import ContactIcon from '@material-ui/icons/Contacts';
import MessageIcon from '@material-ui/icons/Message';
import DashboardIcon from '@material-ui/icons/Dashboard';
// import NoteIcon from '@material-ui/icons/Note';
import DataIcon from '@material-ui/icons/DataUsage';

export const DRAWER_WIDTH = 240;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    width: DRAWER_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  link: {
    textDecoration: 'none',
    color: 'black'
  }
}));

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const drawerItems = [
  {
    name: 'Dashboard',
    route: '/',
    Icon: DashboardIcon,
  },
  {},
  {
    name: 'Note',
    route: '/note',
    Icon: EchoIcon
  },
  {
    name: 'Broadcast',
    route: '/broadcast',
    Icon: BroadcastIcon,
  },
  {
    name: 'Message',
    route: '/message',
    Icon: MessageIcon,
  },
  {
    name: 'Data',
    route: '/data',
    Icon: DataIcon,
  },
  {},
  {
    name: 'Contacts',
    route: '/contacts',
    Icon: ContactIcon,
  }
]

const AppDrawer: FunctionComponent<Props> = ({ open, setOpen }) => {

  const classes = useStyles();

  const handleDrawerClose = (): void => {
    setOpen(false);
  };

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
     >
      <div className={classes.toolbar}>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        {drawerItems.map(({ name, route, Icon }, index) => index === 1 || index === 6 ? (<Divider />) : (
          <Link to={route} key={name} className={classes.link}>
            <ListItem button>
              <ListItemIcon><Icon /></ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  );
};

export default AppDrawer;
