import { useState, useCallback, useEffect, Key } from 'react';
import {
  Box,
  Drawer,
  Button,
  makeStyles,
  MenuItem,
  Select,
  Paper,
  Table,
  TableBody,
  Pagination,
  TableCell,
  TableContainer,
  TableHead,
  Toolbar,
  Tooltip,
  TableRow,
  Typography
} from '@material-ui/core';
import { zonedTimeToUtc, format, utcToZonedTime } from 'date-fns-tz';
import SearchBar from 'material-ui-search-bar';
import FormControl from '@mui/material/FormControl';
import AppointmentRow, { AppointmentDetails } from './AppointmentRow';
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import useDeleteAppointment from '../../hooks/domain/mutations/useDeleteAppointments';
import { PATH_DASHBOARD } from '../../routes/paths';
import useGetPatientAppointments from '../../hooks/domain/queries/useGetPatientAppointments';
import CreateAppointmentDialog from './CreateAppointmentDialog';
import EditAppointmentDialog from './EditAppointmentDialog';
import { AppointmentDetailsRequest } from '../../hooks/domain/mutations/useEditAppointments';
import ConfirmDialog from '../../components/general/app/ConfirmDialog';
import ViewAppointmentDialog from './ViewAppointmentDialog';

const DRAWER_WIDTH = 400;

const useStyles = makeStyles((theme) => ({
  deleteButtonRoot: {
    marginLeft: theme.spacing(1),
    '&.Mui-disabled': {
      pointerEvents: 'auto',
      cursor: 'help'
    }
  },
  searchRoot: {
    marginLeft: theme.spacing(1),
    '&.Mui-disabled': {
      pointerEvents: 'auto',
      cursor: 'help'
    },
    width: '180px',
    height: '40px',
    padding: '0px 0px 10px 0px'
  }
}));

export const formatInTimeZone = (
  date: string | number | Date,
  fmt: string,
  tz: string
) => format(utcToZonedTime(date, tz), fmt, { timeZone: tz });

