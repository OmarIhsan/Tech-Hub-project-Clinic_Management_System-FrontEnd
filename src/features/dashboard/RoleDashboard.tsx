import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/useAuthContext';
import { StaffRole } from '../../types';
import { Box, Container, Typography, Paper } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MButton from '../../components/MButton';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatsChart from '../../components/StatsChart';
import EmployeeAddDialog from '../employees/EmployeeAddDialog';
import { patientAPI } from '../../services/patientService';
import { doctorAPI } from '../../services/api';
import staffAPI from '../../services/staffService';

type StatCardProps = {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
};

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    color,
    onClick,
}) => (
    <Paper
        sx={{
            cursor: onClick ? 'pointer' : 'default',
            transition: 'transform 0.2s',
            '&:hover': onClick ? { transform: 'translateY(-4px)' } : {},
        }}
        onClick={onClick}
        elevation={1}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Box
                sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: `${color}.lighter`,
                    color: `${color}.main`,
                    mr: 2,
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography variant="h4" fontWeight={600}>
                    {value}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {title}
                </Typography>
            </Box>
        </Box>
    </Paper>
);

const RoleDashboard: React.FC = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
    const [stats, setStats] = useState({
        patients: 0,
        appointments: 0,
        treatments: 0,
        expenses: 0,
        doctors: 0,
        staff: 0,
        income: 0,
    });

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [pRes, dRes, sRes] = await Promise.all([
                    patientAPI.getAll(),
                    doctorAPI.getAll(),
                    staffAPI.getAll(),
                ]);

                const getCount = (res: any): number => {
                    if (!res) return 0;
                    if (Array.isArray(res)) return res.length;
                    if (Array.isArray(res.data)) return res.data.length;
                    if (res.data && Array.isArray(res.data.data)) return res.data.data.length;
                    if (res.data && typeof res.data.count === 'number') return res.data.count;
                    if (typeof res.count === 'number') return res.count;
                    return 0;
                };

                const patientsCount = getCount(pRes);
                const doctorsCount = getCount(dRes);
                const staffCount = getCount(sRes);

                setStats(prev => ({
                    ...prev,
                    patients: patientsCount,
                    doctors: doctorsCount,
                    staff: staffCount,
                }));
            } catch {
                setStats(prev => ({ ...prev, patients: 0, doctors: 0 }));
            }
        };

        fetchCounts();
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

    const renderDashboardContent = (): React.ReactNode => {
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
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(4, 1fr)',
                                },
                                gap: 3,
                                mb: 4,
                            }}
                        >
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
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(4, 1fr)',
                                },
                                gap: 3,
                                mb: 4,
                            }}
                        >
                            <StatCard
                                title="Total Doctors"
                                value={stats.doctors}
                                icon={<PersonIcon />}
                                color="secondary"
                                onClick={() => navigate('/doctors')}
                            />
                            <StatCard
                                title="Staff Members"
                                value={stats.staff}
                                icon={<PersonIcon />}
                                color="info"
                                onClick={() => navigate('/staff')}
                            />
                            <StatCard
                                title="Income Records"
                                value={stats.income}
                                icon={<AttachMoneyIcon />}
                                color="success"
                                onClick={() => navigate('/finance/income')}
                            />
                            <StatCard
                                title="Expense Records"
                                value={stats.expenses}
                                icon={<AttachMoneyIcon />}
                                color="error"
                                onClick={() => navigate('/finance/expenses')}
                            />
                        </Box>
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Quick Actions
                            </Typography>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        sm: '1fr',
                                        md: '1fr',
                                    },
                                    gap: 2,
                                }}
                            >
                                <MButton
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setEmployeeDialogOpen(true)}
                                >
                                    Add Employee
                                </MButton>
                                <MButton
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => navigate('/finance/income')}
                                >
                                    View Income
                                </MButton>
                            </Box>
                            <EmployeeAddDialog
                                open={employeeDialogOpen}
                                onClose={() => setEmployeeDialogOpen(false)}
                            />
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
                                Welcome back, Dr. {user.full_name || user.email}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                },
                                gap: 3,
                                mb: 4,
                            }}
                        >
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
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                                gap: 3,
                                mb: 4,
                            }}
                        >
                            <StatsChart
                                title="Patients & Appointments Overview"
                                type="bar"
                                data={[
                                    { name: 'Patients', value: stats.patients },
                                    { name: 'Appointments', value: stats.appointments },
                                    { name: 'Treatments', value: stats.treatments },
                                ]}
                            />
                            <StatsChart
                                title="Work Distribution"
                                type="pie"
                                data={[
                                    { name: 'Patients', value: stats.patients },
                                    { name: 'Appointments', value: stats.appointments },
                                    { name: 'Treatments', value: stats.treatments },
                                ]}
                            />
                        </Box>
                        <Box sx={{ mt: 4 }}>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        sm: 'repeat(2, 1fr)',
                                        md: 'repeat(3, 1fr)',
                                    },
                                    gap: 2,
                                }}
                            >
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
                                <MButton
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => navigate('/procedures')}
                                >
                                    View Procedures
                                </MButton>
                                <MButton
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => navigate('/procedures/new')}
                                >
                                    Record Procedure
                                </MButton>
                                <MButton
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => navigate('/patient-images')}
                                >
                                    Patient Images
                                </MButton>
                            </Box>
                        </Box>
                        <Paper
                            elevation={1}
                            sx={{ p: 2, mt: 4, bgcolor: 'success.lighter' }}
                        >
                            <Typography variant="body2" color="textSecondary">
                                <strong>Doctor Access:</strong> You can add new patients,
                                schedule appointments, create treatment plans, manage medical
                                records, and view all patient information.
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
                                Welcome back, {Staff.full_name || user.email}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                },
                                gap: 3,
                                mb: 4,
                            }}
                        >
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
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        sm: 'repeat(2, 1fr)',
                                        md: 'repeat(3, 1fr)',
                                    },
                                    gap: 2,
                                }}
                            >
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
                                <MButton
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => navigate('/patient-images')}
                                >
                                    Patient Images
                                </MButton>
                            </Box>
                        </Box>
                        <Paper
                            elevation={1}
                            sx={{ p: 2, mt: 4, bgcolor: 'info.lighter' }}
                        >
                            <Typography variant="body2" color="textSecondary">
                                <strong>Note:</strong> As a staff member, you have limited
                                access. You can manage appointments and view patient
                                information, but cannot create or modify medical records,
                                treatment plans, or financial data.
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