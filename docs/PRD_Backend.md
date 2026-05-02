# Backend Product Requirements Document (BE PRD)

## 1. Overview
The backend must evolve from a lightweight user state/auth manager into a robust, multi-tenant academic orchestration layer capable of secure LTI/API integrations with partner universities and managing an E-2 Visa compliant franchise system.

**Core Principle:** Data models and business logic must be completely decoupled from specific educational institutions. The architecture must use an Adapter pattern for integrations and a Rule Engine for academic mappings to ensure maximum flexibility and scalability.

## 2. Core Architecture & Modules

### 2.1 Multi-Tenant IAM & Hierarchy
- **Entities:** Global Platform Admin -> Master Franchise -> Local Franchise (Polo) -> Center Staff (Mentors) -> Student.
- **SSO Orchestration Hub:** Implement a standard OpenID Connect (OIDC) / OAuth 2.0 provider service. This allows Unischool to assert identity to any external LMS dynamically using standard LTI 1.3 Advantage specifications.
- **ABAC (Attribute-Based Access Control):** Permissions must be partitioned strictly by tenant ID and center ID.

### 2.2 Student Information System (Lightweight SIS)
- **Database Model Updates (PostgreSQL via Supabase):**
  - All models must be normalized. No hardcoding of subject categories.
  - `Institutions`: Table managing partner details, API keys, and endpoint configurations.
  - `Courses`: Master catalog mapped to `Institution_ID`.
  - `Enrollments`: Maps `User_ID` to `Course_ID` with external integration mapping IDs.
  - `RequirementMatrices`: Configurable JSONB or relational structures mapping `Course_ID` to local graduation criteria.
  - `AcademicMilestones`: State machine tracking (Enrolled, In Progress, Submitted, Graded) powered by webhook updates.

### 2.3 Integration Layer (The Accrual System)
- **Problem:** We do not host the grades or classes.
- **Solution:** 
  - **Adapter Pattern Engine:** A microservice dedicated to normalizing incoming data from various LMS providers (Canvas, Canvas-LTI, Blackboard, Custom).
  - Webhook endpoints designed to receive standard event payloads.
  - Fallback syncing jobs utilizing distributed task queues (e.g., Celery or BullMQ) to poll REST APIs for partners lacking webhooks. 
  - **Constraints:** Never ingest the actual coursework or IP. Only normalize metadata (`integration_id`, `status_code`, `grade`, `completion_date`).

### 2.4 Narrative Conversion Engine (NCE) Prompts & Orchestration
- **Service Integration:** `GeminiService.js` / `WebLLMService.js` must be fed context dynamically.
- **CMS for LLMs:** 
  - `NCEScenarios` table stores Base Prompts, Knowledge Context, and the 5-step state logic.
  - Application logic retrieves the active scenario state via API and passes it to the local or cloud LLM.
- **Telemetry & Validation:** The backend must validate the extracted "Mental Models" against a rubric via LLM-as-a-judge before updating the student profile metrics.

### 2.5 Escalation & Support Ticket API
- **Rule Engine:** A background service evaluating telemetry data streams.
  - Configure thresholds dynamically per franchise (e.g., `max_idle_time`, `max_failure_count`).
  - **Action:** Triggers to POST `/api/v1/tickets` creating a high-priority intervention record, utilizing a Pub/Sub system to notify connected center staff in real-time via WebSockets.

### 2.6 Franchise Operations & Monetization
- **Dynamic Payment Routing:** 
  - Stripe Integration utilizing Stripe Connect to handle complex multi-party revenue splitting (Platform Fee, Master Franchise Royalty, Local Franchise Revenue). 
  - Configuration of splits managed at the `Franchise` entity level.
- **Telemetry:** Expose comprehensive GraphQL / REST reporting endpoints for physical hubs to validate attendance, aggregating metrics at the Center level.

## 3. Security & Non-Functional Requirements
- **E-2 Compliance Audit Logs:** Immutable audit log architecture ensuring that all franchise operations are recorded for visa compliance reporting.
- **Data Privacy:** PII must be encrypted at rest. Must support geographical data isolation configurations for GDPR, LGPD, and FERPA alignment.
- **Architecture:** API First, highly available, and deployed globally via containerized microservices or serverless functions.
