import {
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
import { Message, MessageListProps } from '../../@types/support';
import LoadingScreen from '../LoadingScreen';
import useAuth from '../../hooks/useAuth';

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
      justifyContent: 'center'
    },
    gridRootItemFile: {
      width: '80%'
    }
  })
);

export default function MessageList({
  chatSession,
  user,
  messages
}: MessageListProps) {
  const auth = useAuth();
  const internalUserID = auth.user.id;
  const classes = useStyles();
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    // @ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      message.senderID === internalUserID ? 'You' : `${user.displayName}`
    } sent a file${
      message.fileID !== null ? `: [${message.message}]` : ' '
    } to ${
      message.senderID === internalUserID ? `${user.displayName}` : 'You'
    }`;

  useEffect(scrollToBottom, [chatSession, messages]);

  return (
    <div
      style={{
        flexGrow: 1,
        borderBottom: '1px solid rgba(145, 158, 171, 0.24)',
        maxHeight: '700px',
        overflowY: 'scroll'
      }}
    >
      {chatSession && messages.length <= 0 && <LoadingScreen />}
      {chatSession && messages.length > 0 && (
        <List>
          {messages.map((message, index) => (
            <ListItem key={index}>
              <Grid
                container
                direction="column"
                flexWrap="nowrap"
                alignItems={getAlignment(message)}
              >
                {message.fileID === null && (
                  <Grid item xs={12}>
                    <ListItemText
                      secondary={
                        message.senderID === internalUserID
                          ? message.createdTimestamp
                          : `${user.displayName}, ${message.createdTimestamp}`
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
                                sx={{ color: '#1890FF', marginRight: '2%' }}
                              />{' '}
                              {`${message.createdTimestamp}:`}
                              <strong
                                style={{ flexGrow: 1, textAlign: 'center' }}
                              >
                                {getFileMessage(message)}
                              </strong>
                            </>
                          )}
                          {message.fileID === null && <>{message.message}</>}
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
      )}
    </div>
  );
}
