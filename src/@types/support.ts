import { User } from './users';

export type Provider = {
  email: string;
  id: string;
};

export enum SocketMessageType {
  Message = 'message',
  NewPendingSession = 'new_pending_session'
}

export type SocketMessage = {
  type: SocketMessageType;
  payload?: Message | ChatSessionDTO;
};

export type Message = {
  id: string;
  sessionID: string;
  senderID: string;
  message: string;
  createdTimestamp: number;
  fileID: string | null;
};

export type ChatSessionRequest = {
  internalUserID: string;
  userID: string;
};

export type ChatSessionDTO = {
  ID: string;
  userID: string;
  createdTimestamp: number;
  internalUserID?: string;
  chatOpen?: boolean;
  topic?: string;
  notes?: string;
  pending?: boolean;

  // Only available after chat session is assigned
  userLastRead?: number;
  internalUserLastRead?: number;

  // Only available after first message is sent
  lastMessageTimestamp?: number;
  lastMessagePreview?: string;
  lastMessageSenderID?: string;
};

export enum ChatSessionStatus {
  UNHYDRATED,
  HYDRATING,
  HYDRATED
}

export type ChatSession = ChatSessionDTO & {
  status: ChatSessionStatus;
  messages: Message[];
  hasUnreadMessages: boolean;

  // Holds data for user denoted by userID
  user?: User;
};

export type UserListProps = {
  session: ChatSession;
  isActive: boolean;
  onOpenChat: () => void;
};

export type MessageListProps = {
  session?: ChatSession;
};

export type SessionID = {
  sessionID: string;
  internalUserID: string;
};

export type ChatSessionUpdateRequest = {
  id: string;
  open: boolean;
};
