import api from '../config/axios';
import { Patient, Doctor, MedicalRecord } from '../types';

// Export all services
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
    patient_id: 1,
    full_name: 'Johnathan Doe',
    gender: 'male',
    date_of_birth: '1994-06-01',
    phone: '123-456-7890',
    email: 'john.doe@example.com',
    address: '123 Main St, Springfield, IL 62701',
    meta: { 
      registration_date: '2024-01-01',
      emergency_contact: 'Mary Doe - 123-456-7891',
      insurance_provider: 'HealthFirst Insurance'
    }
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: '25',
    contact: '098-765-4321',
    patient_id: 2,
    full_name: 'Jane A. Smith',
    gender: 'female',
    date_of_birth: '1999-02-14',
    phone: '098-765-4321',
    email: 'jane.smith@example.com',
    address: '456 Oak Ave, Springfield, IL 62702',
    meta: { 
      registration_date: '2024-01-05',
      emergency_contact: 'Robert Smith - 098-765-4322',
      insurance_provider: 'MediCare Plus'
    }
  },
  {
    id: '3',
    name: 'Bob Johnson',
    age: '45',
    contact: '555-123-4567',
    patient_id: 3,
    full_name: 'Robert Johnson',
    gender: 'male',
    date_of_birth: '1980-11-21',
    phone: '555-123-4567',
    email: 'bob.johnson@example.com',
    address: '789 Pine Rd, Springfield, IL 62703',
    meta: { 
      registration_date: '2024-01-10',
      emergency_contact: 'Linda Johnson - 555-123-4568',
      insurance_provider: 'United Health'
    }
  },
  {
    id: '4',
    name: 'Alice Brown',
    age: '35',
    contact: '444-567-8901',
    patient_id: 4,
    full_name: 'Alice Brown',
    gender: 'female',
    date_of_birth: '1989-05-12',
    phone: '444-567-8901',
    email: 'alice.brown@example.com',
    address: '321 Cedar Ln, Springfield, IL 62704',
    meta: { 
      registration_date: '2024-01-12',
      emergency_contact: 'Michael Brown - 444-567-8902',
      insurance_provider: 'Aetna Health'
    }
  },
  {
    id: '5',
    name: 'David Wilson',
    age: '28',
    contact: '777-888-9999',
    patient_id: 5,
    full_name: 'David Michael Wilson',
    gender: 'male',
    date_of_birth: '1996-08-30',
    phone: '777-888-9999',
    email: 'david.wilson@example.com',
    address: '567 Maple Dr, Springfield, IL 62705',
    meta: { 
      registration_date: '2024-01-18',
      emergency_contact: 'Sarah Wilson - 777-888-9998',
      insurance_provider: 'Blue Cross Blue Shield'
    }
  }
];

