import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { procedureService, patientAPI, doctorAPI } from '../../services/api';
import { Patient, Doctor } from '../../types';
import MButton from '../../components/MButton';
import MOutlineButton from '../../components/MOutlineButton';

const ProcedureForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    patient_id: 0,
    doctor_id: 0,
    procedure_name: '',
    procedure_date: new Date().toISOString().split('T')[0],
    cost: '',
    notes: '',
  });
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [patientsData, doctorsData] = await Promise.all([
          patientAPI.getAll(),
          doctorAPI.getAll(),
        ]);
        
        setPatients(Array.isArray(patientsData) ? patientsData : []);
        setDoctors(Array.isArray(doctorsData) ? doctorsData : []);

        // If editing, fetch procedure data
        if (id) {
          const procedureResponse = await procedureService.getById(id);
          const procedure = procedureResponse.data;
          
          setFormData({
            patient_id: procedure.patient?.patient_id || 0,
            doctor_id: procedure.doctor?.doctor_id || 0,
            procedure_name: procedure.procedure_name || '',
            procedure_date: procedure.procedure_date?.split('T')[0] || new Date().toISOString().split('T')[0],
            cost: procedure.cost?.toString() || '',
            notes: procedure.notes || '',
          });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load form data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess('');
  };

  const handleSelectChange = (name: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess('');
  };

  const validateForm = (): boolean => {
    if (!formData.patient_id || formData.patient_id === 0) {
      setError('Please select a patient');
      return false;
    }
    if (!formData.doctor_id || formData.doctor_id === 0) {
      setError('Please select a doctor');
      return false;
    }
    if (!formData.procedure_name.trim()) {
      setError('Procedure name is required');
      return false;
    }
    if (formData.procedure_name.trim().length < 3) {
      setError('Procedure name must be at least 3 characters');
      return false;
    }
    if (!formData.procedure_date) {
      setError('Procedure date is required');
      return false;
    }
    
    const procedureDate = new Date(formData.procedure_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (procedureDate > today) {
      setError('Procedure date cannot be in the future');
      return false;
    }
    
    if (!formData.cost || isNaN(Number(formData.cost))) {
      setError('Please enter a valid cost');
      return false;
    }
    
    const costValue = Number(formData.cost);
    if (costValue < 0) {
      setError('Cost must be a positive number');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const submitData = {
        patient_id: Number(formData.patient_id),
        doctor_id: Number(formData.doctor_id),
        procedure_name: formData.procedure_name.trim(),
        procedure_date: formData.procedure_date,
        cost: Number(formData.cost),
        notes: formData.notes.trim() || undefined,
      };

      if (isEditMode && id) {
        await procedureService.update(id, submitData);
        setSuccess('Procedure updated successfully!');
      } else {
        await procedureService.create(submitData);
        setSuccess('Procedure created successfully!');
      }

      // Navigate back to list after a short delay
      setTimeout(() => {
        navigate('/procedures');
      }, 1500);
    } catch (err: unknown) {
      console.error('Error saving procedure:', err);
      const errorMessage = (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || 
                          (err as { message?: string })?.message || 
                          'Failed to save procedure';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Edit Procedure' : 'Add New Procedure'}
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          {isEditMode 
            ? 'Update the procedure information below'
            : 'Fill in the details to record a new procedure'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Patient Selection */}
            <Autocomplete
              options={patients}
              getOptionLabel={(option) => option.full_name || ''}
              value={patients.find(p => p.patient_id === formData.patient_id) || null}
              onChange={(_, newValue) => {
                handleSelectChange('patient_id', newValue?.patient_id || 0);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Patient *"
                  placeholder="Search and select patient"
                  error={!formData.patient_id && error !== ''}
                />
              )}
              isOptionEqualToValue={(option, value) => option.patient_id === value.patient_id}
            />

            {/* Doctor Selection */}
            <Autocomplete
              options={doctors}
              getOptionLabel={(option) => option.full_name || ''}
              value={doctors.find(d => d.doctor_id === formData.doctor_id) || null}
              onChange={(_, newValue) => {
                handleSelectChange('doctor_id', newValue?.doctor_id || 0);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Doctor *"
                  placeholder="Search and select doctor"
                  error={!formData.doctor_id && error !== ''}
                />
              )}
              isOptionEqualToValue={(option, value) => option.doctor_id === value.doctor_id}
            />

            {/* Procedure Name */}
            <TextField
              fullWidth
              label="Procedure Name *"
              name="procedure_name"
              value={formData.procedure_name}
              onChange={handleChange}
              placeholder="e.g., Root Canal Treatment, Dental Cleaning"
              required
              inputProps={{ minLength: 3 }}
            />

            {/* Procedure Date */}
            <TextField
              fullWidth
              label="Procedure Date *"
              name="procedure_date"
              type="date"
              value={formData.procedure_date}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{
                max: new Date().toISOString().split('T')[0],
              }}
              helperText="Procedure date cannot be in the future"
            />

            {/* Cost */}
            <TextField
              fullWidth
              label="Cost *"
              name="cost"
              type="number"
              value={formData.cost}
              onChange={handleChange}
              placeholder="0.00"
              required
              inputProps={{
                min: 0,
                step: 0.01,
              }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>,
              }}
              helperText="Enter the cost of the procedure"
            />

            {/* Notes */}
            <TextField
              fullWidth
              label="Notes (Optional)"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={4}
              placeholder="Additional notes or observations about the procedure..."
            />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <MOutlineButton
                onClick={() => navigate('/procedures')}
                disabled={submitting}
              >
                Cancel
              </MOutlineButton>
              <MButton
                type="submit"
                variant="contained"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditMode ? 'Update Procedure' : 'Create Procedure'
                )}
              </MButton>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProcedureForm;
