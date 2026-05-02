/**
 * XPSessionService.js
 * Manages student play-through state for XP narrative missions.
 * Tracks current node, decision history, concept coverage, misconceptions, and XP.
 */

import { db } from './FirebaseClient';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

const COLLECTION = 'xp_sessions';

/**
 * Creates a new XP session for a student starting a mission.
 */
export async function createSession(studentId, narrativeId, courseId, chapterId, entryNodeId) {
    const sessionId = `xps_${studentId}_${narrativeId}_${Date.now()}`;
    const session = {
        id: sessionId,
        student_id: studentId,
        narrative_id: narrativeId,
        course_id: courseId,
        chapter_id: chapterId,
        current_node: entryNodeId,
        decision_history: [],
        concept_coverage: {},
        misconception_hits: [],
        confidence_trend: [],
        xp_earned: 0,
        status: 'in_progress',
        started_at: serverTimestamp(),
        completed_at: null,
        total_time_seconds: 0,
        compliance_mapping: {},
    };

    try {
        await setDoc(doc(db, COLLECTION, sessionId), session);
        return session;
    } catch (err) {
        console.error('[XPSession] Failed to create session:', err);
        // Return local session for offline use
        return { ...session, started_at: new Date().toISOString() };
    }
}

/**
 * Load an existing session by ID.
 */
export async function loadSession(sessionId) {
    try {
        const snap = await getDoc(doc(db, COLLECTION, sessionId));
        if (snap.exists()) return { id: snap.id, ...snap.data() };
    } catch (err) {
        console.error('[XPSession] Failed to load session:', err);
    }
    return null;
}

/**
 * Find the most recent in-progress session for a student on a specific narrative.
 */
export async function findActiveSession(studentId, narrativeId) {
    try {
        const q = query(
            collection(db, COLLECTION),
            where('student_id', '==', studentId),
            where('narrative_id', '==', narrativeId),
            where('status', '==', 'in_progress')
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
            const latest = snap.docs.sort((a, b) => {
                const aTime = a.data().started_at?.toMillis?.() || 0;
                const bTime = b.data().started_at?.toMillis?.() || 0;
                return bTime - aTime;
            })[0];
            return { id: latest.id, ...latest.data() };
        }
    } catch (err) {
        console.error('[XPSession] Failed to find active session:', err);
    }
    return null;
}

/**
 * Record a decision and advance the session to a new node.
 * Updates concept coverage, misconception tracking, and XP.
 */
export async function recordDecision(sessionId, session, nodeData, choiceId, nextNodeId) {
    const choice = nodeData.choices.find(c => c.id === choiceId);
    const xpGained = choice?.xp_bonus || 0;

    // Build decision entry
    const entry = {
        node_id: nodeData.id,
        choice_id: choiceId,
        timestamp: new Date().toISOString(),
        time_spent_seconds: 0, // Caller should compute this
    };

    // Update concept coverage
    const updatedCoverage = { ...session.concept_coverage };
    if (nodeData.hidden_pedagogy?.concepts_covered) {
        nodeData.hidden_pedagogy.concepts_covered.forEach(c => {
            updatedCoverage[c] = true;
        });
    }

    // Track misconception hits
    const updatedMisconceptions = [...(session.misconception_hits || [])];
    if (nodeData.hidden_pedagogy?.is_error_path && nodeData.hidden_pedagogy?.misconception_tested) {
        if (!updatedMisconceptions.includes(nodeData.hidden_pedagogy.misconception_tested)) {
            updatedMisconceptions.push(nodeData.hidden_pedagogy.misconception_tested);
        }
    }

    // Compute confidence: ratio of correct-path choices to total
    const totalDecisions = (session.decision_history?.length || 0) + 1;
    const errorDecisions = updatedMisconceptions.length;
    const confidenceScore = Math.round(((totalDecisions - errorDecisions) / totalDecisions) * 100);
    const updatedConfidence = [...(session.confidence_trend || []), confidenceScore];

    const updates = {
        current_node: nextNodeId,
        decision_history: [...(session.decision_history || []), entry],
        concept_coverage: updatedCoverage,
        misconception_hits: updatedMisconceptions,
        confidence_trend: updatedConfidence,
        xp_earned: (session.xp_earned || 0) + xpGained,
    };

    // Check if mission is complete
    if (nodeData.type === 'end' || !nodeData.choices || nodeData.choices.length === 0) {
        updates.status = 'completed';
        updates.completed_at = new Date().toISOString();
    }

    try {
        await updateDoc(doc(db, COLLECTION, sessionId), updates);
    } catch (err) {
        console.error('[XPSession] Failed to update session:', err);
    }

    return { ...session, ...updates };
}

/**
 * Mark a session as completed.
 */
