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

  const getPatientName = (patientId: string | number) => {
    const patient = patients.find((p) => {
      const pobj = p as unknown as Record<string, unknown>;
      const pid = pobj['patient_id'] ?? pobj['id'] ?? pobj['patientId'];
      return pid !== undefined && String(pid) === String(patientId);
    });
    if (!patient) return 'Unknown Patient';

    const maybe = patient as unknown as Record<string, unknown>;

    if (typeof maybe.name === 'string' && maybe.name.trim()) return maybe.name;
    if (typeof maybe.fullName === 'string' && maybe.fullName.trim()) return maybe.fullName;
    if (typeof maybe.patientName === 'string' && maybe.patientName.trim()) return maybe.patientName;

    const first =
      typeof maybe.firstName === 'string'
        ? maybe.firstName
        : typeof maybe.givenName === 'string'
        ? maybe.givenName
        : '';
    const last =
      typeof maybe.lastName === 'string'
        ? maybe.lastName
        : typeof maybe.familyName === 'string'
        ? maybe.familyName
        : '';

    const combined = [first, last].filter(Boolean).join(' ');
    return combined || 'Unknown Patient';
  };

  const getDoctorName = (doctorId: string | number) => {
    const doctor = doctors.find((d) => {
      const dobj = d as unknown as Record<string, unknown>;
      const did = dobj['doctor_id'] ?? dobj['id'] ?? dobj['doctorId'];
      return did !== undefined && String(did) === String(doctorId);
    });
    if (!doctor) return 'Unknown Doctor';
    const maybe = doctor as unknown as Record<string, unknown>;
    return (maybe['full_name'] as string) || (maybe['fullName'] as string) || (maybe['name'] as string) || 'Unknown Doctor';
  };

  const getStatusColor = (status?: string) => {
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
              {medicalRecords.map((record) => {
                const rObj = record as unknown as Record<string, unknown>;
                const diagRaw = rObj['diagnosis'];
                let primary = '';
                let icd10 = '';
                let severity = '';
                if (typeof diagRaw === 'string') {
                  primary = diagRaw;
                } else if (diagRaw && typeof diagRaw === 'object') {
                  const diagObj = diagRaw as Record<string, unknown>;
                  primary = typeof diagObj['primary'] === 'string' ? (diagObj['primary'] as string) : '';
                  icd10 = typeof diagObj['icd10Code'] === 'string' ? (diagObj['icd10Code'] as string) : '';
                  severity = typeof diagObj['severity'] === 'string' ? (diagObj['severity'] as string) : '';
                }

                const recordKey = (rObj['record_id'] ?? rObj['id'] ?? JSON.stringify(record)) as string;

                const patientField = rObj['patient'] as Record<string, unknown> | undefined;
                const patientId = (patientField?.['patient_id'] ?? rObj['patientId'] ?? rObj['patient_id'] ?? '') as string | number;
                const doctorField = rObj['doctor'] as Record<string, unknown> | undefined;
                const doctorId = (doctorField?.['doctor_id'] ?? rObj['doctorId'] ?? rObj['doctor_id'] ?? '') as string | number;
                const dateValue = (rObj['visit_date'] ?? rObj['createdAt'] ?? rObj['recordDate'] ?? Date.now()) as string | number | Date;
                const rawStatus = (rObj['status'] ?? rObj['record_status'] ?? '') as string;

                return (
                  <TableRow key={recordKey}>
                    <TableCell>{getPatientName(patientId)}</TableCell>
                    <TableCell>{getDoctorName(doctorId)}</TableCell>
                    <TableCell>{new Date(dateValue).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {primary || '—'}
                        </Typography>
                        {icd10 && (
                          <Typography variant="caption" color="text.secondary">
                            ICD-10: {icd10}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={severity ? severity.toUpperCase() : 'N/A'}
                        color={getSeverityColor(severity || '')}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={typeof rawStatus === 'string' && rawStatus ? rawStatus.toUpperCase() : 'N/A'}
                        color={getStatusColor(typeof rawStatus === 'string' ? rawStatus : undefined)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <MOutlineButton
                          component={Link}
                          to={`/medical-records/${recordKey}`}
                          size="small"
                        >
                          View
                        </MOutlineButton>
                        <MOutlineButton
                          component={Link}
                          to={`/medical-records/${recordKey}/edit`}
                          size="small"
                        >
                          Edit
                        </MOutlineButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
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