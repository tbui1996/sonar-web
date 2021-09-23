import {
  Avatar,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  Box
} from '@material-ui/core';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import { makeStyles } from '@material-ui/core/styles';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';

import mime from 'mime-types';
import { UserListProps } from '../../@types/support';
import useAuth from '../../hooks/useAuth';
import { MTimelineDot } from '../@material-extend';

const useStyles = makeStyles({
  secondary: {
    color: '#637381'
  },
  padding: {
    padding: '15px',
    overflow: 'hidden'
  },
  typographyName: {
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '22px',
    color: '#212B36'
  },
  typographyMessage: {
    fontWeight: 500,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '22px',
    color: '#637381'
  }
});

export default function UserListItem({
  session,
  isActive,
  onOpenChat
}: UserListProps) {
  const auth = useAuth();
  const internalUserID = auth.user.id;
  const classes = useStyles();

  let lastMessageText = '';
  if (session.lastMessageSenderID) {
    const messageSplit = session.lastMessagePreview?.split('.') || [''];
    const isMessageLikelyAFile = mime.lookup(
      `.${messageSplit[messageSplit.length - 1]}`
    );
    if (session.lastMessageSenderID === internalUserID) {
      lastMessageText = !isMessageLikelyAFile
        ? `You: ${session.lastMessagePreview}`
        : 'You sent a file';
    } else {
      // lastMessageText = `${session.user?.displayName}: ${session.lastMessagePreview}`;
      lastMessageText = !isMessageLikelyAFile
        ? `${session.lastMessagePreview}`
        : `A file was sent to you`;
    }
  }

  return (
    <Tooltip
      title={session.user?.email || 'No Email'}
      key={session.user?.sub}
      placement="right-start"
    >
      <ListItem
        button
        selected={isActive}
        onClick={onOpenChat}
        classes={{ root: classes.padding }}
      >
        <ListItemIcon>
          <Avatar
            sx={{
              width: '48px',
              height: '48px',
              backgroundColor: session.chatOpen ? '#ffd7c0' : '#cceedd'
            }}
          >
            {session.chatOpen && (
              <WarningRoundedIcon sx={{ color: '#FF4842' }} />
            )}
            {!session.chatOpen && (
              <CheckCircleRoundedIcon sx={{ color: '#00AB55' }} />
            )}
          </Avatar>
        </ListItemIcon>
        <ListItemText
          disableTypography
          primary={
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <Typography
                noWrap
                variant="subtitle2"
                classes={{ root: classes.typographyName }}
              >
                {session.user?.displayName || 'Unknown'}
              </Typography>
              {session.lastMessageTimestamp && (
                <Typography noWrap variant="caption">
                  {formatDistanceStrict(
                    Date.now(),
                    session.lastMessageTimestamp * 1000
                  )}
                </Typography>
              )}
            </Box>
          }
          secondary={
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row'
              }}
            >
              {lastMessageText ? (
                <Typography
                  noWrap
                  variant="body2"
                  classes={{ root: classes.typographyMessage }}
                >
                  {lastMessageText}
                </Typography>
              ) : (
                <Box />
              )}
              {session.hasUnreadMessages && <MTimelineDot color="secondary" />}
            </Box>
          }
        />
      </ListItem>
    </Tooltip>
  );
}
