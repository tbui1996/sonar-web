import { useState, useCallback, ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ConfirmDialog from '../../components/general/app/ConfirmDialog';
import axios from '../../utils/axios';
import { FormEditProps } from '../../@types/form';

export default function FormEdit({
  data,
  setOpen,
  handleTableDisplay,
  updateData
}: FormEditProps) {
  const history = useHistory();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  const handleEditForm = useCallback(async () => {
    setLoading(true);
    if (data?.id) {
      const res = await axios
        .put(`/forms/edit`, {
          id: data.id,
          title: data.title,
          description: data.description
        })
        .catch((e) => {
          console.error(e);
        });

      if (res && handleTableDisplay)
        handleTableDisplay(data.id, data.title, data.description);
    }

    setLoading(false);
    setOpen(false);
    setIsEdited(false);

    if (handleTableDisplay) history.push(`/dashboard/forms`);
  }, [history, data, setOpen, handleTableDisplay]);

  const handleDeleteForm = useCallback(async () => {
    setOpenConfirm(false);

    if (data?.id) {
      setLoading(true);
      const res = await axios.put(`/forms/${data.id}/delete`).catch((e) => {
        console.error(e);
      });

      if (res && handleTableDisplay) handleTableDisplay(data.id);
    }

    setLoading(false);
    setOpen(false);

    history.push(`/dashboard/forms`);
  }, [data, history, setOpen, handleTableDisplay]);

  function onChangeHandler(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    attribute: 'title' | 'description'
  ) {
    updateData({ ...data, [attribute]: e.target.value });
    setIsEdited(true);
  }

  function closeDrawer() {
    setOpen(false);
  }
  function handleOpenConfirm() {
    setOpenConfirm(!openConfirm);
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
          sx={{ color: 'text.secondary', paddingLeft: '0.5rem' }}
        >
          Edit Form
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
          label="Title"
          placeholder="Title"
          variant="outlined"
          value={data.title}
          onChange={(e) => onChangeHandler(e, 'title')}
          sx={{
            marginBottom: '1rem'
          }}
        />
        <TextField
          fullWidth
          multiline
          disabled={loading}
          label="Description"
          minRows={3}
          placeholder="Description"
          variant="outlined"
          value={data.description}
          onChange={(e) => onChangeHandler(e, 'description')}
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
            onClick={handleOpenConfirm}
            disabled={loading}
            aria-label="delete"
          >
            Delete
          </Button>
          <Box
            sx={{
              display: 'flex',
              width: '50%'
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
              disabled={loading || !isEdited || data.title === ''}
              aria-label="save"
            >
              Save
            </Button>
          </Box>
        </Box>
      </Card>
      <ConfirmDialog
        open={openConfirm}
        title="Are you sure you want to delete this form?"
        description="This form will be deleted and cannot be undone."
        onConfirm={handleDeleteForm}
        onCancel={handleOpenConfirm}
      />
    </>
  );
}
