import api from '../config/axios';
import { Appointment } from '../types';

interface CreateAppointmentData {
  patient_id: number;
  doctor_id: number;
  appointment_time: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
}

interface UpdateAppointmentData {
  appointment_time?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
}

export const appointmentService = {
  getAll: async (params?: { 
    offset?: number; 
    limit?: number; 
  }): Promise<{ data: Appointment[] }> => {
    try {
      const response = await api.get('/appointment', { params });
      // Handle both direct array and wrapped response
      const data = response.data.data || response.data;
      return { data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw new Error('Failed to fetch appointments');
    }
  },

  getById: async (id: number): Promise<{ data: Appointment }> => {
    try {
      const response = await api.get(`/appointment/${id}`);
      // Handle both direct object and wrapped response
      return { data: response.data.data || response.data };
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  },

  create: async (appointmentData: CreateAppointmentData): Promise<{ data: Appointment }> => {
    try {
      const response = await api.post('/appointment', appointmentData);
      // Handle both direct object and wrapped response
      return { data: response.data.data || response.data };
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new Error('Failed to create appointment');
    }
  },

  update: async (id: number, appointmentData: UpdateAppointmentData): Promise<{ data: Appointment }> => {
    try {
      const response = await api.put(`/appointment/${id}`, appointmentData);
      // Handle both direct object and wrapped response
      return { data: response.data.data || response.data };
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  cancel: async (id: number): Promise<{ data: Appointment }> => {
    try {
      const response = await api.put(`/appointment/${id}`, {
        status: 'cancelled'
      });
      // Handle both direct object and wrapped response
      return { data: response.data.data || response.data };
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  },

  complete: async (id: number): Promise<{ data: Appointment }> => {
    try {
      const response = await api.put(`/appointment/${id}`, {
        status: 'completed'
      });
      // Handle both direct object and wrapped response
      return { data: response.data.data || response.data };
    } catch (error) {
      console.error('Error completing appointment:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/appointment/${id}`);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  },
};

export default appointmentService;