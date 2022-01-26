import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { makeServer } from '../../server';
import UploadFile from './UploadFile';

let server: any;

beforeEach(() => {
  server = makeServer();
});

afterEach(() => {
  server.shutdown();
});

const setup = () => {
  render(<UploadFile />);

  const buttonText = screen.getByText(/Upload File/i);
  const openButton = screen.getByRole('button', {
    name: /openModal/i
  });

  return { buttonText, openButton, ...screen };
};

test('Renders without crashing', () => {
  const { buttonText } = setup();
  expect(buttonText).toBeInTheDocument();
});

test('Click upload file button should open modal', () => {
  const { openButton } = setup();
  fireEvent.click(openButton);

  waitFor(() =>
    expect(screen.getAllByText(/Choose file to upload/i)).toBeInTheDocument()
  );
});

test('Click upload button should upload file', () => {
  const { openButton } = setup();
  fireEvent.click(openButton);

  waitFor(() =>
    expect(screen.getAllByText(/Choose file to upload/i)).toBeInTheDocument()
  );

  // here we are mocking a fake file
  const inputEl = screen.getByTestId('fileinput');
  const file = new File(['file'], 'ping.json', {
    type: 'application/json'
  });
  Object.defineProperty(inputEl, 'files', {
    value: [file]
  });
  // mock dropping the fake file in react dropzone
  fireEvent.drop(inputEl);
  // waiting to see if the filename shows up in the modal after the file is dropped
  waitFor(() => expect(screen.findByText('ping.json')).toBeInTheDocument());

  const uploadButton = screen.getByRole('button', {
    name: /upload/i
  });

  fireEvent.click(uploadButton);
  waitForElementToBeRemoved(() => screen.queryByText(/Choose file to upload/i));
});

test('Click cancel button should close modal', () => {
  const { openButton } = setup();
  fireEvent.click(openButton);

  waitFor(() =>
    expect(screen.getAllByText(/Choose file to upload/i)).toBeInTheDocument()
  );

  const cancelButton = screen.getByRole('button', {
    name: /cancel/i
  });

  fireEvent.click(cancelButton);
  waitForElementToBeRemoved(() => screen.queryByText(/Choose file to upload/i));
});
