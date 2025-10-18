import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AppointmentCalendar from '../../components/AppointmentCalendar';
import MButton from '../../components/MButton';

const AppointmentCalendarView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Appointments Calendar
          </Typography>
          <MButton variant="contained" onClick={() => navigate('/appointments/new')}>
            Schedule New Appointment
          </MButton>
        </Box>

        <AppointmentCalendar />

        <Box sx={{ mt: 3 }}>
          <MButton onClick={() => navigate('/appointments')}>View All Appointments</MButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default AppointmentCalendarView;
