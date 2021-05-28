import { useState, ReactNode, useContext, useCallback } from 'react';
import { useImmer } from 'use-immer';
import { FormContextType, Input } from '../@types/form';
import { DEFAULT_TEXT, FormContext } from '../constants/formConstants';

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
