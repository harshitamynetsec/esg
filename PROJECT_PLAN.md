# ESG-NSS Platform Project Plan

Source of truth: `MASTER_MEMORY_V2.md` (`MASTER_MEMORY.md`, Version 2.0)

## Architecture

ESG-NSS is a production-ready MERN SaaS platform with a stateless Express API, MongoDB persistence through Mongoose, JWT access and refresh-token authentication, organization-scoped RBAC, audit logging, file uploads, reporting, charts, and a responsive React/Vite frontend.

### Backend

- Runtime: Node.js with ES Modules.
- API: Express REST API under `/api`.
- Persistence: MongoDB with Mongoose schemas, indexes, validation, hooks, and relationships.
- Security: Helmet, CORS, rate limiting, bcrypt password hashing, JWT access tokens, refresh-token sessions, RBAC middleware, request validation, centralized error handling, and audit logs.
- Files: Multer-backed uploads stored under `server/uploads` with metadata stored in MongoDB.
- Reliability: structured logger, health endpoint, graceful shutdown, pagination utilities, consistent API responses.

### Frontend

- Runtime: React + Vite.
- Routing: React Router.
- Data: Axios API client and React Query.
- UI: Tailwind CSS, Lucide React, Recharts, responsive application shell.
- Areas: public pages, auth pages, onboarding, dashboard, KPI management, objectives, material topics, policies, reports, learning hub, notifications, settings, and admin pages.

### Deployment

- Root package scripts for local development, build, lint, and production start.
- Docker and Docker Compose for client, server, and MongoDB.
- Environment-driven configuration with production defaults documented in `.env.example`.

## Folder Structure

```text
server/
  config/
  controllers/
  middleware/
  models/
  repositories/
  routes/
  services/
  uploads/
  utils/
  validators/
client/
  assets/
  components/
  contexts/
  hooks/
  layouts/
  pages/
  services/
  styles/
  types/
  utils/
src/
  Existing Vite frontend code preserved during migration/integration.
```

The current project already contains a Vite frontend under `src/`. The implementation will preserve it while adding missing production layers and integrating routes/services incrementally.

## Dependency Graph

- `server.js` depends on app configuration, database connection, routes, middleware, logger, and graceful shutdown.
- Routes depend on auth/RBAC middleware, validators, and controllers.
- Controllers depend on services, models, response utilities, and audit logging.
- Services depend on models, repositories, upload utilities, email utilities, and report generators.
- Models define relationships through ObjectId references and organization-scoped indexes.
- Frontend pages depend on layouts, API services, auth context, query hooks, forms, charts, and shared UI components.
- Docker depends on package scripts, environment configuration, and health checks.

## Implementation Roadmap

### Phase 1: Planning

- [x] Analyze `MASTER_MEMORY_V2.md`.
- [x] Produce project architecture.
- [x] Produce folder structure.
- [x] Produce dependency graph.
- [x] Produce implementation roadmap.
- [x] Create `PROJECT_PLAN.md`.
- [x] Update `CHANGELOG.md`.

### Phase 2: Database Layer

- [x] Create Mongoose connection configuration.
- [x] Create shared schema helpers.
- [x] Create authentication models: User, Role, Permission, Session.
- [x] Create organization models: Organization, Department, Team.
- [x] Create ESG models: SDG, MaterialTopic, Objective, Goal, KPI, KPIHistory, Assessment, Questionnaire, QuestionnaireResponse.
- [x] Create policy models: Policy, PolicyCategory, PolicyDocument.
- [x] Create learning models: Course, Module, Lesson, Progress.
- [x] Create report models: Report, ReportVersion.
- [x] Create billing models: Subscription, Invoice, Payment.
- [x] Create system models: Notification, ActivityLog, AuditLog, Upload.
- [x] Add indexes, validation, hooks, and seed data.

### Phase 3: Backend

- [x] Add Express app and server entrypoint.
- [x] Add environment configuration.
- [x] Add authentication and refresh-token flow.
- [x] Add RBAC authorization.
- [x] Add route validators.
- [x] Add controllers and services for all core modules.
- [x] Add audit logging, activity logging, upload handling, reports, notifications, and health checks.
- [x] Add production security middleware and error handling.
- [x] Add core ESG assessment evaluation engine for questionnaire submissions.
- [x] Add complete ESG assessment flow controllers and routes.
- [x] Add PDF report generation service for completed assessments.

### Phase 4: Frontend

- [x] Add Tailwind dependency and production UI styling layer.
- [x] Add API client and auth context.
- [x] Add protected routes and app layout.
- [x] Implement dashboard, KPI, objective, policy, report, learning, settings, notification, and admin workflows.
- [x] Add responsive charts, tables, forms, validation feedback, loading states, and error states.
- [x] Add nested admin layout, admin sub-navigation, and mapped admin routes.

### Phase 5: Integration

- [x] Connect frontend services to backend APIs.
- [x] Verify endpoint contracts.
- [x] Fix imports and dead code.
- [x] Ensure file upload and report generation flows work end to end.

### Phase 6: Testing

- [x] Run lint/build.
- [x] Fix compile errors.
- [x] Fix runtime errors.
- [x] Verify deployable Docker configuration.

### Phase 7: Optimization

- [x] Review performance-critical queries and indexes.
- [x] Confirm dashboard API target response shape.
- [x] Finalize production environment documentation.

## Verification

- `npm run lint` passes.
- `npm run build` passes.
- Production Express app imports successfully with required environment variables.
- `npm audit --omit=dev` reports zero vulnerabilities.
