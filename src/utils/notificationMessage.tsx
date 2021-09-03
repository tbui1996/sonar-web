import { useSnackbar, VariantType } from 'notistack';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import { MIconButton } from '../components/@material-extend';

export default function NotificationMessage(
  message: string,
  variant: VariantType
) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  enqueueSnackbar(message, {
    variant,
    action: (key) => (
      <MIconButton size="small" onClick={() => closeSnackbar(key)}>
        <Icon icon={closeFill} />
      </MIconButton>
    )
  });
}
