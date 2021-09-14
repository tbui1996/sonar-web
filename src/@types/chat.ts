// ----------------------------------------------------------------------
import { ChangeEvent } from 'react';
import { ChatSession } from './support';
import { User } from './users';
import axios from '../utils/axios';

export type Contact = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  address: string;
  phone: string;
  email: string;
  lastActivity: number;
  status: string;
  position: string;
};

export type Participant = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  address?: string;
  phone?: string;
  email?: string;
  lastActivity?: Date;
  status?: 'online' | 'offline' | 'away' | 'busy';
  position?: string;
};

export type TextMessage = {
  id: string;
  body: string;
  contentType: 'text';
  attachments: string[];
  createdAt: Date;
  senderId: string;
};

export type ImageMessage = {
  id: string;
  body: string;
  contentType: 'image';
  attachments: string[];
  createdAt: Date;
  senderId: string;
};

export type Message = TextMessage | ImageMessage;

export type Conversation = {
  id: string;
  participants: Participant[];
  type: string;
  unreadCount: number;
  messages: Message[];
};

export type SendMessage = {
  conversationId: string;
  messageId: string;
  message: string;
  contentType: 'text';
  attachments: string[];
  createdAt: Date;
  senderId: string;
};

export type AccordionProps = {
  patientInfo?: undefined;
  providerName?: string | null;
};

export type ChatStatusProps = {
  chatSession: ChatSession | undefined;
  callback: (
    status: 'open' | 'close',
    session: ChatSession | undefined
  ) => void;
  open: boolean;
  onChange: () => void;
};

export type ChatHeaderProps = {
  chatSession: ChatSession | undefined;
  user: User | undefined;
};

export type ChatMessageProps = {
  onChangeText: (e: ChangeEvent<HTMLInputElement>) => void;
  messageText: string;
  disabled: boolean;
  messageSending: boolean;
  onChangeFile: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSend: () => void;
  onDeleteFile: () => void;
  file: File | undefined;
};

export type FileUploadResponse = {
  fileID: string | null;
};

export type WebsocketMessage = {
  sender: string;
  timestamp: number;
  message: string;
  session: string;
  file: string | null;
};
