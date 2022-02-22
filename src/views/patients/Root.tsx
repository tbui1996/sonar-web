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
import { useCallback, useState } from 'react';
import CreatePatientDialog from './CreatePatientDialog';
import PatientRow, { PatientDetails } from './PatientRow';
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../routes/paths';
import useGetPatients from '../../hooks/domain/queries/useGetPatients';
import EditPatientDialog from './EditPatientDialog';

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

const Patients: React.FC = () => {
  const classes = useStyles();
  const { data: patients } = useGetPatients();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<PatientDetails | null>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleClick = useCallback(
    (patient: PatientDetails) => {
      patient.patientDateOfBirth = formatInTimeZone(
        patient.patientDateOfBirth,
        'yyyy-MM-dd',
        'UTC'
      );

      setPatientToEdit(patient);
      setIsEditDialogOpen(true);
    },
    [setIsEditDialogOpen, setPatientToEdit]
  );
  return (
    <Page title="Patients | Sonar">
      <HeaderDashboard
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: 'Patients' }
        ]}
        heading="Patients"
      />
      <Paper elevation={4}>
        <TableContainer>
          <Toolbar>
            <Button
              variant="outlined"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              Add Patient
            </Button>
            <Tooltip title="Select Patients to delete them">
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
                <TableCell>Edit</TableCell>
                <TableCell>Patient ID</TableCell>
                <TableCell>Insurance ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Middle Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Suffix</TableCell>
                <TableCell>Date Of Birth</TableCell>
                <TableCell>Primary Language</TableCell>
                <TableCell>Preferred Gender</TableCell>
                <TableCell>Email Address</TableCell>
                <TableCell>Home Phone</TableCell>
                <TableCell>Home Living Arrangement</TableCell>
                <TableCell>Home Address 1</TableCell>
                <TableCell>Home Address 2</TableCell>
                <TableCell>Home City</TableCell>
                <TableCell>Home County</TableCell>
                <TableCell>Home State</TableCell>
                <TableCell>Home Zip</TableCell>
                <TableCell>Signed Circulo Consent Form</TableCell>
                <TableCell>Circulo Consent Form Link</TableCell>
                <TableCell>Signed StationMD Consent Form</TableCell>
                <TableCell>StationMD Consent Form Link</TableCell>
                <TableCell>Completed Go Sheet</TableCell>
                <TableCell>MarkedAsActive</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Last Modified</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients &&
                patients.map((patient, i) => (
                  <PatientRow
                    key={i}
                    handleClick={() => handleClick(patient)}
                    patientId={patient.patientId}
                    insuranceId={patient.insuranceId}
                    patientFirstName={patient.patientFirstName}
                    patientMiddleName={patient.patientMiddleName}
                    patientLastName={patient.patientLastName}
                    patientSuffix={patient.patientSuffix}
                    patientDateOfBirth={formatInTimeZone(
                      patient.patientDateOfBirth,
                      'yyyy-MM-dd',
                      'UTC'
                    )}
                    patientPrimaryLanguage={patient.patientPrimaryLanguage}
                    patientPreferredGender={patient.patientPreferredGender}
                    patientEmailAddress={patient.patientEmailAddress}
                    patientHomePhone={patient.patientHomePhone}
                    patientHomeLivingArrangement={
                      patient.patientHomeLivingArrangement
                    }
                    patientHomeAddress1={patient.patientHomeAddress1}
                    patientHomeAddress2={patient.patientHomeAddress2}
                    patientHomeCity={patient.patientHomeCity}
                    patientHomeCounty={patient.patientHomeCounty}
                    patientHomeState={patient.patientHomeState}
                    patientHomeZip={patient.patientHomeZip}
                    patientSignedCirculoConsentForm={
                      patient.patientSignedCirculoConsentForm
                    }
                    patientCirculoConsentFormLink={
                      patient.patientCirculoConsentFormLink
                    }
                    patientSignedStationMDConsentForm={
                      patient.patientSignedStationMDConsentForm
                    }
                    patientStationMDConsentFormLink={
                      patient.patientStationMDConsentFormLink
                    }
                    patientCompletedGoSheet={patient.patientCompletedGoSheet}
                    patientMarkedAsActive={patient.patientMarkedAsActive}
                    patientCreatedTimestamp={format(
                      zonedTimeToUtc(
                        patient.patientCreatedTimestamp,
                        'America/New_York'
                      ),
                      "yyyy-MM-dd hh:mm aaaaa'm'"
                    )}
                    patientLastModifiedTimestamp={format(
                      zonedTimeToUtc(
                        patient.patientLastModifiedTimestamp,
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
      <CreatePatientDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
      {patientToEdit && isEditDialogOpen && (
        <EditPatientDialog
          onClose={() => setIsEditDialogOpen(false)}
          patient={patientToEdit}
        />
      )}
    </Page>
  );
};

export default Patients;
