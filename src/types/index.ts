export interface Patient {
  id: string;
  name: string;
  age: string;
  contact: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  contact: string;
}


export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; 
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
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
}