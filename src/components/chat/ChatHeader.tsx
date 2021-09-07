import { Typography } from '@material-ui/core';
import { getDisplayName } from './UserListItem';
import { ChatHeaderProps } from '../../@types/chat';

export default function ChatHeader({ chatSession, user }: ChatHeaderProps) {
  return (
    <div
      style={{
        height: '70px',
        borderBottom: '1px solid rgba(145, 158, 171, 0.24)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <div style={{ marginLeft: '1em' }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          {chatSession ? getDisplayName(user) : 'Please Select a Chat'}
        </Typography>
        {user && (
          <Typography
            variant="body2"
            sx={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#637381'
            }}
          >
            {user.organization}
          </Typography>
        )}
      </div>
    </div>
  );
}
