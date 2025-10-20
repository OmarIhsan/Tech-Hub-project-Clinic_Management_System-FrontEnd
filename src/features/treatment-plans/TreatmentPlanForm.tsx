import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
import { treatmentPlanService, patientAPI, doctorAPI, appointmentService } from '../../services/api';
import { TreatmentPlan, Appointment } from '../../types';
import MButton from '../../components/MButton';
import MOutlineButton from '../../components/MOutlineButton';

const TreatmentPlanForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  type FormState = Partial<TreatmentPlan> & { appointment_id?: number };

  const [treatmentPlan, setTreatmentPlan] = useState<FormState>({
    patient_id: undefined,
    doctor_id: undefined,
    appointment_id: undefined,
    treatment_description: '',
    diagnosis: '',
    start_date: '',
    expected_end_date: '',
    status: 'active', // allowed: draft | active | ongoing | completed | cancelled
    priority: 'medium',
    notes: '',
  });
  
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [apptLoading, setApptLoading] = useState(false);
  const [apptError, setApptError] = useState<string | null>(null);
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
        // Prefill from query params if creating a new plan
        if (!id) {
          const params = new URLSearchParams(location.search);
          const qPatient = params.get('patient_id');
          const qDoctor = params.get('doctor_id');
          const qAppointment = params.get('appointment_id');
          setTreatmentPlan(prev => ({
            ...prev,
            patient_id: qPatient ? Number(qPatient) : prev.patient_id,
            doctor_id: qDoctor ? Number(qDoctor) : prev.doctor_id,
            // store appointment_id in a temp field on state for inclusion in payload
            ...(qAppointment ? { appointment_id: Number(qAppointment) } : {}),
          }));
        }
        if (id) {
          const numericId = Number(id);
          const treatmentPlanResponse = await treatmentPlanService.getById(numericId);
          const treatmentPlanData = treatmentPlanResponse.data;
          setTreatmentPlan(treatmentPlanData as Partial<TreatmentPlan>);
        }
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, location.search]);

  // When both patient and doctor are selected, fetch appointments for them
  useEffect(() => {
    const fetchAppointments = async () => {
      setAppointments([]);
      setApptError(null);
      // clear any previously selected appointment when patient/doctor changes
      setTreatmentPlan(prev => ({ ...prev, appointment_id: undefined }));

      const pid = treatmentPlan.patient_id;
      const did = treatmentPlan.doctor_id;
      if (!pid || !did) return;

      try {
        setApptLoading(true);
        // request appointments filtered by patient and doctor
  const params = { patient_id: Number(pid), doctor_id: Number(did), limit: 50 } as unknown as Record<string, unknown>;
  const resp = await appointmentService.getAll(params as unknown as { offset?: number; limit?: number });
        const list = resp.data || [];
        setAppointments(list as Appointment[]);
        if (!list || (Array.isArray(list) && list.length === 0)) {
          setApptError('No appointments found for selected patient & doctor');
        }
      } catch (err: unknown) {
        console.error('Failed to fetch appointments:', err);
        const axiosErr = err as { response?: { data?: { message?: unknown } }; message?: unknown };
        const msg = (axiosErr.response?.data && typeof axiosErr.response.data === 'object' && 'message' in axiosErr.response.data)
          ? String((axiosErr.response.data as { message?: unknown }).message)
          : (axiosErr.message ? String(axiosErr.message) : 'Failed to fetch appointments');
        setApptError(msg);
      } finally {
        setApptLoading(false);
      }
    };

    fetchAppointments();
  }, [treatmentPlan.patient_id, treatmentPlan.doctor_id]);

  const handleSubmit = async () => {
    setError('');
    setSaving(true);
    
    try {
      // Build backend expected payload
    type ApiPayload = {
      patient_id: number;
      doctor_id: number;
      appointment_id?: number;
      diagnosis_summary: string;
      prescription?: string;
      plan_details?: string;
      status?: 'draft' | 'active' | 'ongoing' | 'completed' | 'cancelled';
    };

    const payload: ApiPayload = {
      patient_id: Number(treatmentPlan.patient_id),
      doctor_id: Number(treatmentPlan.doctor_id),
      diagnosis_summary: treatmentPlan.diagnosis || '',
      prescription: (treatmentPlan && typeof (treatmentPlan as Record<string, unknown>).prescription === 'string') ? (treatmentPlan as Record<string, string>).prescription : undefined,
      plan_details: treatmentPlan.treatment_description || '',
      status: (treatmentPlan.status as ApiPayload['status']) || 'active',
    };

      if (id) {
        console.log('Updating treatment plan payload:', payload);
        await treatmentPlanService.update(Number(id), payload);
      } else {
        // include appointment_id if present in state
        const apptId = (treatmentPlan as { [k: string]: unknown })['appointment_id'] as number | undefined;
        if (apptId) payload.appointment_id = apptId;
        console.log('Creating treatment plan payload:', payload);
        await treatmentPlanService.create(payload);
      }
      navigate('/treatment-plans');
    } catch (err) {
      // Try to read a detailed message from axios response
      console.error('Failed to save treatment plan:', err);
      const e = err as unknown;
      const resp = (e as { response?: { data?: unknown } })?.response?.data as unknown;
      const serverMessage =
        (resp && typeof resp === 'object' && (resp as { message?: unknown })['message'] ? String((resp as { message?: unknown })['message']) : undefined) ||
        (typeof resp === 'string' ? resp : undefined) ||
        ((e as { message?: unknown })?.message as string | undefined);
      setError(serverMessage || 'Failed to save treatment plan');
    } finally {
      setSaving(false);
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
            {id ? 'Edit Treatment Plan' : 'Create Treatment Plan'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth>
                  <InputLabel>Patient *</InputLabel>
                  <Select 
                    name="patient_id" 
                    value={treatmentPlan.patient_id || ''} 
                    label="Patient *" 
                    onChange={(e) => setTreatmentPlan(prev => ({ ...prev, patient_id: Number(e.target.value) }))} 
                    required
                  >
                    {patients.map((p) => (<MenuItem key={p.patient_id} value={p.patient_id}>{p.full_name}</MenuItem>))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth>
                  <InputLabel>Doctor *</InputLabel>
                  <Select 
                    name="doctor_id" 
                    value={treatmentPlan.doctor_id || ''} 
                    label="Doctor *" 
                    onChange={(e) => setTreatmentPlan(prev => ({ ...prev, doctor_id: Number(e.target.value) }))} 
                    required
                  >
                    {doctors.map((d) => (<MenuItem key={d.doctor_id} value={d.doctor_id}>{d.full_name}</MenuItem>))}
                  </Select>
                </FormControl>
              </Box>
                <Box sx={{ flex: '1 1 200px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Appointment *</InputLabel>
                    <Select
                      name="appointment_id"
                      value={treatmentPlan.appointment_id ?? ''}
                      label="Appointment *"
                      onChange={(e) => setTreatmentPlan(prev => ({ ...prev, appointment_id: Number(e.target.value) }))}
                      required
                    >
                      {/* If appointments are available, show them; otherwise allow entering numeric id fallback */}
                      {appointments && appointments.length > 0 ? (
                        appointments.map((a) => (
                          <MenuItem key={a.id} value={a.id}>
                            {`#${a.id} — ${new Date(a.appointment_time).toLocaleString()}`}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disabled>No appointments available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>
            </Box>

            <TextField
              label="Treatment Description"
              name="treatment_description"
              value={treatmentPlan.treatment_description || ''}
              onChange={(e) => setTreatmentPlan(prev => ({ ...prev, treatment_description: e.target.value }))}
              fullWidth
              required
            />

            <TextField
              label="Diagnosis *"
              name="diagnosis"
              value={treatmentPlan.diagnosis || ''}
              onChange={(e) => setTreatmentPlan(prev => ({ ...prev, diagnosis: e.target.value }))}
              fullWidth
              required
              multiline
              rows={2}
            />

            <TextField
              label="Description"
              name="description"
              value={treatmentPlan.description || ''}
              onChange={(e) => setTreatmentPlan(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={3}
            />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 200px' }}>
                <TextField label="Start Date" name="start_date" type="date" value={treatmentPlan.start_date || ''} onChange={(e) => setTreatmentPlan(prev => ({ ...prev, start_date: e.target.value }))} fullWidth InputLabelProps={{ shrink: true }} />
              </Box>
              <Box sx={{ flex: '1 1 200px' }}>
                <TextField label="Expected End Date" name="expected_end_date" type="date" value={treatmentPlan.expected_end_date || ''} onChange={(e) => setTreatmentPlan(prev => ({ ...prev, expected_end_date: e.target.value }))} fullWidth InputLabelProps={{ shrink: true }} />
              </Box>
              <Box sx={{ flex: '1 1 200px' }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={treatmentPlan.status || 'active'}
                    label="Status"
                    onChange={(e) => setTreatmentPlan(prev => ({ ...prev, status: e.target.value as 'draft' | 'active' | 'completed' | 'cancelled' }))}
                    required
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 200px' }}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select 
                    name="priority" 
                    value={treatmentPlan.priority || 'medium'} 
                    label="Priority" 
                    onChange={(e) => setTreatmentPlan(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <TextField
              label="Additional Notes"
              name="notes"
              value={treatmentPlan.notes || ''}
              onChange={(e) => setTreatmentPlan(prev => ({ ...prev, notes: e.target.value }))}
              fullWidth
              multiline
              rows={3}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <MOutlineButton
              onClick={() => navigate('/treatment-plans')}
            >
              Cancel
            </MOutlineButton>
            
            <MButton
              variant="contained"
              onClick={handleSubmit}
              disabled={
                saving ||
                !treatmentPlan.patient_id ||
                !treatmentPlan.doctor_id ||
                treatmentPlan.appointment_id === undefined ||
                !Number.isInteger(treatmentPlan.appointment_id as number) ||
                !treatmentPlan.treatment_description ||
                !treatmentPlan.diagnosis ||
                !['draft', 'active', 'completed', 'cancelled'].includes(String(treatmentPlan.status))
              }
            >
              {saving ? 'Saving...' : id ? 'Update Plan' : 'Create Plan'}
            </MButton>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default TreatmentPlanForm;