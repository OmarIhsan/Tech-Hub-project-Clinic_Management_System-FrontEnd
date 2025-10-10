# Database schema

Here is the proposed relational schema for the Clinic Management System. Add these migrations to your DB when ready.

---

## Patients

```sql
CREATE TABLE patients (
  patient_id SERIAL PRIMARY KEY,
  full_name VARCHAR(50),
  gender VARCHAR(10),
  date_of_birth DATE,
  phone VARCHAR(15),
  email VARCHAR(50),
  address TEXT
);
```

---

## Doctors

```sql
CREATE TABLE doctors (
  doctor_id SERIAL PRIMARY KEY,
  full_name VARCHAR(50),
  gender VARCHAR(10),
  phone VARCHAR(15),
  email VARCHAR(50),
  hire_date DATE
);
```

---

## Appointments

```sql
CREATE TABLE appointments (
  appointment_id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES patients(patient_id),
  doctor_id INT REFERENCES doctors(doctor_id),
  appointment_time TIMESTAMP,
  status VARCHAR(20)
);
```

---

## 📋 Treatment Plans

```sql
CREATE TABLE treatment_plans (
  plan_id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES patients(patient_id),
  doctor_id INT REFERENCES doctors(doctor_id),
  appointment_id INT REFERENCES appointments(appointment_id),
  diagnosis_summary TEXT,
  prescription_file_path TEXT,
  prescription_file_type VARCHAR(20),
  plan_details TEXT,
  created_at TIMESTAMPTZ,
  status VARCHAR(20)
);
```

---

## Medical Records

```sql
CREATE TABLE medical_records (
  record_id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES patients(patient_id),
  doctor_id INT REFERENCES doctors(doctor_id),
  diagnosis TEXT,
  clinical_findings TEXT,
  treatment TEXT,
  current_meds_json JSONB,
  allergies TEXT,
  medical_conditions TEXT,
  created_at TIMESTAMPTZ
);
```

---

## Clinical Documents

```sql
CREATE TABLE clinical_documents (
  document_id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES patients(patient_id),
  appointment_id INT REFERENCES appointments(appointment_id),
  document_type VARCHAR(50),
  consent_version VARCHAR(50),
  file_path TEXT
);
```

---

## Patient Images

```sql
CREATE TABLE patient_images (
  image_id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES patients(patient_id),
  image_type VARCHAR(50),
  file_path TEXT,
  uploaded_by_staff_id INT REFERENCES staff(staff_id),
  notes TEXT,
  uploaded_at TIMESTAMPTZ
);
```

---

## Staff

```sql
CREATE TABLE staff (
  staff_id SERIAL PRIMARY KEY,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  hire_date DATE
);
```

---

## Procedures

```sql
CREATE TABLE procedures (
  procedure_id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES patients(patient_id),
  doctor_id INT REFERENCES doctors(doctor_id),
  appointment_id INT REFERENCES appointments(appointment_id),
  plan_id INT REFERENCES treatment_plans(plan_id),
  procedure_name VARCHAR(100),
  procedure_notes TEXT,
  performed_at TIMESTAMPTZ
);
```

---

## Expenses

```sql
CREATE TABLE expenses (
  expense_id SERIAL PRIMARY KEY,
  category VARCHAR(50),
  amount NUMERIC(10,2),
  expense_date DATE,
  reason TEXT,
  staff_id INT REFERENCES staff(staff_id)
);
```

---

## Other Incomes

```sql
CREATE TABLE other_incomes (
  income_id SERIAL PRIMARY KEY,
  source VARCHAR(50),
  amount NUMERIC(10,2),
  income_date DATE,
  staff_id INT REFERENCES staff(staff_id),
  patient_id INT REFERENCES patients(patient_id)
);
```







/////////////////



Table patients {
  patient_id serial [pk]
  full_name varchar(50) [not null]
  gender varchar(10)
  date_of_birth date
  phone varchar(15)
  email varchar(50)
  address text
}



Table doctors {
  doctor_id serial [pk]
  full_name varchar(50) [not null]
  gender varchar(10)
  phone varchar(15)
  email varchar(50)
  hire_date date
}



Table appointments {
  appointment_id serial [pk]
  patient_id int [ref: > patients.patient_id]
  doctor_id int [ref: > doctors.doctor_id]
  appointment_time timestamp
  status varchar(20)
}



Table treatment_plans {
  plan_id serial [pk]
  patient_id int [ref: > patients.patient_id]
  doctor_id int [ref: > doctors.doctor_id]
  appointment_id int [ref: > appointments.appointment_id]
  diagnosis_summary text
  prescription_file_path text
  prescription_file_type varchar(20) // 'image', 'pdf', etc.
  plan_details text
  created_at timestamptz
  status varchar(20)
}



Table medical_records {
  record_id serial [pk]
  patient_id int [ref: > patients.patient_id]
  doctor_id int [ref: > doctors.doctor_id]
  diagnosis text
  clinical_findings text
  treatment text
  current_meds_json jsonb
  allergies text
  medical_conditions text
  created_at timestamptz
}



Table clinical_documents {
  document_id serial [pk]
  patient_id int [ref: > patients.patient_id]
  appointment_id int [ref: > appointments.appointment_id]
  document_type varchar(50) // e.g. 'case_sheet', 'consent_form'
  consent_version varchar(50)
  file_path text
}



Table patient_images {
  image_id serial [pk]
  patient_id int [ref: > patients.patient_id]
  image_type varchar(50)
  file_path text
  uploaded_by_staff_id int [ref: > staff.staff_id]
  notes text
  uploaded_at timestamptz
}



Table staff {
  staff_id serial [pk]
  full_name varchar(100)
  phone varchar(20)
  email varchar(100)
  hire_date date
}



Table procedures {
  procedure_id serial [pk]
  patient_id int [ref: > patients.patient_id]
  doctor_id int [ref: > doctors.doctor_id]
  appointment_id int [ref: > appointments.appointment_id]
  plan_id int [ref: > treatment_plans.plan_id]
  procedure_name varchar(100)
  procedure_notes text
  performed_at timestamptz
}



Table expenses {
  expense_id serial [pk]
  category varchar(50)
  amount numeric(10,2)
  expense_date date
  reason text
  staff_id int [ref: > staff.staff_id]
}



Table other_incomes {
  income_id serial [pk]
  source varchar(50)
  amount numeric(10,2)
  income_date date
  staff_id int [ref: > staff.staff_id]
  patient_id int [ref: > patients.patient_id]
}




