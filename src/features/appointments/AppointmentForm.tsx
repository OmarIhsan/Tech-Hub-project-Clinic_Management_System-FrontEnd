import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Appointment, Patient, Doctor } from '../../types';
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
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetch('/api/patients')
      .then((res) => res.json())
      .then((data) => setPatients(data));
    fetch('/api/doctors')
      .then((res) => res.json())
      .then((data) => setDoctors(data));
    if (id) {
      fetch(`/api/appointments/${id}`)
        .then((res) => res.json())
        .then((data) => setAppointment(data));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    setAppointment({ ...appointment, [name]: e.target.value });
  };
  const handleSelectChange = (
    e: SelectChangeEvent
  ) => {
    setAppointment({ ...appointment, [e.target.name as string]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!appointment.patientId || !appointment.doctorId || !appointment.date) {
      setError('Please fill in all required fields');
      return;
    }
    try {
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/appointments/${id}` : '/api/appointments';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment),
      });
      if (!res.ok) throw new Error('Failed to save appointment');
      navigate('/appointments');
    } catch {
      setError('Failed to save appointment');
    }
  };

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
            <MButton type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
              {id ? 'Update Appointment' : 'Create Appointment'}
            </MButton>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AppointmentForm;