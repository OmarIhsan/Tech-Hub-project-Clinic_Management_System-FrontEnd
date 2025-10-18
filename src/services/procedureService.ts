import api from '../config/axios';
import { Procedure } from '../types';

interface CreateProcedureData {
  patient_id: number;
  doctor_id: number;
  procedure_name: string;
  procedure_date: string;
  cost: number;
  notes?: string;
}

interface UpdateProcedureData {
  patient_id?: number;
  doctor_id?: number;
  procedure_name?: string;
  procedure_date?: string;
  cost?: number;
  notes?: string;
}

export const procedureService = {
  getAll: async (params?: { offset?: number; limit?: number }): Promise<{ data: Procedure[] }> => {
    try {
      const response = await api.get('/procedures', { params });
      // Handle both direct array and wrapped response
      const data = response.data.data || response.data;
      return { data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('Error fetching procedures:', error);
      throw new Error('Failed to fetch procedures');
    }
  },

  getById: async (id: string | number): Promise<{ data: Procedure }> => {
    try {
      const response = await api.get(`/procedures/${id}`);
      // Handle both direct object and wrapped response
      return { data: response.data.data || response.data };
    } catch (error) {
      console.error('Error fetching procedure:', error);
      throw error;
    }
  },

  create: async (procedureData: CreateProcedureData): Promise<{ data: Procedure }> => {
    try {
      const response = await api.post('/procedures', procedureData);
      // Handle both direct object and wrapped response
      return { data: response.data.data || response.data };
    } catch (error) {
      console.error('Error creating procedure:', error);
      throw new Error('Failed to create procedure');
    }
  },

  update: async (id: string | number, procedureData: UpdateProcedureData): Promise<{ data: Procedure }> => {
    try {
      const response = await api.put(`/procedures/${id}`, procedureData);
      // Handle both direct object and wrapped response
      return { data: response.data.data || response.data };
    } catch (error) {
      console.error('Error updating procedure:', error);
      throw error;
    }
  },

  delete: async (id: string | number): Promise<void> => {
    try {
      await api.delete(`/procedures/${id}`);
    } catch (error) {
      console.error('Error deleting procedure:', error);
      throw error;
    }
  },
};

export default procedureService;
