import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/useAuthContext';
import { StaffRole } from '../../types';
import { Box, Container, Typography, Card, CardContent, CircularProgress, Paper } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { patientAPI, appointmentService, treatmentPlanService, expenseService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import MButton from '../../components/MButton';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const RoleDashboard: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    treatments: 0,
    expenses: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const [patients, appointments, treatments, expenses] = await Promise.all([
          patientAPI.getAll().catch(() => []),
          appointmentService.getAll().catch(() => ({ data: [] })),
          treatmentPlanService.getAll().catch(() => ({ data: [] })),
          expenseService.getAll().catch(() => ({ data: [] })),
        ]);

        setStats({
          patients: patients?.length || 0,
          appointments: appointments?.data?.length || 0,
          treatments: treatments?.data?.filter((t: { status: string }) => t.status === 'active').length || 0,
          expenses: expenses?.data?.length || 0,
        });
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (!user || !user.role) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <LockIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Authentication Error
          </Typography>
          <Typography color="textSecondary">
            Unable to determine user role. Please log in again.
          </Typography>
        </Paper>
      </Container>
    );
  }

  const StatCard = ({ title, value, icon, color, onClick }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
  }) => (
    <Card 
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': onClick ? { transform: 'translateY(-4px)' } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: 1, 
            bgcolor: `${color}.lighter`,
            color: `${color}.main`,
            mr: 2 
          }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={600}>
              {loading ? <CircularProgress size={24} /> : value}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderDashboardContent = () => {
    switch (user.role) {
      case StaffRole.OWNER:
        return (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight={600}>
                Owner Dashboard
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Welcome back, {user.name || user.email}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
              <StatCard
                title="Total Patients"
                value={stats.patients}
                icon={<PersonIcon />}
                color="primary"
                onClick={() => navigate('/patients')}
              />
              <StatCard
                title="Appointments"
                value={stats.appointments}
                icon={<EventIcon />}
                color="info"
                onClick={() => navigate('/appointments')}
              />
              <StatCard
                title="Active Treatments"
                value={stats.treatments}
                icon={<AssignmentIcon />}
                color="success"
                onClick={() => navigate('/treatment-plans')}
              />
              <StatCard
                title="Expenses"
                value={stats.expenses}
                icon={<AttachMoneyIcon />}
                color="warning"
              />
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                <MButton 
                  fullWidth 
                  variant="contained" 
                  onClick={() => navigate('/patients/new')}
                >
                  Add Patient
                </MButton>
                <MButton 
                  fullWidth 
                  variant="contained" 
                  onClick={() => navigate('/appointments/new')}
                >
                  New Appointment
                </MButton>
                <MButton 
                  fullWidth 
                  variant="contained" 
                  onClick={() => navigate('/treatment-plans/new')}
                >
                  Create Treatment
                </MButton>
                <MButton 
                  fullWidth 
                  variant="contained" 
                  onClick={() => navigate('/medical-records/new')}
                >
                  New Record
                </MButton>
              </Box>
            </Box>
          </>
        );

      case StaffRole.DOCTOR:
        return (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight={600}>
                Doctor Dashboard
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Welcome back, Dr. {user.name || user.email}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
              <StatCard
                title="Total Patients"
                value={stats.patients}
                icon={<PersonIcon />}
                color="primary"
                onClick={() => navigate('/patients')}
              />
              <StatCard
                title="My Appointments"
                value={stats.appointments}
                icon={<EventIcon />}
                color="info"
                onClick={() => navigate('/appointments')}
              />
              <StatCard
                title="Active Treatments"
                value={stats.treatments}
                icon={<AssignmentIcon />}
                color="success"
                onClick={() => navigate('/treatment-plans')}
              />
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                <MButton 
                  fullWidth 
                  variant="contained" 
                  startIcon={<PersonIcon />}
                  onClick={() => navigate('/patients/new')}
                >
                  Add New Patient
                </MButton>
                <MButton 
                  fullWidth 
                  variant="contained" 
                  startIcon={<EventIcon />}
                  onClick={() => navigate('/appointments/new')}
                >
                  New Appointment
                </MButton>
                <MButton 
                  fullWidth 
                  variant="contained" 
                  startIcon={<AssignmentIcon />}
                  onClick={() => navigate('/treatment-plans/new')}
                >
                  New Treatment Plan
                </MButton>
                <MButton 
                  fullWidth 
                  variant="outlined" 
                  onClick={() => navigate('/patients')}
                >
                  View All Patients
                </MButton>
                <MButton 
                  fullWidth 
                  variant="outlined" 
                  onClick={() => navigate('/appointments')}
                >
                  View Appointments
                </MButton>
                <MButton 
                  fullWidth 
                  variant="outlined" 
                  onClick={() => navigate('/medical-records/new')}
                >
                  New Medical Record
                </MButton>
              </Box>
            </Box>

            <Paper elevation={1} sx={{ p: 2, mt: 4, bgcolor: 'success.lighter' }}>
              <Typography variant="body2" color="textSecondary">
                <strong>Doctor Access:</strong> You can add new patients, schedule appointments, 
                create treatment plans, manage medical records, and view all patient information.
              </Typography>
            </Paper>
          </>
        );

      case StaffRole.STAFF:
        return (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" gutterBottom fontWeight={600}>
                Staff Dashboard
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Welcome back, {user.name || user.email}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
              <StatCard
                title="Total Patients"
                value={stats.patients}
                icon={<PersonIcon />}
                color="primary"
                onClick={() => navigate('/patients')}
              />
              <StatCard
                title="Appointments"
                value={stats.appointments}
                icon={<EventIcon />}
                color="info"
                onClick={() => navigate('/appointments')}
              />
              <StatCard
                title="Expenses (View Only)"
                value={stats.expenses}
                icon={<AttachMoneyIcon />}
                color="warning"
              />
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                <MButton 
                  fullWidth 
                  variant="contained" 
                  onClick={() => navigate('/appointments/new')}
                >
                  New Appointment
                </MButton>
                <MButton 
                  fullWidth 
                  variant="contained" 
                  onClick={() => navigate('/patients')}
                >
                  View Patients
                </MButton>
              </Box>
            </Box>

            <Paper elevation={1} sx={{ p: 2, mt: 4, bgcolor: 'info.lighter' }}>
              <Typography variant="body2" color="textSecondary">
                <strong>Note:</strong> As a staff member, you have limited access. 
                You can manage appointments and view patient information, but cannot 
                create or modify medical records, treatment plans, or financial data.
              </Typography>
            </Paper>
          </>
        );

      default:
        return (
          <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <LockIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Unknown Role
              </Typography>
              <Typography color="textSecondary">
                Your account role is not recognized. Please contact support.
              </Typography>
            </Paper>
          </Container>
        );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {renderDashboardContent()}
    </Container>
  );
};

export default RoleDashboard;
