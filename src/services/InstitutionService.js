/**
 * InstitutionService.js
 * Manages partner university data, course catalog, and credit equivalency mappings.
 * Fetches data from Firebase Firestore.
 */

import { collection, query, where, getDocs, getDoc, doc, orderBy } from 'firebase/firestore';
import { db } from './FirebaseClient';

export const InstitutionService = {
    /**
     * Fetch all active partner institutions.
     */
    async getInstitutions() {
        const q = query(
            collection(db, 'institutions'),
            where('status', '==', 'active'),
            orderBy('name')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    /**
     * Fetch a single institution by its short code (e.g., 'ASU').
     */
    async getInstitutionByCode(shortCode) {
        const q = query(
            collection(db, 'institutions'),
            where('short_code', '==', shortCode)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error(`Institution with code ${shortCode} not found.`);
        }
        const docSnap = querySnapshot.docs[0];
        return { id: docSnap.id, ...docSnap.data() };
    },

    /**
     * Fetch the full course catalog, optionally filtered by institution or GE category.
     */
    async getCourses({ institutionId = null, geCategory = null, status = 'active' } = {}) {
        let conditions = [where('status', '==', status)];

        if (institutionId) {
            conditions.push(where('institution_id', '==', institutionId));
        }
        if (geCategory) {
            conditions.push(where('ge_category', '==', geCategory));
        }

        const q = query(collection(db, 'courses'), ...conditions, orderBy('course_code'));
        const querySnapshot = await getDocs(q);

        let courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Map institution details securely without N+1 if we have a cache or parallel fetch
        // For a small catalog, this is acceptable, or we rely on denormalized data on the course doc.
        // Doing parallel fetches of unique institution IDs
        const uniqueInstitutionIds = [...new Set(courses.map(c => c.institution_id).filter(Boolean))];
        const institutionCache = {};

        await Promise.all(uniqueInstitutionIds.map(async (id) => {
            const instDoc = await getDoc(doc(db, 'institutions', id));
            if (instDoc.exists()) {
                const data = instDoc.data();
                institutionCache[id] = { id, name: data.name, short_code: data.short_code, logo_url: data.logo_url };
            }
        }));

        return courses.map(course => ({
            ...course,
            institution: institutionCache[course.institution_id] || null
        }));
    },

    /**
     * Fetch a single course by ID, including its institution details.
     */
    async getCourseById(courseId) {
        const docSnap = await getDoc(doc(db, 'courses', courseId));
        if (!docSnap.exists()) {
            throw new Error('Course not found');
        }

        const course = { id: docSnap.id, ...docSnap.data() };

        // Fetch relations manually
        if (course.institution_id) {
            const instDoc = await getDoc(doc(db, 'institutions', course.institution_id));
            if (instDoc.exists()) {
                const data = instDoc.data();
                course.institution = {
                    id: instDoc.id,
                    name: data.name,
                    short_code: data.short_code,
                    logo_url: data.logo_url,
                    lms_base_url: data.lms_base_url
                };
            }
        }

        return course;
    },

    /**
     * Build the SSO launch URL for a course.
     * Substitutes template variables with student-specific data.
     */
    buildLaunchUrl(course, studentProfile) {
        if (!course.launch_url_template) {
            // Fallback: link to institution website
            return course.institution?.lms_base_url || course.institution?.website_url || '#';
        }

        return course.launch_url_template
            .replace('{{student_email}}', encodeURIComponent(studentProfile.email))
            .replace('{{student_id}}', encodeURIComponent(studentProfile.id))
            .replace('{{external_id}}', encodeURIComponent(studentProfile.external_student_id || ''));
    },
};

export default InstitutionService;
