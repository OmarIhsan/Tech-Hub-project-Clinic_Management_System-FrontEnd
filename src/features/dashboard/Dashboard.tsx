import React from 'react';
import { Box, Container, Typography, Card, CardContent, CircularProgress, Grid as MuiGrid } from '@mui/material';
// wrap MUI Grid in an any-cast to avoid mismatch with the project's installed MUI typings
const Grid: any = MuiGrid as any;
import { useEffect, useState } from 'react';
import { patientAPI, appointmentService, treatmentPlanService } from '../../services/api';
import PatientChart from './PatientChart';

const StatCard: React.FC<{ title: string; value: string | number | null }> = ({ title, value }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
      <Typography variant="h5">{value === null ? <CircularProgress size={20} /> : value}</Typography>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const [patientsCount, setPatientsCount] = useState<number | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<number | null>(null);
  const [activePlans, setActivePlans] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const patients = await patientAPI.getAll();
        if (mounted) setPatientsCount((patients || []).length ?? 0);

        const apptsRes = await appointmentService.getAll();
        if (mounted) {
          const now = new Date();
          const upcoming = (apptsRes?.data || []).filter((a: any) => new Date(a.date) >= now).length;
          setUpcomingAppointments(upcoming);
        }

        const plansRes = await treatmentPlanService.getAll();
        if (mounted) {
          const active = (plansRes?.data || []).filter((p: any) => p.status === 'active').length;
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

        <Grid container spacing={2}>
          <Grid xs={12} sm={4}>
            <StatCard title="Total Patients" value={patientsCount} />
          </Grid>
          <Grid xs={12} sm={4}>
            <StatCard title="Upcoming Appointments" value={upcomingAppointments} />
          </Grid>
          <Grid xs={12} sm={4}>
            <StatCard title="Active Treatment Plans" value={activePlans} />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>Appointments (next 7 days)</Typography>
        <PatientChart />
      </Box>
    </Container>
  );
};

export default Dashboard;
