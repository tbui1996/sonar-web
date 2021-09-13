import { Link as RouterLink } from 'react-router-dom';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Card, Hidden, Container, Typography } from '@material-ui/core';
// import { PATH_AUTH } from '../../routes/paths';
import { LoadingButton } from '@material-ui/lab';
import useAuth from '../../hooks/useAuth';
import Page from '../../components/Page';
import Logo from '../../components/Logo';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7)
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 500,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
  padding: '0.35em'
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login() {
  const { login } = useAuth();

  return (
    <RootStyle title="Login">
      <HeaderStyle>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
      </HeaderStyle>

      <Hidden mdDown>
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 15, mb: 15 }}>
            Hi, Welcome Back
          </Typography>
          <img src="/static/illustrations/illustration_login.svg" alt="login" />
        </SectionStyle>
      </Hidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <LoadingButton
            onClick={login}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Sign in with Okta
          </LoadingButton>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
