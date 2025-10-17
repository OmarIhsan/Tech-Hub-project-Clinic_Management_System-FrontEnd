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
    patientId: 0,
    doctorId: 0,
    diagnosis: '',
    prescription: '',
    visit_date: new Date().toISOString().split('T')[0],
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
          setFormData({
            patientId: recordData.patient.patient_id,
            doctorId: recordData.doctor.doctor_id,
            diagnosis: recordData.diagnosis,
            prescription: recordData.prescription || '',
            visit_date: recordData.visit_date,
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
      if (id) {
        await medicalRecordAPI.update(Number(id), formData);
      } else {
        await medicalRecordAPI.create(formData);
      }
      navigate('/medical-records');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err 
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to save medical record'
        : 'Failed to save medical record';
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
                value={formData.patientId}
                label="Patient"
                onChange={(e) => handleChange('patientId', e.target.value)}
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
                value={formData.doctorId}
                label="Doctor"
                onChange={(e) => handleChange('doctorId', e.target.value)}
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
              label="Visit Date"
              type="date"
              value={formData.visit_date}
              onChange={(e) => handleChange('visit_date', e.target.value)}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Diagnosis"
              value={formData.diagnosis}
              onChange={(e) => handleChange('diagnosis', e.target.value)}
              fullWidth
              margin="normal"
              required
              multiline
              rows={4}
              placeholder="Enter diagnosis details..."
            />

            <TextField
              label="Prescription"
              value={formData.prescription}
              onChange={(e) => handleChange('prescription', e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              placeholder="Enter prescription details (optional)..."
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
