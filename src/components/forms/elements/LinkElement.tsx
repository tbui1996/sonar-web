import Link from '@material-ui/core/Link';
import { FormControl } from '@material-ui/core';
import React from 'react';
import { OptionsInput } from '../../../@types/form';

export default function LinkElement(props: {
  input: OptionsInput;
  index: number;
  isOliveHelps: boolean;
}) {
  const preventDefault = (event: React.SyntheticEvent) =>
    event.preventDefault();

  return (
    <FormControl>
      <Link
        href={props.input.options[0]}
        onClick={preventDefault}
        id={`link-${props.index}`}
        variant={props.isOliveHelps ? 'caption' : 'body1'}
        color={props.isOliveHelps ? 'purple' : '#00AB55'}
      >
        {props.input.label}
      </Link>
    </FormControl>
  );
}
