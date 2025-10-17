# API Alignment Changes

This document tracks the changes made to align the frontend API services with the backend API documentation.

## Date: October 17, 2025

### Changes Made

#### 1. Appointments Service (`src/services/appointmentService.ts`)
- **Changed**: `appointmentDate` → `datetime` in request payloads
- **Reason**: API documentation specifies `datetime` field
- **Impact**: 
  - `CreateAppointmentData` interface
  - `UpdateAppointmentData` interface  
  - `reschedule()` method

#### 2. Procedures Service (`src/services/procedureService.ts`)
- **Changed**: `treatmentPlanId` → `relatedTreatmentPlanId`
- **Reason**: API documentation uses `relatedTreatmentPlanId` parameter name
- **Impact**:
  - `CreateProcedureData` interface
  - `UpdateProcedureData` interface

#### 3. Staff Service (`src/services/staffService.ts`)
- **Changed**: `phone` → `contact` 
- **Reason**: API documentation uses `contact` field for staff phone numbers
- **Impact**:
  - `CreateStaffData` interface
  - `UpdateStaffData` interface

#### 4. Treatment Plans Service (`src/services/treatmentPlanService.ts`)
- **Major Restructure**: Simplified to match API documentation
- **Changes**:
  - Removed complex structure (title, description, diagnosis, startDate, expectedEndDate, priority, steps)
  - Replaced with simpler structure: `summary`, `prescriptions`, `status`
  - Removed `CreateTreatmentStepData` interface (not in API)
  - Removed methods not in API:
    - `getByDoctorId()`
    - `getByPriority()`
    - `addStep()`
    - `updateStep()`
    - `updateStepStatus()`
    - `deleteStep()`
    - `complete()`
    - `cancel()`
    - `getProgress()`
- **Reason**: API documentation shows simpler treatment plan structure
- **Impact**:
  - `CreateTreatmentPlanData` interface
  - `UpdateTreatmentPlanData` interface
  - Service method signatures

### Services Already Aligned

The following services were already properly aligned with the API documentation:

1. **Auth API** (`src/services/api.ts`)
   - `/auth/login` ✓
   - `/auth/register` ✓
   - `/auth/profile` ✓

2. **Patients API** (`src/services/api.ts`)
   - All CRUD endpoints match ✓
   - Query parameters (offset, limit, search) ✓

3. **Doctors API** (`src/services/api.ts`)
   - All CRUD endpoints match ✓
   - Query parameters (offset, limit, search) ✓

4. **Medical Records API** (`src/services/api.ts`)
   - All CRUD endpoints match ✓
   - Query parameters (patientId, offset, limit) ✓

5. **Expenses Service** (`src/services/expenseService.ts`)
   - All endpoints match ✓
   - Query parameters (offset, limit, dateFrom, dateTo, category) ✓

6. **Other Incomes Service** (`src/services/otherIncomeService.ts`)
   - All endpoints match ✓
   - Query parameters (offset, limit) ✓

7. **Clinical Documents Service** (`src/services/clinicalDocumentService.ts`)
   - All endpoints match ✓
   - File upload support included ✓
   - Query parameters (patientId, offset, limit) ✓

8. **Patient Images Service** (`src/services/patientImageService.ts`)
   - All endpoints match ✓
   - File upload support included ✓
   - Query parameters (patientId, offset, limit) ✓

### Notes on Discrepancies

#### Doctor Types
- **API Doc**: Uses `specialization`, `availableFrom`, `availableTo`
- **Current Types**: Uses `specialty` (simpler)
- **Status**: Frontend simplified - backend should accept both or frontend needs update

#### Patient Types  
- **API Doc**: Uses `dob`, `allergies`, `conditions`
- **Current Types**: Uses `age`, with optional extended fields
- **Status**: Types are flexible with optional fields - compatible

#### Treatment Plans
- **Major Change**: Frontend was using complex structure with steps/priority
- **API Reality**: Backend uses simple summary/prescriptions
- **Status**: Now aligned with backend structure

### Build Status
✅ Build successful after changes (36.27s)
✅ No TypeScript errors
✅ Bundle size: 975.94 kB (295.87 kB gzipped)

### Testing Recommendations

1. **Appointments**: Test create/update with `datetime` field
2. **Procedures**: Test with `relatedTreatmentPlanId` parameter
3. **Staff**: Test create/update with `contact` field
4. **Treatment Plans**: Test simplified create/update structure
5. **End-to-end**: Verify all services work with actual backend

### Future Considerations

1. Consider adding TypeScript types that match exact backend DTOs
2. Add API response validation
3. Consider using code generation from OpenAPI/Swagger when available
4. Document any frontend-specific field transformations
