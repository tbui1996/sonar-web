import { FunctionComponent, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  triggerInput: {
    margin: theme.spacing(2),
    width: 300
  },
  chip: {
    margin: theme.spacing(0.5)
  },
  root: {
    width: 500,
    '& > * + *': {
      marginTop: theme.spacing(3)
    }
  }
}));

const triggerOptions = [
  { name: 'Text', value: 'text' },
  { name: 'Time', value: 'time' }
];

const textOptions = [
  { name: 'Member ID', value: 'member' },
];

type Props = {
  handleBack: () => void;
  handleNext: () => void;
};

interface ChipData {
  key: number;
  label: string;
}

const TriggerStep: FunctionComponent<Props> = ({ handleBack, handleNext }) => {
  const classes = useStyles();
  const [type, setType] = useState(null);
  const [time, setTime] = useState<Date | null>(new Date());

  const handleTimeChange = (date: Date | null): void => {
    setTime(date);
  };

  return (
    <div>
      <Typography>What type and options for the Trigger?</Typography>
      <Autocomplete
        id="type"
        options={triggerOptions}
        getOptionLabel={option => option.name}
        className={classes.triggerInput}
        renderInput={(params) => <TextField {...params} label="Type" variant="outlined" />}
        onChange={(event) => setType(event.target.innerText)}
      />
      {type === 'Text' && (
          <Autocomplete
            multiple
            freeSolo
            id="text-type"
            options={textOptions.map(option => option.name)}
            // getOptionLabel={option => option.name}
            className={classes.triggerInput}
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip key={option} variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Text Triggers" placeholder="Text Triggers" />
            )}
          />
      )}
      {type === 'Time' && (
        <TextField
          id="time"
          label="Time"
          type="time"
          defaultValue="08:00"
          className={classes.triggerInput}
          InputLabelProps={{
            shrink: true
          }}
          inputProps={{
            step: 300
          }}
        />
      )}
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

export default TriggerStep;

