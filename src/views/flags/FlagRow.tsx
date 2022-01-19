import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Switch,
  TableCell,
  TableRow,
  TextField,
  useTheme,
  Checkbox
} from '@material-ui/core';
import format from 'date-fns/format';
import { useSnackbar } from 'notistack';

import usePatchFeatureFlag from '../../hooks/domain/mutations/usePatchFeatureFlag';
import ConfirmDialog from '../../components/general/app/ConfirmDialog';

export interface FlagRowProps {
  isLast: boolean;
  name: string;
  updatedAt: string;
  isEnabled: boolean;
  id: number;
  flagKey: string;
  isSelected: boolean;
  onSelect: () => void;
}

const FlagRow: React.FC<FlagRowProps> = ({
  isLast,
  name,
  updatedAt,
  isEnabled,
  id,
  flagKey,
  isSelected,
  onSelect
}) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const nextEnableVerb = isEnabled ? 'disable' : 'enable';
  const {
    mutate: patchFlagEnabled,
    isLoading: isPatchingEnabled
  } = usePatchFeatureFlag({
    onSettled: () => {
      setIsConfirming(false);
    },
    onError: () => {
      enqueueSnackbar(`Failed to ${nextEnableVerb} flag.`, {
        variant: 'error',
        autoHideDuration: 4_000
      });
    }
  });

  const {
    mutate: patchFlagName,
    isLoading: isPatchingName
  } = usePatchFeatureFlag({
    onSuccess: () => {
      setNameEditState((cur) => ({ ...cur, isEditing: false }));
    },
    onError: (e) => {
      setNameEditState({ nextName: name, isEditing: false });
      enqueueSnackbar('Failed to edit name', {
        variant: 'error',
        autoHideDuration: 4_000
      });
    }
  });
  const [nameEditState, setNameEditState] = useState<{
    isEditing: boolean;
    nextName: string;
  }>({ isEditing: false, nextName: name });

  const [isConfirming, setIsConfirming] = useState(false);

  const handleNameChange = () => {
    if (name === nameEditState.nextName) {
      setNameEditState({ nextName: name, isEditing: false });
      return;
    }
    patchFlagName({
      name: nameEditState.nextName,
      id
    });
  };
  return (
    <>
      <TableRow
        data-testid="flag-row-root"
        role="checkbox"
        sx={{
          borderBottom: !isLast
            ? `1px solid ${theme.palette.primary.lighter}`
            : undefined
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            checked={isSelected}
            onClick={onSelect}
            inputProps={{
              'aria-label': `select flag with key ${flagKey}`
            }}
          />
        </TableCell>
        <TableCell component="th" scope="row">
          {nameEditState.isEditing ? (
            <TextField
              fullWidth
              autoFocus
              disabled={isPatchingName}
              InputProps={{
                endAdornment: isPatchingName ? (
                  <CircularProgress size="24px" />
                ) : undefined
              }}
              /* eslint-disable-next-line react/jsx-no-duplicate-props */
              inputProps={{ 'data-testid': `name-input-${flagKey}` }}
              size="small"
              value={nameEditState.nextName}
              onChange={(e) => {
                setNameEditState((cur) => ({
                  ...cur,
                  nextName: e.target.value
                }));
              }}
              onBlur={() => handleNameChange()}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleNameChange();
                }
              }}
            />
          ) : (
            <Button
              id="edit-name-btn"
              aria-label="edit name"
              data-testid={`name-btn-${flagKey}`}
              onClick={() =>
                setNameEditState((cur) => ({
                  ...cur,
                  isEditing: true
                }))
              }
            >
              {name}
            </Button>
          )}
        </TableCell>
        <TableCell>{flagKey}</TableCell>
        <TableCell>{format(new Date(updatedAt), 'MMM do yyyy, p')}</TableCell>
        <TableCell>
          <Switch
            inputProps={{
              role: 'checkbox',
              'aria-label': `${nextEnableVerb} flag with key ${flagKey}`
            }}
            checked={isEnabled}
            disabled={isPatchingEnabled}
            onChange={() => {
              setIsConfirming(true);
            }}
          />
        </TableCell>
      </TableRow>
      <ConfirmDialog
        open={isConfirming}
        title={`Are you sure you want to ${nextEnableVerb} ${name}?`}
        description={`Clicking confirm will ${nextEnableVerb} the flag for all users.`}
        onConfirm={() =>
          patchFlagEnabled({
            id,
            isEnabled: !isEnabled
          })
        }
        onCancel={() => setIsConfirming(false)}
        isConfirming={isPatchingEnabled}
      />
    </>
  );
};

export default FlagRow;
