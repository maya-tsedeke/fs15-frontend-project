import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { registerAction } from '../../actions/userAction';
import { registerUser, UserResponse, checkEmailAvailability } from '../../apiServices/authApi';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { useNavigate } from 'react-router-dom';

const RegisterComponent = () => {
  const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const navigate = useNavigate();
  const handleEmailBlur = async () => {
    if (email.trim() === '') {
      setError('Email is required');
      return;
    }
    try {
      const emailExists = await checkEmailAvailability(email);
      if (emailExists) {
        setError('This email already exists');
      } else {
        setError('');
      }
    } catch (error) {
      setError('Failed to check email existence');
    }
  };
  const handleNameBlur = () => {
    if (name.trim() === '') {
      setError('Name is required');
    } else {
      setError('');
    }
  };
  const handlePasswordBlur = () => {
    if (password.trim() === '') {
      setError('Password is required');
    } else {
      setError('');
    }
  };
  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (email.trim() === '') {
      setError('Email is required');
      return;
    }
  
    if (error !== '') {
      return;
    }
  
    try {
      setLoading(true);
      setError('');
  
      const userData: UserResponse = {
        name,
        email,
        password,
        avatar, // Use the avatar state value
        role: 'customer', // Assuming the role should be 'customer'
        id: 0,
        accessToken:'',
      };
      const response = await registerUser(userData);
  
      if (response && response.id) {
        userData.id = response.id;
        dispatch(registerAction(userData, () => redirectToProfile(userData))); // Pass userData as a parameter
        setSuccess(true);
        setLoading(false);
      } else {
        setError('Registration failed');
        setLoading(false);
      }
    } catch (error) {
      setError('Registration failed');
      setLoading(false);
    }
  };
  const redirectToProfile = (userData: UserResponse) => { // Accept userData as a parameter
    navigate(`/admin/settings/${userData.id}`); // Redirect to the profile page
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'top', height: '50vh' }}>
      <div style={{ width: '400px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <Box sx={{ mt: 2 }}>
          {success ? (
            <Typography variant="body1" color="success.main" align="center">
              Registration successful!
            </Typography>
          ) : (
            <Typography variant="body1" color="error.main" align="center">
              {error}
            </Typography>
          )}
        </Box>
        <Box sx={{ mt: 2 }}>
          <form onSubmit={handleRegister}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    id="name"
                    label="Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleNameBlur}
                    required
                  />
                  <FormHelperText>
                    {error && error === 'Name is required' ? (
                      <span style={{ color: 'red' }}>{error}</span>
                    ) : (
                      <span>{error}</span>
                    )}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    id="email"
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    required
                  />
                  <FormHelperText>
                    {error && error === 'Email is required' ? (
                      <span style={{ color: 'red' }}>{error}</span>
                    ) : (
                      <span>{error}</span>
                    )}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    id="password"
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={handlePasswordBlur}
                    required
                  />
                  <FormHelperText>
                    {error && error === 'Password is required' ? (
                      <span style={{ color: 'red' }}>{error}</span>
                    ) : (
                      <span>{error}</span>
                    )}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    id="avatar"
                    label="Avatar"
                    variant="outlined"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}>
                Register
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Container>
    </div>
    </div>
  );
};
export default RegisterComponent;
