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
import { doctorAPI, appointmentService, treatmentPlanService, expenseService, otherIncomeService } from '../../services/api';
import { formatCurrency } from '../../utils/format';
import staffAPI from '../../services/staffService';

type StatCardProps = {
    title: string;
    value: React.ReactNode;
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
        sx={(theme) => ({
            cursor: onClick ? 'pointer' : 'default',
            transition: 'transform 0.2s',
            '&:hover': onClick ? { transform: 'translateY(-4px)' } : {},
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.background.default,
        })}
        onClick={onClick}
        elevation={1}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                    <Box
                        sx={(theme) => ({
                    p: 1,
                    borderRadius: 1,
                    mr: 2,
                            backgroundColor:
                                color === 'primary' ? theme.palette.primary.light :
                                color === 'secondary' ? theme.palette.secondary.light :
                                color === 'info' ? theme.palette.info.light :
                                color === 'success' ? theme.palette.success.light :
                                color === 'warning' ? theme.palette.warning.light :
                                color === 'error' ? theme.palette.error.light : theme.palette.primary.light,
                            color:
                                color === 'primary' ? theme.palette.primary.main :
                                color === 'secondary' ? theme.palette.secondary.main :
                                color === 'info' ? theme.palette.info.main :
                                color === 'success' ? theme.palette.success.main :
                                color === 'warning' ? theme.palette.warning.main :
                                color === 'error' ? theme.palette.error.main : theme.palette.primary.main,
                    border: `1px solid ${theme.palette.divider}`,
                })}
            >
                {icon}
            </Box>
            <Box>
                <Typography variant="h4" fontWeight={600} color="text.primary">
                    {value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
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
        expensesAmount: 0,
        income: 0,
        incomeAmount: 0,
        doctors: 0,
        staff: 0,
    });

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const fetchers: Promise<unknown>[] = [
                    patientAPI.getAll(),
                    doctorAPI.getAll(),
                ];
                const names: string[] = ['patients', 'doctors'];

                if (user && user.role === StaffRole.OWNER) {
                    fetchers.push(staffAPI.getAll());
                    names.push('staff');
                }

                fetchers.push(appointmentService.getAll());
                names.push('appointments');
                fetchers.push(treatmentPlanService.getAll());
                names.push('treatment-plans');

                const expenseParams = user?.role === StaffRole.STAFF && user?.staff_id ? { staff_id: user.staff_id } : undefined;
                fetchers.push(expenseService.getAll(expenseParams));
                names.push('expenses');
                if (user && user.role === StaffRole.OWNER) {
                    fetchers.push(otherIncomeService.getAll());
                    names.push('incomes');
                }

                const settled = await Promise.allSettled(fetchers);
                const extractByName = (name: string) => {
                    const idx = names.indexOf(name);
                    if (idx === -1) return undefined;
                    return settled[idx].status === 'fulfilled' ? (settled[idx] as PromiseFulfilledResult<unknown>).value : undefined;
                };

                const pRes = extractByName('patients');
                const dRes = extractByName('doctors');
                const sRes = extractByName('staff');
                const apptRes = extractByName('appointments');
                const tpRes = extractByName('treatment-plans');
                settled.forEach((r, idx) => {
                    if (r.status === 'rejected') {
                        const names = ['patients', 'doctors', 'staff', 'appointments', 'treatment-plans'];
                        console.error(`RoleDashboard: ${names[idx]} fetch failed:`, (r as PromiseRejectedResult).reason);
                    }
                });

                        const countFromResult = (res: unknown): number => {
                            if (!res) return 0;
                            if (Array.isArray(res)) return res.length;
                            if (typeof res === 'object' && res !== null) {
                                const r = res as Record<string, unknown>;
                                if (Array.isArray(r.data)) return r.data.length;
                                if (r.data && typeof r.data === 'object') {
                                    const inner = r.data as Record<string, unknown>;
                                    if (Array.isArray(inner.data)) return inner.data.length;
                                    if (typeof inner.count === 'number') return inner.count;
                                }
                                if (typeof r.count === 'number') return r.count;
                            }
                            return 0;
                        };

                        const patientsCount = countFromResult(pRes);
                        if (patientsCount === 0) console.debug('RoleDashboard: patientAPI.getAll returned', pRes);

                        const doctorsCount = Array.isArray(dRes) ? dRes.length : countFromResult(dRes);

                        let staffCount = 0;
                        if (Array.isArray(sRes)) staffCount = sRes.length;
                        else if (sRes && typeof sRes === 'object' && 'data' in sRes && Array.isArray((sRes as unknown as Record<string, unknown>).data)) {
                            staffCount = ((sRes as unknown as Record<string, unknown>).data as unknown[]).length;
                        } else {
                            staffCount = countFromResult(sRes);
                        }

                        let appointmentsCount = 0;
                        if (apptRes && typeof apptRes === 'object') {
                            const a = apptRes as Record<string, unknown>;
                            if (typeof a.count === 'number') appointmentsCount = a.count as number;
                            else if (Array.isArray(a.data)) appointmentsCount = (a.data as unknown[]).length;
                            else appointmentsCount = countFromResult(apptRes);
                        } else {
                            appointmentsCount = countFromResult(apptRes);
                        }
                        let treatmentsCount = 0;
                        if (tpRes && typeof tpRes === 'object') {
                            const t = tpRes as Record<string, unknown>;
                                if (typeof t.count === 'number') { 
                                    treatmentsCount = t.count as number; 
                                } else if (Array.isArray(t.data)) { 
                                    const arr = t.data as unknown[]; 
                                    treatmentsCount = arr.filter(item => { 
                                        if (!item || typeof item !== 'object') return false; 
                                        const it = item as Record<string, unknown>; 
                                        return it.status === 'active' || it.status === 'ongoing'; 
                                    }).length; 
                            } else {
                                treatmentsCount = countFromResult(tpRes);
                            }
                        } else {
                            treatmentsCount = countFromResult(tpRes);
                        }

                                let expensesCount = 0;
                                let expensesAmount = 0;
                                let incomesCount = 0;
                                let incomesAmount = 0;
                                // expensesRes will be either all expenses (for owner) or filtered by staff_id (for staff)
                                const expensesRes = extractByName('expenses');
                                expensesCount = countFromResult(expensesRes);
                                try {
                                    if (expensesRes) {
                                        let arr: unknown[] = [];
                                        if (Array.isArray(expensesRes)) arr = expensesRes as unknown[];
                                        else if (expensesRes && typeof expensesRes === 'object') {
                                            const er = expensesRes as Record<string, unknown>;
                                            if (Array.isArray(er.data)) arr = er.data as unknown[];
                                            else if (er.data && typeof er.data === 'object') {
                                                const inner = er.data as Record<string, unknown>;
                                                if (Array.isArray(inner.data)) arr = inner.data as unknown[];
                                            }
                                        }
                                        expensesAmount = arr.reduce((sum: number, item: unknown) => {
                                            if (!item || typeof item !== 'object') return sum;
                                            const it = item as Record<string, unknown>;
                                            const a = it.amount ?? it['amount'];
                                            if (typeof a === 'number') return sum + a;
                                            if (typeof a === 'string') {
                                                const parsed = Number(String(a).replace(/,/g, ''));
                                                return sum + (Number.isFinite(parsed) ? parsed : 0);
                                            }
                                            return sum;
                                        }, 0) as number;
                                    }
                                } catch (err) {
                                    console.error('RoleDashboard: failed to compute expenses amount', err);
                                }

                                if (user?.role === StaffRole.OWNER) {
                                    try {
                                        const incomesRes = extractByName('incomes');
                                        incomesCount = countFromResult(incomesRes);
                                        if (incomesRes) {
                                            let arr: unknown[] = [];
                                            if (Array.isArray(incomesRes)) arr = incomesRes as unknown[];
                                            else if (typeof incomesRes === 'object' && Array.isArray((incomesRes as Record<string, unknown>).data)) {
                                                arr = ((incomesRes as Record<string, unknown>).data as unknown[]);
                                            } else if (incomesRes && typeof incomesRes === 'object') {
                                                const ir = incomesRes as Record<string, unknown>;
                                                if (Array.isArray(ir.data)) arr = ir.data as unknown[];
                                                else if (ir.data && typeof ir.data === 'object') {
                                                    const inner = ir.data as Record<string, unknown>;
                                                    if (Array.isArray(inner.data)) arr = inner.data as unknown[];
                                                }
                                            }
                                            incomesAmount = arr.reduce((sum: number, item: unknown) => {
                                                if (!item || typeof item !== 'object') return sum;
                                                const it = item as Record<string, unknown>;
                                                const a = it.amount ?? it['amount'];
                                                if (typeof a === 'number') return sum + a;
                                                if (typeof a === 'string') {
                                                    const parsed = Number(String(a).replace(/,/g, ''));
                                                    return sum + (Number.isFinite(parsed) ? parsed : 0);
                                                }
                                                return sum;
                                            }, 0) as number;
                                        }
                                    } catch (err) {
                                        console.error('RoleDashboard: failed to compute incomes amount', err);
                                    }
                                }

                                setStats(prev => ({
                                    ...prev,
                                    patients: patientsCount,
                                    doctors: doctorsCount,
                                    staff: staffCount,
                                    appointments: appointmentsCount,
                                    treatments: treatmentsCount,
                                    expenses: expensesCount,
                                    expensesAmount,
                                    income: incomesCount,
                                    incomeAmount: incomesAmount,
                                }));
            } catch (err) {
                console.error('Failed to load dashboard counts', err);
                setStats({ patients: 0, appointments: 0, treatments: 0, expenses: 0, expensesAmount: 0, income: 0, incomeAmount: 0, doctors: 0, staff: 0 });
            }
        };

        fetchCounts();
    }, [user]);

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
                                title="Expense Records"
                                value={stats.expenses}
                                icon={<AttachMoneyIcon />}
                                color="error"
                                onClick={() => navigate('/finance/expenses')}
                            />
                            {/* Financial stats removed for Doctor per permissions matrix */}
                            <StatCard
                                title="Expenses (Total)"
                                value={formatCurrency(stats.expensesAmount || 0, 'USD')}
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

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 2 }}>
                                <MButton fullWidth variant="outlined" startIcon={<MonetizationOnIcon />} onClick={() => navigate('/finance/income')}>
                                    View Income
                                </MButton>
                                <MButton fullWidth variant="outlined" startIcon={<ReceiptLongIcon />} onClick={() => navigate('/finance/expenses')}>
                                    View Expenses
                                </MButton>
                            </Box>

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
                                title="Income (Total)"
                                value={formatCurrency(stats.incomeAmount || 0, 'USD')}
                                icon={<AssignmentIcon />}
                                color="success"
                                onClick={() => navigate('/finance/income')}
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
                            <Typography variant="h6" gutterBottom>
                                Quick Actions
                            </Typography>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                                    gap: 2,
                                    mb: 2,
                                }}
                            >
                                <MButton
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    startIcon={<PersonIcon />}
                                    onClick={() => navigate('/patients/new')}
                                >
                                    Add Patient
                                </MButton>

                                <MButton
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    startIcon={<EventIcon />}
                                    onClick={() => navigate('/appointments/new')}
                                >
                                    New Appointment
                                </MButton>

                                <MButton
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AssignmentIcon />}
                                    onClick={() => navigate('/treatment-plans/new')}
                                >
                                    New Treatment Plan
                                </MButton>

                                <MButton
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    startIcon={<NoteAddIcon />}
                                    onClick={() => navigate('/medical-records/new')}
                                >
                                    Add Medical Record
                                </MButton>
                                <MButton
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    startIcon={<DescriptionIcon />}
                                    onClick={() => navigate('/clinical-documents/new')}
                                >
                                    Upload Document
                                </MButton>
                                <MButton
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    startIcon={<MedicalServicesIcon />}
                                    onClick={() => navigate('/procedures/new')}
                                >
                                    Record Procedure
                                </MButton>
                            </Box>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                                    gap: 2,
                                }}
                            >
                                <MButton
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<PersonIcon />}
                                    onClick={() => navigate('/patients')}
                                >
                                    View Patients
                                </MButton>

                                <MButton
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<EventIcon />}
                                    onClick={() => navigate('/appointments')}
                                >
                                    View Appointments
                                </MButton>

                                <MButton
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<DescriptionIcon />}
                                    onClick={() => navigate('/medical-records')}
                                >
                                    Medical Records
                                </MButton>

                                <MButton
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<DescriptionIcon />}
                                    onClick={() => navigate('/documents')}
                                >
                                    Documents
                                </MButton>

                                <MButton
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<ImageIcon />}
                                    onClick={() => navigate('/patient-images')}
                                >
                                    Patient Images
                                </MButton>

                                <MButton
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<MedicalServicesIcon />}
                                    onClick={() => navigate('/procedures')}
                                >
                                    View Procedures
                                </MButton>
                            </Box>
                        </Box>
                        <Paper
                            elevation={1}
                            sx={{ p: 2, mt: 4, bgcolor: 'success.lighter' }}
                        >
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
                            {/* Staff should not view financial stats; removed expenses card */}
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
                                    onClick={() => navigate('/patients/new')}
                                >
                                    New Patients
                                </MButton>
                                <MButton
                                    fullWidth
                                    variant="contained"
                                    onClick={() => navigate('/appointments/new')}
                                >
                                    New Appointment
                                </MButton>
                            </Box>
                        </Box>
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
        <Container
            maxWidth="lg"
            sx={(theme) => ({
                mt: 4,
                mb: 4,
                color: theme.palette.text.primary,
            })}
        >
            {renderDashboardContent()}
        </Container>
    );
};

export default RoleDashboard;