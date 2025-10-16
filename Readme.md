# Frontend Guide – Clinic Management System (React + TypeScript + MUI)

**Team Setup:**  
This guide is tailored for a 2-member team, with tasks c---

## New Features Implemented

### Clinical Documents Management
- **Route:** `/documents`
- **Features:**
  - Document listing with type-based filtering
  - File upload with drag-and-drop support
  - Document preview dialog
  - File type validation (PDF, images, documents)
  - File size validation (configurable)
  - Mock data integration

### Reusable Form Components
- **FormInput:** Enhanced TextField with error handling
- **SelectField:** Dropdown with options support (string arrays or objects)
- **DatePicker:** Date input with validation and clear functionality
- **FileUpload:** Drag-and-drop file upload with progress and validation

### Demo Page
- **Route:** `/demo`
- **Purpose:** Showcase all form components with live examples
- **Features:** Interactive form with real-time data preview

### Usage Examples

```jsx
// FormInput
<FormInput
  label="Patient Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={nameError}
  required
/>

// SelectField
<SelectField
  label="Document Type"
  value={docType}
  onChange={(e) => setDocType(e.target.value)}
  options={[
    { value: 'lab-result', label: 'Lab Result' },
    { value: 'imaging', label: 'Medical Imaging' }
  ]}
/>

// DatePicker
<DatePicker
  label="Appointment Date"
  value={appointmentDate}
  onChange={setAppointmentDate}
  minDate={new Date()}
/>

// FileUpload
<FileUpload
  onFilesChange={setFiles}
  acceptedTypes={['.pdf', '.jpg', '.png']}
  maxFileSize={10 * 1024 * 1024} // 10MB
  maxFiles={5}
  multiple
/>
```

---

This split should help both developers work efficiently and avoid stepping on each other's toes, while covering all major milestones for a production-ready frontend.rly separated for each developer per week.

---

| Option                  | Choice                                         |
|-------------------------|------------------------------------------------|
| Theme                   | Blue & White (Light) / Blue & Black (Dark)     |
| Dark/Light Mode Switch  | iOS Switch         **implemented as IOSSwitch**|
| Font                    | Dubai                                          |
| Button Style            | MUI Button           **implemented as MButton**|
| Navigation              | Icon Navigation          **as NavigationIcons**|
| Floating Add Button     | MUI Floating Action Button**FloatingAddButton**|

---

## Week 1: Project Setup & Core Scaffolding

### Omar Aziz: Project Setup, Routing, and Theme

- [x] **Install dependencies:**  
  - [x] `@mui/material`, `@mui/icons-material`
  - [x] `react-router`, `axios`
- [x] **Create folder structure:**  
  ```
  src/
    ├── features/        
    ├── components/      
    ├── services/         
    ├── types/            
    ├── hooks/            
    ├── theme/           
    └── router/           
  ```
- [x] **Setup basic routing:**
  **Routes are being added in router/Router**
  - [x] Implement React Router for main pages and navigations
  - [x] Create placeholder pages for each feature
- [x] **Set up MUI theme:**  
  - [x] Create `theme/` module for custom MUI theme

### Omar Ihsan: Core Features Scaffolding & Types

- [x] **Scaffold initial feature modules:**  
  - [x] `features/auth`:  
    - Create `src/features/auth/`
    - Add `Login.tsx` with a simple form (email, password, submit button)
    - Add route `/login` in your router
  - [x] `features/patients`:  
    - Create `src/features/patients/`
    - Add `PatientList.tsx` (table or list of patients)
    - Add `PatientForm.tsx` (form for create/edit patient)
    - Add routes `/patients`, `/patients/new`, `/patients/:id/edit`
  - [x] `features/doctors`:  
    - Create `src/features/doctors/`
    - Add `DoctorList.tsx` (table or list of doctors)
    - Add `DoctorForm.tsx` (form for create/edit doctor)
    - Add routes `/doctors`, `/doctors/new`, `/doctors/:id/edit`
- [x] **Create types and interfaces:**  
  - [x] `types/index.ts`: Patient, Doctor, Appointment, etc.
- [---] **API service base:**  
    **Fake right now, must be replaced with actual api server when backend team complete it**
  - [---] Create `services/api.ts` (Axios instance with interceptors, ***mock data*** for dev)
