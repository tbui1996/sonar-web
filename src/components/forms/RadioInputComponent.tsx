import { Radio } from '@material-ui/core';
import OptionsInputComponent from './OptionsInputComponent';
import { InputProps } from '../../@types/form';

export default function RadioInputComponent({
  input,
  onChangeInput
}: InputProps) {
  return (
    <OptionsInputComponent
      input={input}
      IndicatorComponent={Radio}
      onChangeInput={onChangeInput}
    />
  );
}
