import { Box, IconButton, TextField, Typography } from '@material-ui/core';
import { ChangeEvent, ElementType } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { Input, InputProps, OptionsInput } from '../../@types/form';

export interface OptionsInputProps extends InputProps {
  IndicatorComponent: ElementType;
}

function isOptionsInput(input: Input): input is OptionsInput {
  return (
    (input as OptionsInput).options &&
    Array.isArray((input as OptionsInput).options)
  );
}

export default function OptionsInputComponent({
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
          <IndicatorComponent option={option} index={index} disabled={true} />
          <TextField
            value={option}
            onChange={(e) => handleChange(e, index)}
            sx={{ marginLeft: '1rem' }}
          />
          {index > 0 && (
            <IconButton onClick={() => handleDelete(index)}>
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
        <IconButton color="primary" size="medium" onClick={handleAddOption}>
          <AddIcon />
        </IconButton>
        <Typography sx={{ marginLeft: '1rem' }}>Add another option.</Typography>
      </Box>
    </Box>
  );
}
