import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import RegistrationService from '../../services/RegistrationService';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const formVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const RegistrationForm = () => {
  const navigate = useNavigate();

  // Define form validation schema using Yup
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required')
      .min(4, 'Username must be at least 4 characters'),
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await RegistrationService.register({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      toast.success('Registration successful! Please log in.');
      reset();
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <Container>
      <Box mt={5}>
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
              Register
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                label="Username"
                name="username"
                {...register('username')}
                error={Boolean(errors.username)}
                helperText={errors.username?.message}
                required
                fullWidth
                margin="normal"
                aria-label="Username"
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                {...register('email')}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                required
                fullWidth
                margin="normal"
                aria-label="Email"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                {...register('password')}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                required
                fullWidth
                margin="normal"
                aria-label="Password"
              />
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword?.message}
                required
                fullWidth
                margin="normal"
                aria-label="Confirm Password"
              />
              <Box mt={3}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                  aria-label="Submit Registration Form"
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
                </Button>
              </Box>
            </form>
            <Box mt={2}>
              <Typography variant="body2" align="center">
                Already have an account? <Link to="/login">Login</Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default RegistrationForm;
