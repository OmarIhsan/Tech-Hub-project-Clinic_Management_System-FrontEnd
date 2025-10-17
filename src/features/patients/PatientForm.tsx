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
  MenuItem,
} from '@mui/material';
import MButton from '../../components/MButton';
import { patientAPI } from '../../services/api';
import { Patient } from '../../types';
import validation, { ValidationError } from '../../services/validation';

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Omit<Patient, 'patient_id'>>({
    full_name: '',
    gender: 'Male',
    phone: '',
    email: '',
    date_of_birth: '',
    blood_group: '',
    address: '',
  });
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const loadedPatient = await patientAPI.getById(Number(id));
        if (loadedPatient) {
          setPatient({ 
            full_name: loadedPatient.full_name,
            gender: loadedPatient.gender,
            phone: loadedPatient.phone,
            email: loadedPatient.email,
            date_of_birth: loadedPatient.date_of_birth,
            blood_group: loadedPatient.blood_group || '',
            address: loadedPatient.address || '',
          });
        }
      } catch (err) {
        console.error('Failed to load patient:', err);
        setError('Failed to load patient');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      validation.patientValidation.validateCreate(patient);

      if (id) {
        await patientAPI.update(Number(id), patient);
      } else {
        await patientAPI.create(patient);
      }
      navigate('/patients');
    } catch (err: unknown) {
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

  if (loading || submitting) {
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
              label="Full Name"
              name="full_name"
              value={patient.full_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Gender"
              name="gender"
              value={patient.gender}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
              required
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              label="Phone"
              name="phone"
              value={patient.phone}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={patient.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={patient.date_of_birth}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Blood Group"
              name="blood_group"
              value={patient.blood_group}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address"
              name="address"
              value={patient.address}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
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
