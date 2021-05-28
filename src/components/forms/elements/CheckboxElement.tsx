import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import { OptionsInput } from '../../../@types/form';
import { BootstrapInput } from '../../../constants/formConstants';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      marginLeft: '5%'
    }
  })
);

export default function CheckboxElement(props: {
  input: OptionsInput;
  index: number;
  isOliveHelps: boolean;
}) {
  const classes = useStyles();
  return (
    <FormControlLabel
      classes={{
        label: props.isOliveHelps ? classes.margin : ''
      }}
      control={
        props.isOliveHelps ? (
          <BootstrapInput type="checkbox" disabled={true} />
        ) : (
          <Checkbox name={`checkbox-${props.index}`} disabled={true} />
        )
      }
      label={props.input.label}
    />
  );
}
