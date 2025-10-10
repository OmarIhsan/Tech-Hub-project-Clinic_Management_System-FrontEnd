import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { MedicalRecord, Patient, Doctor } from '../../types';
import { medicalRecordAPI, patientAPI, doctorAPI } from '../../services/api';
import MButton from '../../components/MButton';
import MOutlineButton from '../../components/MOutlineButton';

const MedicalRecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError('');
        const record = await medicalRecordAPI.getById(id);
        setMedicalRecord(record);
        
        const [patientData, doctorData] = await Promise.all([
          patientAPI.getById(record.patientId),
          doctorAPI.getById(record.doctorId),
        ]);
        setPatient(patientData);
        setDoctor(doctorData);
      } catch (err) {
        setError('Failed to load medical record details.');
        console.error('Failed to fetch medical record:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'warning';
      case 'finalized': return 'success';
      case 'amended': return 'info';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'success';
      case 'moderate': return 'warning';
      case 'severe': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getFindingTypeColor = (type) => {
    switch (type) {
      case 'symptom': return 'primary';
      case 'observation': return 'secondary';
      case 'test-result': return 'info';
      case 'vital-sign': return 'success';
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

  if (!medicalRecord || !patient || !doctor) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Alert severity="error">Medical record not found.</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Medical Record Details
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Record ID: {medicalRecord.id}
              </Typography>
            </Box>
            <Chip
              label={medicalRecord.status.toUpperCase()}
              color={getStatusColor(medicalRecord.status)}
              size="medium"
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Patient Information
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {patient.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Age: {patient.age} | Contact: {patient.contact}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Doctor Information
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {doctor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {doctor.specialty} | Contact: {doctor.contact}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Diagnosis
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  Primary: {medicalRecord.diagnosis.primary}
                </Typography>
                {medicalRecord.diagnosis.icd10Code && (
                  <Typography variant="body2" color="text.secondary">
                    ICD-10 Code: {medicalRecord.diagnosis.icd10Code}
                  </Typography>
                )}
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Chip
                    label={`Severity: ${medicalRecord.diagnosis.severity.toUpperCase()}`}
                    color={getSeverityColor(medicalRecord.diagnosis.severity)}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`Confidence: ${medicalRecord.diagnosis.confidence.toUpperCase()}`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
              
              {medicalRecord.diagnosis.secondary && medicalRecord.diagnosis.secondary.length > 0 && (
                <Box>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    Secondary Diagnoses:
                  </Typography>
                  {medicalRecord.diagnosis.secondary.map((diag, index) => (
                    <Chip
                      key={index}
                      label={diag}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Clinical Findings
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Finding</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medicalRecord.findings.map((finding) => (
                    <TableRow key={finding.id}>
                      <TableCell>
                        <Chip
                          label={finding.type.replace('-', ' ').toUpperCase()}
                          color={getFindingTypeColor(finding.type)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {finding.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {finding.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {finding.value && (
                          <Box>
                            <Typography variant="body2">
                              {finding.value} {finding.unit}
                            </Typography>
                            {finding.normalRange && (
                              <Typography variant="caption" color="text.secondary">
                                Normal: {finding.normalRange}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        {finding.severity && (
                          <Chip
                            label={finding.severity.toUpperCase()}
                            color={getSeverityColor(finding.severity)}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(finding.recordedDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Treatment Plan
              </Typography>
              
              {medicalRecord.treatment.medications && medicalRecord.treatment.medications.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Medications:
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Medication</TableCell>
                        <TableCell>Dosage</TableCell>
                        <TableCell>Frequency</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Instructions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {medicalRecord.treatment.medications.map((med, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontWeight: 'bold' }}>{med.name}</TableCell>
                          <TableCell>{med.dosage}</TableCell>
                          <TableCell>{med.frequency}</TableCell>
                          <TableCell>{med.duration}</TableCell>
                          <TableCell>{med.instructions}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}

              {medicalRecord.treatment.recommendations && medicalRecord.treatment.recommendations.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Recommendations:
                  </Typography>
                  <ul>
                    {medicalRecord.treatment.recommendations.map((rec, index) => (
                      <li key={index}>
                        <Typography variant="body2">{rec}</Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
            </CardContent>
          </Card>

          {medicalRecord.followUp?.required && (
            <Card variant="outlined" sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Follow-up Required
                </Typography>
                {medicalRecord.followUp.scheduledDate && (
                  <Typography variant="body2" gutterBottom>
                    Scheduled Date: {new Date(medicalRecord.followUp.scheduledDate).toLocaleDateString()}
                  </Typography>
                )}
                {medicalRecord.followUp.instructions && (
                  <Typography variant="body2">
                    Instructions: {medicalRecord.followUp.instructions}
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}

          {medicalRecord.notes && (
            <Card variant="outlined" sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Additional Notes
                </Typography>
                <Typography variant="body2">
                  {medicalRecord.notes}
                </Typography>
              </CardContent>
            </Card>
          )}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <MOutlineButton onClick={() => navigate('/medical-records')}>
              Back to List
            </MOutlineButton>
            
            <MButton onClick={() => navigate(`/medical-records/${id}/edit`)}>
              Edit Record
            </MButton>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default MedicalRecordDetail;