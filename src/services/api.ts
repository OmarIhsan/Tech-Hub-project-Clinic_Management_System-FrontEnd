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
  role?: 'owner' | 'doctor' | 'staff' | 'customer';
}

interface AuthResponse {
  user: Staff;
  access_token: string;
}

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    if (response.data.access_token) {
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
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
    return response.data;
  },
  getById: async (id: number): Promise<Patient> => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  create: async (patient: Omit<Patient, 'patient_id' | 'createdAt' | 'updatedAt'>): Promise<Patient> => {
    const response = await api.post('/patients', patient);
    return response.data;
  },
  update: async (id: number, patient: Partial<Omit<Patient, 'patient_id' | 'createdAt' | 'updatedAt'>>): Promise<Patient> => {
    const response = await api.put(`/patients/${id}`, patient);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },
};

export const doctorAPI = {
  getAll: async (params?: { offset?: number; limit?: number }): Promise<Doctor[]> => {
    const response = await api.get('/doctors', { params });
    return response.data;
  },
  getById: async (id: number): Promise<Doctor> => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },
  create: async (doctor: Omit<Doctor, 'doctor_id' | 'createdAt' | 'updatedAt'>): Promise<Doctor> => {
    const response = await api.post('/doctors', doctor);
    return response.data;
  },
  update: async (id: number, doctor: Partial<Omit<Doctor, 'doctor_id' | 'createdAt' | 'updatedAt'>>): Promise<Doctor> => {
    const response = await api.put(`/doctors/${id}`, doctor);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/doctors/${id}`);
  },
};

export const medicalRecordAPI = {
  getAll: async (params?: { offset?: number; limit?: number }): Promise<MedicalRecord[]> => {
    const response = await api.get('/medical-records', { params });
    return response.data;
  },
  getById: async (id: number): Promise<MedicalRecord> => {
    const response = await api.get(`/medical-records/${id}`);
    return response.data;
  },
  create: async (record: { patientId: number; doctorId: number; diagnosis: string; prescription?: string; visit_date: string }): Promise<MedicalRecord> => {
    const response = await api.post('/medical-records', record);
    return response.data;
  },
  update: async (id: number, record: { diagnosis?: string; prescription?: string }): Promise<MedicalRecord> => {
    const response = await api.put(`/medical-records/${id}`, record);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/medical-records/${id}`);
  },
};
