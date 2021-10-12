import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GroupIcon from '@material-ui/icons/Group';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/core/styles';
import { InsertDriveFile } from '@material-ui/icons';
import { AccordionProps } from '../../@types/chat';

const useStyles = makeStyles({
  root: {
    boxShadow: 'none !important'
  }
});

export default function AccordionSidebar({
  patientInfo,
  providerName
}: AccordionProps) {
  const classes = useStyles();
  const url = process.env.REACT_APP_DOPPLER_DASHBOARD_URL;

  return (
    <>
      <Accordion square classes={{ root: classes.root }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="overline">Patient Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {patientInfo && (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <PersonIcon sx={{ marginRight: '10px' }} />
              <Typography variant="body2">{patientInfo}</Typography>
            </div>
          )}
          {!patientInfo && (
            <Typography variant="body2">Nothing here yet</Typography>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion square classes={{ root: classes.root }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="overline">Supervisors</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {providerName && (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <GroupIcon sx={{ marginRight: '10px' }} />
              <Typography variant="body2">{providerName}</Typography>
            </div>
          )}
          {!providerName && (
            <Typography variant="body2">Nothing here yet</Typography>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion square classes={{ root: classes.root }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="overline">Documents</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <InsertDriveFile sx={{ marginRight: '10px' }} />
              <a href={url} target="_blank" rel="noreferrer">
                View files on Doppler Dashboard
              </a>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
