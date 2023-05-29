import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DashboardIcon from '@mui/icons-material/Dashboard';
//import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
//import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../actions/userAction';
import { RootState } from '../store';

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
interface HeaderComponentProps {
  open: boolean;
  handleDrawerToggle: () => void;
}
const HeaderComponent = ({ open, handleDrawerToggle }: HeaderComponentProps) => {
  const isLoggedIn = sessionStorage.getItem('accessToken') !== null; // Check if the user is logged in

  const userData = useSelector((state: RootState) => state.user.userData);
  const name = useSelector((state: RootState) => state.user.name);
  const avatar = useSelector((state: RootState) => state.user.avatar);
  let title = '';
  useEffect(() => {
    document.title = 'Ethiomecan'; // Set the new title here
    title = document.title;
  }, []);
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logoutAction());
    // Additional logout logic can be added here if needed
    navigate('/admin/users');
  };

  const handleDashboardClick = (menuItem: string) => {
    switch (menuItem) {
      case 'dashboard':
        navigate('/admin/dashboard');
        break;
      case 'settings':
        navigate('/admin/settings/:userId');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      case 'logout':
        logoutHandler(); // Call the logoutHandler directly
        break;
      default:
        // Handle any other menu item or error condition
        break;
    }
    handleCloseUserMenu(); // Close the user menu after clicking any menu item
  };

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={process.env.PUBLIC_URL + '/logo192.png'}
            alt="Logo"
            style={{ width: '50px', height: '50px', marginRight: '10px' }}
          />
          <Typography variant="h6" noWrap component="div" id="logo">
            Ethiomecan Store
          </Typography>
        </div>
        <Box sx={{ flexGrow: 0, ml: 'auto' }}>
          <Tooltip title="Cart">
            <IconButton sx={{ p: 0, mx: 1 }}>
              <ShoppingCartIcon />
            </IconButton>
          </Tooltip>
          {isLoggedIn && (
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {/* Replace the avatar image source with your own */}
                <Avatar alt={name || ''} src={avatar || ''} />
              </IconButton>
            </Tooltip>
          )}
          {!isLoggedIn && (
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {/* Replace the avatar image source with your own */}
                <Avatar alt="Remy Sharp" src="https://avatars.githubusercontent.com/u/vvv?v=5" />
              </IconButton>
            </Tooltip>
          )}
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {isLoggedIn ? (
              [ <MenuItem key="settings" onClick={() => handleDashboardClick('settings')}>
                <Typography textAlign="center">{name}</Typography>
            </MenuItem>,
                <MenuItem key="dashboard" onClick={() => handleDashboardClick('dashboard')}>
                  <Box component="span" mr={1}>
                    <DashboardIcon />
                  </Box>
                  <Typography textAlign="center">Dashboard</Typography>
                </MenuItem>,
                <MenuItem key="logout" onClick={() => handleDashboardClick('logout')}>
                  <Box component="span" mr={1}>
                    <ExitToAppIcon />
                  </Box>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>,
              ]
            ) : (
              <MenuItem onClick={() => handleDashboardClick('users')}>
                <Box component="span" mr={1}>
                  <LockIcon />
                </Box>
                <Typography textAlign="center">Login</Typography>
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderComponent;
