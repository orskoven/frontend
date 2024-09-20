import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your backend URL
});

// Intercept requests to add the Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Ensure token is stored upon login
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
