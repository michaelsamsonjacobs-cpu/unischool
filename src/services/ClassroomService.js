import { collection, doc, getDoc, getDocs, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './FirebaseClient';

/**
 * ClassroomService - Manages Sovereign Classroom data operations via Firestore
 */
export const ClassroomService = {
    // Get stored classroom path (local for this device context)
    getClassroomPath() {
        return localStorage.getItem('springroll_classroom_path') || null;
    },

    setClassroomPath(path) {
        localStorage.setItem('springroll_classroom_path', path);
    },

    /**
     * Fetch all students (from Firestore users collection with role=student)
     */
    async getStudents() {
        const q = collection(db, 'users');
        const snap = await getDocs(q); // In production, filter by franchise or role
        return snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(u => u.role === 'student')
            .map(u => ({
                id: u.id,
                name: u.full_name || u.name,
                folder: u.full_name?.replace(/\s+/g, '_') || u.id,
                files: 0,
                progress: u.onboarding_complete ? 100 : 25,
                lastActivity: 'Active'
            }));
    },

    // Mock: Get recent activity (in real app, this would be a Firestore collection)
    async getRecentActivity() {
        return [
            { type: 'upload', student: 'Alice Smith', file: 'FinalDraft.docx', time: '2 min ago' },
            { type: 'feedback', student: 'Bob Jones', file: 'Draft1.docx', time: '1 hr ago' },
        ];
    },

    /**
     * Save feedback for a student
     */
    async saveFeedback(studentId, content, author = 'Admin') {
        const feedbackRef = collection(db, 'users', studentId, 'feedback');
        await addDoc(feedbackRef, {
            content,
            author,
            date: serverTimestamp()
        });
        return true;
    },

    /**
     * Get feedback history for a student
     */
    async getFeedback(studentId) {
        const feedbackRef = collection(db, 'users', studentId, 'feedback');
        const snap = await getDocs(feedbackRef);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    // Clear team mode
    exitTeamMode() {
        localStorage.removeItem('springroll_classroom_path');
        localStorage.removeItem('springroll_role');
        localStorage.removeItem('springroll_student_name');
    }
};

export default ClassroomService;
