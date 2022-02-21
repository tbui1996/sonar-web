import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Grid,
  useTheme,
  Typography
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { LoadingButton } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useEditAgencyProviders from '../../hooks/domain/mutations/useEditAgencyProviders';
import { AgencyProviderDetails } from '../../hooks/domain/queries/useGetAgencyProviders';

export interface EditAgencyProviderDialogProps {
  onClose: () => void;
  agencyProvider: AgencyProviderDetails;
}
type Form = Omit<AgencyProviderDetails, 'handleClick'>;
const schema = yup.object<Form>({
  agencyProviderId: yup.string(),
  doddNumber: yup.string().required().label('Dodd Number'),
  nationalProviderId: yup.string(),
  firstName: yup.string().required().label('first name'),
  middleName: yup.string(),
  lastName: yup.string().required().label('last name'),
  suffix: yup.string(),
  businessName: yup.string().required().label('business name'),
  businessTIN: yup.string(),
  businessAddress1: yup.string().required().label('business address'),
  businessAddress2: yup.string(),
  businessCity: yup.string().required().label('business city'),
  businessState: yup.string().required().label('business state'),
  businessZip: yup.string().required().label('business zip'),
  createdTimestamp: yup.date(),
  lastModifiedTimestamp: yup.date()
});

const EditAgencyProviderDialog: React.FC<EditAgencyProviderDialogProps> = ({
  onClose,
  agencyProvider
}) => {
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<Form>({
    mode: 'onTouched',
    resolver: yupResolver(schema),
    defaultValues: agencyProvider
  });
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: patchPatient } = useEditAgencyProviders({
    onSuccess: () => {
      onClose();
    },
    onError: (e) => {
      // let key: '' | 'nationalProviderId' | 'doddNumber' = '';

      // if (
      //   e.startsWith('Agency Provider with this DoDD number already exists')
      // ) {
      //   key = 'doddNumber';
      // }

      // if (
      //   e.startsWith(
      //     'Agency Provider with this national provider id already exists'
      //   )
      // ) {
      //   key = 'nationalProviderId';
      // }

      // if (key) {
      //   setError(
      //     key,
      //     {
      //       type: 'manual',
      //       message: e
      //     },
      //     { shouldFocus: true }
      //   );
      // }
      enqueueSnackbar('Failed to edit', {
        variant: 'error',
        autoHideDuration: 4_000
      });
    }
  });

  const onFormSubmit = handleSubmit((data) => patchPatient(data));
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

      <DialogTitle>Edit Agency Provider</DialogTitle>
      <DialogContent>
        <form onSubmit={onFormSubmit}>
          <Grid container spacing={1}>
            <Typography item component={Grid} xs={12} variant="h3">
              Agency Provider Info
            </Typography>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="First Name"
                id="firstName"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                {...register('firstName')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="DoDD Number"
                id="doddNumber"
                error={!!errors.doddNumber}
                helperText={errors.doddNumber?.message}
                {...register('doddNumber')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Middle Name"
                id="middleName"
                error={!!errors.middleName}
                helperText={errors.middleName?.message}
                {...register('middleName')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Last Name"
                id="lastName"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                {...register('lastName')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Suffix"
                id="suffix"
                error={!!errors.suffix}
                helperText={errors.suffix?.message}
                {...register('suffix')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="National Provider ID"
                id="nationalProviderId"
                error={!!errors.nationalProviderId}
                helperText={errors.nationalProviderId?.message}
                {...register('nationalProviderId')}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Typography item component={Grid} xs={12} variant="h3">
              Address Info
            </Typography>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Business Address 1"
                id="businessAddress1"
                error={!!errors.businessAddress1}
                helperText={errors.businessAddress1?.message}
                {...register('businessAddress1')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Business Address 2"
                id="businessAddress2"
                error={!!errors.businessAddress2}
                helperText={errors.businessAddress2?.message}
                {...register('businessAddress2')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Business City"
                id="businessCity"
                error={!!errors.businessCity}
                helperText={errors.businessCity?.message}
                {...register('businessCity')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Business State"
                id="businessState"
                error={!!errors.businessState}
                helperText={errors.businessState?.message}
                {...register('businessState')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Business Zipcode"
                id="businessZipcode"
                error={!!errors.businessZip}
                helperText={errors.businessZip?.message}
                {...register('businessZip')}
              />
            </Grid>
          </Grid>
          <input type="submit" hidden />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton
          variant="contained"
          onClick={onFormSubmit}
          data-testid="Edit"
        >
          Edit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditAgencyProviderDialog;
