# Clinic Management System - User Guide

## Overview
This guide provides comprehensive instructions for using the Clinic Management System frontend application. The system supports three user roles: **Owner**, **Doctor**, and **Staff**, each with specific features and workflows.

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Owner Role](#owner-role)
3. [Doctor Role](#doctor-role)
4. [Staff Role](#staff-role)
5. [Common Features](#common-features)

---

## Getting Started

### Login
1. Navigate to the application URL
2. Enter your email and password
3. Click "Login"
4. You will be redirected to your role-specific dashboard

### Navigation
- All users have a **bottom navigation bar** with role-specific options
- The **Home button** (first icon) is available to all users and returns you to the dashboard
- Navigation options vary based on your role (see role-specific sections below)

---

## Owner Role

### Dashboard Overview
The Owner dashboard provides a comprehensive view of the entire clinic operation:

#### Statistics Cards
- **Total Patients:** Click to view all patients
- **Appointments:** Click to view all appointments
- **Active Treatments:** Click to view treatment plans
- **Expenses:** View expense records
- **Total Doctors:** Click to view all doctors
- **Staff Members:** View staff list
- **Income Records:** Click to view income
- **Expense Records:** Click to view expenses

#### Charts
- **Financial Overview:** Bar chart comparing income vs expenses
- **Staff Distribution:** Pie chart showing doctors vs staff members

### Navigation Bar
- **Home:** Return to dashboard
- **Patients:** View and manage all patients
- **Doctors:** View and manage doctors
- **Appointments:** View and manage all appointments
- **Treatments:** View and manage treatment plans
- **Documents:** View clinical documents

### Quick Actions
From the dashboard, you can quickly:
- Add new patient
- Schedule new appointment
- Create treatment plan
- Add medical record
- View procedures
- Record procedures
- Manage patient images
- Access finance dashboard
- View/record expenses and income

### Financial Management
1. Click **Finance Dashboard** to view financial overview
2. Access expense and income lists
3. Record new expenses with categorization
4. Track income from various sources

---

## Doctor Role

### Dashboard Overview
The Doctor dashboard focuses on patient care and appointments:

#### Statistics Cards
- **Total Patients:** Click to view your patients
- **My Appointments:** Click to view your schedule
- **Active Treatments:** Click to view your treatment plans

#### Charts
- **Patients & Appointments Overview:** Bar chart showing patient and appointment counts
- **Work Distribution:** Pie chart showing distribution of patients, appointments, and treatments

### Navigation Bar
- **Home:** Return to dashboard
- **Patients:** View patient list
- **Appointments:** View your appointments
- **Procedures:** View and record procedures

### Patient Management

#### Viewing Patient Details
1. Navigate to **Patients** from the navigation bar
2. Click **View** on any patient to see comprehensive patient information
3. The patient detail page includes tabs for:
   - **Appointments:** All appointments for this patient
   - **Treatment Plans:** Treatment history and active plans
   - **Medical Records:** Diagnosis and prescription history
   - **Documents:** Clinical documents
   - **Images:** Patient images (X-rays, scans, etc.)

#### Quick Actions on Patient Page
From the patient detail page, you can:
- **Add Treatment Plan:** Create a new treatment plan
- **Schedule Appointment:** Book another appointment
- **Add Patient Images:** Upload new medical images
- **Add Medical Record:** Record new diagnosis and prescription

### Appointment Management
1. Navigate to **Appointments**
2. View list of all appointments
3. Click **Calendar** to view appointments in calendar format
4. Schedule new appointments with date/time selection
5. Edit or update appointment status

### Procedures
1. Navigate to **Procedures**
2. View all procedures performed
3. Record new procedures with patient, date, cost, and notes

---

## Staff Role

### Dashboard Overview
The Staff dashboard provides essential statistics:

#### Statistics Cards
- **Total Patients:** View patient count
- **Appointments:** View appointment count
- **Expenses (View Only):** Read-only access to expense count

### Navigation Bar
- **Home:** Return to dashboard
- **Add:** Add new patients with complete workflow
- **Update:** Update existing patients and appointments

### Add Patient Workflow
Navigate to **Add** from the bottom navigation to start the add workflow:

#### Step 1: Select Doctor
1. Choose a doctor from the dropdown list
2. This doctor will be linked to the patient's first appointment
3. Click **Next**

#### Step 2: Enter Patient Data
Fill in patient information:
- **Full Name** (required)
- **Gender** (required)
- **Phone** (required)
- **Email** (optional)
- **Date of Birth** (required)
- **Address** (optional)
- **Blood Group** (optional)

**Document Upload:**
- Check the box if patient has clinical documents
- If checked, you'll proceed to document upload step
- If unchecked, you'll skip to appointment scheduling

Click **Add Patient** when complete.

#### Step 3: Upload Documents (Optional)
If documents exist:
1. Click **Add Document** to upload files
2. Enter document type for each file (e.g., Lab Report, X-Ray)
3. Click **Upload & Continue** or **Skip** to proceed

#### Step 4: Schedule Appointment
1. Select appointment date and time using the date picker
2. Choose appointment status (default: Scheduled)
3. Click **Schedule Appointment** to complete
4. Or click **Skip for Now** to complete without scheduling

Success notifications will appear at each step.

### Update Workflow
Navigate to **Update** from the bottom navigation:

#### Search Functionality
- Use the search bar to find patients by name, phone, or email
- Results update in real-time as you type

#### Tabs
1. **Patients Tab:**
   - View all patients
   - Click **Edit Patient** to update patient information
   - Click **Add Document** to upload new clinical documents
   - Click **Add Medical Record** to record new medical information

2. **Appointments Tab:**
   - View all appointments
   - Click **Edit Appointment** to update appointment details
   - Click **View Details** to see full appointment information

### Limitations
Staff members have **limited access**:
- ❌ Cannot create or modify medical records
- ❌ Cannot create or modify treatment plans
- ❌ Cannot record or modify financial data (expenses/income)
- ✅ Can manage appointments
- ✅ Can manage patient information
- ✅ Can upload clinical documents
- ✅ Can view most data

---

## Common Features

### Home Button
- Always visible as the first icon in the bottom navigation
- Returns you to your role-specific dashboard
- Available for all users regardless of role

### Search and Filter
- Most list views include search functionality
- Filter by name, phone, email, or other relevant fields
- Real-time search results

### Responsive Design
- Application works on desktop, tablet, and mobile devices
- Bottom navigation adapts to screen size
- Tables and cards reorganize for smaller screens

### Notifications
- Success messages appear when actions complete successfully
- Error messages appear when issues occur
- Notifications auto-dismiss after 6 seconds

### Calendar Integration
- Date pickers available for selecting dates
- Appointment calendar shows scheduled appointments
- Visual indication of appointment count per day

---

## Best Practices

### For All Users
1. Always verify patient information before saving
2. Use clear and descriptive notes
3. Double-check appointment times to avoid conflicts
4. Regularly review and update patient records

### For Staff
1. Complete all required fields when adding patients
2. Upload relevant documents immediately
3. Schedule appointments promptly after patient registration
4. Use the search function to avoid duplicate entries

### For Doctors
1. Review patient history before appointments
2. Update treatment plans after each visit
3. Keep medical records current
4. Document procedures promptly

### For Owners
1. Regularly review financial reports
2. Monitor staff and doctor performance through statistics
3. Analyze appointment and patient trends using dashboard charts
4. Ensure proper documentation across all departments

---

## Troubleshooting

### Cannot Login
- Verify email and password are correct
- Ensure you have an active account
- Contact system administrator if issues persist

### Missing Navigation Options
- Navigation is role-based
- You only see options available to your role
- Contact administrator if you need additional access

### Cannot Perform Action
- Check if action is allowed for your role
- Staff have limited permissions
- Doctors cannot access financial data
- Some actions require owner privileges

### Data Not Loading
- Check your internet connection
- Refresh the page
- Clear browser cache if issues persist
- Contact technical support

---

## Support
For additional help or to report issues:
- Contact your system administrator
- Email technical support
- Refer to system documentation

---

## Version Information
- **Application:** Clinic Management System Frontend
- **Documentation Version:** 1.0
- **Last Updated:** October 2025
