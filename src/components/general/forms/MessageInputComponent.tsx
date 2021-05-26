import { Typography } from '@material-ui/core';
import { InputProps } from '../../../@types/form';

export default function MessageInputComponent({
  input,
  onChangeInput
}: InputProps) {
  return (
    <>
      <Typography variant="body1">
        The provider will see the message. <br />
        Use to better explain the context of the input below if necessary.
      </Typography>
      <br />
      <Typography variant="body2">{input.label}</Typography>
    </>
  );
}
