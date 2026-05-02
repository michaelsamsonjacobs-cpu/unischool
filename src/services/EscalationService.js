/**
 * EscalationService.js
 * AI → Human escalation system for student support.
 * Monitors student telemetry and creates support tickets when thresholds are exceeded via Firebase Firestore.
 */

import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from './FirebaseClient';

export const EscalationService = {
    /**
     * Evaluate a student's activity and create tickets if thresholds are exceeded.
     */
    async evaluateStudent(studentId) {
        // 1. Get the student profile and franchise config
        const userSnap = await getDoc(doc(db, 'users', studentId));
        if (!userSnap.exists()) return null;
        const profile = userSnap.data();

        let franchise = {};
        if (profile.franchise_id) {
            const franchiseSnap = await getDoc(doc(db, 'franchises', profile.franchise_id));
            if (franchiseSnap.exists()) franchise = franchiseSnap.data();
        }

        const config = franchise.operating_config || {};
        const thresholds = config.escalation_thresholds || {
            max_idle_hours: 48,
            max_nce_failures: 3,
        };

        const issues = [];

        // 2. Check for prolonged inactivity (fetch most recently updated active enrollment)
        const enrQ = query(
            collection(db, 'users', studentId, 'enrollments'),
            where('status', '==', 'in_progress')
        );
        const enrSnap = await getDocs(enrQ);

        // Manual sort to find most recent (Firestore emulator sometimes struggles with mixed sort fields without explicit indices)
        const enrollments = enrSnap.docs.map(d => d.data());
        enrollments.sort((a, b) => new Date(b.updated_at || b.enrolled_at).getTime() - new Date(a.updated_at || a.enrolled_at).getTime());

        if (enrollments.length > 0) {
            const lastActivity = new Date(enrollments[0].updated_at || enrollments[0].enrolled_at);
            const hoursIdle = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60);

            if (hoursIdle > thresholds.max_idle_hours) {
                issues.push({
                    type: 'attendance_risk',
                    title: `Student inactive for ${Math.round(hoursIdle)} hours`,
                    description: `No progress updates detected for active enrollments in the last ${Math.round(hoursIdle)} hours.`,
                    priority: hoursIdle > thresholds.max_idle_hours * 2 ? 'critical' : 'high',
                    trigger_data: { rule: 'max_idle_hours', value: Math.round(hoursIdle), threshold: thresholds.max_idle_hours },
                });
            }
        }

        // 3. Check for repeated NCE failures (uses collectionGroup since ID is scenarioId)
        const nceQ = query(collection(db, 'users', studentId, 'nce_progress'));
        const nceSnap = await getDocs(nceQ);
        let nceProgress = nceSnap.docs.map(d => d.data()).filter(p => p.evaluation_score !== undefined && p.evaluation_score !== null);

        // Sort descending by completion time manually
        nceProgress.sort((a, b) => new Date(b.completed_at || 0).getTime() - new Date(a.completed_at || 0).getTime());
        nceProgress = nceProgress.slice(0, thresholds.max_nce_failures);

        if (nceProgress.length >= thresholds.max_nce_failures) {
            const allFailing = nceProgress.every(p => (p.evaluation_score || 0) < 50);
            if (allFailing) {
                issues.push({
                    type: 'nce_failure',
                    title: `Student failing consecutive NCE scenarios`,
                    description: `Last ${nceProgress.length} NCE evaluations scored below 50%. Mentor intervention recommended.`,
                    priority: 'high',
                    trigger_data: {
                        rule: 'max_nce_failures',
                        value: nceProgress.length,
                        threshold: thresholds.max_nce_failures,
                        scores: nceProgress.map(p => p.evaluation_score),
                    },
                });
            }
        }

        // 4. Create tickets for detected issues
        const createdTickets = [];
        for (const issue of issues) {
            // Check if an open ticket already exists
            const tkQ = query(
                collection(db, 'support_tickets'),
                where('student_uid', '==', studentId),
                where('ticket_type', '==', issue.type),
                where('status', 'in', ['open', 'in_progress']),
                limit(1)
            );
            const tkSnap = await getDocs(tkQ);

            if (!tkSnap.empty) continue; // Don't duplicate

            const ticket = await this.createTicket({
                student_uid: studentId,
                franchise_id: profile.franchise_id,
                center_id: profile.center_id,
                ticket_type: issue.type,
                priority: issue.priority,
                title: issue.title,
                description: issue.description,
                trigger_source: 'ai',
                trigger_data: issue.trigger_data,
            });

            if (ticket) createdTickets.push(ticket);
        }

        return createdTickets;
    },

    /**
     * Create a support ticket.
     */
    async createTicket(ticketData) {
        const slaDurations = {
            critical: 4,   // 4 hours
            high: 24,      // 24 hours
            medium: 48,    // 48 hours
            low: 72,       // 72 hours
        };
        const slaHours = slaDurations[ticketData.priority] || 48;
        const slaDueAt = new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString();

        const ref = doc(collection(db, 'support_tickets'));
        const payload = {
            id: ref.id,
            ...ticketData,
            status: 'open',
            sla_due_at: slaDueAt,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
        };

        await setDoc(ref, payload);

        // Audit log
        try {
            await setDoc(doc(collection(db, 'audit_log')), {
                timestamp: serverTimestamp(),
                actor_id: 'system',
                action: 'ticket.created',
                resource_type: 'support_ticket',
                resource_id: ref.id,
                new_data: payload,
            });
        } catch (e) {
            console.error('[Audit] Write failed:', e);
        }

        return { ...payload, created_at: new Date().toISOString() };
    },

    /**
     * Get tickets for a franchise/center (mentors & staff).
     */
    async getTickets({ franchiseId = null, centerId = null, status = null, priority = null } = {}) {
        let conditions = [];
        if (franchiseId) conditions.push(where('franchise_id', '==', franchiseId));
        if (centerId) conditions.push(where('center_id', '==', centerId));
        if (status) conditions.push(where('status', '==', status));
        if (priority) conditions.push(where('priority', '==', priority));

        const q = query(collection(db, 'support_tickets'), ...conditions);
        const snap = await getDocs(q);

        let tickets = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // Manual sort desc
        tickets.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

        // Hydrate users manually
        return await Promise.all(tickets.map(async (tk) => {
            try {
                const stuSnap = tk.student_uid ? await getDoc(doc(db, 'users', tk.student_uid)) : null;
                const asgSnap = tk.assigned_to ? await getDoc(doc(db, 'users', tk.assigned_to)) : null;

                return {
                    ...tk,
                    student: stuSnap && stuSnap.exists() ? { id: stuSnap.id, full_name: stuSnap.data().full_name } : null,
                    assignee: asgSnap && asgSnap.exists() ? { id: asgSnap.id, full_name: asgSnap.data().full_name } : null
                };
            } catch (e) {
                return tk;
            }
        }));
    },

    /**
     * Resolve a ticket.
     */
    async resolveTicket(ticketId, resolutionNotes, resolvedBy) {
        const ref = doc(db, 'support_tickets', ticketId);

        const updates = {
            status: 'resolved',
            resolution_notes: resolutionNotes,
            assigned_to: resolvedBy,
            resolved_at: serverTimestamp(),
            updated_at: serverTimestamp()
        };

        await updateDoc(ref, updates);
        const snap = await getDoc(ref);
        const data = snap.data();

        // Audit
        await setDoc(doc(collection(db, 'audit_log')), {
            timestamp: serverTimestamp(),
            actor_id: resolvedBy,
            action: 'ticket.resolved',
            resource_type: 'support_ticket',
            resource_id: ticketId,
            new_data: data,
        });

        return data;
    },
};

export default EscalationService;
