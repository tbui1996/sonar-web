import NProgress from 'nprogress';
import { Switch, Route, Redirect, RouteProps } from 'react-router-dom';
import { Suspense, Fragment, lazy, useEffect, useMemo, ReactNode } from 'react';
// material
import { makeStyles } from '@material-ui/core/styles';
// guards
import GuestGuard from '../guards/GuestGuard';
// components
import LoadingScreen from '../components/LoadingScreen';
//
import { PATH_PAGE, PATH_AUTH, PATH_DASHBOARD } from './paths';
import DashboardRoutes from './dashboard.routes';

// ----------------------------------------------------------------------

const nprogressStyle = makeStyles((theme) => ({
  '@global': {
    '#nprogress': {
      pointerEvents: 'none',
      '& .bar': {
        top: 0,
        left: 0,
        height: 2,
        width: '100%',
        position: 'fixed',
        zIndex: theme.zIndex.snackbar,
        backgroundColor: theme.palette.primary.main,
        boxShadow: `0 0 2px ${theme.palette.primary.main}`
      },
      '& .peg': {
        right: 0,
        opacity: 1,
        width: 100,
        height: '100%',
        display: 'block',
        position: 'absolute',
        transform: 'rotate(3deg) translate(0px, -4px)',
        boxShadow: `0 0 10px ${theme.palette.primary.main}, 0 0 5px ${theme.palette.primary.main}`
      }
    }
  }
}));

function RouteProgress(props: RouteProps) {
  nprogressStyle();

  NProgress.configure({
    speed: 500,
    showSpinner: false
  });

  useMemo(() => {
    NProgress.start();
  }, []);

  useEffect(() => {
    NProgress.done();
  }, []);

  return <Route {...props} />;
}

export function renderRoutes(routes: RouteItem[] = []) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {routes.map((route, idx) => {
          const Component = route.component;
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;

          return (
            <RouteProgress
              key={`routes-${idx}`}
              path={route.path}
              exact={route.exact}
              render={(props: any) => (
                <Guard>
                  <Layout>
                    {route.routes && route.routes ? (
                      renderRoutes(route.routes)
                    ) : (
                      <Component {...props} />
                    )}
                  </Layout>
                </Guard>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  );
}

type RouteItem = {
  exact?: boolean;
  guard?: ({ children }: { children: ReactNode }) => JSX.Element;
  path?: string | string[];
  component?: any;
  layout?: ({ children }: { children: ReactNode }) => JSX.Element;
  routes?: {
    component: any;
    path?: string | string[];
    exact?: boolean;
  }[];
};

const routes: RouteItem[] = [
  // Others Routes
  {
    exact: true,
    guard: GuestGuard,
    path: [PATH_AUTH.login],
    component: lazy(() => import('../views/authentication/Login'))
  },
  {
    exact: true,
    path: PATH_AUTH.loginUnprotected,
    component: lazy(() => import('../views/authentication/Login'))
  },
  {
    exact: true,
    path: PATH_PAGE.page404,
    component: lazy(() => import('../views/Page404'))
  },
  {
    exact: true,
    path: PATH_PAGE.page500,
    component: lazy(() => import('../views/Page500'))
  },
  {
    exact: true,
    path: PATH_PAGE.comingSoon,
    component: lazy(() => import('../views/ComingSoon'))
  },
  {
    exact: true,
    path: PATH_PAGE.maintenance,
    component: lazy(() => import('../views/Maintenance'))
  },
  {
    exact: true,
    path: PATH_AUTH.root,
    component: () => <Redirect to={PATH_AUTH.login} />
  },
  {
    exact: true,
    path: '/',
    component: () => <Redirect to={PATH_DASHBOARD.general.app} />
  },

  // App Routes
  DashboardRoutes
];

export default routes;
