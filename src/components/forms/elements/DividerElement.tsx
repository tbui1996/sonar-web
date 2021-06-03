import React from 'react';
import { Divider, FormControl } from '@material-ui/core';
import { FormElementProps } from '../../../@types/form';

export default function DividerElement({
  input,
  index,
  isOliveHelps
}: FormElementProps) {
  return (
    <FormControl>
      <Divider />
    </FormControl>
  );
}
