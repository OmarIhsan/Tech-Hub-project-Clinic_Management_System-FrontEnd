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
import { doctorAPI } from '../../services/api';
import validation, { ValidationError } from '../../services/validation';

const DoctorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState({
    full_name: '',
    gender: '',
    phone: '',
    email: '',
    hire_date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const loadedDoctor = await doctorAPI.getById(Number(id));
        if (loadedDoctor) {
          setDoctor({ 
            full_name: loadedDoctor.full_name, 
            gender: loadedDoctor.gender, 
            phone: loadedDoctor.phone,
            email: loadedDoctor.email,
            hire_date: loadedDoctor.hire_date,
          });
        }
      } catch (err) {
        console.error('Failed to load doctor:', err);
        setError('Failed to load doctor');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      validation.doctorValidation.validateCreate(doctor);
      if (id) {
        await doctorAPI.update(Number(id), doctor);
      } else {
        await doctorAPI.create(doctor);
      }
      navigate('/doctors');
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        setError(err.message);
      } else {
        console.error('Failed to save doctor:', err);
        setError('Failed to save doctor');
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
            {id ? 'Edit Doctor' : 'New Doctor'}
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
              value={doctor.full_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Gender"
              name="gender"
              value={doctor.gender}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              select
              SelectProps={{ native: true }}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </TextField>
            <TextField
              label="Phone"
              name="phone"
              value={doctor.phone}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={doctor.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Hire Date"
              name="hire_date"
              type="date"
              value={doctor.hire_date}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <MButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              disabled={submitting}
            >
              {id ? 'Update Doctor' : 'Create Doctor'}
            </MButton>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default DoctorForm;
