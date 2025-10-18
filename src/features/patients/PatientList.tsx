import { useState, useEffect } from 'react';
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
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  CloudUpload as UploadIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';
import { patientAPI, clinicalDocumentService } from '../../services/api';
import { Patient, ClinicalDocument } from '../../types';
import DocumentUploadDialog from '../clinical-documents/DocumentUploadDialog';

const PatientList = () => {
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [documents, setDocuments] = useState<ClinicalDocument[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsPermissionDenied, setDocumentsPermissionDenied] = useState(false);

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

  const handleDelete = async (id: number) => {
    const ok = window.confirm('Are you sure you want to delete this patient?');
    if (!ok) return;

    try {
      setActionLoading(id);
      await patientAPI.delete(id);
      setPatients(patients.filter(p => p.patient_id !== id));
    } catch (err) {
      console.error('Failed to delete patient:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load patients. Please try again.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Patients Management
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
            onClick={() => navigate('/patients/new')}
          >
            Add Patient
          </Button>
        </Box>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Patients List" />
            <Tab label="Patient Documents" />
          </Tabs>
        </Box>

        <CardContent>
          {tabValue === 0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Date of Birth</TableCell>
                    <TableCell>Blood Group</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Box sx={{ py: 4 }}>
                          <PersonIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 1 }} />
                          <Typography variant="body1" color="textSecondary" gutterBottom>
                            No patients found
                          </Typography>
                          <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/patients/new')}
                            sx={{ mt: 2 }}
                          >
                            Add Your First Patient
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    patients.map((patient) => (
                      <TableRow key={patient.patient_id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                            <Typography variant="body2" fontWeight={500}>
                              {patient.full_name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={patient.gender} 
                            size="small" 
                            color={patient.gender === 'Male' ? 'primary' : 'secondary'}
                          />
                        </TableCell>
                        <TableCell>{patient.phone}</TableCell>
                        <TableCell>{patient.email || '-'}</TableCell>
                        <TableCell>{new Date(patient.date_of_birth).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip label={patient.blood_group || 'N/A'} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => navigate(`/patients/${patient.patient_id}`)}
                            sx={{ mr: 1 }}
                          >
                            View
                          </Button>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/patients/${patient.patient_id}/edit`)}
                            title="Edit"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(patient.patient_id)}
                            disabled={actionLoading === patient.patient_id}
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

export default PatientList;