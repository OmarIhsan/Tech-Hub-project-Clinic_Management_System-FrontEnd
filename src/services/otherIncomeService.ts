import api from '../config/axios';
import { OtherIncome } from '../types';

interface CreateOtherIncomeData {
  amount: number;
  source: string;
  income_date: string;
  staff_id?: number;
  patient_id?: number;
  description?: string;
}

interface UpdateOtherIncomeData {
  amount?: number;
  source?: string;
  income_date?: string;
  staff_id?: number;
  patient_id?: number;
  description?: string;
}

export const otherIncomeService = {
  getAll: async (params?: { offset?: number; limit?: number }): Promise<{ data: OtherIncome[] }> => {
    try {
  const response = await api.get('/other-incomes', { params });
  const resp = response.data;
  const data = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
  return { data: Array.isArray(data) ? (data as OtherIncome[]) : [] };
    } catch (error) {
      console.error('Error fetching other incomes:', error);
      throw new Error('Failed to fetch other incomes');
    }
  },

  getById: async (id: string): Promise<{ data: OtherIncome }> => {
    try {
  const response = await api.get(`/other-incomes/${id}`);
  const resp = response.data;
  const data = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
  return { data: data as OtherIncome };
    } catch (error) {
      console.error('Error fetching other income:', error);
      throw error;
    }
  },

  create: async (incomeData: CreateOtherIncomeData): Promise<{ data: OtherIncome }> => {
    try {
  const response = await api.post('/other-incomes', incomeData);
  const resp = response.data;
  const data = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
  return { data: data as OtherIncome };
    } catch (error) {
      console.error('Error creating other income:', error);
      throw error;
    }
  },

  update: async (id: string, incomeData: UpdateOtherIncomeData): Promise<{ data: OtherIncome }> => {
    try {
  const response = await api.put(`/other-incomes/${id}`, incomeData);
  const resp = response.data;
  const data = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
  return { data: data as OtherIncome };
    } catch (error) {
      console.error('Error updating other income:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/other-incomes/${id}`);
    } catch (error) {
      console.error('Error deleting other income:', error);
      throw error;
    }
  },
};

export default otherIncomeService;
