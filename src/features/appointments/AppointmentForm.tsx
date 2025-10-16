import React, { useState, useEffect } from 'react';
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
import { Appointment } from '../../types';
import { appointmentService, patientAPI, doctorAPI } from '../../services/api';
import MButton from '../../components/MButton';


const AppointmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Partial<Appointment>>({
    patientId: '',
    doctorId: '',
    date: '',
    status: 'scheduled',
    notes: '',
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
          setAppointment(appointmentData);
        }
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const name = e.target.name;
    setAppointment({ ...appointment, [name]: e.target.value });
  };
  const handleSelectChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!appointment.patientId || !appointment.doctorId || !appointment.date) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setSaving(true);
      if (id) {
        await appointmentService.update(id, appointment);
      } else {
        await appointmentService.create({
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          date: appointment.date,
          status: appointment.status ?? 'scheduled',
          notes: appointment.notes
        });
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
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Patient</InputLabel>
              <Select
                name="patientId"
                value={appointment.patientId}
                label="Patient"
                onChange={handleSelectChange}
                required
              >
                {patients.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Doctor</InputLabel>
              <Select
                name="doctorId"
                value={appointment.doctorId}
                label="Doctor"
                onChange={handleSelectChange}
                required
              >
                {doctors.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Date & Time"
              name="date"
              type="datetime-local"
              value={appointment.date}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={appointment.status}
                label="Status"
                onChange={handleSelectChange}
                required
              >
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Notes"
              name="notes"
              value={appointment.notes}
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