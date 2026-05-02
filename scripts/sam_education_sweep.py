#!/usr/bin/env python3
"""
University School AI -- SAM.gov Education Grant Pipeline Scanner
Queries the SAM.gov Opportunities API for education grants, SBIR/STTR
opportunities, and charter school funding relevant to University School AI.

Usage:
    python scripts/sam_education_sweep.py
"""
import requests, json, os, datetime, time, sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

API_KEY = os.environ.get("SAM_API_KEY", "SAM-82e255ed-75dc-4185-9273-f0012a30b91c")
URL = "https://api.sam.gov/opportunities/v2/search"
LOOKBACK_DAYS = 180

# Education-focused search queries
SEARCH_QUERIES = [
    # Direct EdTech / Education innovation
    {"q": "education technology innovation", "ncode": ""},
    {"q": "SBIR education", "ncode": ""},
    {"q": "STTR education research", "ncode": ""},
    {"q": "charter school program", "ncode": ""},
    {"q": "digital learning technology", "ncode": ""},
    {"q": "artificial intelligence education", "ncode": ""},
    {"q": "STEM education grant", "ncode": ""},
    {"q": "adaptive learning technology", "ncode": ""},
    # Specific agencies
    {"q": "Institute Education Sciences IES", "ncode": ""},
    {"q": "NSF education STEM", "ncode": ""},
    {"q": "education innovation research", "ncode": ""},
    # Specific program areas
    {"q": "K-12 curriculum technology", "ncode": ""},
    {"q": "student assessment learning analytics", "ncode": ""},
    {"q": "educational software", "ncode": "611710"},
    {"q": "computer based training education", "ncode": ""},
    {"q": "school choice charter", "ncode": ""},
    {"q": "workforce development training", "ncode": ""},
    {"q": "gamification education", "ncode": ""},
    {"q": "personalized learning", "ncode": ""},
]

# NAICS codes relevant to University School AI
RELEVANT_NAICS = {
    "611710": "Educational Support Services",
    "611310": "Colleges/Universities/Professional Schools",
    "611110": "Elementary & Secondary Schools",
    "611430": "Professional & Management Development Training",
    "541511": "Custom Computer Programming Services",
    "541512": "Computer Systems Design Services",
    "541715": "R&D in Physical/Engineering/Life Sciences",
    "541720": "R&D in Social Sciences & Humanities",
    "511210": "Software Publishers",
    "541990": "All Other Professional/Scientific/Technical Services",
    "611420": "Computer Training",
    "611691": "Exam Preparation & Tutoring",
    "611699": "All Other Miscellaneous Schools & Instruction",
}

# Keywords indicating high relevance to University School AI
HIGH_RELEVANCE = [
    "education", "edtech", "learning", "k-12", "k12",
    "charter school", "charter", "micro-school", "microschool",
    "curriculum", "assessment", "pedagogy", "instructional",
    "sbir", "sttr", "ies", "nsf",
    "artificial intelligence", "ai", "machine learning",
    "adaptive learning", "personalized learning",
    "gamification", "game-based", "interactive",
    "stem", "steam", "science education",
    "student", "teacher", "classroom",
    "digital learning", "online learning", "blended learning",
    "literacy", "reading", "math",
    "educational technology", "software",
    "research", "innovation", "evidence-based",
    "dual enrollment", "college readiness",
    "school choice", "esa", "voucher",
    "ferpa", "coppa", "student privacy",
    "franchise", "scaling",
]

# Types we care about
ACTIONABLE_TYPES = [
    "Solicitation", "Combined Synopsis/Solicitation", "Presolicitation",
    "Sources Sought", "Broad Agency Announcement", "Special Notice",
    "Award Notice", "Justification",
]

OUTPUT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data", "grant_pipeline.json"
)


def score_opportunity(opp):
    """Score an opportunity's relevance to University School AI (0-100)."""
    s = 0
    title = (opp.get("title") or "").lower()
    dept = (opp.get("fullParentPathName") or opp.get("department", "")).lower()
    naics = opp.get("naicsCode", "")
    otype = opp.get("type", "")

    # Title keyword matches
    for kw in HIGH_RELEVANCE:
        if kw in title:
            s += 12

    # Department relevance
    edu_depts = ["education", "nsf", "national science", "ies", "institute of education"]
    for d in edu_depts:
        if d in dept:
            s += 15
    if "health" in dept and "education" in title:
        s += 5
    if "commerce" in dept and ("sbir" in title or "sttr" in title):
        s += 8

    # NAICS match
    if naics in RELEVANT_NAICS:
        s += 15

    # Type preference
    if otype in ["Solicitation", "Combined Synopsis/Solicitation"]:
        s += 10
    elif otype in ["Sources Sought", "Presolicitation"]:
        s += 8
    elif otype == "Broad Agency Announcement":
        s += 12

    # Deadline bonus
    deadline = opp.get("responseDeadLine")
    if deadline:
        try:
            dl = datetime.datetime.fromisoformat(str(deadline).replace("Z", "+00:00"))
            now = datetime.datetime.now(datetime.timezone.utc)
            days_left = (dl - now).days
            if 7 <= days_left <= 90:
                s += 10
            elif days_left > 90:
                s += 5
        except Exception:
            pass

    return min(s, 100)


