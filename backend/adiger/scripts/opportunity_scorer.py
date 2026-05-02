import sys
import json
import os
import re

def load_company_profile():
    vault_path = os.path.join(os.path.dirname(__file__), 'past_performance.json')
    with open(vault_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def score_opportunity(rfp_text):
    """
    Evaluates whether University School should pursue an opportunity based on
    structural fit between the RFP/grant requirements and our actual capabilities.
    Returns GO / NO-GO / CONDITIONAL with explicit reasoning.
    
    Adapted from A-DIGER v2.1 for EdTech vertical.
    """
    text_lower = rfp_text.lower()
    company = load_company_profile()
    
    score = 100
    blockers = []
    mitigations = []
    strengths = []

    sw_trl = company['trl']['software']

    # ============================================================
    # HARD BLOCKERS (any one of these = NO-GO)
    # ============================================================

    # 1. Military/Defense-only scope (we are EdTech, not defense)
    defense_keywords = [
        'weapons system', 'munitions', 'kinetic', 'warfighter', 'counter-uas',
        'c-uas', 'ballistic', 'nuclear', 'classified', 'top secret', 'ts/sci',
        'facility clearance', 'fcl'
    ]
    defense_hits = [kw for kw in defense_keywords if kw in text_lower]
    if len(defense_hits) >= 2:
        score -= 60
        blockers.append(f"Defense/military-only scope detected: {defense_hits[:3]}. University School is civilian EdTech.")

    # 2. Hardware manufacturing required
    if 'hardware manufacturing' in text_lower or 'fabrication' in text_lower:
        if 'prototype delivery' in text_lower or 'physical device' in text_lower:
            score -= 50
            blockers.append("Requires hardware manufacturing or physical device delivery. University School is a pure SaaS platform.")

    # 3. Certification Requirements we don't have
    cert_checks = [
        ('cmmi', 'CMMI certification'),
        ('iso 9001', 'ISO 9001 Quality Management'),
        ('fedramp authorized', 'Active FedRAMP Authorization'),
        ('hipaa certified', 'HIPAA certification'),
    ]
    for keyword, cert_name in cert_checks:
        if keyword in text_lower and 'required' in text_lower:
            score -= 40
            blockers.append(f"Requires {cert_name}. University School does not currently hold this.")

    # 4. Large-business set-aside
    if 'large business' in text_lower and 'set-aside' in text_lower:
        score -= 50
        blockers.append("Set aside for Large Business. University School is a small business.")

    # 5. Out of Scope / Irrelevant Verticals
    out_of_scope_keywords = [
        'foodservice', 'food service', 'janitorial', 'landscaping', 'construction',
        'plumbing', 'roofing', 'hvac', 'custodial', 'dental',
        'catering', 'laundry', 'pest control', 'furniture', 'apparel',
        'petroleum', 'mining', 'drilling', 'forestry'
    ]
    for kw in out_of_scope_keywords:
        if kw in text_lower:
            score -= 60
            blockers.append(f"Highly irrelevant vertical detected: '{kw}'. University School focus is EdTech/AI learning.")

    # 6. Requires medical device or pharmaceutical expertise
    if ('medical device' in text_lower or 'pharmaceutical' in text_lower or 'fda approval' in text_lower):
        score -= 50
        blockers.append("Medical/pharma scope. University School is education-focused.")

    # ============================================================
    # CONDITIONAL WARNINGS (reduce score but don't block)
    # ============================================================

    # Past performance requirements
    if 'past performance' in text_lower and 'required' in text_lower:
        if 'similar scope' in text_lower or 'relevant experience' in text_lower:
            score -= 15
            mitigations.append("Requires relevant past performance. University School has prototype-stage R&D only. Propose Berkeley partnership and Techstars affiliation as credibility signals.")

    # Requires operational deployment at scale
    if 'deployed' in text_lower and ('school district' in text_lower or 'statewide' in text_lower):
        if 'currently' in text_lower or 'active deployment' in text_lower:
            score -= 15
            mitigations.append("Requires current deployment at scale. University School is pre-deployment. Position as Phase I feasibility pilot.")

    # TRL floor
    trl_match = re.search(r'trl\s*[-\s]?(\d)\s*(?:or higher|minimum|\+|required)', text_lower)
    if trl_match:
        required_trl = int(trl_match.group(1))
        if required_trl > sw_trl + 1:
            score -= 35
            blockers.append(f"Requires TRL {required_trl}+. University School software is TRL {sw_trl}. Gap too large.")
        elif required_trl > sw_trl:
            score -= 10
            mitigations.append(f"Requires TRL {required_trl}. We are at TRL {sw_trl}. Achievable within Phase I.")

    # ============================================================
    # STRENGTHS (things that boost our fit)
    # ============================================================

    strength_signals = [
        # Direct EdTech alignment (high-specificity keywords)
        ('education technology', 'Direct EdTech alignment with University School\'s core mission.'),
        ('adaptive learning', 'Adaptive learning is our core XP Engine differentiator.'),
        ('personalized learning', 'Personalized learning pathways are central to our branching narrative engine.'),
        ('game-based learning', 'Game-based learning via interactive RPG missions is our primary pedagogical approach.'),
        ('ai tutor', 'AI-powered tutoring aligns with our Gemma 4 local AI backbone.'),
        
        # Subject alignment (require multi-word to avoid false positives)
        ('stem education', 'STEM education alignment — our physics demo mission validates this.'),
        ('k-12', 'K-12 is our primary target demographic.'),
        ('curriculum development', 'Curriculum development from university content is our core capability.'),
        ('learning assessment', 'Adaptive assessment with concept mastery tracking is built into the XP Engine.'),
        ('learning analytics', 'Learning analytics with per-student dashboards for advisors.'),
        ('education research', 'Education research aligns with our evidence-based approach.'),
        ('student engagement', 'Student engagement through RPG narratives is our primary innovation.'),
        
        # Grant-specific signals
        ('small business innovation', 'SBIR program designed for companies at our stage.'),
        ('sbir', 'SBIR program designed for companies at our stage.'),
        ('sttr', 'STTR aligns with our Berkeley university partnership.'),
        ('phase i', 'Phase I feasibility matches our TRL-6 prototype maturity.'),
        
        # Equity & access signals (high-value for federal education grants)
        ('underserved', 'Micro-school franchise model specifically targets underserved communities.'),
        ('educational equity', 'Educational equity is a core mission — franchise model brings quality to underserved areas.'),
        ('digital divide', 'Local-first AI architecture works without cloud broadband — bridges digital divide.'),
        ('remote learning', 'Remote/distance learning is our primary delivery model.'),
        ('dual enrollment', 'Dual enrollment college credit pathway via ASU Online integration.'),
        ('distance education', 'Distance education is our primary delivery model.'),
        
        # Privacy & compliance (differentiation in EdTech grants)
        ('ferpa', 'FERPA compliance is built into our local-first architecture by design.'),
        ('student privacy', 'Student data never leaves the device — strongest privacy posture in EdTech.'),
        ('coppa', 'COPPA compliance built in for students under 13.'),
        
        # University partnership
        ('university partnership', 'University partnerships are central to our content pipeline and Berkeley affiliation.'),
        ('research institution', 'UC Berkeley qualifies as our STTR Research Institution partner.'),
    ]

    for keyword, reason in strength_signals:
        if keyword in text_lower:
            score += 3
            strengths.append(reason)

    # ── EDUCATION RELEVANCE PENALTY ──
    # If no education-specific keyword was detected, this opportunity is likely not
    # relevant to an EdTech company. Penalize significantly.
    education_signals = [
        'education', 'learning', 'student', 'teacher', 'school',
        'curriculum', 'tutoring', 'instruction', 'classroom',
        'pedagogy', 'literacy', 'k-12', 'higher ed'
    ]
    edu_hits = sum(1 for kw in education_signals if kw in text_lower)
    if edu_hits == 0:
        score -= 25  # Significant penalty for zero education relevance

    # Deduplicate strengths
    strengths = list(dict.fromkeys(strengths))

    # Clamp score
    score = max(0, min(112, score))

    # Decision logic
    if len(blockers) > 0 and score < 30:
        recommendation = "NO-GO"
    elif len(blockers) > 0 or score < 60:
        recommendation = "CONDITIONAL"
    else:
        recommendation = "GO"

    return {
        "recommendation": recommendation,
        "score": score,
        "blockers": blockers,
        "mitigations": mitigations,
        "strengths": strengths[:5],  # Top 5
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                raw_text = f.read()
            result = score_opportunity(raw_text)
            print(json.dumps(result))
        except Exception as e:
            print(json.dumps({"error": f"Failed to score opportunity: {e}"}))
    else:
        print(json.dumps({"error": "No file path provided."}))
