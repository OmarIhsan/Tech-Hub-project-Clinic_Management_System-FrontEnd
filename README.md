# Frontend Guide – Clinic Management System (React + TypeScript + MUI)

**Team Setup:**  
This guide is tailored for a 2-member team, with tasks clearly separated for each developer per week.

---

## Week 1: Project Setup & Core Scaffolding

### Member 1: Project Setup, Routing, and Theme

- **Install dependencies:**  
  - `@mui/material`, `@mui/icons-material`
  - `react-router-dom`, `axios`, `react-query`, `zod`, `react-hook-form`
- **Create folder structure:**  
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
- **Setup basic routing:**  
  - Implement React Router for main pages
  - Create placeholder pages for each feature
- **Set up MUI theme:**  
  - Create `theme/` module for custom MUI theme

### Member 2: Core Features Scaffolding & Types

- **Scaffold initial feature modules:**  
  - `features/auth`: Login page skeleton
  - `features/patients`: List + Create/Edit form skeleton
  - `features/doctors`: List + Create/Edit form skeleton
- **Create types and interfaces:**  
  - `types/index.ts`: Patient, Doctor, Appointment, etc.
- **API service base:**  
  - Create `services/api.ts` (Axios instance with interceptors)
- **Set up hooks and basic services:**  
  - Create folder and starter file for custom hooks

---

## Week 2: CRUD Screens & API Integration

### Member 1: Patient & Doctor CRUD + API Layer

- **Build patient screens:**  
  - List, Create, Edit forms (connect to API)
- **Build doctor screens:**  
  - List, Create, Edit forms (connect to API)
- **Develop API services:**  
  - `services/patientService.ts`
  - `services/doctorService.ts`
- **Integrate react-query:**  
  - For data fetching, caching, loading states
- **Validation:**  
  - Create Zod schemas for patient/doctor forms

### Member 2: Appointments, Treatment Plans, Medical Records

- **Appointment screens:**  
  - List, filter by doctor/status, create form
- **Treatment plans:**  
  - Dynamic form steps, status control
- **Medical records:**  
  - Diagnosis, findings, treatment
- **Develop API services:**  
  - `services/appointmentService.ts`
  - `services/treatmentPlanService.ts`
- **Validation:**  
  - Zod schemas for appointments/treatment plans

---

## Week 3: Polish, Dashboard, and QA

### Member 1: Dashboard & UI Components

- **Dashboard module:**  
  - `features/dashboard`: Total patients, upcoming appointments, active plans
  - Use MUI `Card`, `Grid`, `Typography`
  - (Optional) Add charts with `recharts`
- **Reusable UI components:**  
  - `components/TableView`: Table with pagination
  - `components/StatusBadge`: Appointment/treatment status
- **Role-based access wrappers:**  
  - Implement wrappers if needed

### Member 2: File Uploads, Testing, Documentation

- **File uploads:**  
  - `features/clinicalDocuments`: Upload + preview
  - Drag-and-drop, file type validation
- **Form Components:**  
  - `components/FormInput`, `SelectField`, `DatePicker`, `FileUpload`
- **Testing:**  
  - Unit tests for key components using `vitest` or `jest`
  - Manual test flows: login → create patient → schedule appointment → add treatment plan → upload document
- **Documentation:**  
  - Update `README.md` with setup, folder structure, and dev guide
  - Document API endpoints and screen responsibilities
  - (Optional) Record Loom walkthrough for future devs

---

## Collaboration Tips

- **Daily sync:** 15-minute standup or async check-in.
- **Branching:** Each member works on their own feature branches.
- **Code review:** Peer review before merging to main.
- **Issue tracking:** Use GitHub Issues or Projects to track progress/tasks.

---

This split should help both developers work efficiently and avoid stepping on each other’s toes, while covering all major milestones for a production-ready frontend.
