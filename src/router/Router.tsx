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

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/appointments" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/patients" element={<PatientList />} />
    <Route path="/patients/new" element={<PatientForm />} />
    <Route path="/patients/:id/edit" element={<PatientForm />} />
    <Route path="/doctors" element={<DoctorList />} />
    <Route path="/doctors/new" element={<DoctorForm />} />
    <Route path="/doctors/:id/edit" element={<DoctorForm />} />
    <Route path="/appointments" element={<AppointmentList />} />
    <Route path="/appointments/new" element={<AppointmentForm />} />
    <Route path="/appointments/:id/edit" element={<AppointmentForm />} />
    <Route path="/treatment-plans" element={<TreatmentPlanList />} />
    <Route path="/treatment-plans/new" element={<TreatmentPlanForm />} />
    <Route path="/treatment-plans/:id" element={<TreatmentPlanDetail />} />
    <Route path="/treatment-plans/:id/edit" element={<TreatmentPlanForm />} />
    <Route path="/medical-records" element={<MedicalRecordList />} />
    <Route path="/medical-records/new" element={<MedicalRecordForm />} />
    <Route path="/medical-records/:id" element={<MedicalRecordDetail />} />
    <Route path="/medical-records/:id/edit" element={<MedicalRecordForm />} />
    <Route path="/documents" element={<ClinicalDocumentList />} />
    <Route path="/demo" element={<FormComponentsDemo />} />
  </Routes>
);

export default AppRouter;