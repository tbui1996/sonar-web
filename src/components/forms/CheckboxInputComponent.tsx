import { FormControlLabel, Checkbox, Typography } from '@material-ui/core';
import React from 'react';
import { InputProps } from '../../@types/form';

export default function CheckboxInputComponent({
  input,
  onChangeInput
}: InputProps) {
  return (
    <>
      <FormControlLabel
        control={<Checkbox checked={false} name="checked" disabled={true} />}
        label={input.label}
      />
      <br />
      <Typography>The provider will check the box</Typography>
    </>
  );
}
