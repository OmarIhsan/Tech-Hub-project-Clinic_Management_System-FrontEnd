import api from '../config/axios';
import { Procedure } from '../types';

interface CreateProcedureData {
  name: string;
  code?: string;
  duration?: number;
  cost?: number;
  scheduledAt?: string;
  relatedTreatmentPlanId?: number;  // Changed from treatmentPlanId to match API
}

interface UpdateProcedureData {
  name?: string;
  code?: string;
  duration?: number;
  cost?: number;
  scheduledAt?: string;
  relatedTreatmentPlanId?: number;  // Changed from treatmentPlanId to match API
}

export const procedureService = {
  getAll: async (params?: { offset?: number; limit?: number }): Promise<{ data: Procedure[] }> => {
    try {
      const response = await api.get('/procedures', { params });
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching procedures:', error);
      throw new Error('Failed to fetch procedures');
    }
  },

  getById: async (id: string): Promise<{ data: Procedure }> => {
    try {
      const response = await api.get(`/procedures/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching procedure:', error);
      throw error;
    }
  },

  create: async (procedureData: CreateProcedureData): Promise<{ data: Procedure }> => {
    try {
      const response = await api.post('/procedures', procedureData);
      return { data: response.data };
    } catch (error) {
      console.error('Error creating procedure:', error);
      throw new Error('Failed to create procedure');
    }
  },

  update: async (id: string, procedureData: UpdateProcedureData): Promise<{ data: Procedure }> => {
    try {
      const response = await api.put(`/procedures/${id}`, procedureData);
      return { data: response.data };
    } catch (error) {
      console.error('Error updating procedure:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/procedures/${id}`);
    } catch (error) {
      console.error('Error deleting procedure:', error);
      throw error;
    }
  },
};

export default procedureService;
