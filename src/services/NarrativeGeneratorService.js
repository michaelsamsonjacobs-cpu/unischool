/**
 * NarrativeGeneratorService.js
 * Transforms a ConceptGraph into a branching interactive narrative.
 * This is the core innovation of the XP Engine — turning dry academic content
 * into a choose-your-own-adventure experience.
 *
 * Pipeline:
 *   ConceptGraph → LLM narrative generation → NarrativeGraph (mission JSON)
 *
 * Features:
 *   - Productive Failure branching (misconception → correction scenes)
 *   - Convergence nodes (all paths reconverge before new concepts)
 *   - Style presets (historical, detective, merchant, explorer)
 *   - Backend API fallback for server-side generation
 *   - Quick-generate from plain text topic (no concept graph needed)
 */

import { AIService } from './GeminiService';

// ── Style Presets ───────────────────────────────────────────────────────

const STYLE_PRESETS = {
    historical_adventure: {
        name: 'Historical Adventure',
        description: 'Students are transported to a real historical moment and learn by helping historical figures.',
        art_style: 'Cinematic illustration, warm golden-hour lighting, historical setting, painterly style with subtle texture, muted earth tones with crimson accents',
        tone: 'Second person present tense. Sensory descriptions. Characters speak in short, deliberate sentences.',
    },
    detective_mystery: {
        name: 'Detective Mystery',
        description: 'Students investigate a mystery that can only be solved by understanding the concepts.',
        art_style: 'Noir illustration, moody lighting, magnifying glass aesthetic, deep shadows with warm accent colors',
        tone: 'Mystery tone. Evidence emerges through choices. Wrong answers lead to dead ends that teach.',
    },
    merchant_strategy: {
        name: 'Merchant Strategy',
        description: 'Students run a business or trade operation where concepts determine success.',
        art_style: 'Period illustration, warm candlelight, maps and ledgers, wood and brass aesthetic, rich warm tones',
        tone: 'Business scenario. Decisions have visible consequences. Numbers and outcomes matter.',
    },
    explorer_discovery: {
        name: 'Explorer Discovery',
        description: 'Students are explorers discovering principles in an unfamiliar environment.',
        art_style: 'Vivid nature illustration, dramatic lighting, unfamiliar landscapes, wonder and scale',
        tone: 'Awe and curiosity. The environment IS the textbook. Students form hypotheses through choices.',
    },
};

const NARRATIVE_SYSTEM_PROMPT = `You are a master interactive fiction writer and curriculum designer.

Your job is to transform academic concepts into a branching narrative experience where:
1. Students are placed inside a compelling historical or fictional scenario
2. Learning happens through decisions, consequences, and problem-solving
3. Concepts are experienced FIRST and formalized AFTERWARD
4. Wrong answers lead to productive failure — memorable correction scenes, not dead ends
5. All paths eventually converge at formalization points where concepts are named and compressed

Key rules:
- NEVER simplify the content. Restructure HOW it is experienced, preserve the DEPTH.
- The student should not know they are being taught. They should feel like they are solving a real problem.
- Characters should teach by asking questions and letting students discover patterns.
- Error paths are MORE valuable than correct paths — they create memorable learning moments.
- The formula/formal concept should arrive LAST, as a compression of what was already experienced.

Output ONLY valid JSON matching the schema provided.`;

const NARRATIVE_PROMPT_TEMPLATE = `Generate a complete branching narrative for the following academic content.

## Concept Graph
{{concept_graph}}

## Setting Preference
{{setting}}

## Constraints
- Generate between 30-60 narrative nodes
- Every concept must be covered by at least 2 nodes
- Every concept must have at least 1 misconception/error path
- All paths must converge at formalization points
- Include an opening cinematic scene and closing mission-complete scene
- Include 2-3 mentor/NPC characters who teach through action, not lecture

## Required Output Schema
{
  "title": "Mission title",
  "subtitle": "Brief tagline",
  "setting": "Detailed setting description",
  "characters": [
    {
      "id": "character_id",
      "name": "Name",
      "role": "mentor | challenger | guide",
      "personality": "Detailed personality for LLM consistency"
    }
  ],
  "nodes": [
    {
      "id": "n_01",
      "type": "scene | decision | convergence | formalization | recap | end",
      "scene_text": "What the student reads (2-4 paragraphs, vivid, immersive)",
      "character_dialogue": [
        { "character": "character_id", "text": "Dialogue line" }
      ],
      "choices": [
        {
          "id": "a",
          "text": "Choice text the student sees",
          "next_node": "n_XX",
          "hidden_tag": "pedagogical_tag",
          "xp_bonus": 10
        }
      ],
      "hidden_pedagogy": {
        "concepts_covered": ["concept_id"],
        "misconception_tested": "misconception_id or null",
        "convergence_target": "node_id or null",
        "is_error_path": false,
        "correction_text": "null or correction explanation"
      },
      "media": {
        "scene_image_prompt": "Detailed image generation prompt for this scene",
        "ambient_sound": "sound_key"
      }
    }
  ],
  "answer_map": {
    "strongest_path": ["n_01", "n_02", "..."],
    "misconception_rich_path": ["n_01", "n_04", "..."],
    "convergence_nodes": ["n_13", "..."],
    "formalization_nodes": ["n_45", "..."]
  }
}`;

