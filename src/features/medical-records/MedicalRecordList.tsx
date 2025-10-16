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
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { MedicalRecord, Patient, Doctor } from '../../types';
import { medicalRecordAPI, patientAPI, doctorAPI } from '../../services/api';
import MOutlineButton from '../../components/MOutlineButton';
import FloatingAddButton from '../../components/FloatingAddButton';

const MedicalRecordList = () => {
  const navigate = useNavigate();
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [recordsData, patientsData, doctorsData] = await Promise.all([
          medicalRecordAPI.getAll(),
          patientAPI.getAll(),
          doctorAPI.getAll(),
        ]);
        setMedicalRecords(recordsData);
        setPatients(patientsData);
        setDoctors(doctorsData);
      } catch (err) {
        setError('Failed to load medical records. Please try again.');
        console.error('Failed to fetch medical records:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.name || 'Unknown Patient';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor?.name || 'Unknown Doctor';
  };

  const getStatusColor = (status: MedicalRecord['status']) => {
    switch (status) {
      case 'draft': return 'warning';
      case 'finalized': return 'success';
      case 'amended': return 'info';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'success';
      case 'moderate': return 'warning';
      case 'severe': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Medical Records
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Primary Diagnosis</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicalRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{getPatientName(record.patientId)}</TableCell>
                  <TableCell>{getDoctorName(record.doctorId)}</TableCell>
                  <TableCell>
                    {new Date(record.recordDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {record.diagnosis.primary}
                      </Typography>
                      {record.diagnosis.icd10Code && (
                        <Typography variant="caption" color="text.secondary">
                          ICD-10: {record.diagnosis.icd10Code}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={record.diagnosis.severity.toUpperCase()}
                      color={getSeverityColor(record.diagnosis.severity)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={record.status.toUpperCase()}
                      color={getStatusColor(record.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <MOutlineButton
                        component={Link}
                        to={`/medical-records/${record.id}`}
                        size="small"
                      >
                        View
                      </MOutlineButton>
                      <MOutlineButton
                        component={Link}
                        to={`/medical-records/${record.id}/edit`}
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

          {medicalRecords.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary" variant="body1">
                No medical records found. Create your first record!
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
      
      <FloatingAddButton
        onClick={() => navigate('/medical-records/new')}
        ariaLabel="Create new medical record"
      />
    </Container>
  );
};

export default MedicalRecordList;