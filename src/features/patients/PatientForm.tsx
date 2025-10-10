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
import { Patient } from '../../types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import validation, { ValidationError } from '../../services/validation';

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Omit<Patient, 'id'>>({
    name: '',
    age: '',
    contact: '',
  });
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const { data: loadedPatient, isLoading: isFetching } = useQuery<Patient | null>({
    queryKey: ['patient', id],
    queryFn: async () => {
      if (!id) return null;
      return await patientAPI.getById(id);
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (loadedPatient) {
      setPatient({ name: loadedPatient.name, age: loadedPatient.age, contact: loadedPatient.contact });
    }
  }, [loadedPatient]);

  const createMutation = useMutation<Patient, Error, Omit<Patient, 'id'>>({
    mutationFn: (p: Omit<Patient, 'id'>) => patientAPI.create(p),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
  });

  const updateMutation = useMutation<Patient, Error, { id: string; p: Partial<Patient> }>({
    mutationFn: ({ id: pid, p }: { id: string; p: Partial<Patient> }) => patientAPI.update(pid, p),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      // validate
      validation.patientValidation.validateCreate(patient);

      if (id) {
        await updateMutation.mutateAsync({ id, p: patient });
      } else {
        await createMutation.mutateAsync(patient);
      }
      navigate('/patients');
    } catch (err: any) {
      if (err instanceof ValidationError) {
        setError(err.message);
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
