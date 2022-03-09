import { useState, useCallback, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import axios from '../../utils/axios';
import { FormToAssociateProps } from '../../@types/file';

export default function FileAssociate({
  data,
  setOpen,
  handleTableDisplay,
  updateData
}: FormToAssociateProps) {
  const [loading, setLoading] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  const handleEditForm = useCallback(async () => {
    setLoading(true);
    if (data?.id) {
      const res = await axios.put(`/cloud/associate_file`, data).catch((e) => {
        console.error(e);
      });

      if (res && handleTableDisplay) handleTableDisplay(data.fileId);
    }

    setLoading(false);
    setOpen(false);
    setIsEdited(false);
  }, [data, setOpen, handleTableDisplay]);

  function onChangeHandler(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    updateData({ ...data, memberId: e.target.value });
    setIsEdited(true);
  }

  function closeDrawer() {
    setOpen(false);
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          width: '100%'
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: 'text.secondary', paddingLeft: '1.6rem' }}
        >
          Associate file
        </Typography>
        <IconButton onClick={closeDrawer} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          margin: '0.5rem'
        }}
      >
        <TextField
          fullWidth
          required
          disabled={loading}
          label="Medicaid ID"
          placeholder="Enter Medicaid ID"
          variant="outlined"
          value={data.memberId}
          onChange={onChangeHandler}
          sx={{
            marginBottom: '1rem'
          }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <Button
            sx={{ marginRight: '.25em', flexGrow: 1 }}
            variant="outlined"
            onClick={closeDrawer}
            disabled={loading}
            aria-label="cancel"
          >
            Cancel
          </Button>
          <Button
            sx={{ marginLeft: '.25em', flexGrow: 1 }}
            variant="contained"
            onClick={handleEditForm}
            disabled={loading || !isEdited || data.memberId === ''}
            aria-label="submit"
          >
            Submit
          </Button>
        </Box>
      </Card>
    </>
  );
}
