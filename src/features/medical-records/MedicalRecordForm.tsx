import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { MedicalRecord, Patient, Doctor } from '../../types';
import { medicalRecordAPI, patientAPI, doctorAPI } from '../../services/api';
import MButton from '../../components/MButton';
import MOutlineButton from '../../components/MOutlineButton';

const MedicalRecordForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  
  const [medicalRecord, setMedicalRecord] = useState<Partial<MedicalRecord>>({
    patientId: '',
    doctorId: '',
    recordDate: new Date().toISOString().split('T')[0],
    diagnosis: {
      primary: '',
      secondary: [],
      severity: 'mild',
      confidence: 'suspected'
    },
    findings: [],
    treatment: {
      prescribed: false,
      medications: [],
      procedures: [],
      recommendations: []
    },
    followUp: {
      required: false
    },
    status: 'draft'
  });
  
  const [patients, setPatients] = useState<Array<Patient>>([]);
  const [doctors, setDoctors] = useState<Array<Doctor>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

  const formSteps = ['Basic Information', 'Diagnosis & Findings', 'Treatment Plan', 'Review'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [patientsData, doctorsData] = await Promise.all([
          patientAPI.getAll(),
          doctorAPI.getAll(),
        ]);
        setPatients(patientsData);
        setDoctors(doctorsData);
        
        if (id) {
          const recordData = await medicalRecordAPI.getById(id);
          setMedicalRecord(recordData);
        }
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleNext = () => {
    if (activeStep < formSteps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const addFinding = () => {
    const newFinding = {
      id: Date.now().toString(),
      type: 'symptom',
      title: '',
      description: '',
      recordedDate: new Date().toISOString(),
      recordedBy: medicalRecord.doctorId || ''
    };
    setMedicalRecord(prev => ({
      ...prev,
      findings: [...(prev.findings || []), newFinding]
    }));
  };

  const removeFinding = (findingId) => {
    setMedicalRecord(prev => ({
      ...prev,
      findings: (prev.findings || []).filter(f => f.id !== findingId)
    }));
  };

  const updateFinding = (findingId, field, value) => {
    setMedicalRecord(prev => ({
      ...prev,
      findings: (prev.findings || []).map(finding =>
        finding.id === findingId ? { ...finding, [field]: value } : finding
      )
    }));
  };

  const addMedication = () => {
    const newMedication = {
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    };
    setMedicalRecord(prev => ({
      ...prev,
      treatment: {
        ...prev.treatment,
        medications: [...(prev.treatment?.medications || []), newMedication]
      }
    }));
  };

  const addRecommendation = () => {
    setMedicalRecord(prev => ({
      ...prev,
      treatment: {
        ...prev.treatment,
        recommendations: [...(prev.treatment?.recommendations || []), '']
      }
    }));
  };

  const handleSubmit = async () => {
    setError('');
    setSaving(true);
    
    try {
      const recordData = {
        ...medicalRecord,
        createdDate: medicalRecord.createdDate || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      if (id) {
        await medicalRecordAPI.update(id, recordData);
      } else {
        await medicalRecordAPI.create(recordData);
      }
      navigate('/medical-records');
    } catch (err) {
      setError('Failed to save medical record');
      console.error('Failed to save medical record:', err);
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="patient-label">Patient *</InputLabel>
            <Select
              labelId="patient-label"
              value={medicalRecord.patientId || ''}
              label="Patient *"
              onChange={(e) =>
                setMedicalRecord(prev => ({ ...prev, patientId: e.target.value }))
              }
            >
              {patients.map((p) => (
                <MenuItem key={p.id} value={p.id}>
            {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="doctor-label">Doctor *</InputLabel>
            <Select
              labelId="doctor-label"
              value={medicalRecord.doctorId || ''}
              label="Doctor *"
              onChange={(e) =>
                setMedicalRecord(prev => ({ ...prev, doctorId: e.target.value }))
              }
            >
              {doctors.map((d) => (
                <MenuItem key={d.id} value={d.id}>
            {d.name} - {d.specialty}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
              </Grid>
            </Grid>

            <TextField
              label="Record Date *"
              type="date"
              value={medicalRecord.recordDate || ''}
              onChange={(e) => setMedicalRecord(prev => ({ ...prev, recordDate: e.target.value }))}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Additional Notes"
              value={medicalRecord.notes || ''}
              onChange={(e) => setMedicalRecord(prev => ({ ...prev, notes: e.target.value }))}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        );

            case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Card variant="outlined">
              <CardContent>
          <Typography variant="h6" gutterBottom>
            Primary Diagnosis
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                label="Primary Diagnosis *"
                value={medicalRecord.diagnosis?.primary || ''}
                onChange={(e) => setMedicalRecord(prev => ({
            ...prev,
            diagnosis: { ...(prev.diagnosis || {}), primary: e.target.value }
                }))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="ICD-10 Code"
                value={medicalRecord.diagnosis?.icd10Code || ''}
                onChange={(e) => setMedicalRecord(prev => ({
            ...prev,
            diagnosis: { ...(prev.diagnosis || {}), icd10Code: e.target.value }
                }))}
                fullWidth
              />
            </Grid>
          </Grid>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
            value={medicalRecord.diagnosis?.severity || 'mild'}
            onChange={(e) => 
              setMedicalRecord(prev => ({
                ...prev,
                diagnosis: { ...(prev.diagnosis || {}), severity: e.target.value }
              }))
            }
                >
            <MenuItem value="mild">Mild</MenuItem>
            <MenuItem value="moderate">Moderate</MenuItem>
            <MenuItem value="severe">Severe</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Confidence</InputLabel>
                <Select
            value={medicalRecord.diagnosis?.confidence || 'suspected'}
            onChange={(e) => 
              setMedicalRecord(prev => ({
                ...prev,
                diagnosis: { ...(prev.diagnosis || {}), confidence: e.target.value }
              }))
            }
                >
            <MenuItem value="suspected">Suspected</MenuItem>
            <MenuItem value="probable">Probable</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Clinical Findings</Typography>
            <MButton
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addFinding}
            >
              Add Finding
            </MButton>
          </Box>

          {medicalRecord.findings?.map((finding, index) => (
            <Card key={finding.id} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2">Finding {index + 1}</Typography>
            <IconButton onClick={() => removeFinding(finding.id)} color="error">
              <DeleteIcon />
            </IconButton>
                </Box>
                
                <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={finding.type}
                  onChange={(e) => 
              updateFinding(finding.id, 'type', e.target.value)
                  }
                >
                  <MenuItem value="symptom">Symptom</MenuItem>
                  <MenuItem value="observation">Observation</MenuItem>
                  <MenuItem value="test-result">Test Result</MenuItem>
                  <MenuItem value="vital-sign">Vital Sign</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                label="Title"
                value={finding.title}
                onChange={(e) => updateFinding(finding.id, 'title', e.target.value)}
                fullWidth
              />
            </Grid>
                </Grid>
                
                <TextField
            label="Description"
            value={finding.description}
            onChange={(e) => updateFinding(finding.id, 'description', e.target.value)}
            fullWidth
            multiline
            rows={2}
            sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          ))}
              </CardContent>
            </Card>
          </Box>
        );

            case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Card variant="outlined">
              <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Medications</Typography>
            <MButton
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addMedication}
            >
              Add Medication
            </MButton>
          </Box>

          {medicalRecord.treatment?.medications?.map((med, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
            Medication {index + 1}
                </Typography>
                <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Medication Name"
                value={med.name}
                onChange={(e) => {
                              const newMeds = [...(medicalRecord.treatment?.medications || [])];
                              newMeds[index] = { ...newMeds[index], name: e.target.value };
                              setMedicalRecord(prev => ({
                                ...prev,
                                treatment: { ...prev.treatment, medications: newMeds }
                              }));
                            }}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            label="Dosage"
                            value={med.dosage}
                            onChange={(e) => {
                              const newMeds = [...(medicalRecord.treatment?.medications || [])];
                              newMeds[index] = { ...newMeds[index], dosage: e.target.value };
                              setMedicalRecord(prev => ({
                                ...prev,
                                treatment: { ...prev.treatment, medications: newMeds }
                              }));
                            }}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            label="Frequency"
                            value={med.frequency}
                            onChange={(e) => {
                              const newMeds = [...(medicalRecord.treatment?.medications || [])];
                              newMeds[index] = { ...newMeds[index], frequency: e.target.value };
                              setMedicalRecord(prev => ({
                                ...prev,
                                treatment: { ...prev.treatment, medications: newMeds }
                              }));
                            }}
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Recommendations</Typography>
                  <MButton
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addRecommendation}
                  >
                    Add Recommendation
                  </MButton>
                </Box>

                {medicalRecord.treatment?.recommendations?.map((rec, index) => (
                  <TextField
                    key={index}
                    label={`Recommendation ${index + 1}`}
                    value={rec}
                    onChange={(e) => {
                      const newRecs = [...(medicalRecord.treatment?.recommendations || [])];
                      newRecs[index] = e.target.value;
                      setMedicalRecord(prev => ({
                        ...prev,
                        treatment: { ...prev.treatment, recommendations: newRecs }
                      }));
                    }}
                    fullWidth
                    multiline
                    rows={2}
                    sx={{ mb: 2 }}
                  />
                ))}
              </CardContent>
            </Card>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Review Medical Record</Typography>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Basic Information
                </Typography>
                <Typography>Patient: {patients.find((p) => p.id === medicalRecord.patientId)?.name}</Typography>
                <Typography>Doctor: {doctors.find((d) => d.id === medicalRecord.doctorId)?.name}</Typography>
                <Typography>Date: {medicalRecord.recordDate}</Typography>
              </CardContent>
            </Card>
            
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Diagnosis
                </Typography>
                <Typography>Primary: {medicalRecord.diagnosis?.primary}</Typography>
                <Typography>Severity: {medicalRecord.diagnosis?.severity}</Typography>
                <Typography>Confidence: {medicalRecord.diagnosis?.confidence}</Typography>
              </CardContent>
            </Card>
          </Box>
        );

      default:
        return null;
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
            {id ? 'Edit Medical Record' : 'Create Medical Record'}
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {formSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {renderStepContent(activeStep)}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <MOutlineButton
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </MOutlineButton>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <MOutlineButton onClick={() => navigate('/medical-records')}>
                Cancel
              </MOutlineButton>
              
              {activeStep === formSteps.length - 1 ? (
                <MButton
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : id ? 'Update Record' : 'Create Record'}
                </MButton>
              ) : (
                <MButton onClick={handleNext}>
                  Next
                </MButton>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default MedicalRecordForm;