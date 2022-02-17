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
import useCreateAgencyProviders from '../../hooks/domain/mutations/useCreateAgencyProviders';
import { AgencyProviderDetails } from '../../hooks/domain/queries/useGetAgencyProviders';

export interface CreateAgencyProviderDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const schema = yup.object<AgencyProviderDetails>({
  agencyProviderId: yup.string(),
  nationalProviderId: yup.string().required().label('N.I.P'),
  firstName: yup.string().required().label('First Name'),
  middleName: yup.string(),
  lastName: yup.string().required().label('Last Name'),
  suffix: yup.string(),
  businessName: yup.string().required().label('Business Name'),
  businessTIN: yup.string(),
  businessAddress1: yup.string().required().label('Business Address'),
  businessAddress2: yup.string(),
  businessCity: yup.string().required().label('Business City'),
  businessState: yup.string().required().label('Business State'),
  businessZip: yup.string().required().label('Business Zip'),
  createdTimestamp: yup.date(),
  lastModifiedTimestamp: yup.date()
});
const CreateAgencyProviderDialog: React.FC<CreateAgencyProviderDialogProps> = ({
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
  } = useForm<AgencyProviderDetails>({
    mode: 'onTouched',
    resolver: yupResolver(schema)
  });

  const {
    mutate: createAgencyProvider,
    isLoading: isCreating
  } = useCreateAgencyProviders({
    onSuccess: () => {
      onClose();
    },
    onError: (e) => {
      let key: '' | 'nationalProviderId' = '';

      if (
        e.startsWith('agency with this national provider id already exists')
      ) {
        key = 'nationalProviderId';
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
    createAgencyProvider(data);
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [reset, isOpen]);

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Add New Agency Provider</DialogTitle>
      <DialogContent>
        <form onSubmit={onFormSubmit}>
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="NPI"
            id="npi"
            error={!!errors.nationalProviderId}
            helperText={errors.nationalProviderId?.message}
            {...register('nationalProviderId')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="First Name"
            id="firstName"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            {...register('firstName')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Middle Name"
            id="middleName"
            error={!!errors.middleName}
            helperText={errors.middleName?.message}
            {...register('middleName')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Last Name"
            id="lastName"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            {...register('lastName')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Suffix"
            id="suffix"
            error={!!errors.suffix}
            helperText={errors.suffix?.message}
            {...register('suffix')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Business Name"
            id="businessName"
            error={!!errors.businessName}
            helperText={errors.businessName?.message}
            {...register('businessName')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Business T.I.N"
            id="businessTIN"
            error={!!errors.businessTIN}
            helperText={errors.businessTIN?.message}
            {...register('businessTIN')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Business Address 1"
            id="businessAddress1"
            error={!!errors.businessAddress1}
            helperText={errors.businessAddress1?.message}
            {...register('businessAddress1')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Business Address 2"
            id="businessAddress2"
            error={!!errors.businessAddress2}
            helperText={errors.businessAddress2?.message}
            {...register('businessAddress2')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Business City"
            id="businessCity"
            error={!!errors.businessCity}
            helperText={errors.businessCity?.message}
            {...register('businessCity')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Business State"
            id="businessState"
            error={!!errors.businessState}
            helperText={errors.businessState?.message}
            {...register('businessState')}
          />
          <TextField
            required
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Business Zip"
            id="businessZip"
            error={!!errors.businessZip}
            helperText={errors.businessZip?.message}
            {...register('businessZip')}
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

export default CreateAgencyProviderDialog;
