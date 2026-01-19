/**
 * DocumentBuilder Service
 * Generates structured documents from templates using local context
 * Pitch Deck and Executive Summary are flagship examples
 */

import { AIService } from './GeminiService';
import FeedbackService from './FeedbackService';

// Document Templates Registry
// Document Templates Registry
export const DOCUMENT_TEMPLATES = {
    researchPaper: {
        id: 'research-paper',
        name: 'Research Paper',
        description: 'Standard academic research paper (APA/MLA)',
        icon: 'file-text',
        sections: [
            { id: 'abstract', name: 'Abstract', prompt: 'Summary of the research problem, methodology, and key findings (250 words).' },
            { id: 'introduction', name: 'Introduction', prompt: 'Hook the reader, state the thesis, and outline the paper structure.' },
            { id: 'lit-review', name: 'Literature Review', prompt: 'Analyze existing research and identify gaps.' },
            { id: 'methodology', name: 'Methodology', prompt: 'Describe how the research was conducted.' },
            { id: 'results', name: 'Results', prompt: 'Present the findings without interpretation.' },
            { id: 'discussion', name: 'Discussion', prompt: 'Interpret the results and their implications.' },
            { id: 'conclusion', name: 'Conclusion', prompt: 'Restate thesis and summarize main points.' },
            { id: 'references', name: 'References', prompt: 'List of sources cited.' }
        ]
    },
    essay: {
        id: 'essay',
        name: 'Persuasive Essay',
        description: 'Argumentative essay with clear thesis',
        icon: 'file-text',
        sections: [
            { id: 'intro', name: 'Introduction', prompt: 'Hook, background info, and thesis statement.' },
            { id: 'body1', name: 'Argument 1', prompt: 'First main point supporting the thesis with evidence.' },
            { id: 'body2', name: 'Argument 2', prompt: 'Second main point supporting the thesis with evidence.' },
            { id: 'counter', name: 'Counter-Argument', prompt: 'Address opposing views and refute them.' },
            { id: 'conclusion', name: 'Conclusion', prompt: 'Summarize arguments and provide a final thought.' }
        ]
    },
    labReport: {
        id: 'lab-report',
        name: 'Lab Report',
        description: 'Science laboratory report',
        icon: 'beaker',
        sections: [
            { id: 'title', name: 'Title & Hypothesis', prompt: 'Experiment title and scientific hypothesis.' },
            { id: 'materials', name: 'Materials & Methods', prompt: 'List equipment and step-by-step procedure.' },
            { id: 'data', name: 'Data', prompt: 'Observations, tables, and graphs.' },
            { id: 'analysis', name: 'Analysis', prompt: 'calculations and error analysis.' },
            { id: 'conclusion', name: 'Conclusion', prompt: 'Was the hypothesis supported? Sources of error.' }
        ]
    },
    capstone: {
        id: 'capstone',
        name: 'Capstone Project',
        description: 'Semester-long spike project documentation',
        icon: 'award',
        sections: [
            { id: 'proposal', name: 'Project Proposal', prompt: 'What are you building/researching and why?' },
            { id: 'research', name: 'Background Research', prompt: 'What exists already? Who are you helping?' },
            { id: 'prototype', name: 'Prototype/Draft', prompt: 'Description of the first version/draft.' },
            { id: 'feedback', name: 'Feedback & Iteration', prompt: 'What you learned from testing/review.' },
            { id: 'final', name: 'Final Deliverable', prompt: 'Description of the final outcome.' },
            { id: 'reflection', name: 'Reflection', prompt: 'What skills did you master? What would you do differently?' }
        ]
    },
    collegeApp: {
        id: 'college-app',
        name: 'College Essay (Common App)',
        description: 'Personal statement for university admission',
        icon: 'file',
        sections: [
            { id: 'brainstorm', name: 'Topic Selection', prompt: 'Which Common App prompt are you answering? Why?' },
            { id: 'narrative', name: 'Narrative Arc', prompt: 'The "Hero\'s Journey" of your story.' },
            { id: 'draft', name: 'Draft', prompt: 'The full personal statement (650 words).' },
            { id: 'polish', name: 'Polishing', prompt: 'Review for voice, tone, and "show, don\'t tell".' }
        ]
    }
};

// Storage key
const DOCS_KEY = 'springroll_documents';

