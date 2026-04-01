# Admission Management & CRM System

A production-ready full-stack web application for managing college admissions, seat allocation, applicant tracking, and fee management.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Status](https://img.shields.io/badge/Status-Active-brightgreen)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, React Hook Form |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (Role-based) |
| Build Tool | Vite |

---

## Features

- **Master Setup** — Institution, Campus, Department, Program, Academic Year management
- **Seat Matrix** — Real-time quota-wise seat tracking (KCET / COMEDK / Management)
- **Applicant Management** — Register applicants, track document status
- **Seat Allocation** — Government & Management flow with race-condition-safe atomic allocation
- **Admission Confirmation** — Auto-generated unique admission numbers (`INST/YEAR/TYPE/BRANCH/QUOTA/XXXX`)
- **Fee Management** — Track fee payment status per admission
- **Dashboard** — Live stats, quota breakdown, progress indicators
- **Role-Based Access** — Admin, Admission Officer, Management roles

---

## Project Structure

```
admission-crm/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth & error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── services/        # Seat allocation & admission number logic
│   ├── seed.js          # Demo data seeder
│   └── server.js        # Entry point
└── frontend/
    └── src/
        ├── api/         # Axios instance
        ├── components/  # Layout, Table, Modal, FormField
        ├── context/     # Auth context
        └── pages/       # Dashboard, Login, Masters, Applicants, Admissions
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB running locally on port `27017`

### 1. Clone the repo

```bash
git clone https://github.com/Hasnen-ali/Admission-Management-CRM.git
cd Admission-Management-CRM
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Copy the example env file (already included in the repo):

```bash
# Linux / Mac
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

Seed demo data:

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@crm.com | admin123 |
| Admission Officer | officer@crm.com | officer123 |
| Management | mgmt@crm.com | mgmt123 |

---

## API Endpoints

```
POST   /api/auth/login
GET    /api/auth/me

GET/POST        /api/masters/institutions
GET/POST        /api/masters/campuses
GET/POST        /api/masters/departments
GET/POST        /api/masters/academic-years

GET/POST        /api/programs
GET             /api/programs/seat-matrix

GET/POST        /api/applicants
PATCH           /api/applicants/:id/document-status

POST            /api/admissions/allocate
GET             /api/admissions
PATCH           /api/admissions/:id/fee
PATCH           /api/admissions/:id/confirm

GET             /api/dashboard/summary
```

---

## Key Business Rules

- Quota seats must always equal total program intake
- No seat overbooking — atomic MongoDB transactions prevent race conditions
- Admission number is generated once and immutable
- Admission can only be confirmed after fee is marked as Paid
- Each role has restricted access to specific modules

---

## License

MIT © 2026
