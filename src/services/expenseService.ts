import api from '../config/axios';
import { Expense } from '../types';

interface CreateExpenseData {
  amount: number;
  category: string;
  date: string;
  description?: string;
}

interface UpdateExpenseData {
  amount?: number;
  category?: string;
  date?: string;
  description?: string;
}

export const expenseService = {
  getAll: async (params?: { offset?: number; limit?: number; dateFrom?: string; dateTo?: string; category?: string }): Promise<{ data: Expense[] }> => {
    try {
      const response = await api.get('/expenses', { params });
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw new Error('Failed to fetch expenses');
    }
  },

  getById: async (id: string): Promise<{ data: Expense }> => {
    try {
      const response = await api.get(`/expenses/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching expense:', error);
      throw error;
    }
  },

  create: async (expenseData: CreateExpenseData): Promise<{ data: Expense }> => {
    try {
      const response = await api.post('/expenses', expenseData);
      return { data: response.data };
    } catch (error) {
      console.error('Error creating expense:', error);
      throw new Error('Failed to create expense');
    }
  },

  update: async (id: string, expenseData: UpdateExpenseData): Promise<{ data: Expense }> => {
    try {
      const response = await api.put(`/expenses/${id}`, expenseData);
      return { data: response.data };
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/expenses/${id}`);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },
};

export default expenseService;