def query_sam(keyword, ncode="", offset=0):
    """Query SAM.gov API."""
    posted_from = (
        datetime.datetime.now() - datetime.timedelta(days=LOOKBACK_DAYS)
    ).strftime("%m/%d/%Y")
    posted_to = datetime.datetime.now().strftime("%m/%d/%Y")

    params = {
        "api_key": API_KEY,
        "q": keyword,
        "postedFrom": posted_from,
        "postedTo": posted_to,
        "limit": 25,
        "offset": offset,
    }
    if ncode:
        params["ncode"] = ncode

    try:
        resp = requests.get(URL, params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        return data.get("opportunitiesData", []), data.get("totalRecords", 0)
    except requests.exceptions.RequestException as e:
        print(f"    ERROR: {e}")
        return [], 0


def main():
    print("=" * 72)
    print("  UNIVERSITY SCHOOL AI -- SAM.gov Education Grant Sweep")
    print(f"  API Key: ...{API_KEY[-8:]}")
    print(f"  Window: {LOOKBACK_DAYS} days")
    print(f"  Queries: {len(SEARCH_QUERIES)}")
    print("=" * 72)

    all_opps = {}

    for i, qcfg in enumerate(SEARCH_QUERIES):
        kw = qcfg["q"]
        nc = qcfg.get("ncode", "")
        print(f"\n  [{i+1}/{len(SEARCH_QUERIES)}] Querying: '{kw}'" + (f" (NAICS: {nc})" if nc else ""))
        results, total = query_sam(kw, nc)
        new_count = 0

        for opp in results:
            nid = opp.get("noticeId", "")
            if not nid or nid in all_opps:
                continue

            otype = opp.get("type", "")
            if otype not in ACTIONABLE_TYPES:
                continue

            relevance = score_opportunity(opp)
            if relevance >= 20:
                all_opps[nid] = {
                    "noticeId": nid,
                    "solicitationNumber": opp.get("solicitationNumber", ""),
                    "title": opp.get("title", ""),
                    "department": opp.get("fullParentPathName", ""),
                    "subTier": opp.get("organizationType", ""),
                    "postedDate": opp.get("postedDate", ""),
                    "responseDeadLine": opp.get("responseDeadLine"),
                    "type": otype,
                    "naicsCode": opp.get("naicsCode", ""),
                    "uiLink": opp.get("uiLink", ""),
                    "setAside": opp.get("typeOfSetAsideDescription"),
                    "source": "sam_api_live",
                    "relevanceScore": relevance,
                    "scannedAt": datetime.datetime.now().isoformat(),
                }
                new_count += 1
                print(f"    ** {opp.get('title','')[:65]} | {otype} | NAICS:{opp.get('naicsCode','')}")

        print(f"    -> {len(results)} raw / {total} total / {new_count} new qualified")
        time.sleep(1)

    # Sort by score
    pipeline = sorted(all_opps.values(), key=lambda x: x["relevanceScore"], reverse=True)

    # Save
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(pipeline, f, indent=4)

    # Report
    print("\n" + "=" * 72)
    print(f"  PIPELINE RESULTS: {len(pipeline)} qualified opportunities")
    print("=" * 72)

    tier1 = [o for o in pipeline if o["relevanceScore"] >= 50]
    tier2 = [o for o in pipeline if 35 <= o["relevanceScore"] < 50]
    tier3 = [o for o in pipeline if 20 <= o["relevanceScore"] < 35]

    if tier1:
        print(f"\n  [!!] TIER 1 -- HIGH FIT ({len(tier1)} opps, score >=50):")
        for o in tier1[:15]:
            dl = (o.get("responseDeadLine") or "N/A")[:10]
            sol = o["solicitationNumber"][:25]
            t = o["title"][:60]
            print(f"    [{o['relevanceScore']:3d}] {sol:25s} | {t:60s} | Due: {dl}")
            print(f"          Type: {o['type']} | NAICS: {o['naicsCode']}")
            print(f"          Dept: {(o.get('department','') or '')[:80]}")

    if tier2:
        print(f"\n  [!] TIER 2 -- GOOD FIT ({len(tier2)} opps, score 35-49):")
        for o in tier2[:10]:
            dl = (o.get("responseDeadLine") or "N/A")[:10]
            sol = o["solicitationNumber"][:25]
            t = o["title"][:60]
            print(f"    [{o['relevanceScore']:3d}] {sol:25s} | {t:60s} | Due: {dl}")

    if tier3:
        print(f"\n  [.] TIER 3 -- MONITOR ({len(tier3)} opps, score 20-34):")
        print(f"    (showing top 5 of {len(tier3)})")
        for o in tier3[:5]:
            dl = (o.get("responseDeadLine") or "N/A")[:10]
            sol = o["solicitationNumber"][:25]
            t = o["title"][:60]
            print(f"    [{o['relevanceScore']:3d}] {sol:25s} | {t:60s} | Due: {dl}")

    print(f"\n  Output: {OUTPUT_PATH}")
    print(f"  Summary: {len(tier1)} Tier-1 | {len(tier2)} Tier-2 | {len(tier3)} Tier-3 | {len(pipeline)} total")

if __name__ == "__main__":
    main()
