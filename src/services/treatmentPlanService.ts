import api from '../config/axios';
import { TreatmentPlan } from '../types';

interface CreateTreatmentPlanData {
  patientId: number;
  doctorId: number;
  treatment_description: string;
  start_date: string;
  end_date?: string;
  status: 'ongoing' | 'completed' | 'cancelled';
}

interface UpdateTreatmentPlanData {
  treatment_description?: string;
  end_date?: string;
  status?: 'ongoing' | 'completed' | 'cancelled';
}

export const treatmentPlanService = {
  getAll: async (params?: { offset?: number; limit?: number }): Promise<{ data: TreatmentPlan[] }> => {
    try {
      const response = await api.get('/treatment-plans', { params });
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching treatment plans:', error);
      throw new Error('Failed to fetch treatment plans');
    }
  },

  getById: async (id: number): Promise<{ data: TreatmentPlan }> => {
    try {
      const response = await api.get(`/treatment-plans/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching treatment plan:', error);
      throw error;
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

  update: async (id: number, planData: UpdateTreatmentPlanData): Promise<{ data: TreatmentPlan }> => {
    try {
      const response = await api.put(`/treatment-plans/${id}`, planData);
      return { data: response.data };
    } catch (error) {
      console.error('Error updating treatment plan:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/treatment-plans/${id}`);
    } catch (error) {
      console.error('Error deleting treatment plan:', error);
      throw error;
    }
  },

  complete: async (id: number): Promise<{ data: TreatmentPlan }> => {
    try {
      const response = await api.put(`/treatment-plans/${id}`, {
        status: 'completed'
      });
      return { data: response.data };
    } catch (error) {
      console.error('Error completing treatment plan:', error);
      throw error;
    }
  },

  cancel: async (id: number): Promise<{ data: TreatmentPlan }> => {
    try {
      const response = await api.put(`/treatment-plans/${id}`, {
        status: 'cancelled'
      });
      return { data: response.data };
    } catch (error) {
      console.error('Error cancelling treatment plan:', error);
      throw error;
    }
  },
};

export default treatmentPlanService;
