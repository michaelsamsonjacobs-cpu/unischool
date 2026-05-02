import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from './FirebaseClient';

const COLLECTION_NAME = 'file_annotations';

export const AnnotationService = {
    /**
     * Get all annotations
     */
    async getAll() {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    /**
     * Get annotations for a specific file
     */
    async getForFile(filePath) {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('filePath', '==', filePath),
            orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    /**
     * Add new annotation
     */
    async add(filePath, text, userId = 'admin') {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            filePath,
            text,
            userId,
            createdAt: serverTimestamp()
        });
        return {
            id: docRef.id,
            filePath,
            text,
            userId,
            createdAt: new Date().toISOString()
        };
    },

    /**
     * Update annotation
     */
    async update(id, text) {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            text,
            updatedAt: serverTimestamp()
        });
    },

    /**
     * Delete annotation
     */
    async delete(id) {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    },

    /**
     * Get files with annotations (for badges)
     */
    async getFilesWithAnnotations() {
        const all = await this.getAll();
        return [...new Set(all.map(a => a.filePath))];
    },

    /**
     * Count annotations per file
     */
    async countByFile() {
        const all = await this.getAll();
        const counts = {};
        all.forEach(a => {
            counts[a.filePath] = (counts[a.filePath] || 0) + 1;
        });
        return counts;
    }
};

export default AnnotationService;
