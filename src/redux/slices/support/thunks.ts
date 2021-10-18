import { createAsyncThunk } from '@reduxjs/toolkit';

import axios from '../../../utils/axios';

// utils
import mapUserDisplayName from '../../../utils/mapUserDisplayName';

// redux
import type { RootState } from '../../store';

// types
import {
  ChatSession,
  ChatSessionStatus,
  Message,
  SessionID
} from '../../../@types/support';
import type { Users } from '../../../@types/users';
import type { FileUploadResponse } from '../../../@types/chat';

export const postUploadFile = createAsyncThunk(
  'support/postUploadFile',
  async (file: File, { getState }) => {
    const state = getState() as RootState;

    const { activeSessionID, sessions } = state.support;

    if (!activeSessionID) {
      throw new Error(
        `[support/postUploadFile]: expected active session id to be defined`
      );
    }

    const activeSession = sessions.byId[activeSessionID];

    if (!activeSession) {
      throw new Error(
        `[support/postUploadFile]: expected active session to exist`
      );
    }

    const formData = new FormData();
    formData.append('file-upload', file, file.name);

    const response = await axios.post<FileUploadResponse>(
      `/cloud/file_upload?&chatId=${activeSession.ID}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (response.status !== 200) {
      throw new Error('[support/postUploadFile]: failed to upload file');
    }

    return response.data;
  }
);

export const postSwitchSessionOpen = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('support/postSwitchSessionOpen', async (_, { getState }) => {
  const state = getState();
  const { activeSessionID, sessions } = state.support;

  if (!activeSessionID) {
    throw new Error(
      `[support/postSwitchSessionOpen]: expected active session id to be defined`
    );
  }

  const activeSession = sessions.byId[activeSessionID];

  if (!activeSession) {
    throw new Error(
      `[support/postSwitchSessionOpen]: expected active session to exist`
    );
  }

  await axios.post('/support/chat_session_update', {
    // Pending is called before this callback is called in the payload creator
    // Optimistic Response already changed this value.
    open: activeSession.chatOpen,
    id: activeSession.ID
  });
});

export const getSessionMessages = createAsyncThunk(
  'support/getSessionMessages',
  async (sessionID: string) => {
    const response = await axios.get<Message[]>(
      `/support/sessions/${sessionID}/messages`
    );

    return {
      ID: sessionID,
      messages: response.data
    };
  }
);

export const postAssignSessionToUser = createAsyncThunk(
  'support/postAssignSessionToUser',
  async ({
    sessionID,
    internalUserID
  }: {
    sessionID: string;
    internalUserID: string;
  }) => {
    const data: SessionID = {
      sessionID,
      internalUserID
    };

    const response = await axios.post<Message[]>(
      `/support/assign_pending_chat_session`,
      data
    );

    return response.data;
  }
);

export const getPendingChatSessions = createAsyncThunk(
  'support/getPendingChatSessions',
  async (_, { getState }) => {
    const state = getState() as RootState;

    const { users } = state.support;

    if (!users) {
      throw new Error(
        '[support/getPendingChatSessions]: expected users to be defined'
      );
    }

    const response = await axios.get<ChatSession[]>(
      `/support/pending_chat_sessions`
    );

    return response.data.map((item) => {
      const user = users.byId[item.userID];

      if (!user) {
        throw new Error(
          '[support/getPendingChatSessions]: expecteed to find a user for chat session'
        );
      }

      return {
        ...item,
        pending: true,
        status: ChatSessionStatus.UNHYDRATED,
        user
      };
    });
  }
);

export const getChatSessions = createAsyncThunk(
  'support/getChatSessions',
  async () => {
    const response = await axios.get<ChatSession[]>(`/support/sessions`);
    return response.data;
  }
);

export const getUsers = createAsyncThunk('support/getUsers', async () => {
  const response = await axios.get<Users>(`/users/user_list`);
  response.data.users = mapUserDisplayName(response.data.users);
  return response.data;
});

export const getInitialState = createAsyncThunk(
  'support/getInitialState',
  async () => {
    const [responseUsers, responseActiveSessions] = await Promise.all([
      axios.get<Users>(`/users/user_list`),
      axios.get<ChatSession[]>('/support/sessions')
    ]);

    const users = mapUserDisplayName(responseUsers.data.users);

    const activeSessions = responseActiveSessions.data.map((item) => {
      const user = users.find((maybeUser) => maybeUser.sub === item.userID);

      if (!item.internalUserID) {
        return {
          ...item,
          status: ChatSessionStatus.UNHYDRATED,
          pending: true,
          chatOpen: true,
          user
        };
      }

      return {
        ...item,
        status: ChatSessionStatus.UNHYDRATED,
        user
      };
    });

    return {
      users,
      activeSessions
    };
  }
);
