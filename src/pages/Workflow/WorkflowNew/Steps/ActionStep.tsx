import { FunctionComponent, useState } from 'react';
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
  input: {
    margin: theme.spacing(2),
    width: 300
  }
}));

const actionOptions = [
  { name: 'Get Medicaid Appointments', value: 'appt' },
  { name: 'Get Member Record', value: 'member' },
  { name: 'Get Claims Summary', value: 'claims' },
  { name: 'None', value: 'none' }
];

type Props = {
  handleBack: () => void;
  handleNext: () => void;
};


const ActionStep: FunctionComponent<Props> = ({ handleBack, handleNext }) => {
  const classes = useStyles();
  const [type, setType] = useState(null);

  return (
    <div>
      <Typography>Based on the previous step, choose an available Action:</Typography>
      <Autocomplete
        id="type"
        options={actionOptions}
        getOptionLabel={option => option.name}
        className={classes.input}
        renderInput={(params) => <TextField {...params} label="Type" variant="outlined" />}
        onChange={(event) => setType(event.target.innerText)}
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
            Next
          </Button>
        </div>
      </div>
    </div>
  )
};

export default ActionStep;


