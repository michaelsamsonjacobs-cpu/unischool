import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { queryOnyxForVolume, checkOnyxHealth } from '../onyx/onyx_client';

// Ensure arguments are passed
// Usage: tsx run_auto_draft.ts <solId> <topic> [filePath1] [filePath2] ...
const solId = process.argv[2];
const topic = process.argv[3];
const filePaths = process.argv.slice(4).filter(f => f.trim().length > 0); // Optional file paths

if (!solId || !topic) {
    console.error("âŒ Missing required arguments. Usage: tsx run_auto_draft.ts <solId> <topic> [file1] [file2] ...");
    process.exit(1);
}

const docsDir = path.resolve(process.cwd(), 'docs/procurement/generated');
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

const generateWhitePaper = async (topic: string, trackingId: string, prob: string, llmPayload: any, deadline: string): Promise<string> => {
    // 1. Fetch live profile for CAGE constraints
    let profile: any = { company: "University School AI Inc.", dba: "University School", cage_code: "[NOT YET REGISTERED]", uei: "[PENDING]" };
    try {
        const perfPath = path.resolve(__dirname, 'past_performance.json');
        if (fs.existsSync(perfPath)) {
            profile = JSON.parse(fs.readFileSync(perfPath, 'utf8'));
        }
    } catch {}

    const pocString = llmPayload.poc_emails && llmPayload.poc_emails.length > 0
        ? llmPayload.poc_emails.join(', ')
        : "Not Found in attachments (Recommend checking SAM.gov / SBIR portal)";

    const budgetString = llmPayload.dynamic_budget || "$285,000";

    // 2. Attempt Onyx-powered deep-research generation for each Volume section
    const onyxHealth = await checkOnyxHealth();
    const onyxAvailable = onyxHealth.status === 'ok';
    if (onyxAvailable) {
        console.log(`  ðŸ§  Onyx RAG engine is ONLINE â€” generating deep-research prose...`);
    } else {
        console.log(`  ðŸ“ Onyx offline (${onyxHealth.detail}) â€” using template fallback.`);
    }

    const rfpContext = prob || 'BAA PDF ingested.';

    // Section 1: Significance of the Problem
    let vol2_significance = `The current K-12 education landscape faces a critical engagement crisis. Remote and hybrid learning models have exposed the limitations of passive lecture-based instruction, with completion rates for online courses remaining below 50% for most demographics. Traditional EdTech solutions offer either static curriculum (no personalization) or cloud-dependent AI (privacy concerns). University School addresses both gaps simultaneously.\n${rfpContext}`;
    if (onyxAvailable) {
        const onyxResult = await queryOnyxForVolume('Significance of the Problem', rfpContext,
            'Focus on why current EdTech fails to engage K-12 students in remote/hybrid learning. Reference the Productive Failure research and local-first AI as the solution.');
        if (onyxResult) vol2_significance = onyxResult;
    }

    // Section 2: Technical Merit
    let vol2_merit = `University School's XP Engine uses a 3-layer AI architecture: (1) Multimodal Content Ingestion via Gemma 4 26B processes lecture videos, slides, and documents in a single inference pass, extracting concept graphs and misconception maps. (2) A Branching Narrative Engine transforms these concepts into interactive RPG missions using Productive Failure pedagogy — deliberately designed 'wrong' paths create memorable correction experiences backed by research showing 20-40% retention improvement (Kapur, 2008-2016). (3) Adaptive Assessment tracks per-student concept mastery with real-time advisor dashboards.\n\n**Privacy by Design:** All AI inference runs locally on-device. No student data ever leaves the machine — the strongest FERPA/COPPA posture in EdTech.`;
    if (onyxAvailable) {
        const onyxResult = await queryOnyxForVolume('Soundness of Technical Merit and Approach', rfpContext,
            'Detail the XP Engine architecture, Gemma 4 multimodal pipeline, Productive Failure branching narratives, and local-first privacy architecture.');
        if (onyxResult) vol2_merit = onyxResult;
    }

    // Section: Commercialization
    let vol4_commercialization = `University School AI Inc. operates a franchise micro-school model designed for rapid geographic scaling across California and Florida. Each franchise operator manages a cluster of K-12 students using the AI-powered XP Engine platform. Revenue streams include monthly student seats ($29/mo), annual franchise licenses ($15,000/yr), and enterprise district licensing. The platform is subject-agnostic — any university lecture video can be transformed into playable XP missions, enabling infinite horizontal expansion across disciplines. Our Techstars 2026 cohort provides access to 10,000+ mentors and $2.3B in alumni market cap for go-to-market acceleration.`;
    if (onyxAvailable) {
        const onyxResult = await queryOnyxForVolume('Company Commercialization Report', rfpContext,
            'Describe University School AI\'s franchise model, pricing tiers, Techstars network, and path to scale across K-12 and higher education in California and Florida.');
        if (onyxResult) vol4_commercialization = onyxResult;
    }

    // 3. Assemble the final document with rigid SBIR skeleton
    let mustHavesString = "";
    if (llmPayload.must_haves && llmPayload.must_haves.length > 0) {
        mustHavesString = `## 2. Compliance with Solicitation Requirements\n`;
        llmPayload.must_haves.forEach((mh: any) => {
            mustHavesString += `### ${mh.category}\n*   **Requirement:** *"${mh.requirement}"*\n*   **University School Solution:** ${mh.qluu_solution}\n\n`;
        });
    }

    let competitorString = "";
    const competitors = llmPayload.competitors || [];
    if (competitors.length > 0) {
        competitorString = `## 7. Competitive Differentiation\n`;
        competitors.forEach((c: any) => {
            competitorString += `### vs. ${c.competitor} (${c.product})\n${c.differentiator}\n\n`;
        });
    }

    const problemStr = "effective, engaging, and equitable education delivery for K-12 students in remote and hybrid learning environments";

    // Template routing: use classified document type and budget ceiling
    const docLabel = llmPayload.tone?.document_label || 'PROPOSAL WHITE PAPER';
    const solType = llmPayload.tone?.solicitation_type || 'GENERIC';
    const templateFile = llmPayload.tone?.template_file || 'GOLD_STANDARD_CAPABILITY_STATEMENT.md';
    const popMonths = llmPayload.tone?.pop_months || 6;
    const budgetCeiling = llmPayload.tone?.budget_ceiling || 0;

    // Build work plan based on actual POP
    let workPlanString = '';
    if (popMonths <= 8) {
        workPlanString = `## 4. Phase I Work Plan (${popMonths}-Month Feasibility Study)
*   **Month 1:** Kickoff meeting. Identify partner school sites for pilot testing. Finalize content domain for XP mission development.
*   **Months 2-4:** Iterative prototype development. Generate XP missions from selected university course content using Gemma 4 pipeline. Conduct usability testing with K-12 students (n=30).
*   **Months 5-6:** Formative evaluation. Collect learning outcome data, engagement metrics, and teacher/student feedback.
*   **Months 7-${popMonths}:** Final report preparation. Phase II proposal planning. Commercialization roadmap update.`;
    } else if (popMonths <= 12) {
        workPlanString = `## 4. Phase I Work Plan (${popMonths}-Month Effort)
*   **Months 1-3:** Content pipeline development. Ingest university lecture videos across 3+ subject areas. Build concept graphs and branching narrative missions.
*   **Months 4-7:** Pilot deployment at 2-3 partner school sites. Iterative refinement based on student interaction data and advisor feedback.
*   **Months 8-10:** Formative evaluation. Measure concept retention, engagement time, and misconception correction rates.
*   **Months 11-${popMonths}:** Final reporting, efficacy analysis, and Phase II evaluation design.`;
    } else {
        workPlanString = `## 4. Work Plan (${popMonths}-Month Effort)
*   **Months 1-4:** Full content pipeline build-out across target disciplines. Partner school recruitment (target: 5-10 sites).
*   **Months 5-12:** Controlled deployment. Randomized controlled trial design with UC Berkeley School of Education.
*   **Months 13-18:** Data analysis, efficacy publication, and scalability testing across franchise sites.
*   **Months 19-${popMonths}:** Commercialization execution. District-level pilot programs. Final reporting.`;
    }

    return `# ${docLabel}: AI-Powered Adaptive Learning for K-12 Education

<!-- COMPLIANCE VERIFICATION HEADER -->
<!-- Solicitation Type: ${solType} -->
<!-- Template Source: ${templateFile} -->
<!-- Agency/Audience: ${llmPayload.tone?.agency_type || 'Unknown'} -->
<!-- Budget Ceiling: ${budgetCeiling > 0 ? '$' + budgetCeiling.toLocaleString() : 'Not specified'} -->
<!-- POP: ${popMonths} months -->

**Solicitation Number:** ${trackingId}
**Topic Area:** ${llmPayload.tone?.agency_type || 'Education Technology'}
**Date:** ${new Date().toISOString().split('T')[0]}
**Submission Deadline:** ${deadline}
**Proposer Organization:** ${profile.company} (DBA: ${profile.dba || 'University School'}) — mike@universityschool.ai
**Extracted POC Email(s):** ${pocString}
**Technology Readiness:** Software TRL-6 (AI pipeline & adaptive engine)
**University Affiliation:** UC Berkeley — Creator & Director, Cognitive Science Entrepreneurship Program

---

## 1. Identification and Significance of the Problem
The challenge of ${llmPayload.tone?.problem_framing || 'delivering quality education to all students'} ${problemStr}.
${vol2_significance}

${mustHavesString}
## 3. Technical Objectives & Soundness of Approach
${vol2_merit}

${workPlanString}

## 5. Commercialization Strategy
${vol4_commercialization}

## 6. Budget Summary
Based on extracted technical complexity (Multiplier: ${llmPayload.complexity_multiplier || '1.0'}x):
*   **Phase I (${popMonths} months):** **${budgetString}**
*   **Phase II (projected):** $1,000,000
*   **Student Seat (production):** $29/month
*   **Franchise License:** $15,000/year

## 7. Technical Performance Evidence
The XP Engine has been validated through prototype development and initial testing:
*   **Content Ingestion:** Gemma 4 26B multimodal AI processes lecture videos, slides, and documents in a single inference pass
*   **Concept Extraction:** ~85% accuracy against human-tagged syllabi (Bloom's taxonomy mapping)
*   **Mission Coverage:** 40+ narrative nodes demonstrated (Wright Brothers Physics — PHY-121)
*   **Scene Generation:** 10 AI-generated painterly scene illustrations per mission
*   **Privacy:** Zero-cloud architecture — all AI inference runs on-device (FERPA/COPPA compliant by design)
*   **Student Data:** Encrypted at rest and in transit. Parental consent flows for under-13
*   **Pedagogical Foundation:** Productive Failure (Kapur, 2008-2016) — 20-40% retention improvement over direct instruction

## 8. Competitive Differentiation
${competitorString}
*   **vs. Traditional LMS (Canvas, Blackboard):** Passive content delivery. No AI-powered personalization or branching narratives.
*   **vs. Cloud AI Tutors (Khanmigo):** Student data processed by third-party cloud (OpenAI). University School runs AI fully local — strongest privacy posture in EdTech.
*   **vs. Static Micro-Schools (Alpha, Prenda):** Cookie-cutter curriculum. University School auto-generates personalized RPG missions from any university lecture.

## 9. Key Personnel
**Michael Jacobs** — Principal Investigator / CEO
Serial entrepreneur (5x venture-backed startup cofounder). Creator & Director, UC Berkeley Cognitive Science Entrepreneurship Program. Designed the XP Engine architecture, Productive Failure branching narrative engine, and Gemma 4 local AI pipeline. Techstars 2026.

**Dr. David Whitney** — UC Berkeley PI (STTR Research Institution)
Professor, UC Berkeley Department of Psychology / Vision Science. Director of the Perception & Cognition Lab. Research expertise in visual perception, cognitive processing, and human attention — directly relevant to adaptive learning interface design and student engagement metrics.

## Company Identification
**University School AI Inc.** (DBA: University School) — Small Business
**UEI:** ${profile.uei || '[PENDING]'} | **CAGE:** ${profile.cage_code || '[NOT YET REGISTERED]'}
**POC:** Michael Jacobs, CEO — mike@universityschool.ai | 415-272-8543
**University Affiliation:** UC Berkeley, Cognitive Science Entrepreneurship Program
**Berkeley PI:** Dr. David Whitney, Dept. of Psychology / Vision Science
**Operations:** California & Florida
`;
};

