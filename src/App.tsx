import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './features/auth/Login';
import PatientList from './features/patients/PatientList';
import PatientForm from './features/patients/PatientForm';
import DoctorList from './features/doctors/DoctorList';
import DoctorForm from './features/doctors/DoctorForm';


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      </>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/patients/new" element={<PatientForm />} />
        <Route path="/patients/:id/edit" element={<PatientForm />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/doctors/new" element={<DoctorForm />} />
        <Route path="/doctors/:id/edit" element={<DoctorForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
