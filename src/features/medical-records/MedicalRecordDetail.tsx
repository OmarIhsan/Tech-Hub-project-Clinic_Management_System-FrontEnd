import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { MedicalRecord } from '../../types';
import { medicalRecordAPI } from '../../services/api';
import MButton from '../../components/MButton';

const MedicalRecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError('');
        const record = await medicalRecordAPI.getById(Number(id));
        setMedicalRecord(record);
      } catch (err) {
        setError('Failed to load medical record details.');
        console.error('Failed to fetch medical record:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, mb: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !medicalRecord) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Alert severity="error">{error || 'Medical record not found'}</Alert>
          <Box sx={{ mt: 2 }}>
            <MButton onClick={() => navigate('/medical-records')}>
              Back to Medical Records
            </MButton>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Medical Record Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Record ID: {medicalRecord.record_id}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Patient Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {medicalRecord.patient.full_name}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Doctor Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {medicalRecord.doctor.full_name}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Visit Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Visit Date
              </Typography>
              <Typography variant="body1">
                {new Date(medicalRecord.visit_date).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Diagnosis
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {typeof medicalRecord.diagnosis === 'string' ? medicalRecord.diagnosis : JSON.stringify(medicalRecord.diagnosis ?? '')}
              </Typography>
            </CardContent>
          </Card>

          {medicalRecord.prescription && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Prescription
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {medicalRecord.prescription}
                </Typography>
              </CardContent>
            </Card>
          )}

          {(medicalRecord.createdAt || medicalRecord.updatedAt) && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Record Information
                </Typography>
                {medicalRecord.createdAt && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Created At
                    </Typography>
                    <Typography variant="body1">
                      {new Date(medicalRecord.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                )}
                {medicalRecord.updatedAt && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1">
                      {new Date(medicalRecord.updatedAt).toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <MButton
              variant="outlined"
              onClick={() => navigate('/medical-records')}
              fullWidth
            >
              Back to List
            </MButton>
            <MButton
              variant="contained"
              onClick={() => navigate(`/medical-records/${id}/edit`)}
              fullWidth
            >
              Edit Record
            </MButton>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default MedicalRecordDetail;