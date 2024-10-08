import { ReactNode, useEffect, useMemo } from 'react';
import { Link as RouterLink, useLocation, matchPath } from 'react-router-dom';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import {
  Box,
  List,
  // Button,
  Drawer,
  Hidden,
  Typography,
  ListSubheader
} from '@material-ui/core';
// hooks
import { useAuth } from '../../hooks/useAuth';
// components
import Logo from '../../components/Logo';
import MyAvatar from '../../components/MyAvatar';
import Scrollbar from '../../components/Scrollbar';
//
import MenuLinks from './SidebarConfig';
import SidebarItem from './SidebarItem';
import useGetCognitoUser from '../../hooks/useGetCognitoUser';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  margin: theme.spacing(1, 2.5, 5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[500_12]
}));

// const DocStyle = styled('div')(({ theme }) => ({
// padding: theme.spacing(2.5),
// borderRadius: theme.shape.borderRadiusMd,
// backgroundColor:
// theme.palette.mode === 'light'
// ? alpha(theme.palette.primary.main, 0.08)
// : theme.palette.primary.lighter
// }));
// ----------------------------------------------------------------------

type TNavItem = {
  icon?: ReactNode;
  info?: ReactNode;
  href: string;
  title: string;
  items?: TNavItem[];
  requiredGroup?: string;
};

type ReduceChildParams = {
  array: ReactNode[];
  item: TNavItem;
  pathname: string;
  level: number;
};

function reduceChild({ array, item, pathname, level }: ReduceChildParams) {
  const key = item.href + level;

  if (item.items) {
    const match = matchPath(pathname, {
      path: item.href,
      exact: false
    });

    return [
      ...array,
      <SidebarItem
        key={key}
        level={level}
        icon={item.icon}
        info={item.info}
        href={item.href}
        title={item.title}
        open={Boolean(match)}
      >
        <SideBarItems
          items={item.items}
          pathname={pathname}
          level={level + 1}
        />
      </SidebarItem>
    ];
  }
  return [
    ...array,
    <SidebarItem
      key={key}
      level={level}
      href={item.href}
      icon={item.icon}
      info={item.info}
      title={item.title}
    />
  ];
}

type RenderSidebarItemsParams = {
  items: TNavItem[];
  pathname: string;
  level?: number;
};

function SideBarItems({
  items,
  pathname,
  level = 0
}: RenderSidebarItemsParams) {
  const { data: cognitoUser } = useGetCognitoUser();
  const cognitoGroups =
    cognitoUser?.signInUserSession.accessToken.payload['cognito:groups'];

  const filteredItems = useMemo(
    () =>
      items.filter(
        (i) =>
          i.requiredGroup == null || cognitoGroups?.includes(i.requiredGroup)
      ),
    [items, cognitoGroups]
  );

  return (
    <List disablePadding>
      {filteredItems.reduce<ReactNode[]>(
        (array, item) => reduceChild({ array, item, pathname, level }),
        []
      )}
    </List>
  );
}

type NavBarProps = {
  isOpenSidebar?: boolean;
  onCloseSidebar?: VoidFunction;
};

export default function DashboardSidebar({
  isOpenSidebar,
  onCloseSidebar
}: NavBarProps) {
  const { pathname } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpenSidebar && onCloseSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar>
      <Box sx={{ px: 2.5, py: 3 }}>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
      </Box>

      <AccountStyle>
        <MyAvatar />
        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
            {user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {user.role}
          </Typography>
        </Box>
      </AccountStyle>

      {MenuLinks.map((list) => (
        <List
          disablePadding
          key={list.subheader}
          subheader={
            <ListSubheader
              disableSticky
              disableGutters
              sx={{
                mt: 3,
                mb: 2,
                pl: 5,
                color: 'text.primary',
                typography: 'overline'
              }}
            >
              {list.subheader}
            </ListSubheader>
          }
        >
          <SideBarItems items={list.items} pathname={pathname} />
        </List>
      ))}
    </Scrollbar>
  );

  return (
    <RootStyle>
      <Hidden lgUp>
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: { width: DRAWER_WIDTH, bgcolor: 'background.default' }
          }}
        >
          {renderContent}
        </Drawer>
      </Hidden>
    </RootStyle>
  );
}
