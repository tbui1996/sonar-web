import { FunctionComponent, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';

import Stepper from '@material-ui/core/Stepper';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { WhoStep, TriggerStep, ActionStep, EchoStep } from './Steps';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3)
  }
}));

const WorkflowNew: FunctionComponent = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = (): void => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key="who">
          <StepLabel>Who</StepLabel>
          <StepContent>
            <WhoStep handleNext={handleNext} />
          </StepContent>
        </Step>
        <Step key="trigger">
          <StepLabel>Trigger</StepLabel>
          <StepContent>
            <TriggerStep handleBack={handleBack} handleNext={handleNext} />
          </StepContent>
        </Step>
        <Step key="action">
          <StepLabel>Action</StepLabel>
          <StepContent>
            <ActionStep handleBack={handleBack} handleNext={handleNext} />
          </StepContent>
        </Step>
        <Step key="echo">
          <StepLabel>Note</StepLabel>
          <StepContent>
            <EchoStep handleBack={handleBack} handleNext={handleNext} />
          </StepContent>
        </Step>
      </Stepper>
      {activeStep === 4 && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>Your workflow is complete and activated!</Typography>
          <Button onClick={handleReset} className={classes.button}>
            New Workflow
          </Button>
        </Paper>
      )}
    </div>
  );


};

export default WorkflowNew;
