import React, { useEffect, useState } from 'react';
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
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { LoadingButton } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import useCreateAppointments from '../../hooks/domain/mutations/useCreateAppointments';
import { AppointmentDetails } from './AppointmentRow';
import useGetPatients from '../../hooks/domain/queries/useGetPatients';

export interface CreateAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// type Form = Omit<
//   AppointmentDetails,
//   | 'appointmentId'
//   | 'appointmentCreated'
//   | 'appointmentStatusChangedOn'
//   | 'createdTimestamp'
//   | 'lastModifiedTimestamp'
//   | 'middleName'
//   | 'providerFullName'
//   | 'suffix'
//   | 'dateOfBirth'
//   | 'primaryLanguage'
//   | 'preferredGender'
//   | 'emailAddress'
//   | 'homeAddress1'
//   | 'homeAddress2'
//   | 'homeCity'
//   | 'homeState'
//   | 'homeZip'
//   | 'signedCirculoConsentForm'
//   | 'circuloConsentFormLink'
//   | 'signedStationMDConsentForm'
//   | 'stationMDConsentFormLink'
//   | 'completedGoSheet'
//   | 'markedAsActive'
//   | 'nationalProviderId'
//   | 'businessTIN'
//   | 'businessAddress1'
//   | 'businessAddress2'
//   | 'businessCity'
//   | 'businessState'
//   | 'businessZip'
//   | 'patientHomePhone'
//   | 'patientHomeLivingArrangement'
//   | 'patientHomeCounty'
//   | 'insuranceId'
// >;

interface AppointmentForm {
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
  firstName: yup.string().required().label('first name'),
  lastName: yup.string().required().label('last name'),
  appointmentStatus: yup.string().required().label('appointment status'),
  appointmentScheduled: yup.date().required().label('appointment scheduled'),
  appointmentPurpose: yup.string().required().label('appointment purpose'),
  patientChiefComplaint: yup.string().required().label('Chief Complaint'),
  businessName: yup.string().required().label('business name'),
  circulatorDriverFullName: yup.string(),
  patientDiastolicBloodPressure: yup.number(),
  patientSystolicBloodPressure: yup.number(),
  patientRespirationsPerMinute: yup.number(),
  patientPulseBeatsPerMinute: yup.number(),
  patientWeightLbs: yup.number(),
  agencyProviderId: yup.string().required().label('agency provider id'),
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
  const [setlastName, isLastNameSet] = useState('');
  const {
    register,
    reset,
    handleSubmit,
    setError,
    control,
    watch,
    formState: { errors }
  } = useForm<AppointmentDetails>({
    mode: 'onTouched',
    resolver: yupResolver(schema)
  });
  const watchFirstName = watch('firstName');
  const watchLastName = watch('lastName');
  const watchPatientId = watch('patientId');
  useEffect(() => {
    console.log('does watch insert first name: ', watchFirstName);
    console.log('does watch insert last name: ', watchLastName);
    console.log('does watch insert patientid: ', watchPatientId);
  });
  const {
    mutate: createAppointment,
    isLoading: isCreating
  } = useCreateAppointments({
    onSuccess: () => {
      onClose();
    },
    onError: (e) => {
      let key: '' | 'patientId' = '';

      if (
        e.startsWith(
          'Agency Provider with this national provider id already exists'
        )
      ) {
        key = 'patientId';
      }

      if (key) {
        setError(
          key,
          {
            type: 'manual',
            message: e
          },
          { shouldFocus: true }
        );
      }
    }
  });

  const onFormSubmit = handleSubmit((data) => {
    createAppointment(data);
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [reset, isOpen]);

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Create New Appointment</DialogTitle>
      <DialogContent>
        <form onSubmit={onFormSubmit}>
          <Controller
            control={control}
            name="patientId"
            render={({ field: { onChange, value, name } }) => (
              <TextField
                select
                label="Patient Name"
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                onChange={(e) => {
                  console.log('what is e grabbing: ', e.target.value);
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
          <TextField
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Appointment Purpose"
            id="appointmentPurpose"
            error={!!errors.appointmentPurpose}
            helperText={errors.appointmentPurpose?.message}
            {...register('appointmentPurpose')}
          />
          <TextField
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Appointment Scheduled"
            id="appointmentScheduled"
            type="date"
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
