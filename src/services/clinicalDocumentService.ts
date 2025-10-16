import api from '../config/axios';
import { ClinicalDocument } from '../types';

interface CreateClinicalDocumentData {
  patientId: string;
  title: string;
  documentType: string;
  uploadedAt?: string;
  filePath?: string;
  notes?: string;
}

interface UpdateClinicalDocumentData {
  title?: string;
  documentType?: string;
  notes?: string;
}

export const clinicalDocumentService = {
  getAll: async (params?: { patientId?: string; offset?: number; limit?: number }): Promise<{ data: ClinicalDocument[] }> => {
    try {
      const response = await api.get('/clinical-documents', { params });
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching clinical documents:', error);
      throw new Error('Failed to fetch clinical documents');
    }
  },

  getById: async (id: string): Promise<{ data: ClinicalDocument }> => {
    try {
      const response = await api.get(`/clinical-documents/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching clinical document:', error);
      throw error;
    }
  },

  getByPatientId: async (patientId: string): Promise<{ data: ClinicalDocument[] }> => {
    try {
      const response = await api.get('/clinical-documents', { params: { patientId } });
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching patient clinical documents:', error);
      throw new Error('Failed to fetch patient clinical documents');
    }
  },

  create: async (documentData: CreateClinicalDocumentData): Promise<{ data: ClinicalDocument }> => {
    try {
      const response = await api.post('/clinical-documents', documentData);
      return { data: response.data };
    } catch (error) {
      console.error('Error creating clinical document:', error);
      throw new Error('Failed to create clinical document');
    }
  },

  upload: async (file: File, documentData: Omit<CreateClinicalDocumentData, 'filePath'>): Promise<{ data: ClinicalDocument }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patientId', documentData.patientId);
      formData.append('title', documentData.title);
      formData.append('documentType', documentData.documentType);
      if (documentData.uploadedAt) {
        formData.append('uploadedAt', documentData.uploadedAt);
      }
      if (documentData.notes) {
        formData.append('notes', documentData.notes);
      }

      const response = await api.post('/clinical-documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { data: response.data };
    } catch (error) {
      console.error('Error uploading clinical document:', error);
      throw new Error('Failed to upload clinical document');
    }
  },

  update: async (id: string, documentData: UpdateClinicalDocumentData): Promise<{ data: ClinicalDocument }> => {
    try {
      const response = await api.put(`/clinical-documents/${id}`, documentData);
      return { data: response.data };
    } catch (error) {
      console.error('Error updating clinical document:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/clinical-documents/${id}`);
    } catch (error) {
      console.error('Error deleting clinical document:', error);
      throw error;
    }
  },
};

export default clinicalDocumentService;
