import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import MButton from '../../components/MButton';

interface Doctor {
  name: string;
  specialty: string;
  contact: string;
}

const DoctorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor>({ name: '', specialty: '', contact: '' });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetch(`/api/doctors/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch doctor');
          return res.json();
        })
        .then((data) => {
          setDoctor({
            name: data.name || '',
            specialty: data.specialty || '',
            contact: data.contact || '',
          });
        })
        .catch(() => {
          setError('Failed to load doctor data');
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!doctor.name || !doctor.specialty || !doctor.contact) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/doctors/${id}` : '/api/doctors';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctor),
      });

      if (!res.ok) {
        throw new Error('Failed to save doctor');
      }

      navigate('/doctors');
    } catch {
      setError('Failed to save doctor');
    }
  };

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
              label="Name"
              name="name"
              value={doctor.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Specialty"
              name="specialty"
              value={doctor.specialty}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Contact"
              name="contact"
              value={doctor.contact}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <MButton type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
              {id ? 'Update Doctor' : 'Create Doctor'}
            </MButton>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default DoctorForm;