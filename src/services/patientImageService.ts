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
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching patient images:', error);
      throw new Error('Failed to fetch patient images');
    }
  },

  getById: async (id: string): Promise<{ data: PatientImage }> => {
    try {
      const response = await api.get(`/patient-images/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching patient image:', error);
      throw error;
    }
  },

  getByPatientId: async (patientId: string): Promise<{ data: PatientImage[] }> => {
    try {
      const response = await api.get('/patient-images', { params: { patientId } });
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching patient images:', error);
      throw new Error('Failed to fetch patient images');
    }
  },

  create: async (imageData: CreatePatientImageData): Promise<{ data: PatientImage }> => {
    try {
      const response = await api.post('/patient-images', imageData);
      return { data: response.data };
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

      const response = await api.post('/patient-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { data: response.data };
    } catch (error) {
      console.error('Error uploading patient image:', error);
      throw new Error('Failed to upload patient image');
    }
  },

  update: async (id: string, imageData: UpdatePatientImageData): Promise<{ data: PatientImage }> => {
    try {
      const response = await api.put(`/patient-images/${id}`, imageData);
      return { data: response.data };
    } catch (error) {
      console.error('Error updating patient image:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/patient-images/${id}`);
    } catch (error) {
      console.error('Error deleting patient image:', error);
      throw error;
    }
  },
};

export default patientImageService;
