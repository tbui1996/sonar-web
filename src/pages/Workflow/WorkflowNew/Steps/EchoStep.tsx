import { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  code: {
    backgroundColor: '#eee',
  },
  echo: {
    width: 600
  }
}));

type Props = {
  handleBack: () => void;
  handleNext: () => void;
};

const availableTemplates = [
  'MEMBER_FIRST_NAME',
  'MEMBER_LAST_NAME',
  'MEMBER_ID',
  'MEMBER_CARD_IMAGE',
  'MEMBER_PHONE_NUMBER',
  'MEMBER_IS_ACTIVE',
  'MEMBER_BIRTH_DATE',
];

const EchoStep: FunctionComponent<Props> = ({ handleBack, handleNext }) => {
  const classes = useStyles();

  return (
    <div>
      <Typography>What should the Whisper look like?</Typography>
      <br />
      <Typography>Based on previous actions, here are the available string templates:</Typography>
      {availableTemplates.map(template => (
        <div key={template}>
          <code key={template} className={classes.code}>
            {template} 
          </code>
          <p />
        </div>
      ))}
      <TextField
        variant="outlined"
        color="primary"
        multiline
        rows={8}
        className={classes.echo}
      />
      <div className={classes.actionsContainer}>
        <div>
          <Button
            onClick={handleBack}
            className={classes.button}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            className={classes.button}
          >
            Activate Note
          </Button>
        </div>
      </div>
    </div>
  )
};

export default EchoStep;



