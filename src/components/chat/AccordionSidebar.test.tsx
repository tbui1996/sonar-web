import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { makeServer } from '../../server';
import AccordionSideBar from './AccordionSidebar';
import { ChatSession, Message, ChatSessionStatus } from '../../@types/support';

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

  return {
    status: ChatSessionStatus.HYDRATED,
    messages: [mockMessage],
    hasUnreadMessages: true,
    user: undefined,
    ID: '1',
    userID: '1',
    createdTimestamp: 23,
    internalUserID: '1',
    chatOpen: true,
    topic: 'a',
    notes: notesValue,
    pending: false
  };
};

const setup = () => {
  const mockChatSession = getMockChatSession('');
  render(<AccordionSideBar activeSession={mockChatSession} />);

  const accordionButton = screen.getByTestId('notes-accordion');

  return {
    accordionButton,
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

  const notesText = screen.getAllByText(/notes/i);
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
