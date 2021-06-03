import Link from '@material-ui/core/Link';
import { FormControl } from '@material-ui/core';
import React from 'react';
import { FormElementProps } from '../../../@types/form';

export default function LinkElement({
  input,
  index,
  isOliveHelps
}: FormElementProps) {
  const preventDefault = (event: React.SyntheticEvent) =>
    event.preventDefault();

  return (
    <FormControl>
      <Link
        href={input.options[0]}
        onClick={preventDefault}
        id={`link-${index}`}
        variant={isOliveHelps ? 'caption' : 'body1'}
        color={isOliveHelps ? 'purple' : '#00AB55'}
      >
        {input.label}
      </Link>
    </FormControl>
  );
}
