import { createSlice } from '@reduxjs/toolkit';
import Auth from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { store } from '../store';
// utils
import axios from '../../utils/axios';
// @types
import { User } from '../../@types/account';
import { CognitoUser } from '../../@types/cognito';
import { Session } from '../../@types/authenticatedSession';

// ----------------------------------------------------------------------

type AuthJWTState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User;
};

const unAuthUser = {
  id: '',
  displayName: '',
  email: '',
  password: '',
  photoURL: null,
  phoneNumber: null,
  country: null,
  address: null,
  state: null,
  city: null,
  zipCode: null,
  about: null,
  role: '',
  isPublic: true
};

const initialState: AuthJWTState = {
  isLoading: false,
  isAuthenticated: false,
  user: unAuthUser
};

const slice = createSlice({
  name: 'authJwt',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // INITIALISE
    getInitialize(state, action) {
      state.isLoading = false;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
    },

    // LOGIN
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },

    // LOGOUT
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = unAuthUser;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

function setSession(session: Session | null) {
  if (session) {
    const { accessToken, idToken, refreshToken } = session;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('idToken', idToken);
    localStorage.setItem('refreshToken', refreshToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    return;
  }

  localStorage.removeItem('accessToken');
  localStorage.removeItem('idToken');
  localStorage.removeItem('refreshToken');
  delete axios.defaults.headers.common.Authorization;
}

async function getSession(): Promise<Session> {
  // https://docs.amplify.aws/lib/auth/manageusers/q/platform/js/#retrieve-current-authenticated-user
  // Auth.currentSession - This method will automatically refresh the accessToken and idToken if tokens
  //   are expired and a valid refreshToken presented. So you can use this method to refresh the session if needed.
  const currentSession = await Auth.currentSession();

  return {
    idToken: currentSession.getIdToken().getJwtToken(),
    accessToken: currentSession.getAccessToken().getJwtToken(),
    refreshToken: currentSession.getRefreshToken().getToken()
  };
}

// ----------------------------------------------------------------------

function getUser({
  username: id,
  signInUserSession: {
    idToken: {
      payload: { name: displayName, email }
    }
  }
}: CognitoUser): User {
  return {
    ...unAuthUser,
    id,
    displayName,
    email
  };
}

// ----------------------------------------------------------------------

// https://docs.amplify.aws/lib/utilities/hub/q/platform/js/
// Hub will listen to auth events and allow us to handle accordingly
Hub.listen('auth', ({ payload: { event, data } }) => {
  const { dispatch } = store;
  switch (event) {
    case 'signIn':
      setSession(data.signInUserSession.accessToken.jwtToken);
      dispatch(slice.actions.loginSuccess({ user: getUser(data) }));
      break;
    case 'signOut':
      dispatch(slice.actions.logoutSuccess());
      break;
    case 'signIn_failure':
      console.error('user sign in failed');
      break;
    case 'tokenRefresh_failure':
      console.error('token refresh failed');
  }
});

// ----------------------------------------------------------------------

export function login() {
  return async () => {
    await Auth.federatedSignIn({ customProvider: 'Okta' });
  };
}

// ----------------------------------------------------------------------

export function logout() {
  return async () => {
    setSession(null);
    await Auth.signOut();
  };
}

// ----------------------------------------------------------------------

export async function token() {
  const sess = await getSession();
  return sess.accessToken;
}

// ----------------------------------------------------------------------

export function getInitialize() {
  return async () => {
    const { dispatch } = store;

    dispatch(slice.actions.startLoading());

    try {
      const session = await getSession();
      setSession(session);

      const cognitoUser: CognitoUser = await Auth.currentUserPoolUser();

      dispatch(
        slice.actions.getInitialize({
          isAuthenticated: true,
          user: getUser(cognitoUser)
        })
      );
    } catch (error) {
      if (error !== 'No current user') {
        console.error(error);
      }

      dispatch(
        slice.actions.getInitialize({
          isAuthenticated: false,
          user: null
        })
      );
    }
  };
}
