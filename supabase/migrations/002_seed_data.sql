-- ============================================================
-- University School: Seed Data
-- Real partner institutions, courses, pathways, and mappings
-- ============================================================

-- ============================================================
-- 1. INSTITUTIONS — Real university partners
-- ============================================================
INSERT INTO public.institutions (id, name, short_code, institution_type, country, website_url, lms_type, supports_lti, supports_webhooks, status) VALUES
    ('a1000000-0000-0000-0000-000000000001', 'Arizona State University', 'ASU', 'university', 'US', 'https://www.asu.edu', 'canvas', TRUE, TRUE, 'active'),
    ('a1000000-0000-0000-0000-000000000002', 'Brigham Young University', 'BYU', 'university', 'US', 'https://www.byu.edu', 'canvas', TRUE, FALSE, 'active'),
    ('a1000000-0000-0000-0000-000000000003', 'Harvard Extension School', 'HARVARD_EXT', 'extension_school', 'US', 'https://extension.harvard.edu', 'canvas', TRUE, TRUE, 'active'),
    ('a1000000-0000-0000-0000-000000000004', 'UC Berkeley Extension', 'BERKELEY_EXT', 'extension_school', 'US', 'https://extension.berkeley.edu', 'canvas', TRUE, TRUE, 'active'),
    ('a1000000-0000-0000-0000-000000000005', 'UCLA Extension', 'UCLA_EXT', 'extension_school', 'US', 'https://www.uclaextension.edu', 'custom', FALSE, FALSE, 'active');

-- ============================================================
-- 2. COURSES — GE requirement courses from partner institutions
-- ============================================================