export const DocumentBuilder = {
    // Get all templates
    getTemplates() {
        return Object.values(DOCUMENT_TEMPLATES);
    },

    // Get specific template by ID
    getTemplate(templateId) {
        // Search by template.id, not object key
        return Object.values(DOCUMENT_TEMPLATES).find(t => t.id === templateId) || null;
    },

    // Get saved documents
    getSavedDocuments() {
        const data = localStorage.getItem(DOCS_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Save a document
    saveDocument(doc) {
        const docs = this.getSavedDocuments();
        const existing = docs.findIndex(d => d.id === doc.id);

        if (existing >= 0) {
            docs[existing] = { ...docs[existing], ...doc, updatedAt: new Date().toISOString() };
        } else {
            docs.push({
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                ...doc
            });
        }

        localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
        return docs[existing >= 0 ? existing : docs.length - 1];
    },

    // Delete a document
    deleteDocument(id) {
        const docs = this.getSavedDocuments().filter(d => d.id !== id);
        localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
    },

    // Generate section content using AI with agent context + feedback enrichment
    async generateSection(templateId, sectionId, context = {}, agentContext = null) {
        const template = this.getTemplate(templateId);
        if (!template) throw new Error('Template not found');

        const section = template.sections.find(s => s.id === sectionId);
        if (!section) throw new Error('Section not found');

        // === FEEDBACK-DRIVEN PROMPT ENRICHMENT ===
        let styleGuidance = '';
        let terminologyGuidance = '';
        let exampleOutputs = '';
        let feedbackStats = { terminology: 0, style: null, examples: 0 };

        try {
            // Get learned terminology patterns (min 5 occurrences)
            const terminology = await FeedbackService.getTerminologyPatterns(templateId);
            if (terminology.length > 0) {
                feedbackStats.terminology = terminology.length;
                terminologyGuidance = `\n\n[TERMINOLOGY - Use these preferred terms]\n`;
                terminology.slice(0, 10).forEach(t => {
                    terminologyGuidance += `- Use "${t.to}" instead of "${t.from}" (${t.count} user corrections)\n`;
                });
            }

            // Get style preferences (min 10 samples)
            const style = await FeedbackService.getStylePreferences(templateId);
            if (style) {
                feedbackStats.style = style;
                styleGuidance = `\n\n[STYLE PREFERENCES - Based on ${style.sampleCount} samples]\n`;
                styleGuidance += `- Target sentence length: ~${style.avgSentenceLength} words\n`;
                styleGuidance += `- Content tendency: ${style.lengthTendency === 'expand' ? 'User prefers more detail' : style.lengthTendency === 'condense' ? 'User prefers concise content' : 'Balanced length'}\n`;
                styleGuidance += `- Formatting: ${style.prefersBullets ? 'Use bullet points for lists' : 'Use flowing prose'}\n`;
            }

            // Get example outputs that user has accepted (few-shot)
            const examples = await FeedbackService.getExampleOutputs(templateId, sectionId, 2);
            if (examples.length > 0) {
                feedbackStats.examples = examples.length;
                exampleOutputs = `\n\n[EXAMPLES - Content this user has approved]\n`;
                examples.forEach((ex, i) => {
                    exampleOutputs += `--- Example ${i + 1} ---\n${ex.slice(0, 500)}${ex.length > 500 ? '...' : ''}\n`;
                });
            }

            if (feedbackStats.terminology > 0 || feedbackStats.style || feedbackStats.examples > 0) {
                console.log(`[Feedback] Enriching prompt with ${feedbackStats.terminology} terms, ${feedbackStats.examples} examples`);
            }
        } catch (e) {
            // Gracefully continue without feedback enrichment
            console.warn('[Feedback] Could not load learned patterns:', e.message);
        }

        // Build context string from agentContext
        let contextInfo = '';
        if (agentContext) {
            const ans = agentContext.answers || {};

            // Add folder context
            if (ans.context_folder) {
                contextInfo += `\nPROJECT FOLDER: ${ans.context_folder}`;
            }

            // Add file context
            if (agentContext.fileContext?.length) {
                contextInfo += `\nINDEXED FILES: ${agentContext.fileContext.map(f => f.name).join(', ')}`;
            }

            // Add selected grant opportunity
            if (agentContext.selectedGrant) {
                const g = agentContext.selectedGrant;
                contextInfo += `\n\nGRANT OPPORTUNITY:\n- Title: ${g.title}\n- Agency: ${g.agency}\n- Award: ${g.awardAmount}\n- Deadline: ${g.deadline}\n- Description: ${g.description || 'N/A'}`;
            }

            // Add user inputs
            if (ans.company_name) contextInfo += `\nCOMPANY: ${ans.company_name}`;
            if (ans.pi_name) contextInfo += `\nPRINCIPAL INVESTIGATOR: ${ans.pi_name}`;
            if (ans.invention_title) contextInfo += `\nINVENTION: ${ans.invention_title}`;
            if (ans.inventors) contextInfo += `\nINVENTORS: ${ans.inventors}`;
            if (ans.funding_stage) contextInfo += `\nFUNDING STAGE: ${ans.funding_stage}`;
            if (ans.ask_amount) contextInfo += `\nFUNDING ASK: ${ans.ask_amount}`;
            if (ans.contract_type) contextInfo += `\nCONTRACT TYPE: ${ans.contract_type}`;
            if (ans.party_a) contextInfo += `\nPARTY A: ${ans.party_a}`;
            if (ans.party_b) contextInfo += `\nPARTY B: ${ans.party_b}`;
            if (ans.audience) contextInfo += `\nTARGET AUDIENCE: ${ans.audience}`;
        }

        // Get agent's specialized system prompt
        const agentPrompt = agentContext?.agent?.systemPrompt || '';

        // Build the full generation prompt with feedback enrichment
        const fullPrompt = `Generate the "${section.name}" section for this document.
SECTION GUIDANCE: ${section.prompt}
${styleGuidance}${terminologyGuidance}${exampleOutputs}
CONTEXT:
- Company: ${context.companyName || 'The Company'}
- Industry: ${context.industry || 'Technology'}
${contextInfo}

Write professional, compelling content for this section. Be specific and use the provided context.`;

        // Generate using AI with agent's specialized prompt
        let generatedContent;
        try {
            const tools = agentContext?.agent?.tools || [];
            generatedContent = await AIService.generate(fullPrompt, agentPrompt, tools);
        } catch (err) {
            console.warn('AI generation failed, using fallback:', err.message);
            generatedContent = `## ${section.name}\n\n[Unable to generate with AI - ${err.message}]\n\nPlease ensure your AI provider (Ollama or Gemini) is configured in Settings.`;
        }

        // Generate a tracking ID for feedback capture
        const generationId = crypto.randomUUID();

        return {
            sectionId,
            sectionName: section.name,
            prompt: section.prompt,
            content: generatedContent,
            generatedAt: new Date().toISOString(),
            // Feedback tracking metadata
            _generation: {
                id: generationId,
                templateId,
                enrichedWith: {
                    terminology: feedbackStats.terminology,
                    style: !!feedbackStats.style,
                    examples: feedbackStats.examples
                }
            }
        };
    },

    // Generate full document with agent context
    async generateDocument(templateId, context = {}, agentContext = null) {
        const template = this.getTemplate(templateId);
        if (!template) throw new Error('Template not found');

        const sections = [];
        for (const section of template.sections) {
            const generated = await this.generateSection(templateId, section.id, context, agentContext);
            sections.push(generated);
        }

        return {
            id: crypto.randomUUID(),
            templateId,
            templateName: template.name,
            sections,
            context,
            createdAt: new Date().toISOString(),
            status: 'draft'
        };
    },

    // Export document to Markdown
    exportToMarkdown(doc) {
        let md = `# ${doc.templateName}\n\n`;
        md += `*Generated: ${new Date(doc.createdAt).toLocaleDateString()}*\n\n---\n\n`;

        for (const section of doc.sections) {
            md += `## ${section.sectionName}\n\n`;
            md += `${section.content}\n\n`;
        }

        return md;
    },

    // Export document to HTML (for preview)
    exportToHTML(doc) {
        let html = `<!DOCTYPE html>
<html>
<head>
    <title>${doc.templateName}</title>
    <style>
        body { font-family: 'Inter', system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; background: #0f172a; color: #f8fafc; }
        h1 { font-size: 2rem; margin-bottom: 0.5rem; }
        h2 { font-size: 1.25rem; color: #3b82f6; margin-top: 2rem; border-bottom: 1px solid #1e293b; padding-bottom: 0.5rem; }
        p { line-height: 1.6; color: #cbd5e1; }
        .meta { font-size: 0.875rem; color: #64748b; margin-bottom: 2rem; }
    </style>
</head>
<body>
    <h1>${doc.templateName}</h1>
    <p class="meta">Generated: ${new Date(doc.createdAt).toLocaleDateString()}</p>
`;

        for (const section of doc.sections) {
            html += `    <h2>${section.sectionName}</h2>\n`;
            html += `    <p>${section.content.replace(/\n/g, '<br>')}</p>\n`;
        }

        html += `</body>\n</html>`;
        return html;
    },

    // === FEEDBACK CAPTURE HELPERS ===

    /**
     * Capture user edit to a generated section
     * Call this when user modifies generated content and saves
     */
    async captureEdit(docId, section, editedContent, context = {}) {
        if (!section?._generation) {
            console.warn('[Feedback] Cannot capture - missing generation metadata');
            return null;
        }

        return FeedbackService.captureEdit(
            docId,
            section._generation.templateId,
            section.sectionId,
            section.content,
            editedContent,
            context
        );
    },

    /**
     * Capture user acceptance (content kept as-is)
     * Call this when user explicitly accepts or saves without edits
     */
    async captureAcceptance(docId, section, context = {}) {
        if (!section?._generation) return null;

        return FeedbackService.captureAcceptance(
            docId,
            section._generation.templateId,
            section.sectionId,
            section.content,
            context
        );
    },

    /**
     * Capture user rejection (regenerate requested)
     * Call this when user clicks regenerate button
     */
    async captureRejection(docId, section, reason = '', context = {}) {
        if (!section?._generation) return null;

        return FeedbackService.captureRejection(
            docId,
            section._generation.templateId,
            section.sectionId,
            section.content,
            reason,
            context
        );
    },

    /**
     * Get feedback statistics for UI display
     */
    async getFeedbackStats() {
        return FeedbackService.getStats();
    },

    /**
     * Export user's style profile (for sharing/backup)
     */
    async exportStyleProfile() {
        return FeedbackService.exportStyleProfile();
    },

    /**
     * Import a style profile
     */
    async importStyleProfile(profileData) {
        return FeedbackService.importStyleProfile(profileData);
    }
};