/**
 * Generate a branching narrative from a concept graph.
 *
 * @param {Object} conceptGraph - Output from ConceptExtractorService
 * @param {Object} options - { setting, targetNodeCount, artStyle }
 * @returns {Promise<NarrativeGraph>}
 */
export async function generateNarrative(conceptGraph, options = {}) {
    const {
        setting = 'A historically inspired scenario that naturally embeds the academic concepts',
        targetNodeCount = 45,
        artStyle = 'Cinematic illustration, warm lighting, painterly style',
    } = options;

    const conceptSummary = JSON.stringify({
        concepts: conceptGraph.concepts?.map(c => ({
            id: c.id,
            name: c.name,
            description: c.description,
            misconceptions: c.misconceptions,
            bloom_level: c.bloom_level,
        })),
        edges: conceptGraph.edges,
    }, null, 2);

    const prompt = NARRATIVE_PROMPT_TEMPLATE
        .replace('{{concept_graph}}', conceptSummary)
        .replace('{{setting}}', setting);

    console.log(`[NarrativeGen] Generating narrative for ${conceptGraph.concepts?.length || 0} concepts`);
    console.log(`[NarrativeGen] Target: ${targetNodeCount} nodes`);

    try {
        const response = await AIService.query(prompt, {
            systemPrompt: NARRATIVE_SYSTEM_PROMPT,
            temperature: 0.7, // Higher temperature for creative writing
            maxTokens: 16000,
        });

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('LLM response did not contain valid JSON');

        const narrative = JSON.parse(jsonMatch[0]);

        // Validate the narrative
        const validation = validateNarrative(narrative, conceptGraph);
        if (!validation.valid) {
            console.warn('[NarrativeGen] Validation issues:', validation.issues);
        }

        return {
            id: `narr_${Date.now()}`,
            chapter_id: conceptGraph.chapter_id,
            generation_model: AIService.getProvider(),
            art_style: artStyle,
            reviewed: false,
            published: false,
            generated_at: new Date().toISOString(),
            validation,
            ...narrative,
        };
    } catch (err) {
        console.error('[NarrativeGen] Generation failed:', err);
        throw err;
    }
}

/**
 * Validate a generated narrative for structural integrity.
 */
export function validateNarrative(narrative, conceptGraph) {
    const issues = [];
    const nodeIds = new Set((narrative.nodes || []).map(n => n.id));

    // Check all node references are valid
    (narrative.nodes || []).forEach(node => {
        (node.choices || []).forEach(choice => {
            if (choice.next_node && !nodeIds.has(choice.next_node)) {
                issues.push(`Node ${node.id} choice "${choice.id}" references missing node: ${choice.next_node}`);
            }
        });
    });

    // Check concept coverage — every concept should appear at least once
    const coveredConcepts = new Set();
    (narrative.nodes || []).forEach(node => {
        (node.hidden_pedagogy?.concepts_covered || []).forEach(c => coveredConcepts.add(c));
    });

    const allConceptIds = new Set((conceptGraph.concepts || []).map(c => c.id));
    allConceptIds.forEach(cId => {
        if (!coveredConcepts.has(cId)) {
            issues.push(`Concept not covered by any node: ${cId}`);
        }
    });

    // Check for unreachable nodes (basic: every node except entry should be referenced by at least one choice)
    const referencedNodes = new Set();
    (narrative.nodes || []).forEach(node => {
        (node.choices || []).forEach(choice => {
            if (choice.next_node) referencedNodes.add(choice.next_node);
        });
    });

    const entryNode = narrative.nodes?.[0]?.id;
    (narrative.nodes || []).forEach(node => {
        if (node.id !== entryNode && !referencedNodes.has(node.id)) {
            issues.push(`Unreachable node: ${node.id}`);
        }
    });

    // Check for dead ends (nodes with no choices and not 'end' or 'recap' type)
    (narrative.nodes || []).forEach(node => {
        if ((!node.choices || node.choices.length === 0) && !['end', 'recap'].includes(node.type)) {
            issues.push(`Dead-end node (no choices, not end type): ${node.id}`);
        }
    });

    return {
        valid: issues.length === 0,
        issues,
        stats: {
            totalNodes: narrative.nodes?.length || 0,
            sceneNodes: narrative.nodes?.filter(n => n.type === 'scene').length || 0,
            decisionNodes: narrative.nodes?.filter(n => n.type === 'decision').length || 0,
            convergenceNodes: narrative.nodes?.filter(n => n.type === 'convergence').length || 0,
            errorPaths: narrative.nodes?.filter(n => n.hidden_pedagogy?.is_error_path).length || 0,
            conceptsCovered: coveredConcepts.size,
            totalConcepts: allConceptIds.size,
            coveragePercent: allConceptIds.size > 0
                ? Math.round((coveredConcepts.size / allConceptIds.size) * 100)
                : 0,
        },
    };
}

