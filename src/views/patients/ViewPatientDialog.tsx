import React from 'react';
import {
  TableCell,
  Box,
  Typography,
  IconButton,
  Card,
  useTheme
} from '@material-ui/core';
import { CheckBox, Close, CheckBoxOutlineBlank } from '@material-ui/icons';
import { PatientDetails } from './PatientRow';

export interface ViewPatientDialogProps {
  onClose: () => void;
  patient: PatientDetails;
}

const ViewPatientDialog: React.FC<ViewPatientDialogProps> = ({
  onClose,
  patient
}) => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          width: '100%'
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            color: theme.palette.primary.main
          }}
          onClick={onClose}
        >
          <Close />
        </IconButton>

        <Typography
          variant="h4"
          sx={{ color: 'text.secondary', paddingLeft: '0.5rem' }}
        >
          View Patient
        </Typography>
      </Box>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          justifyContent: 'left',
          padding: '1.5rem',
          margin: '0.5rem'
        }}
      >
        Patient Info
        <TableCell>Insurance Id: {patient.insuranceId}</TableCell>
        <TableCell>Language: {patient.patientPrimaryLanguage}</TableCell>
        <TableCell>
          Name: {patient.patientFirstName} {patient.patientMiddleName}{' '}
          {patient.patientLastName}
        </TableCell>
        <TableCell>DOB: {patient.patientDateOfBirth}</TableCell>
        <TableCell>Email: {patient.patientEmailAddress}</TableCell>
        <TableCell>City: {patient.patientHomeCity}</TableCell>
        <TableCell>State: {patient.patientHomeState}</TableCell>
        <TableCell>Zipcode: {patient.patientHomeZip}</TableCell>
      </Card>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          justifyContent: 'left',
          padding: '1.5rem',
          margin: '0.5rem'
        }}
      >
        Patient Checklist
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {patient.insuranceId ? (
              <CheckBox fontSize="small" />
            ) : (
              <CheckBoxOutlineBlank />
            )}{' '}
            Insurance Id
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {patient.patientSignedStationMDConsentForm ? (
              <CheckBox fontSize="small" />
            ) : (
              <CheckBoxOutlineBlank />
            )}{' '}
            Station MD Consent Form
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {patient.patientSignedCirculoConsentForm ? (
              <CheckBox fontSize="small" />
            ) : (
              <CheckBoxOutlineBlank />
            )}{' '}
            Circulo Consent Form
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {patient.patientCompletedGoSheet ? (
              <CheckBox fontSize="small" />
            ) : (
              <CheckBoxOutlineBlank />
            )}{' '}
            Go Sheet
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {patient.patientMarkedAsActive ? (
              <CheckBox fontSize="small" />
            ) : (
              <CheckBoxOutlineBlank />
            )}{' '}
            Active
          </Box>
        </TableCell>
      </Card>
    </>
  );
};

export default ViewPatientDialog;
