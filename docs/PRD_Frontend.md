# Frontend Product Requirements Document (FE PRD)

## 1. Overview
The frontend must transform from a generic gamified AI tutor into a premium, US University Access Operating System. It must convey the gravitas of attending real universities while retaining the solarpunk, high-performance "Cockpit" aesthetic. 

**Core Principle:** The frontend must act as a rendering engine for backend-driven configurations. Zero hardcoded universities, pathways, or progress states. Everything from credit mappings to UI badges must be fetched dynamically from the API.

## 2. Updated Views & Components

### 2.1 The Academic Mapping Dashboard (Dual-Credit Visualizer)
**Location:** Replaces or integrates with `SkillTree.jsx` and `StudentCockpit.jsx`.
- **UI Logic:** Component must iterate over a JSON payload defining the student's specific academic matrix mapping local HS requirements to US College requirements.
- **Dynamic Progress Bars:** Renders progress categories dynamically (e.g., if a student is required to complete 'Writing', 'Math', and 'Science', the UI generates three tracks based on the API response).
- **Course Launch Cards:** Driven completely by the student's active enrollments array. The "Access Course" button uses a dynamic SSO deep link payload provided by the backend to hand off the user gracefully to the external LMS.

### 2.2 Re-architecting the ChatInterface (NCE Implementation)
**Location:** `ChatInterface.jsx` and `AgentWizard.jsx`.
- **UI Flow:** The chat interface must adopt a phase-based UI to match the Narrative Conversion Engine (NCE) state machine.
- **Phases UI (State-Driven):**
  1. **Controlled Confusion:** UI displays a full-screen or prominent scenario card (data injected via API/DB) with a timer.
  2. **Decisions:** Renders dynamic input mechanisms (multiple choice, sliders, text) based on the NCE step configuration type.
  3. **Theory Transition:** Renders an animated "Model Unlocked" overlay, utilizing rich media payloads fetched from the scenario definition.
  4. **Artifact Box:** An embedded Monaco code editor or rich text editor that accepts submissions.
  5. **Mental Model Extraction:** A summary screen that dynamically lists the extracted principles and updates the student portfolio state.

### 2.3 Post-GE Career Pathway Hub
**Location:** New component (e.g., `PathwayHub.jsx`).
- **Trigger:** Frontend evaluates a `ge_completion_status` flag from the user profile endpoint to unlock this module.
- **Dynamic Catalog rendering:** The UI must fetch the taxonomy of pathways (Health & Life Sciences, Engineering, etc.) and their respective available extension courses via REST/GraphQL API. It should support infinite scroll or pagination for large course catalogs.
- **Data Model:** Must not contain any hardcoded references to specific extension schools (like Harvard or Berkeley). The school name, logo, and descriptions must arrive in the payload.

### 2.4 Franchise / Center Staff Operations
**Location:** Enhancements to `FranchiseOwnerDashboard.jsx` and `AdvisorDashboard.jsx`.
- **Configurable Calendars:** The Study Hall vs. Campus Day views must render based on the franchise's operating hours config, not a hardcoded Mon/Wed/Fri assumption.
- **Mentor Escalation Queue:** A Kanban or Ticket list view rendering dynamic support tickets. Tickets must include a JSON-driven context payload indicating why the AI escalated the student (e.g., "Inactive for 48 hours", "Failed NCE artifact 3 times").

## 3. Interaction & Animation Requirements
- **Gravitas & Tension:** Animations must not be overly "gamey" but feel like a critical flight simulator. Use "System Unlocked" transitions rather than "Level Up Popups."
- **SSO Handoffs:** When launching external courses, an interceptor modal must dynamically display the target institution's styling/name based on the API configuration before redirecting.

## 4. State Management
- Must handle dual-state for offline/local AI vs cloud-synced LMS progress. Progress ingestion events happen asynchronously.
- Use a robust state management solution (Zustand or Redux) to handle complex API payload synchronization for offline capability.
