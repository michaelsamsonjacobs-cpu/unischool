-- ============================================================
-- University School: Core Schema Migration
-- Multi-tenant academic orchestration platform
-- ============================================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. FRANCHISES (Top-level tenant)
-- ============================================================
CREATE TABLE public.franchises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    owner_user_id UUID, -- set after user creation
    territory_region TEXT,
    territory_country TEXT DEFAULT 'BR',
    timezone TEXT DEFAULT 'America/Sao_Paulo',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending', 'terminated')),
    
    -- Stripe Connect
    stripe_account_id TEXT, -- Stripe Connect account for this franchise
    platform_fee_percent NUMERIC(5,2) DEFAULT 10.00,
    platform_fee_flat_cents INT DEFAULT 0,
    
    -- Branding overrides
    logo_url TEXT,
    primary_color TEXT DEFAULT '#8B2332',
    
    -- Operational config (JSONB so franchisees can have unique schedules/rules)
    operating_config JSONB DEFAULT '{
        "study_hall_days": ["monday", "wednesday", "friday"],
        "campus_days": ["tuesday", "thursday"],
        "operating_hours": {"open": "08:00", "close": "18:00"},
        "escalation_thresholds": {
            "max_idle_hours": 48,
            "max_nce_failures": 3
        }
    }'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. CENTERS (Physical Polos within a Franchise)
-- ============================================================
CREATE TABLE public.centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    franchise_id UUID NOT NULL REFERENCES public.franchises(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state_province TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'BR',
    capacity INT DEFAULT 30,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'setup')),
    
    -- Schedule override (inherits from franchise if null)
    operating_config_override JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. PROFILES (Extends Supabase Auth)
-- ============================================================
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN (
        'super_admin', 'franchise_owner', 'center_staff', 
        'facilitator', 'guidance_counselor', 'parent', 'student'
    )),
    
    -- Tenant binding
    franchise_id UUID REFERENCES public.franchises(id),
    center_id UUID REFERENCES public.centers(id),
    
    -- Student-specific
    parent_user_id UUID REFERENCES public.profiles(id),
    date_of_birth DATE,
    enrollment_year INT,
    hs_graduation_target_year INT,
    preferred_language TEXT DEFAULT 'en',
    
    -- Onboarding
    onboarding_complete BOOLEAN DEFAULT FALSE,
    survey_data JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Back-reference: franchise owner
ALTER TABLE public.franchises 
    ADD CONSTRAINT fk_franchise_owner 
    FOREIGN KEY (owner_user_id) REFERENCES public.profiles(id);

-- ============================================================
-- 4. INSTITUTIONS (Partner Universities)
-- ============================================================
CREATE TABLE public.institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    short_code TEXT UNIQUE NOT NULL, -- e.g., 'ASU', 'BYU', 'HARVARD_EXT'
    institution_type TEXT NOT NULL DEFAULT 'university' CHECK (institution_type IN (
        'university', 'extension_school', 'community_college', 'other'
    )),
    country TEXT DEFAULT 'US',
    website_url TEXT,
    logo_url TEXT,
    
    -- LMS Integration config
    lms_type TEXT CHECK (lms_type IN ('canvas', 'blackboard', 'moodle', 'brightspace', 'custom', NULL)),
    lms_base_url TEXT,
    lti_client_id TEXT,
    lti_deployment_id TEXT,
    oauth_client_id TEXT,
    oauth_client_secret_encrypted TEXT, -- encrypted at rest
    api_base_url TEXT,
    webhook_secret_encrypted TEXT,
    
    -- Integration capabilities
    supports_lti BOOLEAN DEFAULT FALSE,
    supports_webhooks BOOLEAN DEFAULT FALSE,
    supports_grade_passback BOOLEAN DEFAULT FALSE,
    polling_interval_minutes INT DEFAULT 60, -- fallback polling frequency
    
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending_setup')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. COURSES (Master Catalog — references external institution)
-- ============================================================
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL, -- e.g., 'ENG 101'
    title TEXT NOT NULL,       -- e.g., 'First-Year Composition I'
    description TEXT,
    credits NUMERIC(3,1) NOT NULL DEFAULT 3.0,
    
    -- External deep link / SSO launch URL template
    -- Supports variable substitution: {{student_email}}, {{student_id}}
    launch_url_template TEXT,
    
    -- Categorization
    ge_category TEXT CHECK (ge_category IN (
        'writing', 'math', 'natural_science', 'social_science', 
        'humanities', 'elective', NULL
    )),
    
    -- Scheduling
    is_self_paced BOOLEAN DEFAULT TRUE,
    estimated_weeks INT DEFAULT 16,
    
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'coming_soon')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(institution_id, course_code)
);

