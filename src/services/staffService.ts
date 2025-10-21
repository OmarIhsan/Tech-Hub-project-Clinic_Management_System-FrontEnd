import api from '../config/axios';
import type { AxiosError } from 'axios';
import { Staff } from '../types';

export interface StaffCreatePayload {
  full_name: string;
  phone: string;
  email: string;
  hire_date: string;
  role: string;
  password: string;
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
      // Expect resp = { statusCode, data: [...] }
      const staffArr = Array.isArray(resp?.data) ? resp.data : [];
      const normalize = (obj: unknown): Staff => {
        const o = obj as Record<string, unknown>;
        return {
          staff_id: Number(o.staff_id),
          email: String(o.email ?? ''),
          full_name: String(o.full_name ?? ''),
          phone: String(o.phone ?? ''),
          role: String(o.role ?? '') as Staff['role'],
          hire_date: o.hire_date ? String(o.hire_date) : undefined,
          createdAt: o.created_at ? String(o.created_at) : undefined,
          updatedAt: o.updated_at ? String(o.updated_at) : undefined,
        };
      };
      return { data: staffArr.map(normalize) };
    } catch (error) {
      console.error('Error fetching staff:', error);
      const err = error as AxiosError | unknown;
      if (err && typeof err === 'object' && 'response' in err && (err as AxiosError).response?.status === 403) {
        return { data: [] };
      }
      throw new Error('Failed to fetch staff');
    }
  },

  getById: async (id: string): Promise<{ data: Staff }> => {
    try {
      const response = await api.get(`/staff/${id}`);
      const resp = response.data;
      const staffArr = Array.isArray(resp?.data) ? resp.data : [];
      const obj = staffArr.length > 0 ? staffArr[0] : {};
      const staff: Staff = {
        staff_id: Number(obj.staff_id),
        email: String(obj.email ?? ''),
        full_name: String(obj.full_name ?? ''),
        phone: String(obj.phone ?? ''),
        role: obj.role as Staff['role'],
        hire_date: obj.hire_date ?? undefined,
        createdAt: obj.created_at ?? undefined,
        updatedAt: obj.updated_at ?? undefined,
      };
      return { data: staff };
    } catch (error) {
      console.error('Error fetching staff member:', error);
      throw error;
    }
  },

  create: async (staffData: StaffCreatePayload): Promise<{ data: Staff }> => {
    try {
  const response = await api.post('/staff', staffData);
  const resp = response.data;
  const data = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
  const s = data as unknown;
  const obj = s as { [k: string]: unknown };
  return { data: {
    staff_id: Number(obj['staff_id']) as number,
    email: String(obj['email'] ?? ''),
    full_name: String(obj['full_name'] ?? ''),
    phone: String(obj['phone'] ?? ''),
    role: (obj['role'] as unknown) as Staff['role'],
    hire_date: (obj['hire_date'] ?? obj['hireDate']) as string | undefined,
    createdAt: (obj['created_at'] ?? obj['createdAt']) as string | undefined,
    updatedAt: (obj['updated_at'] ?? obj['updatedAt']) as string | undefined,
  } };
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
  const s = data as unknown;
  const obj = s as { [k: string]: unknown };
  return { data: {
    staff_id: Number(obj['staff_id']) as number,
    email: String(obj['email'] ?? ''),
    full_name: String(obj['full_name'] ?? ''),
    phone: String(obj['phone'] ?? ''),
    role: (obj['role'] as unknown) as Staff['role'],
    hire_date: (obj['hire_date'] ?? obj['hireDate']) as string | undefined,
    createdAt: (obj['created_at'] ?? obj['createdAt']) as string | undefined,
    updatedAt: (obj['updated_at'] ?? obj['updatedAt']) as string | undefined,
  } };
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
