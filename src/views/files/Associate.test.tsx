import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeServer } from '../../server';
import FileAssociate from './Associate';
import { File } from '../../@types/file';

let server: any;

beforeEach(() => {
  server = makeServer();
});

afterEach(() => {
  server.shutdown();
});

const getFile = (memberId?: string): File => ({
  id: 1,
  fileId: '123-456-789',
  fileName: 'test.png',
  filePath: 'path',
  fileMimetype: 'image/png',
  memberId: memberId || '',
  sendUserId: '0001',
  dateUploaded: Date.now().toString(),
  dateLastAccessed: Date.now().toString(),
  chatId: '0002'
});

const mockedSetOpen = jest.fn();
const mockedUpdateData = jest.fn();
const mockedHandleTableDisplay = jest.fn();

const setup = () => {
  const dataToEdit = getFile();
  render(
    <FileAssociate
      data={dataToEdit}
      setOpen={mockedSetOpen}
      updateData={mockedUpdateData}
      handleTableDisplay={mockedHandleTableDisplay}
    />
  );

  const title = screen.getByText(/Associate file/i);
  const input = screen.getByPlaceholderText(/Enter Insurance ID/i);
  const cancelButton = screen.getByRole('button', {
    name: /cancel/i
  });
  const closeIcon = screen.getByTestId('CloseIcon');
  const submitButton = screen.getByRole('button', {
    name: /submit/i
  });

  return {
    title,
    input,
    cancelButton,
    closeIcon,
    submitButton,
    ...screen
  };
};

test('Renders with no crashing', () => {
  const { title } = setup();
  expect(title).toBeInTheDocument();
});

test('Should call updateData when user enters insurance ID input', () => {
  const { input } = setup();
  userEvent.type(input, '987654');
  expect(mockedUpdateData).toHaveBeenCalled();
});

test('Should close drawer when user clicks on cancel', () => {
  const { cancelButton } = setup();
  userEvent.click(cancelButton);
  expect(mockedSetOpen).toHaveBeenCalled();
});

test('Should call setOpen when user clicks on x icon', () => {
  const { closeIcon } = setup();
  userEvent.click(closeIcon);
  expect(mockedSetOpen).toHaveBeenCalled();
});

test('Submit button should be disabled if no changes and after file association is submitted', () => {
  const dataToEdit = getFile('123');
  render(
    <FileAssociate
      data={dataToEdit}
      setOpen={mockedSetOpen}
      updateData={mockedUpdateData}
      handleTableDisplay={mockedHandleTableDisplay}
    />
  );
  const input = screen.getByPlaceholderText(/Enter Insurance ID/i);
  userEvent.type(input, '4');
  const submitButton = screen.getByRole('button', {
    name: /submit/i
  });
  userEvent.click(submitButton);
  expect(submitButton).toBeDisabled();
});
