import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Appointment, Doctor } from '../../types';
import MButton from '../../components/MButton';


const AppointmentList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorFilter, setDoctorFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetch('/api/appointments')
      .then((res) => res.json())
      .then((data) => setAppointments(data));
    fetch('/api/doctors')
      .then((res) => res.json())
      .then((data) => setDoctors(data));
  }, []);

  const filteredAppointments = appointments.filter((appt) => {
    return (
      (!doctorFilter || appt.doctorId === doctorFilter) &&
      (!statusFilter || appt.status === statusFilter)
    );
  });

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Appointments
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Doctor</InputLabel>
              <Select
                value={doctorFilter}
                label="Doctor"
                onChange={(e) => setDoctorFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {doctors.map((doc) => (
                  <MenuItem key={doc.id} value={doc.id}>
                    {doc.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <MButton
              component={Link}
              variant="contained"
              color="primary"
              to="/appointments/new"
            >
              Add Appointment
            </MButton>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell>{appt.patientId}</TableCell>
                  <TableCell>
                    {doctors.find((d) => d.id === appt.doctorId)?.name || appt.doctorId}
                  </TableCell>
                  <TableCell>{new Date(appt.date).toLocaleString()}</TableCell>
                  <TableCell>{appt.status}</TableCell>
                  <TableCell>
                    <MButton
                      component={Link}
                      to={`/appointments/${appt.id}/edit`}
                      variant="outlined"
                      size="small"
                    >
                      Edit
                    </MButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Container>
  );
};

export default AppointmentList;