- [x] **Set up hooks and basic services:**  
  - [x] Create folder and starter file for custom hooks

---

## Week 2: CRUD Screens & API Integration

### Omar Aziz: Patient & Doctor CRUD + API Layer

- [x] **Build patient screens:**  
  - [x] List, Create, Edit forms (mock API, PatientList.tsx, PatientForm.tsx)
- [x] **Build doctor screens:**  
  - [x] List, Create, Edit forms (mock API, DoctorList.tsx, DoctorForm.tsx)
- [ ] **Develop API services:**  
 - [x] **Develop API services:**  
  - [x] `services/patientService.ts` (implemented inside `src/services/api.ts` as `patientAPI`)
  - [x] `services/doctorService.ts` (implemented inside `src/services/api.ts` as `doctorAPI`)
  - Note: A mock API is provided at `src/services/api.ts` (exports `patientAPI`, `doctorAPI`, `medicalRecordAPI`, etc.).
    Use these for local CRUD testing — no backend required for basic development. Open the `/patients` and `/doctors` routes to exercise create/edit/delete flows.
 - [x] **Integrate react-query:**  
  - [x] For data fetching and caching (QueryClient wired in `src/main.tsx`, components use `@tanstack/react-query`)
- [ ] **Validation:**  
  - [ ] Validation schemas for patient/doctor forms (not implemented)

### Omar Ihsan: Appointments, Treatment Plans, Medical Records

- [x] **Appointment screens:**  
  - [x] List, filter by doctor/status, create form
- [x] **Treatment plans:**  
  - [x] Dynamic form steps, status control
- [x] **Medical records:**  
  - [x] Diagnosis, findings, treatment
- [x] **Develop API services:**  
  - [x] `services/appointmentService.ts`
  - [x] `services/treatmentPlanService.ts`
- [---] **Validation:**  
  - [ ] Validation schemas for appointments/treatment plans (TypeScript-based)

---

## Week 3: Polish, Dashboard, and QA

### Omar Aziz: Dashboard & UI Components

- [ ] **Dashboard module:**  
  - [ *] `features/dashboard`: Total patients, upcoming appointments, active plans (not implemented)
  - [ *] Use MUI `Card`, `Grid`, `Typography`
  - [* ] (Optional) Add charts with `recharts`
- [ ] **Reusable UI components:**  
  - [ ] `components/TableView`: Table with pagination (implemented at `src/components/TableView.tsx`)
    - Usage: import { TableView } from 'src/components' — provides a simple client-side paginated table.
  - [ *] `components/StatusBadge`: Appointment/treatment status (not implemented)
- [ ] **Role-based access wrappers:**  
  - [ ] Implement wrappers if needed (not implemented)

### Omar Ihsan: File Uploads, Testing, Documentation

- [x] **File uploads:**  
  - [x] `features/clinical-documents`: Upload + preview (implemented with mock data)
  - [x] Drag-and-drop, file type validation (implemented with full validation)
- [x] **Form Components:**  
  - [x] `components/FormInput` (implemented with error handling)
  - [x] `SelectField` (implemented with options support)
  - [x] `DatePicker` (implemented with validation)
  - [x] `FileUpload` (implemented with drag-and-drop)
- [ ] **Testing:**  
  - [ ] Unit tests for key components using `vitest` or `jest` (not implemented)
  - [ ] Manual test flows: login → create patient → schedule appointment → add treatment plan → upload document (not documented)
 - [x] **Documentation:**  
  - [x] Update `README.md` with setup, folder structure, and dev guide
  - [ ] Document API endpoints and screen responsibilities (not completed)
  - [ ] (Optional) Record Loom walkthrough for future devs (not completed)

---

## Collaboration Tips

  - [ ] **Daily sync:** 15-minute standup or async check-in.
  - [ ] **Branching:** Each member works on their own feature branches.
  - [ ] **Code review:** Peer review before merging to main.
  - [ ] **Issue tracking:** Use GitHub Issues or Projects to track progress/tasks.

---

This split should help both developers work efficiently and avoid stepping on each other’s toes, while covering all major milestones for a production-ready frontend.
