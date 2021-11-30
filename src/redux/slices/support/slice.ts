import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
import {
  ChatSession,
  ChatSessionDTO,
  ChatSessionStatus,
  Message
} from '../../../@types/support';

import type { User } from '../../../@types/users';

// Local
import {
  postAssignSessionToUser,
  postSwitchSessionOpen,
  postUploadFile,
  getInitialState,
  getSessionMessages
} from './thunks';

type ChatState = {
  loadingInitialState: boolean;

  error: boolean;

  // the chat session being displayed right now
  activeSessionID?: string;

  // combines pending and active sessions
  sessions: {
    byId: Record<string, ChatSession>;
    allIds: string[];
  };

  // session specific
  messageSending: boolean;

  users?: {
    byId: Record<string, User>;
    allIds: string[];
  };
};

const initialState: ChatState = {
  loadingInitialState: false,
  error: false,
  messageSending: false,
  sessions: {
    byId: {},
    allIds: []
  },
  users: {
    byId: {},
    allIds: []
  }
};

function sortSessions(state: ChatState): void {
  state.sessions.allIds.sort((a, b) => {
    const aSession = state.sessions.byId[a];
    const bSession = state.sessions.byId[b];

    if (aSession.chatOpen && !bSession.chatOpen) {
      return -1;
    }

    if (!aSession.chatOpen && bSession.chatOpen) {
      return 1;
    }

    if (!aSession.lastMessageTimestamp) {
      if (!bSession.lastMessageTimestamp) {
        if (aSession.createdTimestamp && bSession.createdTimestamp) {
          // put newer ones up top
          return bSession.createdTimestamp - aSession.createdTimestamp;
        }

        // don't have enough information
        return 0;
      }

      return -1;
    }

    // If a.lastMessageTimestamp exists, and b.lastMessageTimestamp doesn't
    // put b to top
    if (!bSession.lastMessageTimestamp) {
      return 1;
    }

    if (aSession.hasUnreadMessages && !bSession.hasUnreadMessages) {
      return -1;
    }

    if (!aSession.hasUnreadMessages && bSession.hasUnreadMessages) {
      return 1;
    }

    // example a = 1, b = 0. b - a = -1. a goes to top
    return bSession.lastMessageTimestamp - aSession.lastMessageTimestamp;
  });
}

function insertMessageIntoArray(
  current: Message[],
  nextMessage: Message
): Message[] {
  const next = [...current];
  const currentLastMessage =
    next.length > 0 ? next[next.length - 1] : undefined;

  // No previous messages, just append to array
  if (!currentLastMessage) {
    next.push(nextMessage);
    return next;
  }

  // Assume any message with a later timestamp than our last message has not been displayed
  if (nextMessage.createdTimestamp > currentLastMessage.createdTimestamp) {
    next.push(nextMessage);
    return next;
  }

  // We received a curious message, a ghost of chat past. Who art thou, mysterious message?
  const existingMessage = next.find((item) => item.id === nextMessage.id);
  if (existingMessage) {
    // Message is already being displayed, don't modify anything
    return next;
  }

  console.log(
    `Received a message that should have already been displayed. Performing inefficient insert.`
  );

  next.push(nextMessage);
  next.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
  return next;
}

function hasUnreadMessages(session: ChatSession, timestamp?: number) {
  if (session.lastMessageTimestamp === undefined) {
    // no messages to be unread
    return false;
  }

  if (!timestamp) {
    // there are messages but the user has never read the channel
    return true;
  }

  return timestamp < session.lastMessageTimestamp;
}

