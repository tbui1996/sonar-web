import { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BroadcastForm from './BroadcastForm';

const useStyles = makeStyles(() => ({
  root: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px',
  }
}));

const BroadcastPage: FunctionComponent = () => {
  const classes = useStyles();

  return (
  <div className={classes.root}>
    <BroadcastForm />
  </div>
  );
};

export default BroadcastPage;
