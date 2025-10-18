import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Card,
  CardContent,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { patientAPI, appointmentService } from '../../services/api';
import { Patient, Appointment } from '../../types';
import MButton from '../../components/MButton';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const StaffUpdateWorkflow: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // Removed unused loading state
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [patientsData, appointmentsData] = await Promise.all([
        patientAPI.getAll(),
        appointmentService.getAll(),
      ]);
      setPatients(patientsData);
      setAppointments(appointmentsData.data || []);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredPatients = patients.filter((patient) =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdatePatient = (patientId: number) => {
    navigate(`/patients/${patientId}/edit`);
  };

  const handleUpdateAppointment = (appointmentId: number) => {
    navigate(`/appointments/${appointmentId}/edit`);
  };

  const handleAddDocument = (patientId: number) => {
    navigate(`/documents?patient_id=${patientId}`);
  };

  const handleAddMedicalRecord = (patientId: number) => {
    navigate(`/medical-records/new?patient_id=${patientId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Update Patient & Appointment Data
        </Typography>

        <TextField
          fullWidth
          placeholder="Search by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Patients" />
          <Tab label="Appointments" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {filteredPatients.length === 0 ? (
              <Alert severity="info">No patients found</Alert>
            ) : (
              filteredPatients.map((patient) => (
                <Card key={patient.patient_id} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6">{patient.full_name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Phone: {patient.phone}
                        </Typography>
                        {patient.email && (
                          <Typography variant="body2" color="textSecondary">
                            Email: {patient.email}
                          </Typography>
                        )}
                        <Typography variant="body2" color="textSecondary">
                          DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <MButton
                          size="small"
                          variant="contained"
                          onClick={() => handleUpdatePatient(patient.patient_id)}
                        >
                          Edit Patient
                        </MButton>
                        <MButton
                          size="small"
                          variant="outlined"
                          onClick={() => handleAddDocument(patient.patient_id)}
                        >
                          Add Document
                        </MButton>
                        <MButton
                          size="small"
                          variant="outlined"
                          onClick={() => handleAddMedicalRecord(patient.patient_id)}
                        >
                          Add Medical Record
                        </MButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {filteredAppointments.length === 0 ? (
              <Alert severity="info">No appointments found</Alert>
            ) : (
              filteredAppointments.map((appointment) => (
                <Card key={appointment.id} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6">
                          {appointment.patient.full_name} - Dr. {appointment.doctor.full_name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Date: {new Date(appointment.appointment_time).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Status: {appointment.status}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <MButton
                          size="small"
                          variant="contained"
                          onClick={() => handleUpdateAppointment(appointment.id)}
                        >
                          Edit Appointment
                        </MButton>
                        <MButton
                          size="small"
                          variant="outlined"
                          onClick={() => navigate(`/appointments/${appointment.id}`)}
                        >
                          View Details
                        </MButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </TabPanel>

        <Box sx={{ mt: 3 }}>
          <MButton onClick={() => navigate('/')}>Back to Dashboard</MButton>
        </Box>
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StaffUpdateWorkflow;
