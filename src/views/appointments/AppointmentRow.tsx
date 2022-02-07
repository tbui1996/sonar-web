import React from 'react';
import { TableCell, TableRow, useTheme, Checkbox } from '@material-ui/core';

export interface AppointmentDetails {
  agencyProviderId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  providerFullName: string;
  appointmentCreated: string;
  appointmentId: string;
  appointmentNotes: string;
  appointmentOtherPurpose: string;
  appointmentPurpose: string;
  appointmentScheduled: string;
  appointmentStatus: string;
  appointmentStatusChangedOn: string;
  circulatorDriverFullName: string;
  createdTimestamp: string;
  lastModifiedTimestamp: string;
  patientChiefComplaint: string;
  patientId: string;
  patientPulseBeatsPerMinute: number;
  patientRespirationsPerMinute: number;
  patientSystolicBloodPressure: number;
  patientWeightLbs: number;
}

const AppointmentRow: React.FC<AppointmentDetails> = ({
  agencyProviderId,
  firstName,
  middleName,
  lastName,
  providerFullName,
  appointmentCreated,
  appointmentId,
  appointmentNotes,
  appointmentOtherPurpose,
  appointmentPurpose,
  appointmentScheduled,
  appointmentStatus,
  appointmentStatusChangedOn,
  circulatorDriverFullName,
  createdTimestamp,
  lastModifiedTimestamp,
  patientChiefComplaint,
  patientId,
  patientPulseBeatsPerMinute,
  patientRespirationsPerMinute,
  patientSystolicBloodPressure,
  patientWeightLbs
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
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            inputProps={{
              'aria-label': `select appointment with id ${appointmentId}`
            }}
          />
        </TableCell>
        <TableCell>{agencyProviderId}</TableCell>
        <TableCell>{firstName}</TableCell>
        <TableCell>{middleName}</TableCell>
        <TableCell>{lastName}</TableCell>
        <TableCell>{providerFullName}</TableCell>
        <TableCell>{appointmentCreated}</TableCell>
        <TableCell>{appointmentId}</TableCell>
        <TableCell>{appointmentNotes}</TableCell>
        <TableCell>{appointmentOtherPurpose}</TableCell>
        <TableCell>{appointmentPurpose}</TableCell>
        <TableCell>{appointmentScheduled}</TableCell>
        <TableCell>{appointmentStatus}</TableCell>
        <TableCell>{appointmentStatusChangedOn}</TableCell>
        <TableCell>{circulatorDriverFullName}</TableCell>
        <TableCell>{createdTimestamp}</TableCell>
        <TableCell>{lastModifiedTimestamp}</TableCell>
        <TableCell>{patientChiefComplaint}</TableCell>
        <TableCell>{patientId}</TableCell>
        <TableCell>{patientPulseBeatsPerMinute}</TableCell>
        <TableCell>{patientRespirationsPerMinute}</TableCell>
        <TableCell>{patientSystolicBloodPressure}</TableCell>
        <TableCell>{patientWeightLbs}</TableCell>
      </TableRow>
    </>
  );
};

export default AppointmentRow;
