// Type guard for error message
function hasErrorMessage(data: unknown): data is { message: string } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'message' in data &&
    typeof (data as { message?: unknown }).message === 'string'
  );
}
import { AxiosError } from 'axios';
// Type guard for AxiosError
function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
}
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Snackbar,
  Checkbox,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MButton from '../../components/MButton';
import SelectField from '../../components/SelectField';
import FormInput from '../../components/FormInput';
import DatePicker from '../../components/DatePicker';
import FileUpload from '../../components/FileUpload';
import { doctorAPI, patientAPI, clinicalDocumentService, appointmentService } from '../../services/api';
import { Doctor } from '../../types';
import { useAuthContext } from '../../context/useAuthContext';

const steps = ['Select Doctor', 'Patient Data', 'Documents (Optional)', 'Schedule Appointment'];

const StaffAddWorkflow: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [activeStep, setActiveStep] = useState(0);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // Removed unused showScheduleDialog
  const [newPatientId, setNewPatientId] = useState<number | null>(null);

  // Form state
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [patientData, setPatientData] = useState({
    full_name: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    date_of_birth: '',
    blood_group: '',
  });
  const [hasDocuments, setHasDocuments] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [appointmentData, setAppointmentData] = useState({
    appointment_time: '',
    status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled' | 'no_show',
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const data = await doctorAPI.getAll();
      setDoctors(data);
    } catch (err) {
      setError('Failed to load doctors');
      console.error(err);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePatientSubmit = async () => {
    if (!patientData.full_name || !patientData.gender || !patientData.phone || !patientData.date_of_birth) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const newPatient = await patientAPI.create(patientData);
      setNewPatientId(newPatient.patient_id);
      setSuccessMessage('Patient added successfully!');
      
      if (hasDocuments && documents.length > 0) {
        handleNext();
      } else {
        handleNext();
      }
    } catch (err) {
      if (isAxiosError(err)) {
        const data = err.response?.data;
        if (hasErrorMessage(data)) {
          setError(data.message);
        } else {
          setError('Failed to add patient');
        }
      } else {
        setError('Failed to add patient');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentsSubmit = async () => {
    if (!newPatientId || !user) return;

    try {
      setLoading(true);
      for (let i = 0; i < documents.length; i++) {
        const dto = {
          patientId: String(newPatientId),
          staffId: user.staff_id,
          title: documents[i].name,
          documentType: documentTypes[i] || 'general',
        };
        await clinicalDocumentService.create(dto);
      }
      setSuccessMessage('Documents uploaded successfully!');
      handleNext();
    } catch (err) {
      if (isAxiosError(err)) {
        const data = err.response?.data;
        if (hasErrorMessage(data)) {
          setError(data.message);
        } else {
          setError('Failed to upload documents');
        }
      } else {
        setError('Failed to upload documents');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentSubmit = async () => {
    if (!newPatientId || !selectedDoctorId || !appointmentData.appointment_time) {
      setError('Please fill all appointment fields');
      return;
    }

    try {
      setLoading(true);
      await appointmentService.create({
        patient_id: newPatientId,
        doctor_id: selectedDoctorId,
        appointment_time: appointmentData.appointment_time,
        status: appointmentData.status,
      });
      
      setSuccessMessage('Appointment scheduled successfully!');
  // Removed setShowScheduleDialog (no longer used)
      
      // Reset form and go back to start
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      if (isAxiosError(err)) {
        const data = err.response?.data;
        if (hasErrorMessage(data)) {
          setError(data.message);
        } else {
          setError('Failed to schedule appointment');
        }
      } else {
        setError('Failed to schedule appointment');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipAppointment = () => {
    setSuccessMessage('Patient added successfully! You can schedule an appointment later.');
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Doctor for Appointment
            </Typography>
            <SelectField
              label="Doctor"
              value={selectedDoctorId?.toString() || ''}
              onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
              options={doctors.map((doc) => ({
                value: doc.doctor_id.toString(),
                label: `Dr. ${doc.full_name}`,
              }))}
              required
            />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <MButton onClick={() => navigate('/')}>Cancel</MButton>
              <MButton
                variant="contained"
                onClick={handleNext}
                disabled={!selectedDoctorId}
              >
                Next
              </MButton>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Enter Patient Data
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormInput
                label="Full Name"
                value={patientData.full_name}
                onChange={(e) => setPatientData({ ...patientData, full_name: e.target.value })}
                required
              />
              <SelectField
                label="Gender"
                value={patientData.gender}
                onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
                required
              />
              <FormInput
                label="Phone"
                value={patientData.phone}
                onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                required
              />
              <FormInput
                label="Email"
                type="email"
                value={patientData.email}
                onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
              />
              <DatePicker
                label="Date of Birth"
                value={patientData.date_of_birth}
                onChange={(date) => setPatientData({ ...patientData, date_of_birth: date })}
                required
              />
              <FormInput
                label="Address"
                value={patientData.address}
                onChange={(e) => setPatientData({ ...patientData, address: e.target.value })}
                multiline
                rows={2}
              />
              <FormInput
                label="Blood Group"
                value={patientData.blood_group}
                onChange={(e) => setPatientData({ ...patientData, blood_group: e.target.value })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasDocuments}
                    onChange={(e) => setHasDocuments(e.target.checked)}
                  />
                }
                label="Patient has clinical documents to upload"
              />
            </Box>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <MButton onClick={handleBack}>Back</MButton>
              <MButton
                variant="contained"
                onClick={handlePatientSubmit}
                disabled={loading}
              >
                {loading ? 'Adding Patient...' : 'Add Patient'}
              </MButton>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Upload Clinical Documents
            </Typography>
            {documents.map((doc, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Document {index + 1}: {doc.name}
                </Typography>
                <TextField
                  fullWidth
                  label="Document Type"
                  value={documentTypes[index] || ''}
                  onChange={(e) => {
                    const newTypes = [...documentTypes];
                    newTypes[index] = e.target.value;
                    setDocumentTypes(newTypes);
                  }}
                  placeholder="e.g., Lab Report, X-Ray, Prescription"
                />
              </Box>
            ))}
            <FileUpload
              onFilesChange={(files) => {
                if (files && files.length > 0) {
                  setDocuments([...documents, ...files as File[]]);
                }
              }}
              acceptedTypes={["image/*", ".pdf"]}
              multiple
            />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <MButton onClick={handleBack}>Back</MButton>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <MButton onClick={handleNext}>Skip</MButton>
                <MButton
                  variant="contained"
                  onClick={handleDocumentsSubmit}
                  disabled={loading || documents.length === 0}
                >
                  {loading ? 'Uploading...' : 'Upload & Continue'}
                </MButton>
              </Box>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Schedule Appointment
            </Typography>
            <Alert severity="success" sx={{ mb: 2 }}>
              Patient added successfully! Now schedule an appointment.
            </Alert>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <DatePicker
                label="Appointment Date & Time"
                value={appointmentData.appointment_time}
                onChange={(date) => setAppointmentData({ ...appointmentData, appointment_time: date })}
                showTime
                required
              />
              <SelectField
                label="Status"
                value={appointmentData.status}
                onChange={(e) => setAppointmentData({ ...appointmentData, status: e.target.value as 'scheduled' | 'completed' | 'cancelled' | 'no_show' })}
                options={[
                  { value: 'scheduled', label: 'Scheduled' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' },
                  { value: 'no_show', label: 'No Show' },
                ]}
              />
            </Box>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <MButton onClick={handleSkipAppointment}>Skip for Now</MButton>
              <MButton
                variant="contained"
                onClick={handleAppointmentSubmit}
                disabled={loading || !appointmentData.appointment_time}
              >
                {loading ? 'Scheduling...' : 'Schedule Appointment'}
              </MButton>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add New Patient
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepContent()}
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StaffAddWorkflow;
