# GradeFlow — Turnkey Academic Grading & Course Operations Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?style=flat-square)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff.svg?style=flat-square)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8.svg?style=flat-square)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20RLS-3ecf8e.svg?style=flat-square)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Apache%202.0-green.svg?style=flat-square)](LICENSE)

**GradeFlow** is an open-source, production-ready academic grading, syllabus modeling, and course management platform built for university instructors, teaching assistants (TAs), and students. Engineered with sub-millisecond table virtualization, multi-TA role delegation, real-time Supabase sync, and an automated audit ledger, GradeFlow eliminates spreadsheet chaos and replaces fragile grading scripts with a secure, delightful web application.

---

## Key Platform Capabilities

### 1. High-Performance Virtualized Gradebook Matrix
- **Spreadsheet-Fidelity Navigation**: Arrow-key traversal, instant Tab/Shift-Tab jumping, Enter/Escape cell controls, and dirty-cell state tracking.
- **Deep Hierarchical Breakdown**: Drill into compound problem sets with arbitrary sub-parts (e.g., `Q1 (1-a, 1-b)`, `Q2 (2-a, 2-b, 2-c)`), bonus point problems, and direct scores.
- **Sub-Millisecond Re-renders**: Fully memoized cells with localized update flashes (`bg-emerald-500/10`) avoid full-table re-renders even with hundreds of enrolled students.
- **Bulk CSV Ingestion**: Smart column auto-mapping matching student IDs and question keys with instant preview before database commit.

### 2. Turnkey Multi-TA Delegation & Section Scoping
- **Granular Role Hierarchy**: Distinguish between `instructor`, `head_ta`, `grader_ta`, and enrolled `student`.
- **Workload Distribution & Telemetry**: Live progress tracking displaying graded problem counts per TA, assigned question responsibilities, and turnaround latency.
- **Section Isolation**: Scope TAs to specific lab or recitation sections (e.g., Section A, Section B) or grant full-course administrative clearance.

### 3. Student Transparency Portal & "What-If" Calculator
- **Grade Breakdown Visibility**: Students view graded items, per-subquestion feedback, grader notes, and statistical distributions.
- **Interactive "What-If" Forecasting**: Students simulate hypothetical scores on upcoming homeworks, quizzes, and exams to project their final course outcome.
- **Deadline Radar**: Real-time timeline view with visual status badges, submission countdowns, and browser notification opt-in.

### 4. Cryptographic-Grade Regrade Appeal Lifecycle
- **Structured Dispute Filing**: Students submit granular regrade requests pinned to specific subquestions with evidence justifications.
- **TA Resolution Hub**: Dedicated queue for teaching staff to review appeals, accept or reject adjustments, record explanatory rebuttals, and log score adjustments.
- **Automated Audit Logging**: Every score edit triggers a PostgreSQL row-level audit event recording timestamp, previous score, revised score, and user attribution.

### 5. Multi-Course Database Architecture & Row Level Security (RLS)
- **Universal Multi-Course Schema**: Support multiple concurrent courses (`CS101`, `CS201`), academic terms, and custom grading schemes (Numeric 9-point, 20-point, or Standard 4.0).
- **Airtight Zero-Trust RLS**: PostgREST security policies prevent cross-tenant data leaks. Students can only read their own scores; only authorized teaching staff can update evaluation records.

### 6. Official Reporting & Dispatch Engine
- **End-of-Semester Summary Matrix (10-Table Architecture)**: Live aggregation of raw question scores, dynamic assignment target scales, uncapped bonus point overflows, and normalized semester totals with custom target scales (e.g., 5.0, 20.0).
- **Proportional Normalized Grading Engine**: Decoupled calculation engine supporting both cumulative solid score accumulation and proportional normalized grading with ceiling rounding to 2 decimal places.
- **One-Click CSV & PDF Exports**: Download official semester summaries, master gradebooks, or individual assessment sheets ready for academic registrar archiving.
- **Automated Overdue Reminders**: Batch-dispatch targeted reminders to students with missing submissions ahead of deadlines.

---

## Architecture & Technology Stack

