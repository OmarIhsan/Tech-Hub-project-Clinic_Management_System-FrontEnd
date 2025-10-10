import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import { appointmentService, doctorAPI, patientAPI } from '../../services/api';
import MOutlineButton from '../../components/MOutlineButton';
import FloatingAddButton from '../../components/FloatingAddButton';


const AppointmentList = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctorFilter, setDoctorFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [appointmentsResponse, doctorsData, patientsData] = await Promise.all([
          appointmentService.getAll(),
          doctorAPI.getAll(),
          patientAPI.getAll(),
        ]);
        setAppointments(appointmentsResponse.data || []);
        setDoctors(doctorsData || []);
        setPatients(patientsData || []);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAppointments = appointments.filter((appt) => {
    return (
      (!doctorFilter || appt.doctorId === doctorFilter) &&
      (!statusFilter || appt.status === statusFilter)
    );
  });

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 8, mb: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

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
                  <TableCell>
                    {patients.find((p) => p.id === appt.patientId)?.name || appt.patientId}
                  </TableCell>
                  <TableCell>
                    {doctors.find((d) => d.id === appt.doctorId)?.name || appt.doctorId}
                  </TableCell>
                  <TableCell>{new Date(appt.date).toLocaleString()}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: appt.status === 'scheduled' ? 'primary.main' 
                               : appt.status === 'completed' ? 'success.main'
                               : 'error.main',
                        color: 'white',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        textTransform: 'capitalize'
                      }}
                    >
                      {appt.status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <MOutlineButton
                      component={Link}
                      to={`/appointments/${appt.id}/edit`}
                      size="small"
                    >
                      Edit
                    </MOutlineButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
      
      <FloatingAddButton
        onClick={() => navigate('/appointments/new')}
        ariaLabel="Add new appointment"
      />
    </Container>
  );
};

export default AppointmentList;