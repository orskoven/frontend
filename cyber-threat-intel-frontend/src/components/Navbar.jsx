// src/components/Navbar.jsx

import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Switch } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeContext } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const navVariants = {
  hidden: { y: -100 },
  visible: { y: 0, transition: { type: 'spring', stiffness: 50 } },
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.div
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            style={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
            aria-label="Cyber Threat Intel Home"
          >
            Cyber Threat Intel
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit" aria-label="Toggle dark/light theme">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {user ? (
            <>
              <Typography variant="body1" style={{ marginRight: '20px' }}>
                {user.username}
              </Typography>
              <Button color="inherit" onClick={handleLogout} aria-label="Logout">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login" aria-label="Login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register" aria-label="Register">
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default Navbar;