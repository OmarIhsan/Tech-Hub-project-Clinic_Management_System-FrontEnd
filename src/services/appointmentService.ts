
import api from '../config/axios';
import { Appointment } from '../types';

interface CreateAppointmentData {
  patientId: string;
  doctorId: string;
  datetime: string;  // Changed from appointmentDate to match API
  reason?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface UpdateAppointmentData {
  datetime?: string;  // Changed from appointmentDate to match API
  reason?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export const appointmentService = {
  getAll: async (params?: { 
    offset?: number; 
    limit?: number; 
    dateFrom?: string; 
    dateTo?: string; 
    status?: string; 
    doctorId?: string; 
    patientId?: string;
  }): Promise<{ data: Appointment[] }> => {
    try {
      const response = await api.get('/appointments', { params });
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw new Error('Failed to fetch appointments');
    }
  },

  getById: async (id: string): Promise<{ data: Appointment }> => {
    try {
      const response = await api.get(`/appointments/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  },

  getByPatientId: async (patientId: string): Promise<{ data: Appointment[] }> => {
    try {
      const response = await api.get('/appointments', { params: { patientId } });
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
      throw new Error('Failed to fetch patient appointments');
    }
  },

  getByDoctorId: async (doctorId: string): Promise<{ data: Appointment[] }> => {
    try {
      const response = await api.get('/appointments', { params: { doctorId } });
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      throw new Error('Failed to fetch doctor appointments');
    }
  },

  getByStatus: async (status: 'scheduled' | 'completed' | 'cancelled'): Promise<{ data: Appointment[] }> => {
    try {
      const response = await api.get('/appointments', { params: { status } });
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching appointments by status:', error);
      throw new Error('Failed to fetch appointments by status');
    }
  },

  create: async (appointmentData: CreateAppointmentData): Promise<{ data: Appointment }> => {
    try {
      const response = await api.post('/appointments', appointmentData);
      return { data: response.data };
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new Error('Failed to create appointment');
    }
  },

  update: async (id: string, appointmentData: UpdateAppointmentData): Promise<{ data: Appointment }> => {
    try {
      const response = await api.put(`/appointments/${id}`, appointmentData);
      return { data: response.data };
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  cancel: async (id: string, reason?: string): Promise<{ data: Appointment }> => {
    try {
      const response = await api.put(`/appointments/${id}`, {
        status: 'cancelled',
        notes: reason ? `Cancelled: ${reason}` : 'Appointment cancelled'
      });
      return { data: response.data };
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  },

  complete: async (id: string, notes?: string): Promise<{ data: Appointment }> => {
    try {
      const response = await api.put(`/appointments/${id}`, {
        status: 'completed',
        ...(notes && { notes })
      });
      return { data: response.data };
    } catch (error) {
      console.error('Error completing appointment:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/appointments/${id}`);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<{ data: Appointment[] }> => {
    try {
      const response = await api.get('/appointments', { 
        params: { 
          dateFrom: startDate, 
          dateTo: endDate 
        } 
      });
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching appointments by date range:', error);
      throw new Error('Failed to fetch appointments for date range');
    }
  },

  reschedule: async (id: string, newDate: string, reason?: string): Promise<{ data: Appointment }> => {
    try {
      const response = await api.put(`/appointments/${id}`, {
        datetime: newDate,  // Changed from appointmentDate
        notes: reason ? `Rescheduled - ${reason}` : 'Appointment rescheduled'
      });
      return { data: response.data };
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw error;
    }
  }
};

export default appointmentService;