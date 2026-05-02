# University School AI — Pilot Program Design
## 15-Student "Start College at 14" Validation Study

---

## 1. Pilot Overview

| Parameter | Value |
|-----------|-------|
| **Duration** | 3 weeks (+ 1 week pre/post assessment) |
| **Students** | 15 homeschool students, ages 13–17 |
| **Locations** | FL (partner network) + AZ (universal ESA) |
| **Subjects** | Physics, Economics, Biology, Psychology |
| **Missions** | The Wright Problem, The Drop, Respawn, The Algorithm |
| **Goal** | Demonstrate measurable learning gains vs. traditional instruction |

---

## 2. Recruitment Strategy

### Target Demographic
- **Primary**: Homeschool co-ops in FL and AZ
- **Secondary**: Micro-school networks, online homeschool communities
- **Age**: 13–17 (high school equivalent)
- **Prerequisites**: None — missions are designed for zero prior knowledge

### Recruitment Channels

| Channel | Tactic | Expected Reach |
|---------|--------|----------------|
| Facebook Groups | FL/AZ homeschool groups (50K+ members each) | 200 inquiries |
| HSLDA Network | Partnership post in monthly newsletter | 150 inquiries |
| Co-op Direct | Contact 5 co-ops directly with flyer | 40 families |
| Word of Mouth | Existing partner families share link | 20 referrals |

### Enrollment Flow
1. Parent visits landing page → watches 90-second demo video
2. Fills out interest form (student name, age, grade level, subjects of interest)
3. Receives consent form via email (DocuSign)
4. Student creates account → takes Pre-Assessment
5. Orientation call (15 min) with parent + student

---

## 3. Curriculum Schedule

### Week 0: Pre-Assessment (Before missions begin)
- **Day 1**: Demographic survey + learning style questionnaire
- **Day 2**: Pre-test: 20 multiple-choice questions (5 per subject)
- **Day 3**: Orientation session (group Zoom, demo one mission scene)

### Week 1: Physics + Economics
| Day | Mission | Subject | Estimated Time |
|-----|---------|---------|----------------|
| Mon | **The Wright Problem** | PHY-101: Newton's Laws | 40 min |
| Tue | Reflection journal entry | Writing about physics concepts | 15 min |
| Wed | **The Drop** | ECON-101: Supply & Demand | 35 min |
| Thu | Reflection journal entry | Writing about economics concepts | 15 min |
| Fri | Weekly check-in survey (5 questions) | Engagement/satisfaction | 5 min |

### Week 2: Biology + Psychology
| Day | Mission | Subject | Estimated Time |
|-----|---------|---------|----------------|
| Mon | **Respawn** | BIO-101: Cell Division & Mitosis | 35 min |
| Tue | Reflection journal entry | Writing about biology concepts | 15 min |
| Wed | **The Algorithm** | PSY-101: Conditioning & Learning | 30 min |
| Thu | Reflection journal entry | Writing about psychology concepts | 15 min |
| Fri | Weekly check-in survey (5 questions) | Engagement/satisfaction | 5 min |

### Week 3: Replay + Deep Dive
| Day | Activity | Details |
|-----|----------|---------|
| Mon | Replay any mission (student choice) | Try different paths, explore error branches |
| Tue | Group discussion (Zoom) | Compare choices and outcomes across students |
| Wed | Post-test: Same 20 questions as pre-test | Measures retention and learning gain |
| Thu | Student interview (15 min each, optional) | Qualitative data on experience |
| Fri | Parent feedback survey | Satisfaction, willingness to continue, NPS |

### Week 4: Retention Test (2 weeks after post-test)
- Same 20-question assessment, unannounced
- Measures long-term retention vs. decay

---

## 4. Assessment Design

### Pre/Post Test Structure (20 Questions)

**Physics (5 questions)**
1. Newton's First Law — inertia scenario
2. F=ma calculation — given force and mass
3. Newton's Third Law — identify action-reaction pairs
4. Net force — multiple forces on an object
5. Application — why does a seatbelt work?

**Economics (5 questions)**
1. Demand curve — which direction does it slope?
2. Supply response — why do producers make more at higher prices?
3. Equilibrium — identify from supply/demand graph
4. Shortage — what happens when price is below equilibrium?
5. Elasticity — compare water during hurricane vs. luxury coffee

**Biology (5 questions)**
1. Cell cycle order — G1, S, G2, M ordering
2. G1 checkpoint — what does it check?
3. DNA replication — what is complementary base pairing?
4. Mitosis stages — match stages to descriptions
5. Cancer mechanism — how do checkpoint failures lead to cancer?

