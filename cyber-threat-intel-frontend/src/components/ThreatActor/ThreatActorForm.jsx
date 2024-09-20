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
