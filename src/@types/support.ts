import { User } from './users';

export type Provider = {
  email: string;
  id: string;
};

export type Message = {
  senderID: string;
  createdTimestamp: string;
  message: string;
  sessionID: string;
  fileID: string | null;
};

export type ChatSessionRequest = {
  internalUserID: string;
  userID: string;
};

export type ChatSession = {
  ID: string;
  userID: string;
  createdTimestamp: number;
  internalUserID: string | undefined;
  chatOpen: boolean | undefined;
  pending: boolean | undefined;
  topic: string | undefined;
};

export type UserListProps = {
  userDetails: User | undefined;
  selected: boolean;
  onClickCallback: () => void;
  open: boolean | undefined;
  lastMessage: Message | undefined;
};

export type MessageListProps = {
  chatSession: ChatSession | undefined;
  messages: Message[];
  user: User;
};

export type SessionID = {
  sessionID: string;
  internalUserID: string;
};

export type ChatSessionUpdateRequest = {
  id: string;
  open: boolean;
};