-- ============================================================
-- 6. REQUIREMENT MATRICES (Maps courses to HS / College reqs)
-- ============================================================
CREATE TABLE public.requirement_matrices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- e.g., 'Standard US HS Diploma', 'UC A-G College Prep'
    matrix_type TEXT NOT NULL CHECK (matrix_type IN ('high_school', 'college_ge', 'pathway')),
    description TEXT,
    
    -- The actual requirements structure
    -- Example: {"US_History": {"credits_required": 1.0, "courses": ["uuid1"]}, ...}
    requirements JSONB NOT NULL DEFAULT '{}',
    
    -- Scope
    applies_to_country TEXT DEFAULT 'BR', -- which student population
    is_default BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. COURSE EQUIVALENCIES (Atomic mapping: Course → Requirement)
-- ============================================================
CREATE TABLE public.course_equivalencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    matrix_id UUID NOT NULL REFERENCES public.requirement_matrices(id) ON DELETE CASCADE,
    requirement_key TEXT NOT NULL, -- e.g., 'US_History', 'Writing_1'
    credits_fulfilled NUMERIC(3,1) NOT NULL DEFAULT 1.0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(course_id, matrix_id, requirement_key)
);

-- ============================================================
-- 8. ENROLLMENTS (Student ↔ Course binding)
-- ============================================================
CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id),
    
    -- External reference (maps to partner LMS)
    external_enrollment_id TEXT,
    external_student_id TEXT,
    
    -- State machine
    status TEXT NOT NULL DEFAULT 'enrolled' CHECK (status IN (
        'pending', 'enrolled', 'in_progress', 'submitted', 
        'graded', 'completed', 'withdrawn', 'failed'
    )),
    
    -- Academic data (read-only from partner LMS)
    grade_letter TEXT,
    grade_numeric NUMERIC(4,2),
    completion_percentage NUMERIC(5,2) DEFAULT 0,
    
    -- Dates
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    grade_received_at TIMESTAMPTZ,
    
    -- Sync tracking
    last_synced_at TIMESTAMPTZ,
    sync_source TEXT, -- 'webhook', 'polling', 'manual'
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(student_id, course_id)
);

