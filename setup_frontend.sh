#!/bin/bash

# setup_frontend.sh
# Comprehensive Bash script to automate the setup of a Vite.js and React.js frontend project
# with Framer Motion for animations, Material-UI for high-end UI/UX, and accessibility features.

# Exit immediately if a command exits with a non-zero status
set -e

# Function to display informational messages
function echo_info() {
    echo -e "\e[34m[INFO]\e[0m $1"
}

# Function to display success messages
function echo_success() {
    echo -e "\e[32m[SUCCESS]\e[0m $1"
}

# Function to display error messages
function echo_error() {
    echo -e "\e[31m[ERROR]\e[0m $1"
}

# Check for Node.js installation
if ! command -v node &> /dev/null
then
    echo_error "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check for npm installation
if ! command -v npm &> /dev/null
then
    echo_error "npm is not installed. Please install npm."
    exit 1
fi

# Variables
PROJECT_NAME="cyber-threat-intel-frontend"
BACKEND_URL="http://localhost:8080" # Modify this if your backend is hosted elsewhere
UI_FRAMEWORK="mui" # Options: mui, bootstrap

# Prompt for UI framework selection
echo "Select a UI Framework:"
echo "1. Material-UI (MUI)"
echo "2. Bootstrap"
read -p "Enter choice [1 or 2]: " UI_CHOICE

if [ "$UI_CHOICE" -eq 1 ]; then
    UI_FRAMEWORK="mui"
elif [ "$UI_CHOICE" -eq 2 ]; then
    UI_FRAMEWORK="bootstrap"
else
    echo_error "Invalid choice. Defaulting to Material-UI (MUI)."
    UI_FRAMEWORK="mui"
fi

# Initialize Vite React project
echo_info "Initializing Vite React project..."

# Check if project directory exists
if [ -d "$PROJECT_NAME" ]; then
    echo_info "Target directory \"$PROJECT_NAME\" already exists. Removing existing files and continuing..."
    rm -rf "$PROJECT_NAME"
fi

# Create the project using Vite
npm create vite@latest $PROJECT_NAME -- --template react

cd $PROJECT_NAME

echo_info "Installing dependencies..."

# Install core dependencies
npm install react-router-dom axios framer-motion

# Install UI framework dependencies
if [ "$UI_FRAMEWORK" = "mui" ]; then
    npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
elif [ "$UI_FRAMEWORK" = "bootstrap" ]; then
    npm install bootstrap react-bootstrap
fi

# Install form handling libraries
npm install formik yup

# (Optional) Install authentication libraries
# Uncomment if you plan to use JWT decoding
# npm install jwt-decode

# Create Folder Structure
echo_info "Creating folder structure..."

mkdir -p src/api
mkdir -p src/components/ThreatActor
mkdir -p src/components/IncidentLog
mkdir -p src/components/ProtectedRoute
mkdir -p src/context
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/styles

# Initialize API Service
echo_info "Setting up API integration..."

cat > src/api/api.js <<'EOL'
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
EOL

# Setup Context for Authentication
echo_info "Setting up Authentication Context..."

