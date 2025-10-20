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
  CircularProgress,
} from '@mui/material';
import { medicalRecordAPI, patientAPI, doctorAPI } from '../../services/api';
import MButton from '../../components/MButton';
import { Patient, Doctor } from '../../types';

const MedicalRecordForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    patient_id: 0,
    doctor_id: 0,
    clinical_findings: '',
    treatment: '',
    allergies: '',
    diagnosis: '',
    medical_conditions: '',
    current_meds_json: '{"medications": []}',
  });
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
          const recordData = await medicalRecordAPI.getById(Number(id));
          const rawDiagnosis = (recordData as unknown as Record<string, unknown>)['clinical_findings'] ?? recordData.diagnosis;
          let clinicalFindings = '';
          if (typeof rawDiagnosis === 'string') clinicalFindings = rawDiagnosis;
          else if (rawDiagnosis && typeof rawDiagnosis === 'object') {
            const diagObj = rawDiagnosis as Record<string, unknown>;
            const primary = diagObj['primary'];
            if (typeof primary === 'string') clinicalFindings = primary;
          }

          const rawTreatment = (recordData as unknown as Record<string, unknown>)['treatment'] ?? recordData.prescription;
          const treatmentVal = typeof rawTreatment === 'string' ? rawTreatment : '';

          const rawAllergies = (recordData as unknown as Record<string, unknown>)['allergies'];
          const allergiesVal = typeof rawAllergies === 'string' ? rawAllergies : '';

          const rawDiagnosisField = (recordData as unknown as Record<string, unknown>)['diagnosis'];
          const diagnosisVal = typeof rawDiagnosisField === 'string' ? rawDiagnosisField : '';

          const rawMedicalConditions = (recordData as unknown as Record<string, unknown>)['medical_conditions'];
          const medicalConditionsVal = typeof rawMedicalConditions === 'string' ? rawMedicalConditions : '';

          const rawMeds = (recordData as unknown as Record<string, unknown>)['current_meds_json'];
          const medsVal = typeof rawMeds === 'string' ? rawMeds : (rawMeds && typeof rawMeds === 'object' ? JSON.stringify(rawMeds) : '{"medications": []}');

          setFormData({
            patient_id: recordData.patient?.patient_id ?? 0,
            doctor_id: recordData.doctor?.doctor_id ?? 0,
            clinical_findings: clinicalFindings,
            treatment: treatmentVal,
            allergies: allergiesVal,
            diagnosis: diagnosisVal,
            medical_conditions: medicalConditionsVal,
            current_meds_json: medsVal,
          });
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

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      setSaving(true);
      if (!formData.patient_id || formData.patient_id <= 0) {
        setError('Please select a patient');
        setSaving(false);
        return;
      }
      if (!formData.doctor_id || formData.doctor_id <= 0) {
        setError('Please select a doctor');
        setSaving(false);
        return;
      }

      const fieldsToCheck: Array<keyof typeof formData> = ['clinical_findings', 'treatment', 'allergies'];
      for (const f of fieldsToCheck) {
        const val = formData[f];
        if (typeof val !== 'string' || val.trim().length === 0) {
          setError(`${f.replace(/_/g, ' ')} is required and must be a short text`);
          setSaving(false);
          return;
        }
        if (val.length > 100) {
          setError(`${f.replace(/_/g, ' ')} must be at most 100 characters`);
          setSaving(false);
          return;
        }
      }

      if (formData.diagnosis && typeof formData.diagnosis === 'string' && formData.diagnosis.length > 255) {
        setError('Diagnosis must be at most 255 characters');
        setSaving(false);
        return;
      }
      if (formData.medical_conditions && typeof formData.medical_conditions === 'string' && formData.medical_conditions.length > 255) {
        setError('Medical conditions must be at most 255 characters');
        setSaving(false);
        return;
      }

      let parsedMeds: unknown = undefined;
      try {
        parsedMeds = JSON.parse(formData.current_meds_json);
        if (typeof parsedMeds !== 'object' || parsedMeds === null) throw new Error('current_meds_json must be an object');
      } catch {
        setError('Current meds JSON is invalid. Please provide a valid JSON object, e.g. {"medications": ["Metformin"]}');
        setSaving(false);
        return;
      }

      const payload = {
        patient_id: Number(formData.patient_id),
        doctor_id: Number(formData.doctor_id),
        diagnosis: formData.diagnosis?.trim(),
        clinical_findings: formData.clinical_findings.trim(),
        treatment: formData.treatment.trim(),
        allergies: formData.allergies.trim(),
        medical_conditions: formData.medical_conditions?.trim(),
        current_meds_json: parsedMeds,
      };

      if (id) {
        await medicalRecordAPI.update(Number(id), payload);
      } else {
        await medicalRecordAPI.create(payload);
      }
      navigate('/medical-records');
    } catch (err: unknown) {
      const axiosLike = err as unknown;
      let serverMessage: string | undefined;
      if (typeof axiosLike === 'object' && axiosLike !== null) {
        const resp = (axiosLike as { response?: unknown }).response;
        if (typeof resp === 'object' && resp !== null) {
          const data = (resp as { data?: unknown }).data;
          if (typeof data === 'string') {
            serverMessage = data;
          } else if (typeof data === 'object' && data !== null) {
            const msg = (data as { message?: unknown }).message;
            if (typeof msg === 'string') serverMessage = msg;
            else {
              try {
                serverMessage = JSON.stringify(data);
              } catch {
                serverMessage = undefined;
              }
            }
          }
        }
      }
      const errorMessage = serverMessage ?? 'Failed to save medical record';
      setError(errorMessage);
      console.error('Failed to save medical record:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 8, mb: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            {id ? 'Edit Medical Record' : 'New Medical Record'}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Patient</InputLabel>
              <Select
                value={formData.patient_id}
                label="Patient"
                onChange={(e) => handleChange('patient_id', Number((e.target as unknown as HTMLInputElement).value))}
                disabled={!!id}
              >
                {patients.map((patient) => (
                  <MenuItem key={patient.patient_id} value={patient.patient_id}>
                    {patient.full_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Doctor</InputLabel>
              <Select
                value={formData.doctor_id}
                label="Doctor"
                onChange={(e) => handleChange('doctor_id', Number((e.target as unknown as HTMLInputElement).value))}
                disabled={!!id}
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.doctor_id} value={doctor.doctor_id}>
                    {doctor.full_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Clinical Findings"
              value={formData.clinical_findings}
              onChange={(e) => handleChange('clinical_findings', e.target.value)}
              fullWidth
              margin="normal"
              required
              inputProps={{ maxLength: 100 }}
              placeholder="Short summary of clinical findings (max 100 chars)"
            />

            <TextField
              label="Treatment"
              value={formData.treatment}
              onChange={(e) => handleChange('treatment', e.target.value)}
              fullWidth
              margin="normal"
              required
              inputProps={{ maxLength: 100 }}
              placeholder="Treatment summary (max 100 chars)"
            />

            <TextField
              label="Allergies"
              value={formData.allergies}
              onChange={(e) => handleChange('allergies', e.target.value)}
              fullWidth
              margin="normal"
              required
              inputProps={{ maxLength: 100 }}
              placeholder="Known allergies (max 100 chars)"
            />

            <TextField
              label="Diagnosis"
              value={formData.diagnosis}
              onChange={(e) => handleChange('diagnosis', e.target.value)}
              fullWidth
              margin="normal"
              inputProps={{ maxLength: 255 }}
              placeholder="Diagnosis (optional, max 255 chars)"
            />

            <TextField
              label="Medical Conditions"
              value={formData.medical_conditions}
              onChange={(e) => handleChange('medical_conditions', e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Existing medical conditions (comma separated)"
            />

            <TextField
              label="Current Medications"
              value={formData.current_meds_json}
              onChange={(e) => handleChange('current_meds_json', e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={2}
              placeholder="Metformin, Lisinopril"              helperText="Enter comma-separated medications (stored as plain string)"
            />

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <MButton
                variant="outlined"
                onClick={() => navigate('/medical-records')}
                fullWidth
              >
                Cancel
              </MButton>
              <MButton
                type="submit"
                variant="contained"
                fullWidth
                disabled={saving}
              >
                {saving ? 'Saving...' : id ? 'Update Record' : 'Create Record'}
              </MButton>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default MedicalRecordForm;
