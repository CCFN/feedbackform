# CareEcho Expectations & Feedback Management Portal

A secure, responsive full-stack civic healthcare application engineered for registering patient visit expectations and reconciling post-care quality feedback, built in accordance with the **2026 Civic Accountability Framework**.

---

## 🌟 Core Architecture & Workflows

```
REGISTRATION ──► LOGIN ──► DASHBOARD ──► EXPECTATIONS (Stage 01) ──► FEEDBACK (Stage 02)
                                                ▲                              │
                                                └─────────── Unlocks ──────────┘
```

1. **Zero Email Architecture**: The application functions completely without any email address, verification, or notifications. The **phone number** serves as the unique identifier and patient intake key.
2. **Authoritative State-to-Facility Jurisdiction**: States and primary healthcare facilities are database-driven. The facility dropdown is strictly filtered by state and enforced on both frontend and backend.
3. **Mandatory Expectation-First Rule**: The Feedback module is locked and inaccessible until a baseline expectation is recorded.
4. **Conditional Feedback Rule**:
   - `expectation_met = TRUE (Yes)` ──► Feedback text is **OPTIONAL**.
   - `expectation_met = FALSE (No)` ──► Feedback text is **REQUIRED** (non-empty).

---

## 🛠 Technology Stack

- **Frontend**: React (Vite), Lucide Icons, Pure Modern Vanilla CSS Design Tokens, Canvas Confetti, Responsive Layouts.
- **Backend**: Node.js, Express, Modular Service-Controller-Route Pattern, JWT Access & Refresh Tokens, Bcrypt Password Hashing, Rate Limiting, Audit Logging.
- **Database**: PostgreSQL with SQL Schemas, Foreign Keys, Indexes, Check Constraints, and zero-setup Embedded Datastore for automated tests & standalone demo runs.

---

## 📁 Project Structure

```
feedback_form/
├── backend/
│   ├── src/
│   │   ├── auth/           # Login, Register, Tokens (Zero Email)
│   │   ├── users/          # Citizen/Patient Directory
│   │   ├── states/         # State Jurisdictions (CRUD + Status)
│   │   ├── facilities/     # Healthcare Facilities (Mapped to States)
│   │   ├── expectations/   # Stage 01 Pre-Service Expectation Logging
│   │   ├── feedback/       # Stage 02 Post-Care Quality Reconciliation
│   │   ├── dashboard/      # Participant Console & Workflow Indicators
│   │   ├── reports/        # Administrative Metrics & Analytics
│   │   ├── audit/          # Tamper-Evident Audit Trail
│   │   ├── notifications/  # Protocol & Security Alerts
│   │   ├── database/       # Schema, Migrations, Seed & Client Pool
│   │   ├── common/         # Guards, Middleware, Validators, Exceptions
│   │   └── server.js       # Express Application Entrypoint
│   ├── tests/              # Automated Test Suites (All 11 tests)
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Footer, Modals (Login, Admin, Inquiry)
│   │   ├── views/
│   │   │   ├── RegistrationView.jsx   # Screen 1: Demographics & Intake
│   │   │   ├── ActionPathwayView.jsx  # Screen 2: Participant Console
│   │   │   ├── ExpectationView.jsx    # Screen 3: Pre-Service Expectation
│   │   │   └── FeedbackView.jsx       # Screen 4: Post-Care Quality Review
│   │   ├── api.js          # REST Client with Token Handling
│   │   ├── index.css       # Design System Tokens & Typography
│   │   ├── App.jsx         # View Coordinator
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── package.json            # Monorepo Concurrently Scripts
└── README.md
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- (Optional) PostgreSQL 14+ if using a dedicated external database

### 1. Install Dependencies
```bash
# Install root, backend, and frontend dependencies in one command:
npm run install:all
```

### 2. Environment Configuration
The backend includes a `.env` with default development credentials. If using an external PostgreSQL instance:
```bash
cp backend/.env.example backend/.env
```
Configure your database connection string in `backend/.env`:
```ini
PORT=5050
NODE_ENV=development
JWT_SECRET=careecho-super-secret-jwt-token-key-2026-secure
REFRESH_SECRET=careecho-super-secret-refresh-token-key-2026-secure
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/careecho_db
```
*(Note: No email variables exist in the configuration).*

### 3. Database Migration & Seeding
```bash
npm run seed
```

### 4. Run Both Backend and Frontend
```bash
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5050`

---

## 🧪 Automated Testing

Run the comprehensive unit, integration, and security test suite:
```bash
npm --prefix backend test
```

### Verified Test Cases:
1. **Phone Normalization**: Normalizes Nigerian phone formats (`08012345678`, `+2348012345678`, `2348012345678`) to consistent `+234...` standards.
2. **State-to-Facility Constraint**: Rejects registration on backend if the selected facility does not belong to the selected state.
3. **Phone Uniqueness**: Prevents duplicate account registrations.
4. **Password Strength**: Enforces uppercase, lowercase, number, and special character requirements.
5. **IDOR Protection**: Enforces session ownership (User A cannot access or submit for User B's expectation).
6. **Mandatory Test 1**: Expectation exists, expectation_met = YES, feedback = empty ──► **SUCCESS**
7. **Mandatory Test 2**: Expectation exists, expectation_met = YES, feedback = "Good experience" ──► **SUCCESS**
8. **Mandatory Test 3**: Expectation exists, expectation_met = NO, feedback = "The training was too short" ──► **SUCCESS**
9. **Mandatory Test 4**: Expectation exists, expectation_met = NO, feedback = empty ──► **FAILURE (400 Bad Request)**
10. **Mandatory Test 5**: Expectation exists, expectation_met = NULL, feedback = empty ──► **FAILURE (400 Bad Request)**
11. **Mandatory Test 6**: No expectation, expectation_met = YES ──► **FAILURE (400 Bad Request)**

---

## 🔑 Demo Accounts

| Role | Name | Phone Number | Password |
|---|---|---|---|
| **Patient / Citizen** | Eleanor Vance | `08012345678` (or `+2348012345678`) | `Password@123` |
| **Patient / Citizen** | Alex Morgan | `+15550192834` | `Password@123` |
| **System Administrator** | Directorate Admin | `+2348000000001` | `Admin@CareEcho2026!` |

---

## 🔒 Security Implementation

- **Password Hashing**: Bcrypt with 12 salt rounds.
- **Tokens**: JWT access token + refresh token architecture with secure HTTP-only cookies.
- **Rate Limiting**: IP-based rate limiting on authentication routes to mitigate brute-force attacks.
- **SQL Injection Prevention**: Parameterized queries and ORM mappings.
- **XSS & IDOR Protection**: Server-authoritative ownership derivation from verified authentication sessions.
