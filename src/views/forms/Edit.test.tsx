import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { makeServer } from '../../server';
import { Router, MemoryRouter } from 'react-router-dom';
import Edit from './Edit';

let server: any;

beforeEach(() => {
  server = makeServer();
});

afterEach(() => {
  server.shutdown();
});

const dataToEdit = {
  id: '1',
  title: 'Test Form',
  description: 'This is a test form'
};

const mockedSetOpen = jest.fn();
const mockedUpdateData = jest.fn();

const setup = () => {
  render(
    <Edit
      data={dataToEdit}
      setOpen={mockedSetOpen}
      updateData={mockedUpdateData}
    />
  );

  const title = screen.getByText(/Edit Form/i);
  const titleInput = screen.getByPlaceholderText(/Title/i);
  const descriptionInput = screen.getByPlaceholderText(/Description/i);
  const closeIcon = screen.getByTestId('CloseIcon');
  const saveButton = screen.getByRole('button', {
    name: /save/i
  });
  const cancelButton = screen.getByRole('button', {
    name: /cancel/i
  });
  const deleteButton = screen.getByRole('button', {
    name: /delete/i
  });

  return {
    title,
    titleInput,
    descriptionInput,
    closeIcon,
    saveButton,
    cancelButton,
    deleteButton,
    ...screen
  };
};

test('Renders with no crashing', () => {
  const { title } = setup();
  expect(title).toBeInTheDocument();
});

test('Should call updateData when user enters title input', () => {
  const { titleInput } = setup();
  userEvent.type(titleInput, 'New title');
  expect(mockedUpdateData).toHaveBeenCalled();
});

test('Should call updateData when user enters description input', () => {
  const { descriptionInput } = setup();
  userEvent.type(descriptionInput, 'New description');
  expect(mockedUpdateData).toHaveBeenCalled();
});

test('Should call setOpen when user clicks on cancel', () => {
  const { cancelButton } = setup();
  userEvent.click(cancelButton);
  expect(mockedSetOpen).toHaveBeenCalled();
});

test('Should call setOpen when user clicks on x icon', () => {
  const { closeIcon } = setup();
  userEvent.click(closeIcon);
  expect(mockedSetOpen).toHaveBeenCalled();
});

test('Save button should be disabled if no changes and after form edits are saved', () => {
  const { titleInput, saveButton } = setup();
  // save button should be disabled when no changes
  expect(saveButton).toBeDisabled();
  userEvent.type(titleInput, 'New title');
  // save button is active after input
  expect(saveButton).not.toBeDisabled();
  userEvent.click(saveButton);
  // save button is disabled on saving
  expect(saveButton).toBeDisabled();
});

test('Save button should be disabled if title input is empty', () => {
  render(
    <Edit
      data={{
        id: '1',
        title: '',
        description: 'This is a test form'
      }}
      setOpen={mockedSetOpen}
      updateData={mockedUpdateData}
    />
  );

  const saveButton = screen.getByRole('button', {
    name: /save/i
  });
  expect(saveButton).toBeDisabled();
});

test('Delete button should open a confirmation modal', () => {
  const { deleteButton } = setup();

  userEvent.click(deleteButton);
  const modalText = screen.getByText(/delete this form?/i);
  expect(modalText).toBeInTheDocument();
});

test('Cancel button in confirmation modal should take user back to edit form', () => {
  const { deleteButton } = setup();
  userEvent.click(deleteButton);
  const modalCancelButton = screen.getByRole('button', {
    name: /cancel/i
  });
  userEvent.click(modalCancelButton);
  const editFormTitle = screen.getByText(/Edit Form/i);
  expect(editFormTitle).toBeInTheDocument();
});

test('Confirm button in confirmation modal should call the handleTableDisplay function', () => {
  const mockedHandleTableDisplay = jest.fn();
  const history = createMemoryHistory();

  render(
    <Router history={history}>
      <Edit
        data={dataToEdit}
        setOpen={mockedSetOpen}
        updateData={mockedUpdateData}
        handleTableDisplay={mockedHandleTableDisplay}
      />
    </Router>
  );

  const deleteButton = screen.getByRole('button', {
    name: /delete/i
  });

  userEvent.click(deleteButton);
  const modalConfirmButton = screen.getByRole('button', {
    name: /confirm/i
  });

  userEvent.click(modalConfirmButton);
  waitFor(() => expect(mockedHandleTableDisplay).toHaveBeenCalled());
});

test('Should take to /dashboard/forms after deleting', () => {
  const mockedHandleTableDisplay = jest.fn();
  const mockHistoryPush = jest.fn();

  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
      push: mockHistoryPush
    })
  }));

  render(
    <MemoryRouter>
      <Edit
        data={dataToEdit}
        setOpen={mockedSetOpen}
        updateData={mockedUpdateData}
        handleTableDisplay={mockedHandleTableDisplay}
      />
    </MemoryRouter>
  );

  const deleteButton = screen.getByRole('button', {
    name: /delete/i
  });

  userEvent.click(deleteButton);
  const modalConfirmButton = screen.getByRole('button', {
    name: /confirm/i
  });

  userEvent.click(modalConfirmButton);
  waitFor(() =>
    expect(mockHistoryPush).toHaveBeenCalledWith('/dashboard/forms')
  );
});
