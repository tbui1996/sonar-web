import { Typography } from '@material-ui/core';
import OptionsInputComponent from './OptionsInputComponent';
import { InputProps } from '../../../@types/form';

function SelectPrefix({ option, index }: { option: string; index: string }) {
  return (
    <Typography
      variant="h5"
      sx={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}
    >
      {index + 1}.
    </Typography>
  );
}

export default function SelectInputComponent({
  input,
  onChangeInput
}: InputProps) {
  return (
    <OptionsInputComponent
      input={input}
      onChangeInput={onChangeInput}
      IndicatorComponent={SelectPrefix}
    />
  );
}
