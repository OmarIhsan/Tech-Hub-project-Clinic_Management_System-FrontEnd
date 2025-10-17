import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import MButton from '../../components/MButton';
import { patientAPI } from '../../services/api';
import validation, { ValidationError } from '../../services/validation';

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState({
    name: '',
    age: '',
    contact: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const loadPatient = async () => {
      if (!id) return;
      
      try {
        setIsFetching(true);
        const loadedPatient = await patientAPI.getById(id);
        if (loadedPatient) {
          setPatient({ name: loadedPatient.name, age: loadedPatient.age, contact: loadedPatient.contact });
        }
      } catch (err) {
        console.error('Failed to load patient:', err);
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      loadPatient();
    }
  }, [id]);

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      validation.patientValidation.validateCreate(patient);

      if (id) {
        await patientAPI.update(id, patient);
      } else {
        await patientAPI.create(patient);
      }
      navigate('/patients');
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message);
      } else if (err instanceof Error) {
        console.error('Failed to save patient:', err);
        setError('Failed to save patient');
      } else {
        console.error('Failed to save patient:', err);
        setError('Failed to save patient');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isFetching || submitting) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, mb: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            {id ? 'Edit Patient' : 'New Patient'}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              value={patient.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Age"
              name="age"
              value={patient.age}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Contact"
              name="contact"
              value={patient.contact}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <MButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              disabled={submitting}
            >
              {id ? 'Update Patient' : 'Create Patient'}
            </MButton>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default PatientForm;
