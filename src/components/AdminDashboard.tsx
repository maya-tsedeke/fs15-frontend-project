import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { getMyProfile } from '../apiServices/authApi';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  background: '#f5f5f5',
  padding:10,
});

const CardsContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  marginTop: '16px',
});

const Card = styled(motion.div)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: 415,
  height: 400,
  borderRadius: 10,
  background: '#fff',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  padding: '16px',
  margin: '0 8px',
});
const TableContainer = styled(motion.div)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: 850,
  height: 400,
  borderRadius: 10,
  background: '#fff',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  padding: '16px',
  margin: '0 8px',
});
const Avatar = styled('img')({
  width: 120,
  height: 120,
  borderRadius: '50%',
  marginBottom: 16,
});

const Name = styled('h3')({
  fontSize: 24,
  fontWeight: 600,
  marginBottom: 8,
});

const Email = styled('p')({
  fontSize: 16,
  marginBottom: 16,
});

const UpdateButton = styled('button')({
  fontSize: 16,
  fontWeight: 600,
  background: '#4caf50',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  padding: '8px 16px',
  cursor: 'pointer',
  marginTop: 'auto',
});

const AdminDashboard = () => {
  const isLoggedIn = sessionStorage.getItem('accessToken') !== null;
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        //console.log('My profile:', response);
        setProfile(response);
      } catch (error) {
        console.log(error);
      }
    };

    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn]);

  const spring = {
    type: 'spring',
    damping: 10,
    stiffness: 100,
  };

  const handleUpdateProfile = (id:number) => {
    const userId=id;
    navigate(`/admin/settings/${userId}`);
  };

  const renderProfileCard = () => {
    if (profile) {
      const { id, name, email, avatar, role } = profile;
      return (
        <Card
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
        >
          <Avatar src={avatar} alt="Profile" />
          <Name>{name}</Name>
          <Email>{email}</Email>
          <p>Role: {role}</p>
          <SettingsIcon fontSize="large" onClick={() => handleUpdateProfile(id)}>
          Settings
          </SettingsIcon>
        </Card>
      );
    }

    return null;
  };

  if (!isLoggedIn) {
    navigate('/admin/users');
    return null;
  }

  return (
    <Container>
      <CardsContainer>
        {renderProfileCard()}

        <Card
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
        >
          <ShoppingCartIcon fontSize="large" />
          <Name>Orders</Name>
        </Card>
        <Card
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
        >
          <PeopleAltIcon fontSize="large" />
          <Name>Users</Name>
        </Card>
        <Card
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
        >
          <SettingsIcon fontSize="large" />
          <Name>Settings</Name>
        </Card>
      </CardsContainer>

      <CardsContainer>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Your Cart Products</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Product 1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Product 2</TableCell>
              </TableRow>
              {/* Add more rows as needed */}
            </TableBody>
            <TableBody>
              <TableRow>
                <TableCell colSpan={1} style={{ textAlign: 'center' }}>
                  <button>Proceed</button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Your Order Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>John Doe</TableCell>
                <TableCell>2023-05-26</TableCell>
                <TableCell>Processing</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2</TableCell>
                <TableCell>Jane Smith</TableCell>
                <TableCell>2023-05-25</TableCell>
                <TableCell>Shipped</TableCell>
              </TableRow>
              {/* Add more rows as needed */}
            </TableBody>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                  <button>Proceed</button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardsContainer>
    </Container>
  );
};

export default AdminDashboard;
