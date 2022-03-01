import React, { useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  useTheme
} from '@material-ui/core';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { LoadingButton } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useCreateAppointments from '../../hooks/domain/mutations/useCreateAppointments';
import useGetPatients from '../../hooks/domain/queries/useGetPatients';
import useGetAgencyProviders from '../../hooks/domain/queries/useGetAgencyProviders';

export interface CreateAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface AppointmentForm {
  appointmentId: string;
  firstName: string;
  lastName: string;
  appointmentStatus: string;
  appointmentScheduled: Date;
  appointmentPurpose: string;
  patientChiefComplaint: string;
  businessName: string;
  circulatorDriverFullName: string;
  patientDiastolicBloodPressure: number;
  patientSystolicBloodPressure: number;
  patientRespirationsPerMinute: number;
  patientPulseBeatsPerMinute: number;
  patientWeightLbs: number;
  agencyProviderId: string;
  appointmentNotes: string;
  appointmentOtherPurpose: string;
  patientId: string;
}

const schema = yup.object<AppointmentForm>({
  appointmentId: yup.string(),
  firstName: yup.string(),
  lastName: yup.string(),
  appointmentStatus: yup.string().required().label('appointment status'),
  appointmentScheduled: yup.date().required().label('appointment scheduled'),
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

const CreateAppointmentDialog: React.FC<CreateAppointmentDialogProps> = ({
  isOpen,
  onClose
}) => {
  const theme = useTheme();
  const { data: patients } = useGetPatients();
  const { data: agencyProviders } = useGetAgencyProviders();
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<AppointmentForm>({
    mode: 'onTouched',
    resolver: yupResolver(schema)
  });

  const { enqueueSnackbar } = useSnackbar();

  const {
    mutate: createAppointment,
    isLoading: isCreating
  } = useCreateAppointments({
    onSuccess: () => {
      onClose();
    },
    onError: (e) => {
      enqueueSnackbar('Failed to save', {
        variant: 'error',
        autoHideDuration: 1_000
      });
    }
  });

  const onFormSubmit = handleSubmit((data) => {
    console.log({ data });
    createAppointment(data);
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [reset, isOpen]);

  return (
    <Dialog open={isOpen} fullWidth={true} maxWidth="md">
      <DialogTitle>Create New Appointment</DialogTitle>
      <DialogContent>
        <form onSubmit={onFormSubmit}>
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
                error={!!errors.firstName}
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
                value={value || ''}
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
          <Controller
            control={control}
            name="appointmentStatus"
            render={({ field: { onChange, value, name } }) => (
              <TextField
                required
                select
                label="Appointment Status"
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                onChange={(e) => {
                  onChange(e);
                }}
                name={name}
                value={value || ''}
                id="appointmentStatus"
                error={!!errors.firstName}
              >
                <MenuItem value="Pending Confirmation">
                  Pending Confirmation
                </MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled by Circulo">
                  Cancelled by Circulo
                </MenuItem>
                <MenuItem value="Cancelled by Agency">
                  Cancelled by Agency
                </MenuItem>
                <MenuItem value="No Show">No Show</MenuItem>
              </TextField>
            )}
          />
          <DateTimePicker
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Appointment Scheduled"
            id="appointmentScheduled"
            InputLabelProps={{
              shrink: true
            }}
            error={!!errors.appointmentScheduled}
            helperText={
              errors.appointmentScheduled?.message
                ? 'Appointment Scheduled is Required'
                : ''
            }
            {...register('appointmentScheduled')}
          />
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
          <TextField
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Circulator Driver Full Name"
            id="circulatorDriverFullName"
            error={!!errors.circulatorDriverFullName}
            helperText={errors.circulatorDriverFullName?.message}
            {...register('circulatorDriverFullName')}
          />
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
                value={value || 0}
                id="systolicBP"
                error={!!errors.patientSystolicBloodPressure}
                helperText={errors.patientSystolicBloodPressure?.message}
              />
            )}
          />
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
                value={value || 0}
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Diastolic BP"
                id="disatolicBP"
                error={!!errors.patientDiastolicBloodPressure}
                helperText={errors.patientDiastolicBloodPressure?.message}
              />
            )}
          />
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
                value={value || 0}
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Respirations (RPM)"
                id="respirations"
                error={!!errors.patientRespirationsPerMinute}
                helperText={errors.patientRespirationsPerMinute?.message}
              />
            )}
          />
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
                value={value || 0}
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Pulse (BPM)"
                id="pulse"
                error={!!errors.patientPulseBeatsPerMinute}
                helperText={errors.patientPulseBeatsPerMinute?.message}
              />
            )}
          />
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
                value={value || 0}
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Weight (lbs)"
                id="weight"
                error={!!errors.patientWeightLbs}
                helperText={errors.patientWeightLbs?.message}
              />
            )}
          />
          <TextField
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Other Purpose"
            id="otherPurpose"
            error={!!errors.appointmentOtherPurpose}
            helperText={errors.appointmentOtherPurpose?.message}
            {...register('appointmentOtherPurpose')}
          />
          <TextField
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Appointment Notes"
            id="appointmentNotes"
            error={!!errors.appointmentNotes}
            helperText={errors.appointmentNotes?.message}
            {...register('appointmentNotes')}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton
          variant="contained"
          onClick={onFormSubmit}
          pending={isCreating}
          data-testid="create"
        >
          Create
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
export default CreateAppointmentDialog;
