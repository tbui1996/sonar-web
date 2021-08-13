import { Box, BoxProps } from '@material-ui/core';

export default function LoadingLogo(props: BoxProps) {
  return (
    <Box
      component="img"
      alt="logo"
      src="/static/brand/circulo_logo_coral.svg"
      height={60}
      {...props}
    />
  );
}
