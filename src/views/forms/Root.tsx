import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

import { Link as RouterLink, useHistory } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from '@material-ui/core';

import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../routes/paths';
import LoadingScreen from '../../components/LoadingScreen';

type Form = {
  id: string;
  title: string;
  description: string;
  created: string;
};

export default function Forms() {
  const history = useHistory();
  const [forms, setForms] = useState<Array<Form>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function execute() {
      const res = await axios.get<Array<Form>>(
        'https://api.sonar.circulo.dev/forms'
      );

      if (!res.data || !Array.isArray(res.data)) {
        console.log('Expected forms to exist and be an array');
      }

      setForms(res.data || []);
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

  const handleClick = useCallback(
    (formId: string) => {
      history.push(`/dashboard/forms/${formId}`);
    },
    [history]
  );

  return (
    <Page title="Forms | Sonar">
      <Container maxWidth="xl">
        <HeaderDashboard
          heading="Forms"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Forms' }
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
          {!loading && (
            <TableContainer sx={{ minWidth: 480 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {forms.map((form) => (
                    <TableRow
                      key={form.id}
                      hover
                      onClick={() => handleClick(form.id)}
                    >
                      <TableCell>
                        <Typography variant="body2">{form.id}</Typography>
                      </TableCell>
                      <TableCell>{form.title}</TableCell>
                      <TableCell>
                        {new Date(form.created).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Button
            component={RouterLink}
            variant="contained"
            to="/dashboard/forms/create"
            sx={{ marginTop: '1rem' }}
          >
            Create Form
          </Button>
        </Card>
      </Container>
    </Page>
  );
}
