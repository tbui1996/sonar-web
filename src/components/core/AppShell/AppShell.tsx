import { FunctionComponent, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from './AppBar';
import AppDrawer from './AppDrawer';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  }
}));

const AppShell: FunctionComponent = ({ children }) => {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  return (
    <div className={classes.root}>
      <AppBar setOpen={setDrawerOpen} open={drawerOpen} />
      <AppDrawer setOpen={setDrawerOpen} open={drawerOpen} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
};

export default AppShell;
