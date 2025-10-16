import { Routes, Route, Navigate } from 'react-router';
import Login from '../features/auth/Login';
import PatientList from '../features/patients/PatientList';
import PatientForm from '../features/patients/PatientForm';
import DoctorList from '../features/doctors/DoctorList';
import DoctorForm from '../features/doctors/DoctorForm';
import AppointmentList from '../features/appointments/AppointmentList';
import AppointmentForm from '../features/appointments/AppointmentForm';
import TreatmentPlanList from '../features/treatment-plans/TreatmentPlanList';
import TreatmentPlanDetail from '../features/treatment-plans/TreatmentPlanDetail';
import TreatmentPlanForm from '../features/treatment-plans/TreatmentPlanForm';
import MedicalRecordList from '../features/medical-records/MedicalRecordList';
import MedicalRecordDetail from '../features/medical-records/MedicalRecordDetail';
import MedicalRecordForm from '../features/medical-records/MedicalRecordForm';
import ClinicalDocumentList from '../features/clinical-documents/ClinicalDocumentList';
import FormComponentsDemo from '../features/demo/FormComponentsDemo';
import Dashboard from '../features/dashboard/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleRoute from '../components/RoleRoute';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/appointments" replace />} />
    <Route path="/login" element={<Login />} />
  <Route path="/patients" element={<ProtectedRoute><PatientList /></ProtectedRoute>} />
    <Route path="/patients/new" element={<PatientForm />} />
  <Route path="/patients/:id/edit" element={<ProtectedRoute><PatientForm /></ProtectedRoute>} />
  <Route path="/doctors" element={<ProtectedRoute><RoleRoute role="admin"><DoctorList /></RoleRoute></ProtectedRoute>} />
  <Route path="/doctors/new" element={<ProtectedRoute><RoleRoute role="admin"><DoctorForm /></RoleRoute></ProtectedRoute>} />
  <Route path="/doctors/:id/edit" element={<ProtectedRoute><RoleRoute role="admin"><DoctorForm /></RoleRoute></ProtectedRoute>} />
  <Route path="/appointments" element={<ProtectedRoute><AppointmentList /></ProtectedRoute>} />
  <Route path="/appointments/new" element={<ProtectedRoute><AppointmentForm /></ProtectedRoute>} />
  <Route path="/appointments/:id/edit" element={<ProtectedRoute><AppointmentForm /></ProtectedRoute>} />
  <Route path="/treatment-plans" element={<ProtectedRoute><TreatmentPlanList /></ProtectedRoute>} />
  <Route path="/treatment-plans/new" element={<ProtectedRoute><TreatmentPlanForm /></ProtectedRoute>} />
  <Route path="/treatment-plans/:id" element={<ProtectedRoute><TreatmentPlanDetail /></ProtectedRoute>} />
  <Route path="/treatment-plans/:id/edit" element={<ProtectedRoute><TreatmentPlanForm /></ProtectedRoute>} />
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  <Route path="/medical-records" element={<ProtectedRoute><MedicalRecordList /></ProtectedRoute>} />
  <Route path="/medical-records/new" element={<ProtectedRoute><MedicalRecordForm /></ProtectedRoute>} />
  <Route path="/medical-records/:id" element={<ProtectedRoute><MedicalRecordDetail /></ProtectedRoute>} />
  <Route path="/medical-records/:id/edit" element={<ProtectedRoute><MedicalRecordForm /></ProtectedRoute>} />
  <Route path="/documents" element={<ProtectedRoute><ClinicalDocumentList /></ProtectedRoute>} />
  <Route path="/demo" element={<ProtectedRoute><FormComponentsDemo /></ProtectedRoute>} />
  </Routes>
);

export default AppRouter;