import { SyntheticEvent } from 'react';

export type Input = {
  label: string;
  order: number;
  type:
    | 'select'
    | 'text'
    | 'radio'
    | 'checkbox'
    | 'divider'
    | 'email'
    | 'link'
    | 'number'
    | 'password'
    | 'telephone'
    | 'message';
};

export type OptionsInput = Input & {
  options: Array<string>;
};

export type TextInput = Input;

export type TypeInputComponent = {
  id: string;
  Component: ({ input, onChangeInput }: InputProps) => JSX.Element;
  label: string;
  displayLabel: string;
  disableLabel: boolean;
};

export type Form = {
  id: string;
  title: string;
  description: string;
  created: string;
  inputs: Array<OptionsInput | TextInput>;
};

export type InputEvent = {
  name?: string | undefined;
  value:
    | 'select'
    | 'text'
    | 'radio'
    | 'checkbox'
    | 'divider'
    | 'email'
    | 'link'
    | 'number'
    | 'password'
    | 'telephone'
    | 'message';
  event: Event | SyntheticEvent<Element, Event>;
};

export type FormContextType = {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  inputs: Array<Input>;
  setInputs: (f: Input[] | ((draft: Input[]) => void)) => void;
};

export type InputProps = {
  input: Input;
  onChangeInput: (value: Input) => void;
};
