import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Description as DocumentIcon
} from '@mui/icons-material';
import { clinicalDocumentService } from '../../services/api';
import DocumentUploadDialog from './DocumentUploadDialog';

const ClinicalDocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError('');
  const documentsResponse = await clinicalDocumentService.getAll();
  setDocuments(documentsResponse.data || []);
    } catch (err) {
      setError('Failed to load documents. Please try again.');
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await clinicalDocumentService.delete(id);
        await fetchDocuments();
      } catch (err) {
        setError('Failed to delete document. Please try again.');
        console.error('Failed to delete document:', err);
      }
    }
  };

  const handlePreview = (document) => {
    setSelectedDocument(document);
    setPreviewOpen(true);
  };

  const getDocumentTypeColor = (type) => {
    const colors = {
      'lab-result': 'primary',
      'imaging': 'secondary',
      'prescription': 'success',
      'report': 'info',
      'consent': 'warning',
      'other': 'default'
    };
    return colors[type] || 'default';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
          Clinical Documents
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setUploadDialogOpen(true)}
        >
          Upload Document
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Upload Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No documents found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <DocumentIcon sx={{ mr: 1, color: 'action.active' }} />
                          {doc.filename}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={doc.documentType.replace('-', ' ').toUpperCase()}
                          color={getDocumentTypeColor(doc.documentType)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{doc.patientName || 'N/A'}</TableCell>
                      <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                      <TableCell>
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handlePreview(doc)}
                          title="Preview"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => window.open(doc.fileUrl, '_blank')}
                          title="Download"
                        >
                          <DownloadIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(doc.id)}
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

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Document Preview: {selectedDocument?.filename}
        </DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <Box>
              <Typography variant="body2" color="textSecondary" mb={2}>
                Type: {selectedDocument.documentType} | 
                Size: {formatFileSize(selectedDocument.fileSize)} |
                Uploaded: {new Date(selectedDocument.uploadDate).toLocaleString()}
              </Typography>
              {selectedDocument.description && (
                <Typography variant="body1" mb={2}>
                  <strong>Description:</strong> {selectedDocument.description}
                </Typography>
              )}
              <Box 
                sx={{ 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 1, 
                  p: 2, 
                  textAlign: 'center',
                  minHeight: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  Preview functionality would be implemented here based on file type
                  <br />
                  (PDF, image, document viewer)
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => window.open(selectedDocument?.fileUrl, '_blank')}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>

      <DocumentUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onSuccess={fetchDocuments}
      />
    </Box>
  );
};

export default ClinicalDocumentList;