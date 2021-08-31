// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify')
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  page404: '/404',
  page500: '/500'
};

export const PATH_HOME = {
  dashboard: ROOTS_DASHBOARD
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    analytics: path(ROOTS_DASHBOARD, '/analytics')
  },
  modalities: {
    note: path(ROOTS_DASHBOARD, '/note'),
    broadcast: path(ROOTS_DASHBOARD, '/broadcast'),
    message: path(ROOTS_DASHBOARD, '/message'),
    datasheet: path(ROOTS_DASHBOARD, '/datasheet'),
    forms: {
      root: path(ROOTS_DASHBOARD, '/forms'),
      create: path(ROOTS_DASHBOARD, '/forms/create'),
      view: path(ROOTS_DASHBOARD, '/forms/:id')
    },
    chat: {
      root: path(ROOTS_DASHBOARD, '/chat')
    },
    users: {
      root: path(ROOTS_DASHBOARD, '/users')
    }
  },
  user: {
    account: path(ROOTS_DASHBOARD, '/user/account')
  }
};
