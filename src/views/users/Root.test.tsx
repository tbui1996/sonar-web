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
import userEvent from '@testing-library/user-event';
import { makeServer } from '../../server';
import UserRoles from './Root';
import { testOrg, getUserWithOrgAndGroup } from '../../tests/UsersMockData';

let server: any;

beforeEach(() => {
  server = makeServer();
});

afterEach(() => {
  server.shutdown();
});

const mockEnqueue = jest.fn();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueue
  })
}));

const testUser = getUserWithOrgAndGroup(true, true);

const setup = () => {
  server.create('user', testUser);
  server.create('organization', testOrg);
  render(
    <MemoryRouter>
      <HelmetProvider>
        <UserRoles />
      </HelmetProvider>
    </MemoryRouter>
  );

  const usersWords = screen.getAllByText(/Users/i);

  return {
    usersWords,
    ...screen
  };
};

test('Renders with no crashing', async () => {
  const { usersWords } = setup();
  expect(usersWords).toHaveLength(2);

  const columnHeader = await screen.findByText(/Organization/i);
  expect(columnHeader).toBeInTheDocument();

  const rowUserFullName = await screen.findByText(/John Smith/i);
  expect(rowUserFullName).toBeInTheDocument();
});

test('Should render Edit view when edit icon is clicked', async () => {
  setup();

  const columnHeader = await screen.findByText(/Role/i);
  expect(columnHeader).toBeInTheDocument();

  const editIcon = await screen.getByLabelText('edit');
  expect(editIcon).toBeInTheDocument();

  fireEvent.click(editIcon);

  await waitFor(() => {
    const disableButton = screen.getByRole('button', {
      name: /Disable User/i
    });
    expect(disableButton).toBeInTheDocument();
  });
});

test('Should update name on users table after submitting form', async () => {
  setup();
  await screen.findByText(/Role/i);
  const editIcon = await screen.getByLabelText('edit');
  fireEvent.click(editIcon);

  await waitFor(() => {
    const disableButton = screen.getByRole('button', {
      name: /Disable User/i
    });
    expect(disableButton).toBeInTheDocument();
  });

  const firstNameInput = screen.getByLabelText(/First name/i);
  expect(firstNameInput).toBeInTheDocument();

  userEvent.clear(firstNameInput);
  userEvent.type(firstNameInput, 'Johnyyy');
  const saveButton = screen.getByRole('button', {
    name: /Save changes/i
  });
  expect(saveButton).toBeInTheDocument();
  expect(saveButton).not.toBeDisabled();
  fireEvent.click(saveButton);

  await waitForElementToBeRemoved(() => screen.queryByText(/Save Changes/i));
  const updatedName = await screen.findByText(/Johnyyy/i);
  expect(updatedName).toBeInTheDocument();
});

test('Should update role on when user is revoked', async () => {
  setup();
  await screen.findByText(/Role/i);
  const editIcon = await screen.getByLabelText('edit');
  fireEvent.click(editIcon);
  await waitFor(() => {
    const disableButton = screen.getByRole('button', {
      name: /Disable User/i
    });
    expect(disableButton).toBeInTheDocument();
  });

  const disableButton = await screen.getByRole('button', {
    name: /Disable User/i
  });
  expect(disableButton).toBeInTheDocument();
  fireEvent.click(disableButton);

  const confirmButton = await screen.getByRole('button', {
    name: /Confirm/i
  });

  fireEvent.click(confirmButton);
  await waitForElementToBeRemoved(() => screen.queryByText(/Are you sure/i));
  const updatedRole = await screen.findByText('-');
  expect(updatedRole).toBeInTheDocument();
});

test('Cancel button should switch out of edit mode', async () => {
  setup();
  await screen.findByText(/Role/i);
  const editIcon = await screen.getByLabelText('edit');
  fireEvent.click(editIcon);
  await waitFor(() => {
    const disableButton = screen.getByRole('button', {
      name: /Disable User/i
    });
    expect(disableButton).toBeInTheDocument();
  });
  const cancelButton = screen.getByRole('button', {
    name: /Cancel/i
  });
  fireEvent.click(cancelButton);
  expect(screen.queryByText(/Disable user/i)).not.toBeInTheDocument();
});
