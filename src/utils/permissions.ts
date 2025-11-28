export type UserRole = 'owner' | 'doctor' | 'staff';

export const RolePermissions = {
  OWNER: 'owner' as UserRole,
  DOCTOR: 'doctor' as UserRole,
  STAFF: 'staff' as UserRole,
};

export const hasAccess = (userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

export const canAccessPatients = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner', 'doctor', 'staff']);
};

export const canAccessStaff = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner']);
};

export const canAccessDoctors = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner', 'doctor', 'staff']);
};

export const canAccessAppointments = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner', 'doctor', 'staff']);
};

export const canAccessMedicalRecords = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner', 'doctor']);
};

export const canAccessTreatmentPlans = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner', 'doctor']);
};

export const canAccessProcedures = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner', 'doctor']);
};

export const canAccessClinicalDocuments = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner']);
};

export const canAccessPatientImages = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner']);
};

export const canAccessFinance = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner']);
};

export const canCreatePatient = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner', 'doctor', 'staff']);
};

export const canDeletePatient = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner']);
};

export const canCreateAppointment = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner', 'doctor', 'staff']);
};

export const canCreateProcedure = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner', 'doctor']);
};

export const canDeleteProcedure = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner']);
};

export const canUploadDocument = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner', 'doctor', 'staff']);
};

export const canManageStaff = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner']);
};

export const canManageDoctors = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner']);
};

export const canCreateExpense = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner', 'doctor', 'staff']);
};

export const canViewExpenses = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner']);
};

export const canManageIncome = (role: UserRole | undefined): boolean => {
  return hasAccess(role, ['owner']);
};

export const getAvailableRoutes = (role: UserRole | undefined): string[] => {
  const routes: string[] = ['/dashboard'];
  
  if (canAccessPatients(role)) routes.push('/patients');
  if (canAccessAppointments(role)) routes.push('/appointments');
  if (canAccessDoctors(role)) routes.push('/doctors');
  if (canAccessStaff(role)) routes.push('/staff');
  if (canAccessMedicalRecords(role)) routes.push('/medical-records');
  if (canAccessTreatmentPlans(role)) routes.push('/treatment-plans');
  if (canAccessProcedures(role)) routes.push('/procedures');
  if (canAccessClinicalDocuments(role)) routes.push('/clinical-documents');
  if (canAccessPatientImages(role)) routes.push('/patient-images');
  if (canAccessFinance(role)) routes.push('/finance');
  
  return routes;
};
