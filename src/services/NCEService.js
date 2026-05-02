/**
 * NCEService.js
 * Narrative Conversion Engine — Manages the 5-step immersive learning state machine.
 * Fetches scenarios from the database and orchestrates student progression using Firebase Firestore.
 */

import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './FirebaseClient';
import { AIService } from './GeminiService';

export const NCEService = {
    /**
     * Fetch available NCE scenarios, optionally filtered by course or difficulty.
     */
    async getScenarios({ courseId = null, difficulty = null, status = 'published' } = {}) {
        let conditions = [where('status', '==', status)];
        if (courseId) conditions.push(where('course_id', '==', courseId));
        if (difficulty) conditions.push(where('difficulty_level', '==', difficulty));

        const q = query(
            collection(db, 'nce_scenarios'),
            ...conditions,
            orderBy('title')
        );

        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    /**
     * Fetch a full scenario definition by ID (all 5 steps).
     */
    async getScenarioById(scenarioId) {
        const snap = await getDoc(doc(db, 'nce_scenarios', scenarioId));
        if (!snap.exists()) throw new Error('Scenario not found');
        return { id: snap.id, ...snap.data() };
    },

    /**
     * Start or resume a student's progress through a scenario.
     */
    async getOrCreateProgress(studentId, scenarioId) {
        const progRef = doc(db, 'users', studentId, 'nce_progress', scenarioId);
        const snap = await getDoc(progRef);

        if (snap.exists()) {
            return { id: snap.id, ...snap.data() };
        }

        // Create new progress
        const newData = {
            student_id: studentId,
            scenario_id: scenarioId,
            current_step: 1,
            step_data: {},
            started_at: serverTimestamp()
        };

        await setDoc(progRef, newData);

        // Fetch again to ensure timestamps are resolved locally OR just return the object
        return { id: scenarioId, ...newData, started_at: new Date().toISOString() };
    },

    /**
     * Advance to the next step in the NCE state machine.
     * Validates that the current step is complete before moving forward.
     */
    async advanceStep(studentId, scenarioId, stepResponseData) {
        const progRef = doc(db, 'users', studentId, 'nce_progress', scenarioId);
        const snap = await getDoc(progRef);

        if (!snap.exists()) throw new Error('Progress not found');
        const progress = snap.data();

        const newStep = progress.current_step + 1;
        if (newStep > 5) {
            throw new Error('Scenario already completed.');
        }

        // Merge step response into accumulated step_data
        const updatedStepData = {
            ...progress.step_data,
            [`step${progress.current_step}_response`]: stepResponseData,
            [`step${progress.current_step}_completed_at`]: new Date().toISOString(),
        };

        const updates = {
            current_step: newStep,
            step_data: updatedStepData,
        };

        // If completing step 4 (artifact), save the artifact
        if (progress.current_step === 4 && stepResponseData.artifact_content) {
            updates.artifact_content = stepResponseData.artifact_content;
            updates.artifact_url = stepResponseData.artifact_url || null;
        }

        // If completing step 5 (extraction), mark scenario complete
        if (newStep > 5 || progress.current_step === 5) {
            updates.completed_at = serverTimestamp();
        }

        await updateDoc(progRef, updates);

        const updatedSnap = await getDoc(progRef);
        return { id: updatedSnap.id, ...updatedSnap.data() };
    },

    /**
     * Generate the AI prompt for the current step of a scenario.
     * Combines the scenario definition + student's accumulated decisions + Hot Folder context.
     */
    async generateStepPrompt(studentId, scenarioId, courseContext = '') {
        const [scenario, progressSnap] = await Promise.all([
            this.getScenarioById(scenarioId),
            getDoc(doc(db, 'users', studentId, 'nce_progress', scenarioId))
        ]);

        if (!scenario || !progressSnap.exists()) throw new Error('Scenario or progress not found.');
        const progress = progressSnap.data();

        const step = progress.current_step;
        const stepKey = `step${step}`;
        const stepData = scenario[`${stepKey}_confusion`] || scenario[`${stepKey}_immersion`] || scenario[`${stepKey}_theory`] || scenario[`${stepKey}_artifact`] || scenario[`${stepKey}_extraction`];

        // Map step number to step config key
        const stepConfigMap = {
            1: scenario.step1_confusion,
            2: scenario.step2_immersion,
            3: scenario.step3_theory,
            4: scenario.step4_artifact,
            5: scenario.step5_extraction,
        };

        const currentStepConfig = stepConfigMap[step];
        if (!currentStepConfig) throw new Error(`Invalid step: ${step}`);

        // Build the context-aware prompt
        const previousDecisions = Object.entries(progress.step_data || {})
            .filter(([key]) => key.endsWith('_response'))
            .map(([key, val]) => `${key}: ${JSON.stringify(val)}`)
            .join('\n');

        const userPrompt = `
CURRENT STEP: ${step} of 5
STEP CONFIG: ${JSON.stringify(currentStepConfig)}
STUDENT'S PREVIOUS DECISIONS:
${previousDecisions || 'None yet — this is the first step.'}

Generate the narrative experience for this step. Follow the configuration exactly.
${step === 5 ? 'Extract the mental models the student demonstrated. Evaluate against the rubric.' : ''}

ADDITIONAL COURSE CONTEXT (LECTURES/SYLLABUS):
${courseContext || 'No additional context provided.'}
`;

        return {
            systemPrompt: scenario.system_prompt_template || 'You are an objective simulation engine.',
            userPrompt,
            stepConfig: currentStepConfig,
            knowledgeContext: scenario.knowledge_context,
        };
    },

    /**
     * Run the AI for the current NCE step.
     * Returns the generated narrative text.
     */
    async runStep(studentId, scenarioId, courseContext = '') {
        const { systemPrompt, userPrompt, knowledgeContext } = await this.generateStepPrompt(studentId, scenarioId, courseContext);

        const fullSystem = knowledgeContext
            ? `${systemPrompt}\n\nKNOWLEDGE CONTEXT:\n${knowledgeContext}`
            : systemPrompt;

        const response = await AIService.generate(userPrompt, fullSystem);
        return response;
    },

    /**
     * Evaluate a student's mental model extraction (Step 5).
     * Uses LLM-as-a-judge pattern.
     */
    async evaluateExtraction(studentId, scenarioId) {
        const progRef = doc(db, 'users', studentId, 'nce_progress', scenarioId);
        const [progressSnap, scenario] = await Promise.all([
            getDoc(progRef),
            this.getScenarioById(scenarioId)
        ]);

        if (!progressSnap.exists() || !scenario) throw new Error('Progress or Scenario not found.');
        const progress = progressSnap.data();

        const evaluationRubric = scenario.step5_extraction?.evaluation_rubric || 'Evaluate quality and depth.';
        const targetModels = scenario.step5_extraction?.target_mental_models || [];

        const evaluationPrompt = `
You are evaluating a student's mental model extraction from an immersive learning simulation.

TARGET MENTAL MODELS: ${JSON.stringify(targetModels)}
EVALUATION RUBRIC: ${evaluationRubric}

STUDENT'S ACCUMULATED DATA:
${JSON.stringify(progress.step_data, null, 2)}

STUDENT'S ARTIFACT:
${progress.artifact_content || 'No artifact submitted.'}

Score the student from 0-100 and provide specific feedback.
Return ONLY valid JSON: {"score": <number>, "feedback": "<string>", "models_demonstrated": ["<model1>", "<model2>"]}
`;

        const result = await AIService.generate(evaluationPrompt, 'You are a strict academic evaluator. Return only JSON.');

        try {
            const parsed = JSON.parse(result);

            // Update progress with evaluation
            await updateDoc(progRef, {
                evaluation_score: parsed.score,
                evaluation_feedback: parsed.feedback,
                extracted_models: parsed.models_demonstrated || [],
                xp_awarded: Math.round(parsed.score * 2), // 0-200 XP
            });

            return parsed;
        } catch (e) {
            console.error('[NCE] Failed to parse evaluation:', e);
            return { score: 0, feedback: 'Evaluation failed. Please try again.', models_demonstrated: [] };
        }
    },
};

export default NCEService;
