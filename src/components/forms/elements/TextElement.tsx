import React from 'react';
import TextField from '@material-ui/core/TextField';
import { FormControl } from '@material-ui/core';
import { OptionsInput } from '../../../@types/form';
import { BootstrapInput } from '../../../constants/formConstants';

export default function TextElement(props: {
  input: OptionsInput;
  index: number;
  isOliveHelps: boolean;
}) {
  return (
    <FormControl>
      {props.isOliveHelps && (
        <BootstrapInput
          id={`text-field-${props.index}`}
          disabled={true}
          value={props.input.label}
        />
      )}
      {!props.isOliveHelps && (
        <TextField
          id={`text-field-${props.index}`}
          label={props.input.label}
          variant="outlined"
          disabled={true}
        />
      )}
    </FormControl>
  );
}
