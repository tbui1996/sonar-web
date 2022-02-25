import React, { useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useTheme
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { LoadingButton } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import useCreateAppointments from '../../hooks/domain/mutations/useCreateAppointments';
import { AppointmentDetails } from './AppointmentRow';

export interface CreateAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type Form = Omit<
  AppointmentDetails,
  | 'appointmentId'
  | 'appointmentCreated'
  | 'appointmentStatusChangedOn'
  | 'createdTimestamp'
  | 'lastModifiedTimestamp'
  | 'middleName'
  | 'providerFullName'
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
>;

const schema = yup.object<Form>({
  firstName: yup.string().required().label('first name'),
  lastName: yup.string().required().label('last name'),
  appointmentStatus: yup.string().required().label('appointment status'),
  appointmentScheduled: yup.string().required().label('appointment scheduled'),
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
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<AppointmentDetails>({
    mode: 'onTouched',
    resolver: yupResolver(schema)
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
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateAppointmentDialog;
