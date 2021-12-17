import '@testing-library/jest-dom';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { Provider, ReactReduxContext } from 'react-redux';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import userEvent from '@testing-library/user-event';

import { store } from '../../redux/store';
import { ChatSession, Message, ChatSessionStatus } from '../../@types/support';
import ChatStatus from './ChatStatus';
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
  const mockCallback = jest.fn();

  render(
    <Provider store={store} context={ReactReduxContext}>
      <Router history={history}>
        <ChatStatus session={mockChatSession} callback={mockCallback} />
      </Router>
    </Provider>
  );

  const openChatSymbol = screen.getByText(/Status: Open/i);
  return {
    openChatSymbol,
    ...screen
  };
};

test('should display Open for Chat', () => {
  const { openChatSymbol } = setup();
  expect(openChatSymbol).toBeInTheDocument();
});

test('simulate user closing a Chat', () => {
  const mockChatSession = getMockChatSession();
  const history = createMemoryHistory();
  const mockCallback = jest.fn();
  const mockHistoryPush = jest.fn();

  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
      push: mockHistoryPush
    })
  }));
  render(
    <Provider store={store} context={ReactReduxContext}>
      <Router history={history}>
        <ChatStatus session={mockChatSession} callback={mockCallback} />
      </Router>
    </Provider>
  );
  const svgFile = screen.getByTestId('ExpandMoreIcon');
  userEvent.click(svgFile);

  const closeChat = screen.getByRole('button', {
    name: /Close Chat/i
  });

  userEvent.click(closeChat);
  waitFor(() => expect(mockHistoryPush.mock.calls.length).toEqual(1));
});
