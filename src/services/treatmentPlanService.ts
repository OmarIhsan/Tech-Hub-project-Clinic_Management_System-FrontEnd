
import { TreatmentPlan, TreatmentStep } from '../types';

interface CreateTreatmentPlanData {
  patientId: string;
  doctorId: string;
  title: string;
  description: string;
  diagnosis: string;
  startDate: string;
  expectedEndDate: string;
  status: 'active' | 'completed' | 'cancelled' | 'on-hold';
  priority: 'low' | 'medium' | 'high';
  steps: Omit<TreatmentStep, 'id'>[];
  notes?: string;
}

interface UpdateTreatmentPlanData {
  title?: string;
  description?: string;
  diagnosis?: string;
  expectedEndDate?: string;
  status?: 'active' | 'completed' | 'cancelled' | 'on-hold';
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
}

interface CreateTreatmentStepData {
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedDoctorId: string;
  notes?: string;
}


const mockTreatmentPlans: TreatmentPlan[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    title: 'Cardiac Rehabilitation Program',
    description: 'Comprehensive cardiac rehabilitation program focusing on lifestyle changes and exercise',
    diagnosis: 'Post-myocardial infarction',
    startDate: '2024-01-15',
    expectedEndDate: '2024-04-15',
    status: 'active',
    priority: 'high',
  createdDate: '2024-01-10T10:00:00Z',
  lastUpdated: '2024-01-15T14:30:00Z',
  prescription_file_path: '/files/prescriptions/plan-1.pdf',
  prescription_file_type: 'application/pdf',
  appointmentId: '1',
  meta: { plan_id: 1 },
    steps: [
      {
        id: '1-1',
        title: 'Initial Assessment',
        description: 'Complete cardiac assessment and baseline measurements',
        dueDate: '2024-01-20',
        status: 'completed',
        assignedDoctorId: '1',
        completedDate: '2024-01-18T09:00:00Z',
        notes: 'Assessment completed successfully'
      },
      {
        id: '1-2',
        title: 'Exercise Program Phase 1',
        description: 'Low-intensity supervised exercise program',
        dueDate: '2024-02-15',
        status: 'in-progress',
        assignedDoctorId: '1',
        notes: 'Patient responding well to exercise'
      },
      {
        id: '1-3',
        title: 'Nutritional Counseling',
        description: 'Heart-healthy diet planning and education',
        dueDate: '2024-02-01',
        status: 'pending',
        assignedDoctorId: '2',
      }
    ],
    notes: 'Patient motivated and compliant with treatment'
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '2',
    title: 'Diabetes Management Plan',
    description: 'Comprehensive diabetes management including medication and lifestyle modifications',
    diagnosis: 'Type 2 Diabetes Mellitus',
    startDate: '2024-01-10',
    expectedEndDate: '2024-07-10',
    status: 'active',
    priority: 'medium',
  createdDate: '2024-01-08T08:00:00Z',
  lastUpdated: '2024-01-12T16:00:00Z',
  prescription_file_path: '/files/prescriptions/plan-2.pdf',
  prescription_file_type: 'application/pdf',
  appointmentId: '2',
  meta: { plan_id: 2 },
    steps: [
      {
        id: '2-1',
        title: 'Blood Sugar Monitoring Setup',
        description: 'Teach patient proper blood glucose monitoring techniques',
        dueDate: '2024-01-15',
        status: 'completed',
        assignedDoctorId: '2',
        completedDate: '2024-01-14T11:00:00Z'
      },
      {
        id: '2-2',
        title: 'Medication Adjustment',
        description: 'Optimize diabetes medication regimen',
        dueDate: '2024-02-10',
        status: 'in-progress',
        assignedDoctorId: '2'
      }
    ],
    notes: 'Patient needs regular follow-up for medication adjustments'
  }
];


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const treatmentPlanService = {
  
  getAll: async (): Promise<{ data: TreatmentPlan[] }> => {
    try {
      await delay(500);
      
      
      return { data: mockTreatmentPlans };
    } catch (error) {
      console.error('Error fetching treatment plans:', error);
      throw new Error('Failed to fetch treatment plans');
    }
  },

  
  getById: async (id: string): Promise<{ data: TreatmentPlan }> => {
    try {
      await delay(300);
      
      
      const plan = mockTreatmentPlans.find(p => p.id === id);
      if (!plan) {
        throw new Error('Treatment plan not found');
      }
      return { data: plan };
    } catch (error) {
      console.error('Error fetching treatment plan:', error);
      throw error;
    }
  },

  
  getByPatientId: async (patientId: string): Promise<{ data: TreatmentPlan[] }> => {
    try {
      await delay(400);
      
      
      const plans = mockTreatmentPlans.filter(p => p.patientId === patientId);
      return { data: plans };
    } catch (error) {
      console.error('Error fetching patient treatment plans:', error);
      throw new Error('Failed to fetch patient treatment plans');
    }
  },

  
  getByDoctorId: async (doctorId: string): Promise<{ data: TreatmentPlan[] }> => {
    try {
      await delay(400);
      
      
      const plans = mockTreatmentPlans.filter(p => p.doctorId === doctorId);
      return { data: plans };
    } catch (error) {
      console.error('Error fetching doctor treatment plans:', error);
      throw new Error('Failed to fetch doctor treatment plans');
    }
  },

  
  getByStatus: async (status: 'active' | 'completed' | 'cancelled' | 'on-hold'): Promise<{ data: TreatmentPlan[] }> => {
    try {
      await delay(400);
      
      
      const plans = mockTreatmentPlans.filter(p => p.status === status);
      return { data: plans };
    } catch (error) {
      console.error('Error fetching treatment plans by status:', error);
      throw new Error('Failed to fetch treatment plans by status');
    }
  },

  
  getByPriority: async (priority: 'low' | 'medium' | 'high'): Promise<{ data: TreatmentPlan[] }> => {
    try {
      await delay(400);
      
      
      const plans = mockTreatmentPlans.filter(p => p.priority === priority);
      return { data: plans };
    } catch (error) {
      console.error('Error fetching treatment plans by priority:', error);
      throw new Error('Failed to fetch treatment plans by priority');
    }
  },

  
  create: async (planData: CreateTreatmentPlanData): Promise<{ data: TreatmentPlan }> => {
    try {
      await delay(1000);
      
      
      const currentDate = new Date().toISOString();
      const newPlan: TreatmentPlan = {
        ...planData,
        id: Date.now().toString(),
        createdDate: currentDate,
        lastUpdated: currentDate,
        steps: planData.steps.map((step, index) => ({
          ...step,
          id: `${Date.now()}-${index}`,
        }))
      };
      mockTreatmentPlans.push(newPlan);
      return { data: newPlan };
    } catch (error) {
      console.error('Error creating treatment plan:', error);
      throw new Error('Failed to create treatment plan');
    }
  },

  
  update: async (id: string, planData: UpdateTreatmentPlanData): Promise<{ data: TreatmentPlan }> => {
    try {
      await delay(800);
      
      
      const index = mockTreatmentPlans.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Treatment plan not found');
      }
      mockTreatmentPlans[index] = {
        ...mockTreatmentPlans[index],
        ...planData,
        lastUpdated: new Date().toISOString()
      };
      return { data: mockTreatmentPlans[index] };
    } catch (error) {
      console.error('Error updating treatment plan:', error);
      throw error;
    }
  },

  
  delete: async (id: string): Promise<void> => {
    try {
      await delay(500);
      
      const index = mockTreatmentPlans.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Treatment plan not found');
      }
      mockTreatmentPlans.splice(index, 1);
    } catch (error) {
      console.error('Error deleting treatment plan:', error);
      throw error;
    }
  },

  
  addStep: async (planId: string, stepData: CreateTreatmentStepData): Promise<{ data: TreatmentStep }> => {
    try {
      await delay(600);
      
      
      const plan = mockTreatmentPlans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Treatment plan not found');
      }
      const newStep: TreatmentStep = {
        ...stepData,
        id: `${planId}-${Date.now()}`,
      };
      plan.steps.push(newStep);
      plan.lastUpdated = new Date().toISOString();
      return { data: newStep };
    } catch (error) {
      console.error('Error adding treatment step:', error);
      throw error;
    }
  },

  
  updateStep: async (planId: string, stepId: string, stepData: Partial<TreatmentStep>): Promise<{ data: TreatmentStep }> => {
    try {
      await delay(600);
      
      
      const plan = mockTreatmentPlans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Treatment plan not found');
      }
      const stepIndex = plan.steps.findIndex(s => s.id === stepId);
      if (stepIndex === -1) {
        throw new Error('Treatment step not found');
      }
      plan.steps[stepIndex] = { ...plan.steps[stepIndex], ...stepData };
      plan.lastUpdated = new Date().toISOString();
      return { data: plan.steps[stepIndex] };
    } catch (error) {
      console.error('Error updating treatment step:', error);
      throw error;
    }
  },

  
  updateStepStatus: async (planId: string, stepId: string, status: 'pending' | 'in-progress' | 'completed' | 'cancelled'): Promise<{ data: TreatmentStep }> => {
    try {
      await delay(300);
      
      
      const plan = mockTreatmentPlans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Treatment plan not found');
      }
      const step = plan.steps.find(s => s.id === stepId);
      if (!step) {
        throw new Error('Treatment step not found');
      }
      step.status = status;
      if (status === 'completed') {
        step.completedDate = new Date().toISOString();
      }
      plan.lastUpdated = new Date().toISOString();
      return { data: step };
    } catch (error) {
      console.error('Error updating step status:', error);
      throw error;
    }
  },

  
  deleteStep: async (planId: string, stepId: string): Promise<void> => {
    try {
      await delay(500);
      
      const plan = mockTreatmentPlans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Treatment plan not found');
      }
      const stepIndex = plan.steps.findIndex(s => s.id === stepId);
      if (stepIndex === -1) {
        throw new Error('Treatment step not found');
      }
      plan.steps.splice(stepIndex, 1);
      plan.lastUpdated = new Date().toISOString();
    } catch (error) {
      console.error('Error deleting treatment step:', error);
      throw error;
    }
  },

  
  complete: async (id: string, notes?: string): Promise<{ data: TreatmentPlan }> => {
    try {
      await delay(600);
      
      
      const index = mockTreatmentPlans.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Treatment plan not found');
      }
      const currentDate = new Date().toISOString();
      mockTreatmentPlans[index] = {
        ...mockTreatmentPlans[index],
        status: 'completed',
        lastUpdated: currentDate,
        notes: notes || mockTreatmentPlans[index].notes
      };
      return { data: mockTreatmentPlans[index] };
    } catch (error) {
      console.error('Error completing treatment plan:', error);
      throw error;
    }
  },

  
  cancel: async (id: string, reason?: string): Promise<{ data: TreatmentPlan }> => {
    try {
      await delay(600);
      
      
      const index = mockTreatmentPlans.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Treatment plan not found');
      }
      const currentDate = new Date().toISOString();
      mockTreatmentPlans[index] = {
        ...mockTreatmentPlans[index],
        status: 'cancelled',
        lastUpdated: currentDate,
        notes: reason ? `Cancelled: ${reason}` : 'Treatment plan cancelled'
      };
      return { data: mockTreatmentPlans[index] };
    } catch (error) {
      console.error('Error cancelling treatment plan:', error);
      throw error;
    }
  },

  
  getProgress: async (id: string): Promise<{ data: { completed: number; total: number; percentage: number } }> => {
    try {
      await delay(200);
      
      
      const plan = mockTreatmentPlans.find(p => p.id === id);
      if (!plan) {
        throw new Error('Treatment plan not found');
      }
      const total = plan.steps.length;
      const completed = plan.steps.filter(s => s.status === 'completed').length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { data: { completed, total, percentage } };
    } catch (error) {
      console.error('Error fetching treatment plan progress:', error);
      throw error;
    }
  }
};


export default treatmentPlanService;