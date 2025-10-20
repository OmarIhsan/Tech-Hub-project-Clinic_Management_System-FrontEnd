import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import DocumentUploadDialog from './DocumentUploadDialog';
import { useNavigate } from 'react-router-dom';

const ClinicalDocumentUploadPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Upload Clinical Document
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Use the form below to upload a clinical document and create its database record.
        </Typography>
      </Box>

      <DocumentUploadDialog
        open={true}
        onClose={() => navigate('/documents')}
        onSuccess={() => navigate('/documents')}
      />
    </Container>
  );
};

export default ClinicalDocumentUploadPage;
