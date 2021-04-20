import { Link as RouterLink } from 'react-router-dom';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Link,
  Alert,
  Hidden,
  Tooltip,
  Container,
  Typography
} from '@material-ui/core';
import { PATH_AUTH } from '../../routes/paths';
import useAuth from '../../hooks/useAuth';
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import { LoginForm } from '../../components/authentication/login';
import AuthWithSocial from '../../components/authentication/AuthWithSocial';

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
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
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
  const { method } = useAuth();

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
          <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                Sign in to Circulo Sonar
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Enter your details below.
              </Typography>
            </Box>
            <Tooltip title={method === 'firebase' ? 'Firebase' : 'JWT'}>
              <Box
                component="img"
                src="/static/brand/circulo_single.svg"
                sx={{ width: 32, height: 32 }}
              />
            </Tooltip>
          </Box>

          {method === 'firebase' && <AuthWithSocial />}

          <Alert severity="info" sx={{ mb: 5 }}>
            This is an early alpha version of Sonar. Functionality may be
            unstable.
          </Alert>

          <LoginForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
