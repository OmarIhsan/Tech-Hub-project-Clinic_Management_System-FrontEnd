import api from '../config/axios';
import { Procedure } from '../types';

export interface CreateProcedureData {
  patient_id: number;
  doctor_id: number;
  procedure_name: string;
  procedure_date?: string;
  cost?: number;
  notes?: string;
  appointment_id?: number;
  plan_id?: number;
  procedure_notes?: string;
  performed_at?: string;
}

export interface UpdateProcedureData {
  patient_id?: number;
  doctor_id?: number;
  procedure_name?: string;
  procedure_date?: string;
  cost?: number;
  notes?: string;
  appointment_id?: number;
  plan_id?: number;
  procedure_notes?: string;
  performed_at?: string;
}

export const procedureService = {
  getAll: async (params?: { offset?: number; limit?: number }): Promise<{ data: Procedure[] }> => {
    try {
  const response = await api.get('/procedures', { params });
  const resp = response.data;
  let dataRaw: unknown = resp;
  while (dataRaw && typeof dataRaw === 'object' && 'data' in (dataRaw as Record<string, unknown>)) {
    dataRaw = (dataRaw as Record<string, unknown>).data;
  }
  const array = Array.isArray(dataRaw) ? (dataRaw as Procedure[]) : [];
  const normalized = array.map((p) => {
    const raw = p as unknown as Record<string, unknown>;
    const patientId = raw.patient_id as number | undefined;
    const doctorId = raw.doctor_id as number | undefined;
    return {
      ...p,
      patient: p.patient || (patientId ? { patient_id: patientId } : undefined),
      doctor: p.doctor || (doctorId ? { doctor_id: doctorId } : undefined),
    } as Procedure;
  });
  return { data: normalized };
    } catch (error) {
      console.error('Error fetching procedures:', error);
      throw new Error('Failed to fetch procedures');
    }
  },

  getById: async (id: string | number): Promise<{ data: Procedure }> => {
    try {
  const response = await api.get(`/procedures/${id}`);
  const resp = response.data;
  let dataRaw: unknown = resp;
  while (dataRaw && typeof dataRaw === 'object' && 'data' in (dataRaw as Record<string, unknown>)) {
    dataRaw = (dataRaw as Record<string, unknown>).data;
  }
  const p = dataRaw as Procedure;
  const raw = p as unknown as Record<string, unknown>;
  const patientId = raw.patient_id as number | undefined;
  const doctorId = raw.doctor_id as number | undefined;
  const normalized = {
    ...p,
    patient: p.patient || (patientId ? { patient_id: patientId } : undefined),
    doctor: p.doctor || (doctorId ? { doctor_id: doctorId } : undefined),
  } as Procedure;
  return { data: normalized };
    } catch (error) {
      console.error('Error fetching procedure:', error);
      throw error;
    }
  },

  create: async (procedureData: CreateProcedureData): Promise<{ data: Procedure }> => {
    try {
  const response = await api.post('/procedures', procedureData);
  const resp = response.data;
  const data = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
  return { data: data as Procedure };
    } catch (error) {
      console.error('Error creating procedure:', error);
      throw error;
    }
  },

  update: async (id: string | number, procedureData: UpdateProcedureData): Promise<{ data: Procedure }> => {
    try {
  const response = await api.put(`/procedures/${id}`, procedureData);
  const resp = response.data;
  const data = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
  return { data: data as Procedure };
    } catch (error) {
      console.error('Error updating procedure:', error);
      throw error;
    }
  },

  delete: async (id: string | number): Promise<void> => {
    try {
      await api.delete(`/procedures/${id}`);
    } catch (error) {
      console.error('Error deleting procedure:', error);
      throw error;
    }
  },
};

export default procedureService;
