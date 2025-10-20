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
  Chip,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Assignment as AssignmentIcon,
  CloudUpload as UploadIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';
import { treatmentPlanService, clinicalDocumentService } from '../../services/api';
import { ClinicalDocument } from '../../types';
import DocumentUploadDialog from '../clinical-documents/DocumentUploadDialog';

const TreatmentPlanList = () => {
  const navigate = useNavigate();
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
        const treatmentPlansResponse = await treatmentPlanService.getAll();
        const plansData = treatmentPlansResponse.data || [];
        setTreatmentPlans(Array.isArray(plansData) ? plansData : []);
      } catch (err) {
        setError('Failed to load treatment plans. Please try again.');
        console.error('Failed to fetch data:', err);
        setTreatmentPlans([]);
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

  const filteredTreatmentPlans = treatmentPlans.filter((plan) => {
    return !statusFilter || plan.status === statusFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const fmtDate = (d: unknown) => {
    if (!d) return '-';
    try {
      const date = new Date(String(d));
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString();
    } catch {
      return '-';
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
          Treatment Plans Management
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
            onClick={() => navigate('/treatment-plans/new')}
          >
            New Treatment Plan
          </Button>
        </Box>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Treatment Plans List" />
          </Tabs>
        </Box>

        <CardContent>
          {tabValue === 0 && (
            <>
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Filter by Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="ongoing">Ongoing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient</TableCell>
                      <TableCell>Doctor</TableCell>
                      <TableCell>Treatment Description</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTreatmentPlans.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Box sx={{ py: 4 }}>
                            <AssignmentIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 1 }} />
                            <Typography variant="body1" color="textSecondary" gutterBottom>
                              No treatment plans found
                            </Typography>
                            <Button
                              variant="contained"
                              startIcon={<AddIcon />}
                              onClick={() => navigate('/treatment-plans/new')}
                              sx={{ mt: 2 }}
                            >
                              Create First Treatment Plan
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTreatmentPlans.map((plan) => (
                        <TableRow key={plan.plan_id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              { (plan as any).patient?.full_name || `Patient #${(plan as any).patient_id ?? 'N/A'}` }
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              { (plan as any).doctor?.full_name || `Doctor #${(plan as any).doctor_id ?? 'N/A'}` }
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                              {plan.treatment_description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {fmtDate((plan as any).start_date || (plan as any).createdAt)}
                          </TableCell>
                          <TableCell>
                            {fmtDate((plan as any).end_date || (plan as any).expected_end_date)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={String((plan as any).status || '').toUpperCase()}
                              color={getStatusColor((plan as any).status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => navigate(`/treatment-plans/${plan.plan_id}`)}
                              title="View"
                            >
                              <ViewIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => navigate(`/treatment-plans/${plan.plan_id}/edit`)}
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

export default TreatmentPlanList;