import { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import { PATH_DASHBOARD } from './paths';
// guards
import AuthGuard from '../guards/AuthGuard';
// layouts
import DashboardLayout from '../layouts/dashboard';
import DevelopmentAdminGuard from '../guards/DevelopmentAdminGuard';
// ----------------------------------------------------------------------

const DashboardRoutes = {
  path: PATH_DASHBOARD.root,
  guard: AuthGuard,
  layout: DashboardLayout,
  routes: [
    // GENERAL
    // ----------------------------------------------------------------------
    {
      exact: true,
      path: PATH_DASHBOARD.general.app,
      component: () => <Redirect to={PATH_DASHBOARD.modalities.chat.root} />
    },
    {
      exact: true,
      path: PATH_DASHBOARD.general.analytics,
      component: () => <Redirect to={PATH_DASHBOARD.modalities.chat.root} />
      // component: lazy(() => import('../views/GeneralAnalytics'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.root,
      component: () => <Redirect to={PATH_DASHBOARD.general.app} />
    },
    {
      exact: true,
      path: PATH_DASHBOARD.modalities.note,
      component: lazy(() => import('../views/Note'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.modalities.message,
      component: lazy(() => import('../views/Message'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.modalities.broadcast,
      component: lazy(() => import('../views/Broadcast'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.modalities.datasheet,
      component: lazy(() => import('../views/Datasheet'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.modalities.forms.root,
      component: lazy(() => import('../views/forms/Root'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.modalities.files.root,
      component: lazy(() => import('../views/files/Root'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.modalities.forms.response,
      component: lazy(() => import('../views/forms/Response'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.modalities.forms.create,
      component: lazy(() => import('../views/forms/Create'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.modalities.forms.view,
      component: lazy(() => import('../views/forms/View'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.modalities.chat.root,
      component: lazy(() => import('../views/chat/Root'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.modalities.users.root,
      component: lazy(() => import('../views/users/Root'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.modalities.patients.root,
      component: lazy(() => import('../views/patients/Root'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.modalities.flags.root,
      component: lazy(() => import('../views/flags/Root')),
      guard: DevelopmentAdminGuard
    },
    {
      exact: true,
      path: PATH_DASHBOARD.modalities.appointments.root,
      component: lazy(() => import('../views/appointments/Root'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.user.account,
      component: () => <Redirect to="/404" />
    },
    {
      exact: true,
      path: '/',
      component: () => <Redirect to={PATH_DASHBOARD.general.app} />
    },
    {
      component: () => <Redirect to="/404" />
    }
  ]
};

export default DashboardRoutes;
