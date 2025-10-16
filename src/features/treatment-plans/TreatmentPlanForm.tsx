import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { treatmentPlanValidationSchema } from '../../validation/schemas';
import { useNavigate, useParams } from 'react-router';
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
import MButton from '../../components/MButton';
import MOutlineButton from '../../components/MOutlineButton';

const TreatmentPlanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
  // register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(treatmentPlanValidationSchema),
    defaultValues: {
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
    },
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
          reset(treatmentPlanData);
        }
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setError('');
    setSaving(true);
    try {
      const planData = {
        ...data,
        createdDate: data.createdDate || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      if (id) {
        await treatmentPlanService.update(id, planData);
      } else {
        await treatmentPlanService.create({
          ...planData,
          steps: planData.steps || []
        });
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Patient *</InputLabel>
                    <Select 
                      name="patientId" 
                      value={watch('patientId') || ''} 
                      label="Patient *" 
                      onChange={(e) => setValue('patientId', e.target.value)} 
                      required
                      error={!!errors.patientId}
                    >
                      {patients.map((p) => (<MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>))}
                    </Select>
                    {errors.patientId && <Typography color="error" variant="caption">{errors.patientId.message}</Typography>}
                  </FormControl>
                </Box>
                <Box sx={{ flex: '1 1 300px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Doctor *</InputLabel>
                    <Select 
                      name="doctorId" 
                      value={watch('doctorId') || ''} 
                      label="Doctor *" 
                      onChange={(e) => setValue('doctorId', e.target.value)} 
                      required
                      error={!!errors.doctorId}
                    >
                      {doctors.map((d) => (<MenuItem key={d.id} value={d.id}>{d.name} - {d.specialty}</MenuItem>))}
                    </Select>
                    {errors.doctorId && <Typography color="error" variant="caption">{errors.doctorId.message}</Typography>}
                  </FormControl>
                </Box>
              </Box>
              <TextField
                label="Treatment Plan Title *"
                name="title"
                value={watch('title') || ''}
                onChange={(e) => setValue('title', e.target.value)}
                fullWidth
                required
                error={!!errors.title}
                helperText={errors.title?.message}
              />
              <TextField
                label="Diagnosis *"
                name="diagnosis"
                value={watch('diagnosis') || ''}
                onChange={(e) => setValue('diagnosis', e.target.value)}
                fullWidth
                required
                multiline
                rows={2}
                error={!!errors.diagnosis}
                helperText={errors.diagnosis?.message}
              />
              <TextField
                label="Description"
                name="description"
                value={watch('description') || ''}
                onChange={(e) => setValue('description', e.target.value)}
                fullWidth
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 200px' }}>
                  <TextField label="Start Date" name="startDate" type="date" value={watch('startDate') || ''} onChange={(e) => setValue('startDate', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.startDate} helperText={errors.startDate?.message} />
                </Box>
                <Box sx={{ flex: '1 1 200px' }}>
                  <TextField label="Expected End Date" name="expectedEndDate" type="date" value={watch('expectedEndDate') || ''} onChange={(e) => setValue('expectedEndDate', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} error={!!errors.expectedEndDate} helperText={errors.expectedEndDate?.message} />
                </Box>
                <Box sx={{ flex: '1 1 200px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select 
                      name="priority" 
                      value={watch('priority') || 'medium'} 
                      label="Priority" 
                      onChange={(e) => setValue('priority', e.target.value)}
                      error={!!errors.priority}
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="urgent">Urgent</MenuItem>
                    </Select>
                    {errors.priority && <Typography color="error" variant="caption">{errors.priority.message}</Typography>}
                  </FormControl>
                </Box>
              </Box>
              <TextField
                label="Additional Notes"
                name="notes"
                value={watch('notes') || ''}
                onChange={(e) => setValue('notes', e.target.value)}
                fullWidth
                multiline
                rows={3}
                error={!!errors.notes}
                helperText={errors.notes?.message}
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
                type="submit"
                disabled={saving}
              >
                {saving ? 'Saving...' : id ? 'Update Plan' : 'Create Plan'}
              </MButton>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default TreatmentPlanForm;