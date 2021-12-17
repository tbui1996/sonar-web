import { useEffect, useState, useCallback } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridValueFormatterParams
} from '@mui/x-data-grid';
import {
  Box,
  Container,
  Card,
  Button,
  Drawer,
  IconButton
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import Search from '../../components/Search';
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../routes/paths';
import LoadingScreen from '../../components/LoadingScreen';
import axios from '../../utils/axios';
import dashIfNullOrEmpty from '../../utils/dashIfNullOrEmpty';
import { Form, FormToEditProps } from '../../@types/form';
import FormEdit from './Edit';
import { useStyles, getFormattedDate } from '../../utils/tableStyles';

const DRAWER_WIDTH = 400;
const minDateVal = '0001-01-01T00:00:00Z';

export default function Forms() {
  const history = useHistory();
  const [forms, setForms] = useState<Array<Form>>([]);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [filteredItems, setFilteredItems] = useState<Array<Form>>([]);
  const [open, setOpen] = useState(false);
  const [formToEdit, setFormToEdit] = useState<FormToEditProps | null>();

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
    },
    {
      field: 'edit',
      headerName: 'Edit',
      flex: 0.4,
      type: 'date',
      sortable: false,
      renderCell: () => (
        <IconButton color="primary">
          <EditIcon />
        </IconButton>
      )
    }
  ];

  function handleTableDisplay(
    id: string,
    title?: string,
    description?: string
  ) {
    const index = forms.findIndex((form) => form.id === id);
    if (index < 0) {
      return;
    }

    if (title && (description || description === '')) {
      const editedRow = forms[index];
      setForms([
        ...forms.slice(0, index),
        { ...editedRow, title, description },
        ...forms.slice(index + 1)
      ]);
    } else {
      setForms([...forms.slice(0, index), ...forms.slice(index + 1)]);
    }
  }

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
    (param: GridCellParams) => {
      if (param?.colDef?.headerName === 'Edit') {
        setFormToEdit({
          id: param.row.id,
          title: param.row.title,
          description: param.row.description
        });
        setOpen(!open);
      } else {
        history.push(`/dashboard/forms/${param.row.id}`);
      }
    },
    [history, open]
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
              {formToEdit && (
                <Drawer
                  anchor="right"
                  open={open}
                  PaperProps={{
                    sx: { width: DRAWER_WIDTH }
                  }}
                >
                  <FormEdit
                    data={formToEdit}
                    updateData={setFormToEdit}
                    setOpen={setOpen}
                    handleTableDisplay={handleTableDisplay}
                  />
                </Drawer>
              )}
              <DataGrid
                onCellClick={handleClick}
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
