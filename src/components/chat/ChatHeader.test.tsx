import '@testing-library/jest-dom';
import { render, screen, cleanup } from '@testing-library/react';
import { ChatSession, Message, ChatSessionStatus } from '../../@types/support';
import ChatHeader from './ChatHeader';
import { User } from '../../@types/users';

afterEach(cleanup);

const getMockChatSession = (): ChatSession => {
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
    topic: 'a',
    notes: 'hello',
    pending: false
  };
};

const setup = () => {
  const mockChatSession = getMockChatSession();
  render(<ChatHeader session={mockChatSession} />);

  const chatHeader = screen.getByText(/tom/i);
  const chatOrg = screen.getByText(/abcd/i);
  return {
    chatHeader,
    chatOrg,
    ...screen
  };
};

test('renders chatHeader without crashing', () => {
  const { chatHeader } = setup();
  expect(chatHeader).toBeInTheDocument();
});

test('organization should display in chat header', () => {
  const { chatOrg } = setup();
  expect(chatOrg).toBeInTheDocument();
});
