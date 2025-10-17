import api from '../config/axios';
import { TreatmentPlan } from '../types';

// Simplified to match API documentation
interface CreateTreatmentPlanData {
  patientId: string;
  summary: string;  // Changed from complex structure
  prescriptions?: string;  // Added from API doc
  status?: 'draft' | 'active' | 'completed' | 'cancelled' | 'on-hold';
}

interface UpdateTreatmentPlanData {
  summary?: string;  // Changed from complex structure
  prescriptions?: string;  // Added from API doc
  status?: 'draft' | 'active' | 'completed' | 'cancelled' | 'on-hold';
}


export const treatmentPlanService = {
  getAll: async (params?: { patientId?: string; status?: string; offset?: number; limit?: number }): Promise<{ data: TreatmentPlan[] }> => {
    try {
      const response = await api.get('/treatment-plans', { params });
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching treatment plans:', error);
      throw new Error('Failed to fetch treatment plans');
    }
  },

  getById: async (id: string): Promise<{ data: TreatmentPlan }> => {
    try {
      const response = await api.get(`/treatment-plans/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching treatment plan:', error);
      throw error;
    }
  },

  getByPatientId: async (patientId: string): Promise<{ data: TreatmentPlan[] }> => {
    try {
      const response = await api.get('/treatment-plans', { params: { patientId } });
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching patient treatment plans:', error);
      throw new Error('Failed to fetch patient treatment plans');
    }
  },

  getByStatus: async (status: 'active' | 'completed' | 'cancelled' | 'on-hold'): Promise<{ data: TreatmentPlan[] }> => {
    try {
      const response = await api.get('/treatment-plans', { params: { status } });
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching treatment plans by status:', error);
      throw new Error('Failed to fetch treatment plans by status');
    }
  },

  create: async (planData: CreateTreatmentPlanData): Promise<{ data: TreatmentPlan }> => {
    try {
      const response = await api.post('/treatment-plans', planData);
      return { data: response.data };
    } catch (error) {
      console.error('Error creating treatment plan:', error);
      throw new Error('Failed to create treatment plan');
    }
  },

  update: async (id: string, planData: UpdateTreatmentPlanData): Promise<{ data: TreatmentPlan }> => {
    try {
      const response = await api.put(`/treatment-plans/${id}`, planData);
      return { data: response.data };
    } catch (error) {
      console.error('Error updating treatment plan:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/treatment-plans/${id}`);
    } catch (error) {
      console.error('Error deleting treatment plan:', error);
      throw error;
    }
  }
};

export default treatmentPlanService;
