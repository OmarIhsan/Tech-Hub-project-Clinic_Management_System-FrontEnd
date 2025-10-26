# Tech Hub — Clinic Management System (FrontEnd)

This repository contains the frontend application for the "Tech Hub — Clinic Management System" — a TypeScript + React SPA built with Vite and Material UI. The frontend provides role-aware interfaces for clinic staff to manage patients, staff, appointments, procedures, clinical documents, medical records, and finances.

This README documents how the project is organized, how to run and develop the app locally, expected API shapes that the frontend integrates with, and common troubleshooting tips.

---

## Table of Contents

- About
- Quick start
- Project structure (short)
- Key files & services
- Environment & configuration
- Development workflow
- Linting, type-checking & formatting
- Building & deploying
- API expectations & payload notes
- Troubleshooting & debugging tips
- Contributing
- License & acknowledgements

---

## About

The frontend app is a modular React + TypeScript application that talks to a RESTful backend API. It's intended for clinic staff and administrators (roles such as OWNER, DOCTOR, STAFF) and includes role-based routes and UI. The UI library used is Material UI (MUI), and HTTP calls are consolidated through a small service layer using Axios.

Primary goals:
- Provide a responsive, role-aware UI for clinic operations.
- Centralize API calls and normalization in `src/services`.
- Keep components small, typed, and reusable.

---

## Quick start

Prerequisites:
- Node.js (>= 16 recommended)
- npm (or yarn)

1. Install dependencies

```powershell
npm install
```

2. Configure environment variables (create a `.env` file at repo root)

```powershell
# example .env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

3. Run the dev server

```powershell
npm run dev
```

4. Open the app in your browser (Vite prints the URL, typically `http://localhost:5173`).

Notes:
- Ensure the backend API is running and reachable from the `VITE_API_BASE_URL` above.

---

## Project structure (short)

Top-level files:
- `package.json` — scripts & dependencies
- `vite.config.ts` — Vite configuration
- `tsconfig.json` — TypeScript settings

Important folders in `src/`:
- `components/` — shared UI building blocks (TableView, buttons, switches)
- `config/` — axios instance & HTTP interceptors (`src/config/axios.ts`)
- `context/` — auth context and provider
- `features/` — main feature areas (appointments, patients, staff, finance, dashboard, clinical-documents, medical-records, etc.)
- `services/` — API wrappers & response normalization
- `hooks/` — small custom hooks (e.g., `useFetch`)
- `types/` — shared TypeScript types
- `validation/` — client-side validation schemas

---

## Key files & services (what to look for)

- `src/config/axios.ts` — central Axios instance. Adds Authorization headers, handles 401 behavior (clear tokens/redirect), and provides DEV logging. Modify this when you need global HTTP behavior changes.
- `src/services/*.ts` — small wrappers around REST endpoints. Each service normalizes varied backend envelope shapes (flat arrays or { data: [...] }). If an API changes, update the corresponding service and `src/types`.
- `src/context/AuthContext.tsx` — stores auth state and tokens. Used by route guards and request interceptors.
- `src/features/*/*` — feature-specific pages and forms that call services. Forms generally surface raw server validation messages for visibility.
- `src/components/TableView.tsx` — generic table used by many list screens.

---

## Environment & configuration

Use a `.env` file for local development. The only required variable for the app is:

- `VITE_API_BASE_URL` — example: `http://localhost:3000/api/v1`

Vite exposes `VITE_*` variables to client-side code. If you add other environment variables, prefix them with `VITE_`.

---

## Development workflow

- Install deps: `npm install`
- Start dev server: `npm run dev`
- Hot reloads are handled by Vite; edits to `src/` will update the browser.

Recommended iterative flow when working on API changes:
1. Update `src/services/<service>.ts` to adapt to backend envelope or field changes.
2. Update `src/types` with new DTO shapes.
3. Make UI changes in `src/features/...` and run the app.

Debugging tips:
- Check browser DevTools network tab for request payloads and server responses.
- In development the Axios instance logs requests/responses (if DEV-mode logging is enabled). You can add console logs inside `src/config/axios.ts` while debugging.

---

## Linting, formatting & type-checking

The project uses ESLint and TypeScript. Run these before opening a PR.

- Lint & autofix

```powershell
npx eslint . --fix --ext .ts,.tsx,.js,.jsx
```

- Type-check only

```powershell
npm run type-check
# (this should run: `tsc --noEmit`)
```

Common linter notes:
- There may be some `react-hooks/exhaustive-deps` warnings in complex hooks (e.g., AppointmentCalendar). Address them by adding the correct dependencies, or wrapping callbacks in `useCallback` where appropriate.

---

## Building & deploying

Build for production (generates `dist/`):

```powershell
npm run build
```

Deploy the `dist/` output to static hosting (Netlify, Vercel, S3 + CloudFront, etc.). Ensure the runtime environment or host rewrites routes to `index.html` for client-side routing.

Set the production API base URL using environment variables at build or runtime.

---

## API expectations & payload notes

This frontend was implemented to tolerate a few backend envelope shapes but also relies on certain field names for create/update payloads. Key notes:

- List endpoints often return an envelope like:

```json
{ "statusCode": 200, "data": [ /* array */ ], "timestamp": "..." }
```

Services in `src/services` normalize responses to handle both the plain array and the envelope above.

- Notable endpoints used by the frontend (conventional mapping):

  - `GET  /staff` — list staff
  - `POST /staff` — create staff (payload expects fields like `full_name`, `phone`, `email`, `hire_date`, `role`, `password`)
  - `GET  /patients`, `POST /patients` — patients
  - `GET/POST /appointments` — appointments
  - `GET/POST /procedures` — procedures
  - `GET/POST /expenses` — expenses (field `expense_date`, `amount`, `reason`, `staff_id`)
  - `GET/POST /incomes` — incomes (field `income_date`, `amount`, `source`, `staff_id`, optional `patient_id`)
  - `POST /clinical-documents` — upload clinical documents (multipart/form-data)

These routes are conventions inferred from the frontend code. If your backend uses different endpoints or fields, update the corresponding service file in `src/services`.

Error handling:
- Many forms surface raw server validation messages (stringified) to help developers troubleshoot 400 responses quickly. You can replace these raw messages with a richer, field-level UI later.

---

## Troubleshooting & debugging tips

- 400 validation errors when creating resources: inspect the server response body in the network tab. Backend validation errors are often descriptive JSON objects.
- 401 unauthorized errors: ensure the Authorization token (if used) is present. The AuthContext stores tokens and `src/config/axios.ts` attaches them to requests.
- CORS/network: confirm the backend accepts requests from the Vite dev server origin.
- Runtime type issues: run `npm run type-check` and fix TypeScript errors in `src/types` or service return types.

If you run into a runtime bug after the automated comment-stripper/cleanup steps, examine commit history for areas touched by the script and inspect for accidental whitespace/format changes.

---

## Contributing

- Branch from `main` and push feature branches named like `feature/<short-description>`.
- Run lint and type-check locally before opening a PR.
- If you change an API payload or response shape:
  1. Update the corresponding `src/services/*` normalization.
  2. Update `src/types` to reflect the DTO changes.
  3. Update tests (if present) and add a short note in the PR describing the backend contract change.

Recommended PR checks to add (CI):
- `npm run type-check` (tsc --noEmit)
- `npx eslint . --ext .ts,.tsx --max-warnings=0`

---

## License & acknowledgements

© Clinic Management System Frontend Team - QafLab

Built with React, Vite, TypeScript, and Material-UI.