const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Wilson',
    specialty: 'Cardiology',
    contact: '111-222-3333',
    doctor_id: 1,
    full_name: 'Dr. Andrew Wilson',
    gender: 'male',
    phone: '111-222-3333',
    email: 'andrew.wilson@clinic.com',
    hire_date: '2015-03-01',
    meta: { 
      license_number: 'MD12345',
      specialization_board: 'American Board of Cardiology',
      years_experience: 15,
      education: 'MD from Harvard Medical School'
    }
  },
  {
    id: '2',
    name: 'Dr. House',
    specialty: 'Internal Medicine',
    contact: '222-333-4444',
    doctor_id: 2,
    full_name: 'Dr. Gregory House',
    gender: 'male',
    phone: '222-333-4444',
    email: 'greg.house@clinic.com',
    hire_date: '2010-06-12',
    meta: { 
      license_number: 'MD23456',
      specialization_board: 'American Board of Internal Medicine',
      years_experience: 20,
      education: 'MD from Johns Hopkins University'
    }
  },
  {
    id: '3',
    name: 'Dr. Grey',
    specialty: 'Surgery',
    contact: '333-444-5555',
    doctor_id: 3,
    full_name: 'Dr. Meredith Grey',
    gender: 'female',
    phone: '333-444-5555',
    email: 'meredith.grey@clinic.com',
    hire_date: '2018-09-03',
    meta: { 
      license_number: 'MD34567',
      specialization_board: 'American Board of Surgery',
      years_experience: 8,
      education: 'MD from University of Washington'
    }
  },
  {
    id: '4',
    name: 'Dr. Shepherd',
    specialty: 'Neurology',
    contact: '444-555-6666',
    doctor_id: 4,
    full_name: 'Dr. Derek Shepherd',
    gender: 'male',
    phone: '444-555-6666',
    email: 'derek.shepherd@clinic.com',
    hire_date: '2012-01-20',
    meta: { 
      license_number: 'MD45678',
      specialization_board: 'American Board of Neurology',
      years_experience: 18,
      education: 'MD from Columbia University'
    }
  },
  {
    id: '5',
    name: 'Dr. Torres',
    specialty: 'Orthopedics',
    contact: '555-666-7777',
    doctor_id: 5,
    full_name: 'Dr. Callie Torres',
    gender: 'female',
    phone: '555-666-7777',
    email: 'callie.torres@clinic.com',
    hire_date: '2016-11-15',
    meta: { 
      license_number: 'MD56789',
      specialization_board: 'American Board of Orthopedic Surgery',
      years_experience: 12,
      education: 'MD from Stanford University'
    }
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
    record_id: 1,
    patient_id: 1,
    doctor_id: 1,
    clinical_findings: 'Patient presents with elevated BP and glucose levels. No acute distress.',
    allergies: 'Penicillin, Shellfish',
    medical_conditions: 'Hypertension, Type 2 Diabetes Mellitus',
    current_meds_json: {
      current_medications: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'daily' },
        { name: 'Metformin', dosage: '500mg', frequency: 'twice daily' }
      ]
    },
    created_at: '2024-01-15T10:30:00Z',
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
    record_id: 2,
    patient_id: 2,
    doctor_id: 2,
    clinical_findings: 'Patient presents with cough and mild throat irritation. No fever or significant congestion.',
    allergies: 'None known',
    medical_conditions: 'No significant past medical history',
    current_meds_json: {
      current_medications: []
    },
    created_at: '2024-01-16T14:45:00Z',
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
  },
  {
    id: '3',
    patientId: '3',
    doctorId: '3',
    appointmentId: '3',
    recordDate: '2024-01-17',
    record_id: 3,
    patient_id: 3,
    doctor_id: 3,
    clinical_findings: 'Pre-operative assessment for planned surgery. Patient stable with normal vital signs.',
    allergies: 'Latex, Codeine',
    medical_conditions: 'History of appendectomy, otherwise healthy',
    current_meds_json: {
      current_medications: [
        { name: 'Multivitamin', dosage: '1 tablet', frequency: 'daily' }
      ]
    },
    created_at: '2024-01-17T09:30:00Z',
    diagnosis: {
      primary: 'Pre-operative assessment',
      icd10Code: 'Z01.818',
      severity: 'mild',
      confidence: 'confirmed'
    },
    findings: [
      {
        id: '5',
        type: 'vital-sign',
        title: 'Blood Pressure',
        description: 'Normal blood pressure reading',
        value: '120/80',
        unit: 'mmHg',
        normalRange: '120/80 mmHg',
        severity: 'low',
        recordedDate: '2024-01-17T09:15:00Z',
        recordedBy: '3'
      }
    ],
    treatment: {
      prescribed: false,
      recommendations: [
        'Clear liquids only after midnight before surgery',
        'Arrive 2 hours before scheduled procedure',
        'Bring list of all medications'
      ]
    },
    followUp: {
      required: true,
      scheduledDate: '2024-01-24',
      instructions: 'Post-operative follow-up'
    },
    status: 'finalized',
    createdDate: '2024-01-17T09:45:00Z',
    lastUpdated: '2024-01-17T09:45:00Z'
  },
  {
    id: '4',
    patientId: '4',
    doctorId: '4',
    recordDate: '2024-01-18',
    record_id: 4,
    patient_id: 4,
    doctor_id: 4,
    clinical_findings: 'Patient reports intermittent headaches and mild dizziness. Neurological exam shows no focal deficits.',
    allergies: 'Aspirin',
    medical_conditions: 'Migraine headaches, anxiety',
    current_meds_json: {
      current_medications: [
        { name: 'Sumatriptan', dosage: '50mg', frequency: 'as needed for migraine' },
        { name: 'Sertraline', dosage: '25mg', frequency: 'daily' }
      ]
    },
    created_at: '2024-01-18T11:30:00Z',
    diagnosis: {
      primary: 'Migraine without aura',
      secondary: ['Anxiety disorder'],
      icd10Code: 'G43.009',
      severity: 'moderate',
      confidence: 'confirmed'
    },
    findings: [
      {
        id: '6',
        type: 'symptom',
        title: 'Headache',
        description: 'Throbbing headache, primarily left-sided, duration 4-6 hours',
        severity: 'medium',
        recordedDate: '2024-01-18T11:15:00Z',
        recordedBy: '4'
      },
      {
        id: '7',
        type: 'observation',
        title: 'Neurological Exam',
        description: 'Cranial nerves II-XII intact, no focal motor or sensory deficits',
        severity: 'low',
        recordedDate: '2024-01-18T11:20:00Z',
        recordedBy: '4'
      }
    ],
    treatment: {
      prescribed: true,
      medications: [
        {
          name: 'Propranolol',
          dosage: '40mg',
          frequency: 'Twice daily',
          duration: '3 months',
          instructions: 'Take with food for migraine prevention'
        }
      ],
      recommendations: [
        'Keep headache diary',
        'Identify and avoid triggers',
        'Regular sleep schedule',
        'Stress management techniques'
      ]
    },
    followUp: {
      required: true,
      scheduledDate: '2024-02-18',
      instructions: 'Follow-up for migraine management and medication review'
    },
    status: 'finalized',
    createdDate: '2024-01-18T11:45:00Z',
    lastUpdated: '2024-01-18T11:45:00Z'
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
 