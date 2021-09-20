import { Typography } from '@material-ui/core';
import { ChatHeaderProps } from '../../@types/chat';

export default function ChatHeader({ session }: ChatHeaderProps) {
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
          {session?.user?.displayName || 'Please Select a Chat'}
        </Typography>
        {session?.user && (
          <Typography
            variant="body2"
            sx={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#637381'
            }}
          >
            {session?.user?.organization}
          </Typography>
        )}
      </div>
    </div>
  );
}
