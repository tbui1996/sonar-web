import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  IconButton,
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
import usePatchPatient from '../../hooks/domain/mutations/usePatchPatient';
import { PatientDetails } from './PatientRow';

export interface EditPatientDialogProps {
  onClose: () => void;
  patient: PatientDetails;
}
type Form = Omit<
  PatientDetails,
  | 'patientCreatedTimestamp'
  | 'patientLastModifiedTimestamp'
  | 'handleClick'
  | 'handleViewPatient'
>;
const schema = yup.object<Form>({
  patientId: yup.string(),
  insuranceId: yup.string().required().label('insurance id'),
  patientFirstName: yup.string().required().label('first name'),
  patientMiddleName: yup.string(),
  patientLastName: yup.string().required().label('last name'),
  patientSuffix: yup.string(),
  patientDateOfBirth: yup.string().required().label('dateofbirth'),
  patientPrimaryLanguage: yup.string(),
  patientPreferredGender: yup.string(),
  patientEmailAddress: yup.string().required().label('email'),
  patientHomePhone: yup.string(),
  patientHomeLivingArrangement: yup.string(),
  patientHomeAddress1: yup.string().required().label('home address'),
  patientHomeAddress2: yup.string(),
  patientHomeCity: yup.string().required().label('home city'),
  patientHomeCounty: yup.string().required().label('home county'),
  patientHomeState: yup.string().required().label('home state'),
  patientHomeZip: yup.string().required().label('home zip'),
  patientSignedCirculoConsentForm: yup.bool(),
  patientCirculoConsentFormLink: yup.string(),
  patientSignedStationMDConsentForm: yup.bool(),
  patientStationMDConsentFormLink: yup.string(),
  patientCompletedGoSheet: yup.bool(),
  patientMarkedAsActive: yup.bool()
});