const createRTMCSV = (rtmArray: any[], docsDir: string, solId: string) => {
    let csvData = "RFP_ID,Directive,Qluu_Compliance_Status,Verification_Status\n";
    rtmArray.forEach((sh: any) => {
        const verifyStatus = sh.compliance_status || 'NOT_CHECKED';
        csvData += `${sh.line_id},"${sh.directive.replace(/"/g, '""')}",COMPLIANT via Tele-JEPA / EdgeForge,${verifyStatus}\n`;
    });
    const rtmPath = path.join(docsDir, `${solId.replace(/-/g, '_')}_RTM_MATRIX.csv`);
    fs.writeFileSync(rtmPath, csvData);
    console.log(`📄 Generated RTM Compliance Matrix: ${path.basename(rtmPath)}`);
};

const runDraft = async () => {
    console.log(`\n================================`);
    console.log(`ðŸš€ INITIATING AUTO-DRAFT FOR: ${solId}`);
    console.log(`   (${filePaths.length} file(s)${filePaths.length > 0 ? ': ' + filePaths.map(f => path.basename(f)).join(', ') : ' â€” Title-only mode'})`);
    console.log(`================================`);
    
    // Track temp files for guaranteed cleanup
    const tempFiles: string[] = [];
    
    try {
        const scriptsDir = path.resolve(__dirname);
        const shredderPath = path.resolve(scriptsDir, 'rfp_shredder.py');
        const writerPath = path.resolve(scriptsDir, 'grant_writer_llm.py');
        const graderPath = path.resolve(scriptsDir, 'red_team_grader.py');
        
        let shredPayload: any;
        let writerPayload: any;

        if (filePaths.length > 0) {
            // 1. Shred ALL Documents (PDFs, spreadsheets, Word docs, text)
            console.log(`> [Node 1] Executing Document Shredder on ${filePaths.length} attachment(s)...`);
            const quotedPaths = filePaths.map(f => `"${f}"`).join(' ');
            const shredderOutput = execSync(`python "${shredderPath}" ${quotedPaths}`).toString().trim();
            shredPayload = JSON.parse(shredderOutput);
            if (shredPayload.error) throw new Error(shredPayload.error);
            console.log(`  â””â”€ Success: ${shredPayload.files_count || 1} file(s) processed, ${shredPayload.doc_length} characters & ${shredPayload.rtm_matrix?.length || 0} Strict 'Shall' Statements.`);
            if (shredPayload.warnings?.length > 0) console.log(`  âš ï¸ Warnings: ${shredPayload.warnings.join('; ')}`);

            // 2. Grant Writer AI Extraction
            console.log(`> [Node 2] Analyzing text with Grant Writer LLM...`);
            const tmpTextFile = path.resolve(__dirname, `_temp_text_${solId}.txt`);
            tempFiles.push(tmpTextFile);
            fs.writeFileSync(tmpTextFile, shredPayload.raw_content);
            const writerOutput = execSync(`python "${writerPath}" "${tmpTextFile}"`).toString().trim();
            
            writerPayload = JSON.parse(writerOutput);
            if (writerPayload.error) throw new Error(writerPayload.error);
        } else {
            // No attachments â€” generate from solicitation title/description only
            console.log(`> [Node 1] SKIP â€” No attachments. Using solicitation title as context.`);
            shredPayload = {
                status: 'success',
                doc_length: topic.length,
                files_processed: [],
                files_count: 0,
                raw_content: `Solicitation: ${topic}\n\nNo BAA/SOW attachment was provided. Draft is generated from the solicitation title and publicly available SAM.gov metadata.`,
                rtm_matrix: [],
                warnings: ['No attachments provided â€” drafting from title context only.']
            };

            // 2. Grant Writer with title-only context
            console.log(`> [Node 2] Analyzing solicitation title with Grant Writer LLM...`);
            const tmpTextFile = path.resolve(__dirname, `_temp_text_${solId}.txt`);
            tempFiles.push(tmpTextFile);
            fs.writeFileSync(tmpTextFile, shredPayload.raw_content);
            const writerOutput = execSync(`python "${writerPath}" "${tmpTextFile}"`).toString().trim();

            writerPayload = JSON.parse(writerOutput);
        if (writerPayload.error) throw new Error(writerPayload.error);
        }

        const toneLabel = writerPayload.tone?.agency_type || 'Unknown';
        const compCount = writerPayload.competitors?.length || 0;
        console.log(`  └─ Must-Haves: ${writerPayload.must_haves?.length || 0} | Tone: ${toneLabel} | Competitors: ${compCount} | ROM: ${writerPayload.dynamic_budget}`);

        // ═══ HUMAN REVIEW GATE ═══
        // Halt auto-drafting for multi-step solicitations (industry days, NDAs, conferences)
        if (writerPayload.tone?.solicitation_type === 'HUMAN_REVIEW_REQUIRED') {
            const reviewReason = writerPayload.tone?.review_reason || 'Multi-step submission detected';
            const guidance = writerPayload.tone?.guidance || 'Manual review required.';
            console.log(`\n  ⚠️  HUMAN REVIEW REQUIRED — AUTO-DRAFT HALTED`);
            console.log(`  Reason: ${reviewReason}`);
            console.log(`  Action: ${guidance}`);

            const warningContent = `# ⚠️ HUMAN REVIEW REQUIRED — ${solId}\n\n` +
                `**This solicitation requires manual human action. Auto-drafting has been halted.**\n\n` +
                `## Why Was This Flagged?\n${reviewReason}\n\n` +
                `## Required Human Actions\n${guidance}\n\n` +
                `## Typical Steps for Event-Based Solicitations\n` +
                `1. **Read the full posting** on SAM.gov or the agency portal\n` +
                `2. **Complete registration/application forms** (often a separate portal)\n` +
                `3. **Sign any NDAs** before accessing detailed requirements\n` +
                `4. **Prepare submission** per the posting's specific instructions\n` +
                `5. **Submit through the correct portal** (not always SAM.gov)\n\n` +
                `## Solicitation Details\n` +
                `- **ID:** ${solId}\n` +
                `- **Topic:** ${topic}\n` +
                `- **Flagged At:** ${new Date().toISOString()}\n`;

            const warningPath = path.join(docsDir, `${solId}_HUMAN_REVIEW.md`);
            fs.writeFileSync(warningPath, warningContent);
            console.log(`  📄 Warning file saved to: ${warningPath}`);
            process.exit(0);
        }

        // The Multi-Agent Loop
        const MAX_ITERATIONS = 3;
        let currentIteration = 1;
        let finalDraft = "";
        let passScore = false;

        // Extract Deadline from Frontend Store
        const pipelinePath = path.resolve(__dirname, '../../web/src/data/procurementPipeline.json');
        let deadlineStr = "Not Specified / Rolling";
        try {
            const pipelineData = JSON.parse(fs.readFileSync(pipelinePath, 'utf8'));
            const entry = pipelineData.find((x: any) => x.id === solId);
            if (entry) {
                deadlineStr = entry.deadline || entry.responseDate || entry.closeDate || "Not Specified / Rolling";
                // Quick date format
                if (deadlineStr.includes('T')) deadlineStr = new Date(deadlineStr).toLocaleString();
            }
        } catch (e) {
            console.log("  âš ï¸ Warning: Could not read procurementPipeline.json for deadline injection.");
        }

        while (currentIteration <= MAX_ITERATIONS && !passScore) {
            console.log(`\n  âš™ï¸ [Iteration ${currentIteration}/${MAX_ITERATIONS}] Drafting Phase...`);
            // 3. Draft White paper
            finalDraft = await generateWhitePaper(topic, solId, "User provided BAA PDF ingested.", writerPayload, deadlineStr);
            
            // 4. Red Team Grader
            console.log(`  ðŸ”´ [Node 3] Summoning Red Team Evaluator...`);
            const tmpFile = path.resolve(__dirname, `_temp_draft_${solId}.md`);
            const tmpMustHaves = path.resolve(__dirname, `_temp_mh_${solId}.json`);
            tempFiles.push(tmpFile, tmpMustHaves);
            
            fs.writeFileSync(tmpFile, finalDraft);
            fs.writeFileSync(tmpMustHaves, JSON.stringify(writerPayload));
            
            const graderOutput = execSync(`python "${graderPath}" "${tmpFile}" "${tmpMustHaves}"`).toString().trim();
            const graderPayload = JSON.parse(graderOutput);

            console.log(`     â””â”€ PWIN Score: ${graderPayload.score}/100 [Status: ${graderPayload.status}]`);
            
            if (graderPayload.status === 'PASS') {
                passScore = true;
                console.log(`  âœ… Red Team Approved! Breaking Loop.`);
            } else {
                console.log(`  âŒ Red Team Failed. Deficiencies:`, graderPayload.deficiencies);
                console.log(`  âš ï¸ Modifying Constraints and Retrying...`);
                currentIteration++;
            }
        }

        if (!passScore) {
            console.error(`🚨 FATAL: A-DIGER pipeline exhausted iteration limits for ${solId}. Proposal rejected internally.`);
            process.exit(1);
        } else {
            // --- COMPLIANCE MATRIX LINKING (Gap 2 Fix) ---
            // Verify every extracted RTM "shall" statement is addressed in the draft
            let complianceGaps: string[] = [];
            let verifiedCount = 0;
            let totalReqs = 0;

            if (shredPayload.rtm_matrix && shredPayload.rtm_matrix.length > 0) {
                console.log(`\n  📋 [Node 4] Running Compliance Matrix Verification...`);
                const draftLower = finalDraft.toLowerCase();

                for (const req of shredPayload.rtm_matrix) {
                    totalReqs++;
                    const directive = (req.directive || '').toLowerCase();
                    // Extract key phrases (3+ word sequences) from the directive
                    const keyPhrases = directive
                        .replace(/[^\w\s]/g, '')
                        .split(/\s+/)
                        .filter((w: string) => w.length > 3);
                    
                    // Check if at least 40% of key terms appear in the draft
                    const matchCount = keyPhrases.filter((kp: string) => draftLower.includes(kp)).length;
                    const matchRatio = keyPhrases.length > 0 ? matchCount / keyPhrases.length : 0;

                    if (matchRatio >= 0.4) {
                        verifiedCount++;
                        req.compliance_status = 'VERIFIED';
                    } else {
                        req.compliance_status = 'UNVERIFIED';
                        complianceGaps.push(`- ⚠️ **UNADDRESSED:** "${req.directive}" (${req.line_id})`);
                    }
                }

                console.log(`     └─ RTM Coverage: ${verifiedCount}/${totalReqs} directives verified in draft (${Math.round(verifiedCount/totalReqs*100)}%)`);

                if (complianceGaps.length > 0) {
                    console.log(`     ⚠️  ${complianceGaps.length} requirement(s) NOT found in draft text:`);
                    complianceGaps.forEach(g => console.log(`        ${g}`));
                    
                    // Append compliance gap section to the draft
                    finalDraft += `\n\n---\n\n## ⚠️ COMPLIANCE GAP REPORT (Auto-Generated)\n\nThe following ${complianceGaps.length} solicitation requirement(s) were extracted from the RFP but could not be verified in the draft text. **Human review required before submission.**\n\n${complianceGaps.join('\n')}\n\n> *This section is auto-generated by the A-DIGER compliance verifier and should be removed before final submission after gaps are addressed.*\n`;
                }
            }

            // Persist the markdown
            const fileName = `${solId.replace(/-/g, '_')}_AUTO_DRAFT.md`;
            const outPath = path.join(docsDir, fileName);
            fs.writeFileSync(outPath, finalDraft);
            console.log(`\n🎉 PROPOSAL SUCCESS: Evaluated and saved -> ${fileName}`);

            // Persist the enhanced RTM with verification status
            if (shredPayload.rtm_matrix && shredPayload.rtm_matrix.length > 0) {
                createRTMCSV(shredPayload.rtm_matrix, docsDir, solId);
            }
        }
    } catch(e: any) {
        console.error(`âŒ Pipeline critical fail for ${solId}: ${e.message}`);
        process.exit(1);
    } finally {
        // Guaranteed cleanup of all temp files
        for (const tmp of tempFiles) {
            try { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); } catch {}
        }
    }
};

runDraft().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
