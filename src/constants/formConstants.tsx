import { createContext } from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { InputBase } from '@material-ui/core';
import TextInputComponent from '../components/forms/TextInputComponent';
import CheckboxInputComponent from '../components/forms/CheckboxInputComponent';
import DividerInputComponent from '../components/forms/DividerInputComponent';
import LinkInputComponent from '../components/forms/LinkInputComponent';
import MessageInputComponent from '../components/forms/MessageInputComponent';
import RadioInputComponent from '../components/forms/RadioInputComponent';
import SelectInputComponent from '../components/forms/SelectInputComponent';
import TextElement from '../components/forms/elements/TextElement';
import RadioElement from '../components/forms/elements/RadioElement';
import SelectElement from '../components/forms/elements/SelectElement';
import DividerElement from '../components/forms/elements/DividerElement';
import { FormContextType, Input, TypeInputComponent } from '../@types/form';
import CheckboxElement from '../components/forms/elements/CheckboxElement';
import LinkElement from '../components/forms/elements/LinkElement';
import MessageElement from '../components/forms/elements/MessageElement';

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
    disableLabel: false,
    Element: CheckboxElement
  },
  {
    id: 'divider',
    Component: DividerInputComponent,
    label: 'Divider',
    displayLabel: 'Divider',
    disableLabel: true,
    Element: DividerElement
  },
  {
    id: 'email',
    Component: TextInputComponent,
    label: 'Email',
    displayLabel: 'Label',
    disableLabel: false,
    Element: TextElement
  },
  {
    id: 'link',
    Component: LinkInputComponent,
    label: 'Link',
    displayLabel: 'Link Text',
    disableLabel: false,
    Element: LinkElement
  },
  {
    id: 'message',
    Component: MessageInputComponent,
    label: 'Message',
    displayLabel: 'Message',
    disableLabel: false,
    Element: MessageElement
  },
  {
    id: 'number',
    Component: TextInputComponent,
    label: 'Number',
    displayLabel: 'Label',
    disableLabel: false,
    Element: TextElement
  },
  {
    id: 'password',
    Component: TextInputComponent,
    label: 'Password',
    displayLabel: 'Label',
    disableLabel: false,
    Element: TextElement
  },
  {
    id: 'radio',
    Component: RadioInputComponent,
    label: 'Radio',
    displayLabel: 'Radio',
    disableLabel: true,
    Element: RadioElement
  },
  {
    id: 'select',
    Component: SelectInputComponent,
    label: 'Select',
    displayLabel: 'Label',
    disableLabel: false,
    Element: SelectElement
  },
  {
    id: 'telephone',
    Component: TextInputComponent,
    label: 'Telephone',
    displayLabel: 'Label',
    disableLabel: false,
    Element: TextElement
  },
  {
    id: 'text',
    Component: TextInputComponent,
    label: 'Text',
    displayLabel: 'Label',
    disableLabel: false,
    Element: TextElement
  }
];

export const FormContext = createContext<FormContextType | undefined>(
  undefined
);

export const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      'label + &': {
        marginTop: theme.spacing(3)
      }
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.common.white,
      border: '1px solid #ced4da',
      fontSize: 16,
      width: '100%',
      padding: '5px 8px',
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"'
      ].join(',')
    }
  })
)(InputBase);
