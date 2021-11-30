import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
  Typography
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GroupIcon from '@material-ui/icons/Group';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/core/styles';
import { InsertDriveFile } from '@material-ui/icons';
import { ChangeEvent, useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import axios from '../../utils/axios';
import { AccordionProps } from '../../@types/chat';
import { dispatch } from '../../redux/store';
import { updateSessionNotes } from '../../redux/slices/support';

const useStyles = makeStyles({
  root: {
    boxShadow: 'none !important'
  }
});

export default function AccordionSidebar({ activeSession }: AccordionProps) {
  const classes = useStyles();
  const url = process.env.REACT_APP_DOPPLER_DASHBOARD_URL;
  const activeSessionID = activeSession?.ID;
  const providerName = activeSession?.user?.displayName;
  const patientInfo = activeSession?.topic;

  const [notes, setNotes] = useState('');

  useEffect(() => {
    setNotes(activeSession.notes || '');
  }, [activeSession]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounced = useCallback(
    debounce(async (value: string, sessionId: string) => {
      const res = await axios
        .put(`/support/${sessionId}/notes`, {
          notes: value
        })
        .catch((e) => {
          console.error(e);
        });

      if (res && res.status === 200) dispatch(updateSessionNotes(value));
    }, 1500),
    []
  );

  const onChangeNotes = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setNotes(value);
    debounced(value, activeSessionID);
  };

  return (
    <>
      <Accordion square classes={{ root: classes.root }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="patient-information-content"
          id="patient-information-header"
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
          aria-controls="supervisors-content"
          id="supervisors-header"
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
          aria-controls="documents-content"
          id="documents-header"
        >
          <Typography variant="overline">Documents</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="span" variant="body2">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <InsertDriveFile sx={{ marginRight: '10px' }} />
              <a href={url} target="_blank" rel="noreferrer">
                View files on Doppler Dashboard
              </a>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion square classes={{ root: classes.root }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="notes-content"
          data-testid="notes-accordion"
        >
          <Typography variant="overline">Notes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            label="Notes"
            multiline
            rows={8}
            onChange={onChangeNotes}
            value={notes}
            inputProps={{ maxLength: 2000, 'data-testid': 'notes-input' }}
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
}
