import { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  scopeInput: {
    margin: theme.spacing(2),
    width: 300
  }
}));

const whoOptions = [
  { name: 'Tony', value: 'tony' },
  { name: 'Nick', value: 'nick' },
  { name: 'Office Workers', value: 'office' },
  { name: 'Doctors', value: 'doctors' },
  { name: 'Global', value: 'global' },
  { name: 'Provider', value: 'provider' }
];

type Props = {
  handleNext: () => void;
};

const WhoStep: FunctionComponent<Props> = ({ handleNext }) => {
  const classes = useStyles();

  return (
    <div>
        <Typography>Who is in the scope of this note?</Typography>
        <Autocomplete
          id="scope"
          options={whoOptions}
          getOptionLabel={option => option.name}
          className={classes.scopeInput}
          renderInput={(params) => <TextField {...params} label="Scope" variant="outlined" />}
        />
        <div className={classes.actionsContainer}>
          <div>
            <Button
              disabled
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
              Next
            </Button>
          </div>
        </div>
    </div>
  )
};

export default WhoStep;
