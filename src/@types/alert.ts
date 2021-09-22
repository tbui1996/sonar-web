export type AlertState = {
  severity: 'success' | 'info' | 'warning' | 'error';
  open: boolean;
  message: string;
};

export type AlertProps = AlertState & {
  onAlertClose: () => void;
};
