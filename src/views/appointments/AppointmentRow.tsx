import React from 'react';
import {
  TableCell,
  TableRow,
  useTheme,
  Checkbox,
  IconButton
} from '@material-ui/core';
import { Edit, Check, Close } from '@material-ui/icons';

export interface AppointmentDetails {
  handleClick: () => void;
  isSelected: boolean;
  onSelect: () => void;
  appointmentId: string;
  patientId: string;
  agencyProviderId: string;
  circulatorDriverFullName: string;
  appointmentCreated: string;
  appointmentScheduled: string;
  appointmentStatus: string;
  appointmentStatusChangedOn: string;
  appointmentPurpose: string;
  appointmentOtherPurpose: string;
  appointmentNotes: string;
  patientDiastolicBloodPressure: number;
  patientSystolicBloodPressure: number;
  patientRespirationsPerMinute: number;
  patientPulseBeatsPerMinute: number;
  patientWeightLbs: number;
  patientChiefComplaint: string;
  createdTimestamp: string;
  lastModifiedTimestamp: string;
  firstName: string;
  middleName: string;
  lastName: string;
  providerFullName: string;
  suffix: string;
  dateOfBirth: string;
  primaryLanguage: string;
  preferredGender: string;
  emailAddress: string;
  homeAddress1: string;
  homeAddress2: string;
  homeCity: string;
  homeState: string;
  homeZip: string;
  signedCirculoConsentForm: boolean;
  circuloConsentFormLink: string;
  signedStationMDConsentForm: boolean;
  stationMDConsentFormLink: string;
  completedGoSheet: boolean;
  markedAsActive: boolean;
  nationalProviderId: string;
  businessName: string;
  businessTIN: string;
  businessAddress1: string;
  businessAddress2: string;
  businessCity: string;
  businessState: string;
  businessZip: string;
  patientHomePhone: string;
  patientHomeLivingArrangement: string;
  patientHomeCounty: string;
  insuranceId: string;
}

const AppointmentRow: React.FC<AppointmentDetails> = ({
  handleClick,
  isSelected,
  onSelect,
  appointmentId,
  patientId,
  agencyProviderId,
  circulatorDriverFullName,
  appointmentCreated,
  appointmentScheduled,
  appointmentStatus,
  appointmentStatusChangedOn,
  appointmentPurpose,
  appointmentOtherPurpose,
  appointmentNotes,
  patientDiastolicBloodPressure,
  patientSystolicBloodPressure,
  patientRespirationsPerMinute,
  patientPulseBeatsPerMinute,
  patientWeightLbs,
  patientChiefComplaint,
  createdTimestamp,
  lastModifiedTimestamp,
  firstName,
  middleName,
  lastName,
  providerFullName,
  suffix,
  dateOfBirth,
  primaryLanguage,
  preferredGender,
  emailAddress,
  homeAddress1,
  homeAddress2,
  homeCity,
  homeState,
  homeZip,
  signedCirculoConsentForm,
  circuloConsentFormLink,
  signedStationMDConsentForm,
  stationMDConsentFormLink,
  completedGoSheet,
  markedAsActive,
  nationalProviderId,
  businessName,
  businessTIN,
  businessAddress1,
  businessAddress2,
  businessCity,
  businessState,
  businessZip,
  patientHomePhone,
  patientHomeLivingArrangement,
  patientHomeCounty,
  insuranceId
}) => {
  const theme = useTheme();

  return (
    <>
      <TableRow
        data-testid="appointment-row-root"
        role="checkbox"
        sx={{
          borderBottom: `1px solid ${theme.palette.primary.lighter}`
        }}
      >
        <TableCell>
          <IconButton onClick={handleClick} color="primary">
            <Edit />
          </IconButton>
        </TableCell>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            checked={isSelected}
            onClick={onSelect}
            inputProps={{
              'aria-label': `select appointment with id ${appointmentId}`
            }}
          />
        </TableCell>
        <TableCell>{appointmentId}</TableCell>
        <TableCell>{appointmentCreated}</TableCell>
        <TableCell>{appointmentStatus}</TableCell>
        <TableCell>{appointmentStatusChangedOn}</TableCell>
        <TableCell>{appointmentScheduled}</TableCell>
        <TableCell>{firstName}</TableCell>
        <TableCell>{middleName}</TableCell>
        <TableCell>{lastName}</TableCell>
        <TableCell>{circulatorDriverFullName}</TableCell>
        <TableCell>{providerFullName}</TableCell>
        <TableCell>{appointmentPurpose}</TableCell>
        <TableCell>{appointmentOtherPurpose}</TableCell>
        <TableCell>{appointmentNotes}</TableCell>
        <TableCell>{suffix}</TableCell>
        <TableCell>{dateOfBirth}</TableCell>
        <TableCell>{primaryLanguage}</TableCell>
        <TableCell>{preferredGender}</TableCell>
        <TableCell>{emailAddress}</TableCell>
        <TableCell>{homeAddress1}</TableCell>
        <TableCell>{homeAddress2}</TableCell>
        <TableCell>{homeCity}</TableCell>
        <TableCell>{homeState}</TableCell>
        <TableCell>{homeZip}</TableCell>
        <TableCell>
          {signedCirculoConsentForm ? <Check /> : <Close />}
        </TableCell>
        <TableCell>{circuloConsentFormLink}</TableCell>
        <TableCell>
          {signedStationMDConsentForm ? <Check /> : <Close />}
        </TableCell>
        <TableCell>{stationMDConsentFormLink}</TableCell>
        <TableCell>{completedGoSheet ? <Check /> : <Close />}</TableCell>
        <TableCell>{markedAsActive ? <Check /> : <Close />}</TableCell>
        <TableCell>{createdTimestamp}</TableCell>
        <TableCell>{lastModifiedTimestamp}</TableCell>
        <TableCell>{nationalProviderId}</TableCell>
        <TableCell>{businessName === 'None' ? '' : businessName}</TableCell>
        <TableCell>{businessTIN}</TableCell>
        <TableCell>{businessAddress1}</TableCell>
        <TableCell>{businessAddress2}</TableCell>
        <TableCell>{businessCity}</TableCell>
        <TableCell>{businessState}</TableCell>
        <TableCell>{businessZip}</TableCell>
        <TableCell>{patientId}</TableCell>
        <TableCell>{patientHomePhone}</TableCell>
        <TableCell>{patientHomeLivingArrangement}</TableCell>
        <TableCell>{patientHomeCounty}</TableCell>
        <TableCell>{patientDiastolicBloodPressure}</TableCell>
        <TableCell>{patientSystolicBloodPressure}</TableCell>
        <TableCell>{patientRespirationsPerMinute}</TableCell>
        <TableCell>{patientPulseBeatsPerMinute}</TableCell>
        <TableCell>{patientWeightLbs}</TableCell>
        <TableCell>{patientChiefComplaint}</TableCell>
        <TableCell>{insuranceId}</TableCell>
        <TableCell>{agencyProviderId}</TableCell>
      </TableRow>
    </>
  );
};

export default AppointmentRow;
