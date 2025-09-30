import { Routes, Route } from 'react-router-dom';
import Login from '../features/auth/Login';
import PatientList from '../features/patients/PatientList';
import PatientForm from '../features/patients/PatientForm';
import DoctorList from '../features/doctors/DoctorList';
import DoctorForm from '../features/doctors/DoctorForm';

const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/patients" element={<PatientList />} />
    <Route path="/patients/new" element={<PatientForm />} />
    <Route path="/patients/:id/edit" element={<PatientForm />} />
    <Route path="/doctors" element={<DoctorList />} />
    <Route path="/doctors/new" element={<DoctorForm />} />
    <Route path="/doctors/:id/edit" element={<DoctorForm />} />
  </Routes>
);

export default AppRouter;