import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as redux from 'react-redux';
import { render } from '../../tests/testingLibraryUtils';
import Chat from './Root';
import { User } from '../../@types/users';
import { ChatSession, ChatSessionStatus, Message } from '../../@types/support';
import { User as accountUser } from '../../@types/account';

afterEach(cleanup);

const mockMessage: Message = {
  id: '1',
  sessionID: '1',
  senderID: '1',
  message: '1',
  createdTimestamp: 23,
  fileID: 'hello'
};
const mockUserInterface: User = {
  id: '1',
  username: 'hello',
  email: 'hello@circulohealth.com',
  firstName: 'thomas',
  lastName: 'bui',
  organization: null,
  group: 'b',
  sub: 'wrold',
  displayName: 'tom'
};

const mockAccountUser: accountUser = {
  id: '1',
  displayName: 'asdf',
  email: 'asdf@circulohealth.com',
  password: 'asdf',
  photoURL: null,
  phoneNumber: null,
  country: null,
  address: null,
  state: null,
  city: null,
  zipCode: null,
  about: null,
  role: 'string',
  isPublic: true
};

const mockChatSession: ChatSession = {
  status: ChatSessionStatus.HYDRATED,
  messages: [mockMessage],
  hasUnreadMessages: false,
  user: mockUserInterface,
  ID: '1',
  userID: '1',
  createdTimestamp: 1330232400000,
  internalUserID: '1',
  chatOpen: false,
  topic: 'a',
  notes: 'hello',
  pending: false
};

const mockSecondChatSession: ChatSession = {
  status: ChatSessionStatus.HYDRATED,
  messages: [mockMessage],
  hasUnreadMessages: false,
  user: mockUserInterface,
  ID: '2',
  userID: '1',
  createdTimestamp: 1330232400001,
  internalUserID: '1',
  chatOpen: false,
  topic: 'a',
  notes: 'hello',
  pending: false
};

const initialState = {
  support: {
    loadingInitialState: false,
    error: false,
    messageSending: false,
    alertState: false,
    isActive: true,
    sessions: {
      byId: { '1': mockChatSession, '2': mockSecondChatSession },
      allIds: ['1', '2']
    },
    users: {
      byId: { '1': mockUserInterface },
      allIds: ['1']
    }
  },
  authJwt: { isLoading: false, isAuthenticated: false, user: mockAccountUser }
};

beforeEach(() => {
  jest
    .spyOn(redux, 'useSelector')
    .mockImplementation((callback) => callback(initialState));
});

test(' Should render Status: No Status ', async () => {
  jest.mock('redux-persist', () => {
    const real = jest.requireActual('redux-persist');
    return {
      ...real,
      persistReducer: jest
        .fn()
        .mockImplementation((config, reducers) => reducers)
    };
  });

  render(<Chat />, { initialState });

  const noStatusText = screen.getByText(/Status:/i);
  await waitFor(() => expect(noStatusText).toBeInTheDocument());
});

test('Pagination displays chats in Sidebar', () => {
  render(<Chat />, { initialState });
  const getChat = screen.getByTestId('user-list-item-1');
  expect(getChat).toBeInTheDocument();
});

test('Dashboard text loads without crashing and is clickable', async () => {
  render(<Chat />, { initialState });
  const chatTitle = await waitFor(() => screen.getByText(/Dashboard/i));
  expect(chatTitle).toHaveAttribute('href', '/dashboard');
});

test('Click dashboard href link', async () => {
  const mockHistoryPush = jest.fn();

  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
      push: mockHistoryPush
    })
  }));

  render(<Chat />, { initialState });

  const chatTitle = await waitFor(() => screen.getByText(/Dashboard/i));
  userEvent.click(chatTitle);
  waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/dashboard'));
});

test('Search... displays', async () => {
  render(<Chat />, { initialState });
  const searchPlaceHolderText = await waitFor(() =>
    screen.getByPlaceholderText(/Search.../i)
  );
  expect(searchPlaceHolderText).toBeInTheDocument();
});

test(' Should render Please Select a Chat without crashing ', async () => {
  render(<Chat />, { initialState });

  const noStatusText = screen.getByText(/Please Select a Chat/i);
  await waitFor(() => expect(noStatusText).toBeInTheDocument());
});
