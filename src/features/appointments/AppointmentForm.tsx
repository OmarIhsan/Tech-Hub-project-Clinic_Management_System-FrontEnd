import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { appointmentValidationSchema } from '../../validation/schemas';
import { useNavigate, useParams } from 'react-router-dom';
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
import { Patient, Doctor } from '../../types';

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
      patient_id: 0,
      doctor_id: 0,
      appointment_time: '',
      status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled' | 'no_show',
    },
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
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
          const appointmentResponse = await appointmentService.getById(Number(id));
          const appointmentData = appointmentResponse.data;
          setValue('patient_id', appointmentData.patient_id);
          setValue('doctor_id', appointmentData.doctor_id);
          setValue('appointment_time', appointmentData.appointment_time);
          setValue('status', appointmentData.status);
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
        await appointmentService.update(Number(id), data);
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
                name="patient_id"
                value={watch('patient_id')}
                label="Patient"
                onChange={handleSelectChange}
                required
                error={!!errors.patient_id}
              >
                {patients.map((p) => (
                  <MenuItem key={p.patient_id} value={p.patient_id}>
                    {p.full_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.patient_id && <Typography color="error" variant="caption">{errors.patient_id.message}</Typography>}
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Doctor</InputLabel>
              <Select
                name="doctor_id"
                value={watch('doctor_id')}
                label="Doctor"
                onChange={handleSelectChange}
                required
                error={!!errors.doctor_id}
              >
                {Array.isArray(doctors) && doctors.length > 0 ? (
                  doctors.map((d) => (
                    <MenuItem key={d.doctor_id} value={d.doctor_id}>
                      {d.full_name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No doctors available</MenuItem>
                )}
              </Select>
              {errors.doctor_id && <Typography color="error" variant="caption">{errors.doctor_id.message}</Typography>}
            </FormControl>
            <TextField
              label="Date & Time"
              name="appointment_time"
              type="datetime-local"
              value={watch('appointment_time')}
              onChange={(e) => setValue('appointment_time', e.target.value)}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              error={!!errors.appointment_time}
              helperText={errors.appointment_time?.message}
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
                <MenuItem value="no_show">No Show</MenuItem>
              </Select>
              {errors.status && <Typography color="error" variant="caption">{errors.status.message}</Typography>}
            </FormControl>
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
