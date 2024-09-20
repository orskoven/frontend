import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const loginVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate('/threatactors'); // Redirect to Threat Actors page after login
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <Container>
      <Box mt={5}>
        <motion.div
          variants={loginVariants}
          initial="hidden"
          animate="visible"
        >
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
              Login
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                aria-label="Username"
                inputProps={{ 'aria-required': true }}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                aria-label="Password"
                inputProps={{ 'aria-required': true }}
              />
              {error && (
                <Typography color="error" variant="body2" role="alert">
                  {error}
                </Typography>
              )}
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                style={{ marginTop: '20px' }}
                aria-label="Submit Login Form"
              >
                Login
              </Button>
            </form>
            <Typography variant="body2" align="center" marginTop={2}>
              Don't have an account? <Link to="/register">Register</Link>
            </Typography>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Login;
