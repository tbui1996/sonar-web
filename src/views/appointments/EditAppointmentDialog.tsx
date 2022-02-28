import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Grid,
  useTheme,
  Typography
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { LoadingButton } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useEditAppointments from '../../hooks/domain/mutations/useEditAppointments';
import { AppointmentDetails } from './AppointmentRow';
import { Bar } from './Root';

export interface EditAppointmentDialogProps {
  onClose: () => void;
  appointment: Bar;
}

type Form = Omit<
  AppointmentDetails,
  | 'handleClick'
  | 'middleName'
  | 'providerFullName'
  | 'createdTimestamp'
  | 'suffix'
  | 'dateOfBirth'
  | 'primaryLanguage'
  | 'preferredGender'
  | 'emailAddress'
  | 'homeAddress1'
  | 'homeAddress2'
  | 'homeCity'
  | 'homeState'
  | 'homeZip'
  | 'signedCirculoConsentForm'
  | 'circuloConsentFormLink'
  | 'signedStationMDConsentForm'
  | 'stationMDConsentFormLink'
  | 'completedGoSheet'
  | 'markedAsActive'
  | 'nationalProviderId'
  | 'businessTIN'
  | 'businessAddress1'
  | 'businessAddress2'
  | 'businessCity'
  | 'businessState'
  | 'businessZip'
  | 'patientHomePhone'
  | 'patientHomeLivingArrangement'
  | 'patientHomeCounty'
  | 'insuranceId'
  | 'appointmentCreated'
  | 'lastModifiedTimestamp'
  | 'appointmentStatusChangedOn'
>;
const schema = yup.object<Bar>({
  appointmentId: yup.string(),
  firstName: yup.string(),
  lastName: yup.string(),
  appointmentStatus: yup.string().required().label('appointment status'),
  appointmentScheduled: yup.string().required().label('appointment scheduled'),
  appointmentPurpose: yup.string().required().label('appointment purpose'),
  patientChiefComplaint: yup.string().required().label('Chief Complaint'),
  businessName: yup.string(),
  circulatorDriverFullName: yup.string(),
  patientSystolicBloodPressure: yup.number(),
  patientDiastolicBloodPressure: yup.number(),
  patientRespirationsPerMinute: yup.number(),
  patientPulseBeatsPerMinute: yup.number(),
  patientWeightLbs: yup.number(),
  agencyProviderId: yup.string(),
  patientId: yup.string().required().label('patient id'),
  appointmentNotes: yup.string(),
  appointmentOtherPurpose: yup.string()
});

const EditAppointmentDialog: React.FC<EditAppointmentDialogProps> = ({
  onClose,
  appointment
}) => {
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<Form>({
    mode: 'onTouched',
    resolver: yupResolver(schema),
    defaultValues: appointment
  });
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: editAppointments } = useEditAppointments({
    onSuccess: () => {
      onClose();
    },
    onError: (e) => {
      enqueueSnackbar('Failed to Edit', {
        variant: 'error',
        autoHideDuration: 1_000
      });
    }
  });

  const onFormSubmit = handleSubmit((data) => editAppointments(data));
  return (
    <Dialog open fullScreen>
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
      <DialogTitle>Edit Appointment</DialogTitle>
      <DialogContent>
        <form onSubmit={onFormSubmit}>
          <Grid container spacing={1}>
            <Typography item component={Grid} xs={12} variant="h3">
              Appointment Info
            </Typography>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <Controller
                control={control}
                name="patientId"
                render={({ field: { onChange, value, name } }) => (
                  <TextField
                    required
                    select
                    label="Patient Name"
                    sx={{ marginBottom: theme.spacing(2) }}
                    fullWidth
                    onChange={(e) => {
                      onChange(e);
                    }}
                    name={name}
                    value={value || ''}
                    id="patientId"
                    error={!!errors.patientId}
                  >
                    <MenuItem />
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                required
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Chief Complaint"
                id="chiefComplaint"
                error={!!errors.patientChiefComplaint}
                helperText={errors.patientChiefComplaint?.message}
                {...register('patientChiefComplaint')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                required
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Chief Complaint"
                id="chiefComplaint"
                error={!!errors.patientChiefComplaint}
                helperText={errors.patientChiefComplaint?.message}
                {...register('patientChiefComplaint')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Circulator Driver Full Name"
                id="circulatorDriverFullName"
                error={!!errors.circulatorDriverFullName}
                helperText={errors.circulatorDriverFullName?.message}
                {...register('circulatorDriverFullName')}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton
          variant="contained"
          onClick={onFormSubmit}
          data-test-id="edit-appointment"
        >
          Edit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditAppointmentDialog;