const EditPatientDialog: React.FC<EditPatientDialogProps> = ({
  onClose,
  patient
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
    defaultValues: patient
  });
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: patchPatient } = usePatchPatient({
    onSuccess: () => {
      onClose();
    },
    onError: (e) => {
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

      <DialogTitle>Edit Patient</DialogTitle>
      <DialogContent>
        <form onSubmit={onFormSubmit}>
          <Grid container spacing={1}>
            <Typography item component={Grid} xs={12} variant="h2">
              Personal Info
            </Typography>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="First Name"
                id="firstName"
                error={!!errors.patientFirstName}
                helperText={errors.patientFirstName?.message}
                {...register('patientFirstName')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Middle Name"
                id="middleName"
                error={!!errors.patientMiddleName}
                helperText={errors.patientMiddleName?.message}
                {...register('patientMiddleName')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Last Name"
                id="lastName"
                error={!!errors.patientLastName}
                helperText={errors.patientLastName?.message}
                {...register('patientLastName')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Suffix"
                id="suffix"
                error={!!errors.patientSuffix}
                helperText={errors.patientSuffix?.message}
                {...register('patientSuffix')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
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
                helperText={errors.patientDateOfBirth?.message}
                {...register('patientDateOfBirth')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Gender"
                id="gender"
                error={!!errors.patientPreferredGender}
                helperText={errors.patientPreferredGender?.message}
                {...register('patientPreferredGender')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Language"
                id="language"
                error={!!errors.patientPrimaryLanguage}
                helperText={errors.patientPrimaryLanguage?.message}
                {...register('patientPrimaryLanguage')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Insurance ID"
                id="insuranceId"
                error={!!errors.insuranceId}
                helperText={errors.insuranceId?.message}
                {...register('insuranceId')}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Typography item component={Grid} xs={12} variant="h3">
              Contact Info
            </Typography>

            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Email"
                id="email"
                error={!!errors.patientEmailAddress}
                helperText={errors.patientEmailAddress?.message}
                {...register('patientEmailAddress')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Home Phone"
                id="homePhone"
                error={!!errors.patientHomePhone}
                helperText={errors.patientHomePhone?.message}
                {...register('patientHomePhone')}
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
                label="Home Address 1"
                id="homeAddress1"
                error={!!errors.patientHomeAddress1}
                helperText={errors.patientHomeAddress1?.message}
                {...register('patientHomeAddress1')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Home Address 2"
                id="homeAddress2"
                error={!!errors.patientHomeAddress2}
                helperText={errors.patientHomeAddress2?.message}
                {...register('patientHomeAddress2')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Home City"
                id="homeCity"
                error={!!errors.patientHomeCity}
                helperText={errors.patientHomeCity?.message}
                {...register('patientHomeCity')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Home State"
                id="homeState"
                error={!!errors.patientHomeState}
                helperText={errors.patientHomeState?.message}
                {...register('patientHomeState')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Home Zipcode"
                id="homeZipcode"
                error={!!errors.patientHomeZip}
                helperText={errors.patientHomeZip?.message}
                {...register('patientHomeZip')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Home County"
                id="homeCounty"
                error={!!errors.patientHomeCounty}
                helperText={errors.patientHomeCounty?.message}
                {...register('patientHomeCounty')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <Controller
                control={control}
                name="patientHomeLivingArrangement"
                render={({ field: { onChange, value, name } }) => (
                  <TextField
                    select
                    label="Home Living Arrangement"
                    sx={{ marginBottom: theme.spacing(2) }}
                    fullWidth
                    onChange={(e) => {
                      onChange(e);
                    }}
                    name={name}
                    value={value || ''}
                    id="homeLivingArrangement"
                    error={!!errors.patientHomeLivingArrangement}
                  >
                    <MenuItem value="Home">Home</MenuItem>
                    <MenuItem value="Group Home">Group Home</MenuItem>
                    <MenuItem value="Institutional Care Facility">
                      Institutional Care Facility
                    </MenuItem>
                    <MenuItem value="Supervised Living">
                      Supervised Living
                    </MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Typography item component={Grid} xs={12} variant="h3">
              Links
            </Typography>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="StationMD Consent Form Link"
                id="stationMDConsentFormLink"
                error={!!errors.patientStationMDConsentFormLink}
                helperText={errors.patientStationMDConsentFormLink?.message}
                {...register('patientStationMDConsentFormLink')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <TextField
                sx={{ marginBottom: theme.spacing(2) }}
                fullWidth
                label="Circulo Form Link"
                id="circuloFormLink"
                error={!!errors.patientCirculoConsentFormLink}
                helperText={errors.patientCirculoConsentFormLink?.message}
                {...register('patientCirculoConsentFormLink')}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Typography item component={Grid} xs={12} variant="h3">
              Checks
            </Typography>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <Controller
                control={control}
                name="patientSignedCirculoConsentForm"
                render={({ field: { onChange, value, name } }) => (
                  <TextField
                    select
                    label="Signed Circulo Consent Form"
                    sx={{ marginBottom: theme.spacing(2) }}
                    fullWidth
                    onChange={(e) => {
                      onChange(e.target.value === 'true');
                    }}
                    name={name}
                    value={`${value}`}
                    id="patientSignedCirculoConsentForm"
                    error={!!errors.patientSignedCirculoConsentForm}
                  >
                    <MenuItem value="true">true</MenuItem>
                    <MenuItem value="false">false</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <Controller
                control={control}
                name="patientSignedStationMDConsentForm"
                render={({ field: { onChange, value, name } }) => (
                  <TextField
                    select
                    label="Signed Station MD Consent Form"
                    sx={{ marginBottom: theme.spacing(2) }}
                    fullWidth
                    onChange={(e) => {
                      onChange(e.target.value === 'true');
                    }}
                    name={name}
                    value={`${value}`}
                    id="patientSignedStationMDConsentForm"
                    error={!!errors.patientSignedStationMDConsentForm}
                  >
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <Controller
                control={control}
                name="patientMarkedAsActive"
                render={({ field: { onChange, value, name } }) => (
                  <TextField
                    select
                    label="Active"
                    sx={{ marginBottom: theme.spacing(2) }}
                    fullWidth
                    onChange={(e) => {
                      onChange(e.target.value === 'true');
                    }}
                    name={name}
                    value={`${value}`}
                    id="patientMarkedAsActive"
                    error={!!errors.patientMarkedAsActive}
                  >
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <Controller
                control={control}
                name="patientCompletedGoSheet"
                render={({ field: { onChange, value, name } }) => (
                  <TextField
                    select
                    label="Active"
                    sx={{ marginBottom: theme.spacing(2) }}
                    fullWidth
                    onChange={(e) => {
                      onChange(e.target.value === 'true');
                    }}
                    name={name}
                    value={`${value}`}
                    id="patientCompletedGoSheet"
                    error={!!errors.patientCompletedGoSheet}
                  >
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                  </TextField>
                )}
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

export default EditPatientDialog;
