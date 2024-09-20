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
