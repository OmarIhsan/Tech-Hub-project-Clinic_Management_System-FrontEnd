// Validation schemas for appointments and treatment plans
// Note: Using TypeScript interfaces for validation. Consider installing 'zod' for more robust validation.

export interface AppointmentValidationSchema {
  patientId: string;
  doctorId: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface TreatmentPlanValidationSchema {
  patientId: string;
  doctorId: string;
  title: string;
  description: string;
  diagnosis: string;
  startDate: string;
  expectedEndDate: string;
  status: 'active' | 'completed' | 'cancelled' | 'on-hold';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface TreatmentStepValidationSchema {
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedDoctorId: string;
  notes?: string;
}

// Validation functions
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const appointmentValidation = {
  /**
   * Validate appointment data for creation
   */
  validateCreate: (data: unknown): AppointmentValidationSchema => {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Invalid appointment data');
    }

    const appointment = data as Record<string, unknown>;

    // Required fields
    if (!appointment.patientId || typeof appointment.patientId !== 'string') {
      throw new ValidationError('Patient ID is required and must be a string', 'patientId');
    }

    if (!appointment.doctorId || typeof appointment.doctorId !== 'string') {
      throw new ValidationError('Doctor ID is required and must be a string', 'doctorId');
    }

    if (!appointment.date || typeof appointment.date !== 'string') {
      throw new ValidationError('Date is required and must be a string', 'date');
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    if (!dateRegex.test(appointment.date)) {
      throw new ValidationError('Date must be in format YYYY-MM-DDTHH:mm', 'date');
    }

    // Validate date is not in the past (for scheduling)
    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    if (appointmentDate < now) {
      throw new ValidationError('Appointment date cannot be in the past', 'date');
    }

    // Validate status
    const validStatuses = ['scheduled', 'completed', 'cancelled'];
    if (!appointment.status || !validStatuses.includes(appointment.status as string)) {
      throw new ValidationError('Status must be one of: scheduled, completed, cancelled', 'status');
    }

    // Optional fields
    if (appointment.notes && typeof appointment.notes !== 'string') {
      throw new ValidationError('Notes must be a string', 'notes');
    }

    return {
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      date: appointment.date,
      status: appointment.status as 'scheduled' | 'completed' | 'cancelled',
      notes: appointment.notes as string | undefined,
    };
  },

  /**
   * Validate appointment data for update
   */
  validateUpdate: (data: unknown): Partial<AppointmentValidationSchema> => {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Invalid appointment data');
    }

    const appointment = data as Record<string, unknown>;
    const result: Partial<AppointmentValidationSchema> = {};

    // Optional fields for update
    if (appointment.date !== undefined) {
      if (typeof appointment.date !== 'string') {
        throw new ValidationError('Date must be a string', 'date');
      }
      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
      if (!dateRegex.test(appointment.date)) {
        throw new ValidationError('Date must be in format YYYY-MM-DDTHH:mm', 'date');
      }
      result.date = appointment.date;
    }

    if (appointment.status !== undefined) {
      const validStatuses = ['scheduled', 'completed', 'cancelled'];
      if (!validStatuses.includes(appointment.status as string)) {
        throw new ValidationError('Status must be one of: scheduled, completed, cancelled', 'status');
      }
      result.status = appointment.status as 'scheduled' | 'completed' | 'cancelled';
    }

    if (appointment.notes !== undefined) {
      if (typeof appointment.notes !== 'string') {
        throw new ValidationError('Notes must be a string', 'notes');
      }
      result.notes = appointment.notes;
    }

    return result;
  },
};

export const treatmentPlanValidation = {
  /**
   * Validate treatment plan data for creation
   */
  validateCreate: (data: unknown): TreatmentPlanValidationSchema => {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Invalid treatment plan data');
    }

    const plan = data as Record<string, unknown>;

    // Required fields
    if (!plan.patientId || typeof plan.patientId !== 'string') {
      throw new ValidationError('Patient ID is required and must be a string', 'patientId');
    }

    if (!plan.doctorId || typeof plan.doctorId !== 'string') {
      throw new ValidationError('Doctor ID is required and must be a string', 'doctorId');
    }

    if (!plan.title || typeof plan.title !== 'string') {
      throw new ValidationError('Title is required and must be a string', 'title');
    }

    if (plan.title.length < 3 || plan.title.length > 100) {
      throw new ValidationError('Title must be between 3 and 100 characters', 'title');
    }

    if (!plan.description || typeof plan.description !== 'string') {
      throw new ValidationError('Description is required and must be a string', 'description');
    }

    if (plan.description.length < 10 || plan.description.length > 500) {
      throw new ValidationError('Description must be between 10 and 500 characters', 'description');
    }

    if (!plan.diagnosis || typeof plan.diagnosis !== 'string') {
      throw new ValidationError('Diagnosis is required and must be a string', 'diagnosis');
    }

    if (!plan.startDate || typeof plan.startDate !== 'string') {
      throw new ValidationError('Start date is required and must be a string', 'startDate');
    }

    if (!plan.expectedEndDate || typeof plan.expectedEndDate !== 'string') {
      throw new ValidationError('Expected end date is required and must be a string', 'expectedEndDate');
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(plan.startDate)) {
      throw new ValidationError('Start date must be in format YYYY-MM-DD', 'startDate');
    }

    if (!dateRegex.test(plan.expectedEndDate)) {
      throw new ValidationError('Expected end date must be in format YYYY-MM-DD', 'expectedEndDate');
    }

    // Validate end date is after start date
    const startDate = new Date(plan.startDate);
    const endDate = new Date(plan.expectedEndDate);
    if (endDate <= startDate) {
      throw new ValidationError('Expected end date must be after start date', 'expectedEndDate');
    }

    // Validate status
    const validStatuses = ['active', 'completed', 'cancelled', 'on-hold'];
    if (!plan.status || !validStatuses.includes(plan.status as string)) {
      throw new ValidationError('Status must be one of: active, completed, cancelled, on-hold', 'status');
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high'];
    if (!plan.priority || !validPriorities.includes(plan.priority as string)) {
      throw new ValidationError('Priority must be one of: low, medium, high', 'priority');
    }

    // Optional fields
    if (plan.notes && typeof plan.notes !== 'string') {
      throw new ValidationError('Notes must be a string', 'notes');
    }

    return {
      patientId: plan.patientId,
      doctorId: plan.doctorId,
      title: plan.title,
      description: plan.description,
      diagnosis: plan.diagnosis,
      startDate: plan.startDate,
      expectedEndDate: plan.expectedEndDate,
      status: plan.status as 'active' | 'completed' | 'cancelled' | 'on-hold',
      priority: plan.priority as 'low' | 'medium' | 'high',
      notes: plan.notes as string | undefined,
    };
  },

  /**
   * Validate treatment plan data for update
   */
  validateUpdate: (data: unknown): Partial<TreatmentPlanValidationSchema> => {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Invalid treatment plan data');
    }

    const plan = data as Record<string, unknown>;
    const result: Partial<TreatmentPlanValidationSchema> = {};

    // Optional fields for update
    if (plan.title !== undefined) {
      if (typeof plan.title !== 'string') {
        throw new ValidationError('Title must be a string', 'title');
      }
      if (plan.title.length < 3 || plan.title.length > 100) {
        throw new ValidationError('Title must be between 3 and 100 characters', 'title');
      }
      result.title = plan.title;
    }

    if (plan.description !== undefined) {
      if (typeof plan.description !== 'string') {
        throw new ValidationError('Description must be a string', 'description');
      }
      if (plan.description.length < 10 || plan.description.length > 500) {
        throw new ValidationError('Description must be between 10 and 500 characters', 'description');
      }
      result.description = plan.description;
    }

    if (plan.diagnosis !== undefined) {
      if (typeof plan.diagnosis !== 'string') {
        throw new ValidationError('Diagnosis must be a string', 'diagnosis');
      }
      result.diagnosis = plan.diagnosis;
    }

    if (plan.expectedEndDate !== undefined) {
      if (typeof plan.expectedEndDate !== 'string') {
        throw new ValidationError('Expected end date must be a string', 'expectedEndDate');
      }
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(plan.expectedEndDate)) {
        throw new ValidationError('Expected end date must be in format YYYY-MM-DD', 'expectedEndDate');
      }
      result.expectedEndDate = plan.expectedEndDate;
    }

