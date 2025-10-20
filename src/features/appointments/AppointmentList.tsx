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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Event as EventIcon,
  CloudUpload as UploadIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';
import { appointmentService, doctorAPI, clinicalDocumentService } from '../../services/api';
import { ClinicalDocument } from '../../types';
import DocumentUploadDialog from '../clinical-documents/DocumentUploadDialog';

const AppointmentList = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorFilter, setDoctorFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);
  const [documents, setDocuments] = useState<ClinicalDocument[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsPermissionDenied, setDocumentsPermissionDenied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [appointmentsResponse, doctorsData] = await Promise.all([
          appointmentService.getAll(),
          doctorAPI.getAll(),
        ]);
        const appointmentsData = appointmentsResponse.data || [];
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
        setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Failed to fetch data:', err);
        setAppointments([]);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (tabValue === 1) {
      fetchDocuments();
    }
  }, [tabValue]);

  const fetchDocuments = async () => {
    try {
      setDocumentsLoading(true);
      setDocumentsPermissionDenied(false);
      const response = await clinicalDocumentService.getAll();
      setDocuments(response.data || []);
    } catch (err: unknown) {
      console.error('Failed to load documents:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number } };
        if (axiosError?.response?.status === 403) {
          console.warn('User does not have permission to access clinical documents');
          setDocumentsPermissionDenied(true);
          setDocuments([]);
        }
      }
    } finally {
      setDocumentsLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    return (
      (!doctorFilter || appt.doctor_id === Number(doctorFilter)) &&
      (!statusFilter || appt.status === statusFilter)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'no_show': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Appointments Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload Document
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/appointments/new')}
          >
            New Appointment
          </Button>
        </Box>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Appointments List" />
          </Tabs>
        </Box>

        <CardContent>
          {tabValue === 0 && (
            <>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Filter by Doctor</InputLabel>
                  <Select
                    value={doctorFilter}
                    label="Filter by Doctor"
                    onChange={(e) => setDoctorFilter(e.target.value)}
                  >
                    <MenuItem value="">All Doctors</MenuItem>
                    {doctors.map((doc) => (
                      <MenuItem key={doc.doctor_id} value={doc.doctor_id}>
                        {doc.full_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Filter by Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                    <MenuItem value="no_show">No Show</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient</TableCell>
                      <TableCell>Doctor</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAppointments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Box sx={{ py: 4 }}>
                            <EventIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 1 }} />
                            <Typography variant="body1" color="textSecondary" gutterBottom>
                              No appointments found
                            </Typography>
                            <Button
                              variant="contained"
                              startIcon={<AddIcon />}
                              onClick={() => navigate('/appointments/new')}
                              sx={{ mt: 2 }}
                            >
                              Schedule First Appointment
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAppointments.map((appt) => (
                        <TableRow key={appt.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {appt.patient?.full_name || `Patient #${appt.patient_id}`}
                            </Typography>
                            {appt.patient?.phone && (
                              <Typography variant="caption" color="textSecondary">
                                {appt.patient.phone}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {appt.doctor?.full_name || `Doctor #${appt.doctor_id}`}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(appt.appointment_time).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(appt.appointment_time).toLocaleTimeString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={appt.status.replace('_', ' ').toUpperCase()}
                              color={getStatusColor(appt.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => navigate(`/appointments/${appt.id}/edit`)}
                              title="Edit"
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {tabValue === 1 && (
            <>
              {documentsPermissionDenied && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Access Restricted:</strong> Your current role does not have permission to view clinical documents.
                    This feature is currently available only for Owner and Staff roles. Please contact your administrator
                    if you need access to this functionality.
                  </Typography>
                </Alert>
              )}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Document Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Patient</TableCell>
                      <TableCell>Upload Date</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {documentsLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <CircularProgress size={30} sx={{ my: 2 }} />
                      </TableCell>
                    </TableRow>
                  ) : documents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Box sx={{ py: 4 }}>
                          <DocumentIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 1 }} />
                          <Typography variant="body1" color="textSecondary" gutterBottom>
                            No documents found
                          </Typography>
                          <Button
                            variant="contained"
                            startIcon={<UploadIcon />}
                            onClick={() => setUploadDialogOpen(true)}
                            sx={{ mt: 2 }}
                          >
                            Upload First Document
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    documents.map((doc) => (
                      <TableRow key={doc.document_id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <DocumentIcon sx={{ mr: 1, color: 'action.active' }} />
                            {doc.file_path?.split('/').pop() || 'Document'}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={doc.document_type || 'N/A'} size="small" color="primary" />
                        </TableCell>
                        <TableCell>{doc.patient?.full_name || 'N/A'}</TableCell>
                        <TableCell>
                          {doc.upload_date ? new Date(doc.upload_date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" color="primary" title="View">
                            <DocumentIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            </>
          )}
        </CardContent>
      </Card>

      <DocumentUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onSuccess={fetchDocuments}
      />
    </Box>
  );
};

export default AppointmentList;