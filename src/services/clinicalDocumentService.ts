import { ClinicalDocument } from '../types';

interface CreateClinicalDocumentData {
  patient_id: number;
  appointment_id?: number;
  document_type: string;
  consent_version?: string;
  file_path: string;
}

interface UpdateClinicalDocumentData {
  document_type?: string;
  consent_version?: string;
  file_path?: string;
}

const mockClinicalDocuments: ClinicalDocument[] = [
  {
    id: '1',
    document_id: 1,
    patient_id: 1,
    appointment_id: 1,
    document_type: 'consent_form',
    consent_version: 'v2.1',
    file_path: '/documents/patient_1/consent_form_2024_01_15.pdf'
  },
  {
    id: '2',
    document_id: 2,
    patient_id: 1,
    appointment_id: 1,
    document_type: 'case_sheet',
    file_path: '/documents/patient_1/case_sheet_2024_01_15.pdf'
  },
  {
    id: '3',
    document_id: 3,
    patient_id: 2,
    appointment_id: 2,
    document_type: 'lab_report',
    file_path: '/documents/patient_2/lab_report_2024_01_16.pdf'
  },
  {
    id: '4',
    document_id: 4,
    patient_id: 3,
    document_type: 'consent_form',
    consent_version: 'v2.1',
    file_path: '/documents/patient_3/consent_form_2024_01_17.pdf'
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const clinicalDocumentService = {
  getAll: async (): Promise<{ data: ClinicalDocument[] }> => {
    try {
      await delay(500);
      return { data: mockClinicalDocuments };
    } catch (error) {
      console.error('Error fetching clinical documents:', error);
      throw new Error('Failed to fetch clinical documents');
    }
  },

  getById: async (id: string): Promise<{ data: ClinicalDocument }> => {
    try {
      await delay(300);
      const document = mockClinicalDocuments.find(d => d.id === id);
      if (!document) {
        throw new Error('Clinical document not found');
      }
      return { data: document };
    } catch (error) {
      console.error('Error fetching clinical document:', error);
      throw error;
    }
  },

  getByPatientId: async (patientId: number): Promise<{ data: ClinicalDocument[] }> => {
    try {
      await delay(400);
      const documents = mockClinicalDocuments.filter(d => d.patient_id === patientId);
      return { data: documents };
    } catch (error) {
      console.error('Error fetching patient documents:', error);
      throw new Error('Failed to fetch patient documents');
    }
  },

  getByAppointmentId: async (appointmentId: number): Promise<{ data: ClinicalDocument[] }> => {
    try {
      await delay(400);
      const documents = mockClinicalDocuments.filter(d => d.appointment_id === appointmentId);
      return { data: documents };
    } catch (error) {
      console.error('Error fetching appointment documents:', error);
      throw new Error('Failed to fetch appointment documents');
    }
  },

  getByDocumentType: async (documentType: string): Promise<{ data: ClinicalDocument[] }> => {
    try {
      await delay(400);
      const documents = mockClinicalDocuments.filter(d => d.document_type === documentType);
      return { data: documents };
    } catch (error) {
      console.error('Error fetching documents by type:', error);
      throw new Error('Failed to fetch documents by type');
    }
  },

  create: async (documentData: CreateClinicalDocumentData): Promise<{ data: ClinicalDocument }> => {
    try {
      await delay(800);
      const newDocument: ClinicalDocument = {
        ...documentData,
        id: Date.now().toString(),
        document_id: mockClinicalDocuments.length + 1,
      };
      mockClinicalDocuments.push(newDocument);
      return { data: newDocument };
    } catch (error) {
      console.error('Error creating clinical document:', error);
      throw new Error('Failed to create clinical document');
    }
  },

  update: async (id: string, documentData: UpdateClinicalDocumentData): Promise<{ data: ClinicalDocument }> => {
    try {
      await delay(800);
      const index = mockClinicalDocuments.findIndex(d => d.id === id);
      if (index === -1) {
        throw new Error('Clinical document not found');
      }
      mockClinicalDocuments[index] = { ...mockClinicalDocuments[index], ...documentData };
      return { data: mockClinicalDocuments[index] };
    } catch (error) {
      console.error('Error updating clinical document:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await delay(500);
      const index = mockClinicalDocuments.findIndex(d => d.id === id);
      if (index === -1) {
        throw new Error('Clinical document not found');
      }
      mockClinicalDocuments.splice(index, 1);
    } catch (error) {
      console.error('Error deleting clinical document:', error);
      throw error;
    }
  }
};

export default clinicalDocumentService;