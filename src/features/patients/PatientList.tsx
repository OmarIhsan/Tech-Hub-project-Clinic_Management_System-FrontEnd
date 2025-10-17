import { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import { patientAPI } from '../../services/api';
import MOutlineButton from '../../components/MOutlineButton';
import FloatingAddButton from '../../components/FloatingAddButton';
import { Patient } from '../../types';

const PatientList = () => {
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const data = await patientAPI.getAll();
        setPatients(data || []);
      } catch (err) {
        console.error('Failed to load patients:', err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = window.confirm('Are you sure you want to delete this patient?');
    if (!ok) return;

    try {
      setActionLoading(id);
      await patientAPI.delete(id);
      // Remove patient from local state
      setPatients(patients.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete patient:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 8, mb: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  if (isError) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Alert severity="error">Failed to load patients. Please try again.</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Patients
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.contact}</TableCell>
                  <TableCell>
                    <MOutlineButton
                      component={Link}
                      to={`/patients/${patient.id}/edit`}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </MOutlineButton>
                    <MOutlineButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(patient.id)}
                      disabled={actionLoading === patient.id}
                    >
                      {actionLoading === patient.id ? 'Deleting...' : 'Delete'}
                    </MOutlineButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
      
      <FloatingAddButton
        onClick={() => navigate('/patients/new')}
        ariaLabel="Add new patient"
      />
    </Container>
  );
};

export default PatientList;