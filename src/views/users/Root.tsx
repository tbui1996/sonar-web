import { ChangeEvent, useEffect, useState } from 'react';

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
  TablePagination
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@mui/styles';

import { PATH_DASHBOARD } from '../../routes/paths';
import { Organization, User, Users } from '../../@types/users';
import mapUserDisplayName from '../../utils/mapUserDisplayName';
import axios from '../../utils/axios';
import Edit from './Edit';
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import LoadingScreen from '../../components/LoadingScreen';
import dashIfNullOrEmpty from '../../utils/dashIfNullOrEmpty';

const useStyles = makeStyles({
  paginationRoot: {
    width: '100%'
  }
});

export default function UserRoles() {
  const [users, setUsers] = useState<Users>();
  const [organizations, setOrganizations] = useState<Array<Organization>>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editView, setEditView] = useState(false);

  const [user, setUser] = useState<User>();
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

  useEffect(() => {
    async function execute() {
      const [userList, organizations] = await Promise.all([
        axios.get<Users>('/users/user_list'),
        axios.get<Array<Organization>>('/users/organizations')
      ]);

      if (!userList.data) {
        console.log('Expected users to exist and be an array');
      }

      if (!organizations.data) {
        console.log('Expected organizations to exist and be an array');
      }

      const users = mapUserDisplayName(userList?.data?.users || []);
      setUsers({
        paginationToken: userList?.data?.paginationToken,
        users
      });

      setOrganizations(organizations.data);
    }

    setLoading(true);
    execute()
      .catch((e) => {
        console.error(e);
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
                              {dashIfNullOrEmpty(user.organization?.name)}
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
                                user.group === '' ? 'No role' : 'Supervisor'
                              }
                              color={user.group === '' ? 'default' : 'primary'}
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
            <Edit
              user={user}
              users={users}
              handleClick={handleClick}
              setEditView={setEditView}
              setUser={setUser}
              setUsers={setUsers}
              organizations={organizations}
            />
          )}
        </Card>
      </Container>
    </Page>
  );
}
