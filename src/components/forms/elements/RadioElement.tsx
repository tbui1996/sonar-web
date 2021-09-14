import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import { FormElementProps } from '../../../@types/form';
import { BootstrapInput } from '../../../constants/formConstants';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      marginLeft: '4.5%',
      padding: 0
    },
    marginLeftRight: {
      marginLeft: 0,
      marginRight: 0
    },
    padding: {
      paddingLeft: '6%'
    }
  })
);

export default function RadioElement({
  input,
  index,
  isOliveHelps,
  response
}: FormElementProps) {
  const classes = useStyles();
  return (
    <FormControl>
      <RadioGroup
        aria-label={input.label}
        name={`radio-${index}`}
        value={response?.response || ''}
      >
        {input.options.map((option, index) => (
          <FormControlLabel
            classes={{
              label: isOliveHelps ? classes.padding : '',
              root: isOliveHelps ? classes.marginLeftRight : ''
            }}
            control={
              isOliveHelps ? (
                <BootstrapInput type="radio" disabled={true} />
              ) : (
                <Radio disabled={true} value={option} />
              )
            }
            label={option}
            key={index}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
