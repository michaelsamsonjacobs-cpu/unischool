import sys
import json
import re
import os

def load_company_profile():
    vault_path = os.path.join(os.path.dirname(__file__), 'past_performance.json')
    try:
        with open(vault_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return None

def load_competitor_intel():
    intel_path = os.path.join(os.path.dirname(__file__), 'competitor_intel.json')
    try:
        with open(intel_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return None

def load_data_room():
    """Load the consolidated company data room for rich context generation."""
    data_room_path = os.path.join(os.path.dirname(__file__), 'company_data_room.md')
    try:
        with open(data_room_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception:
        return None

def detect_agency_tone(raw_text):
    """
    Detect the source agency AND solicitation type from grant/RFP text.
    Returns tone presets plus template routing fields.
    
    EdTech-adapted from A-DIGER v2.1 defense presets.
    """
    text_lower = raw_text.lower()

    # --- CRITICAL: Multi-step / event-based solicitation detection ---
    DEMO_DAY_INDICATORS = [
        'industry day', 'demo day', 'vendor day', 'industry demonstration',
        'nda', 'non-disclosure', 'application form', 'registration form',
        'register to attend', 'event registration', 'conference',
        'technology showcase', 'tech showcase', 'pitch day', 'pitch event',
        'innovation showcase', 'tabletop exercise', 'sign up',
    ]
    demo_day_matches = [ind for ind in DEMO_DAY_INDICATORS if ind in text_lower]
    if demo_day_matches:
        return {
            "tone": "EVENT",
            "agency_type": "EVENT / MULTI-STEP",
            "solicitation_type": "HUMAN_REVIEW_REQUIRED",
            "template_file": "NONE",
            "document_label": "HUMAN REVIEW REQUIRED",
            "budget_ceiling": 0,
            "pop_months": 0,
            "guidance": f"AUTO-DRAFT HALTED. Multi-step submission detected: {demo_day_matches}. Human operator must complete registration/forms manually.",
            "problem_framing": "",
            "solution_verb": "",
            "trl_framing": "",
            "human_review_required": True,
            "review_reason": f"Multi-step solicitation detected: {', '.join(demo_day_matches)}"
        }

    # --- ED/IES SBIR (Department of Education) ---
    if ('ies' in text_lower or 'institute of education sciences' in text_lower or
            ('sbir' in text_lower and ('education' in text_lower or 'department of education' in text_lower or 'ed.gov' in text_lower))):
        
        # Detect Phase II
        if 'phase ii' in text_lower or 'phase 2' in text_lower:
            return {
                "tone": "RESEARCH",
                "agency_type": "ED/IES SBIR Phase II",
                "solicitation_type": "ED_IES_SBIR_II",
                "template_file": "GOLD_STANDARD_IES_SBIR_II.md",
                "document_label": "SBIR PHASE II TECHNICAL PROPOSAL",
                "budget_ceiling": 1000000,
                "pop_months": 24,
                "guidance": "Phase II requires a functioning prototype from Phase I, a rigorous evaluation plan, evidence of feasibility, and a detailed commercialization strategy. Include letters of support from partner schools or districts.",
                "problem_framing": "represents a persistent challenge in K-12 education that technology can uniquely address",
                "solution_verb": "University School AI Inc. (University School) proposes a 24-month development and evaluation effort to",
                "trl_framing": "Our Phase I prototype has demonstrated feasibility. Phase II will conduct a rigorous randomized controlled trial to evaluate efficacy at scale."
            }
        
        return {
            "tone": "RESEARCH",
            "agency_type": "ED/IES SBIR Phase I",
            "solicitation_type": "ED_IES_SBIR_I",
            "template_file": "GOLD_STANDARD_IES_SBIR_I.md",
            "document_label": "SBIR PHASE I TECHNICAL PROPOSAL",
            "budget_ceiling": 250000,
            "pop_months": 8,
            "guidance": "IES SBIR Phase I funds prototype development and initial feasibility testing. Emphasize: (1) the specific education problem, (2) evidence-based pedagogical approach, (3) how the product will be used in authentic settings, (4) the iterative R&D plan, (5) commercialization potential. Include preliminary evidence from cognitive science literature.",
            "problem_framing": "represents a persistent challenge in K-12 education requiring innovative technological solutions",
            "solution_verb": "University School AI Inc. (University School) proposes an 8-month feasibility study to develop and test",
            "trl_framing": "Our TRL-6 prototype will undergo iterative usability testing with K-12 students during Phase I, followed by a Phase II efficacy evaluation."
        }

    # --- NSF STTR (requires Berkeley partnership) ---
    if ('sttr' in text_lower and ('nsf' in text_lower or 'national science foundation' in text_lower)):
        if 'phase ii' in text_lower or 'phase 2' in text_lower:
            return {
                "tone": "RESEARCH",
                "agency_type": "NSF STTR Phase II",
                "solicitation_type": "NSF_STTR_II",
                "template_file": "GOLD_STANDARD_NSF_STTR_II.md",
                "document_label": "NSF STTR PHASE II PROPOSAL",
                "budget_ceiling": 1000000,
                "pop_months": 24,
                "guidance": "NSF STTR Phase II requires demonstrated Phase I results. The UC Berkeley Research Institution (RI) must perform >= 30% of the work. Emphasize intellectual merit and broader impacts.",
                "problem_framing": "presents an opportunity for translational research that bridges cognitive science and educational practice",
                "solution_verb": "In collaboration with UC Berkeley, University School AI Inc. proposes to",
                "trl_framing": "Phase I validated our adaptive learning engine. Phase II will advance from prototype to classroom-ready product through rigorous co-development with UC Berkeley's School of Education."
            }

        return {
            "tone": "RESEARCH",
            "agency_type": "NSF STTR Phase I",
            "solicitation_type": "NSF_STTR_I",
            "template_file": "GOLD_STANDARD_NSF_STTR_I.md",
            "document_label": "NSF STTR PHASE I PROPOSAL",
            "budget_ceiling": 275000,
            "pop_months": 12,
            "guidance": "NSF STTR Phase I requires a formal partnership between University School AI Inc. (small business, >= 40% work) and UC Berkeley (Research Institution, >= 30% work). Emphasize: intellectual merit, broader impacts, and the unique role of the university partnership. The PI must be primarily employed by the small business.",
            "problem_framing": "presents a fundamental research challenge at the intersection of cognitive science, artificial intelligence, and educational practice",
            "solution_verb": "In partnership with UC Berkeley, University School AI Inc. proposes to investigate and develop",
            "trl_framing": "Our TRL-6 AI prototype provides the foundation for a 12-month collaborative investigation with UC Berkeley into the efficacy of Productive Failure pedagogy delivered through adaptive branching narratives."
        }

    # --- NSF SBIR (no university partner required) ---
    if ('sbir' in text_lower and ('nsf' in text_lower or 'national science foundation' in text_lower)):
        return {
            "tone": "RESEARCH",
            "agency_type": "NSF SBIR",
            "solicitation_type": "NSF_SBIR_I",
            "template_file": "GOLD_STANDARD_NSF_SBIR_I.md",
            "document_label": "NSF SBIR PHASE I PROPOSAL",
            "budget_ceiling": 275000,
            "pop_months": 12,
            "guidance": "NSF SBIR evaluates on intellectual merit and broader impacts. Emphasize the innovative AI approach (Gemma 4 local multimodal) and the potential for broad societal impact through educational equity.",
            "problem_framing": "presents a challenge that innovative small business technology can uniquely address",
            "solution_verb": "University School AI Inc. proposes to develop and validate",
            "trl_framing": "Our TRL-6 prototype demonstrates feasibility. Phase I will conduct rigorous testing to establish efficacy."
        }

    # --- NSF FINDERS FOUNDRY (K-12 co-design, 2026) ---
    if 'finders' in text_lower or 'foundry' in text_lower or ('nsf' in text_lower and 'k-12' in text_lower and 'co-design' in text_lower):
        return {
            "tone": "RESEARCH",
            "agency_type": "NSF FINDERS FOUNDRY",
            "solicitation_type": "NSF_FINDERS",
            "template_file": "GOLD_STANDARD_NSF_FINDERS.md",
            "document_label": "NSF FINDERS FOUNDRY PROPOSAL",
            "budget_ceiling": 500000,
            "pop_months": 18,
            "guidance": "NSF FINDERS requires interdisciplinary teams from universities, schools, and community stakeholders to co-design solutions. Emphasize equity, teacher/student co-design process, and community impact.",
            "problem_framing": "requires interdisciplinary collaboration between researchers, technologists, and K-12 educators to address",
            "solution_verb": "Our interdisciplinary team proposes to co-design and iteratively develop",
            "trl_framing": "Our existing AI platform provides the technological foundation. FINDERS funding will support the critical co-design process with teachers and students."
        }

    # --- DOE STEM Education ---
    if ('doe' in text_lower or 'department of energy' in text_lower) and ('stem' in text_lower or 'education' in text_lower):
        return {
            "tone": "RESEARCH",
            "agency_type": "DOE STEM Education",
            "solicitation_type": "DOE_STEM",
            "template_file": "GOLD_STANDARD_DOE_STEM.md",
            "document_label": "STEM EDUCATION PROPOSAL",
            "budget_ceiling": 200000,
            "pop_months": 12,
            "guidance": "DOE STEM programs focus on workforce pipeline development. Emphasize how the XP Engine creates a pathway from K-12 STEM engagement to STEM careers via dual enrollment.",
            "problem_framing": "threatens the future STEM workforce pipeline by failing to engage diverse K-12 students in",
            "solution_verb": "University School proposes to demonstrate",
            "trl_framing": "Our AI-powered STEM learning platform creates an engaging pathway from curiosity to career readiness."
        }

    # --- EDA Build Back Better / Economic Development ---
    if 'eda' in text_lower or 'economic development' in text_lower or 'build back better' in text_lower:
        return {
            "tone": "COMMERCIAL",
            "agency_type": "EDA BBBRC",
            "solicitation_type": "EDA_BBBRC",
            "template_file": "GOLD_STANDARD_EDA_BBBRC.md",
            "document_label": "ECONOMIC DEVELOPMENT PROPOSAL",
            "budget_ceiling": 500000,
            "pop_months": 24,
            "guidance": "EDA evaluates on job creation, regional economic impact, and innovation ecosystem building. Position the micro-school franchise model as a job-creating small business engine.",
            "problem_framing": "creates economic stagnation in underserved communities by limiting access to quality education and workforce development in",
            "solution_verb": "University School's franchise micro-school model will create sustainable education businesses in",
            "trl_framing": "Our platform enables non-educators to launch and operate effective micro-schools, creating both education access and small business employment."
        }

    # --- Generic SBIR/STTR (any agency) ---
    if 'sbir' in text_lower or 'sttr' in text_lower or 'small business' in text_lower:
        return {
            "tone": "RESEARCH",
            "agency_type": "Federal SBIR / STTR",
            "solicitation_type": "GENERIC_SBIR",
            "template_file": "GOLD_STANDARD_GENERIC_SBIR.md",
            "document_label": "SBIR/STTR TECHNICAL PROPOSAL",
            "budget_ceiling": 275000,
            "pop_months": 12,
            "guidance": "Emphasize team expertise, evidence-based approach, clear milestones, and commercialization path. Position University School as an innovative small business with university affiliation.",
            "problem_framing": "requires innovative small business solutions for",
            "solution_verb": "University School AI Inc. (University School) proposes",
            "trl_framing": "Our TRL-6 AI-powered adaptive learning platform provides a strong foundation for the proposed Phase I research."
        }

    # --- RFI / Sources Sought ---
    if 'sources sought' in text_lower or 'request for information' in text_lower or ' rfi ' in text_lower:
        return {
            "tone": "INFORMATIONAL",
            "agency_type": "RFI / Sources Sought",
            "solicitation_type": "RFI",
            "template_file": "GOLD_STANDARD_RFI.md",
            "document_label": "RFI RESPONSE",
            "budget_ceiling": 0,
            "pop_months": 0,
            "guidance": "RFIs are market research â€” show capability breadth without hard-selling. Include capability statement and relevant past work.",
            "problem_framing": "represents an area where innovative education technology solutions can provide significant value",
            "solution_verb": "University School's XP Engine platform directly addresses this need by providing",
            "trl_framing": "Our TRL-6 AI platform is ready for pilot deployment in K-12 and higher education settings."
        }

    # --- Default: Generic EdTech Grant/RFP ---
    return {
        "tone": "COMMERCIAL",
        "agency_type": "Education Grant / RFP",
        "solicitation_type": "GENERIC_EDTECH",
        "template_file": "GOLD_STANDARD_EDTECH.md",
        "document_label": "TECHNICAL PROPOSAL",
        "budget_ceiling": 250000,
        "pop_months": 12,
        "guidance": "Emphasize evidence-based pedagogy, student outcomes, data privacy (FERPA/COPPA), and scalability via franchise model.",
        "problem_framing": "creates barriers to quality education access for",
        "solution_verb": "University School proposes to demonstrate",
        "trl_framing": "Our AI-powered adaptive learning platform is ready for classroom pilot evaluation."
    }


def find_relevant_competitors(raw_text):
    """
    Scan the grant/RFP text for domain keywords and return the most relevant
    competitor differentiators to inject into the proposal.
    """
    intel = load_competitor_intel()
    if not intel:
        return []

    text_lower = raw_text.lower()
    relevant = []

    for comp in intel.get('competitors', []):
        name_lower = comp['name'].lower()
        product_lower = comp['product'].lower()

        relevance_score = 0

        # Direct name mention
        if name_lower in text_lower or product_lower in text_lower:
            relevance_score += 10

        # Domain overlap
        for weakness in comp.get('weaknesses', []):
            weakness_keywords = [w for w in weakness.lower().split() if len(w) > 5]
            for kw in weakness_keywords:
                if kw in text_lower:
                    relevance_score += 1

        if relevance_score > 0:
            relevant.append({
                "competitor": comp['name'],
                "product": comp['product'],
                "differentiator": comp['qluu_differentiator'],
                "relevance_score": relevance_score
            })

    relevant.sort(key=lambda x: x['relevance_score'], reverse=True)
    return relevant[:2]


def extract_must_haves(raw_text):
    text_lower = raw_text.lower()
    must_haves = []
    rom_multiplier = 1.0

    company = load_company_profile()
    sw_trl = company['trl']['software'] if company else 6

    tone = detect_agency_tone(raw_text)
    competitors = find_relevant_competitors(raw_text)

    # --- Must-Have Extraction (EdTech-specific) ---

    # 1. Evidence-Based Pedagogy
    if 'evidence-based' in text_lower or 'research-based' in text_lower or 'rigorous' in text_lower:
        must_haves.append({
            "category": "Evidence-Based Pedagogical Approach",
            "requirement": "Product must be grounded in peer-reviewed educational research.",
            "qluu_solution": "University School's XP Engine is built on three evidence-based frameworks: Productive Failure (Kapur, 2008-2016), Spaced Retrieval Practice (Roediger & Karpicke, 2006), and Narrative Transport Theory (Green & Brock, 2000). Our branching narrative design deliberately incorporates 'wrong' paths that create memorable correction experiences, producing 20-40% better retention than direct instruction."
        })

    # 2. Student Data Privacy
    if 'ferpa' in text_lower or 'student privacy' in text_lower or 'coppa' in text_lower or 'data protection' in text_lower:
        must_haves.append({
            "category": "Student Data Privacy (FERPA/COPPA)",
            "requirement": "Product must comply with FERPA and COPPA for student data handling.",
            "qluu_solution": "University School's local-first architecture runs all AI inference on-device using Gemma 4 via Ollama. No student data ever leaves the local machine â€” the strongest privacy posture in EdTech. Student PII is encrypted at rest and in transit. Parental consent workflows are built in for students under 13."
        })

    # 3. AI / Machine Learning
    if 'artificial intelligence' in text_lower or 'machine learning' in text_lower or 'ai-powered' in text_lower:
        must_haves.append({
            "category": "Artificial Intelligence Integration",
            "requirement": "Product must leverage AI/ML for personalized learning.",
            "qluu_solution": "University School uses Gemma 4 26B â€” a multimodal AI that natively processes video, audio, images, and text. This model ingests university lectures and automatically generates concept graphs, misconception maps, and branching narrative RPG missions. All AI processing runs locally â€” no cloud dependency, no data exposure."
        })
        rom_multiplier += 0.15

    # 4. Adaptive Learning / Personalization
    if 'adaptive' in text_lower or 'personalized' in text_lower or 'differentiated' in text_lower:
        must_haves.append({
            "category": "Adaptive Learning Pathways",
            "requirement": "Product must adapt to individual student needs and learning pace.",
            "qluu_solution": "The XP Engine's branching narrative structure creates multiple learning pathways through the same content. Students who demonstrate misconceptions are routed through correction scenes; students who show mastery advance through accelerated paths. Concept mastery is tracked per-student with real-time advisor dashboards."
        })

    # 5. Assessment & Analytics
    if 'assessment' in text_lower or 'analytics' in text_lower or 'evaluation' in text_lower or 'outcomes' in text_lower:
        must_haves.append({
            "category": "Assessment & Learning Analytics",
            "requirement": "Product must include assessment tools and learning analytics.",
            "qluu_solution": "The XP Engine tracks concept coverage, misconception exploration, decision patterns, and time-on-task for every student. Advisor dashboards display concept mastery heatmaps, XP progression, and intervention alerts. All data is exportable for institutional research purposes."
        })
        rom_multiplier += 0.1

    # 6. Accessibility / Equity
    if 'equity' in text_lower or 'underserved' in text_lower or 'access' in text_lower or 'digital divide' in text_lower:
        must_haves.append({
            "category": "Educational Equity & Access",
            "requirement": "Product must address equity in education access.",
            "qluu_solution": "University School's franchise micro-school model is designed to bring quality education to underserved communities. The local-first AI architecture works without broadband internet after initial content download, bridging the digital divide. The platform transforms university-grade content into engaging, accessible formats for all learners."
        })

    # 7. Scalability
    if 'scalab' in text_lower or 'district' in text_lower or 'statewide' in text_lower or 'national' in text_lower:
        must_haves.append({
            "category": "Scalability",
            "requirement": "Product must demonstrate potential for broad adoption.",
            "qluu_solution": "University School's franchise model enables rapid geographic scaling. Each franchise operator manages a cluster of students using the same AI-powered platform. Content is automatically generated from any university lecture video, making the system subject-agnostic and infinitely scalable across disciplines."
        })
        rom_multiplier += 0.2

    # Budget
    budget_ceiling = tone.get('budget_ceiling', 0)
    if budget_ceiling > 0:
        base_budget = int(budget_ceiling * 0.85)
        dynamic_budget = min(int(base_budget * rom_multiplier), budget_ceiling)
    else:
        base_budget = 250000
        dynamic_budget = int(base_budget * rom_multiplier)
    budget_formatted = f"${dynamic_budget:,.2f}"

    # Extract POC Emails
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    all_emails = list(set(re.findall(email_pattern, text_lower)))
    poc_emails = [e for e in all_emails if "universityschool" not in e and "example" not in e][:3]

    return {
        "status": "success",
        "must_haves": must_haves,
        "dynamic_budget": budget_formatted,
        "complexity_multiplier": round(rom_multiplier, 2),
        "tone": tone,
        "competitors": competitors,
        "poc_emails": poc_emails
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                raw_text = f.read()
            output = extract_must_haves(raw_text)
            print(json.dumps(output))
        except Exception as e:
            print(json.dumps({"error": f"Failed to read payload file: {e}"}))
    else:
        print(json.dumps({"error": "No text payload provided to the LLM."}))

