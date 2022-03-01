import { useState, useCallback } from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Toolbar,
  TableRow
} from '@material-ui/core';
import { zonedTimeToUtc, format } from 'date-fns-tz';
import AgencyProviderRow from './AgencyProviderRow';
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../routes/paths';
import useGetAgencyProviders, {
  AgencyProviderDetails
} from '../../hooks/domain/queries/useGetAgencyProviders';
import CreateAgencyProviderDialog from './CreateAgencyProviderDialog';
import EditAgencyProviderDialog from './EditAgencyProviderDialog';

const AgencyProviders: React.FC = () => {
  const { data: agencyProviders } = useGetAgencyProviders();
  console.log({ agencyProviders });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [
    agencyProviderToEdit,
    setAgencyProviderToEdit
  ] = useState<AgencyProviderDetails>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleClick = useCallback(
    (agencyProvider: AgencyProviderDetails) => {
      setAgencyProviderToEdit(agencyProvider);
      setIsEditDialogOpen(true);
    },
    [setIsEditDialogOpen, setAgencyProviderToEdit]
  );

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
              {agencyProviders &&
                agencyProviders.map((agencyProvider, i) => (
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
