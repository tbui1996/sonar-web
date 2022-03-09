import { useState, useCallback, useEffect } from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
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
  const [rows, setRows] = useState<AgencyProviderDetails[] | undefined>(
    agencyProviders
  );
  const [searched, setSearched] = useState<string>('');
  const [searchOption, setSearchOpen] = useState('Search By');

  const handleChange = (e: any) => {
    setSearchOpen(e?.target.value);
  };

  useEffect(() => {
    setRows(agencyProviders);
  }, [setRows, agencyProviders]);

  const handleClick = useCallback(
    (agencyProvider: AgencyProviderDetails) => {
      setAgencyProviderToEdit(agencyProvider);
      setIsEditDialogOpen(true);
    },
    [setIsEditDialogOpen, setAgencyProviderToEdit]
  );

  const requestSearch = (searchedVal: string, searchOption: string) => {
    let filteredRows;
    const lowerCaseSearch = searchedVal.toLocaleLowerCase();
    if (searchOption === 'Provider Name') {
      filteredRows = agencyProviders?.filter(
        (row) =>
          row.firstName.toLowerCase().includes(lowerCaseSearch) ||
          row.middleName.toLowerCase().includes(lowerCaseSearch) ||
          row.lastName.toLowerCase().includes(lowerCaseSearch)
      );
    }

    if (searchOption === 'Business Name') {
      filteredRows = agencyProviders?.filter((row) =>
        row.businessName.toLowerCase().includes(lowerCaseSearch)
      );
    }

    if (searchOption === 'Dodd Number') {
      filteredRows = agencyProviders?.filter((row) =>
        row.doddNumber.includes(searchedVal)
      );
    }

    setRows(filteredRows);
  };

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched, searchOption);
  };

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
                onChange={(searchVal: string) =>
                  requestSearch(searchVal, searchOption)
                }
                onCancelSearch={() => cancelSearch()}
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
              {rows &&
                rows.map((agencyProvider, i) => (
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
