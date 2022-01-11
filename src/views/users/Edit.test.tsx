import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeServer } from '../../server';
import EditUser from './Edit';
import { testOrg, getUserWithOrgAndGroup } from '../../tests/UsersMockData';

let server: any;

beforeEach(() => {
  server = makeServer();
});

afterEach(() => {
  server.shutdown();
});

const testUser = getUserWithOrgAndGroup(false, false);

const users = {
  users: [testUser],
  paginationToken: '1'
};

const mockedSetEditView = jest.fn();
const mockedSetUser = jest.fn();
const mockedSetUsers = jest.fn();
const mockedHandleClick = jest.fn();

const mockEnqueue = jest.fn();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueue
  })
}));

const setup = () => {
  render(
    <EditUser
      user={testUser}
      users={users}
      setEditView={mockedSetEditView}
      setUser={mockedSetUser}
      setUsers={mockedSetUsers}
      handleClick={mockedHandleClick}
      organizations={[testOrg]}
    />
  );

  const firstNameInput = screen.getByLabelText(/First name/i);
  const lastNameInput = screen.getByLabelText(/Last name/i);
  const organizationInput = screen.getByLabelText(/Organization/i);
  const roleInput = screen.getByLabelText(/Role/i);

  return {
    firstNameInput,
    lastNameInput,
    organizationInput,
    roleInput,
    ...screen
  };
};

test('Should call setUser when user name is entered', () => {
  const { firstNameInput } = setup();
  userEvent.type(firstNameInput, 'Jenna');
  expect(mockedSetUser).toHaveBeenCalled();
});

test('Should call setUser when user last name is entered', () => {
  const { lastNameInput } = setup();
  userEvent.type(lastNameInput, 'Springer');
  expect(mockedSetUser).toHaveBeenCalled();
});

test('Should call setUser when new organization is selected', async () => {
  const { organizationInput } = setup();
  fireEvent.mouseDown(organizationInput);
  await waitFor(() => {
    const options = screen.getByRole('listbox');
    expect(options).toBeInTheDocument();
  });
  fireEvent.click(screen.getByText('Fake Org'));
  expect(mockedSetUser).toHaveBeenCalled();
});

test('Should call setUser when new role is selected', async () => {
  const { roleInput } = setup();
  fireEvent.mouseDown(roleInput);
  await waitFor(() => {
    const options = screen.getByRole('listbox');
    expect(options).toBeInTheDocument();
  });
  fireEvent.click(screen.getByText('Supervisor'));
  expect(mockedSetUser).toHaveBeenCalled();
});

test('Save button should be disabled if nothing has been edited', () => {
  const { firstNameInput } = setup();
  const saveButton = screen.getByRole('button', {
    name: /Save changes/i
  });
  expect(saveButton).toBeDisabled();

  userEvent.type(firstNameInput, 'Jenna');
  expect(saveButton).not.toBeDisabled();
});

test('Should call setUsers when save button is clicked', () => {
  const { firstNameInput } = setup();
  userEvent.type(firstNameInput, 'Jenna');
  const saveButton = screen.getByRole('button', {
    name: /Save changes/i
  });
  expect(saveButton).not.toBeDisabled();
  fireEvent.click(saveButton);
  expect(mockedSetUser).toHaveBeenCalled();
});

test('Disable user button should open a confirmation modal', async () => {
  setup();
  const disableButton = screen.getByRole('button', {
    name: /Disable User/i
  });
  expect(disableButton).toBeInTheDocument();
  fireEvent.click(disableButton);
  const confirmButton = await screen.getByRole('button', {
    name: /Confirm/i
  });
  expect(confirmButton).toBeInTheDocument();
});

test('Confirmation modal should call setUser', async () => {
  setup();
  const disableButton = screen.getByRole('button', {
    name: /Disable User/i
  });
  fireEvent.click(disableButton);

  const confirmButton = await screen.getByRole('button', {
    name: /Confirm/i
  });
  fireEvent.click(confirmButton);
  waitFor(() => expect(mockedSetUser).toHaveBeenCalled());
});

test('Cancel modal should call handleClick', async () => {
  setup();
  const disableButton = screen.getByRole('button', {
    name: /Disable User/i
  });
  fireEvent.click(disableButton);

  const cancelButton = await screen.getByRole('button', {
    name: /Cancel/i
  });
  fireEvent.click(cancelButton);
  waitFor(() => expect(mockedHandleClick).toHaveBeenCalled());
});

test('Should open a drawer when user selects create organization', async () => {
  const { organizationInput } = setup();
  fireEvent.mouseDown(organizationInput);
  await waitFor(() => {
    const options = screen.getByRole('listbox');
    expect(options).toBeInTheDocument();
  });
  const createOrgOption = screen.getByText('Create Organization');
  fireEvent.mouseDown(createOrgOption);
  waitFor(() =>
    expect(screen.getByPlaceholderText(/organization/i)).toBeInTheDocument()
  );
});