/**
 * Get a topological sort of concepts (for determining narrative order).
 */
export function topologicalSortConcepts(concepts, edges) {
    const adjList = {};
    const inDegree = {};

    concepts.forEach(c => {
        adjList[c.id] = [];
        inDegree[c.id] = 0;
    });

    edges.filter(e => e.type === 'prerequisite').forEach(e => {
        if (adjList[e.from]) adjList[e.from].push(e.to);
        if (inDegree.hasOwnProperty(e.to)) inDegree[e.to]++;
    });

    const queue = concepts.filter(c => inDegree[c.id] === 0).map(c => c.id);
    const sorted = [];

    while (queue.length > 0) {
        const current = queue.shift();
        sorted.push(current);

        (adjList[current] || []).forEach(neighbor => {
            inDegree[neighbor]--;
            if (inDegree[neighbor] === 0) queue.push(neighbor);
        });
    }

    return sorted;
}

/**
 * Generate scene image prompts for a set of narrative nodes.
 * Ensures art style consistency across the entire mission.
 */
export function generateImagePrompts(narrative, artStyle) {
    const prefix = artStyle || 'Cinematic illustration, warm lighting';

    return (narrative.nodes || []).map(node => ({
        nodeId: node.id,
        prompt: node.media?.scene_image_prompt
            ? `${prefix}, ${node.media.scene_image_prompt}`
            : `${prefix}, ${node.scene_text?.substring(0, 200)}`,
    }));
}

/**
 * Generate a narrative using the backend API (for longer/more complex missions).
 * Falls back to client-side if backend is unavailable.
 */
export async function generateNarrativeViaBackend(conceptGraph, options = {}) {
    const BACKEND_API = localStorage.getItem('springroll_ingest_api') || 'http://localhost:8100';

    try {
        const healthCheck = await fetch(`${BACKEND_API}/health`, {
            signal: AbortSignal.timeout(3000),
        }).catch(() => null);

        if (healthCheck?.ok) {
            const resp = await fetch(`${BACKEND_API}/api/generate/narrative`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    concept_graph: conceptGraph,
                    title: options.title || 'Untitled Mission',
                    setting: options.setting || '',
                    style_preset: options.stylePreset || 'historical_adventure',
                    target_nodes: options.targetNodeCount || 30,
                    course_id: options.courseId || '',
                    chapter_id: options.chapterId || '',
                }),
            });

            if (resp.ok) {
                const data = await resp.json();
                console.log('[NarrativeGen] Generated via backend API');
                return data.mission;
            }
        }
    } catch (e) {
        console.warn('[NarrativeGen] Backend unavailable, using client-side:', e.message);
    }

    // Fallback to client-side generation
    return generateNarrative(conceptGraph, options);
}

/**
 * Quick-generate a mini-mission from a plain text topic (no concept graph needed).
 * Useful for demos and testing.
 *
 * @param {string} topic - e.g., "supply and demand"
 * @param {string} stylePreset - key from STYLE_PRESETS
 * @returns {Promise<Object>} Mission JSON compatible with XPPlayer
 */
