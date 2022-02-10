import React from 'react';
import { TableCell, TableRow, useTheme, Checkbox } from '@material-ui/core';

export interface PatientDetails {
  patientId: string;
  insuranceId: string;
  patientFirstName: string;
  patientMiddleName: string;
  patientLastName: string;
  patientSuffix: string;
  patientDateOfBirth: string;
  patientPrimaryLanguage: string;
  patientPreferredGender: string;
  patientEmailAddress: string;
  patientHomePhone: string;
  patientHomeLivingArrangement: string;
  patientHomeAddress1: string;
  patientHomeAddress2: string;
  patientHomeCity: string;
  patientHomeCounty: string;
  patientHomeState: string;
  patientHomeZip: string;
  patientSignedCirculoConsentForm: boolean;
  patientCirculoConsentFormLink: string;
  patientSignedStationMDConsentForm: boolean;
  patientStationMDConsentFormLink: string;
  patientCompletedGoSheet: boolean;
  patientMarkedAsActive: boolean;
  patientCreatedTimestamp: string;
  patientLastModifiedTimestamp: string;
}

const PatientRow: React.FC<PatientDetails> = ({
  patientId,
  insuranceId,
  patientFirstName,
  patientMiddleName,
  patientLastName,
  patientSuffix,
  patientDateOfBirth,
  patientPrimaryLanguage,
  patientPreferredGender,
  patientEmailAddress,
  patientHomePhone,
  patientHomeLivingArrangement,
  patientHomeAddress1,
  patientHomeAddress2,
  patientHomeCity,
  patientHomeCounty,
  patientHomeState,
  patientHomeZip,
  patientSignedCirculoConsentForm,
  patientCirculoConsentFormLink,
  patientSignedStationMDConsentForm,
  patientStationMDConsentFormLink,
  patientCompletedGoSheet,
  patientMarkedAsActive,
  patientCreatedTimestamp,
  patientLastModifiedTimestamp
}) => {
  const theme = useTheme();

  return (
    <>
      <TableRow
        data-testid="patient-row-root"
        role="checkbox"
        sx={{
          borderBottom: `1px solid ${theme.palette.primary.lighter}`
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            inputProps={{
              'aria-label': `select appointment with name ${patientFirstName}`
            }}
          />
        </TableCell>
        <TableCell>{patientId}</TableCell>
        <TableCell>{insuranceId}</TableCell>
        <TableCell>{patientFirstName}</TableCell>
        <TableCell>{patientMiddleName}</TableCell>
        <TableCell>{patientLastName}</TableCell>
        <TableCell>{patientSuffix}</TableCell>
        <TableCell>{patientDateOfBirth}</TableCell>
        <TableCell>{patientPrimaryLanguage}</TableCell>
        <TableCell>{patientPreferredGender}</TableCell>
        <TableCell>{patientEmailAddress}</TableCell>
        <TableCell>{patientHomePhone}</TableCell>
        <TableCell>{patientHomeLivingArrangement}</TableCell>
        <TableCell>{patientHomeAddress1}</TableCell>
        <TableCell>{patientHomeAddress2}</TableCell>
        <TableCell>{patientHomeCity}</TableCell>
        <TableCell>{patientHomeCounty}</TableCell>
        <TableCell>{patientHomeState}</TableCell>
        <TableCell>{patientHomeZip}</TableCell>
        <TableCell>{patientSignedCirculoConsentForm}</TableCell>
        <TableCell>{patientCirculoConsentFormLink}</TableCell>
        <TableCell>{patientSignedStationMDConsentForm}</TableCell>
        <TableCell>{patientStationMDConsentFormLink}</TableCell>
        <TableCell>{patientCompletedGoSheet}</TableCell>
        <TableCell>{patientMarkedAsActive}</TableCell>
        <TableCell>{patientCreatedTimestamp}</TableCell>
        <TableCell>{patientLastModifiedTimestamp}</TableCell>
      </TableRow>
    </>
  );
};

export default PatientRow;
