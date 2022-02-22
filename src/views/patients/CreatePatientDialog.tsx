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
import useAddPatient from '../../hooks/domain/mutations/useAddPatient';

export interface CreatePatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PatientForm {
  patientId: string;
  insuranceId: string;
  patientFirstName: string;
  patientMiddleName: string;
  patientLastName: string;
  patientSuffix: string;
  patientDateOfBirth: Date;
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
  patientCreatedTimestamp: Date;
  patientLastModifiedTimestamp: Date;
}

const schema = yup.object<PatientForm>({
  patientId: yup.string(),
  insuranceId: yup.string().required().label('insurance id'),
  patientFirstName: yup.string().required().label('first name'),
  patientMiddleName: yup.string(),
  patientLastName: yup.string().required().label('last name'),
  patientSuffix: yup.string(),
  patientDateOfBirth: yup.date().required().label('date of birth'),
  patientPrimaryLanguage: yup.string(),
  patientPreferredGender: yup.string(),
  patientEmailAddress: yup.string().required().label('email address'),
  patientHomePhone: yup.string(),
  patientHomeLivingArrangement: yup.string(),
  patientHomeAddress1: yup.string().required().label('home address'),
  patientHomeAddress2: yup.string(),
  patientHomeCity: yup.string().required().label('city'),
  patientHomeCounty: yup.string().required().label('county'),
  patientHomeState: yup.string().required().label('state'),
  patientHomeZip: yup.string().required().label('zip'),
  patientSignedCirculoConsentForm: yup.bool(),
  patientCirculoConsentFormLink: yup.string(),
  patientSignedStationMDConsentForm: yup.bool(),
  patientStationMDConsentFormLink: yup.string(),
  patientCompletedGoSheet: yup.bool(),
  patientMarkedAsActive: yup.bool(),
  patientCreatedTimestamp: yup.date(),
  patientLastModifiedTimestamp: yup.date()
});
const CreatePatientDialog: React.FC<CreatePatientDialogProps> = ({
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
  } = useForm<PatientForm>({
    mode: 'onTouched',
    resolver: yupResolver(schema)
  });

  const { mutate: createPatient, isLoading: isCreating } = useAddPatient({
    onSuccess: () => {
      onClose();
    },
    onError: (e) => {
      let key: '' | 'insuranceId' = '';

      if (e.startsWith('patient with this insurance id already exists')) {
        key = 'insuranceId';
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
    createPatient(data);
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [reset, isOpen]);

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Add New Patient</DialogTitle>
      <DialogContent>
        <form onSubmit={onFormSubmit}>
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="First Name"
            id="firstName"
            error={!!errors.patientFirstName}
            helperText={errors.patientFirstName?.message}
            {...register('patientFirstName')}
          />
          <TextField
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Middle"
            id="middle"
            error={!!errors.patientMiddleName}
            helperText={errors.patientMiddleName?.message}
            {...register('patientMiddleName')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Last Name"
            id="lastName"
            error={!!errors.patientLastName}
            helperText={errors.patientLastName?.message}
            {...register('patientLastName')}
          />
          <TextField
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Suffix"
            id="suffix"
            error={!!errors.patientSuffix}
            helperText={errors.patientSuffix?.message}
            {...register('patientSuffix')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Email"
            id="email"
            error={!!errors.patientEmailAddress}
            helperText={errors.patientEmailAddress?.message}
            {...register('patientEmailAddress')}
          />
          <TextField
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Language"
            id="language"
            error={!!errors.patientPrimaryLanguage}
            helperText={errors.patientPrimaryLanguage?.message}
            {...register('patientPrimaryLanguage')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Home Address 1"
            id="homeAddress1"
            error={!!errors.patientHomeAddress1}
            helperText={errors.patientHomeAddress1?.message}
            {...register('patientHomeAddress1')}
          />
          <TextField
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Home Address 2"
            id="homeAddress2"
            error={!!errors.patientHomeAddress2}
            helperText={errors.patientHomeAddress2?.message}
            {...register('patientHomeAddress2')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Home City"
            id="homeCity"
            error={!!errors.patientHomeCity}
            helperText={errors.patientHomeCity?.message}
            {...register('patientHomeCity')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Home State"
            id="homeState"
            error={!!errors.patientHomeState}
            helperText={errors.patientHomeState?.message}
            {...register('patientHomeState')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Home Zipcode"
            id="homeZipcode"
            error={!!errors.patientHomeZip}
            helperText={errors.patientHomeZip?.message}
            {...register('patientHomeZip')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Home County"
            id="homeCounty"
            error={!!errors.patientHomeCounty}
            helperText={errors.patientHomeCounty?.message}
            {...register('patientHomeCounty')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Insurance ID"
            id="insuranceId"
            error={!!errors.insuranceId}
            helperText={errors.insuranceId?.message}
            {...register('insuranceId')}
          />
          <TextField
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Date of Birth"
            id="dateOfBirth"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            error={!!errors.patientDateOfBirth}
            helperText={
              errors.patientDateOfBirth?.message
                ? 'Date of Birth is Required'
                : ''
            }
            {...register('patientDateOfBirth')}
          />
          <TextField
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Gender"
            id="gender"
            error={!!errors.patientPreferredGender}
            helperText={errors.patientPreferredGender?.message}
            {...register('patientPreferredGender')}
          />
          <TextField
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Circulo Form Link"
            id="circuloFormLink"
            error={!!errors.patientCirculoConsentFormLink}
            helperText={errors.patientCirculoConsentFormLink?.message}
            {...register('patientCirculoConsentFormLink')}
          />
          <TextField
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="StationMD Form Link"
            id="stationMDFormLink"
            error={!!errors.patientStationMDConsentFormLink}
            helperText={errors.patientStationMDConsentFormLink?.message}
            {...register('patientStationMDConsentFormLink')}
          />
          <TextField
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Home Phone"
            id="homePhone"
            error={!!errors.patientHomePhone}
            helperText={errors.patientHomePhone?.message}
            {...register('patientHomePhone')}
          />
          <TextField
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Home Living Arrangement"
            id="homeLivingArrangement"
            error={!!errors.patientHomeLivingArrangement}
            helperText={errors.patientHomeLivingArrangement?.message}
            {...register('patientHomeLivingArrangement')}
          />
          <input type="submit" hidden />
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

export default CreatePatientDialog;
