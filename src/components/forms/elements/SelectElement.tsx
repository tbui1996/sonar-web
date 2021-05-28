import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { NativeSelect } from '@material-ui/core';
import { OptionsInput } from '../../../@types/form';
import { BootstrapInput } from '../../../constants/formConstants';

export default function SelectElement(props: {
  input: OptionsInput;
  index: number;
  isOliveHelps: boolean;
}) {
  return (
    <FormControl variant="outlined">
      {!props.isOliveHelps && (
        <InputLabel htmlFor={`form-select-${props.index}`}>
          {props.input.label}
        </InputLabel>
      )}
      <NativeSelect
        disabled={true}
        inputProps={{
          name: props.input.type,
          id: `form-select-${props.index}`
        }}
        input={props.isOliveHelps ? <BootstrapInput /> : <Select />}
        value={props.isOliveHelps ? props.input.options[0] : ''}
      >
        <option aria-label="None" value="" />
        {props.input.options.map((opt, index) => (
          <option value={opt} key={index}>
            {opt}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
}
