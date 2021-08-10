import { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import { PATH_DASHBOARD } from './paths';
// guards
import AuthGuard from '../guards/AuthGuard';
// layouts
import DashboardLayout from '../layouts/dashboard';
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
      component: lazy(() => import('../views/GeneralApp'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.general.analytics,
      component: () => <Redirect to={PATH_DASHBOARD.general.app} />
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
      path: PATH_DASHBOARD.modalities.support.root,
      component: lazy(() => import('../views/support/Root'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.modalities.support.demo_only_chat.root,
      component: lazy(() => import('../views/support/demo_only_chat/Root'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.modalities.support.demo_only_pending_chat.root,
      component: lazy(
        () => import('../views/support/demo_only_pending_chat/Root')
      )
    },
    {
      exact: true,
      path: PATH_DASHBOARD.user.account,
      component: lazy(() => import('../views/UserAccount'))
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
