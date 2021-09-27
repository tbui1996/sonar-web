import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import {
  Box,
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Card,
  TablePagination,
  makeStyles,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
// import axios from 'axios';
import { useSnackbar } from 'notistack';
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../routes/paths';
import LoadingScreen from '../../components/LoadingScreen';
import { User, Users } from '../../@types/users';
import { MIconButton } from '../../components/@material-extend';
import mapUserDisplayName from '../../utils/mapUserDisplayName';
import axios from '../../utils/axios';

const useStyles = makeStyles({
  paginationRoot: {
    width: '100%'
  }
});

export default function UserRoles() {
  const [users, setUsers] = useState<Users>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editView, setEditView] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [user, setUser] = useState<User>();
  const [updating, setUpdating] = useState(false);
  const classes = useStyles();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (user: User | undefined) => {
    setEditView(!editView);
    setUser(user);
  };

  const handleChange = (event: ChangeEvent<{ value: string }>) => {
    if (user) {
      setUser({
        ...user,
        group: event.target.value
      });
    }
  };

  const handleSaveChanges = useCallback(async () => {
    if (users && user) {
      setUpdating(true);
      const res = await axios
        .put(`/users/group_assign`, {
          username: user.email,
          group: user.group
        })
        .catch((e) => {
          console.log(e);
        });

      if (res) {
        setUpdating(false);
        setEditView(false);

        const usersCopy = users.users;
        const userIndex = usersCopy?.findIndex((item) => item.sub === user.sub);
        usersCopy[userIndex].group = user.group;

        setUsers({
          paginationToken: users?.paginationToken,
          users: usersCopy
        });

        setUser(undefined);
      } else {
        setUpdating(false);
        enqueueSnackbar('Save failed', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
    }
  }, [closeSnackbar, enqueueSnackbar, user, users]);

  useEffect(() => {
    async function execute() {
      const res = await axios.get('/users/user_list');
      // const res = await axios.get<Users>(
      //   `https://api.${process.env.REACT_APP_BASE_API_DOMAIN}/users/user_list`
      // );

      if (!res.data) {
        console.log('Expected users to exist and be an array');
      }

      const users = mapUserDisplayName(res.data.users);
      setUsers({
        paginationToken: res.data.paginationToken,
        users
      });
    }

    setLoading(true);
    execute()
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Page title="Users | Sonar">
      <Container maxWidth="xl">
        <HeaderDashboard
          heading="Users"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Users' }
          ]}
        />
        <Card
          sx={{
            minHeight: '50vh',
            paddingTop: '2rem',
            paddingBottom: '2rem',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {loading && (
            <Box
              width="100%"
              display="flex"
              padding="3rem"
              alignItems="center"
              justifyContent="center"
            >
              <LoadingScreen />
            </Box>
          )}
          {!loading && !editView && (
            <>
              <TableContainer sx={{ minWidth: 480 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Organization</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users?.users
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((user) => (
                        <TableRow key={user.email} hover>
                          <TableCell
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center'
                            }}
                          >
                            <Avatar sx={{ marginRight: '5%' }}>
                              {user.firstName
                                ? user.firstName.substr(0, 1).toUpperCase()
                                : user.email.substr(0, 1).toUpperCase()}
                              {user.firstName &&
                                user.lastName &&
                                `${user.lastName.substr(0, 1).toUpperCase()}`}
                            </Avatar>
                            <Typography variant="body1">
                              <strong>{user.displayName}</strong>
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1">
                              {user.organization}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1">
                              {user.email}
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              flexDirection: 'row',
                              justifyContent: 'space-between'
                            }}
                          >
                            <Chip
                              label={
                                user.group === 'no_group'
                                  ? 'No role'
                                  : 'Supervisor'
                              }
                              color={
                                user.group === 'no_group'
                                  ? 'default'
                                  : 'primary'
                              }
                            />
                            <IconButton
                              aria-label="edit"
                              onClick={() => handleClick(user)}
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                classes={{
                  root: classes.paginationRoot
                }}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={users?.users.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
          {!loading && editView && user && (
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
                  label="First Name"
                  variant="outlined"
                  value={user.firstName}
                  disabled
                />
                <TextField
                  sx={{ flexGrow: 1, marginLeft: '1em' }}
                  id="lastName"
                  label="Last Name"
                  variant="outlined"
                  value={user.lastName}
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
                  disabled
                  sx={{ flexGrow: 1, marginRight: '1em', width: '100% ' }}
                >
                  <InputLabel id="org-select-label">Organization</InputLabel>
                  <Select
                    labelId="org-select-label"
                    id="organization-select"
                    value={
                      user.organization
                        ? user.organization.toLowerCase()
                        : 'none'
                    }
                    onChange={() => console.log('test')}
                    label="Organization"
                  >
                    <MenuItem value="none">No Organization</MenuItem>
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
                  value={user.email}
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
                    value={user.group}
                    onChange={handleChange}
                    label="Role"
                  >
                    <MenuItem value="no_group" disabled>
                      No Role
                    </MenuItem>
                    <MenuItem value="externals_supervisor">Supervisor</MenuItem>
                  </Select>
                </FormControl>
                <div
                  style={{ flexGrow: 1, marginLeft: '1em', width: '100%' }}
                />
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
                    sx={{ marginRight: '.25em', flexGrow: 1 }}
                    onClick={handleSaveChanges}
                    disabled={updating}
                  >
                    Save Changes
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
                  style={{ flexGrow: 1, marginLeft: '1em', width: '100%' }}
                />
              </div>
            </div>
          )}
        </Card>
      </Container>
    </Page>
  );
}