const Appointments: React.FC = () => {
  const classes = useStyles();
  const { data: appointments } = useGetPatientAppointments();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<
    AppointmentDetailsRequest | undefined
  >();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const {
    mutateAsync: deleteAppointment,
    isLoading: isDeleting
  } = useDeleteAppointment();
  const [selectedAppointmentIds, setSelectedAppointmentIds] = useState<
    Record<string, boolean>
  >({});
  const [appointmentToView, setAppointmentToView] = useState<
    AppointmentDetails | undefined
  >();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [page, setPage] = useState(0);
  const PER_PAGE = 2;

  const [collection, setCollection] = useState<AppointmentDetails[]>();

  const [filterCollection, setFilteredCollection] = useState<
    AppointmentDetails[]
  >();

  const searchData = (val: any, searchOption: string) => {
    const query = val.toLowerCase();
    console.log('what du heck is query: ', query);
    setPage(0);
    if (query === '') {
      setFilteredCollection(appointments);
    } else {
      const apts = collection;
      if (searchOption === 'Provider Name') {
        const data = apts?.filter((item) =>
          item.providerFullName.toLowerCase().includes(query)
        );
        setFilteredCollection(data);
      }
      if (searchOption === 'Patient Name') {
        const data = apts?.filter(
          (item) =>
            item.firstName.toLowerCase().includes(query) ||
            item.middleName.toLowerCase().includes(query) ||
            item.lastName.toLowerCase().includes(query)
        );
        setFilteredCollection(data);
      }
    }
  };

  const [searched, setSearched] = useState<string>('');
  const [searchOption, setSearchOpen] = useState('Search By');

  const handleChange = (e: any) => {
    setSearchOpen(e?.target.value);
  };

  useEffect(() => {
    setCollection(appointments);
    setFilteredCollection(appointments);
  }, [searched, appointments, setPage]);

  const selectedAppointments = appointments?.filter(
    (f) => selectedAppointmentIds[f.appointmentId]
  );

  const toggleAppointmentSelection = (appointmentId: string) =>
    setSelectedAppointmentIds((cur) => ({
      ...cur,
      [appointmentId]: !cur[appointmentId]
    }));

  const handleClick = useCallback(
    (appointment: AppointmentDetailsRequest) => {
      appointment.appointmentScheduled = formatInTimeZone(
        appointment.appointmentScheduled,
        "yyyy-MM-dd'T'HH:mm",
        'America/New_York'
      );
      setAppointmentToEdit(appointment);
      setIsEditDialogOpen(true);
    },
    [setIsEditDialogOpen, setAppointmentToEdit]
  );

  const handleViewAppointment = useCallback(
    (appointment: AppointmentDetails) => {
      setAppointmentToView(appointment);
      setIsViewDialogOpen(true);
    },
    [setAppointmentToView, setIsViewDialogOpen]
  );

  const cancelSearch = () => {
    setFilteredCollection(collection);
    setSearched('');
  };

  return (
    <Page title="Appointments | Sonar">
      <HeaderDashboard
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: 'Appointments' }
        ]}
        heading="Appointments"
      />
      <Paper elevation={4}>
        <TableContainer>
          <Toolbar>
            <Button
              variant="outlined"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              New Appointment
            </Button>
            <Tooltip title="Select appointments to delete them">
              <div>
                <Button
                  sx={{ marginLeft: '8px' }}
                  classes={{
                    root: classes.deleteButtonRoot
                  }}
                  variant="contained"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                >
                  Delete Selected
                </Button>
              </div>
            </Tooltip>
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
                <MenuItem value="Patient Name">Patient Name</MenuItem>
                <MenuItem value="Provider Name">Provider Name</MenuItem>
              </Select>
            </FormControl>
            {searchOption && searchOption !== 'Search By' && (
              <SearchBar
                placeholder={`Search by ${searchOption}`}
                value={searched}
                onChange={(e) => searchData(e, searchOption)}
                onCancelSearch={() => cancelSearch()}
              />
            )}
          </Toolbar>
          <Table sx={{ minWidth: 480 }} arai-label="appointments">
            <TableHead>
              <TableRow>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="left">View</TableCell>
                <TableCell padding="checkbox">Delete</TableCell>
                <TableCell>Appointment Id</TableCell>
                <TableCell>Appointment Created</TableCell>
                <TableCell>Appointment Status</TableCell>
                <TableCell>Appointment Status Changed On</TableCell>
                <TableCell>Appointment Scheduled</TableCell>
                <TableCell>Patient First Name</TableCell>
                <TableCell>Patient Middle Name</TableCell>
                <TableCell>Patient Last Name</TableCell>
                <TableCell>Circulator Driver Full Name</TableCell>
                <TableCell>Provider Full Name</TableCell>
                <TableCell>Appointment Purpose</TableCell>
                <TableCell>Appointment Other Purpose</TableCell>
                <TableCell>Appointment Notes</TableCell>
                <TableCell>Suffix</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Primary Language</TableCell>
                <TableCell>Preferred Gender</TableCell>
                <TableCell>Email Address</TableCell>
                <TableCell>Home Address 1</TableCell>
                <TableCell>Home Address 2</TableCell>
                <TableCell>Home City</TableCell>
                <TableCell>Home State</TableCell>
                <TableCell>Home Zip</TableCell>
                <TableCell>Signed Circulo Consent Form</TableCell>
                <TableCell>Circulo Consent Form Link</TableCell>
                <TableCell>Signed StationMD Consent Form</TableCell>
                <TableCell>StationMD Consent Form Link</TableCell>
                <TableCell>Completed Go Sheet</TableCell>
                <TableCell>Marked As Active</TableCell>
                <TableCell>Created Timestamp</TableCell>
                <TableCell>Last Modified Timestamp</TableCell>
                <TableCell>National Provider ID</TableCell>
                <TableCell>Business Name</TableCell>
                <TableCell>Business TIN</TableCell>
                <TableCell>Business Address 1</TableCell>
                <TableCell>Business Address 2</TableCell>
                <TableCell>Business City</TableCell>
                <TableCell>Business State</TableCell>
                <TableCell>Business Zip</TableCell>
                <TableCell>Patient ID</TableCell>
                <TableCell>Patient Home Phone</TableCell>
                <TableCell>Patient Home Living Arrangement</TableCell>
                <TableCell>Patient Home County</TableCell>
                <TableCell>Patient Diastolic Blood Pressure</TableCell>
                <TableCell>Patient Systolic Blood Pressure</TableCell>
                <TableCell>Patient Respirations Per Minute</TableCell>
                <TableCell>Patient Pulse Beats Per Minute</TableCell>
                <TableCell>Patient Weight Lbs</TableCell>
                <TableCell>Patient Chief Complaint</TableCell>
                <TableCell>Insurance ID</TableCell>
                <TableCell>Agency Provider Id</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterCollection &&
                filterCollection
                  .slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)
                  .map(
                    (
                      appointment: AppointmentDetails,
                      i: Key | null | undefined
                    ) => (
                      <AppointmentRow
                        key={i}
                        onSelect={() =>
                          toggleAppointmentSelection(appointment?.appointmentId)
                        }
                        isSelected={
                          !!selectedAppointmentIds[appointment?.appointmentId]
                        }
                        handleClick={() => handleClick(appointment)}
                        handleViewAppointment={() =>
                          handleViewAppointment(appointment)
                        }
                        appointmentId={appointment.appointmentId}
                        appointmentCreated={format(
                          zonedTimeToUtc(
                            appointment.appointmentCreated,
                            'America/New_York'
                          ),
                          "yyyy-MM-dd hh:mm aaaaa'm'"
                        )}
                        appointmentStatus={appointment.appointmentStatus}
                        appointmentStatusChangedOn={format(
                          zonedTimeToUtc(
                            appointment.appointmentStatusChangedOn,
                            'America/New_York'
                          ),
                          "yyyy-MM-dd hh:mm aaaaa'm'"
                        )}
                        appointmentScheduled={format(
                          zonedTimeToUtc(
                            appointment.appointmentScheduled,
                            'America/New_York'
                          ),
                          "yyyy-MM-dd hh:mm aaaaa'm'"
                        )}
                        firstName={appointment.firstName}
                        middleName={appointment.middleName}
                        lastName={appointment.lastName}
                        circulatorDriverFullName={
                          appointment.circulatorDriverFullName
                        }
                        providerFullName={appointment.providerFullName}
                        appointmentPurpose={appointment.appointmentPurpose}
                        appointmentOtherPurpose={
                          appointment.appointmentOtherPurpose
                        }
                        appointmentNotes={appointment.appointmentNotes}
                        suffix={appointment.suffix}
                        dateOfBirth={formatInTimeZone(
                          appointment.dateOfBirth,
                          'yyyy-MM-dd',
                          'UTC'
                        )}
                        primaryLanguage={appointment.primaryLanguage}
                        preferredGender={appointment.preferredGender}
                        emailAddress={appointment.emailAddress}
                        homeAddress1={appointment.homeAddress1}
                        homeAddress2={appointment.homeAddress2}
                        homeCity={appointment.homeCity}
                        homeState={appointment.homeState}
                        homeZip={appointment.homeZip}
                        signedCirculoConsentForm={
                          appointment.signedCirculoConsentForm
                        }
                        circuloConsentFormLink={
                          appointment.circuloConsentFormLink
                        }
                        signedStationMDConsentForm={
                          appointment.signedStationMDConsentForm
                        }
                        stationMDConsentFormLink={
                          appointment.stationMDConsentFormLink
                        }
                        completedGoSheet={appointment.completedGoSheet}
                        markedAsActive={appointment.markedAsActive}
                        createdTimestamp={format(
                          zonedTimeToUtc(
                            appointment.createdTimestamp,
                            'America/New_York'
                          ),
                          "yyyy-MM-dd hh:mm aaaaa'm'"
                        )}
                        lastModifiedTimestamp={format(
                          zonedTimeToUtc(
                            appointment.lastModifiedTimestamp,
                            'America/New_York'
                          ),
                          "yyyy-MM-dd hh:mm aaaaa'm'"
                        )}
                        nationalProviderId={appointment.nationalProviderId}
                        businessName={appointment.businessName}
                        businessTIN={appointment.businessTIN}
                        businessAddress1={appointment.businessAddress1}
                        businessAddress2={appointment.businessAddress2}
                        businessCity={appointment.businessCity}
                        businessState={appointment.businessState}
                        businessZip={appointment.businessZip}
                        patientId={appointment.patientId}
                        patientHomePhone={appointment.patientHomePhone}
                        patientHomeLivingArrangement={
                          appointment.patientHomeLivingArrangement
                        }
                        patientHomeCounty={appointment.patientHomeCounty}
                        patientDiastolicBloodPressure={
                          appointment.patientDiastolicBloodPressure
                        }
                        patientSystolicBloodPressure={
                          appointment.patientSystolicBloodPressure
                        }
                        patientRespirationsPerMinute={
                          appointment.patientRespirationsPerMinute
                        }
                        patientPulseBeatsPerMinute={
                          appointment.patientPulseBeatsPerMinute
                        }
                        patientWeightLbs={appointment.patientWeightLbs}
                        patientChiefComplaint={
                          appointment.patientChiefComplaint
                        }
                        insuranceId={appointment.insuranceId}
                        agencyProviderId={appointment.agencyProviderId}
                      />
                    )
                  )}
            </TableBody>
          </Table>
          <Pagination
            page={page + 1}
            onChange={(event, value) => setPage(value - 1)}
            count={Math.ceil((filterCollection?.length || 0) / PER_PAGE)}
            shape="rounded"
            size="small"
            sx={{ paddingBottom: '12px' }}
          />
        </TableContainer>
      </Paper>

      <CreateAppointmentDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
      {selectedAppointments && (
        <ConfirmDialog
          isConfirming={isDeleting}
          open={isDeleteConfirmOpen}
          title="Are you sure you want to delete these appointments?"
          description={
            <Box>
              <Typography variant="subtitle2">
                By confirming the following appointments will be deleted:
              </Typography>
              <ul style={{ padding: '8px 16px 0 16px' }}>
                {selectedAppointments.map((f) => (
                  <li key={f.appointmentId}>
                    {f.firstName} {f.lastName}
                  </li>
                ))}
              </ul>
            </Box>
          }
          onConfirm={async () => {
            await Promise.all(
              selectedAppointments.map((appointment) =>
                deleteAppointment({ appointmentId: appointment.appointmentId })
              )
            );
            setIsDeleteConfirmOpen(false);
          }}
          onCancel={() => setIsDeleteConfirmOpen(false)}
        />
      )}
      {appointmentToEdit && isEditDialogOpen && (
        <EditAppointmentDialog
          onClose={() => setIsEditDialogOpen(false)}
          appointment={appointmentToEdit}
        />
      )}
      {appointmentToView && isViewDialogOpen && (
        <Drawer
          anchor="right"
          open={isViewDialogOpen}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          <ViewAppointmentDialog
            onClose={() => setIsViewDialogOpen(false)}
            appointment={appointmentToView}
          />
        </Drawer>
      )}
    </Page>
  );
};

export default Appointments;
