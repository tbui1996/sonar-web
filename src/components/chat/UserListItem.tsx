import {
  Avatar,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography
} from '@material-ui/core';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import { makeStyles } from '@material-ui/core/styles';
import { UserListProps } from '../../@types/support';

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
  userDetails,
  selected,
  onClickCallback,
  open,
  lastMessage
}: UserListProps) {
  const classes = useStyles();

  return (
    <Tooltip
      title={userDetails?.email || 'No Email'}
      key={userDetails?.sub}
      placement="right-start"
    >
      <ListItem
        button
        selected={selected}
        onClick={onClickCallback}
        classes={{ root: classes.padding }}
      >
        <ListItemIcon>
          <Avatar
            sx={{
              width: '48px',
              height: '48px',
              backgroundColor: open ? '#ffd7c0' : '#cceedd'
            }}
          >
            {open && <WarningRoundedIcon sx={{ color: '#FF4842' }} />}
            {!open && <CheckCircleRoundedIcon sx={{ color: '#00AB55' }} />}
          </Avatar>
        </ListItemIcon>
        <div style={{ minWidth: '0' }}>
          <ListItemText
            disableTypography
            primary={
              <Typography
                noWrap
                variant="subtitle2"
                classes={{ root: classes.typographyName }}
              >
                {userDetails?.displayName || 'Unknown'}
              </Typography>
            }
          />
          {lastMessage && (
            <ListItemText
              disableTypography
              secondary={
                <Typography
                  noWrap
                  variant="body2"
                  classes={{ root: classes.typographyMessage }}
                >
                  {lastMessage && lastMessage.senderID === 'sonar'
                    ? `You: ${lastMessage.message}`
                    : `${userDetails?.displayName}: ${lastMessage.message}`}
                </Typography>
              }
            />
          )}
        </div>
      </ListItem>
    </Tooltip>
  );
}
