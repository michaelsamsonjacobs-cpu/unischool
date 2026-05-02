/**
 * ConceptExtractorService.js
 * Uses LLM to analyze structured text and produce a Concept Graph.
 * Extracts learning objectives, prerequisite dependencies, common misconceptions,
 * and Bloom's taxonomy levels for each concept.
 */

import { AIService } from './GeminiService';

const EXTRACTION_SYSTEM_PROMPT = `You are an expert educational content analyst specializing in concept mapping and curriculum design.

Given academic source material, your job is to:
1. Identify all discrete concepts taught in the material
2. Map prerequisite dependencies between concepts (which concept must be understood before another)
3. Identify common student misconceptions for each concept
4. Classify each concept by Bloom's Taxonomy level
5. Note where in the source material each concept appears

Output ONLY valid JSON matching the schema provided. Do not include explanations outside the JSON.`;

const EXTRACTION_PROMPT_TEMPLATE = `Analyze the following academic content and extract a complete concept graph.

## Source Material
Title: {{title}}
Subject: {{subject}}
Type: {{type}}

--- CONTENT START ---
{{content}}
--- CONTENT END ---

## Required Output Schema
{
  "concepts": [
    {
      "id": "c_short_snake_case_id",
      "name": "Human-readable concept name",
      "description": "1-2 sentence explanation of the concept",
      "prerequisites": ["c_other_concept_id"],
      "misconceptions": [
        {
          "id": "m_short_id",
          "text": "The wrong intuition students commonly have",
          "correction": "The correct understanding",
          "frequency": "common | occasional | rare"
        }
      ],
      "bloom_level": "remember | understand | apply | analyze | evaluate | create",
      "keywords": ["key", "terms"],
      "assessment_criteria": "How to verify a student understands this concept"
    }
  ],
  "edges": [
    { "from": "c_prerequisite", "to": "c_dependent", "type": "prerequisite | related | extends" }
  ],
  "summary": "Brief summary of the overall concept structure"
}

Extract ALL concepts from the material. Be thorough — missing a concept means a student might skip it entirely.`;

/**
 * Extract a concept graph from structured text content.
 *
 * @param {Object} sourceDoc - Output from IngestService
 * @param {Object} options - { title, subject, courseId }
 * @returns {Promise<ConceptGraph>}
 */
export async function extractConcepts(sourceDoc, options = {}) {
    const {
        title = 'Untitled Chapter',
        subject = 'General',
        courseId = 'unknown',
    } = options;

    const content = sourceDoc.text || sourceDoc.transcript || '';
    if (!content || content.length < 100) {
        throw new Error('[ConceptExtractor] Insufficient content for extraction');
    }

    // Build the prompt
    const prompt = EXTRACTION_PROMPT_TEMPLATE
        .replace('{{title}}', title)
        .replace('{{subject}}', subject)
        .replace('{{type}}', sourceDoc.type || 'text')
        .replace('{{content}}', content.substring(0, 30000)); // Truncate for context window

    console.log(`[ConceptExtractor] Extracting concepts from: ${title}`);
    console.log(`[ConceptExtractor] Content length: ${content.length} chars`);

    try {
        const response = await AIService.query(prompt, {
            systemPrompt: EXTRACTION_SYSTEM_PROMPT,
            temperature: 0.3, // Low temperature for structured extraction
            maxTokens: 8000,
        });

        // Parse JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('LLM response did not contain valid JSON');
        }

        const conceptGraph = JSON.parse(jsonMatch[0]);

        // Validate and enhance
        return {
            id: `cg_${courseId}_${Date.now()}`,
            chapter_id: options.chapterId || null,
            generation_model: AIService.getProvider(),
            reviewed: false,
            reviewed_by: null,
            generated_at: new Date().toISOString(),
            ...conceptGraph,
        };
    } catch (err) {
        console.error('[ConceptExtractor] Extraction failed:', err);
        throw err;
    }
}

/**
 * Validate a concept graph for completeness and consistency.
 */
