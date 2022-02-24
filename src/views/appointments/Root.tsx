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
import { zonedTimeToUtc, format } from 'date-fns-tz';
import AppointmentRow from './AppointmentRow';
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../routes/paths';
import useGetPatientAppointments from '../../hooks/domain/queries/useGetPatientAppointments';

const useStyles = makeStyles((theme) => ({
  deleteButtonRoot: {
    marginLeft: theme.spacing(1),
    '&.Mui-disabled': {
      pointerEvents: 'auto',
      cursor: 'help'
    }
  }
}));
const Appointments: React.FC = () => {
  const classes = useStyles();
  const { data: appointments } = useGetPatientAppointments();

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
            <Button variant="outlined">New Appointment</Button>
            <Tooltip title="Select appointments to delete them">
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
          <Table sx={{ minWidth: 480 }} arai-label="appointments">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell>Appointment Created</TableCell>
                <TableCell>Appointment Status</TableCell>
                <TableCell>Appointment Status Changed On</TableCell>
                <TableCell>Appointment Scheduled</TableCell>
                <TableCell>Patient First Name</TableCell>
                <TableCell>Patient Middle Name</TableCell>
                <TableCell>Patient Last Name</TableCell>
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
              {appointments &&
                appointments.map((appointment, i) => (
                  <AppointmentRow
                    key={i}
                    agencyProviderId={appointment.agencyProviderId}
                    firstName={appointment.firstName}
                    middleName={appointment.middleName}
                    lastName={appointment.lastName}
                    providerFullName={appointment.providerFullName}
                    appointmentCreated={format(
                      zonedTimeToUtc(
                        appointment.appointmentCreated,
                        'America/New_York'
                      ),
                      "yyyy-MM-dd hh:mm aaaaa'm'"
                    )}
                    appointmentId={appointment.appointmentId}
                    appointmentNotes={appointment.appointmentNotes}
                    appointmentOtherPurpose={
                      appointment.appointmentOtherPurpose
                    }
                    appointmentPurpose={appointment.appointmentPurpose}
                    appointmentScheduled={format(
                      zonedTimeToUtc(
                        appointment.appointmentScheduled,
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
                    circulatorDriverFullName={
                      appointment.circulatorDriverFullName
                    }
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
                    patientChiefComplaint={appointment.patientChiefComplaint}
                    patientId={appointment.patientId}
                    patientPulseBeatsPerMinute={
                      appointment.patientPulseBeatsPerMinute
                    }
                    patientRespirationsPerMinute={
                      appointment.patientRespirationsPerMinute
                    }
                    patientSystolicBloodPressure={
                      appointment.patientSystolicBloodPressure
                    }
                    patientWeightLbs={appointment.patientWeightLbs}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Page>
  );
};

export default Appointments;
