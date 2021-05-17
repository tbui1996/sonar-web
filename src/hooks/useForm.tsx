import {
  useState,
  createContext,
  ReactNode,
  useContext,
  useCallback
} from 'react';
import { useImmer } from 'use-immer';

export interface Input {
  label: string;
  order: number;
  type: 'select' | 'text' | 'radio';
}

export interface OptionsInput extends Input {
  options: Array<string>;
}

export interface TextInput extends Input {}

export const DEFAULT_RADIO: OptionsInput = {
  label: 'Radio',
  order: 0,
  type: 'radio',
  options: ['Option 1']
};

export const DEFAULT_TEXT: TextInput = {
  label: 'Text',
  order: 0,
  type: 'text'
};

export const DEFAULT_SELECT: OptionsInput = {
  label: 'Select',
  order: 0,
  type: 'select',
  options: ['Option 1']
};

interface FormContextType {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  inputs: Array<Input>;
  setInputs: (f: Input[] | ((draft: Input[]) => void)) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

interface FormProviderProps {
  children: ReactNode;
}

export function FormProvider({ children }: FormProviderProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [inputs, setInputs] = useImmer<Array<Input>>([{ ...DEFAULT_TEXT }]);

  return (
    <FormContext.Provider
      value={{
        title,
        description,
        setTitle,
        setDescription,
        inputs,
        setInputs
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

function useForm(): FormContextType {
  const value = useContext(FormContext);

  if (!value) {
    throw new Error('Expected context to exist.');
  }

  return value;
}

export function useFormInput(order: number): [Input, (value: Input) => void] {
  const { inputs, setInputs } = useForm();

  const setInput = useCallback(
    (value: Input) => {
      setInputs((draft) => {
        draft.splice(order, 1, value);
      });
    },
    [order, setInputs]
  );

  return [inputs[order], setInput];
}

export default useForm;
