import {
  useState,
  createContext,
  ReactNode,
  useContext,
  useCallback
} from 'react';
import { useImmer } from 'use-immer';
import { FormContextType, Input, TypeInputComponent } from '../@types/form';
import TextInputComponent from '../components/general/forms/TextInputComponent';
import CheckboxInputComponent from '../components/general/forms/CheckboxInputComponent';
import DividerInputComponent from '../components/general/forms/DividerInputComponent';
import LinkInputComponent from '../components/general/forms/LinkInputComponent';
import MessageInputComponent from '../components/general/forms/MessageInputComponent';
import RadioInputComponent from '../components/general/forms/RadioInputComponent';
import SelectInputComponent from '../components/general/forms/SelectInputComponent';

export const DEFAULT_TEXT: Input = {
  label: 'Text',
  order: 0,
  type: 'text'
};

export const INPUT_TYPES: TypeInputComponent[] = [
  {
    id: 'checkbox',
    Component: CheckboxInputComponent,
    label: 'Checkbox',
    displayLabel: 'Label',
    disableLabel: false
  },
  {
    id: 'divider',
    Component: DividerInputComponent,
    label: 'Divider',
    displayLabel: 'Divider',
    disableLabel: true
  },
  {
    id: 'email',
    Component: TextInputComponent,
    label: 'Email',
    displayLabel: 'Label',
    disableLabel: false
  },
  {
    id: 'link',
    Component: LinkInputComponent,
    label: 'Link',
    displayLabel: 'Link Text',
    disableLabel: false
  },
  {
    id: 'message',
    Component: MessageInputComponent,
    label: 'Message',
    displayLabel: 'Message',
    disableLabel: false
  },
  {
    id: 'number',
    Component: TextInputComponent,
    label: 'Number',
    displayLabel: 'Label',
    disableLabel: false
  },
  {
    id: 'password',
    Component: TextInputComponent,
    label: 'Password',
    displayLabel: 'Label',
    disableLabel: false
  },
  {
    id: 'radio',
    Component: RadioInputComponent,
    label: 'Radio',
    displayLabel: 'Radio',
    disableLabel: true
  },
  {
    id: 'select',
    Component: SelectInputComponent,
    label: 'Select',
    displayLabel: 'Label',
    disableLabel: false
  },
  {
    id: 'telephone',
    Component: TextInputComponent,
    label: 'Telephone',
    displayLabel: 'Label',
    disableLabel: false
  },
  {
    id: 'text',
    Component: TextInputComponent,
    label: 'Text',
    displayLabel: 'Label',
    disableLabel: false
  }
];

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
