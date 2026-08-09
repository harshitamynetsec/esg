# Project Todo

## Environment and runtime

- [ ] Start MongoDB locally or via Docker Compose
- [ ] Verify the backend starts successfully with seeded data
- [ ] Confirm the API health endpoint responds correctly
- [ ] Add a documented first-run setup checklist for developers
- [ ] Ensure the frontend can reach the backend in local development

## Authentication

- [ ] Verify registration creates an organization and admin user correctly
- [ ] Verify login returns valid access and refresh tokens
- [ ] Verify logout invalidates the active session
- [ ] Verify refresh token flow works without stale sessions
- [ ] Handle expired token recovery gracefully in the frontend
- [ ] Add a proper redirect flow after successful login and registration
- [ ] Implement password reset flow
- [ ] Implement email verification flow
- [ ] Add account lockout or inactive-account handling

## Onboarding and user experience

- [ ] Verify onboarding pages load correctly for authenticated users
- [ ] Replace or fix page re-exports that point to unrelated components
- [ ] Confirm onboarding routes match the intended user journey
- [ ] Ensure protected pages render their own content rather than aliasing another page
- [ ] Add loading and empty states for dashboard data
- [ ] Add error states for failed API responses

## Dashboard and analytics

- [ ] Verify dashboard data is returned for an organization-scoped user
- [ ] Validate KPI progress calculations against real sample data
- [ ] Validate analytics trend data and chart formatting in the UI
- [ ] Ensure notifications display correctly for the current user
- [ ] Confirm dashboard totals and pillar scores are accurate

## Questionnaire and assessments

- [ ] Verify questionnaire data loads from the backend
- [ ] Confirm questionnaire submission creates an assessment and response record
- [ ] Validate scoring logic against sample answers
- [ ] Ensure the frontend shows submission success and error feedback
- [ ] Add support for additional questionnaire types beyond compass

## Learning hub

- [ ] Verify courses and modules load from the backend
- [ ] Verify progress updates persist correctly
- [ ] Confirm progress UI reflects completed and in-progress states
- [ ] Add empty and error states for the learning experience

## Policies, objectives, and goals

- [ ] Verify policy CRUD flows work end to end
- [ ] Verify objectives and goals CRUD flows work end to end
- [ ] Verify material topics load and link to KPIs correctly
- [ ] Ensure organization-scoped filtering works correctly for all entities
- [ ] Confirm validation errors are surfaced clearly in forms

## Reports and uploads

- [ ] Verify report generation works with real KPI and policy data
- [ ] Confirm report versions are created correctly
- [ ] Validate upload endpoint behavior for supported file types
- [ ] Confirm uploads are stored in the configured directory
- [ ] Add file-size and file-type validation feedback in the UI

## Admin and organization management

- [ ] Verify admin dashboard loads for authorized users
- [ ] Verify user management screens load and update correctly
- [ ] Verify company and subscription management screens work
- [ ] Confirm admin pages enforce role-based access correctly
- [ ] Ensure admin forms submit and show validation feedback

## API and backend hardening

- [ ] Validate route permissions for each resource endpoint
- [ ] Ensure unauthorized requests return consistent error responses
- [ ] Add missing validator coverage for additional request payloads
- [ ] Review and fix inconsistent route naming or mounting behavior
- [ ] Add health checks for database and downstream dependencies
- [ ] Add structured logging for failed requests and important business actions

## Security and configuration

- [ ] Replace development secrets with required production environment values
- [ ] Tighten CORS and origin configuration for production
- [ ] Review token lifetime and refresh-token handling policy
- [ ] Review file upload restrictions and storage permissions
- [ ] Add secrets scanning and deployment secret management guidance

## Testing and quality

- [ ] Add backend smoke tests for auth and health routes
- [ ] Add API tests for questionnaire, dashboard, and report routes
- [ ] Add frontend component or page tests for critical flows
- [ ] Add a basic end-to-end validation script for local development
- [ ] Add CI checks for build and linting

## Deployment and operations

- [ ] Validate Docker Compose startup with seeded data
- [ ] Verify production container build and startup path
- [ ] Add deployment health checks and rollback guidance
- [ ] Add environment-specific configuration documentation
- [ ] Add monitoring and alerting guidance for production deployment
