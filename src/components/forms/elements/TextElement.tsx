import React from 'react';
import TextField from '@material-ui/core/TextField';
import { FormControl } from '@material-ui/core';
import { FormElementProps } from '../../../@types/form';
import { BootstrapInput } from '../../../constants/formConstants';

export default function TextElement({
  input,
  index,
  isOliveHelps,
  response
}: FormElementProps) {
  return (
    <FormControl>
      {isOliveHelps && (
        <BootstrapInput
          id={`text-field-${index}`}
          disabled={true}
          value={input.label}
        />
      )}
      {!isOliveHelps && (
        <TextField
          id={`text-field-${index}`}
          label={response?.response ? '' : input.label}
          variant="outlined"
          disabled={true}
          value={response?.response}
        />
      )}
    </FormControl>
  );
}
