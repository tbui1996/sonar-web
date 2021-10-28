import {
  Chip,
  IconButton,
  Input,
  InputAdornment,
  LinearProgress,
  Tooltip
} from '@material-ui/core';
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import SendIcon from '@material-ui/icons/Send';
import { ChatMessageProps } from '../../@types/chat';

export default function ChatMessageBar({
  onChangeText,
  messageText,
  disabled,
  messageSending,
  onChangeFile,
  onClickSend,
  onDeleteFile,
  file
}: ChatMessageProps) {
  const ENTER_KEY = 'Enter';
  function handleKeypress(e: React.KeyboardEvent) {
    if (e.key === ENTER_KEY && e.shiftKey) {
      // This allows user to add an extra line
    } else if (e.key === ENTER_KEY) {
      e.preventDefault();
      onClickSend();
    }
  }

  return (
    <div>
      {messageSending && <LinearProgress />}
      <Input
        sx={{ paddingLeft: '16px', paddingTop: '15px', paddingBottom: '17px' }}
        fullWidth
        value={messageText}
        id="message-input"
        placeholder={
          disabled ? "Can't type message in closed chat" : 'Type a message'
        }
        onChange={onChangeText}
        onKeyDown={handleKeypress}
        multiline
        type="text"
        disabled={disabled || file !== undefined}
        endAdornment={
          <InputAdornment position="end">
            {file !== undefined && (
              <Chip label={file.name} onDelete={onDeleteFile} />
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
