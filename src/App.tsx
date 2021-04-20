import { FunctionComponent, Suspense } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AppShell from 'components/core/AppShell';


// Pages
import BroadcastPage from 'pages/Broadcast';
import WorkflowPage from 'pages/Workflow';
import DashboardPage from 'pages/Dashboard';

import theme from './theme';

const App: FunctionComponent = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Suspense fallback="loading">
      <Router>
        <AppShell>
          <Switch>
            <Route path="/" exact>
              <DashboardPage />
            </Route>
            <Route path="/note">
              <WorkflowPage />
            </Route>
            <Route path="/broadcast">
              <BroadcastPage />
            </Route>
            <Route path="/echoes">
              <p>Echoes</p>
            </Route>
            <Route path="/contacts">
              <p>Contacts</p>
            </Route>
          </Switch>
        </AppShell>
      </Router>
    </Suspense>
  </ThemeProvider>
)

export default App;