export async function completeSession(sessionId, totalTimeSeconds) {
    try {
        await updateDoc(doc(db, COLLECTION, sessionId), {
            status: 'completed',
            completed_at: serverTimestamp(),
            total_time_seconds: totalTimeSeconds,
        });
    } catch (err) {
        console.error('[XPSession] Failed to complete session:', err);
    }
}

/**
 * Get all completed sessions for a student.
 */
export async function getStudentSessions(studentId) {
    try {
        const q = query(
            collection(db, COLLECTION),
            where('student_id', '==', studentId)
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
        console.error('[XPSession] Failed to fetch student sessions:', err);
        return [];
    }
}

/**
 * Compute concept mastery summary from all sessions for a student.
 */
export function computeConceptMastery(sessions) {
    const mastery = {};
    sessions.forEach(session => {
        if (session.concept_coverage) {
            Object.entries(session.concept_coverage).forEach(([concept, covered]) => {
                if (covered) {
                    mastery[concept] = (mastery[concept] || 0) + 1;
                }
            });
        }
    });
    return mastery;
}

/**
 * Compute misconception patterns across sessions.
 */
export function computeMisconceptionPatterns(sessions) {
    const patterns = {};
    sessions.forEach(session => {
        (session.misconception_hits || []).forEach(m => {
            patterns[m] = (patterns[m] || 0) + 1;
        });
    });
    return patterns;
}

/**
 * Local-only session manager for offline or demo mode.
 * Stores session in localStorage.
 */
export class LocalSessionManager {
    constructor() {
        this.storageKey = 'xp_local_sessions';
    }

    _load() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        } catch {
            return {};
        }
    }

    _save(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    createSession(studentId, narrativeId, entryNodeId) {
        const sessions = this._load();
        const sessionId = `local_${narrativeId}_${Date.now()}`;
        const session = {
            id: sessionId,
            student_id: studentId,
            narrative_id: narrativeId,
            current_node: entryNodeId,
            decision_history: [],
            concept_coverage: {},
            misconception_hits: [],
            confidence_trend: [],
            xp_earned: 0,
            status: 'in_progress',
            started_at: new Date().toISOString(),
        };
        sessions[sessionId] = session;
        this._save(sessions);
        return session;
    }

    getSession(sessionId) {
        return this._load()[sessionId] || null;
    }

    findActiveSession(narrativeId) {
        const sessions = this._load();
        return Object.values(sessions).find(
            s => s.narrative_id === narrativeId && s.status === 'in_progress'
        ) || null;
    }

    updateSession(sessionId, updates) {
        const sessions = this._load();
        if (sessions[sessionId]) {
            sessions[sessionId] = { ...sessions[sessionId], ...updates };
            this._save(sessions);
            return sessions[sessionId];
        }
        return null;
    }

    recordDecision(sessionId, nodeData, choiceId, nextNodeId) {
        const session = this.getSession(sessionId);
        if (!session) return null;

        const choice = nodeData.choices?.find(c => c.id === choiceId);
        const xpGained = choice?.xp_bonus || 0;

        const entry = {
            node_id: nodeData.id,
            choice_id: choiceId,
            timestamp: new Date().toISOString(),
        };

        const updatedCoverage = { ...session.concept_coverage };
        (nodeData.hidden_pedagogy?.concepts_covered || []).forEach(c => {
            updatedCoverage[c] = true;
        });

        const updatedMisconceptions = [...(session.misconception_hits || [])];
        if (nodeData.hidden_pedagogy?.is_error_path && nodeData.hidden_pedagogy?.misconception_tested) {
            if (!updatedMisconceptions.includes(nodeData.hidden_pedagogy.misconception_tested)) {
                updatedMisconceptions.push(nodeData.hidden_pedagogy.misconception_tested);
            }
        }

        const totalDecisions = session.decision_history.length + 1;
        const errorDecisions = updatedMisconceptions.length;
        const confidenceScore = Math.round(((totalDecisions - errorDecisions) / totalDecisions) * 100);

        const isEnd = nodeData.type === 'end' || !nodeData.choices?.length;

        return this.updateSession(sessionId, {
            current_node: nextNodeId,
            decision_history: [...session.decision_history, entry],
            concept_coverage: updatedCoverage,
            misconception_hits: updatedMisconceptions,
            confidence_trend: [...(session.confidence_trend || []), confidenceScore],
            xp_earned: session.xp_earned + xpGained,
            status: isEnd ? 'completed' : 'in_progress',
            completed_at: isEnd ? new Date().toISOString() : null,
        });
    }
}

export default {
    createSession,
    loadSession,
    findActiveSession,
    recordDecision,
    completeSession,
    getStudentSessions,
    computeConceptMastery,
    computeMisconceptionPatterns,
    LocalSessionManager,
};
