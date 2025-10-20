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
    <Route path="/login" element={<Login />} />
    <Route path="/patients" element={<ProtectedRoute><PatientList /></ProtectedRoute>} />
    <Route path="/patients/new" element={<PatientForm />} />
    <Route path="/patients/:id" element={<ProtectedRoute><PatientDetail /></ProtectedRoute>} />
    <Route path="/patients/:id/edit" element={<ProtectedRoute><PatientForm /></ProtectedRoute>} />
    <Route path="/doctors" element={<ProtectedRoute><DoctorList /></ProtectedRoute>} />
    <Route path="/doctors/new" element={<ProtectedRoute><DoctorForm /></ProtectedRoute>} />
    <Route path="/doctors/:id/edit" element={<ProtectedRoute><DoctorForm /></ProtectedRoute>} />
    <Route path="/appointments" element={<ProtectedRoute><AppointmentList /></ProtectedRoute>} />
  <Route path="/appointments/search" element={<ProtectedRoute><AppointmentSearch /></ProtectedRoute>} />
    <Route path="/appointments/calendar" element={<ProtectedRoute><AppointmentCalendarView /></ProtectedRoute>} />
  <Route path="/appointments/new" element={<AppointmentForm />} />
    <Route path="/appointments/:id/edit" element={<ProtectedRoute><AppointmentForm /></ProtectedRoute>} />
    <Route
      path="/treatment-plans"
      element={
        <ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR, StaffRole.STAFF]}>
          <TreatmentPlanList />
        </ProtectedRoute>
      }
    />
    <Route
      path="/treatment-plans/new"
      element={
        <ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR, StaffRole.STAFF]}>
          <TreatmentPlanForm />
        </ProtectedRoute>
      }
    />
    <Route
      path="/treatment-plans/:id"
      element={
        <ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR, StaffRole.STAFF]}>
          <TreatmentPlanDetail />
        </ProtectedRoute>
      }
    />
    <Route
      path="/treatment-plans/:id/edit"
      element={
        <ProtectedRoute allowedRoles={[StaffRole.OWNER, StaffRole.DOCTOR, StaffRole.STAFF]}>
          <TreatmentPlanForm />
        </ProtectedRoute>
      }
    />
    <Route path="/medical-records" element={<ProtectedRoute><MedicalRecordList /></ProtectedRoute>} />
  <Route path="/medical-records/new" element={<MedicalRecordForm />} />
    <Route path="/medical-records/:id" element={<ProtectedRoute><MedicalRecordDetail /></ProtectedRoute>} />
    <Route path="/medical-records/:id/edit" element={<ProtectedRoute><MedicalRecordForm /></ProtectedRoute>} />
    <Route path="/procedures" element={<ProtectedRoute><ProcedureList /></ProtectedRoute>} />
    <Route path="/procedures/new" element={<ProtectedRoute><ProcedureForm /></ProtectedRoute>} />
    <Route path="/procedures/:id/edit" element={<ProtectedRoute><ProcedureForm /></ProtectedRoute>} />
  <Route path="/patient-images" element={<PatientImageGallery />} />
    <Route path="/documents" element={<ProtectedRoute><ClinicalDocumentList /></ProtectedRoute>} />
    <Route path="/clinical-documents/new" element={<ClinicalDocumentUploadPage />} />
  <Route path="/staff" element={<ProtectedRoute><StaffList /></ProtectedRoute>} />
    <Route path="/finance" element={<ProtectedRoute><FinanceDashboard /></ProtectedRoute>} />
    <Route path="/finance/expenses" element={<ProtectedRoute><ExpenseList /></ProtectedRoute>} />
    <Route path="/finance/expenses/new" element={<ProtectedRoute><ExpenseForm /></ProtectedRoute>} />
    <Route path="/finance/expenses/:id/edit" element={<ProtectedRoute><ExpenseForm /></ProtectedRoute>} />
    <Route path="/finance/income" element={<ProtectedRoute><IncomeList /></ProtectedRoute>} />
    <Route path="/finance/income/new" element={<ProtectedRoute><IncomeForm /></ProtectedRoute>} />
    <Route path="/finance/income/:id/edit" element={<ProtectedRoute><IncomeForm /></ProtectedRoute>} />
    <Route path="/staff/add" element={<ProtectedRoute><StaffAddWorkflow /></ProtectedRoute>} />
    <Route path="/staff/update" element={<ProtectedRoute><StaffUpdateWorkflow /></ProtectedRoute>} />
    <Route path="/demo" element={<ProtectedRoute><FormComponentsDemo /></ProtectedRoute>} />
  </Routes>
);

export default AppRouter;