import api from '../config/axios';
import { TreatmentPlan, TreatmentStep } from '../types';

interface CreateTreatmentPlanData {
  patientId: string;
  doctorId: string;
  title: string;
  description: string;
  diagnosis: string;
  startDate: string;
  expectedEndDate: string;
    status: 'draft' | 'active' | 'completed' | 'cancelled' | 'on-hold';
    priority: 'low' | 'medium' | 'high' | 'urgent';
  steps: Omit<TreatmentStep, 'id'>[];
  notes?: string;
}

interface UpdateTreatmentPlanData {
  title?: string;
  description?: string;
  diagnosis?: string;
  expectedEndDate?: string;
    status?: 'draft' | 'active' | 'completed' | 'cancelled' | 'on-hold';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
}

interface CreateTreatmentStepData {
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedDoctorId: string;
  notes?: string;
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

  getByDoctorId: async (doctorId: string): Promise<{ data: TreatmentPlan[] }> => {
    try {
      const response = await api.get('/treatment-plans', { params: { doctorId } });
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching doctor treatment plans:', error);
      throw new Error('Failed to fetch doctor treatment plans');
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

  getByPriority: async (priority: 'low' | 'medium' | 'high'): Promise<{ data: TreatmentPlan[] }> => {
    try {
      const response = await api.get('/treatment-plans', { params: { priority } });
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching treatment plans by priority:', error);
      throw new Error('Failed to fetch treatment plans by priority');
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
  },

  addStep: async (planId: string, stepData: CreateTreatmentStepData): Promise<{ data: TreatmentStep }> => {
    try {
      const response = await api.post(`/treatment-plans/${planId}/steps`, stepData);
      return { data: response.data };
    } catch (error) {
      console.error('Error adding treatment step:', error);
      throw error;
    }
  },

  updateStep: async (planId: string, stepId: string, stepData: Partial<TreatmentStep>): Promise<{ data: TreatmentStep }> => {
    try {
      const response = await api.put(`/treatment-plans/${planId}/steps/${stepId}`, stepData);
      return { data: response.data };
    } catch (error) {
      console.error('Error updating treatment step:', error);
      throw error;
    }
  },

  updateStepStatus: async (planId: string, stepId: string, status: 'pending' | 'in-progress' | 'completed' | 'cancelled'): Promise<{ data: TreatmentStep }> => {
    try {
      const response = await api.put(`/treatment-plans/${planId}/steps/${stepId}`, { status });
      return { data: response.data };
    } catch (error) {
      console.error('Error updating step status:', error);
      throw error;
    }
  },

  deleteStep: async (planId: string, stepId: string): Promise<void> => {
    try {
      await api.delete(`/treatment-plans/${planId}/steps/${stepId}`);
    } catch (error) {
      console.error('Error deleting treatment step:', error);
      throw error;
    }
  },

  complete: async (id: string, notes?: string): Promise<{ data: TreatmentPlan }> => {
    try {
      const response = await api.put(`/treatment-plans/${id}`, {
        status: 'completed',
        ...(notes && { notes })
      });
      return { data: response.data };
    } catch (error) {
      console.error('Error completing treatment plan:', error);
      throw error;
    }
  },

  cancel: async (id: string, reason?: string): Promise<{ data: TreatmentPlan }> => {
    try {
      const response = await api.put(`/treatment-plans/${id}`, {
        status: 'cancelled',
        notes: reason ? `Cancelled: ${reason}` : 'Treatment plan cancelled'
      });
      return { data: response.data };
    } catch (error) {
      console.error('Error cancelling treatment plan:', error);
      throw error;
    }
  },

  getProgress: async (id: string): Promise<{ data: { completed: number; total: number; percentage: number } }> => {
    try {
      const plan = await api.get(`/treatment-plans/${id}`);
      const total = plan.data.steps?.length || 0;
      const completed = plan.data.steps?.filter((s: TreatmentStep) => s.status === 'completed').length || 0;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { data: { completed, total, percentage } };
    } catch (error) {
      console.error('Error fetching treatment plan progress:', error);
      throw error;
    }
  }
};

export default treatmentPlanService;
