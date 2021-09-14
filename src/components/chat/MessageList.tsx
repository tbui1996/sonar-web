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
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import { Message, MessageListProps } from '../../@types/support';
import LoadingScreen from '../LoadingScreen';

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
      background: '#E9FCD4'
    },
    textColorFile: {
      color: '#08660D',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    textColor: {
      color: '#212B36'
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

    return message.senderID === 'sonar' ? 'flex-end' : 'flex-start';
  };

  const getPaperStyling = (message: Message) => {
    // TODO: SONAR-322
    if (message.fileID === null && message.senderID === 'sonar') {
      return { root: classes.paperRootInternal };
    }

    // TODO: SONAR-322
    if (message.fileID === null && message.senderID !== 'sonar') {
      return { root: classes.paperRootExternal };
    }

    return { root: classes.paperRootSystem };
  };

  const getTextStyling = (message: Message) => {
    if (message.fileID === null) {
      return { root: classes.textColor };
    }

    return { root: classes.textColorFile };
  };

  const getGridStyling = (message: Message) => {
    if (message.fileID !== null) {
      return { root: classes.gridRootItemFile };
    }

    return {};
  };

  // TODO: SONAR-322
  const getFileMessage = (message: Message) =>
    `${
      message.senderID === `sonar` ? 'You' : `${user.displayName}`
    } sent a file${
      message.fileID !== null ? `: [${message.message}]` : ' '
    } to ${message.senderID === `sonar` ? `${user.displayName}` : 'You'}`;

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
                        message.senderID === 'sonar'
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
                              <CheckCircleRoundedIcon
                                sx={{ color: '#00AB55', marginRight: '2%' }}
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
