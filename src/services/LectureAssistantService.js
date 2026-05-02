import { db } from './FirebaseClient';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, serverTimestamp, query, orderBy, where, addDoc } from 'firebase/firestore';

/**
 * Service for handling AI Lecture Assistant features.
 * Integrates with Firestore, which subsequently triggers Firebase Cloud Functions
 * for backend processing (summarization, syllabus parsing).
 */
export const LectureAssistantService = {
    /**
     * Upload a syllabus document reference to trigger Hot Folder generation.
     * In a real app, you would upload the file to Firebase Storage first, 
     * then save the reference here.
     * 
     * @param {string} courseId - ID of the course
     * @param {string} fileUrl - Storage URL of the syllabus
     * @param {string} uploaderId - ID of the user uploading (advisor/admin)
     */
    async processSyllabus(courseId, fileUrl, uploaderId) {
        try {
            const syllabusRef = collection(db, 'courses', courseId, 'syllabus_processing');
            const docRef = await addDoc(syllabusRef, {
                file_url: fileUrl,
                uploaded_by: uploaderId,
                status: 'pending',
                created_at: serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Error triggering syllabus processing:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Get the Hot Folder contents for a course to be injected into Tutor AI / NCE context.
     * @param {string} courseId 
     */
    async getHotFolderContext(courseId) {
        try {
            const hotFolderRef = collection(db, 'courses', courseId, 'hot_folder');
            const snap = await getDocs(hotFolderRef);

            let combinedText = '';
            snap.forEach(doc => {
                const data = doc.data();
                if (data.extracted_text) {
                    combinedText += `\n[Source: ${data.title}]\n${data.extracted_text}\n`;
                }
            });
            return combinedText;
        } catch (error) {
            console.error('Error fetching hot folder:', error);
            return '';
        }
    },

    /**
     * Trigger a video lecture summarization.
     * @param {string} studentId 
     * @param {string} courseId 
     * @param {string} videoUrl 
     */
    async summarizeLecture(studentId, courseId, videoUrl) {
        try {
            const lectureRef = collection(db, 'users', studentId, 'lectures');
            const docRef = await addDoc(lectureRef, {
                course_id: courseId,
                video_url: videoUrl,
                status: 'processing',
                created_at: serverTimestamp(),
                summary: null
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Error triggering lecture summarization:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Get processed lecture summaries for a student.
     * @param {string} studentId 
     * @param {string} courseId 
     */
    async getLectureSummaries(studentId, courseId) {
        try {
            const q = query(
                collection(db, 'users', studentId, 'lectures'),
                where('course_id', '==', courseId),
                orderBy('created_at', 'desc')
            );
            const snap = await getDocs(q);
            return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error getting summaries:', error);
            return [];
        }
    },

    /**
     * getSynthesisData - Fetches "Concept Collisions" and theoretical reconciliations
     * @param {string} courseId 
     */
    async getSynthesisData(courseId) {
        try {
            const q = query(
                collection(db, 'courses', courseId, 'synthesis'),
                orderBy('timestamp', 'desc')
            );
            const snap = await getDocs(q);
            return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Failed to fetch synthesis data:", error);
            return [];
        }
    }
};
