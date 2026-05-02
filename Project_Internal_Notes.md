# Internal Project Notes: Unischool / Springroll
## Technical & Strategic Reference

### 1. Tech Stack Summary
- **Frontend:** React 18, Vite, Tailwind CSS.
- **Animations:** Framer Motion (for "XP Pop," "Quest Complete," and smooth transitions).
- **Icons:** Lucide React & Phosphor Icons.
- **Local AI:** 
    - `@mlc-ai/web-llm` for LLM inference via WebGPU.
    - `@xenova/transformers` for local embeddings and processing.
- **Runtime:** Tauri (Desktop wrapper) for native file system access and hardware acceleration.
- **Backend/Services:** 
    - **Supabase:** Authentication (Google OAuth & Magic Links), PostgreSQL RDS (RLS enabled), Storage.
    - **Stripe:** Recurring billing for "Springroll Pro" and "Springroll Team" seats.

### 2. User Roles & Access Logic
- **`super_admin`**: Global system metrics, user management, and platform-wide billing.
- **`franchise_owner`**: Manages a specific cluster of students and facilitators. Views franchise-specific revenue and performance.
- **`parent`**: View-only access to their child's portfolio, quest progress, and skill tree growth.
- **`facilitator` / `advisor`**: Grade assignments, create new quests, and provide manual feedback to students.
- **`student`**: The primary user. Accesses the Cockpit, Navigator, Quest Log, and Skill Tree.

### 3. Data Infrastructure
- **Profiles Table:** Extends Auth.users with role-based metadata.
- **Subscriptions Table:** Tracks Stripe customer IDs and plan statuses (Pro/Team/Enterprise).
- **Workspaces:** Virtual environments where students store their files, notes, and AI-generated content.
- **The Navigator Sync:** While AI processing is local, quest progress and basic stats are synced to Supabase for cross-device continuity.

### 4. Branding Guidelines (Internal)
- **Primary Color:** `#8B2332` (Crimson) - Use for all primary buttons and headers.
- **Accent Color:** `#C9B47C` (Gold) - Reserved for rewards, XP bars, and achievement badges.
- **Typography:** 
    - `Playfair Display` for everything that should feel "Academic."
    - `Nunito` for UI elements that should feel "Playful."
    - `Inter` for data-heavy views.

### 5. Road Map Items (Mental Model)
- **Digital Twin Feature:** Implementing "AI Twin Architect" for map capture and airspace visualization.
- **Sovereign Proposal Generator:** Refactoring for 100% cloud-free operation.
- **CMMC Compliance:** Migrating to PostgreSQL native RLS and pgAudit for government-grade security.
- **Skill Tree Expansion:** Dynamic node generation based on student performance.
