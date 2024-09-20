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
