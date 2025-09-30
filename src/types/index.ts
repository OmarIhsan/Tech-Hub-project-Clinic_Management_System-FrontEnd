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