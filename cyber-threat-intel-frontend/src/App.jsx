// src/App.jsx

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';

// Lazy load pages for performance optimization
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));
const ThreatActorsPage = lazy(() => import('./pages/ThreatActorsPage'));
const IncidentLogsPage = lazy(() => import('./pages/IncidentLogsPage'));
// Import other pages as needed

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CssBaseline />
        <Router>
          <Navbar />
          <ErrorBoundary>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route
                  path="/threatactors/*"
                  element={
                      <ThreatActorsPage />
                  }
                />
                <Route
                  path="/incidentlogs/*"
                  element={
                      <IncidentLogsPage />
                  
                  }
                />
                {/* Define routes for other entities similarly */}
                <Route path="/" element={<Home />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;