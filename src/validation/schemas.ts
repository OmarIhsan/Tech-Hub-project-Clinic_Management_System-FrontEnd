import * as yup from 'yup';

export const appointmentValidationSchema = yup.object().shape({
  patientId: yup.string().required('Patient is required'),
  doctorId: yup.string().required('Doctor is required'),
  date: yup.string().required('Date & Time is required'),
  status: yup.string().oneOf(['scheduled', 'completed', 'cancelled']).required('Status is required'),
  notes: yup.string(),
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
