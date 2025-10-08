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
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { TreatmentPlan, Patient, Doctor } from '../../types';
import { treatmentPlanService, patientAPI, doctorAPI } from '../../services/api';
import MButton from '../../components/MButton';
import MOutlineButton from '../../components/MOutlineButton';

const TreatmentPlanForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [treatmentPlan, setTreatmentPlan] = useState<Partial<TreatmentPlan>>({
    patientId: '',
    doctorId: '',
    title: '',
    description: '',
    diagnosis: '',
    startDate: '',
    expectedEndDate: '',
    status: 'draft',
    priority: 'medium',
    steps: [],
    notes: '',
  });
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

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
          setTreatmentPlan(treatmentPlanData);
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
        createdDate: treatmentPlan.createdDate || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      if (id) {
        await treatmentPlanService.update(id, planData);
      } else {
        await treatmentPlanService.create({
          ...planData,
          steps: planData.steps || []
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
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Patient *</InputLabel>
                  <Select
                    name="patientId"
                    value={treatmentPlan.patientId || ''}
                    label="Patient *"
                    onChange={(e: SelectChangeEvent) => 
                      setTreatmentPlan(prev => ({ ...prev, patientId: e.target.value }))
                    }
                    required
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
                  <InputLabel>Doctor *</InputLabel>
                  <Select
                    name="doctorId"
                    value={treatmentPlan.doctorId || ''}
                    label="Doctor *"
                    onChange={(e: SelectChangeEvent) => 
                      setTreatmentPlan(prev => ({ ...prev, doctorId: e.target.value }))
                    }
                    required
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
              label="Treatment Plan Title *"
              name="title"
              value={treatmentPlan.title || ''}
              onChange={(e) => setTreatmentPlan(prev => ({ ...prev, title: e.target.value }))}
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

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={treatmentPlan.startDate || ''}
                  onChange={(e) => setTreatmentPlan(prev => ({ ...prev, startDate: e.target.value }))}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Expected End Date"
                  name="expectedEndDate"
                  type="date"
                  value={treatmentPlan.expectedEndDate || ''}
                  onChange={(e) => setTreatmentPlan(prev => ({ ...prev, expectedEndDate: e.target.value }))}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={treatmentPlan.priority || 'medium'}
                    label="Priority"
                    onChange={(e: SelectChangeEvent) => 
                      setTreatmentPlan(prev => ({ ...prev, priority: e.target.value as TreatmentPlan['priority'] }))
                    }
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

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
              disabled={saving || !treatmentPlan.patientId || !treatmentPlan.doctorId || !treatmentPlan.title || !treatmentPlan.diagnosis}
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