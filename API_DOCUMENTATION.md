# Clinic Management System — API Documentation (Concise)

Note: All protected endpoints require a Bearer JWT token in `Authorization: Bearer <token>`. Role-based access is indicated per endpoint (StaffRole: ADMIN, SUPER_ADMIN, etc.). Use global ValidationPipe — requests must follow DTO shapes.

---

## Authentication
- POST /auth/login
  - Description: Authenticate user, return JWT
  - Body: { email: string, password: string }
  - Responses: 200 { accessToken, user }, 401 Unauthorized

- POST /auth/register
  - Description: Create account (if implemented)
  - Body: { name, email, password, role? }
  - Responses: 201 Created, 400 Validation error

- GET /auth/profile
  - Auth: Bearer
  - Description: Get current user profile
  - Responses: 200 { user }, 401

---

## Doctors
Base: /doctors
- POST /
  - Roles: ADMIN, SUPER_ADMIN
  - Body: CreateDoctor DTO (name, specialization, contact, availableFrom/to, etc.)
  - Responses: 201 Created, 400, 409

- GET /
  - Roles: SUPER_ADMIN (may be broader)
  - Query: offset (number), limit (number), search?
  - Responses: 200 [doctor], 401

- GET /:id
  - Roles: ADMIN, SUPER_ADMIN
  - Params: id (int)
  - Responses: 200 doctor, 404

- PUT /:id
  - Roles: ADMIN, SUPER_ADMIN
  - Body: UpdateDoctor DTO
  - Responses: 200 updated, 404, 409

- DELETE /:id
  - Roles: SUPER_ADMIN
  - Responses: 200 success message, 404

---

## Patients
Base: /patients
- POST /
  - Roles: ADMIN, SUPER_ADMIN (or open)
  - Body: CreatePatient DTO (name, dob, contact, allergies, conditions, etc.)
  - Responses: 201, 400, 409

- GET /
  - Roles: (depends)
  - Query: offset, limit, search, filters (age, condition)
  - Responses: 200 [patient]

- GET /:id
  - Roles: ADMIN, SUPER_ADMIN
  - Responses: 200, 404

- PUT /:id
  - Roles: ADMIN, SUPER_ADMIN
  - Body: UpdatePatient DTO
  - Responses: 200, 404

- DELETE /:id
  - Roles: SUPER_ADMIN
  - Responses: 200, 404

---

## Appointments
Base: /appointments
- POST /
  - Roles: ADMIN, SUPER_ADMIN (or staff)
  - Body: CreateAppointment DTO (patientId, doctorId, datetime, reason, status)
  - Responses: 201, 400, 409 (conflict: double-booking — not fully implemented)

- GET /
  - Roles: SUPER_ADMIN (or staff)
  - Query: offset, limit, dateFrom, dateTo, status, doctorId, patientId
  - Responses: 200 [appointment]

- GET /:id
  - Roles: ADMIN, SUPER_ADMIN
  - Responses: 200, 404

- PUT /:id
  - Roles: ADMIN, SUPER_ADMIN
  - Body: UpdateAppointment DTO (datetime, status, notes)
  - Responses: 200, 404, 409

- DELETE /:id
  - Roles: SUPER_ADMIN
  - Responses: 200, 404

Notes: Double-booking prevention recommended; currently partial.

---

## Medical Records
Base: /medical-records
- POST /
  - Roles: ADMIN, SUPER_ADMIN
  - Body: CreateMedicalRecord DTO (patientId, diagnosis, findings, medications, attachments?)
  - Responses: 201, 400

- GET /
  - Query: patientId, offset, limit
  - Responses: 200 [record]

- GET /:id
  - Responses: 200, 404

- PUT /:id
  - Body: UpdateMedicalRecord DTO
  - Responses: 200, 404

- DELETE /:id
  - Responses: 200, 404

---

## Treatment Plans
Base: /treatment-plans
- POST /
  - Roles: ADMIN, SUPER_ADMIN
  - Body: CreateTreatmentPlan DTO (patientId, summary, prescriptions, status)
  - Responses: 201, 400

