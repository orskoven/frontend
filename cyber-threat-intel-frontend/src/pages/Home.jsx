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
