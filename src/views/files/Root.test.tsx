import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { makeServer } from '../../server';
import Files from './Root';
import userEvent from '@testing-library/user-event';

let server: any;

beforeEach(() => {
  server = makeServer();
});

afterEach(() => {
  server.shutdown();
});

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush
  })
}));

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ token: () => 'blah' })
}));

const setup = () => {
  server.create('file', {
    id: 1,
    fileId: '123-456-789',
    fileName: 'test.png',
    filePath: 'path',
    fileMimetype: 'image/png',
    memberId: '123',
    sendUserId: '0001',
    dateUploaded: Date.now().toString(),
    dateLastAccessed: Date.now().toString(),
    chatId: '0002'
  });
  render(
    <MemoryRouter>
      <HelmetProvider>
        <Files />
      </HelmetProvider>
    </MemoryRouter>
  );

  const filesWords = screen.getAllByText(/Files/i);

  return {
    filesWords,
    ...screen
  };
};

test('Renders with no crashing', async () => {
  const { filesWords } = setup();
  expect(filesWords).toHaveLength(2);

  const grid = await screen.findByRole('grid');
  expect(grid).toBeInTheDocument();

  const fileId = await screen.getByText(/test.png/i);
  expect(fileId).toBeInTheDocument();
});

test('A drawer should open when clicked on "Associate" button', async () => {
  setup();
  await screen.findByRole('grid');
  const associateButton = await screen.getByRole('button', {
    name: /associate/i
  });
  expect(associateButton).toBeInTheDocument();

  fireEvent.click(associateButton);

  await waitFor(() =>
    expect(screen.getByText(/Associate file/i)).toBeInTheDocument()
  );
});

test('The table should display new associated id after submitting form', async () => {
  setup();
  await screen.findByRole('grid');
  const associateButton = await screen.getByRole('button', {
    name: /associate/i
  });
  fireEvent.click(associateButton);
  await waitFor(() =>
    expect(screen.getByText(/Associate file/i)).toBeInTheDocument()
  );

  const idInput = screen.getByPlaceholderText(/Enter Medicaid ID/i);
  userEvent.type(idInput, '99999');

  const submitButton = screen.getByRole('button', {
    name: /submit/i
  });
  fireEvent.click(submitButton);
  await waitForElementToBeRemoved(() => screen.queryByText(/Associate file/i));
  const fileId = await screen.getByText(/99999/i);
  expect(fileId).toBeInTheDocument();
});

test('A modal should open when clicked on "Delete" button', async () => {
  setup();
  await screen.findByRole('grid');
  const deleteButton = await screen.getByRole('button', {
    name: /delete/i
  });
  expect(deleteButton).toBeInTheDocument();
  fireEvent.click(deleteButton);
  await waitFor(() => {
    expect(screen.getByText(/want to delete/i)).toBeInTheDocument();
  });
});

test('Row should be deleted', async () => {
  setup();
  await screen.findByRole('grid');
  const deleteButton = await screen.getByRole('button', {
    name: /delete/i
  });
  fireEvent.click(deleteButton);
  await waitFor(() => {
    expect(screen.getByText(/want to delete/i)).toBeInTheDocument();
  });

  const confirmButton = screen.getByText(/confirm/i);
  expect(confirmButton).toBeInTheDocument();
  fireEvent.click(confirmButton);

  await waitForElementToBeRemoved(() => screen.queryByText(/want to delete/i));
  const fileId = await screen.queryByText(/test.png/i);
  expect(fileId).toBeNull();
});

test('Row should exist if selected cancel', async () => {
  setup();
  await screen.findByRole('grid');
  const deleteButton = await screen.getByRole('button', {
    name: /delete/i
  });
  fireEvent.click(deleteButton);
  await waitFor(() => {
    expect(screen.getByText(/want to delete/i)).toBeInTheDocument();
  });

  const cancelButton = screen.getByText(/cancel/i);
  expect(cancelButton).toBeInTheDocument();
  fireEvent.click(cancelButton);

  await waitForElementToBeRemoved(() => screen.queryByText(/want to delete/i));
  const fileId = await screen.getByText(/test.png/i);
  expect(fileId).toBeInTheDocument();
});

test('A new tab should open when clicked on "View" button', async () => {
  setup();
  const grid = await screen.findByRole('grid');
  expect(grid).toBeInTheDocument();

  window.open = jest.fn();
  const viewButton = await screen.getByRole('button', {
    name: /view/i
  });
  expect(viewButton).toBeInTheDocument();
  fireEvent.click(viewButton);
  waitFor(() => expect(window.open).toBeCalled());
});
