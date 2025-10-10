export interface Patient {
  id: string;
  name: string;
  age: string;
  contact: string;
  full_name?: string;
  gender?: string;
  date_of_birth?: string;
  phone?: string;
  email?: string;
  address?: string;
  meta?: Record<string, unknown>;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  contact: string;
  full_name?: string;
  gender?: string;
  phone?: string;
  email?: string;
  hire_date?: string;
  meta?: Record<string, unknown>;
}


export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; 
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  appointment_time?: string;
  appointment_id?: string;
  meta?: Record<string, unknown>;
}

export interface TreatmentStep {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedDoctorId?: string;
  notes?: string;
  completedDate?: string;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  doctorId: string;
  title: string;
  description: string;
  diagnosis: string;
  startDate: string;
  expectedEndDate: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  steps: TreatmentStep[];
  createdDate: string;
  lastUpdated: string;
  notes?: string;
  appointmentId?: string;
  prescription_file_path?: string;
  prescription_file_type?: string;
  created_at?: string;
  meta?: Record<string, unknown>;
}

export interface MedicalFinding {
  id: string;
  type: 'symptom' | 'observation' | 'test-result' | 'vital-sign';
  title: string;
  description: string;
  value?: string;
  unit?: string;
  normalRange?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  recordedDate: string;
  recordedBy: string; 
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  recordDate: string;
  diagnosis: {
    primary: string;
    secondary?: string[];
    icd10Code?: string;
    severity: 'mild' | 'moderate' | 'severe' | 'critical';
    confidence: 'suspected' | 'probable' | 'confirmed';
  };
  findings: MedicalFinding[];
  treatment: {
    prescribed: boolean;
    medications?: {
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions?: string;
    }[];
    procedures?: {
      name: string;
      description: string;
      scheduledDate?: string;
      status: 'planned' | 'completed' | 'cancelled';
    }[];
    recommendations?: string[];
  };
  followUp?: {
    required: boolean;
    scheduledDate?: string;
    instructions?: string;
  };
  attachments?: {
    id: string;
    filename: string;
    type: string;
    uploadDate: string;
    url: string;
  }[];
  status: 'draft' | 'finalized' | 'amended';
  createdDate: string;
  lastUpdated: string;
  notes?: string;
  current_meds_json?: Record<string, unknown> | unknown;
  allergies?: string;
  medical_conditions?: string;
  created_at?: string;
  meta?: Record<string, unknown>;
}