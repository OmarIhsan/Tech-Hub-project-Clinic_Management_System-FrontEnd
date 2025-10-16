import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { appointmentValidationSchema } from '../../validation/schemas';
import { useNavigate, useParams } from 'react-router';
=======
import { useNavigate, useParams } from 'react-router-dom';
>>>>>>> 6f497a09cd892c5d6acbb8077daca9325321de45
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { appointmentService, patientAPI, doctorAPI } from '../../services/api';
import MButton from '../../components/MButton';


const AppointmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(appointmentValidationSchema),
    defaultValues: {
      patientId: '',
      doctorId: '',
      date: '',
      status: 'scheduled',
      notes: '',
    },
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [patientsData, doctorsData] = await Promise.all([
          patientAPI.getAll(),
          doctorAPI.getAll(),
        ]);
        setPatients(patientsData);
        setDoctors(doctorsData);
        
        if (id) {
          const appointmentResponse = await appointmentService.getById(id);
          const appointmentData = appointmentResponse.data;
          // Populate form with existing appointment data
          setValue('patientId', appointmentData.patientId);
          setValue('doctorId', appointmentData.doctorId);
          setValue('date', appointmentData.date);
          setValue('status', appointmentData.status);
          setValue('notes', appointmentData.notes || '');
        }
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, setValue]);

  const handleSelectChange = (e) => {
    setValue(e.target.name, e.target.value);
  };

  const onSubmit = async (data) => {
    setError('');
    try {
      setSaving(true);
      if (id) {
        await appointmentService.update(id, data);
      } else {
        await appointmentService.create(data);
      }
      navigate('/appointments');
    } catch (err) {
      setError('Failed to save appointment');
      console.error('Failed to save appointment:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
            {id ? 'Edit Appointment' : 'New Appointment'}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Patient</InputLabel>
              <Select
                name="patientId"
                value={watch('patientId')}
                label="Patient"
                onChange={handleSelectChange}
                required
                error={!!errors.patientId}
              >
                {patients.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.patientId && <Typography color="error" variant="caption">{errors.patientId.message}</Typography>}
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Doctor</InputLabel>
              <Select
                name="doctorId"
                value={watch('doctorId')}
                label="Doctor"
                onChange={handleSelectChange}
                required
                error={!!errors.doctorId}
              >
                {doctors.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.doctorId && <Typography color="error" variant="caption">{errors.doctorId.message}</Typography>}
            </FormControl>
            <TextField
              label="Date & Time"
              name="date"
              type="datetime-local"
              value={watch('date')}
              onChange={(e) => setValue('date', e.target.value)}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              error={!!errors.date}
              helperText={errors.date?.message}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={watch('status')}
                label="Status"
                onChange={handleSelectChange}
                required
                error={!!errors.status}
              >
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
              {errors.status && <Typography color="error" variant="caption">{errors.status.message}</Typography>}
            </FormControl>
            <TextField
              label="Notes"
              name="notes"
              value={watch('notes')}
              onChange={(e) => setValue('notes', e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              error={!!errors.notes}
              helperText={errors.notes?.message}
            />
            <MButton 
              type="submit" 
              variant="contained" 
              fullWidth 
              sx={{ mt: 3 }}
              disabled={saving}
            >
              {saving ? 'Saving...' : id ? 'Update Appointment' : 'Create Appointment'}
            </MButton>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AppointmentForm;