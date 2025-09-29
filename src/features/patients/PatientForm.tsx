import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';

interface Patient {
  name: string;
  age: string;
  contact: string;
}

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient>({ name: '', age: '', contact: '' });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetch(`/api/patients/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch patient');
          return res.json();
        })
        .then((data) => {
          setPatient({
            name: data.name || '',
            age: data.age?.toString() || '',
            contact: data.contact || '',
          });
        })
        .catch(() => {
          setError('Failed to load patient data');
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!patient.name || !patient.age || !patient.contact) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/patients/${id}` : '/api/patients';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
      });

      if (!res.ok) {
        throw new Error('Failed to save patient');
      }
 
      navigate('/patients');
    } catch {
      setError('Failed to save patient');
    }
  };

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
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
              {id ? 'Update Patient' : 'Create Patient'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default PatientForm;