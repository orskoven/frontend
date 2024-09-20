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
