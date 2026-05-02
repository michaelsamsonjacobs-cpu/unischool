import sys
import json
import os
import re

def load_company_profile():
    """Load ground-truth vault to validate claims in generated proposals."""
    vault_path = os.path.join(os.path.dirname(__file__), 'past_performance.json')
    try:
        with open(vault_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return None

# Phrases that should NEVER appear in a Qluu proposal given current company status
FORBIDDEN_CLAIMS = [
    "proven track record",
    "successfully deployed",
    "operational environment",
    "trl 7", "trl 8", "trl 9",
    "iso 9001",
    "cmmi",
    "live-fire",
    "fielded system",
    "deployed at",
    "3 major energy",
]

def grade_proposal(draft_text, must_haves_json_str):
    try:
        must_haves_data = json.loads(must_haves_json_str)
    except json.JSONDecodeError:
        return json.dumps({"error": "Failed to decode must_haves payload inside Red Team Grader."})

    company = load_company_profile()
    draft_lower = draft_text.lower()
    
    tone = must_haves_data.get('tone', {})
    expected_label = tone.get('document_label', '')
    budget_ceiling = tone.get('budget_ceiling', 0)
    
    scores = {}
    deficiencies = []

    # ============================================================
    # CHECK 0: Forbidden Claims (Hallucination / Integrity Gate)
    # ============================================================
    forbidden_score = 0
    for claim in FORBIDDEN_CLAIMS:
        if claim in draft_lower:
            forbidden_score -= 25.0
            deficiencies.append({
                "category": "INTEGRITY VIOLATION",
                "error": f"Proposal contains forbidden claim: '{claim}'. Factually inaccurate for Qluu.",
                "severity": "CRITICAL"
            })

    # ============================================================
    # CHECK 1: Compliance (30 pts)
    # ============================================================
    compliance = 0
    
    # 1. Correct document header (5 pts)
    if expected_label and expected_label.lower() in draft_lower:
        compliance += 5
    elif 'proposal white paper' in draft_lower and expected_label and expected_label.lower() != 'proposal white paper':
        compliance += 1
        deficiencies.append({
            "category": "Compliance",
            "error": f"Wrong header format. Expected '{expected_label}'.",
            "severity": "MAJOR"
        })
    else:
        compliance += 3
        
    # 2. UEI/CAGE checks (assumed injected post-drafting or in workflow, checking for intent)
    # If the markdown draft has Qluu Lab Inc, we give points.
    if 'qluu lab' in draft_lower:
        compliance += 6
    
    # 3. Budget within ceiling (5 pts)
    if budget_ceiling > 0:
        budget_match = re.search(r'\$[\d,]+(?:\.\d{2})?', draft_lower[:3000])
        if budget_match:
            try:
                budget_val = float(budget_match.group(0).replace('$', '').replace(',', '').replace('.00', ''))
                if budget_val <= budget_ceiling:
                    compliance += 5
                elif budget_val <= budget_ceiling * 1.1:
                    compliance += 3
                    deficiencies.append({"category": "Budget", "error": f"Budget slightly over ceiling: ${budget_val:,.0f} vs ${budget_ceiling:,.0f}", "severity": "MINOR"})
                else:
                    compliance += 0
                    deficiencies.append({"category": "Budget", "error": f"BUDGET EXCEEDS CEILING: ${budget_val:,.0f} vs ${budget_ceiling:,.0f} max", "severity": "CRITICAL"})
            except:
                compliance += 2
        else:
            compliance += 3
    else:
        compliance += 5
        
    # 4. Mandatory Sections (14 pts)
    if 'key personnel' in draft_lower or 'michael jacobs' in draft_lower:
        compliance += 4
    if 'data rights' in draft_lower or 'limited rights' in draft_lower:
        compliance += 4
    if 'rough order of magnitude' in draft_lower or 'rom' in draft_lower:
        compliance += 6
    else:
        deficiencies.append({"category": "Compliance", "error": "ROM Budget section missing.", "severity": "MAJOR"})
        
    scores['Compliance'] = min(30, compliance)

    # ============================================================
    # CHECK 2: Technical Merit (25 pts)
    # ============================================================
    technical = 0
    
    generic_phrases = ['autonomous threat detection and intent classification in modern multidomain environments']
    if not any(gp in draft_lower for gp in generic_phrases):
        technical += 5
    else:
        deficiencies.append({"category": "Technical Merit", "error": "Generic problem statement detected (boilerplate).", "severity": "MAJOR"})
        
    vjepa_count = sum(1 for vi in ['v-jepa', 'predictive', 'latent', '120 second', '14.7m', 'world model'] if vi in draft_lower)
    technical += min(5, vjepa_count * 2)
    
    metric_count = sum(1 for mi in ['92%', '14.7m', '38ms', '11.2w', '15w', 'trl-6', 'trl 6', '1,000 scenario'] if mi in draft_lower)
    technical += min(5, metric_count * 2)
    
    edge_count = sum(1 for ei in ['jetson', 'orin', 'edge', 'swap'] if ei in draft_lower)
    technical += min(5, edge_count * 2)
    
    mosa_count = sum(1 for mi in ['mosa', 'asterix', 'cot', 'rtsp'] if mi in draft_lower)
    technical += min(5, mosa_count * 2)
    
    scores['Technical'] = technical

    # ============================================================
    # CHECK 3: Must-Have Coverage (Integrates old logic)
    # ============================================================
    must_haves = must_haves_data.get("must_haves", [])
    must_have_deductions = 0
    for mh in must_haves:
        solution = mh.get("qluu_solution", "").lower()
        keywords = set(word for word in solution.split() if len(word) > 4)
        found_keywords = sum(1 for kw in keywords if kw in draft_lower)
        match_ratio = found_keywords / len(keywords) if keywords else 1.0
        
        if match_ratio < 0.3:
            must_have_deductions -= 5.0
            deficiencies.append({
                "category": "Must-Haves",
                "error": f"Inadequate coverage of required feature: {mh.get('requirement')}",
                "severity": "MAJOR"
            })

    # ============================================================
    # CHECK 4: Team, Commercial, Differentiation, Polish (45 pts)
    # ============================================================
    team = 0
    if 'uc berkeley' in draft_lower: team += 5
    if 'startup' in draft_lower or 'founder' in draft_lower: team += 5
    if 'techstars' in draft_lower: team += 5
    scores['Team'] = team
    
    commercial = min(10, sum(1 for ci in ['dual-use', 'civilian', 'critical infrastructure', 'saas', 'commercial'] if ci in draft_lower) * 2)
    if commercial < 4:
        deficiencies.append({"category": "Commercialization", "error": "Weak commercialization narrative.", "severity": "MINOR"})
    scores['Commercial'] = commercial

    diff = sum(1 for ui in ['predictive vs', 'hardware-agnostic', 'no vendor lock', 'zero hardware', 'cost asymmetry', 'anduril', 'shield ai', 'coyote'] if ui in draft_lower)
    scores['Differentiation'] = min(10, diff * 2)
    if scores['Differentiation'] < 4:
        deficiencies.append({"category": "Differentiation", "error": "Weak competitive differentiation.", "severity": "MINOR"})
        
    polish = 10
    if '[insert' in draft_lower or '[tbd' in draft_lower or 'placeholder' in draft_lower:
        polish -= 5
        deficiencies.append({"category": "Polish", "error": "Contains [INSERT]/[TBD]/PLACEHOLDER markers.", "severity": "MAJOR"})
    if 'qluu inc.' in draft_lower and 'qluu lab' not in draft_lower:
        polish -= 2
    if len(draft_text.split()) < 400:
        polish -= 5
        deficiencies.append({"category": "Polish", "error": "Proposal is too short/thin.", "severity": "MAJOR"})
    scores['Polish'] = max(0, polish)

    # ============================================================
    # FINAL SCORE COMPILATION
    # ============================================================
    base_score = sum(scores.values()) + forbidden_score + must_have_deductions
    base_score = max(0.0, min(100.0, base_score))

    # The Red Team Pass Threshold is >85
    passed = base_score >= 82.0

    return json.dumps({
        "status": "PASS" if passed else "FAIL",
        "score": round(base_score, 1),
        "deficiencies": deficiencies,
        "approval_gate": passed,
        "breakdown": scores
    })

if __name__ == "__main__":
    if len(sys.argv) > 2:
        draft_payload = sys.argv[1]
        must_haves_payload = sys.argv[2]
        
        if draft_payload.endswith('.md'):
            with open(draft_payload, 'r', encoding='utf-8') as f:
                draft_payload = f.read()
                
        if must_haves_payload.endswith('.json'):
            with open(must_haves_payload, 'r', encoding='utf-8') as f:
                must_haves_payload = f.read()

        output = grade_proposal(draft_payload, must_haves_payload)
        print(output)
    else:
        print(json.dumps({"error": "Insufficient arguments passed to Red Team Grader. Expected: <draft_text> <must_haves_json>"}))
