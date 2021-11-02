import { useState, useMemo, useEffect } from 'react';
import { ChangeEvent } from 'react-quill/node_modules/@types/react';

import {
  Chip,
  IconButton,
  Input,
  InputAdornment,
  LinearProgress,
  Tooltip
} from '@material-ui/core';
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import { useSelector } from 'react-redux';
import SendIcon from '@material-ui/icons/Send';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { socketUrl } from '../../views/chat/Root';

import { dispatch, RootState } from '../../redux/store';
import {
  addMessage,
  postUploadFile,
  readMessages
} from '../../redux/slices/support';
import {
  ChatMessageBarProps,
  MessageInput,
  FileInput
} from '../../@types/chat';
import { isFileUploadResponse } from '../../utils/type-guards';

export default function ChatMessageBar({
  activeSessionIsOpen,
  activeSession,
  loadingInitialState,
  messageSending,
  alertState,
  setAlertState
}: ChatMessageBarProps) {
  const ENTER_KEY = 'Enter';
  function handleKeypress(e: React.KeyboardEvent) {
    if (e.key === ENTER_KEY && e.shiftKey) {
      // This allows user to add an extra line
    } else if (e.key === ENTER_KEY) {
      e.preventDefault();
      onClickSend();
    }
  }
  const [
    currentMessageTextInputs,
    setCurrentMessageTextInputs
  ] = useState<MessageInput>({});

  const [
    currentMessageFileInputs,
    setCurrentMessageFileInputs
  ] = useState<FileInput>({});

  const [file, setFile] = useState<File>();
  const { user } = useSelector((state: RootState) => state.authJwt);
  const activeSessionID = activeSession.ID;

  const messageTextInput = useMemo(() => {
    if (!activeSessionID || !currentMessageTextInputs[activeSessionID]) {
      return '';
    }

    return currentMessageTextInputs[activeSessionID];
  }, [activeSessionID, currentMessageTextInputs]);

  useEffect(() => {
    if (activeSessionID && currentMessageFileInputs[activeSessionID]) {
      setFile(currentMessageFileInputs[activeSessionID]);
    } else {
      setFile(undefined);
    }
  }, [activeSessionID, currentMessageFileInputs]);

  const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
    onMessage: async (event) => {
      if (loadingInitialState) {
        console.log(`Received chat message while initial state was loading.`);
      }
    }
  });

  async function onSendMessage(fileID: string | null) {
    if (!activeSessionID) {
      setAlertState({
        ...alertState,
        open: true,
        message: 'You have not selected a chat'
      });
      return;
    }

    if (messageTextInput === '' && fileID === null) {
      setAlertState({
        ...alertState,
        open: true,
        message: 'Cannot send a message with no content'
      });
      return;
    }
    setCurrentMessageTextInputs({
      ...currentMessageTextInputs,
      [activeSessionID]: ''
    });
    // Optimistic Response add message
    dispatch(
      addMessage({
        id: `unknown-${Date.now() / 1000}`,
        sessionID: activeSessionID,
        senderID: user.id,
        message: messageTextInput,
        createdTimestamp: Date.now() / 1000,
        fileID
      })
    );
    dispatch(readMessages());

    // Send through websocket
    sendJsonMessage({
      action: 'support',
      payload: {
        type: 'chat',
        message: JSON.stringify({
          session: activeSessionID,
          sender: user.id,
          message: messageTextInput,
          file: fileID
        })
      }
    });

    sendJsonMessage({
      action: 'support',
      payload: {
        type: 'read_receipt',
        message: JSON.stringify({
          sessionID: activeSessionID,
          userID: user.id
        })
      }
    });
  }

  function onChangeMessage(e: ChangeEvent<HTMLInputElement>) {
    if (!activeSessionID) {
      return;
    }
    const { value } = e.currentTarget;
    setCurrentMessageTextInputs({
      ...currentMessageTextInputs,
      [activeSessionID]: value
    });
  }
  function onChangeFile(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;

    if (files === null) {
      return;
    }

    if (files.length <= 0) {
      return;
    }

    const file = files[0];
    setCurrentMessageFileInputs((prev) => ({
      ...prev,
      [activeSessionID]: file
    }));

    setCurrentMessageTextInputs((prev) => ({
      ...prev,
      [activeSessionID]: file.name.toString()
    }));
  }

  function onDeleteFile() {
    setCurrentMessageFileInputs((prev) => ({
      ...prev,
      [activeSessionID]: undefined
    }));

    setCurrentMessageTextInputs((prev) => ({
      ...prev,
      [activeSessionID]: ''
    }));
  }

  async function onClickSend() {
    if (!activeSessionID) {
      setAlertState({
        ...alertState,
        open: true,
        message: 'Unable to send file, the chat session is not active'
      });
      console.log(`expected a session to be active when sending a file.`);
      return;
    }

    if (file === undefined) {
      onSendMessage(null);
      return;
    }

    let response;
    try {
      response = await dispatch(postUploadFile(file));
    } catch (e) {
      setAlertState({
        ...alertState,
        open: true,
        message: 'Unable to upload file'
      });
      console.log(e);
      return;
    }

    if (!isFileUploadResponse(response?.payload)) {
      setAlertState({
        ...alertState,
        open: true,
        message: 'Unable to upload file'
      });
      console.log(
        'Response is not a file upload response: ',
        response?.payload
      );
      return;
    }

    onSendMessage(response.payload.fileID);
    onDeleteFile();
  }
  const disabled =
    readyState !== ReadyState.OPEN ||
    !user ||
    !activeSessionIsOpen ||
    messageSending;

  return (
    <div>
      {messageSending && <LinearProgress />}
      <Input
        sx={{ paddingLeft: '16px', paddingTop: '15px', paddingBottom: '17px' }}
        fullWidth
        value={messageTextInput}
        id="message-input"
        placeholder={
          disabled ? "Can't type message in closed chat" : 'Type a message'
        }
        onChange={onChangeMessage}
        onKeyDown={handleKeypress}
        multiline
        type="text"
        disabled={disabled || file !== undefined}
        endAdornment={
          <InputAdornment position="end">
            {file !== undefined && (
              <Chip label={file?.name} onDelete={onDeleteFile} />
            )}
            <label htmlFor="message-bar-file-input">
              <Tooltip title="Upload File">
                <IconButton component="span" disabled={disabled}>
                  <AttachFileOutlinedIcon />
                </IconButton>
              </Tooltip>

              <input
                disabled={disabled}
                id="message-bar-file-input"
                type="file"
                hidden={true}
                accept=".pdf,.png,.jpeg,.jpg"
                multiple={false}
                onChange={onChangeFile}
              />
            </label>
            <IconButton onClick={onClickSend} disabled={disabled}>
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </div>
  );
}
