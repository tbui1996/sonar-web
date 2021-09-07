import { Grid, List, ListItem, ListItemText, Paper } from '@material-ui/core';
import { useEffect, useRef } from 'react';
import { MessageListProps } from '../../@types/support';
import LoadingScreen from '../LoadingScreen';

export default function MessageList({
  chatSession,
  providerName,
  messages
}: MessageListProps) {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    // @ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
                alignItems={
                  message.senderID === 'sonar' ? 'flex-end' : 'flex-start'
                }
              >
                <Grid item xs={12}>
                  <ListItemText
                    secondary={
                      message.senderID === 'sonar'
                        ? message.createdTimestamp
                        : `${providerName}, ${message.createdTimestamp}`
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      background: (theme) =>
                        message.senderID === 'sonar'
                          ? theme.palette.primary.lighter
                          : theme.palette.grey[300],
                      maxWidth: '375px'
                    }}
                  >
                    <ListItemText
                      primary={message.message}
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
