import {
  Button,
  Drawer,
  makeStyles,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Toolbar,
  TableRow
} from '@material-ui/core';
import { zonedTimeToUtc, format, utcToZonedTime } from 'date-fns-tz';
import { useCallback, useEffect, useState } from 'react';
import SearchBar from 'material-ui-search-bar';
import CreatePatientDialog from './CreatePatientDialog';
import PatientRow, { PatientDetails } from './PatientRow';
import Page from '../../components/Page';
import HeaderDashboard from '../../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../../routes/paths';
import useGetPatients from '../../hooks/domain/queries/useGetPatients';
import EditPatientDialog from './EditPatientDialog';
import ViewPatientDialog from './ViewPatientDialog';

const DRAWER_WIDTH = 400;

const useStyles = makeStyles((theme) => ({
  justify: {
    justifyContent: 'center'
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
  const [patientToEdit, setPatientToEdit] = useState<PatientDetails>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [patientToView, setPatientToView] = useState<PatientDetails>();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searched, setSearched] = useState<string>('');

  const [collection, setCollection] = useState<PatientDetails[]>();

  const [filteredCollection, setFilteredCollection] = useState<
    PatientDetails[]
  >();

  const [page, setPage] = useState(0);
  const PER_PAGE = 2;

  useEffect(() => {
    setCollection(patients);
    setFilteredCollection(patients);
  }, [setCollection, patients]);

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

  const requestSearch = (searchedVal: string) => {
    const lowerCaseSearch = searchedVal.toLocaleLowerCase();
    setPage(0);
    if (lowerCaseSearch === '') {
      setFilteredCollection(patients);
    } else {
      const pts = collection;
      const filteredRows = pts?.filter(
        (row) =>
          row.patientLastName.toLowerCase().includes(lowerCaseSearch) ||
          row.patientMiddleName.toLowerCase().includes(lowerCaseSearch) ||
          row.patientFirstName.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredCollection(filteredRows);
    }
  };

  const cancelSearch = () => {
    setSearched('');
    setFilteredCollection(collection);
  };

  const handleViewPatient = useCallback(
    (patient: PatientDetails) => {
      patient.patientDateOfBirth = formatInTimeZone(
        patient.patientDateOfBirth,
        'yyyy-MM-dd',
        'UTC'
      );

      setPatientToView(patient);
      setIsViewDialogOpen(true);
    },
    [setPatientToView, setIsViewDialogOpen]
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
            <SearchBar
              placeholder="Search By Full Name"
              value={searched}
              onChange={(searchVal: string) => requestSearch(searchVal)}
              onCancelSearch={() => cancelSearch()}
            />
          </Toolbar>
          <Table sx={{ minWidth: 480 }} arai-label="Patients">
            <TableHead>
              <TableRow>
                <TableCell>Edit</TableCell>
                <TableCell>View</TableCell>
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
              {filteredCollection &&
                filteredCollection
                  .slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)
                  .map((row, i) => (
                    <PatientRow
                      key={row.patientFirstName}
                      handleClick={() => handleClick(row)}
                      handleViewPatient={() => handleViewPatient(row)}
                      patientId={row.patientId}
                      insuranceId={row.insuranceId}
                      patientFirstName={row.patientFirstName}
                      patientMiddleName={row.patientMiddleName}
                      patientLastName={row.patientLastName}
                      patientSuffix={row.patientSuffix}
                      patientDateOfBirth={formatInTimeZone(
                        row.patientDateOfBirth,
                        'yyyy-MM-dd',
                        'UTC'
                      )}
                      patientPrimaryLanguage={row.patientPrimaryLanguage}
                      patientPreferredGender={row.patientPreferredGender}
                      patientEmailAddress={row.patientEmailAddress}
                      patientHomePhone={row.patientHomePhone}
                      patientHomeLivingArrangement={
                        row.patientHomeLivingArrangement
                      }
                      patientHomeAddress1={row.patientHomeAddress1}
                      patientHomeAddress2={row.patientHomeAddress2}
                      patientHomeCity={row.patientHomeCity}
                      patientHomeCounty={row.patientHomeCounty}
                      patientHomeState={row.patientHomeState}
                      patientHomeZip={row.patientHomeZip}
                      patientSignedCirculoConsentForm={
                        row.patientSignedCirculoConsentForm
                      }
                      patientCirculoConsentFormLink={
                        row.patientCirculoConsentFormLink
                      }
                      patientSignedStationMDConsentForm={
                        row.patientSignedStationMDConsentForm
                      }
                      patientStationMDConsentFormLink={
                        row.patientStationMDConsentFormLink
                      }
                      patientCompletedGoSheet={row.patientCompletedGoSheet}
                      patientMarkedAsActive={row.patientMarkedAsActive}
                      patientCreatedTimestamp={format(
                        zonedTimeToUtc(
                          row.patientCreatedTimestamp,
                          'America/New_York'
                        ),
                        "yyyy-MM-dd hh:mm aaaaa'm'"
                      )}
                      patientLastModifiedTimestamp={format(
                        zonedTimeToUtc(
                          row.patientLastModifiedTimestamp,
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
        count={Math.ceil((filteredCollection?.length || 0) / PER_PAGE)}
        shape="rounded"
        size="small"
        sx={{ paddingBottom: '12px' }}
      />
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
      {patientToView && isViewDialogOpen && (
        <Drawer
          anchor="right"
          open={isViewDialogOpen}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          <ViewPatientDialog
            onClose={() => setIsViewDialogOpen(false)}
            patient={patientToView}
          />
        </Drawer>
      )}
    </Page>
  );
};

export default Patients;
