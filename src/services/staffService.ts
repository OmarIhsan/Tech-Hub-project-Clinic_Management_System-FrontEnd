import api from '../config/axios';
import type { AxiosError } from 'axios';
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
  const resp = response.data;
  const data = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
  return { data: Array.isArray(data) ? (data as Staff[]) : [] };
    } catch (error) {
      console.error('Error fetching staff:', error);
      const err = error as AxiosError | unknown;
      if (err && typeof err === 'object' && 'response' in err && (err as AxiosError).response?.status === 403) {
        // Forbidden - return empty list so UI stays stable; caller can show permission message if desired
        return { data: [] };
      }
      throw new Error('Failed to fetch staff');
    }
  },

  getById: async (id: string): Promise<{ data: Staff }> => {
    try {
  const response = await api.get(`/staff/${id}`);
  const resp = response.data;
  const data = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
  return { data: data as Staff };
    } catch (error) {
      console.error('Error fetching staff member:', error);
      throw error;
    }
  },

  create: async (staffData: CreateStaffData): Promise<{ data: Staff }> => {
    try {
  const response = await api.post('/staff', staffData);
  const resp = response.data;
  const data = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
  return { data: data as Staff };
    } catch (error) {
      console.error('Error creating staff member:', error);
      throw new Error('Failed to create staff member');
    }
  },

  update: async (id: string, staffData: UpdateStaffData): Promise<{ data: Staff }> => {
    try {
  const response = await api.put(`/staff/${id}`, staffData);
  const resp = response.data;
  const data = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
  return { data: data as Staff };
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
