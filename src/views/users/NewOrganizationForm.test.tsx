import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeServer } from '../../server';
import NewOrganizationForm from './NewOrganizationForm';
import { testOrg, getUserWithOrgAndGroup } from '../../tests/UsersMockData';

let server: any;

beforeEach(() => {
  server = makeServer();
});

afterEach(() => {
  server.shutdown();
});

const testUser = getUserWithOrgAndGroup(false, false);

const mockedhandleClose = jest.fn();
const mockedSetLoading = jest.fn();
const mockedSetOpen = jest.fn();
const mockedSetSelectedOrganizationID = jest.fn();
const mockedSetOrganizations = jest.fn();

const setup = () => {
  render(
    <NewOrganizationForm
      handleClose={mockedhandleClose}
      loading={false}
      setLoading={mockedSetLoading}
      user={testUser}
      setOpen={mockedSetOpen}
      setSelectedOrganizationID={mockedSetSelectedOrganizationID}
      organizations={[testOrg]}
      setOrganization={mockedSetOrganizations}
      organization={{
        id: 0,
        name: 'test'
      }}
    />
  );

  const formTitle = screen.getByText(/Create Organization/i);
  const createButton = screen.getByRole('button', {
    name: /Create/i
  });
  const cancelButton = screen.getByRole('button', {
    name: /Cancel/i
  });
  const organizationInput = screen.getByPlaceholderText(
    /Enter Organization name here/i
  );

  return {
    formTitle,
    createButton,
    cancelButton,
    organizationInput,
    ...screen
  };
};

test('Should render without crashing', () => {
  const { formTitle } = setup();
  expect(formTitle).toBeInTheDocument();
});

test('Should call setUser when user name is entered', () => {
  const { organizationInput } = setup();
  userEvent.type(organizationInput, 'test');
  expect(mockedSetOrganizations).toHaveBeenCalled();
});

test('Create button should be disabled as default', () => {
  const { createButton } = setup();
  expect(createButton).toBeInTheDocument();
  expect(createButton).toBeDisabled();
});

test('Create button should be disabled if organization input is empty', () => {
  const { createButton, organizationInput } = setup();
  userEvent.type(organizationInput, 'test');
  userEvent.clear(organizationInput);
  expect(createButton).toBeDisabled();
});

test('Create button should NOT be disabled if organization input is not empty', () => {
  const { createButton, organizationInput } = setup();
  userEvent.type(organizationInput, 'test');
  expect(createButton).not.toBeDisabled();
});

test('Cancel button should called handleClose', () => {
  const { cancelButton } = setup();
  fireEvent.click(cancelButton);
  expect(mockedhandleClose).toHaveBeenCalled();
});

test('Save button should call multiple functions', () => {
  const { createButton, organizationInput } = setup();
  userEvent.type(organizationInput, 'test');
  fireEvent.click(createButton);
  expect(mockedSetLoading).toHaveBeenCalled();
});
