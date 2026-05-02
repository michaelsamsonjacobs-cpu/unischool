/**
 * EnrollmentService.js
 * Manages student enrollments, academic progress tracking, and credit equivalency calculations.
 * Data is persisted in Firebase Firestore.
 */

import {
    collection, doc, getDoc, getDocs, setDoc, updateDoc,
    query, where, collectionGroup, serverTimestamp
} from 'firebase/firestore';
import { db } from './FirebaseClient';
import { InstitutionService } from './InstitutionService';

export const EnrollmentService = {
    /**
     * Create a new enrollment for a student in a course.
     */
    async enrollStudent(studentId, courseId) {
        // Generate a new ID
        const enrollRef = doc(collection(db, 'users', studentId, 'enrollments'));

        const enrollmentData = {
            id: enrollRef.id,
            student_id: studentId,
            course_id: courseId,
            status: 'enrolled',
            enrolled_at: serverTimestamp(),
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
        };

        await setDoc(enrollRef, enrollmentData);

        const courseDetails = await InstitutionService.getCourseById(courseId);

        // Audit Log
        await this._auditLog(studentId, 'enrollment.created', 'enrollment', enrollRef.id, null, enrollmentData);

        return { ...enrollmentData, course: courseDetails };
    },

    /**
     * Get all enrollments for a student, with full course/institution details.
     */
    async getStudentEnrollments(studentId) {
        const q = query(
            collection(db, 'users', studentId, 'enrollments')
            // Add orderBy if we store enrolled_at as numeric/ISO, serverTimestamp complicates local sort
            // orderBy('enrolled_at', 'desc')
        );
        const snapshot = await getDocs(q);
        const enrollments = snapshot.docs.map(d => d.data());

        // Hydrate courses and institutions manually (to emulate Supabase joins)
        return await Promise.all(enrollments.map(async (enc) => {
            try {
                const course = await InstitutionService.getCourseById(enc.course_id);
                return { ...enc, course };
            } catch (e) {
                return { ...enc, course: null };
            }
        }));
    },

    /**
     * Update enrollment status (state machine transition).
     */
    async updateEnrollmentStatus(studentId, enrollmentId, newStatus, gradeData = {}) {
        const enrollRef = doc(db, 'users', studentId, 'enrollments', enrollmentId);

        const updates = {
            status: newStatus,
            ...gradeData,
            updated_at: serverTimestamp()
        };

        if (newStatus === 'in_progress') updates.started_at = serverTimestamp();
        if (newStatus === 'completed') updates.completed_at = serverTimestamp();
        if (newStatus === 'graded') updates.grade_received_at = serverTimestamp();

        await updateDoc(enrollRef, updates);

        const snap = await getDoc(enrollRef);
        return snap.data();
    },

    /**
     * Process an incoming grade/progress event from a webhook or polling job.
     */
    async processExternalUpdate(externalEnrollmentId, updatePayload) {
        const q = query(
            collectionGroup(db, 'enrollments'),
            where('external_enrollment_id', '==', externalEnrollmentId)
        );

        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            console.warn(`[Accrual] No enrollment found for external ID: ${externalEnrollmentId}`);
            return null;
        }

        const enrollmentDoc = snapshot.docs[0];
        const enrollment = enrollmentDoc.data();
        const enrollRef = enrollmentDoc.ref;

        const updates = {
            last_synced_at: serverTimestamp(),
            sync_source: updatePayload.source || 'webhook',
            updated_at: serverTimestamp()
        };

        if (updatePayload.completion_percentage !== undefined) updates.completion_percentage = updatePayload.completion_percentage;
        if (updatePayload.grade_letter) updates.grade_letter = updatePayload.grade_letter;
        if (updatePayload.grade_numeric !== undefined) updates.grade_numeric = updatePayload.grade_numeric;
        if (updatePayload.status) updates.status = updatePayload.status;

        await updateDoc(enrollRef, updates);
        const updatedSnap = await getDoc(enrollRef);
        const newData = updatedSnap.data();

        // Audit
        await this._auditLog(
            enrollment.student_id,
            'enrollment.external_sync',
            'enrollment',
            enrollRef.id,
            enrollment,
            newData
        );

        return newData;
    },

    /**
     * Calculate a student's progress towards a specific requirement matrix.
     */
    async calculateCreditProgress(studentId, matrixId) {
        // 1. Fetch matrix
        const matrixSnap = await getDoc(doc(db, 'requirement_matrices', matrixId));
        if (!matrixSnap.exists()) throw new Error("Matrix not found");
        const matrix = matrixSnap.data();

        // 2. Fetch completed enrollments
        const q = query(collection(db, 'users', studentId, 'enrollments'), where('status', 'in', ['completed', 'graded']));
        const enrollSnap = await getDocs(q);
        const enrollments = enrollSnap.docs.map(d => d.data());

        const completedCourseIds = enrollments.map(e => e.course_id);

        // 3. Fetch equivalencies
        let equivalencies = [];
        if (completedCourseIds.length > 0) {
            // Firestore 'in' queries are limited to 10 items. We loop if necessary, or just query by matrix_id locally.
            // Since we want all equivalencies for this matrix to build the UI track, let's just fetch all by matrix_id
            const eqQ = query(collection(db, 'course_equivalencies'), where('matrix_id', '==', matrixId));
            const eqSnap = await getDocs(eqQ);

            // Filter locally for completed courses
            equivalencies = eqSnap.docs
                .map(d => d.data())
                .filter(eq => completedCourseIds.includes(eq.course_id));
        }

        // 4. Build progress map
        const requirements = matrix.requirements || {};
        const progress = {};
        let totalRequired = 0;
        let totalFulfilled = 0;

        for (const [key, req] of Object.entries(requirements)) {
            const creditsRequired = req.credits_required || 0;
            const matchingEquivs = equivalencies.filter(eq => eq.requirement_key === key);
            const creditsFulfilled = matchingEquivs.reduce((sum, eq) => sum + parseFloat(eq.credits_fulfilled || 0), 0);
            const isFulfilled = creditsFulfilled >= creditsRequired;

            progress[key] = {
                label: req.label || key,
                credits_required: creditsRequired,
                credits_fulfilled: Math.min(creditsFulfilled, creditsRequired),
                is_fulfilled: isFulfilled,
                courses_completed: matchingEquivs.map(eq => eq.course_id),
            };

            totalRequired += creditsRequired;
            totalFulfilled += Math.min(creditsFulfilled, creditsRequired);
        }

        return {
            matrix_id: matrixId,
            matrix_name: matrix.name,
            matrix_type: matrix.matrix_type,
            total_required: totalRequired,
            total_fulfilled: totalFulfilled,
            completion_percentage: totalRequired > 0 ? Math.round((totalFulfilled / totalRequired) * 100) : 0,
            is_complete: totalFulfilled >= totalRequired,
            requirements: progress,
        };
    },

    /**
     * Check if a student has completed all GE requirements (unlocks Career Pathways).
     */
    async isGEComplete(studentId) {
        const q = query(collection(db, 'requirement_matrices'), where('matrix_type', '==', 'college_ge'), where('is_default', '==', true));
        const snap = await getDocs(q);
        if (snap.empty) return false;

        const progress = await this.calculateCreditProgress(studentId, snap.docs[0].id);
        return progress.is_complete;
    },

    /**
     * Internal: Write to audit log.
     */
    async _auditLog(actorId, action, resourceType, resourceId, oldData, newData) {
        try {
            const auditRef = doc(collection(db, 'audit_log'));
            await setDoc(auditRef, {
                timestamp: serverTimestamp(),
                actor_id: actorId,
                action,
                resource_type: resourceType,
                resource_id: resourceId,
                old_data: oldData,
                new_data: newData,
            });
        } catch (e) {
            console.error('[Audit] Failed to write audit log:', e);
        }
    },
};

export default EnrollmentService;
