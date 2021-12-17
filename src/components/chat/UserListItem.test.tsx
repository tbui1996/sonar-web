import React from 'react';
import '@testing-library/jest-dom';
import { screen, cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserListItem from './UserListItem';
import { ChatSession, Message, ChatSessionStatus } from '../../@types/support';
import { User } from '../../@types/users';

afterEach(cleanup);

const getMockChatSession = (): ChatSession => {
  const mockMessage: Message = {
    id: '1',
    sessionID: '1',
    senderID: '1',
    message: '1',
    createdTimestamp: 23,
    fileID: 'hello'
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
    hasUnreadMessages: false,
    user: mockUserInterface,
    ID: '1',
    userID: '1',
    createdTimestamp: 23,
    internalUserID: '1',
    chatOpen: true,
    topic: 'aasdfklqadslkmq',
    notes: 'yes',
    pending: false,
    lastMessageTimestamp: 25
  };
};

const mockOnOpenChat = jest.fn();

const setup = () => {
  const mockChatSession = getMockChatSession();
  const mockisActive = true;

  render(
    <UserListItem
      session={mockChatSession}
      isActive={mockisActive}
      onOpenChat={mockOnOpenChat}
      internalUserID="1"
    />
  );

  const displayName = screen.getByText(/tom/i);
  const email = screen.getByLabelText(/hello@circulohealth.com/i);
  const selectButton = screen.getByRole('button');
  const lastMessageTimestamp = screen.getByText(/52 years/i);
  return {
    displayName,
    email,
    selectButton,
    lastMessageTimestamp,
    ...screen
  };
};

test('name displays ', () => {
  const { displayName } = setup();
  expect(displayName).toBeInTheDocument();
});

test('email populates ', () => {
  const { email } = setup();
  expect(email).toBeInTheDocument();
});

test('test onOpenChat button works', () => {
  const { selectButton } = setup();
  userEvent.click(selectButton);
  expect(mockOnOpenChat).toHaveBeenCalled();
});

test('last message time stamp displays', () => {
  const { lastMessageTimestamp } = setup();
  expect(lastMessageTimestamp).toBeInTheDocument();
});