export default createSlice({
  name: 'support',
  initialState,
  reducers: {
    checkUnreadMessages(state, action: PayloadAction<string>) {
      const { sessions, activeSessionID } = state;

      if (activeSessionID === action.payload) {
        return;
      }

      const session = sessions.byId[action.payload];

      if (!session) {
        console.log(
          `[support/checkUnreadMessages]: tried to check unread messages on session that didn't exist (${action.payload})`
        );
        return;
      }

      session.hasUnreadMessages = hasUnreadMessages(
        session,
        session.internalUserLastRead
      );
      sortSessions(state);
    },
    addMessage(state, action: PayloadAction<Message>) {
      const { sessions } = state;
      const session = sessions.byId[action.payload.sessionID];
      if (!session) {
        console.log(
          `[support/addMessage]: received a message for a chat session that does not exist ${action.payload.sessionID}`
        );
        return;
      }

      session.messages = insertMessageIntoArray(
        session.messages,
        action.payload
      );

      const lastMessage = session.messages[session.messages.length - 1];
      session.lastMessagePreview = lastMessage.message;
      session.lastMessageTimestamp = lastMessage.createdTimestamp;
      session.lastMessageSenderID = lastMessage.senderID;

      if (action.payload.senderID === session.internalUserID) {
        // automatically count any messages we send as read
        session.internalUserLastRead = Date.now() / 1000;
      }

      sortSessions(state);
    },

    activateSession(state, action: PayloadAction<string>) {
      const session = state.sessions.byId[action.payload];
      if (!session) {
        console.log(
          `[support/activeSession]: expected session to exist when activating (${action.payload})`
        );
      }

      state.activeSessionID = action.payload;
    },
    updateSessionNotes(state, action: PayloadAction<string>) {
      const { sessions, activeSessionID } = state;

      if (!activeSessionID) {
        console.log(
          '[support/readMessage]: expected activeSessionID to exist when updating notes'
        );
        return;
      }

      const activeSession = sessions.byId[activeSessionID];
      if (!activeSession) {
        console.log(
          `[support/addMessage]: updated notes for a chat session that does not exist ${activeSessionID}`
        );
        return;
      }

      activeSession.notes = action.payload;
      sortSessions(state);
    },
    addPendingSession(state, action: PayloadAction<ChatSessionDTO>) {
      const { sessions, users } = state;
      if (sessions.byId[action.payload.ID]) {
        console.log(
          '[support/addPendingSession]: attempted to add a session when it already exists - ignoring'
        );
        return;
      }

      if (!users) {
        console.log(
          `[support/addPendingSession]: attempted to add a session when users aren't loaded - ignoring`
        );
        return;
      }

      const user = users.byId[action.payload.userID];

      if (!user) {
        console.log(
          `[support/addPendingSession]: attempted to add a session with unknown userID - ignoring`
        );
        return;
      }

      sessions.allIds.push(action.payload.ID);
      const session: ChatSession = {
        ...action.payload,
        user,
        messages: [],
        hasUnreadMessages: false,
        status: ChatSessionStatus.UNHYDRATED,
        pending: true,
        chatOpen: true
      };

      session.hasUnreadMessages = hasUnreadMessages(
        session,
        session.internalUserLastRead
      );

      sessions.byId[action.payload.ID] = session;

      sortSessions(state);
    },
    readMessages(state) {
      const { activeSessionID, sessions } = state;

      if (!activeSessionID) {
        console.log(
          '[support/readMessage]: expected activeSessionID to exist when sending read receipt'
        );
        return;
      }

      const activeSession = sessions.byId[activeSessionID];

      if (!activeSession) {
        console.log(
          '[support/readMessage]: expected active session to exist when sending read receipt'
        );
        return;
      }

      activeSession.hasUnreadMessages = hasUnreadMessages(
        activeSession,
        Date.now() / 1000
      );

      sortSessions(state);
    }
  },
  extraReducers: (builder) => {
    builder
      /* Initial State */
      .addCase(getInitialState.pending, (state) => {
        state.loadingInitialState = true;
      })
      .addCase(getInitialState.rejected, (state) => {
        state.loadingInitialState = false;
      })
      .addCase(getInitialState.fulfilled, (state, action) => {
        state.loadingInitialState = false;

        const byId: Record<string, ChatSession> = {};
        action.payload.activeSessions.forEach((item) => {
          byId[item.ID] = item;
          item.messages = [];
          item.status = ChatSessionStatus.UNHYDRATED;
        });

        state.sessions = {
          byId,
          allIds: action.payload.activeSessions.map((item) => item.ID)
        };

        sortSessions(state);

        state.users = {
          byId: action.payload.users.reduce((prev, current) => {
            prev[current.sub] = current;
            return prev;
          }, {} as Record<string, User>),
          allIds: action.payload.users.map((item) => item.sub)
        };
      })
      .addCase(getSessionMessages.pending, (state, action) => {
        const session = state.sessions.byId[action.meta.arg];
        if (!session || session.status === ChatSessionStatus.HYDRATED) {
          console.log(`Session already hydrated: ${action.meta.arg}`);
          return;
        }

        console.log(`Hydrating session: ${action.meta.arg}`);
        session.status = ChatSessionStatus.HYDRATING;
      })
      .addCase(getSessionMessages.fulfilled, (state, action) => {
        const session = state.sessions.byId[action.meta.arg];
        if (!session) {
          return;
        }

        const { messages } = action.payload;
        messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
        if (messages.length > 0) {
          // Once hydrated, update latest message on ChatSession
          const lastMessage = messages[messages.length - 1];
          session.lastMessagePreview = lastMessage.message;
          session.lastMessageTimestamp = lastMessage.createdTimestamp;
          session.lastMessageSenderID = lastMessage.senderID;
        }

        session.messages = messages;
        session.status = ChatSessionStatus.HYDRATED;
      })
      .addCase(getSessionMessages.rejected, (state, action) => {
        console.log(`Failed to hydrate session: ${action.meta.arg}`);
        const session = state.sessions.byId[action.meta.arg];
        if (!session || session.status === ChatSessionStatus.HYDRATED) {
          return;
        }

        session.status = ChatSessionStatus.UNHYDRATED;
      })
      /* Assign user to pending chat session */
      .addCase(postAssignSessionToUser.pending, ({ sessions }, action) => {
        console.log(`Assigning user to session: ${action.meta.arg.sessionID}`);
        const session = sessions.byId[action.meta.arg.sessionID];

        if (!session) {
          console.log(
            `expected session to exist when assigned user to it (${action.meta.arg.sessionID})`
          );
          return;
        }

        // Optimistic Response
        session.pending = false;
        session.chatOpen = true;
        session.internalUserID = action.meta.arg.internalUserID;
      })
      .addCase(postAssignSessionToUser.rejected, ({ sessions }, action) => {
        const session = sessions.byId[action.meta.arg.sessionID];

        if (!session) {
          console.log(
            `expected session to exist when assigned user to it (${action.meta.arg.sessionID})`
          );
          return;
        }

        // revert changes
        session.pending = true;
        session.chatOpen = true;
        delete session.internalUserID;
      })
      /* Switch open/closed state on session */
      .addCase(postSwitchSessionOpen.pending, (state) => {
        const { activeSessionID, sessions } = state;
        if (!activeSessionID) {
          console.log(
            'Expected activeSession to exist when switching open state.'
          );
          return;
        }

        const activeSession = sessions.byId[activeSessionID];

        if (!activeSession) {
          console.log('Expected session to exist for active session.');
          return;
        }

        // Optimistic Response: preemptively switch state
        activeSession.chatOpen = !activeSession.chatOpen;
        sortSessions(state);
      })
      .addCase(postSwitchSessionOpen.rejected, (state) => {
        const { activeSessionID, sessions } = state;
        if (!activeSessionID) {
          console.log(
            'Expected activeSession to exist when switch open state is rejected.'
          );
          return;
        }

        const activeSession = sessions.byId[activeSessionID];

        if (!activeSession) {
          console.log('Expected session to exist for active session.');
          return;
        }

        // Switch back to original state
        activeSession.chatOpen = !activeSession.chatOpen;
        sortSessions(state);
      })
      .addCase(postUploadFile.pending, (state) => {
        state.messageSending = true;
      })
      .addCase(postUploadFile.rejected, (state) => {
        state.messageSending = false;
      })
      .addCase(postUploadFile.fulfilled, (state) => {
        state.messageSending = false;
      });
  }
});
