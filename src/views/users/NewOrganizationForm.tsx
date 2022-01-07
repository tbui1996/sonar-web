import { useState, useCallback, ChangeEvent } from 'react';
import {
  TextField,
  Button,
  Card,
  Box,
  Typography,
  IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { NewOrganizationProps } from '../../@types/users';
import axios from '../../utils/axios';
import AlertSnackbar from '../../components/AlertSnackbar';
import { AlertState } from '../../@types/alert';

export default function NewOrganizationForm({
  handleClose,
  loading,
  setLoading,
  user,
  setOpen,
  setSelectedOrganizationID,
  organizations,
  setOrganization,
  organization
}: NewOrganizationProps) {
  const [isEdited, setIsEdited] = useState(false);
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'error'
  });
  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.currentTarget;
    const foundOrg = organizations?.find((element) => element.name === value);
    setOrganization(foundOrg || { id: 0, name: value });

    setIsEdited(true);
    if (value === '') {
      setIsEdited(false);
    }
  };

  const handleCreateOrganization = useCallback(async () => {
    setLoading(true);

    if (user?.displayName) {
      const res = await axios
        .post(`/users/organizations`, {
          name: organization?.name
        })
        .catch((e) => {
          console.error(e);
        });

      if (res && res.status === 200) {
        const orgID = res?.data.ID;
        organizations?.push({ id: orgID, name: organization?.name || '' });
        setSelectedOrganizationID(orgID);
        setOrganization({ id: orgID, name: organization?.name! });
        setOpen(false);
        setLoading(false);
        setIsEdited(false);
      } else {
        setAlertState({
          ...alertState,
          open: true,
          message: 'Unable to create organization as it already exists'
        });
        setOpen(true);
        setLoading(false);
        setIsEdited(false);
      }
    }
  }, [
    alertState,
    organization?.name,
    organizations,
    setLoading,
    setOpen,
    setOrganization,
    setSelectedOrganizationID,
    user?.displayName
  ]);
  const content: any = (
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
          Create Organization
        </Typography>
        <IconButton onClick={handleClose} disabled={loading}>
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
          label="Organization"
          placeholder="Enter Organization name here"
          variant="outlined"
          onChange={onChangeHandler}
          value={organization?.name}
          sx={{
            marginBottom: '1rem'
          }}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '50%'
          }}
        >
          <Button
            sx={{ marginRight: '.25em', flexGrow: 1 }}
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
            aria-label="cancel"
          >
            Cancel
          </Button>
          <Button
            sx={{ marginLeft: '.25em', flexGrow: 1 }}
            variant="contained"
            onClick={handleCreateOrganization}
            disabled={loading || !isEdited}
            aria-label="create"
          >
            Create
          </Button>
        </Box>
      </Card>
    </>
  );
  return (
    <>
      {content}
      <AlertSnackbar
        open={alertState.open}
        message={alertState.message}
        onAlertClose={() =>
          setAlertState({ ...alertState, open: false, message: '' })
        }
        severity={alertState.severity}
      />
    </>
  );
}
