# Tech Hub — Clinic Management System (FrontEnd)

This repository contains the frontend for the "Tech Hub — Clinic Management System" — a TypeScript + React (Vite) single-page application that provides user interfaces for patients, staff, doctors, appointments, procedures, finance (income/expenses), clinical documents, medical records, and more.

This README mirrors and complements the backend documentation. It explains the project structure, how to run the app locally, how to contribute, and key implementation notes.

---

## Table of Contents

- About
- Features
- Tech stack
- Repository structure
- Environment & configuration
- Development (run locally)
- Linting & type-checking
- Testing
- Building for production
- Useful notes about API shape and payloads
- Troubleshooting
- Contributing

---

## About

The frontend is a TypeScript React application built with Vite and Material-UI (MUI). It consumes a RESTful backend API (see the backend repo) to manage clinic data: patients, staff, doctors, treatment plans, procedures, appointments, clinical documents, and finances.

Primary goals:
- Provide responsive, role-aware UI for clinic staff (Owner, Doctor, and Staff roles).
- Centralize API calls, error handling, and normalization in small service modules.
- Keep components composable and typed with TypeScript for maintainability.

---

## Features

- Authentication (login) and role-based routing/guards.
- Patient list, create, edit and detailed views.
- Staff management (list, add, update, delete).
- Appointments (calendar, create, list).
- Procedures and treatment plans (create/list/manage).
- Clinical document upload & listing.
- Patient images upload and gallery.
- Financials: income and expense forms and lists.
- Dashboard views for different roles with quick actions.

---

## Tech stack

- React 18 + TypeScript
- Vite
- Material UI (MUI)
- Axios for HTTP
- ESLint + TypeScript for static checks
- Optional: local JSON DB for demo runs (db.json)

---

## Repository structure

Top-level important files:

- `index.html`, `main.tsx` — app entry.
- `vite.config.ts` — Vite configuration.
- `package.json` — scripts and dependencies.
- `tsconfig.json` — TypeScript config.

Key folders:

- `src/`
  - `assets/` — images and static assets
  - `components/` — shared UI components (TableView, MButton, ProtectedRoute, FloatingAddButton, etc.)
  - `config/` — axios instance and central config (`src/config/axios.ts`)
  - `context/` — React context for auth
  - `features/` — feature areas (appointments, patients, staff, finance, dashboard, clinical-documents, medical-records, etc.)
  - `services/` — thin API wrappers (patientService, staffService, expenseService, otherIncomeService, procedureService, clinicalDocumentService, api.ts aggregator)
  - `hooks/` — small hooks such as `useFetch`
  - `utils/` — helpers like `formatCurrency`
  - `types/` — central TypeScript types
  - `validation/` — client-side validation schemas

---

## Environment & configuration

Required environment variables (set in `.env` or shell):

- `VITE_API_BASE_URL` — base URL for the backend API (default: `http://localhost:3000/api/v1`).

Example `.env` for local dev:

```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Note: Vite requires `VITE_` prefixed env vars to be exposed to the client.

---

## Development (run locally)

1. Install dependencies

```powershell
npm install
```

2. Start the development server

```powershell
npm run dev
```

3. Open the app

- Navigate to `http://localhost:5173` (or the URL Vite prints).
- Ensure your backend API is running and `VITE_API_BASE_URL` points to it.

---

## Linting & type-checking

- Run ESLint autofix

```powershell
npx eslint . --fix --ext .ts,.tsx,.js,.jsx
```

- Run TypeScript type-check

```powershell
npm run type-check
# (package.json should define `type-check` -> `tsc --noEmit`)
```

---

## Testing

There are currently no automated tests included in this repository. We recommend adding unit tests for `services/*` and a small integration/smoke test for the main flows (create patient, create staff, create income/expense).

---

## Building for production

```powershell
npm run build
```

The output will be in `dist/`. Deploy static assets to your chosen static host (Netlify, Vercel, or a static server). Ensure the backend base URL is set appropriately for production.

---

## API shape and payload notes (frontend expectations)

This frontend expects the backend API to follow a mostly consistent shape but some endpoints wrap data in an envelope. Notes gathered from implementation:

- Many `GET` list endpoints return an envelope such as:
  ```json
  { "statusCode": 200, "data": [ /* array */ ], "timestamp": "..." }
  ```
  The services normalize this by checking for `resp.data`.

- `staff` endpoint (list) is expected to return `data: [ { staff_id, full_name, phone, email, role, hire_date, ... } ]`.

- Creating resources (patients, staff, procedures) may require specific field names. Example staff creation payload used by frontend:
  ```json
  {
    "full_name": "Jon Smith",
    "phone": "+9647701234567",
    "email": "jon1.sm2@gmail.com",
    "hire_date": "2022-09-04",
    "role": "staff",
    "password": "securePassword123"
  }
  ```

- API error handling: the axios instance logs full response data in DEV; some forms surface raw server JSON for debugging/validation.

---

## Troubleshooting

- 400 responses when creating records: inspect the server response body in the browser console network tab — many backend validation errors are returned as JSON; frontend sometimes stringifies them for display.
- CORS or network errors: ensure backend `VITE_API_BASE_URL` is correct and the backend allows traffic from the dev server origin.
- Lint/type errors after mass edits: run the commands under "Linting & type-checking" and follow TypeScript errors to find missing fields or incorrect payload shapes.

---

## Contributing

- Create a feature branch from `main`.
- Run lint and type-check locally before opening a PR.
- If you modify API payloads, update `src/services/*` normalization logic and `src/types`.

---

## Acknowledgements

- Built with React, Vite, TypeScript, and Material-UI.
- Some automated code changes and cleanup were performed during development to normalize API shapes, remove comments, and enforce lint rules.

---

© Clinic Management System FrontEnd Team - QafLab