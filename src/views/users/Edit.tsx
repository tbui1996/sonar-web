import { useState, useCallback, ChangeEvent } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import { EditUserProps } from '../../@types/users';
import { MIconButton } from '../../components/@material-extend';
import ConfirmDialog from '../../components/general/app/ConfirmDialog';
import axios from '../../utils/axios';

export default function EditUser({
  user,
  users,
  setEditView,
  setUser,
  setUsers,
  handleClick
}: EditUserProps) {
  const [updating, setUpdating] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleAction = useCallback(
    async (route: string, params: any, snackBarMessage: string) => {
      if (!users || !user) {
        return;
      }

      setUpdating(true);
      const res = await axios.put(route, params).catch((e) => {
        console.error(e);
      });

      if (res) {
        setUpdating(false);
        setEditView(false);

        const usersCopy = [...users.users];
        const userIndex = usersCopy?.findIndex(
          (item: any) => item.sub === user.sub
        );

        usersCopy[userIndex].group = route.includes('revoke_access')
          ? 'no_group'
          : user.group;

        setUsers({
          paginationToken: users?.paginationToken,
          users: usersCopy
        });

        setUser(undefined);
      } else {
        setUpdating(false);
        enqueueSnackbar(`${snackBarMessage} failed`, {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
    },
    [
      user,
      users,
      setEditView,
      setUser,
      setUsers,
      closeSnackbar,
      enqueueSnackbar
    ]
  );

  const handleSaveChanges = () =>
    handleAction(
      `/users/group_assign`,
      { username: user?.email, group: user?.group },
      'Save'
    );

  const handleDisableUser = () =>
    handleAction(
      `/users/revoke_access`,
      { username: user?.username },
      'Action'
    );

  const handleChange = (event: ChangeEvent<{ value: string }>) => {
    if (user) {
      setUser({
        ...user,
        group: event.target.value
      });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginBottom: '2em'
        }}
      >
        <TextField
          sx={{ flexGrow: 1, marginRight: '1em' }}
          id="firstName"
          label="First name"
          variant="outlined"
          value={user?.firstName}
          disabled
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          sx={{ flexGrow: 1, marginLeft: '1em' }}
          id="lastName"
          label="Last name"
          variant="outlined"
          value={user?.lastName}
          disabled
          InputLabelProps={{ shrink: true }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginBottom: '2em'
        }}
      >
        <FormControl
          variant="outlined"
          disabled
          sx={{ flexGrow: 1, marginRight: '1em', width: '100% ' }}
        >
          <InputLabel id="org-select-label">Organization</InputLabel>
          <Select
            labelId="org-select-label"
            id="organization-select"
            value={
              user?.organization ? user?.organization.toLowerCase() : 'none'
            }
            label="Organization"
          >
            <MenuItem value="none">No organization</MenuItem>
            <MenuItem value="stationmd">StationMD</MenuItem>
            <MenuItem value="reddoor">Reddoor</MenuItem>
            <MenuItem value="circulo">Circulo</MenuItem>
          </Select>
        </FormControl>
        <TextField
          sx={{ flexGrow: 1, marginLeft: '1em', width: '100%' }}
          id="emailAddress"
          label="Email"
          variant="outlined"
          value={user?.email}
          disabled
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginBottom: '2em'
        }}
      >
        <FormControl
          variant="outlined"
          sx={{ flexGrow: 1, marginRight: '1em', width: '100%' }}
        >
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select
            labelId="role-select-label"
            id="role-select"
            value={user?.group}
            onChange={handleChange}
            label="Role"
          >
            <MenuItem value="no_group" disabled>
              No role
            </MenuItem>
            <MenuItem value="externals_supervisor">Supervisor</MenuItem>
          </Select>
        </FormControl>
        <div style={{ flexGrow: 1, marginLeft: '1em', width: '100%' }} />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexGrow: 1,
            width: '100%'
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ marginRight: '.25em', flexGrow: 1, textTransform: 'none' }}
            onClick={handleSaveChanges}
            disabled={updating}
          >
            Save changes
          </Button>
          <Button
            sx={{ marginLeft: '.25em', flexGrow: 1 }}
            variant="outlined"
            onClick={() => handleClick(undefined)}
            disabled={updating}
          >
            Cancel
          </Button>
        </div>
        <div
          style={{
            display: 'flex',
            marginLeft: '1em',
            width: '100%',
            justifyContent: 'flex-end'
          }}
        >
          <Button
            sx={{ marginLeft: '.25em', width: '50%', textTransform: 'none' }}
            variant="outlined"
            color="primary"
            onClick={() => setOpenConfirm(true)}
            disabled={updating}
          >
            Disable user
          </Button>
        </div>
      </div>
      <ConfirmDialog
        open={openConfirm}
        title="Are you sure you want to disable this user?"
        description="This user will be signed out and not longer will have access to the system."
        onConfirm={handleDisableUser}
        onCancel={() => setOpenConfirm(false)}
      />
    </div>
  );
}
