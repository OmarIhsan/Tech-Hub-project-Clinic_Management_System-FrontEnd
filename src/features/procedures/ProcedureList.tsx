import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalHospital as ProcedureIcon,
} from '@mui/icons-material';
import { procedureService, patientAPI, doctorAPI } from '../../services/api';
import { Procedure, Patient, Doctor } from '../../types';

const ProcedureList = () => {
  const navigate = useNavigate();
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Filters
  const [patientFilter, setPatientFilter] = useState<string>('');
  const [doctorFilter, setDoctorFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [proceduresData, patientsData, doctorsData] = await Promise.all([
        procedureService.getAll(),
        patientAPI.getAll(),
        doctorAPI.getAll(),
      ]);
      
      const proceduresList = proceduresData.data || [];
      setProcedures(Array.isArray(proceduresList) ? proceduresList : []);
      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load procedures. Please try again.');
      setProcedures([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this procedure?')) {
      return;
    }

    try {
      await procedureService.delete(id);
      setProcedures(procedures.filter(p => p.procedure_id !== id));
    } catch (err) {
      console.error('Failed to delete procedure:', err);
      alert('Failed to delete procedure. Please try again.');
    }
  };

  // Filter procedures
  const filteredProcedures = procedures.filter((procedure) => {
    const matchesPatient = !patientFilter || 
      procedure.patient?.patient_id === Number(patientFilter);
    
    const matchesDoctor = !doctorFilter || 
      procedure.doctor?.doctor_id === Number(doctorFilter);
    
    const procedureDate = new Date(procedure.procedure_date);
    const matchesStartDate = !startDate || 
      procedureDate >= new Date(startDate);
    
    const matchesEndDate = !endDate || 
      procedureDate <= new Date(endDate);

    return matchesPatient && matchesDoctor && matchesStartDate && matchesEndDate;
  });

  // Calculate total cost
  const totalCost = filteredProcedures.reduce((sum, proc) => sum + (proc.cost || 0), 0);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Procedures Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/procedures/new')}
        >
          Add New Procedure
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Summary Card */}
      <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6">Total Procedures</Typography>
              <Typography variant="h4">{filteredProcedures.length}</Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="h6">Total Cost</Typography>
              <Typography variant="h4">
                ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Filter by Patient</InputLabel>
              <Select
                value={patientFilter}
                label="Filter by Patient"
                onChange={(e) => setPatientFilter(e.target.value)}
              >
                <MenuItem value="">All Patients</MenuItem>
                {patients.map((patient) => (
                  <MenuItem key={patient.patient_id} value={patient.patient_id}>
                    {patient.full_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Filter by Doctor</InputLabel>
              <Select
                value={doctorFilter}
                label="Filter by Doctor"
                onChange={(e) => setDoctorFilter(e.target.value)}
              >
                <MenuItem value="">All Doctors</MenuItem>
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.doctor_id} value={doctor.doctor_id}>
                    {doctor.full_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
          {(patientFilter || doctorFilter || startDate || endDate) && (
            <Button
              size="small"
              onClick={() => {
                setPatientFilter('');
                setDoctorFilter('');
                setStartDate('');
                setEndDate('');
              }}
              sx={{ mt: 2 }}
            >
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Procedures Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Doctor Name</TableCell>
                  <TableCell>Procedure Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Cost</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProcedures.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box sx={{ py: 8 }}>
                        <ProcedureIcon sx={{ fontSize: 64, color: 'action.disabled', mb: 2 }} />
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                          No Procedures Found
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph>
                          {procedures.length === 0 
                            ? "Start by adding your first procedure"
                            : "Try adjusting your filters"}
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => navigate('/procedures/new')}
                          sx={{ mt: 2 }}
                        >
                          Add First Procedure
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProcedures.map((procedure) => (
                    <TableRow key={procedure.procedure_id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {procedure.patient?.full_name || `Patient #${procedure.patient?.patient_id}`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {procedure.doctor?.full_name || `Doctor #${procedure.doctor?.doctor_id}`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {procedure.procedure_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(procedure.procedure_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`$${procedure.cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {procedure.notes || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/procedures/${procedure.procedure_id}/edit`)}
                          title="Edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(procedure.procedure_id)}
                          title="Delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProcedureList;
