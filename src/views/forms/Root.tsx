import { useEffect, useState, useCallback } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams
} from '@mui/x-data-grid';
import { makeStyles } from '@material-ui/core/styles';
import { formatDate } from '@fullcalendar/react';
import { Box, Container, Card, Button } from '@material-ui/core';

import Search from '../../components/Search';
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../routes/paths';
import LoadingScreen from '../../components/LoadingScreen';
import axios from '../../utils/axios';
import dashIfNullOrEmpty from '../../utils/dashIfNullOrEmpty';

export const useStyles = makeStyles({
  table: {
    width: '100%',
    '& .MuiDataGrid-columnHeaderTitle, & .MuiDataGrid-cell': {
      whiteSpace: 'normal',
      lineHeight: '1.5!important',
      maxHeight: 'fit-content!important',
      minHeight: 'auto!important',
      display: 'flex',
      alignItems: 'center'
    },

    '& .MuiDataGrid-columnHeaderWrapper': {
      maxHeight: 'none!important',
      flex: '1 0 auto'
    },

    '&.MuiDataGrid-root .MuiDataGrid-cell:focus, &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within': {
      outline: 'none'
    }
  }
});

export type Form = {
  id: string;
  title: string;
  description: string;
  creator: string;
  created: string;
};

const minDateVal = '0001-01-01T00:00:00Z';

export default function Forms() {
  const history = useHistory();
  const [forms, setForms] = useState<Array<Form>>([]);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [filteredItems, setFilteredItems] = useState<Array<Form>>([]);

  const getFormattedDate = (date: string) =>
    formatDate(date, {
      month: 'numeric',
      year: 'numeric',
      day: 'numeric',
      timeZone: 'UTC'
    });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.4 },
    { field: 'title', headerName: 'Title', flex: 1 },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.5,
      type: 'string',
      valueFormatter: (params: GridValueFormatterParams) =>
        dashIfNullOrEmpty(params?.value as string)
    },
    {
      field: 'creator',
      headerName: 'Creator',
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) =>
        dashIfNullOrEmpty(params?.value as string)
    },
    {
      field: 'created',
      headerName: 'Created',
      flex: 0.7,
      type: 'date',
      valueFormatter: (params: GridValueFormatterParams) =>
        getFormattedDate(params?.value as string)
    },
    {
      field: 'sent',
      headerName: 'Last Sent',
      flex: 0.7,
      type: 'date',
      valueFormatter: (params: GridValueFormatterParams) => {
        if (params?.value === minDateVal) return '-';
        return getFormattedDate(params?.value as string);
      }
    }
  ];

  useEffect(() => {
    async function execute() {
      const res = await axios.get<Array<Form>>(`/forms`);

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

  function updateFilteredItems(values: Array<Form>) {
    setFilteredItems(values as Array<Form>);
  }

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
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  paddingBottom: '1em',
                  width: '100%'
                }}
              >
                <Search
                  originalData={forms}
                  searchColumnNames={[
                    'title',
                    'description',
                    'created',
                    'creator',
                    'sent'
                  ]}
                  filterData={updateFilteredItems}
                />
                <Button
                  component={RouterLink}
                  variant="contained"
                  to="/dashboard/forms/create"
                >
                  Create Form
                </Button>
              </Box>
              <DataGrid
                onRowClick={(param) => handleClick(param.row.id)}
                columns={columns}
                rows={filteredItems}
                className={classes.table}
                disableColumnMenu
                autoHeight
              />
            </>
          )}
        </Card>
      </Container>
    </Page>
  );
}
