import { ChangeEvent, SyntheticEvent, useCallback, ElementType } from 'react';
import {
  IconButton,
  Card,
  TextField,
  Typography,
  Box,
  Radio,
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

import { useFormInput, Input, OptionsInput } from '../../../hooks/useForm';

function isOptionsInput(input: Input): input is OptionsInput {
  return (
    (input as OptionsInput).options &&
    Array.isArray((input as OptionsInput).options)
  );
}

interface InputProps {
  disabled?: boolean;
  input: Input;
  onChangeInput: (value: Input) => void;
}

function TextInputComponent({ disabled, input, onChangeInput }: InputProps) {
  return <Typography>The provider will enter text.</Typography>;
}

interface OptionsInputProps extends InputProps {
  IndicatorComponent: ElementType;
}

function OptionsInputComponent({
  disabled,
  input,
  onChangeInput,
  IndicatorComponent
}: OptionsInputProps) {
  if (!isOptionsInput(input)) {
    return <Box>Expected OptionsInput</Box>;
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const nextOptions = [...input.options];
    nextOptions.splice(index, 1, e.target.value);

    onChangeInput({ ...input, options: nextOptions } as OptionsInput);
  };

  const handleAddOption = () => {
    onChangeInput({
      ...input,
      options: [...input.options, `Option ${input.options.length + 1}`]
    } as OptionsInput);
  };

  const handleDelete = (index: number) => {
    const nextOptions = [...input.options];
    nextOptions.splice(index, 1);
    onChangeInput({
      ...input,
      options: nextOptions
    } as OptionsInput);
  };

  return (
    <Box>
      {input.options.map((option, index) => (
        <Box
          key={index}
          sx={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}
        >
          <IndicatorComponent option={option} index={index} />
          <TextField
            disabled={disabled}
            value={option}
            onChange={(e) => handleChange(e, index)}
            sx={{ marginLeft: '1rem' }}
          />
          {index > 0 && (
            <IconButton onClick={() => handleDelete(index)} disabled={disabled}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      ))}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <IconButton
          color="primary"
          size="medium"
          onClick={handleAddOption}
          disabled={disabled}
        >
          <AddIcon />
        </IconButton>
        <Typography sx={{ marginLeft: '1rem' }}>Add another option.</Typography>
      </Box>
    </Box>
  );
}

function RadioInputComponent({ disabled, input, onChangeInput }: InputProps) {
  return (
    <OptionsInputComponent
      disabled={disabled}
      input={input}
      onChangeInput={onChangeInput}
      IndicatorComponent={Radio}
    />
  );
}

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

function SelectInputComponent({ disabled, input, onChangeInput }: InputProps) {
  return (
    <OptionsInputComponent
      disabled={disabled}
      input={input}
      onChangeInput={onChangeInput}
      IndicatorComponent={SelectPrefix}
    />
  );
}

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
    (
      event: ChangeEvent<{
        name?: string | undefined;
        value: 'select' | 'text' | 'radio';
        event: Event | SyntheticEvent<Element, Event>;
      }>
    ) => {
      const type = event.target.value;
      const nextInput: Input = { ...input, type };

      if (type === 'radio' || type === 'select') {
        (nextInput as OptionsInput).options = ['Option 1'];
      } else if (type !== 'text') {
        throw new Error('Invalid type change.');
      }

      setInput(nextInput);
    },
    [input, setInput]
  );

  let TypeInputComponent = TextInputComponent;
  switch (input.type) {
    case 'select':
      TypeInputComponent = SelectInputComponent;
      break;
    case 'radio':
      TypeInputComponent = RadioInputComponent;
      break;
    default:
      break;
  }

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
          disabled={disabled}
          variant="outlined"
          label="Question"
          value={input.label}
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
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="radio">Radio</MenuItem>
            <MenuItem value="select">Select</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ marginTop: '1.5rem' }}>
        <TypeInputComponent
          disabled={disabled}
          input={input}
          onChangeInput={setInput}
        />
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
