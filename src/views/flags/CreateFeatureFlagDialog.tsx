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
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@material-ui/lab';
import useCreateFeatureFlag from '../../hooks/domain/mutations/useCreateFeatureFlag';

export interface CreateFeatureFlagDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FeatureFlagForm {
  name: string;
  key: string;
}

const schema = yup
  .object<FeatureFlagForm>({
    name: yup.string().required(),
    key: yup.string().matches(/^\S*$/, 'not allowed to have spaces').required()
  })
  .required();

const CreateFeatureFlagDialog: React.FC<CreateFeatureFlagDialogProps> = ({
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
  } = useForm<FeatureFlagForm>({
    mode: 'onTouched',
    resolver: yupResolver(schema)
  });

  const { mutate: createFlag, isLoading: isCreating } = useCreateFeatureFlag({
    onSuccess: () => {
      onClose();
    },
    onError: (e) => {
      let key: '' | 'name' | 'key' = '';
      if (e.startsWith('flagKey')) {
        key = 'key';
      }

      if (e.startsWith('name')) {
        key = 'name';
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
    createFlag(data);
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [reset, isOpen]);

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Create New Feature Flag</DialogTitle>
      <DialogContent>
        <form onSubmit={onFormSubmit}>
          <TextField
            sx={{ marginBottom: theme.spacing(2) }}
            fullWidth
            label="Name"
            id="name"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name')}
          />
          <TextField
            fullWidth
            label="Key"
            id="key"
            error={!!errors.key}
            helperText={errors.key?.message ?? 'No spaces in the key, please!'}
            {...register('key')}
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

export default CreateFeatureFlagDialog;
