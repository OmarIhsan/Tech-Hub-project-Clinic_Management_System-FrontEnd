import api from '../config/axios';
import { Patient, Doctor, MedicalRecord } from '../types';


export { default as appointmentService } from './appointmentService';
export { default as treatmentPlanService } from './treatmentPlanService';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const authAPI = {
  login: (credentials: LoginCredentials) => api.post('/auth/login', credentials),
  register: (userData: RegisterData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};


const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    age: '30',
    contact: '123-456-7890',
    full_name: 'Johnathan Doe',
    gender: 'male',
    date_of_birth: '1994-06-01',
    phone: '123-456-7890',
    email: 'john.doe@example.com',
    address: '123 Main St, Springfield',
    meta: { patient_id: 1 }
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: '25',
    contact: '098-765-4321',
    full_name: 'Jane A. Smith',
    gender: 'female',
    date_of_birth: '1999-02-14',
    phone: '098-765-4321',
    email: 'jane.smith@example.com',
    address: '456 Oak Ave, Springfield',
    meta: { patient_id: 2 }
  },
  {
    id: '3',
    name: 'Bob Johnson',
    age: '45',
    contact: '555-123-4567',
    full_name: 'Robert Johnson',
    gender: 'male',
    date_of_birth: '1980-11-21',
    phone: '555-123-4567',
    email: 'bob.johnson@example.com',
    address: '789 Pine Rd, Springfield',
    meta: { patient_id: 3 }
  },
  {
    id: '4',
    name: 'Alice Brown',
    age: '35',
    contact: '444-567-8901',
    full_name: 'Alice Brown',
    gender: 'female',
    date_of_birth: '1989-05-12',
    phone: '444-567-8901',
    email: 'alice.brown@example.com',
    address: '321 Cedar Ln, Springfield',
    meta: { patient_id: 4 }
  }
];

const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Wilson',
    specialty: 'Cardiology',
    contact: '111-222-3333',
    full_name: 'Dr. Andrew Wilson',
    gender: 'male',
    phone: '111-222-3333',
    email: 'andrew.wilson@example.com',
    hire_date: '2015-03-01',
    meta: { doctor_id: 1 }
  },
  {
    id: '2',
    name: 'Dr. House',
    specialty: 'Internal Medicine',
    contact: '222-333-4444',
    full_name: 'Dr. Gregory House',
    gender: 'male',
    phone: '222-333-4444',
    email: 'greg.house@example.com',
    hire_date: '2010-06-12',
    meta: { doctor_id: 2 }
  },
  {
    id: '3',
    name: 'Dr. Grey',
    specialty: 'Surgery',
    contact: '333-444-5555',
    full_name: 'Dr. Meredith Grey',
    gender: 'female',
    phone: '333-444-5555',
    email: 'meredith.grey@example.com',
    hire_date: '2018-09-03',
    meta: { doctor_id: 3 }
  },
  {
    id: '4',
    name: 'Dr. Shepherd',
    specialty: 'Neurology',
    contact: '444-555-6666',
    full_name: 'Dr. Derek Shepherd',
    gender: 'male',
    phone: '444-555-6666',
    email: 'derek.shepherd@example.com',
    hire_date: '2012-01-20',
    meta: { doctor_id: 4 }
  }
];


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const patientAPI = {
  getAll: async (): Promise<Patient[]> => {
    await delay(500);
    return mockPatients;
  },
  getById: async (id: string): Promise<Patient> => {
    await delay(300);
    const patient = mockPatients.find(p => p.id === id);
    if (!patient) throw new Error('Patient not found');
    return patient;
  },
  create: async (patient: Omit<Patient, 'id'>): Promise<Patient> => {
    await delay(800);
    const newPatient = { ...patient, id: Date.now().toString() };
    mockPatients.push(newPatient);
    return newPatient;
  },
  update: async (id: string, patient: Partial<Patient>): Promise<Patient> => {
    await delay(800);
    const index = mockPatients.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Patient not found');
    mockPatients[index] = { ...mockPatients[index], ...patient };
    return mockPatients[index];
  },
  delete: async (id: string): Promise<void> => {
    await delay(500);
    const index = mockPatients.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Patient not found');
    mockPatients.splice(index, 1);
  },
};

export const doctorAPI = {
  getAll: async (): Promise<Doctor[]> => {
    await delay(500);
    return mockDoctors;
  },
  getById: async (id: string): Promise<Doctor> => {
    await delay(300);
    const doctor = mockDoctors.find(d => d.id === id);
    if (!doctor) throw new Error('Doctor not found');
    return doctor;
  },
  create: async (doctor: Omit<Doctor, 'id'>): Promise<Doctor> => {
    await delay(800);
    const newDoctor = { ...doctor, id: Date.now().toString() };
    mockDoctors.push(newDoctor);
    return newDoctor;
  },
  update: async (id: string, doctor: Partial<Doctor>): Promise<Doctor> => {
    await delay(800);
    const index = mockDoctors.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Doctor not found');
    mockDoctors[index] = { ...mockDoctors[index], ...doctor };
    return mockDoctors[index];
  },
  delete: async (id: string): Promise<void> => {
    await delay(500);
    const index = mockDoctors.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Doctor not found');
    mockDoctors.splice(index, 1);
  },
};






