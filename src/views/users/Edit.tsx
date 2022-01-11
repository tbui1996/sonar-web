import { useState, useCallback, ChangeEvent } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Drawer
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import { EditUserProps, Organization, User } from '../../@types/users';
import { MIconButton } from '../../components/@material-extend';
import ConfirmDialog from '../../components/general/app/ConfirmDialog';
import axios from '../../utils/axios';
import NewOrganizationForm from './NewOrganizationForm';

const UPDATE_USER_ROUTE = '/users/update_user';
const REVOKE_USER_ROUTE = '/users/revoke_access';

const DRAWER_WIDTH = 400;
export default function EditUser({
  user,
  users,
  setEditView,
  setUser,
  setUsers,
  handleClick,
  organizations
}: EditUserProps) {
  const [updating, setUpdating] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectOrganizationID, setSelectedOrganizationID] = useState(
    user?.organization?.id
  );
  const [organization, setOrganization] = useState<Organization | null>(null);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

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
          (item: User) => item.id === user.id
        );
        const updatedUsers: User[] = [
          ...usersCopy.slice(0, userIndex),
          {
            ...user,
            organization,
            group: route.includes('revoke_access') ? '' : user?.group,
            displayName: user?.firstName
              ? `${user?.firstName} ${user?.lastName}`
              : user?.email
          },
          ...usersCopy.slice(userIndex + 1)
        ];

        setUsers({
          paginationToken: users?.paginationToken,
          users: updatedUsers
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
      users,
      user,
      setEditView,
      organization,
      setUsers,
      setUser,
      enqueueSnackbar,
      closeSnackbar
    ]
  );

  const handleSaveChanges = () =>
    handleAction(
      UPDATE_USER_ROUTE,
      {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        group: user?.group,
        organizationId: selectOrganizationID || 0
      },
      'Save'
    );

  const handleDisableUser = () =>
    handleAction(
      REVOKE_USER_ROUTE,
      { username: user?.username },
      'Revoking User'
    );

  const handleOrgChange = (event: ChangeEvent<{ value: number }>) => {
    if (user) {
      const organizationId = event.target.value;
      let selectedOrg;
      if (organizationId === 0) {
        selectedOrg = { id: 0, name: '-' };
        setSelectedOrganizationID(0);
      } else {
        selectedOrg = organizations?.find(
          (org) => org.id === event.target.value
        );
        setSelectedOrganizationID(organizationId);
      }
      setOrganization(selectedOrg || null);

      setUser({
        ...user,
        organization: selectedOrg || null
      });
      setIsEdited(true);
    }
  };

  function handlerUserChanges(
    e: ChangeEvent<{ value: string }>,
    attribute: string
  ) {
    if (user) {
      setUser({
        ...user,
        [attribute]: e.target.value
      });
      setIsEdited(true);
    }
  }
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
          disabled={updating}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => handlerUserChanges(e, 'firstName')}
        />
        <TextField
          sx={{ flexGrow: 1, marginLeft: '1em' }}
          id="lastName"
          label="Last name"
          variant="outlined"
          value={user?.lastName}
          disabled={updating}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => handlerUserChanges(e, 'lastName')}
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
          disabled={updating}
          sx={{ flexGrow: 1, marginRight: '1em', width: '100% ' }}
        >
          <InputLabel id="org-select-label">Organization</InputLabel>
          <Select
            labelId="org-select-label"
            id="organization-select"
            value={selectOrganizationID || 0}
            label="Organization"
            onChange={handleOrgChange}
          >
            <MenuItem value={0}>No organization</MenuItem>
            <MenuItem value={-1} onClick={handleOpen}>
              Create Organization
            </MenuItem>
            {organizations?.map((org) => (
              <MenuItem value={org.id} key={org.id}>
                {org.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Drawer
          anchor="right"
          open={open}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          <NewOrganizationForm
            handleClose={handleClose}
            loading={loading}
            setLoading={setLoading}
            user={user}
            setOpen={setOpen}
            setSelectedOrganizationID={setSelectedOrganizationID}
            organizations={organizations}
            setOrganization={setOrganization}
            organization={organization}
          />
        </Drawer>
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
          disabled={updating}
        >
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select
            labelId="role-select-label"
            id="role-select"
            value={user?.group}
            onChange={(e) => handlerUserChanges(e, 'group')}
            label="Role"
          >
            <MenuItem value="" disabled>
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
            color="info"
            sx={{
              marginRight: '.25em',
              width: '127px',
              height: '36px',
              textTransform: 'none'
            }}
            onClick={handleSaveChanges}
            disabled={updating || !isEdited || selectOrganizationID === -1}
          >
            Save changes
          </Button>
          <Button
            sx={{
              marginLeft: '10px',
              textTransform: 'none',
              height: '36px',
              width: '127px'
            }}
            variant="outlined"
            color="info"
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
            sx={{
              marginLeft: '.25em',
              width: '127px',
              height: '36px',
              textTransform: 'none'
            }}
            variant="contained"
            color="inherit"
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
