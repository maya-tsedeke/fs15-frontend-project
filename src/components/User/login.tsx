import React, { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';
import {
    Button,
    TextField,
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';
import { JSX } from 'react/jsx-runtime';
import UserList from './listUser';
interface LoginComponentProps {
    setCurrentComponent: Dispatch<SetStateAction<React.ReactNode>>;
}
const LoginComponent = (props: LoginComponentProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // LoginComponent
    const handleLogin = async () => {
        setLoading(true);

        try {
            const response = await axios.post('https://api.escuelajs.co/api/v1/auth/login', {
                email: email,
                password: password,
            });

            const { access_token, refresh_token } = response.data;

            // Store the tokens in localStorage or cookies for future use
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            console.log(access_token);

            // Redirect to UserList component
            props.setCurrentComponent(<UserList />);
        } catch (error) {
            console.log('Error logging in:', error);
            // Display error message or handle login failure
        } finally {
            setLoading(false);
        }
    };
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '40px',
            }} >
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <Box
                component="form"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '300px',
                    marginTop: '20px',
                }} >
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    margin="normal" />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    margin="normal" />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    disabled={loading}
                    sx={{ marginTop: '20px' }} >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
            </Box>
        Example:    
  email: john@mail.com
  password: changeme

        </Box>
    );
};
export default LoginComponent;
function setCurrentComponent(arg0: JSX.Element) {
    throw new Error('Function not implemented.');
}

