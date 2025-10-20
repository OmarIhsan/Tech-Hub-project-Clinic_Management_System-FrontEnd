import api from '../config/axios';
import { Patient, Doctor, MedicalRecord, Staff } from '../types';

export { default as appointmentService } from './appointmentService';
export { default as treatmentPlanService } from './treatmentPlanService';
export { default as staffService } from './staffService';
export { default as clinicalDocumentService } from './clinicalDocumentService';
export { default as patientImageService } from './patientImageService';
export { default as procedureService } from './procedureService';
export { default as expenseService } from './expenseService';
export { default as otherIncomeService } from './otherIncomeService';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  full_name: string;
  password: string;
  phone: string;
  role?: 'owner' | 'doctor' | 'staff';
}

interface AuthResponse {
  user: Staff;
  access_token: string;
}

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    const authData = response.data.data || response.data;
    if (authData.access_token) {
      localStorage.setItem('accessToken', authData.access_token);
      localStorage.setItem('user', JSON.stringify(authData.user));
    }
    return authData;
  },
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    const authData = response.data.data || response.data;
    if (authData.access_token) {
      localStorage.setItem('accessToken', authData.access_token);
      localStorage.setItem('user', JSON.stringify(authData.user));
    }
    return authData;
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.patch('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export const patientAPI = {
  getAll: async (params?: { offset?: number; limit?: number }): Promise<Patient[]> => {
    const response = await api.get('/patients', { params });
    const resp = response.data;
    if (!resp) return [];
    if (Array.isArray(resp)) return resp as Patient[];
    if (resp && typeof resp === 'object') {
      if (Array.isArray(resp.data)) return resp.data as Patient[];
      if (resp.data && typeof resp.data === 'object' && Array.isArray(resp.data.data)) return resp.data.data as Patient[];
    }
    return [];
  },
  getById: async (id: number): Promise<Patient> => {
    const response = await api.get(`/patients/${id}`);
    return response.data.data || response.data;
  },
  create: async (patient: Omit<Patient, 'patient_id' | 'createdAt' | 'updatedAt'>): Promise<Patient> => {
    const response = await api.post('/patients', patient);
    return response.data.data || response.data;
  },
  update: async (id: number, patient: Partial<Omit<Patient, 'patient_id' | 'createdAt' | 'updatedAt'>>): Promise<Patient> => {
    const response = await api.put(`/patients/${id}`, patient);
    return response.data.data || response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },
};

export const doctorAPI = {
  getAll: async (params?: { offset?: number; limit?: number }): Promise<Doctor[]> => {
    const response = await api.get('/doctors', { params });
    const resp = response.data;
    if (Array.isArray(resp)) return resp as Doctor[];
    if (resp && typeof resp === 'object') {
      if (Array.isArray(resp.data)) return resp.data as Doctor[];
      if (resp.data && typeof resp.data === 'object' && Array.isArray(resp.data.data)) return resp.data.data as Doctor[];
    }
    return [];
  },
  getById: async (id: number): Promise<Doctor> => {
    const response = await api.get(`/doctors/${id}`);
    const resp = response.data;
    if (!resp) throw new Error('No doctor data');
    if (resp.data && typeof resp.data === 'object') return resp.data as Doctor;
    if (resp.doctor && typeof resp.doctor === 'object') return resp.doctor as Doctor;
    return resp as Doctor;
  },
  create: async (doctor: Omit<Doctor, 'doctor_id' | 'createdAt' | 'updatedAt'>): Promise<Doctor> => {
    const response = await api.post('/doctors', doctor);
    const resp = response.data;
    if (resp && resp.data) return resp.data as Doctor;
    return resp as Doctor;
  },
  update: async (id: number, doctor: Partial<Omit<Doctor, 'doctor_id' | 'createdAt' | 'updatedAt'>>): Promise<Doctor> => {
    const response = await api.put(`/doctors/${id}`, doctor);
    const resp = response.data;
    if (resp && resp.data) return resp.data as Doctor;
    return resp as Doctor;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/doctors/${id}`);
  },
};

export const medicalRecordAPI = {
  getAll: async (params?: { offset?: number; limit?: number }): Promise<MedicalRecord[]> => {
    const response = await api.get('/medical-records', { params });
    const resp = response.data;
    if (Array.isArray(resp)) return resp as MedicalRecord[];
    if (resp && typeof resp === 'object') {
      if (Array.isArray(resp.data)) return resp.data as MedicalRecord[];
      if (Array.isArray(resp.data?.data)) return resp.data.data as MedicalRecord[];
    }
    return [];
  },
  getById: async (id: number): Promise<MedicalRecord> => {
    const response = await api.get(`/medical-records/${id}`);
    const resp = response.data;
    if (resp && typeof resp === 'object') return (resp.data || resp) as MedicalRecord;
    return resp as MedicalRecord;
  },
  create: async (record: { patient_id: number; doctor_id: number; diagnosis?: string; clinical_findings: string; treatment: string; allergies: string; medical_conditions?: string; current_meds_json?: unknown }): Promise<MedicalRecord> => {
    const response = await api.post('/medical-records', record);
    const resp = response.data;
    if (resp && typeof resp === 'object') return (resp.data || resp) as MedicalRecord;
    return resp as MedicalRecord;
  },
  update: async (id: number, record: { diagnosis?: string; clinical_findings?: string; treatment?: string; allergies?: string; medical_conditions?: string; current_meds_json?: unknown } | { diagnosis?: string; prescription?: string }): Promise<MedicalRecord> => {
    const response = await api.put(`/medical-records/${id}`, record);
    const resp = response.data;
    if (resp && typeof resp === 'object') return (resp.data || resp) as MedicalRecord;
    return resp as MedicalRecord;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/medical-records/${id}`);
  },
};