**Psychology (5 questions)**
1. Classical conditioning — identify components (CS, UCS, CR, UCR)
2. Operant conditioning — positive reinforcement vs. punishment
3. Variable reinforcement — why is it more addictive than fixed?
4. Extinction — what happens when reinforcement stops?
5. Application — identify conditioning in a real-world ad

### Scoring
- Each question: 1 point (max 20)
- Sub-scores per subject (max 5 each)
- Learning gain = Post-score − Pre-score
- Retention rate = Retention-score / Post-score × 100%

### Success Criteria

| Metric | Target | Exceptional |
|--------|--------|-------------|
| Average learning gain | ≥ 4 points (20%) | ≥ 6 points (30%) |
| Per-subject gain | ≥ 1 point per subject | ≥ 2 points per subject |
| Retention rate (Week 4) | ≥ 70% of post-score | ≥ 85% of post-score |
| Student satisfaction (NPS) | ≥ 40 | ≥ 60 |
| Completion rate | ≥ 80% complete all 4 missions | 100% |
| Parent NPS | ≥ 50 | ≥ 70 |

---

## 5. Data Collection Plan

### Quantitative Data
| Data Point | Collection Method | Frequency |
|------------|-------------------|-----------|
| Pre/Post/Retention test scores | Google Forms | 3 times |
| Mission completion data | XP Engine telemetry | Per session |
| Decision paths taken | XPSessionService logs | Per mission |
| Misconception hits | Hidden pedagogy tags | Per mission |
| Time per mission | Session timestamps | Per mission |
| XP earned per mission | Session data | Per mission |
| Weekly engagement surveys | Google Forms | Weekly |

### Qualitative Data
| Data Point | Collection Method | When |
|------------|-------------------|------|
| Reflection journals | Written entries (4 total) | After each mission |
| Student interviews | 15-min Zoom (recorded) | Week 3 |
| Parent feedback | Survey + open-ended | Week 3 |
| Group discussion | Zoom (recorded, transcribed) | Week 3 |

### Telemetry Automatically Captured
- Which nodes each student visited
- Which choices they made at every decision point
- Which misconception branches they explored
- Time spent per node
- XP accumulation curve
- Completion vs. abandonment points

---

## 6. Consent & Ethics

### Parent Consent Form (Required)
- Study purpose and procedures
- Data collection and privacy policy
- Right to withdraw at any time
- No cost to participate
- No academic credit or grade impact
- Data used only for product improvement and aggregate research
- Individual results shared only with parent

### Student Assent (Ages 13+)
- Plain-language explanation of what they'll do
- Assurance that there are no "wrong" answers
- They can stop at any time

### Data Privacy
- All student data stored locally (localStorage) — no cloud transmission
- Telemetry data anonymized before aggregation
- No PII in research reports
- COPPA/FERPA compliant by design

---

## 7. Budget

| Item | Cost | Notes |
|------|------|-------|
| Recruitment (FB ads) | $200 | Targeted to FL/AZ homeschool groups |
| Student incentives | $375 | $25 gift card per completer (15 students) |
| Parent incentives | $150 | $10 gift card per family |
| Zoom Pro (1 month) | $16 | For group calls and interviews |
| DocuSign (1 month) | $25 | For consent forms |
| Google Forms (free) | $0 | Assessments and surveys |
| **Total** | **$766** | |

---

## 8. Timeline

```
Week -2: Recruit → Screen → Enroll (target: 20 for 15 completers)
Week -1: Consent forms → Pre-assessment → Orientation Zoom
Week  1: Physics (Wright Problem) + Economics (The Drop)
Week  2: Biology (Respawn) + Psychology (The Algorithm)
Week  3: Replay + Post-test + Interviews
Week  5: Retention test (surprise)
Week  6: Data analysis → Results report
Week  7: Pitch deck update with pilot data
```

---

## 9. Deliverables

After the pilot, we produce:

1. **Pilot Results Report** — quantitative learning gains, retention data, engagement metrics
2. **Student Testimonials** — quotes and video clips (with consent) for marketing
3. **Efficacy Data Sheet** — 1-pager for grant applications (IES, NSF, state ESA programs)
4. **Updated Investor Deck** — slide with real pilot data replacing projections
5. **Franchise Case Study** — "15 students, 4 subjects, 3 weeks" for franchise marketing
6. **Product Improvement Log** — bugs, UX issues, and content gaps found during pilot

---

## 10. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Low enrollment | Over-recruit to 20 (expect 25% attrition) |
| Technical issues | Pre-test the platform with 3 internal users first |
| Low engagement | Daily check-in texts to parents during Weeks 1-2 |
| Assessment ceiling effect | Questions include 2 "stretch" items per subject above intro level |
| Parent concerns about screen time | Cap at 45 min/day, provide reflection prompts for offline discussion |
| Data loss | Automatic session backup + manual export after each mission |
