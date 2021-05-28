import { FormControl, Typography } from '@material-ui/core';
import React from 'react';
import { OptionsInput } from '../../../@types/form';

export default function MessageElement(props: {
  input: OptionsInput;
  index: number;
  isOliveHelps: boolean;
}) {
  return (
    <FormControl>
      <Typography
        id={`message-${props.index}`}
        variant={props.isOliveHelps ? 'caption' : 'body2'}
      >
        {props.input.label}
      </Typography>
    </FormControl>
  );
}
