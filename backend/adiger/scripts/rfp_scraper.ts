import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import * as cheerio from 'cheerio';

// A-DIGER EdTech: Education Grant & Contract Discovery Engine
// Adapted from Commander Qluu's defense procurement pipeline for University School

console.log("==========================================");
console.log(" A-DIGER: Education Grant Discovery Engine");
console.log(" University School AI — v2.1");
console.log("==========================================\n");

// Load search configuration
const settingsPath = path.resolve(__dirname, 'settings.json');
let settings: any = { search_keywords: ['education+technology', 'adaptive+learning'] };
try {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
} catch {}

const SAM_KEYWORDS = settings.search_keywords || [
    'education+technology',
    'adaptive+learning',
    'artificial+intelligence+education',
    'personalized+learning',
    'game-based+learning',
    'STEM+education',
    'K-12+technology',
    'curriculum+development',
    'educational+software',
    'learning+analytics',
    'tutoring+systems',
    'digital+literacy',
    'remote+learning',
    'distance+education',
];

const GRANTS_GOV_KEYWORDS = settings.grants_gov_keywords || [
    'SBIR education',
    'STTR education',
    'education innovation',
    'learning technology',
    'AI education',
];

const runScraper = async () => {
    console.log(`> Contacting live SAM.gov SPA data endpoint...`);
    
    let liveResults: any[] = [];
    const seenIds = new Set<string>();

    // ── SAM.gov Sweep ────────────────────────────────────────────────
    for (const keyword of SAM_KEYWORDS) {
        try {
            const url = `https://sam.gov/api/prod/sgs/v1/search/?index=opp&q=${keyword}&page=0&size=100&sort=-modifiedDate&mode=search&is_active=true`;
            const response = await fetch(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });
            const data = await response.json();
            const items = data._embedded?.results || [];
            
            console.log(`  [SAM] "${keyword}": ${items.length} results`);

            for (const item of items) {
                const solId = item.solicitationNumber || item._id || `SAM-${Math.floor(Math.random()*100000)}`;
                if (seenIds.has(solId)) continue;
                seenIds.add(solId);

                liveResults.push({
                    topic: item.title || "Unknown SAM.gov Title",
                    id: solId,
                    prob: item.description || "Federal education technology opportunity.",
                    agency: item.type?.value || "Federal",
                    deadline: item.responseDateActual || null,
                    samUrl: item._id ? `https://sam.gov/opp/${item._id}/view` : null,
                    source: 'sam.gov'
                });
            }
        } catch (e: any) {
            console.error(`  [X] SAM query "${keyword}" failed: ${e.message}`);
        }
    }

    console.log(`> SAM.gov sweep complete: ${liveResults.length} unique opportunities found.`);

    // ── Grants.gov Sweep ────────────────────────────────────────────
    if (settings.grants_gov_sources !== false) {
        console.log(`\n> Contacting Grants.gov REST API...`);
        
        for (const keyword of GRANTS_GOV_KEYWORDS) {
            try {
                const url = `https://www.grants.gov/grantsws/rest/opportunities/search/cfda?keyword=${encodeURIComponent(keyword)}&oppStatuses=forecasted|posted&sortBy=openDate|desc&rows=50`;
                const response = await fetch(url, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
                });
                const data = await response.json();
                const items = data.oppHits || [];
                
                console.log(`  [GRANTS] "${keyword}": ${items.length} results`);

                for (const item of items) {
                    const solId = item.number || item.id || `GRANTS-${Math.floor(Math.random()*100000)}`;
                    if (seenIds.has(solId)) continue;
                    seenIds.add(solId);

                    liveResults.push({
                        topic: item.title || "Unknown Grants.gov Title",
                        id: solId,
                        prob: item.synopsis || item.description || "Federal education grant opportunity.",
                        agency: item.agency?.name || item.agencyName || "Federal",
                        deadline: item.closeDate || null,
                        grantsUrl: item.number ? `https://www.grants.gov/search-results-detail/${item.id}` : null,
                        source: 'grants.gov'
                    });
                }
            } catch (e: any) {
                console.error(`  [X] Grants.gov query "${keyword}" failed: ${e.message}`);
            }
        }
    }

    // ── IES SBIR Monitor ────────────────────────────────────────────
    if (settings.ies_sbir_monitor !== false) {
        console.log(`\n> Checking IES SBIR page for open solicitations...`);
        try {
            const response = await fetch('https://ies.ed.gov/sbir/', {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });
            const html = await response.text();
            const $ = cheerio.load(html);

            // Look for open solicitation links
            $('a[href*="sbir"]').each((_, el) => {
                const text = $(el).text().trim();
                const href = $(el).attr('href') || '';
                if (text.toLowerCase().includes('phase') || text.toLowerCase().includes('solicitation')) {
                    const id = `IES-SBIR-${Date.now()}`;
                    if (!seenIds.has(id)) {
                        seenIds.add(id);
                        liveResults.push({
                            topic: `IES SBIR: ${text}`,
                            id: id,
                            prob: `Department of Education IES SBIR opportunity: ${text}`,
                            agency: "ED / IES",
                            deadline: null,
                            samUrl: href.startsWith('http') ? href : `https://ies.ed.gov${href}`,
                            source: 'ies.ed.gov'
                        });
                    }
                }
            });
        } catch (e: any) {
            console.error(`  [X] IES SBIR scrape failed: ${e.message}`);
        }
    }

    // ── NSF Education Monitor ────────────────────────────────────────
    if (settings.nsf_sttr_monitor !== false) {
        console.log(`> Checking NSF for education-tagged STTR/SBIR opportunities...`);
        try {
            const response = await fetch('https://new.nsf.gov/funding/opportunities?f%5B0%5D=program_areas%3AEducation%20and%20Human%20Resources', {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });
            const html = await response.text();
            const $ = cheerio.load(html);

            $('h3, h4, .funding-title').each((_, el) => {
                const title = $(el).text().trim();
                if (title.toLowerCase().includes('sbir') || title.toLowerCase().includes('sttr') ||
                    title.toLowerCase().includes('education') || title.toLowerCase().includes('stem')) {
                    const id = `NSF-EDU-${Math.floor(Math.random() * 10000)}`;
                    if (!seenIds.has(id)) {
                        seenIds.add(id);
                        const desc = $(el).next('p').text().trim().substring(0, 500);
                        liveResults.push({
                            topic: title,
                            id: id,
                            prob: desc || `NSF education technology opportunity: ${title}`,
                            agency: "NSF",
                            deadline: null,
                            source: 'nsf.gov'
                        });
                    }
                }
            });
        } catch (e: any) {
            console.error(`  [X] NSF scrape failed: ${e.message}`);
        }
    }

    // ── California State Grants ──────────────────────────────────────
    console.log(`\n> Checking California education grant sources...`);
    const CA_SOURCES = [
        { name: 'CDE Innovation', url: 'https://www.cde.ca.gov/fg/fo/af/', selector: 'a', keywords: ['technology', 'innovation', 'stem', 'charter', 'learning'] },
        { name: 'CA Arts Council', url: 'https://arts.ca.gov/grants/', selector: 'h3, h4, .grant-title', keywords: ['education', 'arts', 'youth', 'learning'] },
    ];
    for (const src of CA_SOURCES) {
        try {
            const response = await fetch(src.url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });
            const html = await response.text();
            const $ = cheerio.load(html);

            $(src.selector).each((_, el) => {
                const text = $(el).text().trim();
                if (src.keywords.some(kw => text.toLowerCase().includes(kw)) && text.length > 10) {
                    const id = `CA-${src.name.replace(/\s/g, '-')}-${Math.floor(Math.random() * 10000)}`;
                    if (!seenIds.has(id)) {
                        seenIds.add(id);
                        const href = $(el).attr('href') || '';
                        liveResults.push({
                            topic: `[CA] ${src.name}: ${text.substring(0, 100)}`,
                            id: id,
                            prob: `California state education opportunity via ${src.name}: ${text}`,
                            agency: `CA / ${src.name}`,
                            deadline: null,
                            samUrl: href.startsWith('http') ? href : `${src.url}${href}`,
                            source: 'ca.gov'
                        });
                    }
                }
            });
            console.log(`  [CA] ${src.name}: scraped`);
        } catch (e: any) {
            console.error(`  [X] CA ${src.name} scrape failed: ${e.message?.substring(0, 80)}`);
        }
    }

    // ── Florida State Grants ─────────────────────────────────────────
    console.log(`> Checking Florida education grant sources...`);
    const FL_SOURCES = [
        { name: 'FLDOE Grants', url: 'https://www.fldoe.org/finance/contracts-grants-procurement/grants-management/', selector: 'a', keywords: ['technology', 'innovation', 'charter', 'learning', 'stem', 'digital'] },
        { name: 'FL CSP', url: 'https://www.fldoe.org/schools/school-choice/charter-schools/', selector: 'a, li', keywords: ['charter', 'grant', 'startup', 'expansion', 'replication'] },
    ];
    for (const src of FL_SOURCES) {
        try {
            const response = await fetch(src.url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });
            const html = await response.text();
            const $ = cheerio.load(html);

            $(src.selector).each((_, el) => {
                const text = $(el).text().trim();
                if (src.keywords.some(kw => text.toLowerCase().includes(kw)) && text.length > 10) {
                    const id = `FL-${src.name.replace(/\s/g, '-')}-${Math.floor(Math.random() * 10000)}`;
                    if (!seenIds.has(id)) {
                        seenIds.add(id);
                        const href = $(el).attr('href') || '';
                        liveResults.push({
                            topic: `[FL] ${src.name}: ${text.substring(0, 100)}`,
                            id: id,
                            prob: `Florida state education opportunity via ${src.name}: ${text}`,
                            agency: `FL / ${src.name}`,
                            deadline: null,
                            samUrl: href.startsWith('http') ? href : `${src.url}${href}`,
                            source: 'fl.gov'
                        });
                    }
                }
            });
            console.log(`  [FL] ${src.name}: scraped`);
        } catch (e: any) {
            console.error(`  [X] FL ${src.name} scrape failed: ${e.message?.substring(0, 80)}`);
        }
    }

    // ── Multi-State Franchise Expansion Grants ──────────────────────
    // These are high-value states for University School franchise operators
    console.log(`\n> Checking franchise expansion state grant sources (TX, NC, GA, AZ, IN, CO)...`);

    const FRANCHISE_STATE_SOURCES = [
        // Texas — Largest charter market in the US
        { state: 'TX', name: 'TEA Charter', url: 'https://tea.texas.gov/texas-schools/texas-schools-charter-schools', selector: 'a, li', keywords: ['charter', 'grant', 'startup', 'expansion', 'technology', 'innovation', 'open-enrollment'] },
        { state: 'TX', name: 'TEA Grants', url: 'https://tea.texas.gov/finance-and-grants/grants', selector: 'a', keywords: ['technology', 'innovation', 'stem', 'digital', 'charter', 'learning'] },

        // North Carolina — Digital Learning Initiative grants
        { state: 'NC', name: 'NC DLI', url: 'https://www.dpi.nc.gov/districts-schools/digital-teaching-and-learning', selector: 'a, li', keywords: ['digital', 'learning', 'technology', 'innovation', 'grant', 'charter'] },
        { state: 'NC', name: 'NC Charter', url: 'https://www.dpi.nc.gov/districts-schools/charter-schools', selector: 'a, li', keywords: ['charter', 'grant', 'startup', 'application', 'new school'] },

        // Georgia — Innovative Education Fund
        { state: 'GA', name: 'GA Innovation', url: 'https://www.gadoe.org/External-Affairs-and-Policy/Charter-Schools/Pages/default.aspx', selector: 'a, li', keywords: ['innovation', 'charter', 'grant', 'prototype', 'expansion', 'technology'] },

        // Arizona — Most charter-friendly state, ESA program
        { state: 'AZ', name: 'AZ Charter', url: 'https://asbcs.az.gov/', selector: 'a, li', keywords: ['charter', 'application', 'new school', 'grant', 'startup', 'expansion'] },
        { state: 'AZ', name: 'AZ DOE Grants', url: 'https://www.azed.gov/grants', selector: 'a, li', keywords: ['technology', 'innovation', 'stem', 'digital', 'charter', 'learning'] },

        // Indiana — Innovation Network, strong charter support
        { state: 'IN', name: 'IN Charter', url: 'https://www.in.gov/doe/students/charter-schools/', selector: 'a, li', keywords: ['charter', 'grant', 'innovation', 'startup', 'new school', 'technology'] },

        // Colorado — Innovation Schools Act
        { state: 'CO', name: 'CO Innovation', url: 'https://www.cde.state.co.us/choice/charterschools', selector: 'a, li', keywords: ['charter', 'innovation', 'grant', 'startup', 'technology', 'digital'] },
    ];

    for (const src of FRANCHISE_STATE_SOURCES) {
        try {
            const response = await fetch(src.url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });
            const html = await response.text();
            const $ = cheerio.load(html);

            $(src.selector).each((_, el) => {
                const text = $(el).text().trim();
                if (src.keywords.some(kw => text.toLowerCase().includes(kw)) && text.length > 10 && text.length < 200) {
                    const id = `${src.state}-${src.name.replace(/\s/g, '-')}-${Math.floor(Math.random() * 10000)}`;
                    if (!seenIds.has(id)) {
                        seenIds.add(id);
                        const href = $(el).attr('href') || '';
                        liveResults.push({
                            topic: `[${src.state}] ${src.name}: ${text.substring(0, 100)}`,
                            id: id,
                            prob: `${src.state} state education opportunity via ${src.name}: ${text}`,
                            agency: `${src.state} / ${src.name}`,
                            deadline: null,
                            samUrl: href.startsWith('http') ? href : `${src.url}${href}`,
                            source: `${src.state.toLowerCase()}.gov`
                        });
                    }
                }
            });
            console.log(`  [${src.state}] ${src.name}: scraped`);
        } catch (e: any) {
            console.error(`  [X] ${src.state} ${src.name} scrape failed: ${e.message?.substring(0, 80)}`);
        }
    }

    // Deduplicate
    const uniqueMap = new Map();
    liveResults.forEach((item: any) => uniqueMap.set(item.id, item));
    const finalResults = Array.from(uniqueMap.values());

    console.log(`\n> Detected ${finalResults.length} unique opportunities from all sources. Running Go/No-Go filter...`);
    
    const docsDir = path.resolve(__dirname, '../../docs/procurement/generated');
    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

    let triagedPipeline = [];

    for (const sol of finalResults) {
        const safeId = sol.id.replace(/[^a-zA-Z0-9_-]/g, '_');

        // Skip expired
        if (sol.deadline) {
            const deadlineDate = new Date(sol.deadline);
            if (deadlineDate.getTime() < Date.now()) continue;
        }
        
        try {
            const scorerPath = path.resolve(__dirname, 'opportunity_scorer.py');
            const tmpScoreFile = path.resolve(__dirname, `_temp_score_${safeId}.txt`);
            
            const mockRFP = `# ${sol.topic}\n**Agency:** ${sol.agency}\n\n## Objective\n${sol.prob}`;
            fs.writeFileSync(tmpScoreFile, mockRFP);
            
            const scorerOutput = execSync(`python "${scorerPath}" "${tmpScoreFile}"`, { timeout: 10000 }).toString().trim();
            fs.unlinkSync(tmpScoreFile);
            const scorePayload = JSON.parse(scorerOutput);
            
            if (scorePayload.recommendation === 'NO-GO') {
                continue;
            }

            triagedPipeline.push({
                id: sol.id,
                title: sol.topic,
                agency: sol.agency,
                description: sol.prob,
                deadline: sol.deadline || null,
                samUrl: sol.samUrl || sol.grantsUrl || null,
                source: sol.source || 'sam.gov',
                score: scorePayload.score,
                recommendation: scorePayload.recommendation,
                strengths: scorePayload.strengths || [],
                status: 'AWAITING_ATTACHMENTS',
                addedAt: new Date().toISOString()
            });

        } catch(e: any) {
            console.error(`  [X] Scorer failed for ${safeId}: ${e.message?.substring(0, 100)}`);
        }
    }

    // Write pipeline state
    const pipelineDbPath = path.resolve(__dirname, '../../web/src/data/procurementPipeline.json');
    if (!fs.existsSync(path.dirname(pipelineDbPath))) {
        fs.mkdirSync(path.dirname(pipelineDbPath), { recursive: true });
    }
    
    let existingPipeline: any[] = [];
    if (fs.existsSync(pipelineDbPath)) {
        try {
            existingPipeline = JSON.parse(fs.readFileSync(pipelineDbPath, 'utf-8'));
        } catch { /* fresh start */ }
    }

    const pipelineMap = new Map();
    existingPipeline.forEach((item: any) => pipelineMap.set(item.id, item));
    triagedPipeline.forEach((item: any) => {
        if (!pipelineMap.has(item.id)) pipelineMap.set(item.id, item);
    });

    // Prune expired
    const now = Date.now();
    const prunedPipeline = Array.from(pipelineMap.values()).filter((item: any) => {
        if (!item.deadline) return true;
        return new Date(item.deadline).getTime() >= now;
    });

    fs.writeFileSync(pipelineDbPath, JSON.stringify(prunedPipeline, null, 2));

    console.log(`\n==========================================`);
    console.log(` A-DIGER EDUCATION TRIAGE COMPLETE`);
    console.log(` Sources: SAM.gov + Grants.gov + IES + NSF + CA + FL`);
    console.log(` Total scraped: ${finalResults.length}`);
    console.log(` Passed Go/No-Go gate: ${triagedPipeline.length}`);
    console.log(` Total in Dashboard queue: ${pipelineMap.size}`);
    console.log(`==========================================`);
    process.exit(0);
};

runScraper();
