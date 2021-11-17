import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LinkInputComponent from './LinkInputComponent';
import { Input } from '../../@types/form';

const inputProp: Input = {
  id: 1,
  label: 'Enter a text',
  order: 0,
  type: 'text'
};

const setup = () => {
  const mockedFunction = jest.fn();
  render(
    <LinkInputComponent input={inputProp} onChangeInput={mockedFunction} />
  );

  const input = screen.getByRole('textbox');
  const helperText = screen.getByText(/The provider will be directed/i);

  return {
    input,
    helperText,
    mockedFunction,
    ...screen
  };
};

test('Link input contains helper text', () => {
  const { helperText } = setup();
  expect(helperText).toBeInTheDocument();
});

test('Function prop is called on input', async () => {
  const { input, mockedFunction } = setup();
  userEvent.type(input, 'test');
  expect(mockedFunction).toHaveBeenCalled();
});

afterAll(() => {
  jest.clearAllMocks();
});
