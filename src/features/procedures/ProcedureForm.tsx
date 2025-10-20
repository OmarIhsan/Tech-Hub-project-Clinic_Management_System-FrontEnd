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
import { CreateProcedureData } from '../../services/procedureService';
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
    performed_at: new Date().toISOString().slice(0,16),
    cost: '',
    procedure_notes: '',
    appointment_id: 0,
    plan_id: 0,
  });
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [rawServerError, setRawServerError] = useState<string | null>(null);
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

        if (id) {
          const procedureResponse = await procedureService.getById(id);
          const procedure = procedureResponse.data;
          type ProcedureExt = {
            performed_at?: string;
            procedure_notes?: string;
            appointment_id?: number;
            plan_id?: number;
            appointment?: { id?: number };
            plan?: { id?: number };
            cost?: number;
            notes?: string;
          };
          const ext = procedure as unknown as ProcedureExt;

          const performedLocal = ext.performed_at ? (() => {
            try {
              const d = new Date(ext.performed_at as string);
              const off = d.getTimezoneOffset();
              const local = new Date(d.getTime() - off * 60000);
              return local.toISOString().slice(0,16);
            } catch {
              return new Date().toISOString().slice(0,16);
            }
          })() : new Date().toISOString().slice(0,16);

          setFormData({
            patient_id: procedure.patient?.patient_id || 0,
            doctor_id: procedure.doctor?.doctor_id || 0,
            procedure_name: procedure.procedure_name || '',
            performed_at: performedLocal,
            cost: ext.cost?.toString() || procedure.cost?.toString() || '',
            procedure_notes: ext.procedure_notes || procedure.notes || '',
            appointment_id: ext.appointment_id || ext.appointment?.id || 0,
            plan_id: ext.plan_id || ext.plan?.id || 0,
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
    if (!formData.performed_at) {
      setError('Procedure performed date & time is required');
      return false;
    }

    if (formData.cost && isNaN(Number(formData.cost))) {
      setError('Please enter a valid cost');
      return false;
    }

    const costValue = Number(formData.cost || 0);
    if (formData.cost && costValue < 0) {
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

      const parseOptionalInt = (v: string | number | undefined | null): number | undefined => {
        if (v === undefined || v === null || v === '') return undefined;
        const n = Number(v);
        if (Number.isNaN(n)) return undefined;
        return Math.trunc(n);
      };

      const fmtPerformed = formData.performed_at ? (new Date(formData.performed_at).toISOString().split('.')[0] + 'Z') : undefined;

      const parsedAppointment = parseOptionalInt(formData.appointment_id as unknown as string | number | undefined);
      const parsedPlan = parseOptionalInt(formData.plan_id as unknown as string | number | undefined);

      const submitData: CreateProcedureData = {
        patient_id: Number(formData.patient_id),
        doctor_id: Number(formData.doctor_id),
        procedure_name: formData.procedure_name.trim(),
        procedure_notes: (formData.procedure_notes ?? '').toString().trim(),
        performed_at: fmtPerformed,
      };

      if (parsedAppointment !== undefined && parsedAppointment > 0) {
        submitData.appointment_id = parsedAppointment;
      }
      if (parsedPlan !== undefined && parsedPlan > 0) {
        submitData.plan_id = parsedPlan;
      }

      console.debug('[ProcedureForm] submit payload:', submitData);

      if (isEditMode && id) {
        await procedureService.update(id, submitData as CreateProcedureData);
        setSuccess('Procedure updated successfully!');
      } else {
        await procedureService.create(submitData as CreateProcedureData);
        setSuccess('Procedure created successfully!');
      }

      setTimeout(() => {
        navigate('/procedures');
      }, 1500);
    } catch (err: unknown) {
      console.error('Error saving procedure:', err);
      const maybeErr = err as unknown as Record<string, unknown>;
      const axiosResp = maybeErr?.response as Record<string, unknown> | undefined;
      if (axiosResp) {
        console.debug('[ProcedureForm] axios response status:', axiosResp.status);
        console.debug('[ProcedureForm] axios response data:', axiosResp.data);
        if (axiosResp.status === 400) {
          try {
            const maybeData = axiosResp.data;
            const pretty = typeof maybeData === 'string' ? maybeData : JSON.stringify(maybeData, null, 2);
            setRawServerError(pretty.slice(0, 2000)); // avoid huge dumps
          } catch {
            setRawServerError(String(axiosResp.data).slice(0, 2000));
          }
        }
      }
      const axiosData = axiosResp?.data as Record<string, unknown> | undefined;
      const serverMessage = typeof axiosData?.message === 'string' ? (axiosData.message as string) : undefined;
      const errorMessage = serverMessage || (err as { message?: string })?.message || 'Failed to save procedure';
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
            <div>
              <div>{error}</div>
              {rawServerError && (
                <Box component="pre" sx={{ mt: 1, p: 1, bgcolor: 'background.paper', overflow: 'auto', maxHeight: 240, fontSize: '0.85rem' }}>
                  {rawServerError}
                </Box>
              )}
            </div>
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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

            <TextField
              fullWidth
              label="Performed At *"
              name="performed_at"
              type="datetime-local"
              value={formData.performed_at}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
              helperText="Select the date and time when the procedure was performed (future dates allowed)"
            />

            <TextField
              fullWidth
              label="Appointment ID "
              name="appointment_id"
              type="number"
              value={formData.appointment_id}
              onChange={handleChange}
              placeholder="Link to an appointment (numeric id)"
            />

            <TextField
              fullWidth
              label="Plan ID "
              name="plan_id"
              type="number"
              value={formData.plan_id}
              onChange={handleChange}
              placeholder="Link to a treatment plan (numeric id)"
            />

            <TextField
              fullWidth
              label="Procedure Notes (Optional)"
              name="procedure_notes"
              value={formData.procedure_notes}
              onChange={handleChange}
              multiline
              rows={4}
              placeholder="Procedure notes or observations..."
            />

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
