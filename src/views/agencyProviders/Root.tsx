import { useState, useCallback, useMemo, ChangeEvent } from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  Pagination,
  TableContainer,
  TableHead,
  Toolbar,
  TableRow,
  Select,
  MenuItem
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { zonedTimeToUtc, format } from 'date-fns-tz';
import SearchBar from 'material-ui-search-bar';
import FormControl from '@mui/material/FormControl';
import { SyntheticEvent } from 'react-draft-wysiwyg';
import AgencyProviderRow from './AgencyProviderRow';
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../routes/paths';
import useGetAgencyProviders, {
  AgencyProviderDetails
} from '../../hooks/domain/queries/useGetAgencyProviders';
import CreateAgencyProviderDialog from './CreateAgencyProviderDialog';
import EditAgencyProviderDialog from './EditAgencyProviderDialog';

const useStyles = makeStyles((theme) => ({
  searchRoot: {
    marginLeft: theme.spacing(1),
    '&.Mui-disabled': {
      pointerEvents: 'auto',
      cursor: 'help'
    },
    width: '180px',
    height: '40px',
    padding: '0px 0px 2.25px 0px'
  },
  justify: {
    justifyContent: 'center'
  }
}));

const AgencyProviders: React.FC = () => {
  const classes = useStyles();
  const { data: agencyProviders } = useGetAgencyProviders();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [
    agencyProviderToEdit,
    setAgencyProviderToEdit
  ] = useState<AgencyProviderDetails>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [searched, setSearched] = useState<string>('');
  const [searchOption, setSearchOption] = useState('Search By');

  const handleChange = (
    event: ChangeEvent<{
      name?: string | undefined;
      value: string;
      event: Event | SyntheticEvent;
    }>
  ) => {
    setSearchOption(event?.target.value);
  };

  const [page, setPage] = useState(0);
  const PER_PAGE = 10;

  const handleClick = useCallback(
    (agencyProvider: AgencyProviderDetails) => {
      setAgencyProviderToEdit(agencyProvider);
      setIsEditDialogOpen(true);
    },
    [setIsEditDialogOpen, setAgencyProviderToEdit]
  );

  const filteredRows = useMemo(() => {
    const lowerCaseSearch = searched.toLocaleLowerCase();
    setPage(0);
    if (searchOption === 'Provider Name') {
      return agencyProviders?.filter(
        (row) =>
          row.firstName.toLowerCase().includes(lowerCaseSearch) ||
          row.middleName.toLowerCase().includes(lowerCaseSearch) ||
          row.lastName.toLowerCase().includes(lowerCaseSearch)
      );
    }

    if (searchOption === 'Business Name') {
      return agencyProviders?.filter((row) =>
        row.businessName.toLowerCase().includes(lowerCaseSearch)
      );
    }

    if (searchOption === 'Dodd Number') {
      return agencyProviders?.filter((row) =>
        row.doddNumber.includes(searched)
      );
    }

    return agencyProviders;
  }, [agencyProviders, searchOption, searched]);

  return (
    <Page title="Agency Provider | Sonar">
      <HeaderDashboard
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: 'Agency Provider' }
        ]}
        heading="Agency Provider"
      />
      <Paper elevation={4}>
        <TableContainer>
          <Toolbar>
            <Button
              variant="outlined"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              Add Agency Provider
            </Button>
            <FormControl classes={{ root: classes.searchRoot }}>
              <Select
                labelId="searchBy"
                id="searchBy"
                value={searchOption}
                onChange={handleChange}
                sx={{
                  height: '40px'
                }}
              >
                <MenuItem value="Search By">Search By</MenuItem>
                <MenuItem value="Provider Name">Provider Name</MenuItem>
                <MenuItem value="Business Name">Business Name</MenuItem>
                <MenuItem value="Dodd Number">DoDD Number</MenuItem>
              </Select>
            </FormControl>
            {searchOption && searchOption !== 'Search By' && (
              <SearchBar
                placeholder={`Search By ${searchOption}`}
                value={searched}
                onChange={(searchVal: string) => setSearched(searchVal)}
                onCancelSearch={() => setSearched('')}
              />
            )}
          </Toolbar>
          <Table sx={{ minWidth: 480 }} arai-label="agencyProviders">
            <TableHead>
              <TableRow>
                <TableCell align="right">Edit</TableCell>
                <TableCell>Agency Provider ID</TableCell>
                <TableCell>DoDD Number</TableCell>
                <TableCell>Nation Provider ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Middle Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Suffix</TableCell>
                <TableCell>Business Name</TableCell>
                <TableCell>Business TIN</TableCell>
                <TableCell>Business Address 1</TableCell>
                <TableCell>Business Address 2</TableCell>
                <TableCell>Business City</TableCell>
                <TableCell>Business State</TableCell>
                <TableCell>Business Zip</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Last Modified</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows &&
                filteredRows
                  .slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)
                  .filter((agencyProvider) => agencyProvider.doddNumber !== '0')
                  .map((agencyProvider, i) => (
                    <AgencyProviderRow
                      key={i}
                      handleClick={() => handleClick(agencyProvider)}
                      agencyProviderId={agencyProvider.agencyProviderId}
                      doddNumber={agencyProvider.doddNumber}
                      nationalProviderId={agencyProvider.nationalProviderId}
                      firstName={agencyProvider.firstName}
                      middleName={agencyProvider.middleName}
                      lastName={agencyProvider.lastName}
                      suffix={agencyProvider.suffix}
                      businessName={agencyProvider.businessName}
                      businessTIN={agencyProvider.businessTIN}
                      businessAddress1={agencyProvider.businessAddress1}
                      businessAddress2={agencyProvider.businessAddress2}
                      businessCity={agencyProvider.businessCity}
                      businessState={agencyProvider.businessState}
                      businessZip={agencyProvider.businessZip}
                      createdTimestamp={format(
                        zonedTimeToUtc(
                          agencyProvider.createdTimestamp,
                          'America/New_York'
                        ),
                        "yyyy-MM-dd hh:mm aaaaa'm'"
                      )}
                      lastModifiedTimestamp={format(
                        zonedTimeToUtc(
                          agencyProvider.lastModifiedTimestamp,
                          'America/New_York'
                        ),
                        "yyyy-MM-dd hh:mm aaaaa'm'"
                      )}
                    />
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Pagination
        classes={{ ul: classes.justify }}
        page={page + 1}
        onChange={(event, value) => setPage(value - 1)}
        count={Math.ceil((filteredRows?.length || 0) / PER_PAGE)}
        shape="rounded"
        size="small"
        sx={{ paddingBottom: '12px' }}
      />
      <CreateAgencyProviderDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
      {agencyProviderToEdit && isEditDialogOpen && (
        <EditAgencyProviderDialog
          onClose={() => setIsEditDialogOpen(false)}
          agencyProvider={agencyProviderToEdit}
        />
      )}
    </Page>
  );
};

export default AgencyProviders;
