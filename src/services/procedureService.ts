import { Procedure } from '../types';

interface CreateProcedureData {
  patient_id: number;
  doctor_id: number;
  appointment_id?: number;
  plan_id?: number;
  procedure_name: string;
  procedure_notes?: string;
  performed_at?: string;
}

interface UpdateProcedureData {
  procedure_name?: string;
  procedure_notes?: string;
  performed_at?: string;
}

const mockProcedures: Procedure[] = [
  {
    id: '1',
    procedure_id: 1,
    patient_id: 1,
    doctor_id: 1,
    appointment_id: 1,
    plan_id: 1,
    procedure_name: 'Cardiac Stress Test',
    procedure_notes: 'Exercise stress test to evaluate cardiac function',
    performed_at: '2024-01-15T11:30:00Z'
  },
  {
    id: '2',
    procedure_id: 2,
    patient_id: 1,
    doctor_id: 1,
    appointment_id: 1,
    plan_id: 1,
    procedure_name: 'ECG',
    procedure_notes: '12-lead electrocardiogram showing normal sinus rhythm',
    performed_at: '2024-01-15T10:45:00Z'
  },
  {
    id: '3',
    procedure_id: 3,
    patient_id: 2,
    doctor_id: 2,
    appointment_id: 2,
    plan_id: 2,
    procedure_name: 'Blood Glucose Test',
    procedure_notes: 'Fasting blood glucose measurement',
    performed_at: '2024-01-16T14:30:00Z'
  },
  {
    id: '4',
    procedure_id: 4,
    patient_id: 3,
    doctor_id: 3,
    appointment_id: 3,
    procedure_name: 'Pre-operative Assessment',
    procedure_notes: 'Complete pre-surgical evaluation and clearance',
    performed_at: '2024-01-17T09:30:00Z'
  },
  {
    id: '5',
    procedure_id: 5,
    patient_id: 4,
    doctor_id: 1,
    procedure_name: 'Neurological Examination',
    procedure_notes: 'Comprehensive neurological assessment',
    performed_at: '2024-01-18T11:15:00Z'
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const procedureService = {
  getAll: async (): Promise<{ data: Procedure[] }> => {
    try {
      await delay(500);
      return { data: mockProcedures };
    } catch (error) {
      console.error('Error fetching procedures:', error);
      throw new Error('Failed to fetch procedures');
    }
  },

  getById: async (id: string): Promise<{ data: Procedure }> => {
    try {
      await delay(300);
      const procedure = mockProcedures.find(p => p.id === id);
      if (!procedure) {
        throw new Error('Procedure not found');
      }
      return { data: procedure };
    } catch (error) {
      console.error('Error fetching procedure:', error);
      throw error;
    }
  },

  getByPatientId: async (patientId: number): Promise<{ data: Procedure[] }> => {
    try {
      await delay(400);
      const procedures = mockProcedures.filter(p => p.patient_id === patientId);
      return { data: procedures };
    } catch (error) {
      console.error('Error fetching patient procedures:', error);
      throw new Error('Failed to fetch patient procedures');
    }
  },

  getByDoctorId: async (doctorId: number): Promise<{ data: Procedure[] }> => {
    try {
      await delay(400);
      const procedures = mockProcedures.filter(p => p.doctor_id === doctorId);
      return { data: procedures };
    } catch (error) {
      console.error('Error fetching doctor procedures:', error);
      throw new Error('Failed to fetch doctor procedures');
    }
  },

  getByAppointmentId: async (appointmentId: number): Promise<{ data: Procedure[] }> => {
    try {
      await delay(400);
      const procedures = mockProcedures.filter(p => p.appointment_id === appointmentId);
      return { data: procedures };
    } catch (error) {
      console.error('Error fetching appointment procedures:', error);
      throw new Error('Failed to fetch appointment procedures');
    }
  },

  getByTreatmentPlanId: async (planId: number): Promise<{ data: Procedure[] }> => {
    try {
      await delay(400);
      const procedures = mockProcedures.filter(p => p.plan_id === planId);
      return { data: procedures };
    } catch (error) {
      console.error('Error fetching treatment plan procedures:', error);
      throw new Error('Failed to fetch treatment plan procedures');
    }
  },

  create: async (procedureData: CreateProcedureData): Promise<{ data: Procedure }> => {
    try {
      await delay(800);
      const newProcedure: Procedure = {
        ...procedureData,
        id: Date.now().toString(),
        procedure_id: mockProcedures.length + 1,
        performed_at: procedureData.performed_at || new Date().toISOString(),
      };
      mockProcedures.push(newProcedure);
      return { data: newProcedure };
    } catch (error) {
      console.error('Error creating procedure:', error);
      throw new Error('Failed to create procedure');
    }
  },

  update: async (id: string, procedureData: UpdateProcedureData): Promise<{ data: Procedure }> => {
    try {
      await delay(800);
      const index = mockProcedures.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Procedure not found');
      }
      mockProcedures[index] = { ...mockProcedures[index], ...procedureData };
      return { data: mockProcedures[index] };
    } catch (error) {
      console.error('Error updating procedure:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await delay(500);
      const index = mockProcedures.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Procedure not found');
      }
      mockProcedures.splice(index, 1);
    } catch (error) {
      console.error('Error deleting procedure:', error);
      throw error;
    }
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<{ data: Procedure[] }> => {
    try {
      await delay(400);
      const start = new Date(startDate);
      const end = new Date(endDate);
      const procedures = mockProcedures.filter(p => {
        const performedDate = new Date(p.performed_at);
        return performedDate >= start && performedDate <= end;
      });
      return { data: procedures };
    } catch (error) {
      console.error('Error fetching procedures by date range:', error);
      throw new Error('Failed to fetch procedures for date range');
    }
  }
};

export default procedureService;