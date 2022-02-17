import {
  Button,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Toolbar,
  Tooltip,
  TableRow
} from '@material-ui/core';
import { zonedTimeToUtc, format, utcToZonedTime } from 'date-fns-tz';
import AgencyProviderRow from './AgencyProviderRow';
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../routes/paths';
import useGetAgencyProviders from '../../hooks/domain/queries/useGetAgencyProviders';

const useStyles = makeStyles((theme) => ({
  deleteButtonRoot: {
    marginLeft: theme.spacing(1),
    '&.Mui-disabled': {
      pointerEvents: 'auto',
      cursor: 'help'
    }
  }
}));

const formatInTimeZone = (
  date: string | number | Date,
  fmt: string,
  tz: string
) => format(utcToZonedTime(date, tz), fmt, { timeZone: tz });

const AgencyProviders: React.FC = () => {
  const classes = useStyles();
  const { data: agencyProviders } = useGetAgencyProviders();

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
            <Button variant="outlined">Add Patient</Button>
            <Tooltip title="Select Agency Provider to delete them">
              <div>
                <Button
                  sx={{ marginLeft: '8px' }}
                  classes={{
                    root: classes.deleteButtonRoot
                  }}
                  variant="contained"
                >
                  Delete Selected
                </Button>
              </div>
            </Tooltip>
          </Toolbar>
          <Table sx={{ minWidth: 480 }} arai-label="Patients">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell>Agency Provider ID</TableCell>
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
                    agencyProviderId={agencyProvider.agencyProviderId}
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
    </Page>
  );
};

export default AgencyProviders;
