// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use Auth Context
export const useAuth = () => useContext(AuthContext);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User object
  const [loading, setLoading] = useState(true); // Loading state

  // Function to handle login
  const login = async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      setUser(response.data.user);
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      // Set token in axios headers for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Allow components to handle the error
    }
  };

  // Function to handle logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  // Function to handle registration
  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      setUser(response.data.user);
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      // Set token in axios headers for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error; // Allow components to handle the error
    }
  };

  // Fetch user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Set token in axios headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/api/auth/me');
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        logout(); // Clear user data on error
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Define the context value
  const value = {
    user,
    loading,
    login,
    logout,
    register, // Add register function to context
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};