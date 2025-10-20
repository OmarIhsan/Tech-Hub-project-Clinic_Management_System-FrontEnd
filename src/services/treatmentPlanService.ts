import api from '../config/axios';
import { TreatmentPlan } from '../types';


interface CreateTreatmentPlanData {
  patient_id: number;
  doctor_id: number;
  appointment_id?: number;
  diagnosis_summary: string;
  // backend may return null for prescription; allow null or string
  prescription?: string | null;
  plan_details?: string;
  status?: 'draft' | 'active' | 'ongoing' | 'completed' | 'cancelled' | string; // be permissive
}

interface UpdateTreatmentPlanData {
  treatment_description?: string;
  end_date?: string;
  status?: 'draft' | 'active' | 'ongoing' | 'completed' | 'cancelled' | string;
}

// Helper: unwrap backend envelope which sometimes nests payload under data.data (lists)
const extractPayload = (resp: unknown): unknown => {
  if (!resp) return resp;
  if (typeof resp !== 'object' || resp === null) return resp;
  const envelope = resp as Record<string, unknown>;
  if ('data' in envelope) {
    const inner = envelope.data as unknown;
    if (inner && typeof inner === 'object') {
      const innerObj = inner as Record<string, unknown>;
      if ('data' in innerObj) {
        return innerObj.data as unknown;
      }
      return inner;
    }
    return inner;
  }
  return resp;
};

export const treatmentPlanService = {
  getAll: async (params?: { offset?: number; limit?: number }): Promise<{ data: TreatmentPlan[]; count?: number }> => {
    try {
      const response = await api.get('/treatment-plans', { params });
      const resp = response.data;
      const data = extractPayload(resp);
      // data may be an array or an object containing data + count
      if (Array.isArray(data)) return { data: data as TreatmentPlan[] };
      if (data && typeof data === 'object') {
        const obj = data as Record<string, unknown>;
        const arr = obj.data;
        const count = typeof obj.count === 'number' ? (obj.count as number) : undefined;
        if (Array.isArray(arr)) return { data: arr as TreatmentPlan[], count };
      }
      return { data: [] };
    } catch (error) {
      console.error('Error fetching treatment plans:', error);
      throw new Error('Failed to fetch treatment plans');
    }
  },

  getById: async (id: number): Promise<{ data: TreatmentPlan }> => {
    try {
      const response = await api.get(`/treatment-plans/${id}`);
      const resp = response.data;
      const data = extractPayload(resp);
      // If payload is array return first element
      if (Array.isArray(data)) return { data: data[0] as TreatmentPlan };
      return { data: data as TreatmentPlan };
    } catch (error) {
      console.error('Error fetching treatment plan:', error);
      throw error;
    }
  },

  create: async (planData: CreateTreatmentPlanData): Promise<{ data: TreatmentPlan }> => {
    try {
      const response = await api.post('/treatment-plans', planData);
      const resp = response.data;
      const data = extractPayload(resp);
      if (Array.isArray(data)) return { data: data[0] as TreatmentPlan };
      return { data: data as TreatmentPlan };
    } catch (error) {
      // Preserve the original error (axios error) so callers can read response.data
      console.error('Error creating treatment plan:', error);
      throw error;
    }
  },

  update: async (id: number, planData: UpdateTreatmentPlanData): Promise<{ data: TreatmentPlan }> => {
    try {
      const response = await api.put(`/treatment-plans/${id}`, planData);
      const resp = response.data;
      const data = extractPayload(resp);
      if (Array.isArray(data)) return { data: data[0] as TreatmentPlan };
      return { data: data as TreatmentPlan };
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
      const resp = response.data;
      const data = extractPayload(resp);
      if (Array.isArray(data)) return { data: data[0] as TreatmentPlan };
      return { data: data as TreatmentPlan };
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
      const resp = response.data;
      const data = extractPayload(resp);
      if (Array.isArray(data)) return { data: data[0] as TreatmentPlan };
      return { data: data as TreatmentPlan };
    } catch (error) {
      console.error('Error cancelling treatment plan:', error);
      throw error;
    }
  },
};

export default treatmentPlanService;
