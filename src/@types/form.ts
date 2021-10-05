import { SyntheticEvent } from 'react';

export type Input = {
  id: number;
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

export type TypeInputComponent = {
  id: string;
  Component: ({ input, onChangeInput }: InputProps) => JSX.Element;
  label: string;
  displayLabel: string;
  disableLabel: boolean;
  Element: (props: {
    input: OptionsInput;
    index: number;
    isOliveHelps: boolean;
    response?: InputSubmission;
  }) => JSX.Element;
};

export type Form = {
  id: string;
  title: string;
  description: string;
  created: string;
};

export type FormApiResponse = {
  Form: Form;
  Inputs: Array<OptionsInput | Input>;
};

export type OliveHelpsProps = {
  form: FormApiResponse;
};

export type FormDiscard = {
  id: number;
  formSentId: number;
};

export type InputSubmission = {
  id: number;
  formSubmissionId: number;
  inputId: number;
  response: string;
};

export type FormApiSubmitResponse = {
  discards: Array<FormDiscard>;
  submissions: Array<Array<InputSubmission>>;
};

export type FormCount = {
  count: number;
};

export type FormElementProps = {
  input: OptionsInput;
  index: number;
  isOliveHelps: boolean;
  response?: InputSubmission;
};

export type FormPreviewProps = {
  form: FormApiResponse;
  isOliveHelps: boolean;
  isFormPreview?: boolean;
  submissionResponses?: InputSubmission[];
};

export type FormResponseTableProps = {
  inputs: Array<OptionsInput | Input>;
  submits: Array<Array<InputSubmission>> | undefined;
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

export type FormPDFProps = {
  submissionId: string;
  form: FormApiResponse;
  submissionResponses: InputSubmission[];
};

export type InputPDFProps = Input & {
  options?: Array<string>;
};

export type RadioFormPDFProps = {
  input: InputPDFProps;
  response?: string;
};

export type CheckboxFormPDFProps = {
  label: string;
  response?: string;
};
