// src/components/ErrorBoundary.jsx

import React from 'react';
import { Typography, Container, Button, Box } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to display fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error details to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <Container>
          <Box mt={10} textAlign="center">
            <Typography variant="h4" gutterBottom>
              Something went wrong.
            </Typography>
            <Typography variant="body1" gutterBottom>
              We're sorry for the inconvenience. Please try refreshing the page.
            </Typography>
            <Button variant="contained" color="primary" onClick={this.handleReload}>
              Reload Page
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;