# Changelog

## 2026-07-17

### Fixed

- Stabilized local backend startup by adding a development-safe MongoDB fallback that uses an in-memory instance when no external database is available.

### Added

- Created `PROJECT_PLAN.md` from `MASTER_MEMORY_V2.md`.
- Documented architecture, folder structure, dependency graph, and phased implementation roadmap.
- Added backend dependency declarations and production environment example.
- Added MongoDB connection configuration, logger, reusable schema helpers, and complete Mongoose model layer.
- Added seed data for system permissions, roles, SDGs, a policy category, Sustainability Compass questionnaire, and starter learning content.
- Added Express app/server entrypoints, auth/session controller, RBAC middleware, route validation, audit middleware, upload handling, dashboard analytics, questionnaire scoring, report generation, learning progress, and CRUD REST routes.
- Updated ESLint configuration for browser and Node.js runtime files.
- Added React API client, auth provider, protected route handling, app shell navigation, dashboard charts, resource management screens, onboarding flows, Compass assessment, learning hub, reports, settings, team, help, and admin screens.
- Connected login and registration forms to backend JWT authentication.
- Added Dockerfile, Docker Compose, `.dockerignore`, production static serving from Express, and production `start` script.
- Upgraded Nodemailer to `9.0.3` and verified production dependency audit has zero vulnerabilities.
- Added nested admin routing with an admin sub-navigation layout.
- Added admin pages for roles, billing, audit logs, analytics, platform configuration, and support.
- Mapped `/app/admin/*` routes consistently and added `/admin` compatibility redirect.
- Added core ESG assessment evaluation service with weighted pillar scoring, flaw and strength detection, SDG prioritization, material topic mapping, and 3-KPI-per-SDG report readiness output.
- Wired questionnaire submissions to return the evaluation payload and persist normalized answer scores.
- Added end-to-end assessment flow APIs for material topic selection, dynamic question generation, assessment submission, dashboard analytics, and PDF report generation.
- Added `Question` and `AssessmentResult` models to support persisted assessment flow results.
- Added PDF report generation service using `pdf-lib` and base template path `./templates/ESG_Report_Base.pdf`.

### Verified

- `npm run lint`
- `npm run build`
- Production app import with required env vars
- `npm audit --omit=dev`
