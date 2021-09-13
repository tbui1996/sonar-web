import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
// material
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
// auth
import { Amplify } from '@aws-amplify/core';
// redux
import { store, persistor } from './redux/store';
// routes
import routes, { renderRoutes } from './routes';
// theme
import ThemeConfig from './theme';
// components
import Settings from './components/settings';
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import GoogleAnalytics from './components/GoogleAnalytics';
import NotistackProvider from './components/NotistackProvider';

// Using for Auth (Check doc https://minimals.cc/docs/authentication)
import JwtProvider from './components/authentication/JwtProvider';
// import FirebaseProvider from './components/authentication/FirebaseProvider';

// ----------------------------------------------------------------------

// We are using the Auth package from Amplify because it abstracts all the OAuth handshaking and session/token management.
// This configuration points Amplify at our internals user pool.
// This configuration needs to be at a top level of the app, and then useAuth() will expose an auth context to be used anywhere
// in the app to get the session tokens or get basic user info.
Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_COGNITO_REGION,
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_COGNITO_USER_POOL_WEB_CLIENT_ID,
    oauth: {
      domain: process.env.REACT_APP_COGNITO_DOMAIN,
      scope: ['email', 'openid', 'profile'],
      redirectSignIn: process.env.REACT_APP_COGNITO_REDIRECT_SIGNIN,
      redirectSignOut: process.env.REACT_APP_COGNITO_REDIRECT_SIGNOUT,
      responseType: 'code'
    }
  }
});

const history = createBrowserHistory();

export default function App() {
  return (
    <HelmetProvider>
      <ReduxProvider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <ThemeConfig>
            <RtlLayout>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <NotistackProvider>
                  <Router history={history}>
                    <JwtProvider>
                      <Settings />
                      <ScrollToTop />
                      <GoogleAnalytics />
                      {renderRoutes(routes)}
                    </JwtProvider>
                  </Router>
                </NotistackProvider>
              </LocalizationProvider>
            </RtlLayout>
          </ThemeConfig>
        </PersistGate>
      </ReduxProvider>
    </HelmetProvider>
  );
}
