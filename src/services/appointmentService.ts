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
  }): Promise<{ data: Appointment[]; count?: number }> => {
    try {
  const response = await api.get('/appointment', { params });
  const resp = response.data as unknown;
      // Support shapes like:
      // { data: [...] }
      // { data: { data: [...], count } }
      // { data: { data: { data: [...] } } }
      let data: unknown = [];
      if (Array.isArray(resp)) data = resp;
      else if (resp && typeof resp === 'object') {
        const obj = resp as Record<string, unknown>;
        if (Array.isArray(obj.data)) data = obj.data;
        else if (obj.data && typeof obj.data === 'object') {
          const d1 = obj.data as Record<string, unknown>;
          if (Array.isArray(d1.data)) data = d1.data;
          else if (d1.data && typeof d1.data === 'object') {
            const d2 = d1.data as Record<string, unknown>;
            if (Array.isArray(d2.data)) data = d2.data;
            else data = d1.data ?? obj.data;
          } else data = obj.data ?? resp;
        } else data = resp;
      }
      // attempt to extract count if present in known envelope shapes
      let count: number | undefined;
      if (resp && typeof resp === 'object') {
        const obj = resp as Record<string, unknown>;
        if (typeof obj.count === 'number') count = obj.count as number;
        if (obj.data && typeof obj.data === 'object') {
          const d1 = obj.data as Record<string, unknown>;
          if (typeof d1.count === 'number') count = d1.count as number;
          if (d1.data && typeof d1.data === 'object') {
            const d2 = d1.data as Record<string, unknown>;
            if (typeof d2.count === 'number') count = d2.count as number;
          }
        }
      }

      return { data: Array.isArray(data) ? (data as Appointment[]) : [], count };
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw new Error('Failed to fetch appointments');
    }
  },

  getById: async (id: number): Promise<{ data: Appointment }> => {
    try {
  const response = await api.get(`/appointment/${id}`);
  const resp = response.data;
  const data = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
  return { data: data as Appointment };
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  },

  create: async (appointmentData: CreateAppointmentData): Promise<{ data: Appointment }> => {
    try {
  const response = await api.post('/appointment', appointmentData);
  const resp = response.data;
  const data = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
  return { data: data as Appointment };
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new Error('Failed to create appointment');
    }
  },

  update: async (id: number, appointmentData: UpdateAppointmentData): Promise<{ data: Appointment }> => {
    try {
  const response = await api.put(`/appointment/${id}`, appointmentData);
  const resp = response.data;
  const data = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
  return { data: data as Appointment };
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
      const resp = response.data;
      const data = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
      return { data: data as Appointment };
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
      const resp = response.data;
      const data = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
      return { data: data as Appointment };
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