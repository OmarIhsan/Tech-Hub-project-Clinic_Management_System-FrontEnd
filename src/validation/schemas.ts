import * as yup from 'yup';

export const appointmentValidationSchema = yup.object().shape({
  patient_id: yup.number().required('Patient is required').min(1, 'Patient is required'),
  doctor_id: yup.number().required('Doctor is required').min(1, 'Doctor is required'),
  appointment_time: yup.string().required('Date & Time is required'),
  status: yup.string().oneOf(['scheduled', 'completed', 'cancelled', 'no_show']).required('Status is required'),
});

export const treatmentPlanValidationSchema = yup.object().shape({
  patientId: yup.string().required('Patient is required'),
  doctorId: yup.string().required('Doctor is required'),
  title: yup.string().required('Title is required'),
  diagnosis: yup.string().required('Diagnosis is required'),
  description: yup.string(),
  startDate: yup.string(),
  expectedEndDate: yup.string(),
  priority: yup.string().oneOf(['low', 'medium', 'high', 'urgent']),
  notes: yup.string(),
});
