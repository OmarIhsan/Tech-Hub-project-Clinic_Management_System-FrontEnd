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
import GroupIcon from '@mui/icons-material/Group';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import StatsChart from '../../components/StatsChart';
import EmployeeAddDialog from '../employees/EmployeeAddDialog';
import { patientAPI } from '../../services/patientService';
import { doctorAPI, appointmentService, treatmentPlanService } from '../../services/api';
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
                const [pRes, dRes, sRes, apptRes, tpRes] = await Promise.all([
                    patientAPI.getAll(),
                    doctorAPI.getAll(),
                    staffAPI.getAll(),
                    appointmentService.getAll(),
                    treatmentPlanService.getAll(),
                ]);

                const getCount = (res: unknown): number => {
                    if (!res) return 0;
                    if (Array.isArray(res)) return res.length;
                    const obj = res as { data?: unknown; count?: unknown };
                    if (Array.isArray(obj.data)) return obj.data.length;
                    const inner = obj.data as unknown;
                    if (inner && typeof inner === 'object') {
                        const innerObj = inner as { data?: unknown; count?: unknown };
                        if (Array.isArray(innerObj.data)) return innerObj.data.length;
                        if (typeof innerObj.count === 'number') return innerObj.count as number;
                    }
                    if (typeof obj.count === 'number') return obj.count as number;
                    return 0;
                };

                const patientsCount = getCount(pRes);
                const doctorsCount = getCount(dRes);
                const staffCount = getCount(sRes);
                let appointmentsCount = getCount(apptRes);
                if (apptRes && typeof apptRes === 'object') {
                    const apptObj = apptRes as { count?: unknown };
                    if (typeof apptObj.count === 'number') appointmentsCount = apptObj.count as number;
                }

                // treatment plans count
                let treatmentsCount = getCount(tpRes);
                if (tpRes && typeof tpRes === 'object') {
                    const tpObj = tpRes as { count?: unknown };
                    if (typeof tpObj.count === 'number') treatmentsCount = tpObj.count as number;
                }

                setStats(prev => ({
                    ...prev,
                    patients: patientsCount,
                    doctors: doctorsCount,
                    staff: staffCount,
                    appointments: appointmentsCount,
                    treatments: treatmentsCount,
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

                            {/* Row 1: Add Employee (full width) */}
                            <Box sx={{ mb: 2 }}>
                                <MButton
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    startIcon={<GroupIcon />}
                                    onClick={() => setEmployeeDialogOpen(true)}
                                >
                                    Add Employee
                                </MButton>
                            </Box>

                            {/* Row 2: Doctors | Staff | Patients */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
                                <MButton fullWidth variant="outlined" startIcon={<PersonIcon />} onClick={() => navigate('/doctors')}>
                                    View Doctors
                                </MButton>
                                <MButton fullWidth variant="outlined" startIcon={<GroupIcon />} onClick={() => navigate('/staff')}>
                                    View Staff
                                </MButton>
                                <MButton fullWidth variant="outlined" startIcon={<PersonIcon />} onClick={() => navigate('/patients')}>
                                    View Patients
                                </MButton>
                            </Box>

                            {/* Row 3: Income | Expenses */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 2 }}>
                                <MButton fullWidth variant="outlined" startIcon={<MonetizationOnIcon />} onClick={() => navigate('/finance/income')}>
                                    View Income
                                </MButton>
                                <MButton fullWidth variant="outlined" startIcon={<ReceiptLongIcon />} onClick={() => navigate('/finance/expenses')}>
                                    View Expenses
                                </MButton>
                            </Box>

                            {/* Row 4: Rest of actions */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                                <MButton fullWidth variant="contained" startIcon={<EventIcon />} onClick={() => navigate('/appointments/new')}>
                                    New Appointment
                                </MButton>
                                <MButton fullWidth variant="contained" startIcon={<AssignmentIcon />} onClick={() => navigate('/treatment-plans/new')}>
                                    New Treatment Plan
                                </MButton>
                                <MButton fullWidth variant="contained" startIcon={<NoteAddIcon />} onClick={() => navigate('/medical-records/new')}>
                                    New Medical Record
                                </MButton>
                                <MButton fullWidth variant="outlined" startIcon={<DescriptionIcon />} onClick={() => navigate('/documents')}>
                                    Documents
                                </MButton>
                                <MButton fullWidth variant="outlined" startIcon={<ImageIcon />} onClick={() => navigate('/patient-images')}>
                                    Patient Images
                                </MButton>
                                <MButton fullWidth variant="outlined" startIcon={<MedicalServicesIcon />} onClick={() => navigate('/procedures')}>
                                    Procedures
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
                                Welcome back, Dr. {user.name || user.email}
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
                                Welcome back, {user.name || user.email}
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