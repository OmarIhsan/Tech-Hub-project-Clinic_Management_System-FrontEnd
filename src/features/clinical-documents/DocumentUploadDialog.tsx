import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import FormInput from '../../components/FormInput';
import SelectField from '../../components/SelectField';
import FileUpload from '../../components/FileUpload';
import { clinicalDocumentService } from '../../services/api';

const DocumentUploadDialog = ({ open, onClose, onSuccess, patientId = null }) => {
  const [formData, setFormData] = useState({
    patientId: patientId || '',
    documentType: '',
    description: '',
    files: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const documentTypes = [
    { value: 'lab-result', label: 'Lab Result' },
    { value: 'imaging', label: 'Medical Imaging' },
    { value: 'prescription', label: 'Prescription' },
    { value: 'report', label: 'Medical Report' },
    { value: 'consent', label: 'Consent Form' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field) => (event) => {
    const value = event.target ? event.target.value : event;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFilesChange = (files) => {
    setFormData(prev => ({
      ...prev,
      files
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      if (!formData.documentType) {
        setError('Please select a document type');
        return;
      }

      if (!formData.files || formData.files.length === 0) {
        setError('Please select at least one file to upload');
        return;
      }

      const uploadPromises = formData.files.map(async (file) => {
        const documentData = {
          patientId: formData.patientId ? String(formData.patientId) : '',
          documentType: formData.documentType,
          title: file.name,
          file_path: URL.createObjectURL(file),
          consent_version: undefined,
        };

        return await clinicalDocumentService.create(documentData);
      })

      await Promise.all(uploadPromises);

      setFormData({
        patientId: patientId || '',
        documentType: '',
        description: '',
        files: []
      });

      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (err) {
      setError('Failed to upload documents. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        patientId: patientId || '',
        documentType: '',
        description: '',
        files: []
      });
      setError('');
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>
        Upload Clinical Document
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <FormInput
            label="Patient ID"
            value={formData.patientId}
            onChange={handleInputChange('patientId')}
            disabled={Boolean(patientId) || loading}
            placeholder="Enter patient ID or leave empty for general document"
          />

          <SelectField
            label="Document Type"
            value={formData.documentType}
            onChange={handleInputChange('documentType')}
            options={documentTypes}
            required
            disabled={loading}
            placeholder="Select document type"
          />

          <FormInput
            label="Description"
            value={formData.description}
            onChange={handleInputChange('description')}
            multiline
            rows={3}
            disabled={loading}
            placeholder="Optional description or notes about the document"
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Files
            </Typography>
            <FileUpload
              onFilesChange={handleFilesChange}
              acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.txt']}
              maxFileSize={10 * 1024 * 1024} 
              maxFiles={5}
              multiple={true}
              disabled={loading}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleClose} 
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || !formData.documentType || !formData.files.length}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Uploading...
            </>
          ) : (
            'Upload Documents'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentUploadDialog;