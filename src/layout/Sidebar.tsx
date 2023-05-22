import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { Home, Person, ShoppingCart, Login, ExitToApp } from '@mui/icons-material';
import { Dispatch, SetStateAction } from 'react';
import ProductComponenet from '../components/product';
import FilterProductsComponent from '../components/FilterProducts';
import FilterListIcon from '@mui/icons-material/FilterList';
import CategoriesComponent from '../components/Categories';
import UserList from '../components/User/listUser'
import LoginComponent from '../components/User/login';
import CategoryIcon from '@material-ui/icons/Category';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentComponent: Dispatch<SetStateAction<React.ReactNode | null>>;
}

function Sidebar(props: SidebarProps) {
  const { isOpen, setCurrentComponent } = props;
  const isLoggedIn = !!localStorage.getItem('access_token'); // Check if the user is logged in

  const handleNavigation = (path: string) => {
    if (!isLoggedIn && path !== '/login') {
      return; // Don't allow navigation to other pages if not logged in
    }

    switch (path) {
      case '/home':
        // Render Home component
        setCurrentComponent(null); // Replace with your Home component
        break;
      case '/favorites':
        // Render Favorites component
        setCurrentComponent(null); // Replace with your Favorites component
        break;
      case '/Categories':
        // Render Category component
        setCurrentComponent(<CategoriesComponent />);
        break;
      case '/product':
        // Render product component
        setCurrentComponent(<ProductComponenet />);
        break;
      case '/FilterProducts':
        // Render Filterproduct component
        setCurrentComponent(<FilterProductsComponent />);
        break;
      case '/users':
        // Render UserList component
        setCurrentComponent(<UserList />);
        break;
      case '/login':
        // Render Login component
        setCurrentComponent(<LoginComponent setCurrentComponent={setCurrentComponent} />);
        break;
      default:
        // Handle invalid path
        setCurrentComponent(null);
        break;
    }
  };
  const handleLogout = () => {
    // Clear the user's authentication state
    localStorage.removeItem('access_token');

    // Redirect the user to the login page or perform any other required actions
    setCurrentComponent(<LoginComponent setCurrentComponent={setCurrentComponent} />);
  };
  const renderSidebarMenu = () => {
    if (isLoggedIn) {
      return (
        <>
          <ListItem button onClick={() => handleNavigation('/home')}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Home" />}
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/Categories')}>
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Categories" />}
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/product')}>
            <ListItemIcon>
              <ShoppingCart />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Products" />}
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/FilterProducts')}>
            <ListItemIcon>
              <FilterListIcon />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Filter" />}
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/users')}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Users" />}
          </ListItem>
          <ListItem button onClick={() => handleLogout()}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            {isOpen && <ListItemText primary="Logout" />}
          </ListItem>
        </>
      );
    } else {
      return (
        <ListItem button onClick={() => handleNavigation('/login')}>
          <ListItemIcon>
            <Login />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Login" />}
        </ListItem>
      );
    }
  };

  return (
    <Drawer variant="permanent" anchor="left" open={isOpen}>
      <Toolbar />
      <List>
        {renderSidebarMenu()}
      </List>
    </Drawer>
  );
}
export default Sidebar;
