# Main Product Requirements Document (PRD): Gap Analysis & Feature Integration

## 1. Executive Summary
After a thorough review of the *University School Inspiration* documents against the current *Springroll* codebase, a significant strategic pivot must be formalized. 

**Current State:** The platform is a highly functional, secure, gamified AI learning environment utilizing local inference (Navigator), Skill Trees, and Quests.
**Target State:** University School must function as an **International University Access Operating System**. It brokers US College Credits for high school students globally, supported by Physical Hubs (Polos), an E-2 Visa-compliant Franchise model, and a rigorous Narrative Conversion Pedagogy. 

**Core Principle:** This platform must be built for scale. **No hardcoded logic, placeholder data, or university-specific hacks.** All external integrations, pathways, and credit mappings must be dynamic, API-driven, and configurable via a Super Admin control plane.

## 2. Core Feature Gaps & Requirements

### 2.1 The Dynamic Academic Mapping Engine
Currently, progress is based on arbitrary XP and standard subjects. The system needs a dynamic credit mapping engine.
- **Feature:** Dual-Credit Engine & Mapping Tool. 
- **Requirements:** 
  - Admin configurable Degree Plans (e.g., US College General Education templates specifying Writing, Math, Science requirements).
  - Configurable Equivalency Matrices mapping partner courses (like those from initial rollout partners ASU or BYU) to local High School graduation requirements.
  - The UI must render progress dynamically based on the student's assigned matrix, eliminating any hardcoded subjects.

### 2.2 Narrative Conversion Engine (NCE) Integration
The current AI Navigator is an open conversational tool. It must be constrained to the 5-Step Apprenticeship pedagogical framework programmatically.
- **Feature:** Dynamic NCE Prompt Architecture.
- **Requirements:**
  - AI encounters must act as state machines following: 1) Controlled Confusion, 2) Historical Immersion, 3) Theory Transition, 4) Artifact Creation, 5) Mental Model Extraction.
  - System prompts and scenario definitions must be stored in the database, allowing content teams to author and update Historical Simulations without code deployments.

### 2.3 LMS Integration Layer (LTI / API)
The platform does not host the accredited content. It acts as an orchestration layer.
- **Feature:** Extensible Partner Integration Gateway.
- **Requirements:**
  - Implement Learning Tools Interoperability (LTI 1.3) and standardized OAuth2/OpenID Connect flows for Single Sign-On (SSO).
  - Webhook ingestion framework to listen for progress and grade events from external LMS providers.
  - Fallback polling adapters for institutions lacking webhook capabilities. Integrations must use an adapter pattern to easily add new universities.

### 2.4 Career Pathways Module (Post-GE)
After completing General Education credits, students choose specializations.
- **Feature:** Dynamic Pathway Selection Hub.
- **Requirements:**
  - A catalog system for Pathways (e.g., Health & Life Sciences, Engineering & Tech), driven entirely by database taxonomy.
  - Extension School electives must be ingested via API or managed via an Admin CMS, rather than hardcoded in the frontend.
  - A 3-month Career Search module that unlocks programmatically based on the student's GE completion status.

### 2.5 Physical Center (Polo) Operations System
The Franchise dashboard needs operational management tools to ensure E-2 Visa compliance.
- **Feature:** Configurable Center Operating System.
- **Requirements:**
  - Dynamic attendance tracking configured to the center's specific schedule requirements (e.g., Study Hall vs. Campus Day rules).
  - Extensible CRM capabilities for Lead Management and Student Onboarding.
  - Rule-engine based SLA tracking for Human Mentor Escalations (e.g., configurable thresholds for when AI detects low progress and generates a ticket).

## 3. Scope and Phasing
**Phase 1 (Immediate):** NCE system prompt restructuring (DB-backed), Dynamic Academic Mapping Engine configuration UI, and Center Operations MVP.
**Phase 2 (Mid-term):** Standardized LTI integrations for University Partners, Dynamic Career Pathways Module.
**Phase 3 (Long-term):** Full automated franchise CRM deployment with customizable workflow logic per franchise territory.