- GET /
  - Query: patientId, status, offset, limit
  - Responses: 200 [plan]

- GET /:id
  - Responses: 200, 404

- PUT /:id
  - Body: UpdateTreatmentPlan DTO
  - Responses: 200, 404

- DELETE /:id
  - Responses: 200, 404

---

## Procedures
Base: /procedures
- POST /
  - Roles: ADMIN, SUPER_ADMIN
  - Body: CreateProceduresDto (name, code, relatedTreatmentPlanId?, duration, cost, scheduledAt?)
  - Responses: 201, 400, 409

- GET /
  - Roles: SUPER_ADMIN
  - Query: offset, limit
  - Responses: 200 [procedure]

- GET /:id
  - Roles: ADMIN, SUPER_ADMIN
  - Responses: 200, 404

- PUT /:id
  - Roles: ADMIN, SUPER_ADMIN
  - Body: UpdateProceduresDto
  - Responses: 200, 404, 409

- DELETE /:id
  - Roles: SUPER_ADMIN
  - Responses: 200, 404

---

## Staff
Base: /staff
- POST /
  - Roles: ADMIN, SUPER_ADMIN
  - Body: CreateStaff DTO (name, email, role, contact, hireDate)
  - Responses: 201, 400

- GET /
  - Roles: SUPER_ADMIN (or admin)
  - Query: offset, limit, role
  - Responses: 200 [staff]

- GET /:id
  - Responses: 200, 404

- PUT /:id
  - Responses: 200, 404

- DELETE /:id
  - Roles: SUPER_ADMIN
  - Responses: 200, 404

---

## Expenses
Base: /expenses
- POST /
  - Roles: ADMIN, SUPER_ADMIN
  - Body: CreateExpense DTO (amount, category, date, description)
  - Responses: 201, 400

- GET /
  - Query: offset, limit, dateFrom, dateTo, category
  - Responses: 200 [expense]

- GET /:id, PUT /:id, DELETE /:id
  - Standard CRUD responses

---

## Other Incomes
Base: /other-incomes
- POST /, GET /, GET /:id, PUT /:id, DELETE /:id
  - Body: CreateOtherIncome DTO (amount, source, date, notes)
  - Roles: ADMIN/SUPER_ADMIN for create/delete

---

## Clinical Documents
Base: /clinical-documents
- POST / (file upload planned)
  - Roles: ADMIN, SUPER_ADMIN
  - Body: metadata + file (not fully implemented)
  - Responses: 201, 400

- GET /
  - Query: patientId, offset, limit
  - Responses: 200 [document]

- GET /:id, PUT /:id, DELETE /:id
  - Standard CRUD responses

Note: File upload handling and validation not yet implemented — storage path fields exist.

---

## Patient Images
Base: /patient-images
- POST / (file upload planned)
  - Roles: ADMIN, SUPER_ADMIN
  - Body: patientId + image file (multer/cloud)
  - Responses: 201, 400

- GET /
  - Query: patientId, offset, limit
  - Responses: 200 [image metadata]

- GET /:id, PUT /:id, DELETE /:id
  - Standard CRUD responses

Note: File upload and secure storage pending.

---

## Common query & pagination
- offset: integer (default 0)
- limit: integer (default 10)
- dateFrom / dateTo: ISO date strings for range filters
- status: enum (appointments/treatment plans)

---

## Errors & Status Codes
- 200 OK — success
- 201 Created — resource created
- 400 Bad Request — validation error
- 401 Unauthorized — missing/invalid JWT
- 403 Forbidden — role not allowed
- 404 Not Found — resource missing
- 409 Conflict — duplicate record or business conflict

---

## Notes / Next steps
- Swagger/OpenAPI not yet enabled — recommended to add via Nest Swagger for live docs.
- File uploads (clinical documents, patient images) require multer or cloud integration and validation (size/type) — currently pending.
- RBAC guards exist but need consistent application across all controllers.
- Add example request/response payloads and authentication flow in Swagger for better developer experience.

--- 
End of concise API doc.