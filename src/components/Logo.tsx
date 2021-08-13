import { Box, BoxProps } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function Logo(props: BoxProps) {
  return (
    <Box
      component="img"
      alt="logo"
      src="/static/brand/circulo_full_name_logo.svg"
      height={60}
      {...props}
    />
  );
}
