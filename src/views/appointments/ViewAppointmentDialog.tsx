import React from 'react';
import {
  TableCell,
  Box,
  Typography,
  IconButton,
  Card,
  useTheme
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { AppointmentDetails } from './AppointmentRow';

export interface ViewAppointmentDialogProps {
  onClose: () => void;
  appointment: AppointmentDetails;
}

const ViewAppointmentDialog: React.FC<ViewAppointmentDialogProps> = ({
  onClose,
  appointment
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
          View Appointment
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
        Appointment Info
        <TableCell>Insurance Id: {appointment.insuranceId}</TableCell>
        <TableCell>
          Patient Name: {appointment.firstName} {appointment.lastName}
        </TableCell>
        <TableCell>
          Appointment Status: {appointment.appointmentStatus}
        </TableCell>
        <TableCell>Agency Provider: {appointment.providerFullName}</TableCell>
        <TableCell>
          Appointment Type: {appointment.appointmentPurpose}
        </TableCell>
        <TableCell>
          Circulator Driver: {appointment.circulatorDriverFullName}
        </TableCell>
      </Card>
    </>
  );
};

export default ViewAppointmentDialog;
