/**
 * PathwayService.js
 * Career Pathway management — dynamic taxonomy fetched from the database.
 * Unlocks after GE completion. Manages student pathway selections using Firebase Firestore.
 */

import { collection, doc, getDoc, getDocs, setDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './FirebaseClient';
import { EnrollmentService } from './EnrollmentService';
import { InstitutionService } from './InstitutionService';

export const PathwayService = {
    /**
     * Fetch all active career pathways with their course counts.
     */
    async getPathways() {
        const q = query(collection(db, 'career_pathways'), where('status', '==', 'active'), orderBy('display_order'));
        const snap = await getDocs(q);
        const pathways = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Fetch course counts manually
        return await Promise.all(pathways.map(async (pathway) => {
            const pcQ = query(collection(db, 'pathway_courses'), where('pathway_id', '==', pathway.id));
            const pcSnap = await getDocs(pcQ);

            // Replicating Supabase's `pathway_courses(count)`
            return {
                ...pathway,
                pathway_courses: [{ count: pcSnap.size }]
            };
        }));
    },

    /**
     * Fetch a single pathway with its full course listing.
     */
    async getPathwayWithCourses(pathwayId) {
        const pathwaySnap = await getDoc(doc(db, 'career_pathways', pathwayId));
        if (!pathwaySnap.exists()) throw new Error('Pathway not found');
        const pathway = { id: pathwaySnap.id, ...pathwaySnap.data() };

        // Fetch pathway_courses mappings
        const pcQ = query(collection(db, 'pathway_courses'), where('pathway_id', '==', pathwayId), orderBy('display_order'));
        const pcSnap = await getDocs(pcQ);
        let pathwayCourses = pcSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Hydrate courses and institutions
        pathwayCourses = await Promise.all(pathwayCourses.map(async (pc) => {
            try {
                const courseData = await InstitutionService.getCourseById(pc.course_id);
                return { ...pc, course: courseData };
            } catch (e) {
                return { ...pc, course: null };
            }
        }));

        return { ...pathway, pathway_courses: pathwayCourses };
    },

    /**
     * Check if a student is eligible for pathway selection (GE complete).
     */
    async checkEligibility(studentId) {
        return await EnrollmentService.isGEComplete(studentId);
    },

    /**
     * Select a pathway for a student.
     */
    async selectPathway(studentId, pathwayId) {
        // Verify eligibility
        const eligible = await this.checkEligibility(studentId);
        if (!eligible) {
            throw new Error('Student must complete all General Education requirements before selecting a pathway.');
        }

        const ref = doc(db, 'users', studentId, 'student_pathways', pathwayId);

        await setDoc(ref, {
            pathway_id: pathwayId,
            selected_at: serverTimestamp(),
            status: 'exploring',
        }, { merge: true });

        const pathwaySnap = await getDoc(doc(db, 'career_pathways', pathwayId));
        return {
            pathway_id: pathwayId,
            status: 'exploring',
            pathway: { id: pathwayId, ...pathwaySnap.data() }
        };
    },

    /**
     * Get a student's selected pathways.
     */
    async getStudentPathways(studentId) {
        const q = query(collection(db, 'users', studentId, 'student_pathways'));
        const snap = await getDocs(q);
        const stPathways = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Hydrate pathway details
        return await Promise.all(stPathways.map(async (sp) => {
            try {
                const pathwaySnap = await getDoc(doc(db, 'career_pathways', sp.pathway_id));
                return { ...sp, pathway: { id: sp.pathway_id, ...pathwaySnap.data() } };
            } catch (e) {
                return { ...sp, pathway: null };
            }
        }));
    },
};

export default PathwayService;
