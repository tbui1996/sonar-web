import { FormControl, Typography } from '@material-ui/core';
import React from 'react';
import { FormElementProps } from '../../../@types/form';

export default function MessageElement({
  input,
  index,
  isOliveHelps
}: FormElementProps) {
  return (
    <FormControl>
      <Typography
        id={`message-${index}`}
        variant={isOliveHelps ? 'caption' : 'body2'}
      >
        {input.label}
      </Typography>
    </FormControl>
  );
}
