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
