import {
  DialogActions,
  DialogTitle,
  Dialog,
  DialogContent,
  Button
} from '@material-ui/core';
import { ReactNode, ReactNodeArray } from 'react';
import { LoadingButton } from '@material-ui/lab';

type Props = {
  open: boolean;
  title: string;
  description: string | ReactNode | ReactNodeArray;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  isConfirming = false
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{description}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <LoadingButton pending={isConfirming} onClick={onConfirm}>
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