export function validateConceptGraph(graph) {
    const issues = [];
    const conceptIds = new Set(graph.concepts?.map(c => c.id) || []);

    // Check each concept
    (graph.concepts || []).forEach(concept => {
        if (!concept.id) issues.push(`Concept missing ID: ${concept.name}`);
        if (!concept.name) issues.push(`Concept missing name: ${concept.id}`);
        if (!concept.description) issues.push(`Concept missing description: ${concept.id}`);
        if (!concept.bloom_level) issues.push(`Concept missing Bloom level: ${concept.id}`);

        // Check prerequisite references
        (concept.prerequisites || []).forEach(prereq => {
            if (!conceptIds.has(prereq)) {
                issues.push(`Concept ${concept.id} references unknown prerequisite: ${prereq}`);
            }
        });
    });

    // Check edges reference valid concepts
    (graph.edges || []).forEach(edge => {
        if (!conceptIds.has(edge.from)) issues.push(`Edge references unknown concept: ${edge.from}`);
        if (!conceptIds.has(edge.to)) issues.push(`Edge references unknown concept: ${edge.to}`);
    });

    // Check for cycles (would create impossible prerequisite chains)
    const hasCycle = detectCycle(graph.concepts || [], graph.edges || []);
    if (hasCycle) issues.push('Concept graph contains a prerequisite cycle');

    return {
        valid: issues.length === 0,
        issues,
        stats: {
            totalConcepts: graph.concepts?.length || 0,
            totalEdges: graph.edges?.length || 0,
            totalMisconceptions: graph.concepts?.reduce((sum, c) => sum + (c.misconceptions?.length || 0), 0) || 0,
            bloomDistribution: computeBloomDistribution(graph.concepts || []),
        },
    };
}

/**
 * Detect cycles in the prerequisite dependency graph.
 */
function detectCycle(concepts, edges) {
    const adjList = {};
    concepts.forEach(c => { adjList[c.id] = []; });
    edges.filter(e => e.type === 'prerequisite').forEach(e => {
        if (adjList[e.from]) adjList[e.from].push(e.to);
    });

    const visited = new Set();
    const recursionStack = new Set();

    function dfs(node) {
        visited.add(node);
        recursionStack.add(node);

        for (const neighbor of (adjList[node] || [])) {
            if (!visited.has(neighbor)) {
                if (dfs(neighbor)) return true;
            } else if (recursionStack.has(neighbor)) {
                return true;
            }
        }

        recursionStack.delete(node);
        return false;
    }

    for (const concept of concepts) {
        if (!visited.has(concept.id)) {
            if (dfs(concept.id)) return true;
        }
    }

    return false;
}

/**
 * Compute distribution of Bloom's taxonomy levels.
 */
function computeBloomDistribution(concepts) {
    const dist = { remember: 0, understand: 0, apply: 0, analyze: 0, evaluate: 0, create: 0 };
    concepts.forEach(c => {
        if (dist.hasOwnProperty(c.bloom_level)) {
            dist[c.bloom_level]++;
        }
    });
    return dist;
}

/**
 * Merge two concept graphs (e.g., from video + textbook of the same chapter).
 */
export function mergeConceptGraphs(graphA, graphB) {
    const mergedConcepts = [...(graphA.concepts || [])];
    const existingIds = new Set(mergedConcepts.map(c => c.id));

    (graphB.concepts || []).forEach(concept => {
        if (!existingIds.has(concept.id)) {
            mergedConcepts.push(concept);
            existingIds.add(concept.id);
        } else {
            // Merge misconceptions from both sources
            const existing = mergedConcepts.find(c => c.id === concept.id);
            const existingMisconceptionIds = new Set((existing.misconceptions || []).map(m => m.id));
            (concept.misconceptions || []).forEach(m => {
                if (!existingMisconceptionIds.has(m.id)) {
                    existing.misconceptions = [...(existing.misconceptions || []), m];
                }
            });
        }
    });

    const mergedEdges = [...(graphA.edges || [])];
    const edgeKeys = new Set(mergedEdges.map(e => `${e.from}-${e.to}`));
    (graphB.edges || []).forEach(edge => {
        const key = `${edge.from}-${edge.to}`;
        if (!edgeKeys.has(key)) {
            mergedEdges.push(edge);
            edgeKeys.add(key);
        }
    });

    return {
        ...graphA,
        concepts: mergedConcepts,
        edges: mergedEdges,
        merged: true,
        merged_at: new Date().toISOString(),
    };
}

export default {
    extractConcepts,
    validateConceptGraph,
    mergeConceptGraphs,
};
