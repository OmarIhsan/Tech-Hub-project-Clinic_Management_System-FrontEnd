export enum StaffRole {
  OWNER = 'owner',
  DOCTOR = 'doctor',
  STAFF = 'staff',
}

export interface Patient {
  patient_id: number;
  full_name: string;
  gender: string;
  phone: string;
  email?: string;
  address?: string;
  date_of_birth: string;
  blood_group?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Doctor {
  doctor_id: number;
  staff_id?: number;
  full_name: string;
  gender?: string;
  phone: string;
  email: string;
  hire_date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Staff {
  staff_id: number;
  email: string;
  full_name: string;
  phone: string;
  role: StaffRole;
  hire_date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClinicalDocument {
  document_id: number;
  patient: {
    patient_id: number;
    full_name: string;
  };
  uploadedByStaff: {
    staff_id: number;
    full_name: string;
  };
  document_type: string;
  file_path: string;
  upload_date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientImage {
  image_id: number;
  patient: {
    patient_id: number;
    full_name: string;
  };
  uploadedByStaff: {
    staff_id: number;
    full_name: string;
  };
  image_type: string;
  file_path: string;
  upload_date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Procedure {
  procedure_id: number;
  patient?: {
    patient_id: number;
    full_name?: string;
  };
  doctor?: {
    doctor_id: number;
    full_name?: string;
  };
  patient_id?: number;
  doctor_id?: number;
  procedure_name: string;
  procedure_date: string;
  cost: number;
  notes?: string;
  appointment_id?: number;
  plan_id?: number;
  procedure_notes?: string;
  performed_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Expense {
  expense_id: number;
  recordedByStaff: {
    staff_id: number;
    full_name: string;
  };
  expense_date: string;
  amount: number;
  category: string;
  description?: string;
  reason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OtherIncome {
  income_id: number;
  recordedByStaff: {
    staff_id: number;
    full_name: string;
  };
  income_date: string;
  amount: number;
  source: string;
  description?: string;
  patient_id?: number;
  staff_id?: number;
  createdAt?: string;
  updatedAt?: string;
}


export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  patient: {
    patient_id: number;
    full_name: string;
    email?: string;
    phone?: string;
  };
  doctor: {
    doctor_id: number;
    full_name: string;
    email?: string;
  };
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  createdAt?: string;
  updatedAt?: string;
}

export interface TreatmentPlan {
  plan_id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id?: number;
  treatment_description?: string;
  diagnosis?: string;
  diagnosis_summary?: string;
  prescription?: string;
  plan_details?: string;
  start_date?: string;
  expected_end_date?: string;
  end_date?: string;
  status: 'draft' | 'active' | 'ongoing' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicalRecord {
  record_id: number;
  patient: {
    patient_id: number;
    full_name: string;
  };
  doctor: {
    doctor_id: number;
    full_name: string;
  };
  diagnosis?: string | { primary?: string; icd10Code?: string; severity?: string };
  prescription?: string;
  visit_date?: string;
  clinical_findings?: string;
  treatment?: string;
  allergies?: string;
  createdAt?: string;
  updatedAt?: string;
}