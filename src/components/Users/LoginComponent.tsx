import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../actions/userAction';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
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

const Login = () => {
  const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.user.success);
  const updatedIsLoggedIn = useSelector((state: RootState) => state.user.success);
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (email && password) {
      // Call the login action
      await dispatch(loginAction(email, password));
  
      // Check if login is successful
      if (isLoggedIn) {
        // Redirect to the AdminDashboard
        navigate('/admin/dashboard');
      } else {
        // Set the error message for login failure
        setError('No account found with this information.');
      }
    } else {
      setError('Please enter valid credentials.');
    }
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'top', height: '50vh' }}>
      <div style={{ width: '400px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <Container maxWidth="sm">
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" component="h1" style={{ marginBottom: '16px', textAlign: 'center' }}>
              Login
            </Typography>
            {error && <Typography variant="body1" style={{ color: 'red', marginBottom: '16px' }}>{error}</Typography>}
            <form>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                Login
              </Button>
            </form>
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default Login;
