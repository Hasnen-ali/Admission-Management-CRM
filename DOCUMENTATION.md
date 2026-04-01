# Admission Management & CRM System — Full Documentation

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Folder Structure](#4-folder-structure)
5. [Database Schema](#5-database-schema)
6. [API Reference](#6-api-reference)
7. [Role-Based Access Control](#7-role-based-access-control)
8. [Business Rules & Logic](#8-business-rules--logic)
9. [Frontend Pages](#9-frontend-pages)
10. [Key Services](#10-key-services)
11. [Environment Variables](#11-environment-variables)
12. [Setup & Installation](#12-setup--installation)
13. [Seed Data](#13-seed-data)
14. [Error Handling](#14-error-handling)

---

## 1. Project Overview

The **Admission Management & CRM System** is a full-stack web application designed for engineering colleges to manage the complete student admission lifecycle — from applicant registration to seat allocation, document verification, fee collection, and final admission confirmation.

### Core Capabilities

| Module | Description |
|--------|-------------|
| Master Setup | Configure institution hierarchy (Institution → Campus → Department → Program) |
| Seat Matrix | Define intake and quota-wise seat distribution per program |
| Applicant Management | Register and track applicants with document status |
| Seat Allocation | Allocate seats via Government (KCET/COMEDK) or Management flow |
| Admission Confirmation | Generate unique, immutable admission numbers |
| Fee Management | Track fee payment per admission |
| Dashboard | Real-time overview of admissions, seats, and pending actions |
| User Roles | Admin, Admission Officer, Management with JWT-based RBAC |

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                  │
│         React.js + Tailwind CSS + React Hook Form    │
│              Vite Dev Server :5173                   │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (proxied /api → :5000)
┌──────────────────────▼──────────────────────────────┐
│                  BACKEND (Node.js)                   │
│              Express.js REST API :5000               │
│   Auth Middleware → Routes → Controllers → Services  │
└──────────────────────┬──────────────────────────────┘
                       │ Mongoose ODM
┌──────────────────────▼──────────────────────────────┐
│                  DATABASE (MongoDB)                  │
│         Collections: users, programs, applicants,   │
│         admissions, institutions, campuses,          │
│         departments, academicyears                   │
└─────────────────────────────────────────────────────┘
```

### Request Flow

```
Browser → Vite Proxy → Express Router → Auth Middleware
       → Controller → Service/Model → MongoDB
       → JSON Response → React State → UI Update
```

---

## 3. Tech Stack

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18 | HTTP server & routing |
| mongoose | ^7.0 | MongoDB ODM |
| jsonwebtoken | ^9.0 | JWT authentication |
| bcryptjs | ^2.4 | Password hashing |
| dotenv | ^16.0 | Environment config |
| cors | ^2.8 | Cross-origin requests |
| express-async-errors | ^3.1 | Async error propagation |

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19 | UI framework |
| react-router-dom | ^7 | Client-side routing |
| react-hook-form | ^7 | Form state management |
| axios | ^1.14 | HTTP client |
| tailwindcss | ^4 | Utility-first CSS |
| react-hot-toast | ^2.6 | Toast notifications |
| vite | ^8 | Build tool & dev server |

---

## 4. Folder Structure

```
admission-crm/
│
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Login, register, me
│   │   ├── masterController.js      # CRUD factory for masters
│   │   ├── programController.js     # Program + seat matrix
│   │   ├── applicantController.js   # Applicant CRUD
│   │   ├── admissionController.js   # Allocate, confirm, fee
│   │   └── dashboardController.js   # Summary stats
│   ├── middleware/
│   │   ├── auth.js                  # JWT protect + authorize
│   │   └── errorHandler.js          # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Institution.js
│   │   ├── Campus.js
│   │   ├── Department.js
│   │   ├── Program.js               # Includes embedded quotaSchema
│   │   ├── Applicant.js
│   │   ├── Admission.js
│   │   └── AcademicYear.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── masterRoutes.js
│   │   ├── programRoutes.js
│   │   ├── applicantRoutes.js
│   │   ├── admissionRoutes.js
│   │   └── dashboardRoutes.js
│   ├── services/
│   │   ├── seatAllocationService.js # Atomic seat allocation
│   │   └── admissionNumberService.js# Admission number generator
│   ├── seed.js                      # Demo data seeder
│   ├── server.js                    # App entry point
│   └── .env                         # Environment variables
│
└── frontend/
    ├── public/
    └── src/
        ├── api/
        │   └── axios.js             # Axios instance + interceptors
        ├── components/
        │   ├── Layout.jsx           # Sidebar + topbar shell
        │   ├── ProtectedRoute.jsx   # Auth + role guard
        │   ├── Table.jsx            # Reusable data table
        │   ├── Modal.jsx            # Dialog component
        │   └── FormField.jsx        # Label + input + error
        ├── context/
        │   └── AuthContext.jsx      # Global auth state
        ├── pages/
        │   ├── Login.jsx
        │   ├── Dashboard.jsx
        │   ├── SeatMatrix.jsx
        │   ├── masters/
        │   │   ├── Institutions.jsx
        │   │   ├── Campuses.jsx
        │   │   ├── Departments.jsx
        │   │   ├── Programs.jsx
        │   │   └── AcademicYears.jsx
        │   ├── applicants/
        │   │   └── Applicants.jsx
        │   └── admissions/
        │       └── Admissions.jsx
        ├── App.jsx                  # Routes definition
        └── main.jsx                 # React entry point
```

---

## 5. Database Schema

### User

```js
{
  name: String,
  email: String (unique, lowercase),
  password: String (bcrypt hashed),
  role: Enum ['admin', 'admission_officer', 'management']
}
```

### Institution

```js
{
  name: String,
  code: String (unique, uppercase),
  address: String,
  phone: String,
  email: String,
  isActive: Boolean
}
```

### Campus

```js
{
  name: String,
  code: String,
  institution: ObjectId → Institution,
  address: String,
  isActive: Boolean
}
```

### Department

```js
{
  name: String,
  code: String,
  campus: ObjectId → Campus,
  isActive: Boolean
}
```

### Program

```js
{
  name: String,
  code: String,
  department: ObjectId → Department,
  courseType: Enum ['UG', 'PG'],
  entryType: Enum ['Regular', 'Lateral'],
  admissionMode: Enum ['Government', 'Management'],
  academicYear: String,
  totalIntake: Number,
  quotas: [
    {
      name: String,           // KCET | COMEDK | Management
      totalSeats: Number,
      filledSeats: Number,    // auto-incremented on allocation
      supernumerarySeats: Number,
      supernumeraryFilled: Number
    }
  ],
  isActive: Boolean
}
```

> **Rule:** `sum(quotas.totalSeats)` must equal `totalIntake` — enforced via pre-save hook.

### Applicant

```js
{
  name: String,
  email: String,
  phone: String,
  category: Enum ['GM', 'SC', 'ST', 'OBC'],
  entryType: Enum ['Regular', 'Lateral'],
  quotaType: Enum ['KCET', 'COMEDK', 'Management'],
  marks: Number,
  program: ObjectId → Program,
  academicYear: String,
  allotmentNumber: String,      // for govt flow
  documentStatus: Enum ['Pending', 'Submitted', 'Verified'],
  status: Enum ['Applied', 'Allocated', 'Confirmed', 'Rejected']
}
```

### Admission

```js
{
  admissionNumber: String (unique, immutable),
  applicant: ObjectId → Applicant (unique),
  program: ObjectId → Program,
  quotaName: String,
  academicYear: String,
  feeStatus: Enum ['Pending', 'Paid'],
  isConfirmed: Boolean,
  allocatedBy: ObjectId → User,
  confirmedAt: Date
}
```

### AcademicYear

```js
{
  year: String (unique),   // e.g. "2025-26"
  isActive: Boolean
}
```

---

## 6. API Reference

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Create new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Protected | Get current user |

**Login Request:**
```json
{ "email": "admin@crm.com", "password": "admin123" }
```

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "name": "Admin User", "email": "admin@crm.com", "role": "admin" }
}
```

---

### Masters

All master endpoints follow the same pattern. Replace `{resource}` with `institutions`, `campuses`, `departments`, or `academic-years`.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/masters/{resource}` | Protected | List all |
| GET | `/api/masters/{resource}/:id` | Protected | Get one |
| POST | `/api/masters/{resource}` | Admin only | Create |
| PUT | `/api/masters/{resource}/:id` | Admin only | Update |
| DELETE | `/api/masters/{resource}/:id` | Admin only | Delete |

---

### Programs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/programs` | Protected | List all programs |
| GET | `/api/programs/seat-matrix` | Protected | Seat availability per quota |
| GET | `/api/programs/:id` | Protected | Get one program |
| POST | `/api/programs` | Admin | Create program |
| PUT | `/api/programs/:id` | Admin | Update program |
| DELETE | `/api/programs/:id` | Admin | Delete program |

**Create Program Request:**
```json
{
  "name": "Computer Science & Engineering",
  "code": "CSE",
  "department": "<dept_id>",
  "courseType": "UG",
  "entryType": "Regular",
  "admissionMode": "Government",
  "academicYear": "2025-26",
  "totalIntake": 60,
  "quotas": [
    { "name": "KCET", "totalSeats": 30 },
    { "name": "COMEDK", "totalSeats": 20 },
    { "name": "Management", "totalSeats": 10 }
  ]
}
```

---

### Applicants

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/applicants` | Protected | List (filter: status, quotaType, academicYear) |
| GET | `/api/applicants/:id` | Protected | Get one |
| POST | `/api/applicants` | Officer/Admin | Create applicant |
| PUT | `/api/applicants/:id` | Officer/Admin | Update applicant |
| DELETE | `/api/applicants/:id` | Admin | Delete |
| PATCH | `/api/applicants/:id/document-status` | Officer/Admin | Update doc status |

---

### Admissions

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/admissions/allocate` | Officer/Admin | Allocate seat |
| GET | `/api/admissions` | Protected | List all admissions |
| GET | `/api/admissions/:id` | Protected | Get one |
| PATCH | `/api/admissions/:id/fee` | Officer/Admin | Update fee status |
| PATCH | `/api/admissions/:id/confirm` | Officer/Admin | Confirm admission |

**Allocate Seat Request:**
```json
{
  "applicantId": "<applicant_id>",
  "programId": "<program_id>",
  "quotaName": "KCET"
}
```

**Allocate Seat Response:**
```json
{
  "_id": "...",
  "admissionNumber": "INST/2025/UG/CSE/KCET/0001",
  "applicant": "...",
  "program": "...",
  "quotaName": "KCET",
  "feeStatus": "Pending",
  "isConfirmed": false
}
```

---

### Dashboard

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/summary` | Protected | Aggregated stats |

**Response:**
```json
{
  "totalIntake": 160,
  "totalAdmitted": 68,
  "remainingSeats": 92,
  "quotaSummary": {
    "KCET":       { "total": 80, "filled": 34, "remaining": 46 },
    "COMEDK":     { "total": 52, "filled": 24, "remaining": 28 },
    "Management": { "total": 28, "filled": 10, "remaining": 18 }
  },
  "pendingDocuments": 4,
  "pendingFees": 3
}
```

---

## 7. Role-Based Access Control

| Feature | Admin | Admission Officer | Management |
|---------|:-----:|:-----------------:|:----------:|
| Dashboard | ✅ | ✅ | ✅ |
| Seat Matrix | ✅ | ✅ | ✅ |
| View Admissions | ✅ | ✅ | ✅ |
| Master Setup (CRUD) | ✅ | ❌ | ❌ |
| Create Applicant | ✅ | ✅ | ❌ |
| Allocate Seat | ✅ | ✅ | ❌ |
| Update Fee Status | ✅ | ✅ | ❌ |
| Confirm Admission | ✅ | ✅ | ❌ |
| Update Doc Status | ✅ | ✅ | ❌ |
| Delete Records | ✅ | ❌ | ❌ |

JWT token must be sent in every protected request:
```
Authorization: Bearer <token>
```

---

## 8. Business Rules & Logic

### Seat Quota Validation
- `sum(quota.totalSeats)` must equal `program.totalIntake`
- Enforced in Mongoose `pre('save')` hook on Program model
- Frontend shows live sum vs intake mismatch warning

### Atomic Seat Allocation
- Uses MongoDB transactions (`startSession`) to prevent race conditions
- `findOneAndUpdate` with `$expr` checks `filledSeats < totalSeats` atomically
- If quota is full, returns `{ success: false }` without incrementing
- On success, increments `filledSeats` and creates Admission record in same transaction

```
allocateSeat(applicantId, programId, quotaName)
  → Start MongoDB session
  → findOneAndUpdate Program (atomic check + increment)
  → If no update → quota full → abort
  → generateAdmissionNumber()
  → Create Admission record
  → Update Applicant status to 'Allocated'
  → Commit transaction
```

### Admission Number Format
```
INST / {YEAR} / {COURSE_TYPE} / {BRANCH_CODE} / {QUOTA} / {RUNNING_NUMBER}

Example: INST/2025/UG/CSE/KCET/0001
```
- Year extracted from `academicYear` field (e.g. `2025-26` → `2025`)
- Running number is count of existing admissions with same prefix + 1, zero-padded to 4 digits
- Once generated, field is `immutable: true` in Mongoose schema

### Admission Confirmation Rules
1. Fee status must be `Paid`
2. Admission must not already be confirmed
3. On confirm: sets `isConfirmed: true`, `confirmedAt: Date.now()`
4. Updates applicant status to `Confirmed`

### Document Status Flow
```
Pending → Submitted → Verified
```

---

## 9. Frontend Pages

### Login (`/login`)
- Glassmorphism card on gradient background
- React Hook Form validation
- Demo credentials panel
- Redirects to dashboard on success

### Dashboard (`/`)
- Stat cards: Total Intake, Admitted, Remaining, Pending Docs
- Overall progress bar with percentage
- Quota-wise breakdown cards with color-coded progress bars

### Seat Matrix (`/seat-matrix`)
- Per-program cards with gradient header
- KCET / COMEDK / Management quota breakdown
- Live fill percentage bars

### Applicants (`/applicants`)
- Full CRUD table
- Status badges (Applied / Allocated / Confirmed / Rejected)
- Document status update modal
- Inline form with all 15 fields

### Admissions (`/admissions`)
- Seat allocation modal (select applicant → program → quota)
- Inline fee status dropdown (for officers)
- Confirm button (only if fee = Paid)
- Immutable admission number display

### Master Pages (`/masters/*`)
- Institutions, Campuses, Departments, Programs, Academic Years
- All follow same pattern: list table + add/edit modal
- Programs page includes dynamic quota builder with live sum validation

---

## 10. Key Services

### `seatAllocationService.js`

```js
allocateSeat(applicantId, programId, quotaName, userId)
```

Uses MongoDB session + transaction to atomically:
1. Check seat availability
2. Increment `filledSeats`
3. Generate admission number
4. Create Admission document
5. Update Applicant status

### `admissionNumberService.js`

```js
generateAdmissionNumber(programId, quotaName, academicYear)
```

Builds prefix from program data, counts existing admissions with that prefix, returns next padded number.

---

## 11. Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/admission_crm
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
```

---

## 12. Setup & Installation

### Requirements
- Node.js v18+
- MongoDB v6+ running locally

### Backend

```bash
cd admission-crm/backend
npm install
cp .env.example .env      # edit values
npm run seed              # load demo data
npm run dev               # start server on :5000
```

### Frontend

```bash
cd admission-crm/frontend
npm install
npm run dev               # start on :5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000` automatically.

---

## 13. Seed Data

Running `npm run seed` from the backend folder will:

- Clear all existing data
- Create 3 users (admin, officer, management)
- Create 2 academic years (2024-25, 2025-26)
- Create 1 institution → 1 campus → 3 departments
- Create 3 programs (CSE 60 seats, ECE 60 seats, MECH 40 seats)
- Create 10 applicants with mixed statuses
- Create 6 admission records (3 confirmed, 3 pending)

---

## 14. Error Handling

### Backend

All async errors are caught by `express-async-errors` and forwarded to the global error handler:

```js
// middleware/errorHandler.js
(err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: err.message })
}
```

Common HTTP status codes used:

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (wrong role) |
| 404 | Resource not found |
| 500 | Internal server error |

### Frontend

- Axios interceptor catches `401` globally → clears token → redirects to `/login`
- All form submissions wrapped in try/catch → `toast.error()` on failure
- React Hook Form handles field-level validation before submission

---

*Documentation generated for Admission Management & CRM System v1.0.0*
