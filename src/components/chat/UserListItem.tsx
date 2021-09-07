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
import { User } from '../../@types/users';

const useStyles = makeStyles({
  secondary: {
    color: '#637381'
  },
  padding: {
    padding: '15px'
  }
});

function UserListItem({
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ListItemText primary={getDisplayName(userDetails)} />
          {lastMessage && (
            <ListItemText
              disableTypography
              secondary={
                <Typography noWrap variant="body2">
                  {lastMessage && lastMessage.senderID === 'sonar'
                    ? `You: ${lastMessage.message}`
                    : `${userDetails?.firstName}: ${lastMessage.message}`}
                </Typography>
              }
              classes={{ secondary: classes.secondary }}
            />
          )}
        </div>
      </ListItem>
    </Tooltip>
  );
}

function getDisplayName(user: User | undefined): string {
  if (!user) {
    return 'Unknown';
  }

  return `${user.firstName || 'Unknown'} ${user.lastName || ''}`;
}

export { UserListItem, getDisplayName };
