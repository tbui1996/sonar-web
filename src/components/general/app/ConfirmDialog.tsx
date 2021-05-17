import {
  DialogActions,
  DialogTitle,
  Dialog,
  DialogContent,
  Button
} from '@material-ui/core';

type Props = {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel
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
        <Button onClick={onConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
