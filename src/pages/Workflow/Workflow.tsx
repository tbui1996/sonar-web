import { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import WorkflowNew from './WorkflowNew';

const useStyles = makeStyles(() => ({
  root: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px'
  }
}));

const WorkflowPage: FunctionComponent = () => 
  // const classes = useStyles();

   (
      <WorkflowNew />
  )
;

export default WorkflowPage;
