import {
  Chip,
  IconButton,
  Input,
  InputAdornment,
  LinearProgress,
  Tooltip
} from '@material-ui/core';
import { InsertEmoticon } from '@material-ui/icons';
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
  return (
    <div>
      {messageSending && <LinearProgress />}
      <Input
        sx={{ padding: '10px' }}
        fullWidth
        value={messageText}
        id="message-input"
        placeholder="Type a message"
        onChange={onChangeText}
        type="text"
        disabled={file !== undefined}
        startAdornment={
          <InputAdornment>
            <InsertEmoticon sx={{ marginRight: '10px' }} />
          </InputAdornment>
        }
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
