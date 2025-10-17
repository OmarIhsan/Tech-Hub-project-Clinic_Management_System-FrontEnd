import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { patientAPI, appointmentService, treatmentPlanService } from '../../services/api';
import PatientChart from './PatientChart';

const StatCard = ({ title, value }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
      <Typography variant="h5">{value === null ? <CircularProgress size={20} /> : value}</Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [patientsCount, setPatientsCount] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState(null);
  const [activePlans, setActivePlans] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const patients = await patientAPI.getAll();
        if (mounted) setPatientsCount((patients || []).length ?? 0);

        const apptsRes = await appointmentService.getAll();
        if (mounted) {
          const now = new Date();
          const upcoming = (apptsRes?.data || []).filter((a) => new Date(a.date) >= now).length;
          setUpcomingAppointments(upcoming);
        }

        const plansRes = await treatmentPlanService.getAll();
        if (mounted) {
          const active = (plansRes?.data || []).filter((p) => p.status === 'active').length;
          setActivePlans(active);
        }
      } catch (err) {
        console.error('Dashboard load error', err);
        if (mounted) {
          setPatientsCount(0);
          setUpcomingAppointments(0);
          setActivePlans(0);
        }
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, 
          gap: 2 
        }}>
          <StatCard title="Total Patients" value={patientsCount} />
          <StatCard title="Upcoming Appointments" value={upcomingAppointments} />
          <StatCard title="Active Treatment Plans" value={activePlans} />
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>Appointments (next 7 days)</Typography>
        <PatientChart />
      </Box>
    </Container>
  );
};

export default Dashboard;