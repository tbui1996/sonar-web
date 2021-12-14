import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeServer } from '../../server';
import AccordionSideBar from './AccordionSidebar';
import { ChatSession, Message, ChatSessionStatus } from '../../@types/support';
import { User } from '../../@types/users';

let server: any;

beforeEach(() => {
  server = makeServer();
});

afterEach(() => {
  server.shutdown();
});

const getMockChatSession = (notesValue: string): ChatSession => {
  const mockMessage: Message = {
    id: '1',
    sessionID: '1',
    senderID: '1',
    message: '1',
    createdTimestamp: 23,
    fileID: null
  };

  const mockUserInterface: User = {
    username: 'hello',
    email: 'hello@circulohealth.com',
    firstName: 'thomas',
    lastName: 'bui',
    organization: 'abcd',
    group: 'b',
    sub: 'wrold',
    displayName: 'tom'
  };

  return {
    status: ChatSessionStatus.HYDRATED,
    messages: [mockMessage],
    hasUnreadMessages: true,
    user: mockUserInterface,
    ID: '1',
    userID: '1',
    createdTimestamp: 23,
    internalUserID: '1',
    chatOpen: true,
    topic: 'aasdfklqadslkmq',
    notes: 'hello',
    pending: false
  };
};

const setup = () => {
  const mockChatSession = getMockChatSession('');
  render(<AccordionSideBar activeSession={mockChatSession} />);

  const accordionButton = screen.getByTestId('notes-accordion');
  const patientInfo = screen.getByText('Patient Information');
  const supervisorHeader = screen.getByText('Supervisors');
  const patientInfoGroup = screen.getByText('aasdfklqadslkmq', { exact: true });
  const documentsHeader = screen.getByText(/Documents/i);
  return {
    accordionButton,
    patientInfo,
    supervisorHeader,
    patientInfoGroup,
    documentsHeader,
    ...screen
  };
};

test('Notes accordion renders without crashing', () => {
  const { accordionButton } = setup();
  expect(accordionButton).toBeInTheDocument();
});

test('Expanding notes accordion should display a textfield with a default value of "Notes"', () => {
  const { accordionButton } = setup();
  fireEvent.click(accordionButton);

  const notesText = screen.getAllByText(/Notes/i);
  expect(notesText).toHaveLength(3); // MUI textFields have two labels state + default value
});

test('Expanding notes accordion should display a textfield with a default value of "hello"', () => {
  const mockChatSession = getMockChatSession('hello');
  render(<AccordionSideBar activeSession={mockChatSession} />);
  const accordionButton = screen.getByTestId('notes-accordion');
  fireEvent.click(accordionButton);

  const helloText = screen.getByText(/hello/i);
  expect(helloText).toBeInTheDocument();
});

test('Should be able to enter notes', () => {
  const { accordionButton } = setup();
  fireEvent.click(accordionButton);

  const notesInput = screen.getByTestId('notes-input') as HTMLInputElement;
  fireEvent.change(notesInput, { target: { value: '41' } });
  expect(notesInput.value).toBe('41');
});

test('Patient Information text renders', () => {
  const { patientInfo } = setup();
  expect(patientInfo).toHaveTextContent('Patient Information');
});

test('Supervisors header text renders', () => {
  const { supervisorHeader } = setup();
  expect(supervisorHeader).toBeInTheDocument();
});

test('Renders Patient Information Group', () => {
  const { patientInfoGroup } = setup();
  expect(patientInfoGroup).toBeInTheDocument();
});

test('Documents Header loads', () => {
  const { documentsHeader } = setup();
  expect(documentsHeader).toBeInTheDocument();
});

test('Click View files on dashboard link redirects to https://doppler.circulo.dev/apps/Circulator-Latest', async () => {
  const mockHistoryPush = jest.fn();
  const mockChatSession = getMockChatSession('');

  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
      push: mockHistoryPush
    })
  }));
  render(<AccordionSideBar activeSession={mockChatSession} />);

  const viewFilesOnDopplerDashboard = await waitFor(() =>
    screen.getByText(/View files on Doppler Dashboard/i)
  );
  userEvent.click(viewFilesOnDopplerDashboard);
  waitFor(() =>
    expect(mockHistoryPush).toHaveBeenCalledWith('/apps/Circulator-Latest')
  );
});
