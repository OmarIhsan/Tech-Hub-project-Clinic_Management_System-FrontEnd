
import { Appointment } from '../types';

interface CreateAppointmentData {
  patientId: string;
  doctorId: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface UpdateAppointmentData {
  date?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}


const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    date: '2024-01-15T10:00',
    meta: {
      appointmentId: '1',
      appointment_time: '2024-01-15T10:00',
      appointmentTime: '2024-01-15T10:00'
    },
    status: 'scheduled',
    notes: 'Regular checkup'
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '2',
    date: '2024-01-16T14:30',
    meta: {
      appointmentId: '2',
      appointment_time: '2024-01-16T14:30',
      appointmentTime: '2024-01-16T14:30'
    },
    status: 'completed',
    notes: 'Follow-up consultation'
  },
  {
    id: '3',
    patientId: '3',
    doctorId: '3',
    date: '2024-01-17T09:15',
    meta: {
      appointmentId: '3',
      appointment_time: '2024-01-17T09:15',
      appointmentTime: '2024-01-17T09:15'
    },
    status: 'scheduled',
    notes: 'Pre-surgery consultation'
  },
  {
    id: '4',
    patientId: '4',
    doctorId: '1',
    date: '2024-01-18T11:00',
    meta: {
      appointmentId: '4',
      appointment_time: '2024-01-18T11:00',
      appointmentTime: '2024-01-18T11:00'
    },
    status: 'cancelled',
    notes: 'Patient requested cancellation'
  },
];


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const appointmentService = {
  
  getAll: async (): Promise<{ data: Appointment[] }> => {
    try {
      await delay(500);
      
      
      return { data: mockAppointments };
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw new Error('Failed to fetch appointments');
    }
  },

  
  getById: async (id: string): Promise<{ data: Appointment }> => {
    try {
      await delay(300);
      
      
      const appointment = mockAppointments.find(a => a.id === id);
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      return { data: appointment };
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  },

  
  getByPatientId: async (patientId: string): Promise<{ data: Appointment[] }> => {
    try {
      await delay(400);
      
      
      const appointments = mockAppointments.filter(a => a.patientId === patientId);
      return { data: appointments };
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
      throw new Error('Failed to fetch patient appointments');
    }
  },

  
  getByDoctorId: async (doctorId: string): Promise<{ data: Appointment[] }> => {
    try {
      await delay(400);
      
      
      const appointments = mockAppointments.filter(a => a.doctorId === doctorId);
      return { data: appointments };
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      throw new Error('Failed to fetch doctor appointments');
    }
  },

  
  getByStatus: async (status: 'scheduled' | 'completed' | 'cancelled'): Promise<{ data: Appointment[] }> => {
    try {
      await delay(400);
      
      
      const appointments = mockAppointments.filter(a => a.status === status);
      return { data: appointments };
    } catch (error) {
      console.error('Error fetching appointments by status:', error);
      throw new Error('Failed to fetch appointments by status');
    }
  },

  
  create: async (appointmentData: CreateAppointmentData): Promise<{ data: Appointment }> => {
    try {
      await delay(800);
      
      
      const newAppointment: Appointment = {
        ...appointmentData,
        id: Date.now().toString(),
      };
      mockAppointments.push(newAppointment);
      return { data: newAppointment };
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new Error('Failed to create appointment');
    }
  },

  
  update: async (id: string, appointmentData: UpdateAppointmentData): Promise<{ data: Appointment }> => {
    try {
      await delay(800);
      
      
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index === -1) {
        throw new Error('Appointment not found');
      }
      mockAppointments[index] = { ...mockAppointments[index], ...appointmentData };
      return { data: mockAppointments[index] };
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  
  cancel: async (id: string, reason?: string): Promise<{ data: Appointment }> => {
    try {
      await delay(500);
      
      
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index === -1) {
        throw new Error('Appointment not found');
      }
      mockAppointments[index] = {
        ...mockAppointments[index],
        status: 'cancelled',
        notes: reason ? `Cancelled: ${reason}` : 'Appointment cancelled'
      };
      return { data: mockAppointments[index] };
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  },

  
  complete: async (id: string, notes?: string): Promise<{ data: Appointment }> => {
    try {
      await delay(500);
      
      
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index === -1) {
        throw new Error('Appointment not found');
      }
      mockAppointments[index] = {
        ...mockAppointments[index],
        status: 'completed',
        notes: notes || mockAppointments[index].notes
      };
      return { data: mockAppointments[index] };
    } catch (error) {
      console.error('Error completing appointment:', error);
      throw error;
    }
  },

  
  delete: async (id: string): Promise<void> => {
    try {
      await delay(500);
      
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index === -1) {
        throw new Error('Appointment not found');
      }
      mockAppointments.splice(index, 1);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  },

  
  getByDateRange: async (startDate: string, endDate: string): Promise<{ data: Appointment[] }> => {
    try {
      await delay(400);
      
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      const appointments = mockAppointments.filter(a => {
        const appointmentDate = new Date(a.date);
        return appointmentDate >= start && appointmentDate <= end;
      });
      return { data: appointments };
    } catch (error) {
      console.error('Error fetching appointments by date range:', error);
      throw new Error('Failed to fetch appointments for date range');
    }
  },

  
  reschedule: async (id: string, newDate: string, reason?: string): Promise<{ data: Appointment }> => {
    try {
      await delay(600);
      
      
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index === -1) {
        throw new Error('Appointment not found');
      }
      const oldDate = mockAppointments[index].date;
      mockAppointments[index] = {
        ...mockAppointments[index],
        date: newDate,
        notes: `Rescheduled from ${oldDate}${reason ? ` - ${reason}` : ''}`
      };
      return { data: mockAppointments[index] };
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw error;
    }
  }
};


export default appointmentService;