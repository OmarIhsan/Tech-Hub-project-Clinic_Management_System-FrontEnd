import { Routes, Route } from 'react-router';
import Login from '../features/auth/Login';
import RoleDashboard from '../features/dashboard/RoleDashboard';
import PatientList from '../features/patients/PatientList';
import PatientForm from '../features/patients/PatientForm';
import PatientDetail from '../features/patients/PatientDetail';
import DoctorList from '../features/doctors/DoctorList';
import DoctorForm from '../features/doctors/DoctorForm';
import AppointmentList from '../features/appointments/AppointmentList';
import AppointmentForm from '../features/appointments/AppointmentForm';
import AppointmentCalendarView from '../features/appointments/AppointmentCalendarView';
import AppointmentSearch from '../features/appointments/AppointmentSearch';
import TreatmentPlanList from '../features/treatment-plans/TreatmentPlanList';
import TreatmentPlanDetail from '../features/treatment-plans/TreatmentPlanDetail';
import TreatmentPlanForm from '../features/treatment-plans/TreatmentPlanForm';
import MedicalRecordList from '../features/medical-records/MedicalRecordList';
import MedicalRecordDetail from '../features/medical-records/MedicalRecordDetail';
import MedicalRecordForm from '../features/medical-records/MedicalRecordForm';
import ClinicalDocumentList from '../features/clinical-documents/ClinicalDocumentList';
import ClinicalDocumentUploadPage from '../features/clinical-documents/ClinicalDocumentUploadPage';
import ProcedureList from '../features/procedures/ProcedureList';
import ProcedureForm from '../features/procedures/ProcedureForm';
import PatientImageGallery from '../features/patient-images/PatientImageGallery';
import { FinanceDashboard, ExpenseList, ExpenseForm, IncomeList, IncomeForm } from '../features/finance';
import { StaffAddWorkflow, StaffUpdateWorkflow } from '../features/staff';
import StaffList from '../features/staff/StaffList';
import FormComponentsDemo from '../features/demo/FormComponentsDemo';
import ProtectedRoute from '../components/ProtectedRoute';
import { StaffRole } from '../types';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<RoleDashboard />} />
    <Route path="/dashboard" element={<RoleDashboard />} />
    <Route path="/login" element={<Login />} />

    <Route path="/patients" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR, StaffRole.STAFF]}><PatientList /></ProtectedRoute>} />
    <Route path="/patients/new" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR, StaffRole.STAFF]}><PatientForm /></ProtectedRoute>} />
    <Route path="/patients/:id" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR, StaffRole.STAFF]}><PatientDetail /></ProtectedRoute>} />
    <Route path="/patients/:id/edit" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR, StaffRole.STAFF]}><PatientForm /></ProtectedRoute>} />

    <Route path="/doctors" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR, StaffRole.STAFF]}><DoctorList /></ProtectedRoute>} />
    <Route path="/doctors/new" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER]}><DoctorForm /></ProtectedRoute>} />
    <Route path="/doctors/:id/edit" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER]}><DoctorForm /></ProtectedRoute>} />

    <Route path="/appointments" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR, StaffRole.STAFF]}><AppointmentList /></ProtectedRoute>} />
    <Route path="/appointments/search" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR, StaffRole.STAFF]}><AppointmentSearch /></ProtectedRoute>} />
    <Route path="/appointments/calendar" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR, StaffRole.STAFF]}><AppointmentCalendarView /></ProtectedRoute>} />
    <Route path="/appointments/new" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR, StaffRole.STAFF]}><AppointmentForm /></ProtectedRoute>} />
    <Route path="/appointments/:id/edit" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR, StaffRole.STAFF]}><AppointmentForm /></ProtectedRoute>} />

    <Route path="/treatment-plans" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR]}><TreatmentPlanList /></ProtectedRoute>} />
    <Route path="/treatment-plans/new" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR]}><TreatmentPlanForm /></ProtectedRoute>} />
    <Route path="/treatment-plans/:id" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR]}><TreatmentPlanDetail /></ProtectedRoute>} />
    <Route path="/treatment-plans/:id/edit" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR]}><TreatmentPlanForm /></ProtectedRoute>} />

    <Route path="/medical-records" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR]}><MedicalRecordList /></ProtectedRoute>} />
    <Route path="/medical-records/new" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR, StaffRole.STAFF]}><MedicalRecordForm /></ProtectedRoute>} />
    <Route path="/medical-records/:id" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR]}><MedicalRecordDetail /></ProtectedRoute>} />
    <Route path="/medical-records/:id/edit" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR]}><MedicalRecordForm /></ProtectedRoute>} />

    <Route path="/procedures" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR]}><ProcedureList /></ProtectedRoute>} />
    <Route path="/procedures/new" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR]}><ProcedureForm /></ProtectedRoute>} />
    <Route path="/procedures/:id/edit" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR]}><ProcedureForm /></ProtectedRoute>} />

    <Route path="/patient-images" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER]}><PatientImageGallery /></ProtectedRoute>} />

    <Route path="/documents" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER]}><ClinicalDocumentList /></ProtectedRoute>} />
    <Route path="/clinical-documents/new" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR, StaffRole.STAFF]}><ClinicalDocumentUploadPage /></ProtectedRoute>} />

    <Route path="/staff" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER]}><StaffList /></ProtectedRoute>} />
    <Route path="/staff/add" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER]}><StaffAddWorkflow /></ProtectedRoute>} />
    <Route path="/staff/update" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER]}><StaffUpdateWorkflow /></ProtectedRoute>} />

    <Route path="/finance" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER]}><FinanceDashboard /></ProtectedRoute>} />
    <Route path="/finance/expenses" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER]}><ExpenseList /></ProtectedRoute>} />
    <Route path="/finance/expenses/new" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER]}><ExpenseForm /></ProtectedRoute>} />
    <Route path="/finance/expenses/:id/edit" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER]}><ExpenseForm /></ProtectedRoute>} />
    <Route path="/finance/income" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER]}><IncomeList /></ProtectedRoute>} />
    <Route path="/finance/income/new" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER]}><IncomeForm /></ProtectedRoute>} />
    <Route path="/finance/income/:id/edit" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER]}><IncomeForm /></ProtectedRoute>} />

    <Route path="/demo" element={<ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR, StaffRole.STAFF]}><FormComponentsDemo /></ProtectedRoute>} />
  </Routes>
);

export default AppRouter;