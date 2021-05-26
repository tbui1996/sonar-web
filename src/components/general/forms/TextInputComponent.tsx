import { Typography } from '@material-ui/core';
import { InputProps } from '../../../@types/form';

export default function TextInputComponent({
  input,
  onChangeInput
}: InputProps) {
  let inputResponse = 'text';
  switch (input.type) {
    case 'telephone':
      inputResponse = 'a phone number';
      break;
    case 'email':
      inputResponse = 'an email address';
      break;
    case 'number':
      inputResponse = 'a number';
      break;
    case 'password':
      inputResponse = 'a password';
      break;
    default:
      break;
  }

  return <Typography>The provider will enter {inputResponse} </Typography>;
}
