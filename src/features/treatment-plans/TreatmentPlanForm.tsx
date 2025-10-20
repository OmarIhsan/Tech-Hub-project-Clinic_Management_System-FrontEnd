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
import { treatmentPlanService, patientAPI, doctorAPI } from '../../services/api';
import { TreatmentPlan } from '../../types';
import MButton from '../../components/MButton';
import MOutlineButton from '../../components/MOutlineButton';

const TreatmentPlanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [treatmentPlan, setTreatmentPlan] = useState<Partial<TreatmentPlan>>({
    patient_id: '',
    doctor_id: '',
    treatment_description: '',
    diagnosis: '',
    start_date: '',
    expected_end_date: '',
    status: 'ongoing', // must be 'ongoing' | 'completed' | 'cancelled'
    priority: 'medium',
    notes: '',
  });
  
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
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
          const treatmentPlanResponse = await treatmentPlanService.getById(id);
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
  }, [id]);

  const handleSubmit = async () => {
    setError('');
    setSaving(true);
    
    try {
      const planData = {
        ...treatmentPlan,
        createdDate: (treatmentPlan as any).createdDate || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      } as any;

      if (id) {
        await treatmentPlanService.update(id, planData as any);
      } else {
        await treatmentPlanService.create({
          ...(planData as any),
          steps: (planData as any).steps || []
        } as any);
      }
      navigate('/treatment-plans');
    } catch (err) {
      setError('Failed to save treatment plan');
      console.error('Failed to save treatment plan:', err);
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
                    value={treatmentPlan.status || 'ongoing'}
                    label="Status"
                    onChange={(e) => setTreatmentPlan(prev => ({ ...prev, status: e.target.value as 'ongoing' | 'completed' | 'cancelled' }))}
                    required
                  >
                    <MenuItem value="ongoing">Ongoing</MenuItem>
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
              disabled={saving || !treatmentPlan.patient_id || !treatmentPlan.doctor_id || !treatmentPlan.treatment_description || !treatmentPlan.diagnosis}
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