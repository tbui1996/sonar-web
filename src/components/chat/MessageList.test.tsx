import '@testing-library/jest-dom';
import { render, screen, cleanup } from '@testing-library/react';
import { Provider, ReactReduxContext } from 'react-redux';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { store } from '../../redux/store';
import { ChatSession, Message, ChatSessionStatus } from '../../@types/support';
import MessageList from './MessageList';
import { User } from '../../@types/users';

let windowSpy: any;

beforeEach(() => {
  windowSpy = jest.spyOn(window, 'window', 'get');
});

afterEach(() => {
  windowSpy.mockRestore();
});

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
  const history = createMemoryHistory();
  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  render(
    <Provider store={store} context={ReactReduxContext}>
      <Router history={history}>
        <MessageList session={mockChatSession} />
      </Router>
    </Provider>
  );

  const messageTimestamp = screen.getByText(/7:00 pm/i);
  const fileSent = screen.getByText(
    'tom sent new file(s) to you'
  ) as HTMLElement;
  const viewButton = screen.getByRole('button', {
    name: /View/i
  });
  return {
    messageTimestamp,
    fileSent,
    viewButton,
    ...screen
  };
};

test('displays messageTimestamp without crashing', () => {
  const { messageTimestamp } = setup();
  expect(messageTimestamp).toBeInTheDocument();
});

test('displays file upload text message without crashing', () => {
  const { fileSent } = setup();
  expect(fileSent).toBeInTheDocument();
});

test('display View Button without crashing', () => {
  const { viewButton } = setup();
  expect(viewButton).toBeInTheDocument();
});

it('should return https://example.com', () => {
  windowSpy.mockImplementation(() => ({
    location: {
      origin: 'https://example.com'
    }
  }));
  expect(window.location.origin).toEqual('https://example.com');
});

it('should be undeined', () => {
  windowSpy.mockImplementation(() => undefined);

  expect(window).toBeUndefined();
});
