import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Chip,
  LinearProgress,
} from '@mui/material';
// Types are used for runtime operations, keeping import for reference
import { treatmentPlanService, patientAPI, doctorAPI } from '../../services/api';
import MOutlineButton from '../../components/MOutlineButton';
import FloatingAddButton from '../../components/FloatingAddButton';

const TreatmentPlanList = () => {
  const navigate = useNavigate();
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [treatmentPlansResponse, patientsData, doctorsData] = await Promise.all([
          treatmentPlanService.getAll(),
          patientAPI.getAll(),
          doctorAPI.getAll(),
        ]);
        setTreatmentPlans(treatmentPlansResponse.data);
        setPatients(patientsData);
        setDoctors(doctorsData);
      } catch (err) {
        setError('Failed to load treatment plans. Please try again.');
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTreatmentPlans = treatmentPlans.filter((plan) => {
    return (
      (!statusFilter || plan.status === statusFilter) &&
      (!priorityFilter || plan.priority === priorityFilter)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'draft': return 'default';
      case 'cancelled': return 'error';
      case 'on-hold': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const calculateProgress = (steps) => {
    if (steps.length === 0) return 0;
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    return (completedSteps / steps.length) * 100;
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, mb: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Treatment Plans
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="on-hold">On Hold</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTreatmentPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    {patients.find((p) => p.id === plan.patientId)?.name || plan.patientId}
                  </TableCell>
                  <TableCell>
                    {doctors.find((d) => d.id === plan.doctorId)?.name || plan.doctorId}
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {plan.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {plan.diagnosis}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={plan.status.replace('-', ' ').toUpperCase()}
                      color={getStatusColor(plan.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={plan.priority.toUpperCase()}
                      color={getPriorityColor(plan.priority)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: 100 }}>
                      <LinearProgress
                        variant="determinate"
                        value={calculateProgress(plan.steps)}
                        sx={{ mb: 0.5 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {Math.round(calculateProgress(plan.steps))}% ({plan.steps.filter(s => s.status === 'completed').length}/{plan.steps.length})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(plan.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <MOutlineButton
                        component={Link}
                        to={`/treatment-plans/${plan.id}`}
                        size="small"
                      >
                        View
                      </MOutlineButton>
                      <MOutlineButton
                        component={Link}
                        to={`/treatment-plans/${plan.id}/edit`}
                        size="small"
                      >
                        Edit
                      </MOutlineButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
      
      <FloatingAddButton
        onClick={() => navigate('/treatment-plans/new')}
        ariaLabel="Create new treatment plan"
      />
    </Container>
  );
};

export default TreatmentPlanList;