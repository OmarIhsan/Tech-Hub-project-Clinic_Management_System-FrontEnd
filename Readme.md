# Frontend Guide – Clinic Management System (React + TypeScript + MUI)

**Team Setup:**  
This guide is tailored for a 2-member team, with tasks clearly separated for each developer per week.

---

## UI Choices Demo (Sample)

**Name:** Omar Aziz

| Option                  | Choice                                         |
|-------------------------|------------------------------------------------|
| Theme                   | Blue & White (Light) / Blue & Black (Dark)     |
| Dark/Light Mode Switch  | iOS Switch                                     |
| Font                    | Dubai                                          |
| Button Style            | MUI Button                                     |
| Navigation              | Icon Navigation                                |
| Floating Add Button     | MUI Floating Action Button                     |

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
- [ ] **Setup basic routing:**
  **Routes are being added at the end of App.tsx file**
  - [ ] Implement React Router for main pages and navigations
  - [ ] Create placeholder pages for each feature
- [ ] **Set up MUI theme:**  
  - [ ] Create `theme/` module for custom MUI theme

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
  - [ ] Create `services/api.ts` (Axios instance with interceptors)
- [x] **Set up hooks and basic services:**  
  - [x] Create folder and starter file for custom hooks

---

## Week 2: CRUD Screens & API Integration

### Omar Aziz: Patient & Doctor CRUD + API Layer

- [ ] **Build patient screens:**  
  - [ ] List, Create, Edit forms (connect to API)
- [ ] **Build doctor screens:**  
  - [ ] List, Create, Edit forms (connect to API)
- [ ] **Develop API services:**  
  - [ ] `services/patientService.ts`
  - [ ] `services/doctorService.ts`
- [ ] **Integrate react-query:**  
  - [ ] For data fetching, caching, loading states
- [ ] **Validation:**  
  - [ ] Create Zod schemas for patient/doctor forms

### Omar Ihsan: Appointments, Treatment Plans, Medical Records

- [ ] **Appointment screens:**  
  - [ ] List, filter by doctor/status, create form
- [ ] **Treatment plans:**  
  - [ ] Dynamic form steps, status control
- [ ] **Medical records:**  
  - [ ] Diagnosis, findings, treatment
- [ ] **Develop API services:**  
  - [ ] `services/appointmentService.ts`
  - [ ] `services/treatmentPlanService.ts`
- [ ] **Validation:**  
  - [ ] Zod schemas for appointments/treatment plans

---

## Week 3: Polish, Dashboard, and QA

### Omar Aziz: Dashboard & UI Components

- [ ] **Dashboard module:**  
  - [ ] `features/dashboard`: Total patients, upcoming appointments, active plans
  - [ ] Use MUI `Card`, `Grid`, `Typography`
  - [ ] (Optional) Add charts with `recharts`
- [ ] **Reusable UI components:**  
  - [ ] `components/TableView`: Table with pagination
  - [ ] `components/StatusBadge`: Appointment/treatment status
- [ ] **Role-based access wrappers:**  
  - [ ] Implement wrappers if needed

### Omar Ihsan: File Uploads, Testing, Documentation

- [ ] **File uploads:**  
  - [ ] `features/clinicalDocuments`: Upload + preview
  - [ ] Drag-and-drop, file type validation
- [ ] **Form Components:**  
  - [ ] `components/FormInput`
  - [ ] `SelectField`
  - [ ] `DatePicker`
  - [ ] `FileUpload`
- [ ] **Testing:**  
  - [ ] Unit tests for key components using `vitest` or `jest`
  - [ ] Manual test flows: login → create patient → schedule appointment → add treatment plan → upload document
- [ ] **Documentation:**  
  - [ ] Update `README.md` with setup, folder structure, and dev guide
  - [ ] Document API endpoints and screen responsibilities
  - [ ] (Optional) Record Loom walkthrough for future devs

---

## Collaboration Tips

- [ ] **Daily sync:** 15-minute standup or async check-in.
- [ ] **Branching:** Each member works on their own feature branches.
- [ ] **Code review:** Peer review before merging to main.
- [ ] **Issue tracking:** Use GitHub Issues or Projects to track progress/tasks.

---

This split should help both developers work efficiently and avoid stepping on each other’s toes, while covering all major milestones for a production-ready frontend.
