import { FileTypeResponse } from '../../@types/chat';
import {
  ChatSessionDTO,
  Message,
  SocketMessage,
  SocketMessageType
} from '../../@types/support';

export function isMessage(value: unknown): value is Message {
  if (!value) {
    return false;
  }

  const assumed = value as Message;

  return (
    Boolean(assumed.id) &&
    Boolean(assumed.sessionID) &&
    Boolean(assumed.senderID) &&
    Boolean(assumed.message) &&
    Boolean(assumed.createdTimestamp)
  );
}

export function isChatSessionDTO(value: unknown): value is ChatSessionDTO {
  if (!value) {
    return false;
  }

  const assumed = value as ChatSessionDTO;

  return (
    Boolean(assumed.ID) &&
    Boolean(assumed.userID) &&
    Boolean(assumed.createdTimestamp)
  );
}

export function isSocketMessage(value: unknown): value is SocketMessage {
  if (!value) {
    return false;
  }

  const assumed = value as SocketMessage;
  switch (assumed.type) {
    case SocketMessageType.Message:
      return isMessage(assumed.payload);
    case SocketMessageType.NewPendingSession:
      return isChatSessionDTO(assumed.payload);
    default:
      return false;
  }
}

export function isFileUploadResponse(
  value: unknown
): value is FileTypeResponse {
  if (!value) {
    return false;
  }

  const assumed = value as FileTypeResponse;
  return Boolean(assumed.fileKey) && Boolean(assumed.databaseId);
}
