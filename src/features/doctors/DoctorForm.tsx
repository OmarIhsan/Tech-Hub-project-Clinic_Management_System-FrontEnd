import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
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
import { Doctor } from '../../types';
import { doctorAPI } from '../../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import validation, { ValidationError } from '../../services/validation';

const DoctorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Omit<Doctor, 'id'>>({
    name: '',
    specialty: '',
    contact: '',
  });
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const { data: loadedDoctor, isLoading: isFetching } = useQuery<Doctor | null>({
    queryKey: ['doctor', id],
    queryFn: async () => {
      if (!id) return null;
      return await doctorAPI.getById(id);
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (loadedDoctor) {
      setDoctor({ name: loadedDoctor.name, specialty: loadedDoctor.specialty, contact: loadedDoctor.contact });
    }
  }, [loadedDoctor]);

  const createMutation = useMutation<Doctor, Error, Omit<Doctor, 'id'>>({
    mutationFn: (d: Omit<Doctor, 'id'>) => doctorAPI.create(d),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['doctors'] }),
  });

  const updateMutation = useMutation<Doctor, Error, { id: string; d: Partial<Doctor> }>({
    mutationFn: ({ id: pid, d }: { id: string; d: Partial<Doctor> }) => doctorAPI.update(pid, d),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['doctors'] }),
  });

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
        await updateMutation.mutateAsync({ id, d: doctor });
      } else {
        await createMutation.mutateAsync(doctor);
      }
      navigate('/doctors');
    } catch (err: any) {
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
