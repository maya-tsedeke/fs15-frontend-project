import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { RootState } from '../../store';
import {
  getUserAction,
  updateUserDataAction,
  refreshAccessTokenRequest,
  logoutAction, // Import the logoutUserAction
} from '../../actions/userAction';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { useNavigate, useParams } from 'react-router-dom';
import { UserResponse } from '../../apiServices/authApi';

const ProfileComponent = () => {
  const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const { userId } = useParams();
  const { loading, error, userData, refreshToken } = useSelector((state: RootState) => state.user);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showOldToken, setShowOldToken] = useState(false);

  useEffect(() => {
    dispatch(getUserAction(Number(userId)));
  }, [dispatch, userId]);

  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setEmail(userData.email);
      setRole(userData.role);
    }
  }, [userData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userData) {
      setName(userData.name);
      setEmail(userData.email);
      setRole(userData.role);
    }
  };

  const handleSubmit = () => {
    if (userData) {
      const updatedUserData: UserResponse = {
        id: userData.id,
        name,
        email,
        password: '',
        avatar: '',
        role: '',
        accessToken: ''
      };
      dispatch(updateUserDataAction(updatedUserData, () => {
        setIsEditing(false);
      }));
    }
  };

  const handleRefreshToken = () => {
    dispatch(refreshAccessTokenRequest());
    setShowOldToken(true);
  };
  const navigate = useNavigate();
  const logoutUser = () => {
    dispatch(logoutAction());
        // Additional logout logic can be added here if needed
        navigate('/admin/users');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return null;
  }

  const { avatar } = userData;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ width: 120, height: 120, mb: 4 }} src={avatar} alt={name} />
        {isEditing ? (
          <>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button variant="contained" onClick={handleSubmit} sx={{ mr: 2 }}>
                Save
              </Button>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              {name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Email: {email}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Role: {role}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button variant="contained" onClick={handleEdit} sx={{ mr: 2 }}>
                Edit
              </Button>
              <Button variant="outlined" onClick={handleRefreshToken}>
                Refresh Token
              </Button>
            </Box>
            {refreshToken && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1">Refresh Token: {refreshToken}</Typography>
                <hr></hr>
                <p>Note: The access token is valid for 20 days, and the refresh token is valid for 10 hours.</p>
              </Box>
            )}
            {showOldToken && userData?.accessToken && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1">New Token: {userData.accessToken.substring(0, 100)}</Typography>
                <Typography variant="body1">{userData.accessToken.substring(100)}</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button variant="outlined" onClick={logoutUser}>
              <Box component="span" mr={2}>
                    <ExitToAppIcon />
                  </Box>
                  Logout
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ProfileComponent;
