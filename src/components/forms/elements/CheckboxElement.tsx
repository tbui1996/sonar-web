import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import { FormElementProps } from '../../../@types/form';
import { BootstrapInput } from '../../../constants/formConstants';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      marginLeft: '5%'
    }
  })
);

export default function CheckboxElement({
  input,
  index,
  isOliveHelps,
  response
}: FormElementProps) {
  const classes = useStyles();
  const isChecked = response?.response === 'Yes';
  return (
    <FormControlLabel
      classes={{
        label: isOliveHelps ? classes.margin : ''
      }}
      control={
        isOliveHelps ? (
          <BootstrapInput type="checkbox" disabled={true} />
        ) : (
          <Checkbox
            name={`checkbox-${index}`}
            disabled={true}
            checked={isChecked}
          />
        )
      }
      label={input.label}
    />
  );
}
