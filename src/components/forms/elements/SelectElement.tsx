import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { NativeSelect } from '@material-ui/core';
import { FormElementProps } from '../../../@types/form';
import { BootstrapInput } from '../../../constants/formConstants';

export default function SelectElement({
  input,
  index,
  isOliveHelps,
  response
}: FormElementProps) {
  return (
    <FormControl variant="outlined">
      {!isOliveHelps && (
        <InputLabel htmlFor={`form-select-${index}`}>{input.label}</InputLabel>
      )}
      <NativeSelect
        disabled={true}
        inputProps={{
          name: input.type,
          id: `form-select-${index}`
        }}
        input={isOliveHelps ? <BootstrapInput /> : <Select />}
        value={isOliveHelps ? input.options[0] : response?.response || ''}
      >
        <option aria-label="None" value="" />
        {input.options.map((opt, index) => (
          <option value={opt} key={index}>
            {opt}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
}