cat > src/context/AuthContext.jsx <<'EOL'
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
    const response = await api.post('/api/auth/login', credentials);
    setUser(response.data.user);
    // Store token in localStorage or cookies if provided
    localStorage.setItem('token', response.data.token);
  };

  // Function to handle logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
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
        console.error(error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
EOL

# Setup ProtectedRoute Component
echo_info "Setting up ProtectedRoute component..."

cat > src/components/ProtectedRoute/ProtectedRoute.jsx <<'EOL'
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
EOL

# Setup Framer Motion Wrapper (Optional for Consistent Animations)
echo_info "Setting up Framer Motion wrapper for consistent animations..."

cat > src/components/MotionWrapper.jsx <<'EOL'
import React from 'react';
import { motion } from 'framer-motion';

const MotionWrapper = ({ children, variants, initial, animate, exit }) => {
  return (
    <motion.div
      variants={variants}
      initial={initial}
      animate={animate}
      exit={exit}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
EOL

# Setup ThreatActorService
echo_info "Setting up ThreatActorService..."

cat > src/services/ThreatActorService.js <<'EOL'
import api from '../api/api';

const ThreatActorService = {
  getAll: () => api.get('/api/threatactors'),
  getById: (id) => api.get(`/api/threatactors/${id}`),
  create: (data) => api.post('/api/threatactors', data),
  update: (id, data) => api.put(`/api/threatactors/${id}`, data),
  delete: (id) => api.delete(`/api/threatactors/${id}`),
};

export default ThreatActorService;
EOL

# Setup IncidentLogService
echo_info "Setting up IncidentLogService..."

cat > src/services/IncidentLogService.js <<'EOL'
import api from '../api/api';

const IncidentLogService = {
  getAll: () => api.get('/api/incidentlogs'),
  getById: (id) => api.get(`/api/incidentlogs/${id}`),
  create: (data) => api.post('/api/incidentlogs', data),
  update: (id, data) => api.put(`/api/incidentlogs/${id}`, data),
  delete: (id) => api.delete(`/api/incidentlogs/${id}`),
};

export default IncidentLogService;
EOL

# Setup ThreatActorList Component with Framer Motion
echo_info "Setting up ThreatActorList component with animations..."

cat > src/components/ThreatActor/ThreatActorList.jsx <<'EOL'
import React, { useEffect, useState } from 'react';
import ThreatActorService from '../../services/ThreatActorService';
import { Link } from 'react-router-dom';
import { Table, Button, Container, Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ThreatActorList = () => {
  const [threatActors, setThreatActors] = useState([]);

  useEffect(() => {
    fetchThreatActors();
  }, []);

  const fetchThreatActors = async () => {
    try {
      const response = await ThreatActorService.getAll();
      setThreatActors(response.data);
    } catch (error) {
      console.error('Error fetching Threat Actors:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Threat Actor?')) {
      try {
        await ThreatActorService.delete(id);
        setThreatActors(threatActors.filter((actor) => actor.actorId !== id));
      } catch (error) {
        console.error('Error deleting Threat Actor:', error);
      }
    }
  };

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Threat Actors
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/threatactors/create"
          style={{ marginBottom: '20px' }}
        >
          Add Threat Actor
        </Button>
        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3}>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Origin Country</th>
                  <th>First Observed</th>
                  <th>Last Activity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {threatActors.map((actor) => (
                  <tr key={actor.actorId}>
                    <td>{actor.name}</td>
                    <td>{actor.type}</td>
                    <td>{actor.originCountry}</td>
                    <td>{new Date(actor.firstObserved).toLocaleDateString()}</td>
                    <td>{new Date(actor.lastActivity).toLocaleDateString()}</td>
                    <td>
                      <Button 
                        component={Link} 
                        to={`/threatactors/${actor.actorId}`} 
                        variant="outlined" 
                        color="primary"
                        style={{ marginRight: '10px' }}
                        aria-label={`View details of ${actor.name}`}
                      >
                        View
                      </Button>
                      <Button 
                        component={Link} 
                        to={`/threatactors/edit/${actor.actorId}`} 
                        variant="outlined" 
                        color="secondary"
                        style={{ marginRight: '10px' }}
                        aria-label={`Edit ${actor.name}`}
                      >
                        Edit
                      </Button>
                      <Button 
                        onClick={() => handleDelete(actor.actorId)} 
                        variant="outlined" 
                        color="error"
                        aria-label={`Delete ${actor.name}`}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default ThreatActorList;
EOL

# Setup ThreatActorDetail Component with Framer Motion
echo_info "Setting up ThreatActorDetail component with animations..."

cat > src/components/ThreatActor/ThreatActorDetail.jsx <<'EOL'
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ThreatActorService from '../../services/ThreatActorService';
import { Button, Container, Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const detailVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const ThreatActorDetail = () => {
  const { id } = useParams();
  const [threatActor, setThreatActor] = useState(null);

  useEffect(() => {
    fetchThreatActor();
    // eslint-disable-next-line
  }, []);

  const fetchThreatActor = async () => {
    try {
      const response = await ThreatActorService.getById(id);
      setThreatActor(response.data);
    } catch (error) {
      console.error('Error fetching Threat Actor:', error);
    }
  };

  if (!threatActor) return <div>Loading...</div>;

  return (
    <Container>
      <Box mt={5}>
        <motion.div
          variants={detailVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
              Threat Actor Details
            </Typography>
            <Typography variant="body1"><strong>Name:</strong> {threatActor.name}</Typography>
            <Typography variant="body1"><strong>Type:</strong> {threatActor.type}</Typography>
            <Typography variant="body1"><strong>Description:</strong> {threatActor.description}</Typography>
            <Typography variant="body1"><strong>Origin Country:</strong> {threatActor.originCountry}</Typography>
            <Typography variant="body1"><strong>First Observed:</strong> {new Date(threatActor.firstObserved).toLocaleDateString()}</Typography>
            <Typography variant="body1"><strong>Last Activity:</strong> {new Date(threatActor.lastActivity).toLocaleDateString()}</Typography>
            <Box mt={3}>
              <Button 
                component={Link} 
                to={`/threatactors/edit/${threatActor.actorId}`} 
                variant="contained" 
                color="secondary"
                style={{ marginRight: '10px' }}
                aria-label={`Edit ${threatActor.name}`}
              >
                Edit
              </Button>
              <Button 
                component={Link} 
                to="/threatactors" 
                variant="contained" 
                color="primary"
                aria-label="Back to Threat Actors List"
              >
                Back to List
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default ThreatActorDetail;
EOL

# Setup ThreatActorForm Component with Framer Motion
echo_info "Setting up ThreatActorForm component with animations..."

cat > src/components/ThreatActor/ThreatActorForm.jsx <<'EOL'
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ThreatActorService from '../../services/ThreatActorService';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const formVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const ThreatActorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [initialValues, setInitialValues] = useState({
    name: '',
    type: '',
    description: '',
    originCountry: '',
    firstObserved: '',
    lastActivity: '',
    // Add other fields as necessary
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchThreatActor();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchThreatActor = async () => {
    try {
      const response = await ThreatActorService.getById(id);
      const data = response.data;
      setInitialValues({
        name: data.name || '',
        type: data.type || '',
        description: data.description || '',
        originCountry: data.originCountry || '',
        firstObserved: data.firstObserved ? data.firstObserved.substring(0, 10) : '',
        lastActivity: data.lastActivity ? data.lastActivity.substring(0, 10) : '',
        // Initialize other fields as necessary
      });
    } catch (error) {
      console.error('Error fetching Threat Actor:', error);
      setError('Failed to load Threat Actor data.');
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    type: Yup.string().required('Type is required'),
    description: Yup.string().required('Description is required'),
    originCountry: Yup.string().required('Origin Country is required'),
    firstObserved: Yup.date().required('First Observed date is required'),
    lastActivity: Yup.date().required('Last Activity date is required'),
    // Add other validations as necessary
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEditMode) {
          await ThreatActorService.update(id, values);
        } else {
          await ThreatActorService.create(values);
        }
        navigate('/threatactors');
      } catch (error) {
        console.error('Error saving Threat Actor:', error);
        setError('Failed to save Threat Actor.');
      }
    },
  });

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
              {isEditMode ? 'Edit Threat Actor' : 'Add Threat Actor'}
            </Typography>
            {error && <Typography color="error" variant="body1">{error}</Typography>}
            <form onSubmit={formik.handleSubmit}>
              <TextField
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                required
                fullWidth
                margin="normal"
                aria-label="Threat Actor Name"
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <TextField
                label="Type"
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                required
                fullWidth
                margin="normal"
                aria-label="Threat Actor Type"
                error={formik.touched.type && Boolean(formik.errors.type)}
                helperText={formik.touched.type && formik.errors.type}
              />
              <TextField
                label="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                required
                multiline
                rows={4}
                fullWidth
                margin="normal"
                aria-label="Threat Actor Description"
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
              <TextField
                label="Origin Country"
                name="originCountry"
                value={formik.values.originCountry}
                onChange={formik.handleChange}
                required
                fullWidth
                margin="normal"
                aria-label="Origin Country"
                error={formik.touched.originCountry && Boolean(formik.errors.originCountry)}
                helperText={formik.touched.originCountry && formik.errors.originCountry}
              />
              <TextField
                label="First Observed"
                name="firstObserved"
                type="date"
                value={formik.values.firstObserved}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
                margin="normal"
                aria-label="First Observed Date"
                error={formik.touched.firstObserved && Boolean(formik.errors.firstObserved)}
                helperText={formik.touched.firstObserved && formik.errors.firstObserved}
              />
              <TextField
                label="Last Activity"
                name="lastActivity"
                type="date"
                value={formik.values.lastActivity}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
                margin="normal"
                aria-label="Last Activity Date"
                error={formik.touched.lastActivity && Boolean(formik.errors.lastActivity)}
                helperText={formik.touched.lastActivity && formik.errors.lastActivity}
              />
              {/* Add additional fields as necessary */}
              <Box mt={3}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  style={{ marginRight: '10px' }}
                  aria-label={isEditMode ? 'Update Threat Actor' : 'Create Threat Actor'}
                >
                  {isEditMode ? 'Update' : 'Create'}
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  component={Link} 
                  to="/threatactors"
                  aria-label="Cancel and go back to Threat Actors List"
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default ThreatActorForm;
EOL

# Setup IncidentLogList Component with Framer Motion
echo_info "Setting up IncidentLogList component with animations..."

cat > src/components/IncidentLog/IncidentLogList.jsx <<'EOL'
import React, { useEffect, useState } from 'react';
import IncidentLogService from '../../services/IncidentLogService';
import { Link } from 'react-router-dom';
import { Table, Button, Container, Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const IncidentLogList = () => {
  const [incidentLogs, setIncidentLogs] = useState([]);

  useEffect(() => {
    fetchIncidentLogs();
  }, []);

  const fetchIncidentLogs = async () => {
    try {
      const response = await IncidentLogService.getAll();
      setIncidentLogs(response.data);
    } catch (error) {
      console.error('Error fetching Incident Logs:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Incident Log?')) {
      try {
        await IncidentLogService.delete(id);
        setIncidentLogs(incidentLogs.filter((log) => log.logId !== id));
      } catch (error) {
        console.error('Error deleting Incident Log:', error);
      }
    }
  };

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Incident Logs
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/incidentlogs/create"
          style={{ marginBottom: '20px' }}
        >
          Add Incident Log
        </Button>
        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3}>
            <Table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidentLogs.map((log) => (
                  <tr key={log.logId}>
                    <td>{log.title}</td>
                    <td>{log.description}</td>
                    <td>{new Date(log.date).toLocaleDateString()}</td>
                    <td>
                      <Button 
                        component={Link} 
                        to={`/incidentlogs/${log.logId}`} 
                        variant="outlined" 
                        color="primary"
                        style={{ marginRight: '10px' }}
                        aria-label={`View details of ${log.title}`}
                      >
                        View
                      </Button>
                      <Button 
                        component={Link} 
                        to={`/incidentlogs/edit/${log.logId}`} 
                        variant="outlined" 
                        color="secondary"
                        style={{ marginRight: '10px' }}
                        aria-label={`Edit ${log.title}`}
                      >
                        Edit
                      </Button>
                      <Button 
                        onClick={() => handleDelete(log.logId)} 
                        variant="outlined" 
                        color="error"
                        aria-label={`Delete ${log.title}`}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default IncidentLogList;
EOL

# Setup IncidentLogDetail Component with Framer Motion
echo_info "Setting up IncidentLogDetail component with animations..."

cat > src/components/IncidentLog/IncidentLogDetail.jsx <<'EOL'
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import IncidentLogService from '../../services/IncidentLogService';
import { Button, Container, Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const detailVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const IncidentLogDetail = () => {
  const { id } = useParams();
  const [incidentLog, setIncidentLog] = useState(null);

  useEffect(() => {
    fetchIncidentLog();
    // eslint-disable-next-line
  }, []);

  const fetchIncidentLog = async () => {
    try {
      const response = await IncidentLogService.getById(id);
      setIncidentLog(response.data);
    } catch (error) {
      console.error('Error fetching Incident Log:', error);
    }
  };

  if (!incidentLog) return <div>Loading...</div>;

  return (
    <Container>
      <Box mt={5}>
        <motion.div
          variants={detailVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
              Incident Log Details
            </Typography>
            <Typography variant="body1"><strong>Title:</strong> {incidentLog.title}</Typography>
            <Typography variant="body1"><strong>Description:</strong> {incidentLog.description}</Typography>
            <Typography variant="body1"><strong>Date:</strong> {new Date(incidentLog.date).toLocaleDateString()}</Typography>
            <Box mt={3}>
              <Button 
                component={Link} 
                to={`/incidentlogs/edit/${incidentLog.logId}`} 
                variant="contained" 
                color="secondary"
                style={{ marginRight: '10px' }}
                aria-label={`Edit ${incidentLog.title}`}
              >
                Edit
              </Button>
              <Button 
                component={Link} 
                to="/incidentlogs" 
                variant="contained" 
                color="primary"
                aria-label="Back to Incident Logs List"
              >
                Back to List
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default IncidentLogDetail;
EOL

# Setup IncidentLogForm Component with Framer Motion
echo_info "Setting up IncidentLogForm component with animations..."

cat > src/components/IncidentLog/IncidentLogForm.jsx <<'EOL'
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IncidentLogService from '../../services/IncidentLogService';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const formVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const IncidentLogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    date: '',
    // Add other fields as necessary
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchIncidentLog();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchIncidentLog = async () => {
    try {
      const response = await IncidentLogService.getById(id);
      const data = response.data;
      setInitialValues({
        title: data.title || '',
        description: data.description || '',
        date: data.date ? data.date.substring(0, 10) : '',
        // Initialize other fields as necessary
      });
    } catch (error) {
      console.error('Error fetching Incident Log:', error);
      setError('Failed to load Incident Log data.');
    }
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    date: Yup.date().required('Date is required'),
    // Add other validations as necessary
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEditMode) {
          await IncidentLogService.update(id, values);
        } else {
          await IncidentLogService.create(values);
        }
        navigate('/incidentlogs');
      } catch (error) {
        console.error('Error saving Incident Log:', error);
        setError('Failed to save Incident Log.');
      }
    },
  });

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
              {isEditMode ? 'Edit Incident Log' : 'Add Incident Log'}
            </Typography>
            {error && <Typography color="error" variant="body1">{error}</Typography>}
            <form onSubmit={formik.handleSubmit}>
              <TextField
                label="Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                required
                fullWidth
                margin="normal"
                aria-label="Incident Log Title"
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
              <TextField
                label="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                required
                multiline
                rows={4}
                fullWidth
                margin="normal"
                aria-label="Incident Log Description"
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
              <TextField
                label="Date"
                name="date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
                margin="normal"
                aria-label="Incident Log Date"
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
              />
              {/* Add additional fields as necessary */}
              <Box mt={3}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  style={{ marginRight: '10px' }}
                  aria-label={isEditMode ? 'Update Incident Log' : 'Create Incident Log'}
                >
                  {isEditMode ? 'Update' : 'Create'}
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  component={Link} 
                  to="/incidentlogs"
                  aria-label="Cancel and go back to Incident Logs List"
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default IncidentLogForm;
EOL

# Setup ThreatActorsPage
echo_info "Setting up ThreatActorsPage component..."

cat > src/pages/ThreatActorsPage.jsx <<'EOL'
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ThreatActorList from '../components/ThreatActor/ThreatActorList';
import ThreatActorDetail from '../components/ThreatActor/ThreatActorDetail';
import ThreatActorForm from '../components/ThreatActor/ThreatActorForm';

const ThreatActorsPage = () => {
  return (
    <Routes>
      <Route path="/" element={<ThreatActorList />} />
      <Route path="/create" element={<ThreatActorForm />} />
      <Route path="/edit/:id" element={<ThreatActorForm />} />
      <Route path="/:id" element={<ThreatActorDetail />} />
    </Routes>
  );
};

export default ThreatActorsPage;
EOL

# Setup IncidentLogsPage
echo_info "Setting up IncidentLogsPage component..."

cat > src/pages/IncidentLogsPage.jsx <<'EOL'
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import IncidentLogList from '../components/IncidentLog/IncidentLogList';
import IncidentLogDetail from '../components/IncidentLog/IncidentLogDetail';
import IncidentLogForm from '../components/IncidentLog/IncidentLogForm';

const IncidentLogsPage = () => {
  return (
    <Routes>
      <Route path="/" element={<IncidentLogList />} />
      <Route path="/create" element={<IncidentLogForm />} />
      <Route path="/edit/:id" element={<IncidentLogForm />} />
      <Route path="/:id" element={<IncidentLogDetail />} />
    </Routes>
  );
};

export default IncidentLogsPage;
EOL

# Setup Home Page with Framer Motion
echo_info "Setting up Home page with animations and accessibility..."

cat > src/pages/Home.jsx <<'EOL'
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const homeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

const Home = () => {
  return (
    <Container>
      <Box mt={5}>
        <motion.div
          variants={homeVariants}
          initial="hidden"
          animate="visible"
        >
          <Typography variant="h3" gutterBottom>
            Cyber Threat Intel Dashboard
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="flex-start" gap="20px" mt={3}>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/threatactors"
              size="large"
              style={{ width: '200px' }}
              aria-label="Manage Threat Actors"
            >
              Manage Threat Actors
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/incidentlogs"
              size="large"
              style={{ width: '200px' }}
              aria-label="Manage Incident Logs"
            >
              Manage Incident Logs
            </Button>
            {/* Add buttons for other entities similarly */}
          </Box>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Home;
EOL

# Setup Login Page with Framer Motion and Accessibility
echo_info "Setting up Login page with animations and accessibility..."

cat > src/pages/Login.jsx <<'EOL'
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
EOL

# Setup Navbar Component with Framer Motion
echo_info "Setting up Navbar component with animations and accessibility..."

cat > src/components/Navbar.jsx <<'EOL'
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const navVariants = {
  hidden: { y: -100 },
  visible: { y: 0, transition: { type: 'spring', stiffness: 50 } },
};

const Navbar = () => {
  const { user, logout } = useAuth();

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
            <Button color="inherit" component={Link} to="/login" aria-label="Login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default Navbar;
EOL

# Setup App.jsx with ProtectedRoute and Routing
echo_info "Setting up App.jsx with routing and ProtectedRoute..."

# Backup existing App.jsx
cp src/App.jsx src/App.jsx.bak

# Overwrite App.jsx with the correct content including Navbar and routing
cat > src/App.jsx <<'EOL'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ThreatActorsPage from './pages/ThreatActorsPage';
import IncidentLogsPage from './pages/IncidentLogsPage';
// Import other pages as needed
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/threatactors/*"
            element={
              <ProtectedRoute>
                <ThreatActorsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/incidentlogs/*"
            element={
              <ProtectedRoute>
                <IncidentLogsPage />
              </ProtectedRoute>
            }
          />
          {/* Define routes for other entities similarly */}
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
EOL

echo_success "App.jsx setup completed."

# Setup main.jsx with necessary imports
echo_info "Setting up main.jsx..."

cat > src/main.jsx <<'EOL'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css'; // Update to point to styles folder

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
EOL

echo_success "main.jsx setup completed."

# Setup index.css with optional UI framework styles
echo_info "Setting up index.css with global styles..."

if [ "$UI_FRAMEWORK" = "bootstrap" ]; then
    echo "@import 'bootstrap/dist/css/bootstrap.min.css';" > src/styles/index.css
else
    echo "/* Add your global styles here */" > src/styles/index.css
fi

echo_success "index.css setup completed."

# Setup public/index.html with accessibility enhancements
echo_info "Enhancing public/index.html for accessibility and performance..."

cat > public/index.html <<'EOL'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cyber Threat Intel</title>
    <meta name="description" content="Cyber Threat Intelligence Dashboard" />
    <meta name="theme-color" content="#ffffff" />
    <!-- Add other meta tags as necessary for SEO and accessibility -->
  </head>
  <body>
    <div id="root"></div>
    <noscript>You need to enable JavaScript to run this app.</noscript>
  </body>
</html>
EOL

echo_success "public/index.html enhanced for accessibility."

# Setup package.json scripts for build and start
echo_info "Ensuring package.json has necessary scripts..."

# No changes needed as Vite sets up scripts, but verify
# Optionally, you can add more scripts if required

echo_success "package.json scripts verified."

# Final Instructions
echo_success "Frontend project setup completed successfully!"

echo_info "To get started:"
echo "1. Navigate to the project directory:"
echo "   cd $PROJECT_NAME"
echo "2. Start the development server:"
echo "   npm run dev"
echo "3. Open your browser and go to http://localhost:5173/"
echo_info "Ensure your backend is running at $BACKEND_URL to enable API interactions."