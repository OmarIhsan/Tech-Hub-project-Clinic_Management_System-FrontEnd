# Clinic Management System - Complete API Documentation

## Table of Contents
- [Base URL](#base-url)
- [Authentication](#authentication)
- [User Roles & Permissions](#user-roles--permissions)
- [Common Response Formats](#common-response-formats)
- [Error Handling](#error-handling)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-endpoints)
  - [Patients](#patients-endpoints)
  - [Doctors](#doctors-endpoints)
  - [Staff](#staff-endpoints)
  - [Appointments](#appointments-endpoints)
  - [Medical Records](#medical-records-endpoints)
  - [Treatment Plans](#treatment-plans-endpoints)
  - [Procedures](#procedures-endpoints)
  - [Clinical Documents](#clinical-documents-endpoints)
  - [Patient Images](#patient-images-endpoints)
  - [Expenses](#expenses-endpoints)
  - [Other Incomes](#other-incomes-endpoints)
- [Testing with Postman](#testing-with-postman)
- [Troubleshooting](#troubleshooting)

---

## Base URL

```
http://localhost:3000/api/v1
```

For production, replace with your deployed URL.

**Swagger Documentation**: Available at `http://localhost:3000/api/v1/docs`

---

## Authentication

This API uses **JWT (JSON Web Token)** authentication with Bearer scheme. After logging in or registering, you'll receive an access token that must be included in subsequent requests.

### Headers Required for Protected Routes

```http
Authorization: Bearer <your-access-token>
Content-Type: application/json
```

### Role-Based Access

Most endpoints require specific user roles. The system has **3 roles**:

- **`owner`** - Full system access (clinic owners/administrators)
- **`doctor`** - Medical operations and patient care
- **`staff`** - Front desk and scheduling (default role)

See the [User Roles & Permissions](#user-roles--permissions) section for complete details.

---

## User Roles & Permissions

### Overview

This API implements Role-Based Access Control (RBAC) with three distinct user roles. Each role has specific permissions designed for different user types in a clinic management system.

### Available Roles

The system has **3 roles** defined in the `StaffRole` enum:

#### 1. **Owner** (`owner`)
- **Description**: Clinic owner or administrator with full system access
- **Use Case**: Clinic managers, practice owners, system administrators
- **Access Level**: Complete access to all endpoints and operations
- **Capabilities**:
  - Full CRUD operations on all resources
  - Manage staff, doctors, and patients
  - View and manage financial records (expenses, incomes)
  - Configure system settings
  - Delete any records

#### 2. **Doctor** (`doctor`)
- **Description**: Medical professionals with patient care access
- **Use Case**: Physicians, specialists, medical practitioners
- **Access Level**: Medical and patient-related operations
- **Capabilities**:
  - View and manage patient records
  - Create and update medical records
  - Manage treatment plans and procedures
  - Upload clinical documents and patient images
  - Schedule and manage appointments
  - **Cannot**: Manage staff, access financial records, delete critical data

#### 3. **Staff** (`staff`)
- **Description**: Front desk, reception, or administrative staff
- **Use Case**: Receptionists, clerks, administrative assistants
- **Access Level**: Limited administrative and scheduling access
- **Default Role**: When registering without specifying a role
- **Capabilities**:
  - Create and update patient information
  - Schedule and manage appointments
  - Create expense records
  - **Cannot**: Access medical records, manage staff/doctors, view financial reports, delete records

---

### Permission Matrix

Detailed breakdown of permissions for each role across all resources:

| Resource | Owner | Doctor | Staff |
|----------|-------|--------|-------|
| **Authentication** | ✅ All | ✅ All | ✅ All |
| **Patients** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ✅ | ❌ |
| - POST Create | ✅ | ✅ | ✅ |
| - PUT Update | ✅ | ✅ | ✅ |
| - DELETE | ✅ | ❌ | ❌ |
| **Doctors** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ❌ | ❌ |
| - POST Create | ✅ | ❌ | ❌ |
| - PUT Update | ✅ | ❌ | ❌ |
| - DELETE | ✅ | ❌ | ❌ |
| **Staff** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ❌ | ❌ |
| - POST Create | ✅ | ❌ | ❌ |
| - PUT Update | ✅ | ❌ | ❌ |
| - DELETE | ✅ | ❌ | ❌ |
| **Appointments** | | | |
| - GET All | ✅ | ✅ | ✅ |
| - GET By ID | ✅ | ✅ | ✅ |
| - POST Create | ✅ | ✅ | ✅ |
| - PUT Update | ✅ | ✅ | ✅ |
| - DELETE | ✅ | ✅ | ✅ |
| **Medical Records** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ✅ | ❌ |
| - POST Create | ✅ | ✅ | ❌ |
| - PUT Update | ✅ | ✅ | ❌ |
| - DELETE | ✅ | ❌ | ❌ |
| **Treatment Plans** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ✅ | ❌ |
| - POST Create | ✅ | ✅ | ❌ |
| - PUT Update | ✅ | ✅ | ❌ |
| - DELETE | ✅ | ❌ | ❌ |
| **Procedures** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ✅ | ❌ |
| - POST Create | ✅ | ✅ | ❌ |
| - PUT Update | ✅ | ✅ | ❌ |
| - DELETE | ✅ | ❌ | ❌ |
| **Clinical Documents** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ❌ | ❌ |
| - GET File | ✅ | ✅ | ✅ |
| - POST Create | ✅ | ✅ | ❌ |
| - POST Upload Single | ✅ | ✅ | ❌ |
| - POST Upload Multiple | ✅ | ✅ | ❌ |
| - PUT Update | ✅ | ❌ | ❌ |
| - DELETE | ✅ | ❌ | ❌ |
| **Patient Images** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ✅ | ❌ |
| - GET File | ✅ | ✅ | ✅ |
| - POST Create | ✅ | ✅ | ❌ |
| - POST Upload Single | ✅ | ✅ | ❌ |
| - POST Upload Multiple | ✅ | ✅ | ❌ |
| - PUT Update | ✅ | ✅ | ❌ |
| - DELETE | ✅ | ❌ | ❌ |
| **Expenses** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ❌ | ❌ |
| - POST Create | ✅ | ✅ | ✅ |
| - PUT Update | ✅ | ❌ | ❌ |
| - DELETE | ✅ | ❌ | ❌ |
| **Other Incomes** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ❌ | ❌ |
| - POST Create | ✅ | ❌ | ❌ |
| - PUT Update | ✅ | ❌ | ❌ |
| - DELETE | ✅ | ❌ | ❌ |

**Legend:**
- ✅ = Allowed
- ❌ = Forbidden (403 Error)

---

### How Roles Are Assigned

1. **During Registration**: Specify the `role` field in the registration request:
   ```json
   {
     "email": "user@clinic.com",
     "full_name": "John Doe",
     "password": "password123",
     "phone": "+9647701234567",
     "role": "doctor"
   }
   ```

2. **Default Role**: If no role is specified, the user is assigned the `staff` role by default.

3. **Role Values**: Must be one of: `"owner"`, `"doctor"`, or `"staff"` (case-sensitive)

### Access Control Implementation

- **JWT Token**: User role is embedded in the JWT token after authentication
- **Guards**: `RolesGuard` checks if the user's role matches required roles for each endpoint
- **Decorators**: `@Roles()` decorator specifies which roles can access specific endpoints
- **Error Response**: Users without proper permissions receive a `403 Forbidden` response

### Security Notes

- Role information is stored in the database and included in JWT claims
- Roles cannot be changed by users themselves
- Only `owner` role can create, modify, or delete staff members
- Role hierarchy is enforced at the application level, not database level

---

## Common Response Formats

### Success Response
```json
{
  "data": { /* response data */ },
  "message": "Success message"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error message or array of validation errors",
  "error": "Bad Request"
}
```

---

## Error Handling

| Status Code | Meaning |
|-------------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

---

## API Endpoints

---

## Authentication Endpoints

### 1. Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Access:** Public

**Request Body:**
```json
{
  "email": "user@example.com",
  "full_name": "John Doe",
  "password": "password123",
  "phone": "+1234567890",
  "role": "staff"
}
```

### Field Validations:**
- `email` (required): Valid email format
- `full_name` (required): Minimum 2 characters
- `password` (required): Minimum 6 characters
- `phone` (required): String
- `role` (optional): Enum [`owner`, `doctor`, `staff`], defaults to `staff`

**Success Response (201):**
```json
{
  "user": {
    "staff_id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "role": "staff",
    "hire_date": null,
    "created_at": "2025-10-17T12:00:00.000Z",
    "updated_at": "2025-10-17T12:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (409):**
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

---

### 2. Login

Authenticate and receive access token.

**Endpoint:** `POST /auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "user": {
    "staff_id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "role": "staff"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

---

### 3. Change Password

Change the current user's password.

**Endpoint:** `PATCH /auth/change-password`

**Access:** Protected (Requires Authentication)

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Success Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "Current password is incorrect",
  "error": "Bad Request"
}
```

---

## Patients Endpoints

### 1. Get All Patients

Retrieve a list of all patients with pagination.

**Endpoint:** `GET /patients`

**Access:** Protected (Roles: `owner`)

**Query Parameters:**
- `offset` (optional): Number - Starting position (default: 0)
- `limit` (optional): Number - Number of records to return (default: 10)

**Example Request:**
```http
GET /api/v1/patients?offset=0&limit=10
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "patient_id": 1,
    "full_name": "Jane Smith",
    "gender": "Female",
    "phone": "+9647701234567",
    "email": "jane@example.com",
    "address": "Iraq/Mosul",
    "date_of_birth": "1990-05-15T00:00:00.000Z",
    "created_at": "2025-10-17T12:00:00.000Z",
    "updated_at": "2025-10-17T12:00:00.000Z"
  }
]
```

---

### 2. Get Patient by ID

Retrieve a specific patient's details.

**Endpoint:** `GET /patients/:id`

**Access:** Protected (Roles: `doctor`, `owner`)

**Example Request:**
```http
GET /api/v1/patients/1
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "patient_id": 1,
  "full_name": "Jane Smith",
  "gender": "Female",
  "phone": "+9647701234567",
  "email": "jane@example.com",
  "address": "Iraq/Mosul",
  "date_of_birth": "1990-05-15T00:00:00.000Z",
  "created_at": "2025-10-17T12:00:00.000Z",
  "updated_at": "2025-10-17T12:00:00.000Z"
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "Patient #1 not found",
  "error": "Not Found"
}
```

---

### 3. Create Patient

Create a new patient record.

**Endpoint:** `POST /patients`

**Access:** Protected (Roles: `staff`, `doctor`, `owner`)

**Request Body:**
```json
{
  "full_name": "Jane Smith",
  "gender": "Female",
  "phone": "+9647701234567",
  "email": "jane@example.com",
  "address": "Iraq/Mosul",
  "date_of_birth": "1990-05-15"
}
```

**Field Validations:**
- `full_name` (required): String, max 100 characters
- `gender` (required): Enum [`Male`, `Female`]
- `phone` (required): International format (+9647701234567), max 15 characters
- `email` (optional): Valid email, max 100 characters
- `address` (optional): String, max 100 characters
- `date_of_birth` (required): ISO 8601 date format

**Success Response (201):**
```json
{
  "patient_id": 1,
  "full_name": "Jane Smith",
  "gender": "Female",
  "phone": "+9647701234567",
  "email": "jane@example.com",
  "address": "Iraq/Mosul",
  "date_of_birth": "1990-05-15T00:00:00.000Z",
  "created_at": "2025-10-17T12:00:00.000Z",
  "updated_at": "2025-10-17T12:00:00.000Z"
}
```

---

### 4. Update Patient

Update an existing patient's information.

**Endpoint:** `PUT /patients/:id`

**Access:** Protected (Roles: `staff`, `doctor`, `owner`)

**Request Body:**
```json
{
  "phone": "+9647709876543",
  "address": "Iraq/Baghdad"
}
```

**Success Response (200):**
```json
{
  "patient_id": 1,
  "full_name": "Jane Smith",
  "gender": "Female",
  "phone": "+9647709876543",
  "email": "jane@example.com",
  "address": "Iraq/Baghdad",
  "date_of_birth": "1990-05-15T00:00:00.000Z",
  "created_at": "2025-10-17T12:00:00.000Z",
  "updated_at": "2025-10-17T13:00:00.000Z"
}
```

---

### 5. Delete Patient

Delete a patient record.

**Endpoint:** `DELETE /patients/:id`

**Access:** Protected (Roles: `owner`)

**Example Request:**
```http
DELETE /api/v1/patients/1
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "Patient deleted successfully"
}
```

---

## Doctors Endpoints

### 1. Get All Doctors

Retrieve a list of all doctors.

**Endpoint:** `GET /doctors`

**Access:** Protected (Roles: `owner`)

**Query Parameters:**
- `offset` (optional): Number - Starting position (default: 0)
- `limit` (optional): Number - Number of records (default: 10)

**Success Response (200):**
```json
[
  {
    "doctor_id": 1,
    "full_name": "Dr. John Smith",
    "gender": "Male",
    "phone": "+9647701234567",
    "email": "drsmith@clinic.com",
    "hire_date": "2020-01-15T00:00:00.000Z",
    "created_at": "2025-10-17T12:00:00.000Z",
    "updated_at": "2025-10-17T12:00:00.000Z"
  }
]
```

---

### 2. Get Doctor by ID

Retrieve a specific doctor's details.

**Endpoint:** `GET /doctors/:id`

**Access:** Protected (Roles: `owner`)

**Success Response (200):**
```json
{
  "doctor_id": 1,
  "full_name": "Dr. John Smith",
  "gender": "Male",
  "phone": "+9647701234567",
  "email": "drsmith@clinic.com",
  "hire_date": "2020-01-15T00:00:00.000Z",
  "created_at": "2025-10-17T12:00:00.000Z",
  "updated_at": "2025-10-17T12:00:00.000Z"
}
```

---

### 3. Create Doctor

Create a new doctor record.

**Endpoint:** `POST /doctors`

**Access:** Protected (Roles: `owner`)

**Request Body:**
```json
{
  "full_name": "Dr. John Smith",
  "gender": "Male",
  "phone": "+9647701234567",
  "email": "drsmith@clinic.com",
  "hire_date": "2020-01-15"
}
```

**Field Validations:**
- `full_name` (required): String, max 100 characters
- `gender` (required): Enum [`Male`, `Female`]
- `phone` (required): International format, max 100 characters
- `email` (required): Valid email, max 100 characters
- `hire_date` (optional): ISO 8601 date format

**Success Response (201):**
```json
{
  "doctor_id": 1,
  "full_name": "Dr. John Smith",
  "gender": "Male",
  "phone": "+9647701234567",
  "email": "drsmith@clinic.com",
  "hire_date": "2020-01-15T00:00:00.000Z",
  "created_at": "2025-10-17T12:00:00.000Z",
  "updated_at": "2025-10-17T12:00:00.000Z"
}
```

---

### 4. Update Doctor

Update doctor information.

**Endpoint:** `PUT /doctors/:id`

**Access:** Protected (Roles: `owner`)

**Request Body:**
```json
{
  "phone": "+9647709876543"
}
```

**Success Response (200):**
```json
{
  "doctor_id": 1,
  "full_name": "Dr. John Smith",
  "gender": "Male",
  "phone": "+9647709876543",
  "email": "drsmith@clinic.com",
  "hire_date": "2020-01-15T00:00:00.000Z",
  "updated_at": "2025-10-17T13:00:00.000Z"
}
```

---

### 5. Delete Doctor

Delete a doctor record.

**Endpoint:** `DELETE /doctors/:id`

**Access:** Protected (Roles: `owner`)

**Success Response (200):**
```json
{
  "message": "Doctor deleted successfully"
}
```

---

## Staff Endpoints

### 1. Get All Staff

Retrieve a list of all staff members.

**Endpoint:** `GET /staff`

**Access:** Protected (Roles: `owner`)

**Query Parameters:**
- `offset` (optional): Number (default: 0)
- `limit` (optional): Number (default: 10)

**Success Response (200):**
```json
[
  {
    "staff_id": 1,
    "email": "staff@clinic.com",
    "full_name": "John Doe",
    "phone": "+9647701234567",
    "role": "staff",
    "hire_date": "2023-01-15T00:00:00.000Z",
    "created_at": "2025-10-17T12:00:00.000Z",
    "updated_at": "2025-10-17T12:00:00.000Z"
  }
]
```

---

### 2. Get Staff by ID

Retrieve a specific staff member.

**Endpoint:** `GET /staff/:id`

**Access:** Protected (Roles: `owner`)

**Success Response (200):**
```json
{
  "staff_id": 1,
  "email": "staff@clinic.com",
  "full_name": "John Doe",
  "phone": "+9647701234567",
  "role": "staff",
  "hire_date": "2023-01-15T00:00:00.000Z",
  "created_at": "2025-10-17T12:00:00.000Z",
  "updated_at": "2025-10-17T12:00:00.000Z"
}
```

---

### 3. Create Staff

Create a new staff member.

**Endpoint:** `POST /staff`

**Access:** Protected (Roles: `owner`)

**Request Body:**
```json
{
  "email": "newstaff@clinic.com",
  "full_name": "Jane Doe",
  "password": "password123",
  "phone": "+9647701234567",
  "role": "staff",
  "hire_date": "2025-10-17"
}
```

**Field Validations:**
- `email` (required): Valid email format, max 100 characters
- `full_name` (required): String, max 100 characters
- `password` (required): Minimum 6 characters
- `phone` (optional): String, max 20 characters
- `role` (optional): Enum [`owner`, `doctor`, `staff`], defaults to `staff`
- `hire_date` (optional): ISO 8601 date format

**Success Response (201):**
```json
{
  "staff_id": 2,
  "email": "newstaff@clinic.com",
  "full_name": "Jane Doe",
  "phone": "+9647701234567",
  "role": "staff",
  "hire_date": "2025-10-17T00:00:00.000Z",
  "created_at": "2025-10-17T12:00:00.000Z",
  "updated_at": "2025-10-17T12:00:00.000Z"
}
```

---

### 4. Update Staff

Update staff member information.

**Endpoint:** `PUT /staff/:id`

**Access:** Protected (Roles: `owner`)

**Request Body:**
```json
{
  "phone": "+9647709876543",
  "role": "doctor"
}
```

**Success Response (200):**
```json
{
  "staff_id": 2,
  "email": "newstaff@clinic.com",
  "full_name": "Jane Doe",
  "phone": "+9647709876543",
  "role": "doctor",
  "hire_date": "2025-10-17T00:00:00.000Z",
  "updated_at": "2025-10-17T13:00:00.000Z"
}
```

---

### 5. Delete Staff

Delete a staff member.

**Endpoint:** `DELETE /staff/:id`

**Access:** Protected (Roles: `owner`)

**Success Response (200):**
```json
{
  "message": "Staff deleted successfully"
}
```

---

## Appointments Endpoints

### 1. Get All Appointments

Retrieve all appointments.

**Endpoint:** `GET /appointment`

**Access:** Protected (Roles: `staff`, `doctor`, `owner`)

**Query Parameters:**
- `offset` (optional): Number (default: 0)
- `limit` (optional): Number (default: 10)

**Success Response (200):**
```json
[
  {
    "id": 1,
    "patient_id": 1,
    "doctor_id": 1,
    "appointment_time": "2025-10-20T10:00:00.000Z",
    "status": "scheduled",
    "patient": {
      "patient_id": 1,
      "full_name": "Jane Smith"
    },
    "doctor": {
      "doctor_id": 1,
      "full_name": "Dr. John Smith"
    },
    "createdAt": "2025-10-17T12:00:00.000Z",
    "updatedAt": "2025-10-17T12:00:00.000Z"
  }
]
```

---

### 2. Get Appointment by ID

Retrieve a specific appointment.

**Endpoint:** `GET /appointment/:id`

**Access:** Protected (Roles: `staff`, `doctor`, `owner`)

**Success Response (200):**
```json
{
  "id": 1,
  "patient_id": 1,
  "doctor_id": 1,
  "appointment_time": "2025-10-20T10:00:00.000Z",
  "status": "scheduled",
  "patient": {
    "patient_id": 1,
    "full_name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+9647701234567"
  },
  "doctor": {
    "doctor_id": 1,
    "full_name": "Dr. John Smith",
    "email": "drsmith@clinic.com"
  },
  "createdAt": "2025-10-17T12:00:00.000Z",
  "updatedAt": "2025-10-17T12:00:00.000Z"
}
```

---

### 3. Create Appointment

Create a new appointment.

**Endpoint:** `POST /appointment`

**Access:** Protected (Roles: `staff`, `doctor`, `owner`)

**Request Body:**
```json
{
  "patient_id": 1,
  "doctor_id": 1,
  "appointment_time": "2025-10-20T10:00:00.000Z",
  "status": "scheduled"
}
```

**Field Validations:**
- `patient_id` (required): Integer
- `doctor_id` (required): Integer
- `appointment_time` (required): ISO 8601 datetime string
- `status` (optional): Enum [`scheduled`, `completed`, `cancelled`, `no_show`], defaults to `scheduled`

**Success Response (201):**
```json
{
  "id": 1,
  "patient_id": 1,
  "doctor_id": 1,
  "appointment_time": "2025-10-20T10:00:00.000Z",
  "status": "scheduled",
  "createdAt": "2025-10-17T12:00:00.000Z",
  "updatedAt": "2025-10-17T12:00:00.000Z"
}
```

---

### 4. Update Appointment

Update appointment details.

**Endpoint:** `PUT /appointment/:id`

**Access:** Protected (Roles: `staff`, `doctor`, `owner`)

**Request Body:**
```json
{
  "status": "completed",
  "appointment_time": "2025-10-20T11:00:00.000Z"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "patient_id": 1,
  "doctor_id": 1,
  "appointment_time": "2025-10-20T11:00:00.000Z",
  "status": "completed",
  "updatedAt": "2025-10-20T11:00:00.000Z"
}
```

---

### 5. Delete Appointment

Delete an appointment.

**Endpoint:** `DELETE /appointment/:id`

**Access:** Protected (Roles: `staff`, `doctor`, `owner`)

**Success Response (200):**
```json
{
  "message": "Appointment deleted successfully"
}
```

---

## Medical Records Endpoints

### 1. Get All Medical Records

Retrieve all medical records.

**Endpoint:** `GET /medical-records`

**Access:** Protected (Roles: `owner`)

**Query Parameters:**
- `offset` (optional): Number (default: 0)
- `limit` (optional): Number (default: 10)

**Success Response (200):**
```json
[
  {
    "id": 1,
    "patient_id": 1,
    "doctor_id": 1,
    "diagnosis": "Acute Gastroenteritis",
    "clinical_findings": "Abdominal pain, vomiting, dehydration",
    "treatment": "IV fluids, antiemetics, dietary modification",
    "allergies": "Penicillin, peanuts",
    "medical_conditions": "Hypertension, diabetes",
    "current_meds_json": { "medications": ["Metformin", "Lisinopril"] },
    "patient": {
      "patient_id": 1,
      "full_name": "Jane Smith"
    },
    "doctor": {
      "doctor_id": 1,
      "full_name": "Dr. John Smith"
    },
    "createdAt": "2025-10-17T12:00:00.000Z",
    "updatedAt": "2025-10-17T12:00:00.000Z"
  }
]
```

---

### 2. Get Medical Record by ID

Retrieve a specific medical record.

**Endpoint:** `GET /medical-records/:id`

**Access:** Protected (Roles: `doctor`, `owner`)

**Success Response (200):**
```json
{
  "id": 1,
  "patient_id": 1,
  "doctor_id": 1,
  "diagnosis": "Acute Gastroenteritis",
  "clinical_findings": "Abdominal pain, vomiting, dehydration",
  "treatment": "IV fluids, antiemetics, dietary modification",
  "allergies": "Penicillin, peanuts",
  "medical_conditions": "Hypertension, diabetes",
  "current_meds_json": { "medications": ["Metformin", "Lisinopril"] },
  "patient": {
    "patient_id": 1,
    "full_name": "Jane Smith"
  },
  "doctor": {
    "doctor_id": 1,
    "full_name": "Dr. John Smith"
  },
  "createdAt": "2025-10-17T12:00:00.000Z",
  "updatedAt": "2025-10-17T12:00:00.000Z"
}
```

---

### 3. Create Medical Record

Create a new medical record.

**Endpoint:** `POST /medical-records`

**Access:** Protected (Roles: `doctor`, `owner`)

**Request Body:**
```json
{
  "patient_id": 1,
  "doctor_id": 1,
  "diagnosis": "Acute Gastroenteritis",
  "clinical_findings": "Abdominal pain, vomiting, dehydration",
  "treatment": "IV fluids, antiemetics, dietary modification",
  "allergies": "Penicillin, peanuts",
  "medical_conditions": "Hypertension, diabetes",
  "current_meds_json": { "medications": ["Metformin", "Lisinopril"] }
}
```

**Field Validations:**
- `patient_id` (required): Integer
- `doctor_id` (required): Integer
- `diagnosis` (required): String, max 100 characters
- `clinical_findings` (required): String, max 100 characters
- `treatment` (required): String, max 100 characters
- `allergies` (required): String, max 100 characters
- `medical_conditions` (optional): String, max 100 characters
- `current_meds_json` (optional): JSON object

**Success Response (201):**
```json
{
  "id": 1,
  "patient_id": 1,
  "doctor_id": 1,
  "diagnosis": "Acute Gastroenteritis",
  "clinical_findings": "Abdominal pain, vomiting, dehydration",
  "treatment": "IV fluids, antiemetics, dietary modification",
  "allergies": "Penicillin, peanuts",
  "medical_conditions": "Hypertension, diabetes",
  "current_meds_json": { "medications": ["Metformin", "Lisinopril"] },
  "createdAt": "2025-10-17T12:00:00.000Z",
  "updatedAt": "2025-10-17T12:00:00.000Z"
}
```

---

### 4. Update Medical Record

Update a medical record.

**Endpoint:** `PUT /medical-records/:id`

**Access:** Protected (Roles: `doctor`, `owner`)

**Request Body:**
```json
{
  "treatment": "IV fluids, antiemetics, dietary modification, probiotics",
  "current_meds_json": { "medications": ["Metformin", "Lisinopril", "Probiotics"] }
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "treatment": "IV fluids, antiemetics, dietary modification, probiotics",
  "current_meds_json": { "medications": ["Metformin", "Lisinopril", "Probiotics"] },
  "updatedAt": "2025-10-17T13:00:00.000Z"
}
```

---

### 5. Delete Medical Record

Delete a medical record.

**Endpoint:** `DELETE /medical-records/:id`

**Access:** Protected (Roles: `owner`)

**Success Response (200):**
```json
{
  "message": "Medical record deleted successfully"
}
```

---

## Treatment Plans Endpoints

### 1. Get All Treatment Plans

Retrieve all treatment plans.

**Endpoint:** `GET /treatment-plans`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Query Parameters:**
- `offset` (optional): Number
- `limit` (optional): Number

**Success Response (200):**
```json
[
  {
    "plan_id": 1,
    "patient": {
      "patient_id": 1,
      "full_name": "Jane Smith"
    },
    "doctor": {
      "doctor_id": 1,
      "full_name": "Dr. John Smith"
    },
    "treatment_description": "Physical therapy for 3 months",
    "start_date": "2025-10-17T00:00:00.000Z",
    "end_date": "2026-01-17T00:00:00.000Z",
    "status": "ongoing",
    "createdAt": "2025-10-17T12:00:00.000Z",
    "updatedAt": "2025-10-17T12:00:00.000Z"
  }
]
```

---

### 2. Get Treatment Plan by ID

Retrieve a specific treatment plan.

**Endpoint:** `GET /treatment-plans/:id`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Success Response (200):**
```json
{
  "plan_id": 1,
  "patient": {
    "patient_id": 1,
    "full_name": "Jane Smith"
  },
  "doctor": {
    "doctor_id": 1,
    "full_name": "Dr. John Smith"
  },
  "treatment_description": "Physical therapy for 3 months",
  "start_date": "2025-10-17T00:00:00.000Z",
  "end_date": "2026-01-17T00:00:00.000Z",
  "status": "ongoing",
  "createdAt": "2025-10-17T12:00:00.000Z",
  "updatedAt": "2025-10-17T12:00:00.000Z"
}
```

---

### 3. Create Treatment Plan

Create a new treatment plan.

**Endpoint:** `POST /treatment-plans`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Request Body:**
```json
{
  "patientId": 1,
  "doctorId": 1,
  "treatment_description": "Physical therapy for 3 months",
  "start_date": "2025-10-17",
  "end_date": "2026-01-17",
  "status": "ongoing"
}
```

**Field Validations:**
- `status`: Enum [`ongoing`, `completed`, `cancelled`]

**Success Response (201):**
```json
{
  "plan_id": 1,
  "patient": { "patient_id": 1 },
  "doctor": { "doctor_id": 1 },
  "treatment_description": "Physical therapy for 3 months",
  "start_date": "2025-10-17T00:00:00.000Z",
  "end_date": "2026-01-17T00:00:00.000Z",
  "status": "ongoing",
  "createdAt": "2025-10-17T12:00:00.000Z"
}
```

---

### 4. Update Treatment Plan

Update a treatment plan.

**Endpoint:** `PUT /treatment-plans/:id`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Request Body:**
```json
{
  "status": "completed",
  "end_date": "2025-12-17"
}
```

**Success Response (200):**
```json
{
  "plan_id": 1,
  "status": "completed",
  "end_date": "2025-12-17T00:00:00.000Z",
  "updatedAt": "2025-10-17T13:00:00.000Z"
}
```

---

### 5. Delete Treatment Plan

Delete a treatment plan.

**Endpoint:** `DELETE /treatment-plans/:id`

**Access:** Protected (Roles: `super_admin`)

**Success Response (200):**
```json
{
  "message": "Treatment plan deleted successfully"
}
```

---

## Procedures Endpoints

### 1. Get All Procedures

Retrieve all procedures.

**Endpoint:** `GET /procedures`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Query Parameters:**
- `offset` (optional): Number
- `limit` (optional): Number

**Success Response (200):**
```json
[
  {
    "procedure_id": 1,
    "patient": {
      "patient_id": 1,
      "full_name": "Jane Smith"
    },
    "doctor": {
      "doctor_id": 1,
      "full_name": "Dr. John Smith"
    },
    "procedure_name": "Blood Test",
    "procedure_date": "2025-10-17T14:00:00.000Z",
    "cost": 150.00,
    "notes": "Routine blood work",
    "createdAt": "2025-10-17T12:00:00.000Z",
    "updatedAt": "2025-10-17T12:00:00.000Z"
  }
]
```

---

### 2. Get Procedure by ID

Retrieve a specific procedure.

**Endpoint:** `GET /procedures/:id`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Success Response (200):**
```json
{
  "procedure_id": 1,
  "patient": {
    "patient_id": 1,
    "full_name": "Jane Smith"
  },
  "doctor": {
    "doctor_id": 1,
    "full_name": "Dr. John Smith"
  },
  "procedure_name": "Blood Test",
  "procedure_date": "2025-10-17T14:00:00.000Z",
  "cost": 150.00,
  "notes": "Routine blood work",
  "createdAt": "2025-10-17T12:00:00.000Z",
  "updatedAt": "2025-10-17T12:00:00.000Z"
}
```

---

### 3. Create Procedure

Create a new procedure record.

**Endpoint:** `POST /procedures`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Request Body:**
```json
{
  "patientId": 1,
  "doctorId": 1,
  "procedure_name": "Blood Test",
  "procedure_date": "2025-10-17T14:00:00.000Z",
  "cost": 150.00,
  "notes": "Routine blood work"
}
```

**Success Response (201):**
```json
{
  "procedure_id": 1,
  "patient": { "patient_id": 1 },
  "doctor": { "doctor_id": 1 },
  "procedure_name": "Blood Test",
  "procedure_date": "2025-10-17T14:00:00.000Z",
  "cost": 150.00,
  "notes": "Routine blood work",
  "createdAt": "2025-10-17T12:00:00.000Z"
}
```

---

### 4. Update Procedure

Update procedure information.

**Endpoint:** `PUT /procedures/:id`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Request Body:**
```json
{
  "cost": 175.00,
  "notes": "Complete blood count with additional tests"
}
```

**Success Response (200):**
```json
{
  "procedure_id": 1,
  "cost": 175.00,
  "notes": "Complete blood count with additional tests",
  "updatedAt": "2025-10-17T13:00:00.000Z"
}
```

---

### 5. Delete Procedure

Delete a procedure record.

**Endpoint:** `DELETE /procedures/:id`

**Access:** Protected (Roles: `super_admin`)

**Success Response (200):**
```json
{
  "message": "Procedure deleted successfully"
}
```

---

## Clinical Documents Endpoints

### 1. Get All Clinical Documents

Retrieve all clinical documents.

**Endpoint:** `GET /clinical-documents`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Query Parameters:**
- `offset` (optional): Number
- `limit` (optional): Number

**Success Response (200):**
```json
[
  {
    "document_id": 1,
    "patient": {
      "patient_id": 1,
      "full_name": "Jane Smith"
    },
    "uploadedByStaff": {
      "staff_id": 1,
      "full_name": "John Doe"
    },
    "document_type": "Lab Report",
    "file_path": "uploads/clinical_documents/report_1634567890.pdf",
    "upload_date": "2025-10-17T12:00:00.000Z",
    "createdAt": "2025-10-17T12:00:00.000Z",
    "updatedAt": "2025-10-17T12:00:00.000Z"
  }
]
```

---

### 2. Get Clinical Document by ID

Retrieve a specific clinical document.

**Endpoint:** `GET /clinical-documents/:id`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Success Response (200):**
```json
{
  "document_id": 1,
  "patient": {
    "patient_id": 1,
    "full_name": "Jane Smith"
  },
  "uploadedByStaff": {
    "staff_id": 1,
    "full_name": "John Doe"
  },
  "document_type": "Lab Report",
  "file_path": "uploads/clinical_documents/report_1634567890.pdf",
  "upload_date": "2025-10-17T12:00:00.000Z",
  "createdAt": "2025-10-17T12:00:00.000Z"
}
```

---

### 3. Get Document File

Download or view a clinical document file.

**Endpoint:** `GET /clinical-documents/file/:filename`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Example Request:**
```http
GET /api/v1/clinical-documents/file/report_1634567890.pdf
Authorization: Bearer <token>
```

**Success Response (200):**
Returns the file with appropriate content-type header.

---

### 4. Create Clinical Document (JSON)

Create a clinical document record without file upload.

**Endpoint:** `POST /clinical-documents`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Request Body:**
```json
{
  "patientId": 1,
  "uploadedByStaffId": 1,
  "document_type": "Lab Report",
  "file_path": "uploads/clinical_documents/report.pdf",
  "upload_date": "2025-10-17T12:00:00.000Z"
}
```

**Success Response (201):**
```json
{
  "document_id": 1,
  "patient": { "patient_id": 1 },
  "uploadedByStaff": { "staff_id": 1 },
  "document_type": "Lab Report",
  "file_path": "uploads/clinical_documents/report.pdf",
  "upload_date": "2025-10-17T12:00:00.000Z",
  "createdAt": "2025-10-17T12:00:00.000Z"
}
```

---

### 5. Upload Single Clinical Document

Upload a clinical document file.

**Endpoint:** `POST /clinical-documents/upload`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: File (required)
- `patientId`: Number (required)
- `uploadedByStaffId`: Number (required)
- `document_type`: String (required)

**Example with cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/clinical-documents/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/document.pdf" \
  -F "patientId=1" \
  -F "uploadedByStaffId=1" \
  -F "document_type=Lab Report"
```

**Success Response (201):**
```json
{
  "message": "File uploaded successfully",
  "document": {
    "document_id": 1,
    "patient": { "patient_id": 1 },
    "uploadedByStaff": { "staff_id": 1 },
    "document_type": "Lab Report",
    "file_path": "uploads/clinical_documents/1634567890-document.pdf",
    "upload_date": "2025-10-17T12:00:00.000Z"
  }
}
```

---

### 6. Upload Multiple Clinical Documents

Upload multiple clinical documents at once.

**Endpoint:** `POST /clinical-documents/upload-multiple`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Content-Type:** `multipart/form-data`

**Form Data:**
- `files`: Multiple Files (required)
- `patientId`: Number (required)
- `uploadedByStaffId`: Number (required)
- `document_type`: String (required)

**Example with cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/clinical-documents/upload-multiple \
  -H "Authorization: Bearer <token>" \
  -F "files=@/path/to/document1.pdf" \
  -F "files=@/path/to/document2.pdf" \
  -F "patientId=1" \
  -F "uploadedByStaffId=1" \
  -F "document_type=Lab Report"
```

**Success Response (201):**
```json
{
  "message": "Files uploaded successfully",
  "documents": [
    {
      "document_id": 1,
      "file_path": "uploads/clinical_documents/1634567890-document1.pdf"
    },
    {
      "document_id": 2,
      "file_path": "uploads/clinical_documents/1634567891-document2.pdf"
    }
  ]
}
```

---

### 7. Update Clinical Document

Update clinical document metadata.

**Endpoint:** `PUT /clinical-documents/:id`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Request Body:**
```json
{
  "document_type": "Updated Lab Report"
}
```

**Success Response (200):**
```json
{
  "document_id": 1,
  "document_type": "Updated Lab Report",
  "updatedAt": "2025-10-17T13:00:00.000Z"
}
```

---

### 8. Delete Clinical Document

Delete a clinical document (also deletes the file from server).

**Endpoint:** `DELETE /clinical-documents/:id`

**Access:** Protected (Roles: `super_admin`)

**Success Response (200):**
```json
{
  "message": "Clinical document deleted successfully"
}
```

---

## Patient Images Endpoints

### 1. Get All Patient Images

Retrieve all patient images.

**Endpoint:** `GET /patient-images`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Query Parameters:**
- `offset` (optional): Number
- `limit` (optional): Number

**Success Response (200):**
```json
[
  {
    "image_id": 1,
    "patient": {
      "patient_id": 1,
      "full_name": "Jane Smith"
    },
    "uploadedByStaff": {
      "staff_id": 1,
      "full_name": "John Doe"
    },
    "image_type": "X-Ray",
    "file_path": "uploads/patient-images/xray_1634567890.jpg",
    "upload_date": "2025-10-17T12:00:00.000Z",
    "createdAt": "2025-10-17T12:00:00.000Z",
    "updatedAt": "2025-10-17T12:00:00.000Z"
  }
]
```

---

### 2. Get Patient Image by ID

Retrieve a specific patient image.

**Endpoint:** `GET /patient-images/:id`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Success Response (200):**
```json
{
  "image_id": 1,
  "patient": {
    "patient_id": 1,
    "full_name": "Jane Smith"
  },
  "uploadedByStaff": {
    "staff_id": 1,
    "full_name": "John Doe"
  },
  "image_type": "X-Ray",
  "file_path": "uploads/patient-images/xray_1634567890.jpg",
  "upload_date": "2025-10-17T12:00:00.000Z",
  "createdAt": "2025-10-17T12:00:00.000Z"
}
```

---

### 3. Get Image File

Download or view a patient image file.

**Endpoint:** `GET /patient-images/file/:filename`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Example Request:**
```http
GET /api/v1/patient-images/file/xray_1634567890.jpg
Authorization: Bearer <token>
```

**Success Response (200):**
Returns the image file with appropriate content-type header.

---

### 4. Create Patient Image (JSON)

Create a patient image record without file upload.

**Endpoint:** `POST /patient-images`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Request Body:**
```json
{
  "patientId": 1,
  "uploadedByStaffId": 1,
  "image_type": "X-Ray",
  "file_path": "uploads/patient-images/xray.jpg",
  "upload_date": "2025-10-17T12:00:00.000Z"
}
```

**Success Response (201):**
```json
{
  "image_id": 1,
  "patient": { "patient_id": 1 },
  "uploadedByStaff": { "staff_id": 1 },
  "image_type": "X-Ray",
  "file_path": "uploads/patient-images/xray.jpg",
  "upload_date": "2025-10-17T12:00:00.000Z",
  "createdAt": "2025-10-17T12:00:00.000Z"
}
```

---

### 5. Upload Single Patient Image

Upload a patient image file.

**Endpoint:** `POST /patient-images/upload`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: Image File (required)
- `patientId`: Number (required)
- `uploadedByStaffId`: Number (required)
- `image_type`: String (required)

**Example with cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/patient-images/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/xray.jpg" \
  -F "patientId=1" \
  -F "uploadedByStaffId=1" \
  -F "image_type=X-Ray"
```

**Success Response (201):**
```json
{
  "message": "Image uploaded successfully",
  "image": {
    "image_id": 1,
    "patient": { "patient_id": 1 },
    "uploadedByStaff": { "staff_id": 1 },
    "image_type": "X-Ray",
    "file_path": "uploads/patient-images/1634567890-xray.jpg",
    "upload_date": "2025-10-17T12:00:00.000Z"
  }
}
```

---

### 6. Upload Multiple Patient Images

Upload multiple patient images at once.

**Endpoint:** `POST /patient-images/upload-multiple`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Content-Type:** `multipart/form-data`

**Form Data:**
- `files`: Multiple Image Files (required)
- `patientId`: Number (required)
- `uploadedByStaffId`: Number (required)
- `image_type`: String (required)

**Example with cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/patient-images/upload-multiple \
  -H "Authorization: Bearer <token>" \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg" \
  -F "patientId=1" \
  -F "uploadedByStaffId=1" \
  -F "image_type=X-Ray"
```

**Success Response (201):**
```json
{
  "message": "Images uploaded successfully",
  "images": [
    {
      "image_id": 1,
      "file_path": "uploads/patient-images/1634567890-image1.jpg"
    },
    {
      "image_id": 2,
      "file_path": "uploads/patient-images/1634567891-image2.jpg"
    }
  ]
}
```

---

### 7. Update Patient Image

Update patient image metadata.

**Endpoint:** `PUT /patient-images/:id`

**Access:** Protected (Roles: `super_admin`, `admin`, `staff`)

**Request Body:**
```json
{
  "image_type": "CT Scan"
}
```

**Success Response (200):**
```json
{
  "image_id": 1,
  "image_type": "CT Scan",
  "updatedAt": "2025-10-17T13:00:00.000Z"
}
```

---

### 8. Delete Patient Image

Delete a patient image (also deletes the file from server).

**Endpoint:** `DELETE /patient-images/:id`

**Access:** Protected (Roles: `super_admin`)

**Success Response (200):**
```json
{
  "message": "Patient image deleted successfully"
}
```

---

## Expenses Endpoints

### 1. Get All Expenses

Retrieve all expense records.

**Endpoint:** `GET /expenses`

**Access:** Protected (Roles: `super_admin`, `admin`)

**Query Parameters:**
- `offset` (optional): Number
- `limit` (optional): Number

**Success Response (200):**
```json
[
  {
    "expense_id": 1,
    "recordedByStaff": {
      "staff_id": 1,
      "full_name": "John Doe"
    },
    "expense_date": "2025-10-17T00:00:00.000Z",
    "amount": 500.00,
    "category": "Medical Supplies",
    "description": "Purchase of surgical gloves and masks",
    "createdAt": "2025-10-17T12:00:00.000Z",
    "updatedAt": "2025-10-17T12:00:00.000Z"
  }
]
```

---

### 2. Get Expense by ID

Retrieve a specific expense record.

**Endpoint:** `GET /expenses/:id`

**Access:** Protected (Roles: `super_admin`, `admin`)

**Success Response (200):**
```json
{
  "expense_id": 1,
  "recordedByStaff": {
    "staff_id": 1,
    "full_name": "John Doe"
  },
  "expense_date": "2025-10-17T00:00:00.000Z",
  "amount": 500.00,
  "category": "Medical Supplies",
  "description": "Purchase of surgical gloves and masks",
  "createdAt": "2025-10-17T12:00:00.000Z",
  "updatedAt": "2025-10-17T12:00:00.000Z"
}
```

---

### 3. Create Expense

Create a new expense record.

**Endpoint:** `POST /expenses`

**Access:** Protected (Roles: `super_admin`, `admin`)

**Request Body:**
```json
{
  "recordedByStaffId": 1,
  "expense_date": "2025-10-17",
  "amount": 500.00,
  "category": "Medical Supplies",
  "description": "Purchase of surgical gloves and masks"
}
```

**Success Response (201):**
```json
{
  "expense_id": 1,
  "recordedByStaff": { "staff_id": 1 },
  "expense_date": "2025-10-17T00:00:00.000Z",
  "amount": 500.00,
  "category": "Medical Supplies",
  "description": "Purchase of surgical gloves and masks",
  "createdAt": "2025-10-17T12:00:00.000Z"
}
```

---

### 4. Update Expense

Update an expense record.

**Endpoint:** `PUT /expenses/:id`

**Access:** Protected (Roles: `super_admin`, `admin`)

**Request Body:**
```json
{
  "amount": 550.00,
  "description": "Purchase of surgical gloves, masks, and sanitizers"
}
```

**Success Response (200):**
```json
{
  "expense_id": 1,
  "amount": 550.00,
  "description": "Purchase of surgical gloves, masks, and sanitizers",
  "updatedAt": "2025-10-17T13:00:00.000Z"
}
```

---

### 5. Delete Expense

Delete an expense record.

**Endpoint:** `DELETE /expenses/:id`

**Access:** Protected (Roles: `super_admin`)

**Success Response (200):**
```json
{
  "message": "Expense deleted successfully"
}
```

---

## Other Incomes Endpoints

### 1. Get All Other Incomes

Retrieve all other income records.

**Endpoint:** `GET /other-incomes`

**Access:** Protected (Roles: `super_admin`, `admin`)

**Query Parameters:**
- `offset` (optional): Number
- `limit` (optional): Number

**Success Response (200):**
```json
[
  {
    "income_id": 1,
    "recordedByStaff": {
      "staff_id": 1,
      "full_name": "John Doe"
    },
    "income_date": "2025-10-17T00:00:00.000Z",
    "amount": 1000.00,
    "source": "Equipment Rental",
    "description": "Rental of ultrasound machine to another clinic",
    "createdAt": "2025-10-17T12:00:00.000Z",
    "updatedAt": "2025-10-17T12:00:00.000Z"
  }
]
```

---

### 2. Get Other Income by ID

Retrieve a specific other income record.

**Endpoint:** `GET /other-incomes/:id`

**Access:** Protected (Roles: `super_admin`, `admin`)

**Success Response (200):**
```json
{
  "income_id": 1,
  "recordedByStaff": {
    "staff_id": 1,
    "full_name": "John Doe"
  },
  "income_date": "2025-10-17T00:00:00.000Z",
  "amount": 1000.00,
  "source": "Equipment Rental",
  "description": "Rental of ultrasound machine to another clinic",
  "createdAt": "2025-10-17T12:00:00.000Z",
  "updatedAt": "2025-10-17T12:00:00.000Z"
}
```

---

### 3. Create Other Income

Create a new other income record.

**Endpoint:** `POST /other-incomes`

**Access:** Protected (Roles: `super_admin`, `admin`)

**Request Body:**
```json
{
  "recordedByStaffId": 1,
  "income_date": "2025-10-17",
  "amount": 1000.00,
  "source": "Equipment Rental",
  "description": "Rental of ultrasound machine to another clinic"
}
```

**Success Response (201):**
```json
{
  "income_id": 1,
  "recordedByStaff": { "staff_id": 1 },
  "income_date": "2025-10-17T00:00:00.000Z",
  "amount": 1000.00,
  "source": "Equipment Rental",
  "description": "Rental of ultrasound machine to another clinic",
  "createdAt": "2025-10-17T12:00:00.000Z"
}
```

---

### 4. Update Other Income

Update an other income record.

**Endpoint:** `PUT /other-incomes/:id`

**Access:** Protected (Roles: `super_admin`, `admin`)

**Request Body:**
```json
{
  "amount": 1200.00,
  "description": "Rental of ultrasound machine - Extended period"
}
```

**Success Response (200):**
```json
{
  "income_id": 1,
  "amount": 1200.00,
  "description": "Rental of ultrasound machine - Extended period",
  "updatedAt": "2025-10-17T13:00:00.000Z"
}
```

---

### 5. Delete Other Income

Delete an other income record.

**Endpoint:** `DELETE /other-incomes/:id`

**Access:** Protected (Roles: `super_admin`)

**Success Response (200):**
```json
{
  "message": "Other income deleted successfully"
}
```

---

## User Roles & Permissions

### Overview

This API implements Role-Based Access Control (RBAC) with three distinct user roles. Each role has specific permissions designed for different user types in a clinic management system.

### Available Roles

The system has **3 roles** defined in the `StaffRole` enum:

#### 1. **Owner** (`owner`)
- **Description**: Clinic owner or administrator with full system access
- **Use Case**: Clinic managers, practice owners, system administrators
- **Access Level**: Complete access to all endpoints and operations
- **Capabilities**:
  - Full CRUD operations on all resources
  - Manage staff, doctors, and patients
  - View and manage financial records (expenses, incomes)
  - Configure system settings
  - Delete any records

#### 2. **Doctor** (`doctor`)
- **Description**: Medical professionals with patient care access
- **Use Case**: Physicians, specialists, medical practitioners
- **Access Level**: Medical and patient-related operations
- **Capabilities**:
  - View and manage patient records
  - Create and update medical records
  - Manage treatment plans and procedures
  - Upload clinical documents and patient images
  - Schedule and manage appointments
  - **Cannot**: Manage staff, access financial records, delete critical data

#### 3. **Staff** (`staff`)
- **Description**: Front desk, reception, or administrative staff
- **Use Case**: Receptionists, clerks, administrative assistants
- **Access Level**: Limited administrative and scheduling access
- **Default Role**: When registering without specifying a role
- **Capabilities**:
  - Create and update patient information
  - Schedule and manage appointments
  - Create expense records
  - **Cannot**: Access medical records, manage staff/doctors, view financial reports, delete records

---

### Permission Matrix

Detailed breakdown of permissions for each role across all resources:

| Resource | Owner | Doctor | Staff |
|----------|-------|--------|-------|
| **Authentication** | ✅ All | ✅ All | ✅ All |
| **Patients** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ✅ | ❌ |
| - POST Create | ✅ | ✅ | ✅ |
| - PUT Update | ✅ | ✅ | ✅ |
| - DELETE | ✅ | ❌ | ❌ |
| **Doctors** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ❌ | ❌ |
| - POST Create | ✅ | ❌ | ❌ |
| - PUT Update | ✅ | ❌ | ❌ |
| - DELETE | ✅ | ❌ | ❌ |
| **Staff** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ❌ | ❌ |
| - POST Create | ✅ | ❌ | ❌ |
| - PUT Update | ✅ | ❌ | ❌ |
| - DELETE | ✅ | ❌ | ❌ |
| **Appointments** | | | |
| - GET All | ✅ | ✅ | ✅ |
| - GET By ID | ✅ | ✅ | ✅ |
| - POST Create | ✅ | ✅ | ✅ |
| - PUT Update | ✅ | ✅ | ✅ |
| - DELETE | ✅ | ✅ | ✅ |
| **Medical Records** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ✅ | ❌ |
| - POST Create | ✅ | ✅ | ❌ |
| - PUT Update | ✅ | ✅ | ❌ |
| - DELETE | ✅ | ❌ | ❌ |
| **Treatment Plans** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ✅ | ❌ |
| - POST Create | ✅ | ✅ | ❌ |
| - PUT Update | ✅ | ✅ | ❌ |
| - DELETE | ✅ | ❌ | ❌ |
| **Procedures** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ✅ | ❌ |
| - POST Create | ✅ | ✅ | ❌ |
| - PUT Update | ✅ | ✅ | ❌ |
| - DELETE | ✅ | ❌ | ❌ |
| **Clinical Documents** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ❌ | ❌ |
| - GET File | ✅ | ✅ | ✅ |
| - POST Create | ✅ | ✅ | ❌ |
| - POST Upload Single | ✅ | ✅ | ❌ |
| - POST Upload Multiple | ✅ | ✅ | ❌ |
| - PUT Update | ✅ | ❌ | ❌ |
| - DELETE | ✅ | ❌ | ❌ |
| **Patient Images** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ✅ | ❌ |
| - GET File | ✅ | ✅ | ✅ |
| - POST Create | ✅ | ✅ | ❌ |
| - POST Upload Single | ✅ | ✅ | ❌ |
| - POST Upload Multiple | ✅ | ✅ | ❌ |
| - PUT Update | ✅ | ✅ | ❌ |
| - DELETE | ✅ | ❌ | ❌ |
| **Expenses** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ❌ | ❌ |
| - POST Create | ✅ | ✅ | ✅ |
| - PUT Update | ✅ | ❌ | ❌ |
| - DELETE | ✅ | ❌ | ❌ |
| **Other Incomes** | | | |
| - GET All | ✅ | ❌ | ❌ |
| - GET By ID | ✅ | ❌ | ❌ |
| - POST Create | ✅ | ❌ | ❌ |
| - PUT Update | ✅ | ❌ | ❌ |
| - DELETE | ✅ | ❌ | ❌ |

**Legend:**
- ✅ = Allowed
- ❌ = Forbidden (403 Error)

---

### How Roles Are Assigned

1. **During Registration**: Specify the `role` field in the registration request:
   ```json
   {
     "email": "user@clinic.com",
     "full_name": "John Doe",
     "password": "password123",
     "phone": "+9647701234567",
     "role": "doctor"
   }
   ```

2. **Default Role**: If no role is specified, the user is assigned the `staff` role by default.

3. **Role Values**: Must be one of: `"owner"`, `"doctor"`, or `"staff"` (case-sensitive)

### Access Control Implementation

- **JWT Token**: User role is embedded in the JWT token after authentication
- **Guards**: `RolesGuard` checks if the user's role matches required roles for each endpoint
- **Decorators**: `@Roles()` decorator specifies which roles can access specific endpoints
- **Error Response**: Users without proper permissions receive a `403 Forbidden` response

### Security Notes

- Role information is stored in the database and included in JWT claims
- Roles cannot be changed by users themselves
- Only `owner` role can create, modify, or delete staff members
- Role hierarchy is enforced at the application level, not database level

---

## Testing with Postman

### 1. Import Collection

Create a Postman collection with the base URL:
```
http://localhost:3000/api/v1
```

### 2. Setup Environment Variables

```json
{
  "base_url": "http://localhost:3000/api/v1",
  "access_token": ""
}
```

### 3. Test Authentication Flow

1. **Register a user**
   - POST `{{base_url}}/auth/register`
   - Save the `access_token` from response

2. **Login**
   - POST `{{base_url}}/auth/login`
   - Update `access_token` in environment

3. **Test Protected Route**
   - GET `{{base_url}}/patients`
   - Add header: `Authorization: Bearer {{access_token}}`

---

## Swagger Documentation

Access interactive API documentation at:
```
http://localhost:3000/api/v1/docs
```

The Swagger UI provides:
- Interactive endpoint testing
- Request/response schemas
- Authentication setup
- Real-time API exploration

---

## Important Notes

### Security Best Practices

1. **Always use HTTPS** in production
2. **Keep JWT_SECRET secure** and never commit to version control
3. **Implement rate limiting** for authentication endpoints
4. **Validate all user inputs** on both client and server
5. **Use strong passwords** with minimum requirements
6. **Implement proper CORS** policies
7. **Keep dependencies updated** regularly

### File Upload Guidelines

- **Maximum file size**: Configure in multer settings
- **Allowed file types**: 
  - Clinical Documents: PDF, DOC, DOCX
  - Patient Images: JPG, JPEG, PNG
- **File storage**: `uploads/` directory (ensure proper permissions)

### Database Considerations

- Ensure PostgreSQL is running before starting the server
- Database credentials are in `.env` file
- Run migrations if schema changes
- Regular backups recommended for production

---

## Troubleshooting

### Common Issues

#### 1. "secretOrPrivateKey must have a value"
**Solution:** Add `JWT_SECRET` to your `.env` file

#### 2. "Cannot connect to database"
**Solution:** Check PostgreSQL is running and credentials in `.env` are correct

#### 3. "401 Unauthorized"
**Solution:** Ensure valid JWT token is included in Authorization header

#### 4. "403 Forbidden"
**Solution:** Check user role has permission for the endpoint

#### 5. File upload fails
**Solution:** Check `uploads/` directory exists and has write permissions

---

## Support & Contact

For issues and feature requests, please contact the development team or create an issue in the project repository.

---

**Last Updated:** October 17, 2025  
**API Version:** 1.0.0  
**Framework:** NestJS 10.x  
**Database:** PostgreSQL 14+