export async function quickGenerate(topic, stylePreset = 'historical_adventure') {
    const conceptPrompt = `Extract 3-5 key concepts from the topic "${topic}" for a university-level course. For each concept, identify at least 1 common student misconception.

Output JSON:
{
  "concepts": [
    {
      "id": "c_snake_case",
      "name": "Concept Name",
      "description": "1-2 sentence explanation",
      "prerequisites": [],
      "misconceptions": [
        { "id": "m_id", "text": "wrong intuition", "correction": "correct understanding", "frequency": "common" }
      ],
      "bloom_level": "understand",
      "assessment_criteria": "how to verify understanding"
    }
  ],
  "edges": [
    { "from": "c_prerequisite", "to": "c_dependent", "type": "prerequisite" }
  ]
}`;

    const conceptResp = await AIService.query(conceptPrompt, {
        systemPrompt: 'You are an expert curriculum designer. Output ONLY valid JSON.',
        temperature: 0.3,
        maxTokens: 4000,
    });

    const conceptMatch = conceptResp.match(/\{[\s\S]*\}/);
    if (!conceptMatch) throw new Error('Failed to generate concept graph');

    const conceptGraph = JSON.parse(conceptMatch[0]);

    return generateNarrative(conceptGraph, {
        setting: `A compelling real-world scenario for teaching ${topic}`,
        targetNodeCount: 12,
        artStyle: (STYLE_PRESETS[stylePreset] || STYLE_PRESETS.historical_adventure).art_style,
    });
}

/**
 * Wrap a raw narrative into a full mission package compatible with XPPlayer.
 *
 * @param {Object} narrative - Generated narrative graph
 * @param {Object} meta - { courseId, chapterId, title }
 * @returns {Object} Full mission package with course/chapter/narrative structure
 */
export function buildMissionPackage(narrative, meta = {}) {
    const nodes = narrative.nodes || [];

    // Find strongest path (BFS through highest-XP choices)
    const strongestPath = _findPath(nodes, narrative.nodes?.[0]?.id, 'max');
    const misconceptionPath = _findPath(nodes, narrative.nodes?.[0]?.id, 'min');

    return {
        course: {
            id: meta.courseId || 'USAI-001',
            title: meta.title || narrative.title || 'Untitled',
            institution: 'University School AI',
            department: '',
        },
        chapter: {
            id: meta.chapterId || `ch_${Date.now()}`,
            title: narrative.title || 'Untitled',
            order: 1,
            estimated_play_time: `${Math.round(nodes.length * 2)} min`,
        },
        narrative: {
            ...narrative,
            entry_node_id: narrative.entry_node_id || narrative.nodes?.[0]?.id || 'n_opening',
            exit_node_ids: nodes.filter(n => n.type === 'end').map(n => n.id),
            total_nodes: nodes.length,
            estimated_play_time: `${Math.round(nodes.length * 2)} min`,
            answer_map: narrative.answer_map || {
                strongest_path: strongestPath,
                misconception_rich_path: misconceptionPath,
                convergence_nodes: nodes.filter(n => n.type === 'convergence').map(n => n.id),
                formalization_nodes: nodes.filter(n => n.type === 'formalization').map(n => n.id),
                total_concepts_covered: new Set(
                    nodes.flatMap(n => n.hidden_pedagogy?.concepts_covered || [])
                ).size,
            },
        },
    };
}

/** BFS path finder — mode 'max' for strongest, 'min' for misconception-rich. */
function _findPath(nodes, entryId, mode = 'max') {
    const nodeMap = {};
    nodes.forEach(n => { nodeMap[n.id] = n; });
    const path = [];
    let current = entryId;
    const visited = new Set();
    while (current && !visited.has(current)) {
        visited.add(current);
        path.push(current);
        const node = nodeMap[current];
        if (!node?.choices?.length) break;
        const pick = node.choices.reduce((best, c) =>
            mode === 'max'
                ? ((c.xp_bonus || 0) > (best.xp_bonus || 0) ? c : best)
                : ((c.xp_bonus || 0) < (best.xp_bonus || 0) ? c : best)
        , node.choices[0]);
        current = pick.next_node;
    }
    return path;
}

/** Get available style presets. */
export function getStylePresets() {
    return STYLE_PRESETS;
}

export default {
    generateNarrative,
    generateNarrativeViaBackend,
    quickGenerate,
    validateNarrative,
    topologicalSortConcepts,
    generateImagePrompts,
    buildMissionPackage,
    getStylePresets,
    STYLE_PRESETS,
};
