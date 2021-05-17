export type Input = {
  label: string;
  order: number;
  type: 'select' | 'text' | 'radio';
};

export type OptionsInput = Input & {
  options: Array<string>;
};

export type TextInput = Input;

export type Form = {
  id: string;
  title: string;
  description: string;
  created: string;
  inputs: Array<OptionsInput | TextInput>;
};
