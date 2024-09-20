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
