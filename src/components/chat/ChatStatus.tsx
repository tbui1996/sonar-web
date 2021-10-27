import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { ChatStatusProps } from '../../@types/chat';

const useStyles = makeStyles({
  root: {
    zIndex: 1,
    width: '250px'
  },
  content: {
    flexGrow: 0
  },
  details: {
    paddingTop: '0',
    paddingBottom: '0'
  },
  typographyRoot: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  }
});

export default function ChatStatus({ session, callback }: ChatStatusProps) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [session]);

  function handleChangeStatus() {
    setExpanded(false);
    callback();
  }

  return (
    <div
      style={{
        height: '70px',
        width: '100%',
        borderBottom: '1px solid rgba(145, 158, 171, 0.24)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'right'
      }}
    >
      <Accordion
        classes={{ root: classes.root }}
        disabled={!session}
        expanded={expanded}
        onChange={() => setExpanded((prev) => !prev)}
      >
        <AccordionSummary
          sx={{ marginLeft: '20px', paddingRight: '34.41px' }}
          expandIcon={<ExpandMoreIcon />}
          classes={{ content: classes.content }}
        >
          <Typography
            variant="body2"
            classes={{ root: classes.typographyRoot }}
          >
            Status: {!session && 'No Status'}
            {session?.chatOpen && (
              <>
                Open
                <WarningRoundedIcon
                  sx={{ color: '#FF4842', marginLeft: '5px' }}
                />
              </>
            )}
            {session && !session.chatOpen && (
              <>
                Closed
                <CheckCircleRoundedIcon
                  sx={{ color: '#00AB55', marginLeft: '5px' }}
                />
              </>
            )}
          </Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.details }}>
          <List>
            <ListItem
              button
              onClick={handleChangeStatus}
              disabled={!session?.chatOpen}
            >
              <ListItemText
                disableTypography
                primary={
                  <Typography
                    variant="body2"
                    classes={{ root: classes.typographyRoot }}
                  >
                    <CheckCircleRoundedIcon
                      sx={{ color: '#00AB55', marginLeft: '5px' }}
                    />
                    Close Chat
                  </Typography>
                }
              />
            </ListItem>
            <ListItem
              button
              onClick={handleChangeStatus}
              disabled={session?.chatOpen}
            >
              <ListItemText
                disableTypography
                primary={
                  <Typography
                    variant="body2"
                    classes={{ root: classes.typographyRoot }}
                  >
                    <WarningRoundedIcon
                      sx={{ color: '#FF4842', marginLeft: '5px' }}
                    />
                    Open Chat
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
