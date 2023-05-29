import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PersonIcon from '@mui/icons-material/Person';
import CreateIcon from '@mui/icons-material/Create';
import LockIcon from '@mui/icons-material/Lock';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAction } from '../actions/userAction';
const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': {
        ...openedMixin(theme),
      },
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': {
        ...closedMixin(theme),
      },
    }),
  })
);

interface SideBarComponentProps {
  open: boolean;
  handleDrawerClose: () => void;
}
interface IconMap {
  [key: string]: React.ReactElement;
}
const iconMap: IconMap = {
  Dashboard: <DashboardIcon />,
  Product: <ShoppingCartIcon />,
  Category: <CategoryIcon />,
  Pricing: <MonetizationOnIcon />,
  Customers: <PersonIcon />,
  Signup: <CreateIcon />,
  Login: <LockIcon />,
};

function SideBarComponent({ open, handleDrawerClose }: SideBarComponentProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = sessionStorage.getItem('accessToken') !== null; // Check if the user is logged in
  const logoutHandler = () => {
    dispatch(logoutAction());
    // Additional logout logic can be added here if needed
    navigate('/admin/users');
  };
  const menuItems1 = isLoggedIn
    ? [
        { text: 'Dashboard', link: '/admin/dashboard', icon: <DashboardIcon /> },
        //{ text: 'Category', link: '/category', icon: <CategoryIcon /> },
        //{ text: 'Pricing', link: '/pricing', icon: <MonetizationOnIcon /> },
       // { text: 'Customers', link: '/customers', icon: <PersonIcon /> },
       { text: 'Product', link: '/product', icon: <ShoppingCartIcon /> },
      ]
    : [
        { text: 'Product', link: '/product', icon: <ShoppingCartIcon /> },
      ];

  const menuItems2 = isLoggedIn
    ? [
        //{ text: 'Customers', link: '/customers', icon: <PersonIcon /> },
        { text: 'Logout', link: '#', icon: <ExitToAppIcon /> },
      ]
    : [
        { text: 'Login', link: '/admin/users', icon: <LockIcon /> },
        { text: 'Signup', link: '/user/signup', icon: <CreateIcon /> },
      ];

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {menuItems1.map(({ text, link, icon }) => (
          <ListItem key={text} disablePadding sx={{ display: 'block' }}>
            <Link to={link} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {menuItems2.map(({ text, link, icon }) => (
          <ListItem key={text} disablePadding sx={{ display: 'block' }}>
            <Link to={link} style={{ textDecoration: 'none', color: 'inherit' }}>
              {text === 'Logout' ? (
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={logoutHandler} // Invoke logoutHandler when clicking on Logout
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              ) : (
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              )}
            </Link>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default SideBarComponent;
