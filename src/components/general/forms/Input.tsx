import { ChangeEvent, useCallback } from 'react';
import {
  IconButton,
  Card,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardActionArea,
  Container
} from '@material-ui/core';
import { motion } from 'framer-motion';

import { makeStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import { INPUT_TYPES, useFormInput } from '../../../hooks/useForm';
import {
  Input,
  TypeInputComponent,
  InputEvent,
  OptionsInput
} from '../../../@types/form';

const useStyles = makeStyles((theme) => ({
  selected: {
    backgroundColor: theme.palette.primary.main,
    width: '1rem'
  }
}));

interface Props {
  disabled?: boolean;
  order: number;
  selected: boolean;
  onSelect: () => void;
  onInsertAfter: () => void;
  onDelete: () => void;
}

export default function InputComponent({
  disabled,
  order,
  selected,
  onSelect,
  onInsertAfter,
  onDelete
}: Props) {
  const classes = useStyles();
  const [input, setInput] = useFormInput(order);

  const handleTypeChange = useCallback(
    (event: ChangeEvent<InputEvent>) => {
      const type = event.target.value;
      const nextInput: Input = { ...input, type };

      if (type === 'radio' || type === 'select') {
        (nextInput as OptionsInput).options = ['Option 1'];
      } else if (type === 'link') {
        (nextInput as OptionsInput).options = [''];
      } else if (
        !type.match(
          new RegExp(
            'text|checkbox|divider|email|number|password|telephone|message'
          )
        )
      ) {
        throw new Error('Invalid type change.');
      }

      const changedInput = INPUT_TYPES.find(
        (item: TypeInputComponent) => item.id === type
      );
      if (!changedInput) {
        throw new Error('Input is not a valid type');
      }
      nextInput.label = changedInput.label;

      setInput(nextInput);
    },
    [input, setInput]
  );

  const inputComponent = INPUT_TYPES.find(
    (i: TypeInputComponent) => i.id === input.type
  );

  if (!inputComponent) {
    throw new Error('Input is not a valid type');
  }

  const TypeInputComponent = inputComponent.Component;

  const children = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <TextField
          disabled={inputComponent.disableLabel}
          variant="outlined"
          label={inputComponent.displayLabel}
          onChange={(e) => setInput({ ...input, label: e.target.value })}
        />
        <FormControl variant="outlined" sx={{ marginLeft: '2rem' }}>
          <InputLabel id={`input-type-${order}-label`}>Type</InputLabel>
          <Select
            disabled={disabled}
            labelId={`input-type-${order}-label`}
            id={`input-type-${order}`}
            value={input.type}
            onChange={handleTypeChange}
          >
            {INPUT_TYPES.map((input, index) => (
              <MenuItem value={input.id} key={index}>
                {input.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ marginTop: '1.5rem' }}>
        <TypeInputComponent input={input} onChangeInput={setInput} />
      </Box>
    </>
  );

  if (selected) {
    return (
      <Box position="relative">
        <Card sx={{ display: 'flex', flexDirection: 'row', zIndex: 1 }}>
          <div className={classes.selected} />
          <Container sx={{ padding: '1.5rem' }}>{children}</Container>
        </Card>
        <Card
          sx={{
            marginLeft: '1rem',
            position: 'absolute',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            top: '1rem',
            zIndex: 0
          }}
          component={motion.div}
          initial={{ opacity: 0, right: 0 }}
          animate={{ opacity: 1, right: -64 }}
          exit={{ opacity: 0, right: 0 }}
          transition={{ duration: 0.5 }}
        >
          <IconButton
            disabled={disabled}
            color="primary"
            size="small"
            onClick={onInsertAfter}
          >
            <AddIcon />
          </IconButton>
          {order > 0 && (
            <IconButton
              sx={{ marginTop: '1rem' }}
              color="primary"
              size="small"
              disabled={disabled}
              onClick={onDelete}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Card>
      </Box>
    );
  }

  return (
    <Card sx={{ display: 'flex', flexDirection: 'row' }}>
      {selected && <div className={classes.selected} />}
      <CardActionArea
        sx={{ padding: '1.5rem' }}
        onClick={onSelect}
        disableRipple={selected}
      >
        {children}
      </CardActionArea>
    </Card>
  );
}
