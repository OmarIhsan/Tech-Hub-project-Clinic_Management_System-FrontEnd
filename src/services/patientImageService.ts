import api from '../config/axios';
import { PatientImage } from '../types';

interface CreatePatientImageData {
  patientId: string;
  imageType: string;
  uploadedAt?: string;
  imagePath?: string;
  notes?: string;
}

interface UpdatePatientImageData {
  imageType?: string;
  notes?: string;
}

export const patientImageService = {
  getAll: async (params?: { patientId?: string; offset?: number; limit?: number }): Promise<{ data: PatientImage[] }> => {
    try {
      const response = await api.get('/patient-images', { params });
      // Handle both direct array and wrapped response
      const data = response.data.data || response.data;
      return { data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('Error fetching patient images:', error);
      throw new Error('Failed to fetch patient images');
    }
  },

  getById: async (id: string | number): Promise<{ data: PatientImage }> => {
    try {
      const response = await api.get(`/patient-images/${id}`);
      // Handle both direct object and wrapped response
      return { data: response.data.data || response.data };
    } catch (error) {
      console.error('Error fetching patient image:', error);
      throw error;
    }
  },

  getByPatientId: async (patientId: string | number): Promise<{ data: PatientImage[] }> => {
    try {
      const response = await api.get('/patient-images', { params: { patientId } });
      // Handle both direct array and wrapped response
      const data = response.data.data || response.data;
      return { data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('Error fetching patient images:', error);
      throw new Error('Failed to fetch patient images');
    }
  },

  create: async (imageData: CreatePatientImageData): Promise<{ data: PatientImage }> => {
    try {
      const response = await api.post('/patient-images', imageData);
      // Handle both direct object and wrapped response
      return { data: response.data.data || response.data };
    } catch (error) {
      console.error('Error creating patient image:', error);
      throw new Error('Failed to create patient image');
    }
  },

  upload: async (file: File, imageData: Omit<CreatePatientImageData, 'imagePath'>): Promise<{ data: PatientImage }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patientId', imageData.patientId);
      formData.append('imageType', imageData.imageType);
      if (imageData.uploadedAt) {
        formData.append('uploadedAt', imageData.uploadedAt);
      }
      if (imageData.notes) {
        formData.append('notes', imageData.notes);
      }

      const response = await api.post('/patient-images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Handle both direct object and wrapped response
      return { data: response.data.data || response.data };
    } catch (error) {
      console.error('Error uploading patient image:', error);
      throw error;
    }
  },

  update: async (id: string | number, imageData: UpdatePatientImageData): Promise<{ data: PatientImage }> => {
    try {
      const response = await api.put(`/patient-images/${id}`, imageData);
      // Handle both direct object and wrapped response
      return { data: response.data.data || response.data };
    } catch (error) {
      console.error('Error updating patient image:', error);
      throw error;
    }
  },

  delete: async (id: string | number): Promise<void> => {
    try {
      await api.delete(`/patient-images/${id}`);
    } catch (error) {
      console.error('Error deleting patient image:', error);
      throw error;
    }
  },
};

export default patientImageService;