-- ============================================================
-- 9. CAREER PATHWAYS (Dynamic taxonomy)
-- ============================================================
CREATE TABLE public.career_pathways (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_name TEXT, -- lucide icon reference
    color TEXT DEFAULT '#8B2332',
    display_order INT DEFAULT 0,
    
    -- Unlock condition
    requires_ge_complete BOOLEAN DEFAULT TRUE,
    
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Map courses to pathways
CREATE TABLE public.pathway_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pathway_id UUID NOT NULL REFERENCES public.career_pathways(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    
    UNIQUE(pathway_id, course_id)
);

-- Student pathway selection
CREATE TABLE public.student_pathways (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    pathway_id UUID NOT NULL REFERENCES public.career_pathways(id),
    selected_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'exploring' CHECK (status IN ('exploring', 'committed', 'completed')),
    
    UNIQUE(student_id, pathway_id)
);

-- ============================================================
-- 10. NCE SCENARIOS (Narrative Conversion Engine Content)
-- ============================================================
CREATE TABLE public.nce_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    course_id UUID REFERENCES public.courses(id), -- optional link to course
    
    -- The 5-step NCE structure
    step1_confusion JSONB NOT NULL, -- {prompt, constraints, timer_seconds, media_urls}
    step2_immersion JSONB NOT NULL, -- {historical_context, decision_branches}
    step3_theory JSONB NOT NULL,    -- {concepts, bridge_narrative, unlock_animation}
    step4_artifact JSONB NOT NULL,  -- {artifact_type, rubric, submission_format}
    step5_extraction JSONB NOT NULL,-- {target_mental_models, evaluation_rubric}
    
    -- System prompt base for LLM
    system_prompt_template TEXT NOT NULL,
    knowledge_context TEXT, -- grounding data for RAG
    
    difficulty_level TEXT DEFAULT 'intermediate' CHECK (difficulty_level IN (
        'introductory', 'intermediate', 'advanced', 'capstone'
    )),
    estimated_minutes INT DEFAULT 60,
    
    -- Skills tracked
    skills_assessed JSONB DEFAULT '[]', -- ["logic", "rhetoric", "resilience"]
    
    -- Authorship
    created_by UUID REFERENCES public.profiles(id),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student progress through an NCE scenario
CREATE TABLE public.nce_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    scenario_id UUID NOT NULL REFERENCES public.nce_scenarios(id),
    
    current_step INT NOT NULL DEFAULT 1 CHECK (current_step BETWEEN 1 AND 5),
    step_data JSONB DEFAULT '{}', -- accumulated decisions, artifacts, etc.
    
    -- Artifact submission
    artifact_content TEXT,
    artifact_url TEXT,
    
    -- Mental model extraction result
    extracted_models JSONB, -- [{model_name, description, confidence_score}]
    evaluation_score NUMERIC(5,2),
    evaluation_feedback TEXT,
    
    -- XP / Skills impact
    xp_awarded INT DEFAULT 0,
    skills_delta JSONB DEFAULT '{}', -- {"logic": +15, "resilience": +10}
    
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    UNIQUE(student_id, scenario_id)
);

-- ============================================================
-- 11. SUPPORT TICKETS (AI → Human Escalation)
-- ============================================================
CREATE TABLE public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id),
    franchise_id UUID REFERENCES public.franchises(id),
    center_id UUID REFERENCES public.centers(id),
    assigned_to UUID REFERENCES public.profiles(id), -- mentor/counselor
    
    -- Classification
    ticket_type TEXT NOT NULL CHECK (ticket_type IN (
        'academic_struggle', 'attendance_risk', 'deadline_risk',
        'nce_failure', 'enrollment_issue', 'technical', 'general'
    )),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    
    -- Context
    title TEXT NOT NULL,
    description TEXT,
    trigger_source TEXT DEFAULT 'ai' CHECK (trigger_source IN ('ai', 'manual', 'system')),
    trigger_data JSONB, -- {"rule": "max_idle_hours", "value": 72, "threshold": 48}
    
    -- State
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_student', 'resolved', 'closed')),
    resolution_notes TEXT,
    
    -- SLA
    sla_due_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. ATTENDANCE (Center check-in tracking)
-- ============================================================
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id),
    center_id UUID NOT NULL REFERENCES public.centers(id),
    check_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    check_out_at TIMESTAMPTZ,
    session_type TEXT NOT NULL CHECK (session_type IN ('study_hall', 'campus_lab', 'tutoring', 'event')),
    notes TEXT,
    recorded_by UUID REFERENCES public.profiles(id) -- staff who recorded it
);

