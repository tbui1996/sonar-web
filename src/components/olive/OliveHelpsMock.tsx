import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { IconButton } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { SidenoteIcon } from './svg/SidenoteIcon';
import { LoopLibraryIcon } from './svg/LoopLibraryIcon';
import { OliveHelpsProps } from '../../@types/form';
import FormPreviewCard from '../forms/FormPreviewCard';
import { OliveLogoIcon } from './svg/OliveLogo';

const drawerWidth = 400;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    width: {
      width: '100%'
    },
    margin: {
      marginRight: '10%'
    },
    icon: {
      color: 'white'
    },
    iconText: {
      color: 'white',
      display: 'block'
    },
    flex: {
      flexGrow: 1,
      marginLeft: '1.5%',
      marginRight: '1.5%'
    },
    flexDirection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flexGrow: 1
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    buttonLabel: {
      display: 'flex',
      flexDirection: 'column'
    },
    drawerPaper: {
      width: drawerWidth,
      background: '#651FFF',
      opacity: 0.9,
      zIndex: 1500
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      marginBottom: '.5rem',
      justifyContent: 'flex-start',
      ...theme.mixins.toolbar,
      background: 'linear-gradient(180deg, #651FFF 0%, #8833DD 100%)'
    },
    drawerFooter: {
      alignItems: 'center',
      display: 'flex',
      padding: theme.spacing(1, 1),
      justifyContent: 'center',
      ...theme.mixins.toolbar,
      background: 'linear-gradient(0deg, #651FFF 0%, #8833DD 100%)'
    }
  })
);

export default function OliveHelpsMock({ form }: OliveHelpsProps) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div>
      <Button
        onClick={toggleDrawer}
        variant="contained"
        className={classes.width}
      >
        {open ? 'Close Olive Helps' : 'Preview in Olive Helps'}
      </Button>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={toggleDrawer}>
            <ChevronRightIcon className={classes.icon} />
          </IconButton>
          <OliveLogoIcon />
          <div className={classes.margin} />
        </div>
        <Divider />
        <div className={classes.flex}>
          {form && <FormPreviewCard form={form} isOliveHelps={true} />}
        </div>
        <div className={classes.flex} />
        <Divider className={classes.icon} />
        <div className={classes.drawerFooter}>
          <Button
            size="large"
            className={classes.flexDirection}
            classes={{ label: classes.buttonLabel }}
          >
            <HomeIcon className={classes.icon} />
            <span className={classes.iconText}>Home</span>
          </Button>
          <Button
            size="large"
            className={classes.flexDirection}
            classes={{ label: classes.buttonLabel }}
          >
            <SidenoteIcon />
            <span className={classes.iconText}>Sidenote</span>
          </Button>
          <Button
            size="large"
            className={classes.flexDirection}
            classes={{ label: classes.buttonLabel }}
          >
            <LoopLibraryIcon />
            <span className={classes.iconText}>Loop Library</span>
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
