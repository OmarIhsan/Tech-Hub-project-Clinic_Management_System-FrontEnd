import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CancelIcon from '@mui/icons-material/Cancel';
import { TreatmentPlan, Patient, Doctor } from '../../types';
import { treatmentPlanService, patientAPI, doctorAPI } from '../../services/api';
import MButton from '../../components/MButton';
import MOutlineButton from '../../components/MOutlineButton';

const TreatmentPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [updatingStep, setUpdatingStep] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError('');
        
        const [planResponse, patientsData, doctorsData] = await Promise.all([
          treatmentPlanService.getById(id),
          patientAPI.getAll(),
          doctorAPI.getAll(),
        ]);
        
        const planData = planResponse.data;
        setTreatmentPlan(planData);
        setPatient(patientsData.find(p => p.id === planData.patientId) || null);
        setDoctor(doctorsData.find(d => d.id === planData.doctorId) || null);
      } catch (err) {
        setError('Failed to load treatment plan. Please try again.');
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const updateStepStatus = async (stepId, newStatus) => {
    if (!treatmentPlan || !id) return;
    
    try {
      setUpdatingStep(stepId);
  await treatmentPlanService.updateStepStatus(id, stepId, newStatus);
      
      
      setTreatmentPlan(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          steps: prev.steps.map(step =>
            step.id === stepId 
              ? { 
                  ...step, 
                  status: newStatus,
                  completedDate: newStatus === 'completed' ? new Date().toISOString() : step.completedDate
                }
              : step
          ),
          lastUpdated: new Date().toISOString()
        };
      });
    } catch (err) {
      setError('Failed to update step status');
      console.error('Failed to update step:', err);
    } finally {
      setUpdatingStep(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'draft': return 'default';
      case 'cancelled': return 'error';
      case 'on-hold': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getStepStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckIcon />;
      case 'in-progress': return <PlayArrowIcon />;
      case 'on-hold': return <PauseIcon />;
      case 'cancelled': return <CancelIcon />;
      default: return undefined;
    }
  };

  const calculateProgress = (steps) => {
    if (!steps || steps.length === 0) return 0;
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    return (completedSteps / steps.length) * 100;
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

  if (error || !treatmentPlan) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Alert severity="error">{error || 'Treatment plan not found'}</Alert>
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
                {treatmentPlan.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {treatmentPlan.diagnosis}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
              <Chip
                label={treatmentPlan.status.replace('-', ' ').toUpperCase()}
                color={getStatusColor(treatmentPlan.status)}
                size="small"
              />
              <Chip
                label={treatmentPlan.priority.toUpperCase()}
                color={getPriorityColor(treatmentPlan.priority)}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>

          
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Treatment Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={calculateProgress(treatmentPlan.steps)}
                  sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {Math.round(calculateProgress(treatmentPlan.steps))}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {treatmentPlan.steps.filter(s => s.status === 'completed').length} of {treatmentPlan.steps.length} steps completed
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Patient Information</Typography>
                  <Typography variant="body1"><strong>Name:</strong> {patient?.name || 'Unknown'}</Typography>
                  <Typography variant="body1"><strong>Age:</strong> {patient?.age || 'Unknown'}</Typography>
                  <Typography variant="body1"><strong>Contact:</strong> {patient?.contact || 'Unknown'}</Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: '1 1 300px' }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Doctor Information</Typography>
                  <Typography variant="body1"><strong>Name:</strong> {doctor?.name || 'Unknown'}</Typography>
                  <Typography variant="body1"><strong>Specialty:</strong> {doctor?.specialty || 'Unknown'}</Typography>
                  <Typography variant="body1"><strong>Contact:</strong> {doctor?.contact || 'Unknown'}</Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>

          
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Treatment Steps
              </Typography>
              <Stepper orientation="vertical">
                {treatmentPlan.steps.map((step) => (
                  <Step key={step.id} active={step.status === 'in-progress'} completed={step.status === 'completed'}>
                    <StepLabel
                      optional={
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                          <Chip
                            label={step.status.replace('-', ' ').toUpperCase()}
                            size="small"
                            color={step.status === 'completed' ? 'success' : 
                                   step.status === 'in-progress' ? 'primary' :
                                   step.status === 'cancelled' ? 'error' : 'default'}
                            icon={getStepStatusIcon(step.status)}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Due: {new Date(step.dueDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {step.title}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {step.description}
                      </Typography>
                      
                      {step.notes && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                          Notes: {step.notes}
                        </Typography>
                      )}

                      {step.completedDate && (
                        <Typography variant="caption" color="success.main" sx={{ mb: 2, display: 'block' }}>
                          Completed on: {new Date(step.completedDate).toLocaleString()}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {step.status !== 'completed' && (
                          <MButton
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => updateStepStatus(step.id, 'completed')}
                            disabled={updatingStep === step.id}
                          >
                            Mark Complete
                          </MButton>
                        )}
                        
                        {step.status === 'pending' && (
                          <MOutlineButton
                            size="small"
                            onClick={() => updateStepStatus(step.id, 'in-progress')}
                            disabled={updatingStep === step.id}
                          >
                            Start
                          </MOutlineButton>
                        )}
                        
                        {step.status === 'in-progress' && (
                          <MOutlineButton
                            size="small"
                            color="warning"
                            onClick={() => updateStepStatus(step.id, 'on-hold')}
                            disabled={updatingStep === step.id}
                          >
                            Put on Hold
                          </MOutlineButton>
                        )}
                        
                        {step.status !== 'cancelled' && step.status !== 'completed' && (
                          <MOutlineButton
                            size="small"
                            color="error"
                            onClick={() => updateStepStatus(step.id, 'cancelled')}
                            disabled={updatingStep === step.id}
                          >
                            Cancel
                          </MOutlineButton>
                        )}
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>

          
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Plan Details
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px' }}>
                  <Typography variant="body2" color="text.secondary">Start Date:</Typography>
                  <Typography variant="body1">{new Date(treatmentPlan.startDate).toLocaleDateString()}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 300px' }}>
                  <Typography variant="body2" color="text.secondary">Expected End Date:</Typography>
                  <Typography variant="body1">{new Date(treatmentPlan.expectedEndDate).toLocaleDateString()}</Typography>
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body2" color="text.secondary">Description:</Typography>
                  <Typography variant="body1">{treatmentPlan.description}</Typography>
                </Box>
                {treatmentPlan.notes && (
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="body2" color="text.secondary">Notes:</Typography>
                    <Typography variant="body1">{treatmentPlan.notes}</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          <Divider sx={{ my: 3 }} />

          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <MOutlineButton
              onClick={() => navigate('/treatment-plans')}
            >
              Back to List
            </MOutlineButton>
            
            <MButton
              variant="contained"
              onClick={() => navigate(`/treatment-plans/${id}/edit`)}
            >
              Edit Plan
            </MButton>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default TreatmentPlanDetail;