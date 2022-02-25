import { useState } from 'react';
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
import AppointmentRow from './AppointmentRow';
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../routes/paths';
import useGetPatientAppointments from '../../hooks/domain/queries/useGetPatientAppointments';
import CreateAppointmentDialog from './CreateAppointmentDialog';

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

const Appointments: React.FC = () => {
  const classes = useStyles();
  const { data: appointments } = useGetPatientAppointments();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  console.log({ appointments });
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
              {appointments &&
                appointments.map((appointment, i) => (
                  <AppointmentRow
                    key={i}
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
                    circuloConsentFormLink={appointment.circuloConsentFormLink}
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
                    patientChiefComplaint={appointment.patientChiefComplaint}
                    insuranceId={appointment.insuranceId}
                    agencyProviderId={appointment.agencyProviderId}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <CreateAppointmentDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </Page>
  );
};

export default Appointments;
