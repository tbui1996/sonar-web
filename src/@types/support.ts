export type Provider = {
  email: string;
  id: string;
};

export type Message = {
  sender: string;
  timestamp: string;
  message: string;
};

export type ChatSessionRequest = {
  internalUserID: string;
  userID: string;
};

export type PendingChatSession = {
  sessionID: string;
  userID: string;
  email: string;
  timestamp: number;
};

export type SessionID = {
  sessionID: string;
  internalUserID: string;
};
