import api from '../config/axios';
import { Staff } from '../types';

interface CreateStaffData {
  name: string;
  email: string;
  phone: string;
  role: string;
  hireDate: string;
}

interface UpdateStaffData {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  hireDate?: string;
}

export const staffService = {
  getAll: async (params?: { offset?: number; limit?: number; role?: string }): Promise<{ data: Staff[] }> => {
    try {
      const response = await api.get('/staff', { params });
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw new Error('Failed to fetch staff');
    }
  },

  getById: async (id: string): Promise<{ data: Staff }> => {
    try {
      const response = await api.get(`/staff/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching staff member:', error);
      throw error;
    }
  },

  create: async (staffData: CreateStaffData): Promise<{ data: Staff }> => {
    try {
      const response = await api.post('/staff', staffData);
      return { data: response.data };
    } catch (error) {
      console.error('Error creating staff member:', error);
      throw new Error('Failed to create staff member');
    }
  },

  update: async (id: string, staffData: UpdateStaffData): Promise<{ data: Staff }> => {
    try {
      const response = await api.put(`/staff/${id}`, staffData);
      return { data: response.data };
    } catch (error) {
      console.error('Error updating staff member:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/staff/${id}`);
    } catch (error) {
      console.error('Error deleting staff member:', error);
      throw error;
    }
  },
};

export default staffService;
