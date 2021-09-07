import { IconButton, Input, InputAdornment } from '@material-ui/core';
import { InsertEmoticon } from '@material-ui/icons';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import SendIcon from '@material-ui/icons/Send';
import { ChatMessageProps } from '../../@types/chat';

export default function ChatMessageBar({
  changeCallback,
  textInput,
  sendCallback,
  disabled
}: ChatMessageProps) {
  return (
    <div>
      <Input
        sx={{ padding: '10px' }}
        fullWidth
        value={textInput}
        id="message-input"
        placeholder="Type a message"
        onChange={changeCallback}
        type="text"
        startAdornment={
          <InputAdornment>
            <InsertEmoticon sx={{ marginRight: '10px' }} />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <InsertPhotoOutlinedIcon />
            <AttachFileOutlinedIcon />
            <IconButton onClick={sendCallback} disabled={disabled}>
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </div>
  );
}
