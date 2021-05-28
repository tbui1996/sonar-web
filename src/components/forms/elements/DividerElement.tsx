import React from 'react';
import { Divider, FormControl } from '@material-ui/core';
import { OptionsInput } from '../../../@types/form';

export default function DividerElement(props: {
  // eslint-disable-next-line react/no-unused-prop-types
  input: OptionsInput;
  // eslint-disable-next-line react/no-unused-prop-types
  index: number;
  // eslint-disable-next-line react/no-unused-prop-types
  isOliveHelps: boolean;
}) {
  return (
    <FormControl>
      <Divider />
    </FormControl>
  );
}
