import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Import BrowserRouter and Routes
import HeaderComponent from './components/HeaderComponent';
import SideBarComponent from './components/SideBarComponent';
import AdminDashboard from './components/AdminDashboard';
import { Provider } from 'react-redux';
import store from './store';
import Login from './components/Users/LoginComponent';
import ProfileComponent from './components/Users/ProfileComponent';
import RegisterComponent from './components/Users/RegisterComponent';
import ProductComponent from './components/Product/ProductComponent';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

function App() {
  const [open, setOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Provider store={store}>
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <HeaderComponent open={open} handleDrawerToggle={handleDrawerToggle} />
        <SideBarComponent open={open} handleDrawerClose={handleDrawerToggle} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Routes> {/* Use Routes component */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Login />} />
          <Route path="/admin/settings/:userId" element={<ProfileComponent />} />
          <Route path="/user/signUp" element={<RegisterComponent />} />
          <Route path="/product" element={<ProductComponent />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
    </Provider>
  );
}
export default App;