const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    appointmentId: '1',
    recordDate: '2024-01-15',
    diagnosis: {
      primary: 'Hypertension',
      secondary: ['Type 2 Diabetes'],
      icd10Code: 'I10',
      severity: 'moderate',
      confidence: 'confirmed'
    },
    findings: [
      {
        id: '1',
        type: 'vital-sign',
        title: 'Blood Pressure',
        description: 'Elevated blood pressure reading',
        value: '150/95',
        unit: 'mmHg',
        normalRange: '120/80 mmHg',
        severity: 'medium',
        recordedDate: '2024-01-15T10:00:00Z',
        recordedBy: '1'
      },
      {
        id: '2',
        type: 'test-result',
        title: 'Blood Glucose',
        description: 'Fasting blood glucose level',
        value: '140',
        unit: 'mg/dL',
        normalRange: '70-100 mg/dL',
        severity: 'medium',
        recordedDate: '2024-01-15T10:15:00Z',
        recordedBy: '1'
      }
    ],
    treatment: {
      prescribed: true,
      medications: [
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '3 months',
          instructions: 'Take with food in the morning'
        },
        {
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '3 months',
          instructions: 'Take with meals'
        }
      ],
      procedures: [],
      recommendations: [
        'Reduce sodium intake to less than 2g per day',
        'Exercise 30 minutes daily',
        'Monitor blood pressure daily',
        'Follow up in 4 weeks'
      ]
    },
    followUp: {
      required: true,
      scheduledDate: '2024-02-15',
      instructions: 'Blood pressure and glucose monitoring'
    },
    status: 'finalized',
    createdDate: '2024-01-15T10:30:00Z',
    lastUpdated: '2024-01-15T10:30:00Z',
    notes: 'Patient counseled on lifestyle modifications'
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '2',
    recordDate: '2024-01-16',
    diagnosis: {
      primary: 'Upper Respiratory Infection',
      icd10Code: 'J06.9',
      severity: 'mild',
      confidence: 'probable'
    },
    findings: [
      {
        id: '3',
        type: 'symptom',
        title: 'Cough',
        description: 'Dry, persistent cough for 3 days',
        severity: 'low',
        recordedDate: '2024-01-16T14:30:00Z',
        recordedBy: '2'
      },
      {
        id: '4',
        type: 'observation',
        title: 'Throat Examination',
        description: 'Mild erythema of throat, no exudate',
        severity: 'low',
        recordedDate: '2024-01-16T14:35:00Z',
        recordedBy: '2'
      }
    ],
    treatment: {
      prescribed: true,
      medications: [
        {
          name: 'Dextromethorphan',
          dosage: '15mg',
          frequency: 'Every 4 hours as needed',
          duration: '7 days',
          instructions: 'For cough suppression'
        }
      ],
      procedures: [],
      recommendations: [
        'Rest and adequate fluid intake',
        'Avoid irritants like smoke',
        'Return if symptoms worsen or persist beyond 10 days'
      ]
    },
    followUp: {
      required: false,
      instructions: 'Return if symptoms persist or worsen'
    },
    status: 'finalized',
    createdDate: '2024-01-16T14:45:00Z',
    lastUpdated: '2024-01-16T14:45:00Z'
  }
];

export const medicalRecordAPI = {
  getAll: async (): Promise<MedicalRecord[]> => {
    await delay(500);
    return mockMedicalRecords;
  },
  getById: async (id: string): Promise<MedicalRecord> => {
    await delay(300);
    const record = mockMedicalRecords.find(r => r.id === id);
    if (!record) throw new Error('Medical record not found');
    return record;
  },
  create: async (record: Omit<MedicalRecord, 'id'>): Promise<MedicalRecord> => {
    await delay(1000);
    const newRecord = { ...record, id: Date.now().toString() };
    mockMedicalRecords.push(newRecord);
    return newRecord;
  },
  update: async (id: string, record: Partial<MedicalRecord>): Promise<MedicalRecord> => {
    await delay(800);
    const index = mockMedicalRecords.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Medical record not found');
    mockMedicalRecords[index] = { ...mockMedicalRecords[index], ...record };
    return mockMedicalRecords[index];
  },
  delete: async (id: string): Promise<void> => {
    await delay(500);
    const index = mockMedicalRecords.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Medical record not found');
    mockMedicalRecords.splice(index, 1);
  },
};