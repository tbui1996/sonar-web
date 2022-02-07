// routes
import { Flag } from '@material-ui/icons';
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';
import CognitoGroups from '../../constants/cognitoGroups';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle
    src={`/static/icons/navbar/${name}.svg`}
    sx={{ width: 22, height: 22 }}
  />
);

const ICONS = {
  map: getIcon('ic_map'),
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  page: getIcon('ic_page'),
  user: getIcon('ic_user'),
  copy: getIcon('ic_copy'),
  error: getIcon('ic_error'),
  charts: getIcon('ic_charts'),
  editor: getIcon('ic_editor'),
  upload: getIcon('ic_upload'),
  animate: getIcon('ic_animate'),
  calendar: getIcon('ic_calendar'),
  elements: getIcon('ic_elements'),
  carousel: getIcon('ic_carousel'),
  language: getIcon('ic_language'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  components: getIcon('ic_components'),
  authenticator: getIcon('ic_authenticator'),
  flags: <Flag />
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'general',
  //   items: [
  //     {
  //       title: 'dashboard',
  //       href: PATH_DASHBOARD.general.app,
  //       icon: ICONS.dashboard
  //     }
  //   ]
  // },

  {
    subheader: 'modalities',
    items: [
      {
        title: 'Broadcast',
        href: PATH_DASHBOARD.modalities.broadcast,
        icon: ICONS.mail
      },
      {
        title: 'Forms',
        href: PATH_DASHBOARD.modalities.forms.root,
        icon: ICONS.blog
      },
      {
        title: 'Chat',
        href: PATH_DASHBOARD.modalities.chat.root,
        icon: ICONS.chat
      },
      {
        title: 'User roles',
        href: PATH_DASHBOARD.modalities.users.root,
        icon: ICONS.user
      },
      {
        title: 'Files',
        href: PATH_DASHBOARD.modalities.files.root,
        icon: ICONS.elements
      },
      {
        title: 'Flags',
        href: PATH_DASHBOARD.modalities.flags.root,
        requiredGroup: CognitoGroups.DEVELOPMENT_ADMIN,
        icon: ICONS.flags
      },
      {
        title: 'Appointments',
        href: PATH_DASHBOARD.modalities.appointments.root,
        icon: ICONS.calendar
      }
    ]
  }

  // MANAGEMENT
  // ----------------------------------------------------------------------
  // {
  // subheader: 'management',
  // items: [
  // {
  // title: 'users',
  // icon: ICONS.user,
  // href: '#'
  // }
  // ]
  // }
];

export default sidebarConfig;
