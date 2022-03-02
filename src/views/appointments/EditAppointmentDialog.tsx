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
import { formatInTimeZone } from './Root';
import useEditAppointments, {
  AppointmentDetailsRequest
} from '../../hooks/domain/mutations/useEditAppointments';
import useGetPatients from '../../hooks/domain/queries/useGetPatients';
import useGetAgencyProviders from '../../hooks/domain/queries/useGetAgencyProviders';

export interface EditAppointmentDialogProps {
  onClose: () => void;
  appointment: AppointmentDetailsRequest;
}

const schema = yup.object<AppointmentDetailsRequest>({
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
  const { data: patients } = useGetPatients();
  const { data: agencyProviders } = useGetAgencyProviders();
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm<AppointmentDetailsRequest>({
    mode: 'onTouched',
    resolver: yupResolver(schema),
    defaultValues: appointment
  });
  const { enqueueSnackbar } = useSnackbar();
  const watchAppointmentScheduled = watch('appointmentScheduled');
  console.log({ watchAppointmentScheduled });
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

  // change back to UTC
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
                    {patients?.map((patients, i) => (
                      <MenuItem key={i} value={`${patients.patientId}`}>
                        {patients.patientFirstName} {patients.patientLastName} (
                        {patients.patientId})
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                required
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Appointment Purpose"
                id="appointmentPurpose"
                error={!!errors.appointmentPurpose}
                helperText={errors.appointmentPurpose?.message}
                {...register('appointmentPurpose')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <Controller
                control={control}
                name="agencyProviderId"
                render={({ field: { onChange, value, name } }) => (
                  <TextField
                    select
                    label="Agency Provider"
                    sx={{ marginBottom: theme.spacing(2) }}
                    fullWidth
                    onChange={(e) => {
                      onChange(e);
                    }}
                    name={name}
                    value={value}
                    id="agencyProviderId"
                    error={!!errors.agencyProviderId}
                  >
                    {agencyProviders?.map((agencyProvider, i) => (
                      <MenuItem
                        key={i}
                        value={`${agencyProvider.agencyProviderId}`}
                      >
                        {agencyProvider.businessName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <Controller
                control={control}
                name="appointmentScheduled"
                render={({ field: { onChange, value, name } }) => (
                  <TextField
                    required
                    sx={{ marginBottom: theme.spacing(2) }}
                    fullWidth
                    label="Appointment Scheduled"
                    name={name}
                    value={value}
                    onChange={(e) => {
                      onChange(
                        (value = formatInTimeZone(
                          e.target.value,
                          "yyyy-MM-dd'T'HH:mm",
                          'America/New_York'
                        ))
                      );
                      console.log('what does this give me: ', value);
                    }}
                    id="appointmentScheduled"
                    type="datetime-local"
                    InputLabelProps={{
                      shrink: true
                    }}
                    error={!!errors.appointmentScheduled}
                    helperText={
                      errors.appointmentScheduled?.message
                        ? 'Appointment Scheduled is Required'
                        : ''
                    }
                  />
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
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Circulator Driver Full Name"
                id="circulatorDriverFullName"
                error={!!errors.circulatorDriverFullName}
                helperText={errors.circulatorDriverFullName?.message}
                {...register('circulatorDriverFullName')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Appointment Notes"
                id="appointmentNotes"
                error={!!errors.appointmentNotes}
                helperText={errors.appointmentNotes?.message}
                {...register('appointmentNotes')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Other Purpose"
                id="otherPurpose"
                error={!!errors.appointmentOtherPurpose}
                helperText={errors.appointmentOtherPurpose?.message}
                {...register('appointmentOtherPurpose')}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Typography item component={Grid} xs={12} variant="h3">
              Patient Info
            </Typography>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <Controller
                control={control}
                name="patientSystolicBloodPressure"
                render={({ field: { onChange, value, name } }) => (
                  <TextField
                    type="number"
                    InputLabelProps={{
                      shrink: true
                    }}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    name={name}
                    sx={{ marginBottom: theme.spacing(2) }}
                    fullWidth
                    label="Systolic BP"
                    value={value}
                    id="systolicBP"
                    error={!!errors.patientSystolicBloodPressure}
                    helperText={errors.patientSystolicBloodPressure?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <Controller
                control={control}
                name="patientDiastolicBloodPressure"
                render={({ field: { onChange, value, name } }) => (
                  <TextField
                    type="number"
                    InputLabelProps={{
                      shrink: true
                    }}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    name={name}
                    value={value}
                    sx={{ marginBottom: theme.spacing(2) }}
                    fullWidth
                    label="Diastolic BP"
                    id="disatolicBP"
                    error={!!errors.patientDiastolicBloodPressure}
                    helperText={errors.patientDiastolicBloodPressure?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <Controller
                control={control}
                name="patientRespirationsPerMinute"
                render={({ field: { onChange, value, name } }) => (
                  <TextField
                    type="number"
                    InputLabelProps={{
                      shrink: true
                    }}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    name={name}
                    value={value}
                    sx={{ marginBottom: theme.spacing(2) }}
                    fullWidth
                    label="Respirations (RPM)"
                    id="respirations"
                    error={!!errors.patientRespirationsPerMinute}
                    helperText={errors.patientRespirationsPerMinute?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <Controller
                control={control}
                name="patientPulseBeatsPerMinute"
                render={({ field: { onChange, value, name } }) => (
                  <TextField
                    type="number"
                    InputLabelProps={{
                      shrink: true
                    }}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    name={name}
                    value={value}
                    sx={{ marginBottom: theme.spacing(2) }}
                    fullWidth
                    label="Pulse (BPM)"
                    id="pulse"
                    error={!!errors.patientPulseBeatsPerMinute}
                    helperText={errors.patientPulseBeatsPerMinute?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <Controller
                control={control}
                name="patientWeightLbs"
                render={({ field: { onChange, value, name } }) => (
                  <TextField
                    type="number"
                    InputLabelProps={{
                      shrink: true
                    }}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    name={name}
                    value={value}
                    sx={{ marginBottom: theme.spacing(2) }}
                    fullWidth
                    label="Weight (lbs)"
                    id="weight"
                    error={!!errors.patientWeightLbs}
                    helperText={errors.patientWeightLbs?.message}
                  />
                )}
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
