import '@testing-library/jest-dom';
import { render, screen, act, waitFor } from '@testing-library/react';
import { Provider, ReactReduxContext } from 'react-redux';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { unmountComponentAtNode } from 'react-dom';
import userEvent from '@testing-library/user-event';
import { store } from '../../redux/store';
import { ChatSession, Message, ChatSessionStatus } from '../../@types/support';
import ChatMessageBar from './ChatMessageBar';
import { User } from '../../@types/users';
import { AlertState } from '../../@types/alert';

let container: any;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

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
    topic: 'a',
    notes: 'hello',
    pending: false
  };
};
const mockUseWebsocket = jest.fn();
mockUseWebsocket.mockReturnValue({});

jest.mock('react-use-websocket', () => ({
  ReadyState: jest.requireActual('react-use-websocket').ReadyState,
  __esModule: true,
  default: () => ({
    sendJsonMessage: jest.fn(),
    readyState: 1
  })
}));

test('Chat bar shall say Type a Message', async () => {
  const history = createMemoryHistory();
  const mockChatSession = getMockChatSession();
  const mockAlertState: AlertState = {
    severity: 'success',
    open: true,
    message: 'hello'
  };
  const setAlertStateMock = jest.fn();
  const mockHistoryPush = jest.fn();

  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
      push: mockHistoryPush
    })
  }));

  act(() => {
    render(
      <Provider store={store} context={ReactReduxContext}>
        <Router history={history}>
          <ChatMessageBar
            activeSession={mockChatSession}
            loadingInitialState={false}
            messageSending={false}
            alertState={mockAlertState}
            setAlertState={setAlertStateMock}
          />
        </Router>
      </Provider>,
      container
    );
  });
  const placeholderText = screen.getByPlaceholderText(
    /Type a Message/i
  ) as HTMLElement;

  await waitFor(() => {
    expect(placeholderText).toBeInTheDocument();
  });
});

test('Upload File Button and send file displays correctly', () => {
  const history = createMemoryHistory();
  const mockChatSession = getMockChatSession();
  const mockAlertState: AlertState = {
    severity: 'success',
    open: true,
    message: 'hello'
  };
  const setAlertStateMock = jest.fn();
  const mockHistoryPush = jest.fn();

  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
      push: mockHistoryPush
    })
  }));

  act(() => {
    render(
      <Provider store={store} context={ReactReduxContext}>
        <Router history={history}>
          <ChatMessageBar
            activeSession={mockChatSession}
            loadingInitialState={false}
            messageSending={false}
            alertState={mockAlertState}
            setAlertState={setAlertStateMock}
          />
        </Router>
      </Provider>,
      container
    );
  });

  const toolTipButton = screen.getByRole('button', {
    name: /Upload File/i
  });
  const element = screen.getByTestId('AttachFileOutlinedIcon');
  userEvent.hover(element);

  const sendIcon = screen.getByTestId('SendIcon');

  expect(sendIcon).toBeInTheDocument();
  expect(toolTipButton).toBeInTheDocument();
  expect(screen.queryByTestId('AttachFileOutlinedIcon')).toBeInTheDocument();
});
