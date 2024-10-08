import {
  Button,
  createStyles,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from '@material-ui/core';
import { useEffect, useRef } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import {
  Message,
  MessageListProps,
  ChatSessionStatus
} from '../../@types/support';
import LoadingScreen from '../LoadingScreen';
import { useAuth } from '../../hooks/useAuth';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    justify: {
      justifyContent: 'center'
    },
    paperRootInternal: {
      background: theme.palette.primary.lighter,
      maxWidth: '375px'
    },
    paperRootExternal: {
      background: theme.palette.grey[300],
      maxWidth: '375px'
    },
    paperRootSystem: {
      background: '#D0F2FF'
    },
    textColorFile: {
      color: '#04297A',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    gridRootItemFile: {
      width: '100%'
    }
  })
);

function translateTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });
}

export default function MessageList({ session }: MessageListProps) {
  const classes = useStyles();
  const messagesEndRef = useRef(null);
  const auth = useAuth();
  const internalUserID = auth.user.id;
  useEffect(() => {
    // @ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [auth, session]);

  const getAlignment = (message: Message) => {
    if (message.fileID !== null) {
      return 'center';
    }

    return message.senderID === internalUserID ? 'flex-end' : 'flex-start';
  };

  const getPaperStyling = (message: Message) => {
    if (message.fileID === null && message.senderID === internalUserID) {
      return { root: classes.paperRootInternal };
    }

    if (message.fileID === null && message.senderID !== internalUserID) {
      return { root: classes.paperRootExternal };
    }

    return { root: classes.paperRootSystem };
  };

  const getTextStyling = (message: Message) => {
    if (message.fileID !== null) {
      return { root: classes.textColorFile };
    }

    return {};
  };

  const getGridStyling = (message: Message) => {
    if (message.fileID !== null) {
      return { root: classes.gridRootItemFile };
    }

    return {};
  };

  const getFileMessage = (message: Message) =>
    `${
      message.senderID === internalUserID
        ? 'You'
        : `${session?.user?.displayName}`
    } sent new file(s) to ${
      message.senderID === internalUserID
        ? `${session?.user?.displayName}`
        : 'you'
    }`;

  let content = null;
  if (session) {
    if (session.status === ChatSessionStatus.HYDRATING) {
      content = <LoadingScreen />;
    } else {
      content = (
        <List>
          {session.messages.map((message, index) => (
            <ListItem key={index}>
              <Grid
                container
                direction="column"
                flexWrap="nowrap"
                alignItems={getAlignment(message)}
                paddingTop={index === 0 ? '0' : '40px'}
              >
                {message.fileID === null && (
                  <Grid item xs={12}>
                    <ListItemText
                      sx={{ paddingBottom: '8px' }}
                      secondary={
                        message.senderID === internalUserID
                          ? translateTimestamp(message.createdTimestamp)
                          : `${
                              session?.user?.displayName
                            }, ${translateTimestamp(message.createdTimestamp)}`
                      }
                    />
                  </Grid>
                )}
                <Grid item xs={12} classes={getGridStyling(message)}>
                  <Paper elevation={0} classes={getPaperStyling(message)}>
                    <ListItemText
                      disableTypography
                      primary={
                        <Typography
                          variant="body2"
                          classes={getTextStyling(message)}
                        >
                          {message.fileID !== null && (
                            <>
                              <InfoRoundedIcon
                                sx={{
                                  color: '#1890FF',
                                  marginRight: '14px',
                                  marginLeft: '18px'
                                }}
                              />{' '}
                              {`${translateTimestamp(
                                message.createdTimestamp
                              )} `}
                              <text
                                style={{
                                  flexGrow: 1,
                                  textAlign: 'left',
                                  paddingLeft: '4px'
                                }}
                              >
                                {getFileMessage(message)}
                              </text>
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={async () => {
                                  const token = await auth.token();
                                  window.open(
                                    `https://api.${process.env.REACT_APP_BASE_API_DOMAIN}/cloud/file_download/${message.fileID}?authorization=${token}`
                                  );
                                }}
                              >
                                View
                              </Button>
                            </>
                          )}
                          {message.fileID === null && (
                            <div
                              style={{
                                whiteSpace: 'pre-line',
                                overflowWrap: 'break-word'
                              }}
                            >
                              {message.message}
                            </div>
                          )}
                        </Typography>
                      }
                      sx={{ padding: '10px', color: '#242832' }}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </ListItem>
          ))}
          <ListItem>
            <div ref={messagesEndRef} />
          </ListItem>
        </List>
      );
    }
  }

  return (
    <div
      style={{
        flexGrow: 1,
        borderBottom: '1px solid rgba(145, 158, 171, 0.24)',
        maxHeight: '700px',
        overflowY: 'scroll'
      }}
    >
      {content}
    </div>
  );
}
