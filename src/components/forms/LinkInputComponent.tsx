import { TextField, Typography } from '@material-ui/core';
import { ChangeEvent } from 'react';
import { InputProps, OptionsInput } from '../../@types/form';

export default function LinkInputComponent({
  input,
  onChangeInput
}: InputProps) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // This does a lot of things I do not like, this is not not an option, but it's also not an option. And yet, I do it.
    onChangeInput({ ...input, options: [e.target.value] } as OptionsInput);
  };

  return (
    <>
      <TextField
        variant="outlined"
        label="Link Address"
        onChange={(e) => handleChange(e)}
        value={
          (input as OptionsInput).options
            ? (input as OptionsInput).options[0]
            : ''
        }
      />
      <br />
      <Typography>
        The provider will be directed to the link address through the link text
      </Typography>
    </>
  );
}
