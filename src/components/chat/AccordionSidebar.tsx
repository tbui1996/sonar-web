import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GroupIcon from '@material-ui/icons/Group';
import { AccordionProps } from '../../@types/chat';

export default function AccordionSidebar({
  patientInfo,
  providerName
}: AccordionProps) {
  return (
    <>
      <Accordion square>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="overline">Patient Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">Nothing here yet</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion square>
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
      <Accordion square>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="overline">Documents</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">Nothing here yet</Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
