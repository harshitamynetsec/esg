# MASTER_MEMORY.md

# ESG-NSS Platform – Master Memory
Version: 2.0

> This document is the **single source of truth** for the ESG-NSS platform. Every architectural, database, backend, frontend, UX, API, security and deployment decision must follow this specification. If code and this document conflict, this document takes precedence.

---

# 1. Vision

ESG-NSS is a production-grade SaaS platform that helps SMEs and Enterprises assess, implement, monitor and improve ESG (Environmental, Social and Governance) performance through guided onboarding, KPI tracking, policy management, reporting and education.

Goals:

- Reduce ESG consulting cost
- Simplify ESG adoption
- Track sustainability goals
- Generate compliance reports
- Provide continuous monitoring
- Align businesses with UN SDGs

---

# 2. Technology Stack

Frontend
- React
- Vite
- Tailwind CSS
- React Router
- React Query
- Axios
- Recharts
- Lucide React

Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- Multer
- Nodemailer

Future
- Docker
- Redis
- Queue Workers
- CI/CD

---

# 3. Business Workflow

Visitor
→ Landing Page
→ Free Sustainability Compass
→ ESG Report
→ Subscription
→ Registration
→ Payment
→ Guided Onboarding
→ Learning Hub
→ Questionnaire
→ Material Topics
→ Goals & KPIs
→ Dashboard
→ Ongoing Tracking
→ Reports

---

# 4. User Roles

Visitor
- Browse website
- Try Compass
- Pricing
- Learn ESG

Free Explorer
- Complete assessment
- Receive ESG score
- Recommendations

Subscriber
- Dashboard
- KPI Tracking
- Policies
- Reports
- Learning Hub

ESG Manager
- Manage KPIs
- Objectives
- Reports
- Material Topics

Organization Admin
- Invite users
- Billing
- Roles
- Organization settings

Platform Super Admin
- User management
- Plans
- Analytics
- Support
- Platform configuration

---

# 5. Core Modules

- Authentication
- Organization Management
- Dashboard
- ESG Learning Hub
- ESG Questionnaire
- Materiality Assessment
- Goals & Objectives
- KPI Tracking
- Policy Management
- Report Generation
- Notifications
- Billing
- Audit Logs
- Admin Panel

---

# 6. Database Entities

Authentication
- User
- Role
- Permission
- Session

Organization
- Organization
- Department
- Team

ESG
- SDG
- MaterialTopic
- Objective
- Goal
- KPI
- KPIHistory
- Assessment
- Questionnaire
- QuestionnaireResponse

Policies
- Policy
- PolicyCategory
- PolicyDocument

Learning
- Course
- Module
- Lesson
- Progress

Reports
- Report
- ReportVersion

Billing
- Subscription
- Invoice
- Payment

System
- Notification
- ActivityLog
- AuditLog
- Upload

---

# 7. Relationships

Organization
├── Users
├── KPIs
├── Policies
├── Reports
├── Material Topics
└── Questionnaires

Material Topic
→ Objectives
→ KPIs
→ KPI History
→ Reports

---

# 8. REST API

Authentication
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh

Users
GET/POST/PUT/DELETE /users

Organizations
GET/POST/PUT /organizations

Questionnaire
GET /questionnaire
POST /questionnaire
PUT /responses

Material Topics
CRUD /material-topics

Goals
CRUD /goals

KPIs
CRUD /kpis

Policies
CRUD /policies

Reports
POST /reports/generate
GET /reports

Dashboard
GET /dashboard
GET /analytics

Learning
GET /courses
GET /modules
POST /progress

---

# 9. Frontend Pages

Public
- Landing
- About
- Pricing
- Contact
- Sustainability Compass

Auth
- Login
- Register
- Forgot Password
- Verify Email

Onboarding
- Welcome
- Learning Hub
- Questionnaire
- Material Topics
- Goals
- Dashboard Activation

Application
- Dashboard
- KPIs
- Objectives
- Policies
- Reports
- Notifications
- Settings

Admin
- Users
- Roles
- Billing
- Organization

---

# 10. UI Guidelines

Theme

Primary: #0F766E
Secondary: #0EA5E9
Accent: #14B8A6
Background: #F8FAFC
Success: #22C55E
Warning: #F59E0B
Danger: #EF4444

Typography
- Inter

Icons
- Lucide React

Charts
- Recharts

Design
- Modern SaaS
- Rounded cards
- Responsive
- Clean whitespace
- WCAG accessibility

---

# 11. Folder Structure

server/
- config
- controllers
- middleware
- models
- routes
- services
- validators
- repositories
- utils
- uploads

client/
- assets
- components
- contexts
- hooks
- layouts
- pages
- services
- styles
- types
- utils

---

# 12. Coding Standards

- ES2023
- Functional React Components
- Async/Await
- SOLID principles
- Clean Architecture
- Reusable Components
- ESLint + Prettier
- No duplicated logic

Never:
- TODO placeholders
- "rest of code"
- incomplete files
- commented-out production code

Every file must compile.

---

# 13. Validation Rules

Email
- RFC compliant

Password
- Minimum 8 chars
- Uppercase
- Lowercase
- Number
- Special character

Company
- 2–100 chars

KPI
- Positive numeric target
- Required unit

Objectives
- SMART goals

---

# 14. Non-Functional Requirements

Performance
- Dashboard <2 seconds
- API <300ms (excluding reports)
- Lazy loading
- Pagination

Security
- JWT
- Refresh Tokens
- RBAC
- Helmet
- Rate Limiting
- bcrypt
- Input validation
- XSS protection
- Audit logs

Scalability
- Modular architecture
- Stateless API
- Docker ready
- Horizontal scaling
- Redis ready

Reliability
- Global error handler
- Structured logging
- Health endpoint
- Graceful shutdown

---

# 15. Development Rules for Codex

Always read this document first.

Never invent architecture that contradicts this specification.

Never generate placeholder code.

Never leave unfinished files.

Never overwrite working code unnecessarily.

Create complete production-ready implementations.

Generate PROJECT_PLAN.md before coding.

Update CHANGELOG.md after every milestone.

Build in phases:
1. Planning
2. Database
3. Backend
4. Frontend
5. Integration
6. Testing
7. Optimization

Continue until the application is production ready.