```
grade-flow-platform/
├── api/                       # Vercel Serverless Functions
│   └── manage-users.ts        # Secure Supabase Auth user provisioning
├── public/                    # Static SVG vector assets & icons
├── src/
│   ├── components/
│   │   ├── admin/             # GradebookMatrix, SemesterReportView, AssignmentBuilder, Delegation, Overdue, UserManagement
│   │   ├── auth/              # AuthModal & role switching
│   │   ├── common/            # ErrorBoundary, OfflineBanner
│   │   ├── layout/            # Navbar, Header, Theme toggles
│   │   ├── mobile/            # Touch-optimized MobileGradebook, GradingDrawer, BottomNav
│   │   ├── notifications/     # NotificationDrawer & browser push
│   │   └── student/           # StudentGradesView, WhatIfCalculator, DeadlinesView, RegradeModal
│   ├── context/               # AuthContext, CourseContext, ThemeContext
│   ├── data/                  # Anonymized forensic evaluation datasets & fixtures
│   ├── hooks/                 # useIsMobile, responsive hooks
│   ├── services/              # Supabase Client singleton
│   ├── types/                 # Comprehensive TypeScript domain types
│   ├── utils/                 # PDF export (jsPDF), CSV parser, grading algorithms, crypto
│   ├── App.tsx                # Dynamic role-based view routing
│   └── main.tsx               # React 19 bootstrap
├── supabase/
│   ├── migrations/
│   │   ├── 00001_generalized_grade_flow.sql         # Complete schema, RLS, triggers & views
│   │   ├── 00002_custom_grading_scale.sql           # Dynamic course grading scale support
│   │   └── 00003_student_grades_roster_view.sql     # Unified student grades & roster view
│   └── seed.sql               # Ready-to-run demo course fixtures
├── .env.example               # Generic configuration blueprint
├── package.json               # Modern dependency manifest
└── vite.config.ts             # Tailwind CSS 4 + Vite compiler configuration
```

---

## Quickstart: Local Development

### 1. Prerequisites
- **Node.js**: v18.0.0 or later
- **npm** or **pnpm**
- A free account on [Supabase](https://supabase.com) (or local Supabase CLI)

### 2. Clone and Install
```bash
git clone https://github.com/your-org/grade-flow-platform.git
cd grade-flow-platform

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a local `.env.local` by copying the template:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Supabase credentials:
```env
# Client-Side Public Keys (Vite)
VITE_SUPABASE_URL="https://xxxxxxxxxxxx.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Serverless Administrative Functions (Vercel / Local API)
SUPABASE_URL="https://xxxxxxxxxxxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Database Setup (Supabase)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2. Open the **SQL Editor** from the left navigation.
3. Paste and run the contents of [`supabase/migrations/00001_generalized_grade_flow.sql`](supabase/migrations/00001_generalized_grade_flow.sql).
4. (Optional but recommended) Paste and run [`supabase/seed.sql`](supabase/seed.sql) to populate standard course fixtures, demo assignments, and test accounts.

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Seed Accounts (Quick Sign-In)

If you executed `supabase/seed.sql`, you can sign in immediately using these demo credentials:

| Role | Username / Student ID | Email | Password |
| :--- | :--- | :--- | :--- |
| **Instructor** | `FACULTY-01` (or email) | `instructor@gradeflow.local` | `DemoPass123!` |
| **Head TA** | `TA-HEAD-01` (or email) | `headta@gradeflow.local` | `DemoPass123!` |
| **Grader TA** | `TA-GRAD-02` (or email) | `ta@gradeflow.local` | `DemoPass123!` |
| **Student 1** | `STU1001` | `stu1001@gradeflow.local` | `DemoPass123!` |
| **Student 2** | `STU1002` | `stu1002@gradeflow.local` | `DemoPass123!` |

> [!TIP]
> Students can sign in directly using just their **Student ID** (e.g., `STU1001`), as the authentication layer automatically resolves the domain.

---

## Deploy to Vercel (Zero Configuration)

GradeFlow is engineered to deploy seamlessly to [Vercel](https://vercel.com).

### Step 1: Push Repository to GitHub
```bash
git init -b main
git add .
git commit -m "feat: initial scaffold for turnkey multi-course Grade Flow platform"

# Push to your GitHub account (via GitHub CLI or git remote)
gh repo create grade-flow-platform --public --source=. --remote=origin --push
```

### Step 2: Import into Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
2. Select your `grade-flow-platform` repository.
3. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy**. Vercel will build the Vite single-page application and bundle the serverless functions in `/api` automatically.

---

## Verification & Test Harness

GradeFlow comes with a test suite covering grading algorithms, CSV parsing, encryption helpers, and React UI workflows:

```bash
# Run unit & component test suite
npm run test

# Type-check TypeScript sources
npm run typecheck

# Build production bundle
npm run build
```

---

## Cybersecurity & Privacy Compliance

- **Zero Hardcoded Secrets**: All credentials are dynamically resolved from environment variables.
- **Strict Data Sanitization**: The repository contains synthetic demo fixtures only. Institutional data, past semester grades, and personal identifiers have been scrubbed.
- **Postgres Row Level Security (RLS)**: Fine-grained security policies enforce that students can only access their individual grades, and audit trails cannot be tampered with.
- **Plaintext Secret Isolation**: User passwords are encrypted using bcrypt through Supabase Auth; plaintext secrets are never stored in the database.

---

## Contributing & License

Contributions, bug reports, and pull requests are warmly welcomed! Please review the contribution guidelines before opening a pull request.

Licensed under the **Apache License, Version 2.0**. See [LICENSE](LICENSE) for details.
