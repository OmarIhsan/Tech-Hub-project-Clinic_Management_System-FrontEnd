export interface Patient {
  id: string;
  name: string;
  age: string;
  contact: string;
  // Schema-aligned fields
  patient_id?: number;
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
  // Schema-aligned fields
  doctor_id?: number;
  full_name?: string;
  gender?: string;
  phone?: string;
  email?: string;
  hire_date?: string;
  meta?: Record<string, unknown>;
}

export interface Staff {
  id: string;
  staff_id: number;
  full_name: string;
  phone?: string;
  email?: string;
  hire_date?: string;
}

export interface ClinicalDocument {
  id: string;
  document_id: number;
  patient_id: number;
  appointment_id?: number;
  document_type: string;
  consent_version?: string;
  file_path: string;
}

export interface PatientImage {
  id: string;
  image_id: number;
  patient_id: number;
  image_type: string;
  file_path: string;
  uploaded_by_staff_id: number;
  notes?: string;
  uploaded_at: string;
}

export interface Procedure {
  id: string;
  procedure_id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id?: number;
  plan_id?: number;
  procedure_name: string;
  procedure_notes?: string;
  performed_at: string;
}

export interface Expense {
  id: string;
  expense_id: number;
  category: string;
  amount: number;
  expense_date: string;
  reason?: string;
  staff_id: number;
}

export interface OtherIncome {
  id: string;
  income_id: number;
  source: string;
  amount: number;
  income_date: string;
  staff_id?: number;
  patient_id?: number;
}


export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; 
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  // Schema-aligned fields
  appointment_id?: number;
  patient_id?: number;
  doctor_id?: number;
  appointment_time?: string;
  meta?: Record<string, unknown>;
}

export interface TreatmentStep {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
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
  // Schema-aligned fields
  plan_id?: number;
  patient_id?: number;
  doctor_id?: number;
  appointment_id?: number;
  diagnosis_summary?: string;
  prescription_file_path?: string;
  prescription_file_type?: string;
  plan_details?: string;
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
  // Schema-aligned fields
  record_id?: number;
  patient_id?: number;
  doctor_id?: number;
  clinical_findings?: string;
  current_meds_json?: Record<string, unknown> | unknown;
  allergies?: string;
  medical_conditions?: string;
  created_at?: string;
  meta?: Record<string, unknown>;
}