-- ASU Courses
INSERT INTO public.courses (id, institution_id, course_code, title, credits, ge_category, is_self_paced, estimated_weeks, status) VALUES
    ('c2000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'ENG 101', 'First-Year Composition I', 3.0, 'writing', TRUE, 16, 'active'),
    ('c2000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'ENG 102', 'First-Year Composition II', 3.0, 'writing', TRUE, 16, 'active'),
    ('c2000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'STP 226', 'Elements of Statistics', 3.0, 'math', TRUE, 16, 'active'),
    ('c2000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'POS 110', 'American Government and Politics', 3.0, 'social_science', TRUE, 16, 'active'),
    ('c2000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 'BIO 130', 'Introduction to Environmental Science', 3.0, 'natural_science', TRUE, 16, 'active'),
    ('c2000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 'FIN 294', 'Fundamentals of Personal Finance', 3.0, 'elective', TRUE, 8, 'active'),
    ('c2000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000001', 'HST 110', 'United States Since 1865', 3.0, 'humanities', TRUE, 16, 'active');

-- BYU Courses
INSERT INTO public.courses (id, institution_id, course_code, title, credits, ge_category, is_self_paced, estimated_weeks, status) VALUES
    ('c2000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000002', 'ECON 110', 'Economic Principles and Problems', 3.0, 'social_science', TRUE, 16, 'active');

-- ============================================================
-- 3. REQUIREMENT MATRIX — US HS Graduation + US College GE
-- ============================================================

INSERT INTO public.requirement_matrices (id, name, matrix_type, description, applies_to_country, is_default, requirements) VALUES
    -- High School credit fulfillment via college courses
    ('m3000000-0000-0000-0000-000000000001', 'US High School Equivalency', 'high_school',
     'Maps US college courses to US high school graduation requirements',
     'BR', TRUE,
     '{
        "US_History": {"credits_required": 1.0, "label": "U.S. History"},
        "US_Government": {"credits_required": 0.5, "label": "U.S. Government / Civics"},
        "Economics": {"credits_required": 0.5, "label": "Economics"},
        "Financial_Literacy": {"credits_required": 0.5, "label": "Personal Financial Literacy"}
     }'::jsonb
    ),
    -- College General Education requirements
    ('m3000000-0000-0000-0000-000000000002', 'US College General Education', 'college_ge',
     'Standard US college General Education credit requirements',
     'BR', TRUE,
     '{
        "Writing": {"credits_required": 6.0, "label": "Writing / English", "courses_needed": 2},
        "Math": {"credits_required": 3.0, "label": "Math / Quantitative Reasoning", "courses_needed": 1},
        "Natural_Science": {"credits_required": 3.0, "label": "Natural Science", "courses_needed": 1},
        "Social_Science": {"credits_required": 3.0, "label": "Social Science", "courses_needed": 1},
        "Humanities": {"credits_required": 3.0, "label": "Humanities / Civic / Ethics", "courses_needed": 1}
     }'::jsonb
    );

-- ============================================================
-- 4. COURSE EQUIVALENCIES — Link courses to requirement matrices
-- ============================================================

-- HS Equivalencies
INSERT INTO public.course_equivalencies (course_id, matrix_id, requirement_key, credits_fulfilled) VALUES
    ('c2000000-0000-0000-0000-000000000007', 'm3000000-0000-0000-0000-000000000001', 'US_History', 1.0),
    ('c2000000-0000-0000-0000-000000000004', 'm3000000-0000-0000-0000-000000000001', 'US_Government', 0.5),
    ('c2000000-0000-0000-0000-000000000008', 'm3000000-0000-0000-0000-000000000001', 'Economics', 0.5),
    ('c2000000-0000-0000-0000-000000000006', 'm3000000-0000-0000-0000-000000000001', 'Financial_Literacy', 0.5);

-- College GE Equivalencies
INSERT INTO public.course_equivalencies (course_id, matrix_id, requirement_key, credits_fulfilled) VALUES
    ('c2000000-0000-0000-0000-000000000001', 'm3000000-0000-0000-0000-000000000002', 'Writing', 3.0),
    ('c2000000-0000-0000-0000-000000000002', 'm3000000-0000-0000-0000-000000000002', 'Writing', 3.0),
    ('c2000000-0000-0000-0000-000000000003', 'm3000000-0000-0000-0000-000000000002', 'Math', 3.0),
    ('c2000000-0000-0000-0000-000000000005', 'm3000000-0000-0000-0000-000000000002', 'Natural_Science', 3.0),
    ('c2000000-0000-0000-0000-000000000004', 'm3000000-0000-0000-0000-000000000002', 'Social_Science', 3.0),
    ('c2000000-0000-0000-0000-000000000007', 'm3000000-0000-0000-0000-000000000002', 'Humanities', 3.0);

-- ============================================================
-- 5. CAREER PATHWAYS
-- ============================================================

INSERT INTO public.career_pathways (id, name, slug, description, icon_name, color, display_order, requires_ge_complete, status) VALUES
    ('p4000000-0000-0000-0000-000000000001', 'Health & Life Sciences', 'health-life-sciences', 'Medicine, Dentistry, Veterinary, Nursing, Psychology, Public Health, Biomedicine', 'heart-pulse', '#E53E3E', 1, TRUE, 'active'),
    ('p4000000-0000-0000-0000-000000000002', 'Engineering & Technology', 'engineering-technology', 'Computer Science, Software Engineering, Data Science, Electrical, Mechanical, Civil, Mechatronics', 'cpu', '#3182CE', 2, TRUE, 'active'),
    ('p4000000-0000-0000-0000-000000000003', 'Business, Economics & Law', 'business-economics-law', 'Business Administration, Economics, Finance, Marketing, Analytics, Pre-Law', 'briefcase', '#C9B47C', 3, TRUE, 'active'),
    ('p4000000-0000-0000-0000-000000000004', 'Agrarian & Sustainability', 'agrarian-sustainability', 'Agronomy, Environmental Studies, Sustainability, Forestry', 'leaf', '#38A169', 4, TRUE, 'active');

-- ============================================================
-- 6. SAMPLE NCE SCENARIO
-- ============================================================

INSERT INTO public.nce_scenarios (id, title, course_id, step1_confusion, step2_immersion, step3_theory, step4_artifact, step5_extraction, system_prompt_template, difficulty_level, estimated_minutes, skills_assessed, status) VALUES
    ('n5000000-0000-0000-0000-000000000001',
     'The Wright Brothers Problem: Engineering Failure',
     'c2000000-0000-0000-0000-000000000005',
     '{
        "prompt": "You must design a flying machine heavier than air. No modern engine. Limited materials. No one believes it will work. You have 3 failed glider designs behind you. What do you change?",
        "constraints": ["No modern materials", "Budget: $1000 in 1901 dollars", "3 previous failures"],
        "timer_seconds": 300
     }'::jsonb,
     '{
        "historical_context": "It is 1901. Kitty Hawk, North Carolina. The wind is unstable. Three gliders have failed. Investors are skeptical. The Smithsonian has declared heavier-than-air flight impossible. Otto Lilienthal died 5 years ago attempting what you are about to try.",
        "decision_branches": [
            {"id": "modify_wing", "label": "Modify the wing camber based on your wind tunnel data"},
            {"id": "new_propulsion", "label": "Design a lightweight engine from scratch"},
            {"id": "change_control", "label": "Redesign the control mechanism (3-axis control)"}
        ]
     }'::jsonb,
     '{
        "concepts": ["Aerodynamic lift (Bernoulli principle)", "Drag coefficient", "3-axis control systems", "Iterative design methodology"],
        "bridge_narrative": "After your decision, you discover that the existing Smeaton coefficient used by all prior aviators was wrong by 60%. The Wright Brothers discovered this exact error through their own wind tunnel experiments. This is why theory must emerge from practice."
     }'::jsonb,
     '{
        "artifact_type": "design_document",
        "rubric": "Produce a 1-page engineering brief explaining your proposed wing design changes and the scientific reasoning. Include at least one diagram.",
        "submission_format": "rich_text"
     }'::jsonb,
     '{
        "target_mental_models": ["Iterative design under constraints", "Questioning established assumptions", "Empirical validation over authority", "Marginal gains compounding"],
        "evaluation_rubric": "Student must demonstrate understanding of at least 2 mental models with specific reference to their decisions during the simulation."
     }'::jsonb,
     'You are a Real-World Narrative Architect and Cognitive Simulation Designer. Your mission is to transform academic content into immersive, historically grounded, decision-driven learning simulations. You are NOT a tutor. You do NOT give answers. You present obstacles, frame constraints, ask decision questions, and resist giving direct answers. You adapt in real time to student choices. Learning is exploration, not compliance.',
     'intermediate',
     60,
     '["logic", "stem", "resilience", "iteration"]'::jsonb,
     'published'
    );
