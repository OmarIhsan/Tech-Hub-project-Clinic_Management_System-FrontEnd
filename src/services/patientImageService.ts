import { PatientImage } from '../types';

interface CreatePatientImageData {
  patient_id: number;
  image_type: string;
  file_path: string;
  uploaded_by_staff_id: number;
  notes?: string;
}

interface UpdatePatientImageData {
  image_type?: string;
  file_path?: string;
  notes?: string;
}

const mockPatientImages: PatientImage[] = [
  {
    id: '1',
    image_id: 1,
    patient_id: 1,
    image_type: 'x_ray',
    file_path: '/images/patient_1/xray_chest_2024_01_15.jpg',
    uploaded_by_staff_id: 1,
    notes: 'Chest X-ray for respiratory symptoms',
    uploaded_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    image_id: 2,
    patient_id: 1,
    image_type: 'profile_photo',
    file_path: '/images/patient_1/profile_2024_01_15.jpg',
    uploaded_by_staff_id: 2,
    notes: 'Patient identification photo',
    uploaded_at: '2024-01-15T09:00:00Z'
  },
  {
    id: '3',
    image_id: 3,
    patient_id: 2,
    image_type: 'ultrasound',
    file_path: '/images/patient_2/ultrasound_abdomen_2024_01_16.jpg',
    uploaded_by_staff_id: 1,
    notes: 'Abdominal ultrasound scan',
    uploaded_at: '2024-01-16T14:45:00Z'
  },
  {
    id: '4',
    image_id: 4,
    patient_id: 3,
    image_type: 'mri',
    file_path: '/images/patient_3/mri_brain_2024_01_17.jpg',
    uploaded_by_staff_id: 3,
    notes: 'Brain MRI for neurological assessment',
    uploaded_at: '2024-01-17T11:20:00Z'
  },
  {
    id: '5',
    image_id: 5,
    patient_id: 4,
    image_type: 'ct_scan',
    file_path: '/images/patient_4/ct_chest_2024_01_18.jpg',
    uploaded_by_staff_id: 2,
    notes: 'Chest CT scan for detailed examination',
    uploaded_at: '2024-01-18T13:15:00Z'
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const patientImageService = {
  getAll: async (): Promise<{ data: PatientImage[] }> => {
    try {
      await delay(500);
      return { data: mockPatientImages };
    } catch (error) {
      console.error('Error fetching patient images:', error);
      throw new Error('Failed to fetch patient images');
    }
  },

  getById: async (id: string): Promise<{ data: PatientImage }> => {
    try {
      await delay(300);
      const image = mockPatientImages.find(i => i.id === id);
      if (!image) {
        throw new Error('Patient image not found');
      }
      return { data: image };
    } catch (error) {
      console.error('Error fetching patient image:', error);
      throw error;
    }
  },

  getByPatientId: async (patientId: number): Promise<{ data: PatientImage[] }> => {
    try {
      await delay(400);
      const images = mockPatientImages.filter(i => i.patient_id === patientId);
      return { data: images };
    } catch (error) {
      console.error('Error fetching patient images:', error);
      throw new Error('Failed to fetch patient images');
    }
  },

  getByImageType: async (imageType: string): Promise<{ data: PatientImage[] }> => {
    try {
      await delay(400);
      const images = mockPatientImages.filter(i => i.image_type === imageType);
      return { data: images };
    } catch (error) {
      console.error('Error fetching images by type:', error);
      throw new Error('Failed to fetch images by type');
    }
  },

  getByStaffId: async (staffId: number): Promise<{ data: PatientImage[] }> => {
    try {
      await delay(400);
      const images = mockPatientImages.filter(i => i.uploaded_by_staff_id === staffId);
      return { data: images };
    } catch (error) {
      console.error('Error fetching images by staff:', error);
      throw new Error('Failed to fetch images by staff');
    }
  },

  create: async (imageData: CreatePatientImageData): Promise<{ data: PatientImage }> => {
    try {
      await delay(800);
      const newImage: PatientImage = {
        ...imageData,
        id: Date.now().toString(),
        image_id: mockPatientImages.length + 1,
        uploaded_at: new Date().toISOString(),
      };
      mockPatientImages.push(newImage);
      return { data: newImage };
    } catch (error) {
      console.error('Error creating patient image:', error);
      throw new Error('Failed to create patient image');
    }
  },

  update: async (id: string, imageData: UpdatePatientImageData): Promise<{ data: PatientImage }> => {
    try {
      await delay(800);
      const index = mockPatientImages.findIndex(i => i.id === id);
      if (index === -1) {
        throw new Error('Patient image not found');
      }
      mockPatientImages[index] = { ...mockPatientImages[index], ...imageData };
      return { data: mockPatientImages[index] };
    } catch (error) {
      console.error('Error updating patient image:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await delay(500);
      const index = mockPatientImages.findIndex(i => i.id === id);
      if (index === -1) {
        throw new Error('Patient image not found');
      }
      mockPatientImages.splice(index, 1);
    } catch (error) {
      console.error('Error deleting patient image:', error);
      throw error;
    }
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<{ data: PatientImage[] }> => {
    try {
      await delay(400);
      const start = new Date(startDate);
      const end = new Date(endDate);
      const images = mockPatientImages.filter(i => {
        const uploadDate = new Date(i.uploaded_at);
        return uploadDate >= start && uploadDate <= end;
      });
      return { data: images };
    } catch (error) {
      console.error('Error fetching images by date range:', error);
      throw new Error('Failed to fetch images for date range');
    }
  }
};

export default patientImageService;