    if (plan.status !== undefined) {
      const validStatuses = ['active', 'completed', 'cancelled', 'on-hold'];
      if (!validStatuses.includes(plan.status as string)) {
        throw new ValidationError('Status must be one of: active, completed, cancelled, on-hold', 'status');
      }
      result.status = plan.status as 'active' | 'completed' | 'cancelled' | 'on-hold';
    }

    if (plan.priority !== undefined) {
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(plan.priority as string)) {
        throw new ValidationError('Priority must be one of: low, medium, high', 'priority');
      }
      result.priority = plan.priority as 'low' | 'medium' | 'high';
    }

    if (plan.notes !== undefined) {
      if (typeof plan.notes !== 'string') {
        throw new ValidationError('Notes must be a string', 'notes');
      }
      result.notes = plan.notes;
    }

    return result;
  },
};

export const treatmentStepValidation = {
  /**
   * Validate treatment step data for creation
   */
  validateCreate: (data: unknown): TreatmentStepValidationSchema => {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Invalid treatment step data');
    }

    const step = data as Record<string, unknown>;

    // Required fields
    if (!step.title || typeof step.title !== 'string') {
      throw new ValidationError('Title is required and must be a string', 'title');
    }

    if (step.title.length < 3 || step.title.length > 100) {
      throw new ValidationError('Title must be between 3 and 100 characters', 'title');
    }

    if (!step.description || typeof step.description !== 'string') {
      throw new ValidationError('Description is required and must be a string', 'description');
    }

    if (step.description.length < 10 || step.description.length > 300) {
      throw new ValidationError('Description must be between 10 and 300 characters', 'description');
    }

    if (!step.dueDate || typeof step.dueDate !== 'string') {
      throw new ValidationError('Due date is required and must be a string', 'dueDate');
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(step.dueDate)) {
      throw new ValidationError('Due date must be in format YYYY-MM-DD', 'dueDate');
    }

    if (!step.assignedDoctorId || typeof step.assignedDoctorId !== 'string') {
      throw new ValidationError('Assigned doctor ID is required and must be a string', 'assignedDoctorId');
    }

    // Validate status
    const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
    if (!step.status || !validStatuses.includes(step.status as string)) {
      throw new ValidationError('Status must be one of: pending, in-progress, completed, cancelled', 'status');
    }

    // Optional fields
    if (step.notes && typeof step.notes !== 'string') {
      throw new ValidationError('Notes must be a string', 'notes');
    }

    return {
      title: step.title,
      description: step.description,
      dueDate: step.dueDate,
      status: step.status as 'pending' | 'in-progress' | 'completed' | 'cancelled',
      assignedDoctorId: step.assignedDoctorId,
      notes: step.notes as string | undefined,
    };
  },

  /**
   * Validate treatment step data for update
   */
  validateUpdate: (data: unknown): Partial<TreatmentStepValidationSchema> => {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Invalid treatment step data');
    }

    const step = data as Record<string, unknown>;
    const result: Partial<TreatmentStepValidationSchema> = {};

    // Optional fields for update
    if (step.title !== undefined) {
      if (typeof step.title !== 'string') {
        throw new ValidationError('Title must be a string', 'title');
      }
      if (step.title.length < 3 || step.title.length > 100) {
        throw new ValidationError('Title must be between 3 and 100 characters', 'title');
      }
      result.title = step.title;
    }

    if (step.description !== undefined) {
      if (typeof step.description !== 'string') {
        throw new ValidationError('Description must be a string', 'description');
      }
      if (step.description.length < 10 || step.description.length > 300) {
        throw new ValidationError('Description must be between 10 and 300 characters', 'description');
      }
      result.description = step.description;
    }

    if (step.dueDate !== undefined) {
      if (typeof step.dueDate !== 'string') {
        throw new ValidationError('Due date must be a string', 'dueDate');
      }
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(step.dueDate)) {
        throw new ValidationError('Due date must be in format YYYY-MM-DD', 'dueDate');
      }
      result.dueDate = step.dueDate;
    }

    if (step.status !== undefined) {
      const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(step.status as string)) {
        throw new ValidationError('Status must be one of: pending, in-progress, completed, cancelled', 'status');
      }
      result.status = step.status as 'pending' | 'in-progress' | 'completed' | 'cancelled';
    }

    if (step.assignedDoctorId !== undefined) {
      if (typeof step.assignedDoctorId !== 'string') {
        throw new ValidationError('Assigned doctor ID must be a string', 'assignedDoctorId');
      }
      result.assignedDoctorId = step.assignedDoctorId;
    }

    if (step.notes !== undefined) {
      if (typeof step.notes !== 'string') {
        throw new ValidationError('Notes must be a string', 'notes');
      }
      result.notes = step.notes;
    }

    return result;
  },
};

// Utility functions for common validations
export const validationUtils = {
  /**
   * Validate UUID format
   */
  isValidUUID: (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  },

  /**
   * Validate date string format
   */
  isValidDate: (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  },

  /**
   * Validate email format
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number format
   */
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone);
  },

  /**
   * Sanitize string input
   */
  sanitizeString: (input: string): string => {
    return input.trim().replace(/\s+/g, ' ');
  },
};

// Export all validation schemas and functions
export default {
  appointmentValidation,
  treatmentPlanValidation,
  treatmentStepValidation,
  validationUtils,
  ValidationError,
};