-- ============================================================
-- 13. AUDIT LOG (Immutable — E-2 Visa Compliance)
-- ============================================================
CREATE TABLE public.audit_log (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor_id UUID, -- user who performed the action
    actor_role TEXT,
    franchise_id UUID,
    center_id UUID,
    
    action TEXT NOT NULL, -- 'enrollment.created', 'ticket.resolved', etc.
    resource_type TEXT NOT NULL, -- 'enrollment', 'profile', 'ticket', etc.
    resource_id UUID,
    
    -- Change data
    old_data JSONB,
    new_data JSONB,
    
    ip_address INET,
    user_agent TEXT
);

-- Make audit_log append-only
REVOKE UPDATE, DELETE ON public.audit_log FROM PUBLIC;

-- ============================================================
-- 14. SUBSCRIPTIONS (Enhanced for franchise splits)
-- ============================================================
DROP TABLE IF EXISTS public.subscriptions CASCADE;
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    franchise_id UUID REFERENCES public.franchises(id),
    
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    stripe_price_id TEXT,
    
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'student', 'pro', 'team', 'enterprise')),
    status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN (
        'active', 'trialing', 'past_due', 'canceled', 'inactive', 'paused'
    )),
    
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 15. ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nce_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nce_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Super Admin sees everything
CREATE POLICY "super_admin_all" ON public.profiles
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
    );

-- Users see own profile
CREATE POLICY "users_own_profile" ON public.profiles
    FOR SELECT USING (id = auth.uid());

-- Students see their own enrollments
CREATE POLICY "students_own_enrollments" ON public.enrollments
    FOR SELECT USING (student_id = auth.uid());

-- Franchise owners see their franchise data
CREATE POLICY "franchise_owner_sees_franchise" ON public.franchises
    FOR SELECT USING (owner_user_id = auth.uid());

-- Parents see their children's profiles
CREATE POLICY "parents_see_children" ON public.profiles
    FOR SELECT USING (parent_user_id = auth.uid());

-- Public read for institutions and courses (catalog)
CREATE POLICY "public_read_institutions" ON public.institutions
    FOR SELECT USING (status = 'active');

CREATE POLICY "public_read_courses" ON public.courses
    FOR SELECT USING (status = 'active');

CREATE POLICY "public_read_pathways" ON public.career_pathways
    FOR SELECT USING (status = 'active');

-- Students see own NCE progress
CREATE POLICY "students_own_nce_progress" ON public.nce_progress
    FOR ALL USING (student_id = auth.uid());

-- Students see own tickets
CREATE POLICY "students_own_tickets" ON public.support_tickets
    FOR SELECT USING (student_id = auth.uid());

-- Students see own subscriptions
CREATE POLICY "students_own_subscriptions" ON public.subscriptions
    FOR SELECT USING (user_id = auth.uid());

-- ============================================================
-- 16. INDEXES
-- ============================================================
CREATE INDEX idx_profiles_franchise ON public.profiles(franchise_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_parent ON public.profiles(parent_user_id);
CREATE INDEX idx_centers_franchise ON public.centers(franchise_id);
CREATE INDEX idx_courses_institution ON public.courses(institution_id);
CREATE INDEX idx_courses_ge_category ON public.courses(ge_category);
CREATE INDEX idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_status ON public.enrollments(status);
CREATE INDEX idx_nce_progress_student ON public.nce_progress(student_id);
CREATE INDEX idx_support_tickets_student ON public.support_tickets(student_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_attendance_student ON public.attendance(student_id);
CREATE INDEX idx_attendance_center ON public.attendance(center_id);
CREATE INDEX idx_audit_log_timestamp ON public.audit_log(timestamp);
CREATE INDEX idx_audit_log_actor ON public.audit_log(actor_id);
CREATE INDEX idx_audit_log_franchise ON public.audit_log(franchise_id);
CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);

-- ============================================================
-- 17. HELPER FUNCTIONS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all mutable tables
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_franchises_updated_at BEFORE UPDATE ON public.franchises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_centers_updated_at BEFORE UPDATE ON public.centers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_institutions_updated_at BEFORE UPDATE ON public.institutions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_enrollments_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_nce_scenarios_updated_at BEFORE UPDATE ON public.nce_scenarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
