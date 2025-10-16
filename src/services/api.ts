import api from '../config/axios';
import { Patient, Doctor, MedicalRecord } from '../types';

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
  name: string;
  email: string;
  password: string;
  role?: string;
}

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },
  register: (userData: RegisterData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
  getProfile: () => api.get('/auth/profile'),
};

export const patientAPI = {
  getAll: async (params?: { offset?: number; limit?: number; search?: string }): Promise<Patient[]> => {
    const response = await api.get('/patients', { params });
    return response.data;
  },
  getById: async (id: string): Promise<Patient> => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  create: async (patient: Omit<Patient, 'id'>): Promise<Patient> => {
    const response = await api.post('/patients', patient);
    return response.data;
  },
  update: async (id: string, patient: Partial<Patient>): Promise<Patient> => {
    const response = await api.put(`/patients/${id}`, patient);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },
  deleteAndReturnId: async (id: string): Promise<string> => {
    await delay(500);
    const index = mockPatients.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Patient not found');
    mockPatients.splice(index, 1);
    return id;
  },
};

export const doctorAPI = {
  getAll: async (params?: { offset?: number; limit?: number; search?: string }): Promise<Doctor[]> => {
    const response = await api.get('/doctors', { params });
    return response.data;
  },
  getById: async (id: string): Promise<Doctor> => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },
  create: async (doctor: Omit<Doctor, 'id'>): Promise<Doctor> => {
    const response = await api.post('/doctors', doctor);
    return response.data;
  },
  update: async (id: string, doctor: Partial<Doctor>): Promise<Doctor> => {
    const response = await api.put(`/doctors/${id}`, doctor);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/doctors/${id}`);
  },
  deleteAndReturnId: async (id: string): Promise<string> => {
    await delay(500);
    const index = mockDoctors.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Doctor not found');
    mockDoctors.splice(index, 1);
    return id;
  },
};

export const medicalRecordAPI = {
  getAll: async (params?: { patientId?: string; offset?: number; limit?: number }): Promise<MedicalRecord[]> => {
    const response = await api.get('/medical-records', { params });
    return response.data;
  },
  getById: async (id: string): Promise<MedicalRecord> => {
    const response = await api.get(`/medical-records/${id}`);
    return response.data;
  },
  create: async (record: Omit<MedicalRecord, 'id'>): Promise<MedicalRecord> => {
    const response = await api.post('/medical-records', record);
    return response.data;
  },
  update: async (id: string, record: Partial<MedicalRecord>): Promise<MedicalRecord> => {
    const response = await api.put(`/medical-records/${id}`, record);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/medical-records/${id}`);
  },
};
