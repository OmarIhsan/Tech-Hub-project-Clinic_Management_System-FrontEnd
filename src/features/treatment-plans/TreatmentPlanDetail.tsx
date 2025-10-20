import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
        
        const numericId = Number(id);
        const [planResponse, patientsData, doctorsData] = await Promise.all([
          treatmentPlanService.getById(numericId),
          patientAPI.getAll(),
          doctorAPI.getAll(),
        ]);
        
        const planData = planResponse.data;
        setTreatmentPlan(planData);
        const planObj = planData as unknown as Record<string, unknown>;
        const planPatientId = Number(planObj['patient_id'] ?? planObj['patientId'] ?? NaN);
        const planDoctorId = Number(planObj['doctor_id'] ?? planObj['doctorId'] ?? NaN);
        setPatient(patientsData.find((p) => p.patient_id === planPatientId) || null);
        setDoctor(doctorsData.find((d) => d.doctor_id === planDoctorId) || null);
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
      try {
        const numericId = Number(id);
        const service = treatmentPlanService as unknown as {
          updateStepStatus?: (id: number, stepId: unknown, status: unknown) => Promise<unknown>;
        };
        if (service.updateStepStatus) {
          await service.updateStepStatus(numericId, stepId, newStatus);
        }
      } catch (e) {
        console.warn('updateStepStatus not available or failed, proceeding with local update only', e);
      }

      setTreatmentPlan((prev) => {
        if (!prev) return prev;
        const prevRec = prev as unknown as Record<string, unknown>;
        const prevSteps = (prevRec['steps'] as unknown as Step[]) || [];
        const newSteps = prevSteps.map((step) =>
          (step.id === stepId)
            ? { ...step, status: newStatus, completedDate: new Date().toISOString() }
            : step
        );
        const updated = { ...prevRec, steps: newSteps, lastUpdated: new Date().toISOString() } as unknown as TreatmentPlan;
        return updated;
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

  const calculateProgress = (stepsArr: Array<Record<string, unknown>>) => {
    if (!stepsArr || stepsArr.length === 0) return 0;
    const completedSteps = stepsArr.filter((step) => String(step['status'] ?? '') === 'completed').length;
    return (completedSteps / stepsArr.length) * 100;
  };

  type Step = {
    id: number | string;
    status?: string;
    title?: string;
    description?: string;
    due_date?: string;
    dueDate?: string;
    notes?: string;
    completed_date?: string;
    completedDate?: string;
  };

  const steps: Step[] = ((treatmentPlan as unknown as Record<string, unknown>)['steps'] as unknown as Step[]) || [];

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

  const planObj2 = treatmentPlan as unknown as Record<string, unknown>;
  const statusRaw = planObj2['status'] ?? '';
  const priorityRaw = planObj2['priority'] ?? '';
  const statusLabel = String(statusRaw).toString().replace('-', ' ').toUpperCase();
  const priorityLabel = String(priorityRaw).toUpperCase();

  const planTitle = String(planObj2['title'] ?? planObj2['treatment_description'] ?? planObj2['description'] ?? `Plan #${planObj2['plan_id'] ?? ''}`);

  const patientFullName = patient?.full_name ?? 'Unknown';
  const patientContact = patient?.phone ?? patient?.email ?? 'Unknown';
  const patientAge = (() => {
    const dob = (patient as unknown as Record<string, unknown>)?.date_of_birth;
    if (!dob) return 'Unknown';
    try {
      const diff = Date.now() - new Date(String(dob)).getTime();
      const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      return String(age);
    } catch {
      return 'Unknown';
    }
  })();

  const doctorFullName = doctor?.full_name ?? 'Unknown';
  const doctorContact = doctor?.phone ?? doctor?.email ?? 'Unknown';
  const doctorSpecialty = (doctor as unknown as Record<string, unknown>)?.specialty ?? 'N/A';

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                {planTitle}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {treatmentPlan.diagnosis ?? ''}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
              <Chip
                label={statusLabel}
                color={getStatusColor(treatmentPlan.status)}
                size="small"
              />
              <Chip
                label={priorityLabel}
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
                  value={calculateProgress(steps as Array<Record<string, unknown>>)}
                  sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {Math.round(calculateProgress(steps as Array<Record<string, unknown>>))}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {steps.filter((s) => s.status === 'completed').length} of {steps.length} steps completed
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Patient Information</Typography>
                  <Typography variant="body1"><strong>Name:</strong> {patientFullName}</Typography>
                  <Typography variant="body1"><strong>Age:</strong> {patientAge}</Typography>
                  <Typography variant="body1"><strong>Contact:</strong> {patientContact}</Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: '1 1 300px' }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Doctor Information</Typography>
                  <Typography variant="body1"><strong>Name:</strong> {doctorFullName}</Typography>
                  <Typography variant="body1"><strong>Specialty:</strong> {String(doctorSpecialty)}</Typography>
                  <Typography variant="body1"><strong>Contact:</strong> {doctorContact}</Typography>
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
                {steps.map((step) => (
                  <Step key={step.id} active={String(step.status) === 'in-progress'} completed={String(step.status) === 'completed'}>
                    <StepLabel
                      optional={
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                          <Chip
                            label={String(step.status ?? '').replace('-', ' ').toUpperCase()}
                            size="small"
                            color={String(step.status) === 'completed' ? 'success' : 
                                   String(step.status) === 'in-progress' ? 'primary' :
                                   String(step.status) === 'cancelled' ? 'error' : 'default'}
                            icon={getStepStatusIcon(String(step.status))}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Due: {new Date(String(step.dueDate ?? step.due_date ?? '')).toLocaleDateString()}
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
                  <Typography variant="body1">{new Date(String(planObj2['start_date'] ?? planObj2['startDate'] ?? '')).toLocaleDateString()}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 300px' }}>
                  <Typography variant="body2" color="text.secondary">Expected End Date:</Typography>
                  <Typography variant="body1">{new Date(String(planObj2['expected_end_date'] ?? planObj2['expectedEndDate'] ?? '')).toLocaleDateString()}</Typography>
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