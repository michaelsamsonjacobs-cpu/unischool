/**
 * CenterOpsService.js
 * Physical Center (Polo) operations — attendance tracking, schedule management,
 * and franchise-level telemetry via Firebase Firestore.
 */

import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, orderBy, serverTimestamp, getCountFromServer } from 'firebase/firestore';
import { db } from './FirebaseClient';

export const CenterOpsService = {
    /**
     * Get all centers for a franchise.
     */
    async getCenters(franchiseId) {
        const q = query(
            collection(db, 'franchises', franchiseId, 'centers'),
            where('status', '==', 'active')
        );

        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    /**
     * Get center details (merges franchise config with center overrides).
     */
    async getCenterConfig(franchiseId, centerId) {
        // In reality, UI might just pass centerId and we need to find franchiseId.
        // Assuming franchiseId is passed:
        const [centerSnap, franchiseSnap] = await Promise.all([
            getDoc(doc(db, 'franchises', franchiseId, 'centers', centerId)),
            getDoc(doc(db, 'franchises', franchiseId))
        ]);

        if (!centerSnap.exists()) throw new Error('Center not found');
        const center = centerSnap.data();
        const franchise = franchiseSnap.exists() ? franchiseSnap.data() : {};

        // Merge: center overrides take precedence over franchise defaults
        const franchiseConfig = franchise.operating_config || {};
        const centerOverride = center.operating_config_override || {};
        center.effective_config = { ...franchiseConfig, ...centerOverride };

        return { id: centerId, ...center, franchise: { id: franchiseId, name: franchise.name, operating_config: franchise.operating_config } };
    },

    /**
     * Record a student check-in at a center.
     */
    async checkIn(franchiseId, centerId, studentId, sessionType, staffId = null) {
        const attRef = doc(collection(db, 'franchises', franchiseId, 'centers', centerId, 'attendance'));

        const payload = {
            id: attRef.id,
            student_id: studentId,
            center_id: centerId,
            session_type: sessionType,
            check_in_at: serverTimestamp(),
            recorded_by: staffId,
        };

        await setDoc(attRef, payload);

        // Audit log
        await setDoc(doc(collection(db, 'audit_log')), {
            timestamp: serverTimestamp(),
            actor_id: staffId || studentId,
            action: 'attendance.check_in',
            resource_type: 'attendance',
            resource_id: attRef.id,
            center_id: centerId,
            new_data: payload,
        });

        // Resolve locally for UI immediate update
        return { ...payload, check_in_at: new Date().toISOString() };
    },

    /**
     * Record a student check-out.
     */
    async checkOut(franchiseId, centerId, attendanceId) {
        const attRef = doc(db, 'franchises', franchiseId, 'centers', centerId, 'attendance', attendanceId);
        await updateDoc(attRef, { check_out_at: serverTimestamp() });
        const updated = await getDoc(attRef);
        return { id: updated.id, ...updated.data() };
    },

    /**
     * Get attendance records for a center, filtered by date range.
     */
    async getAttendance(franchiseId, centerId, { startDate = null, endDate = null } = {}) {
        let conditions = [];
        if (startDate) conditions.push(where('check_in_at', '>=', new Date(startDate)));
        if (endDate) conditions.push(where('check_in_at', '<=', new Date(endDate)));

        let q = query(
            collection(db, 'franchises', franchiseId, 'centers', centerId, 'attendance'),
            ...conditions,
            orderBy('check_in_at', 'desc')
        );

        const snap = await getDocs(q);
        const attendanceRecords = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Hydrate student data
        return await Promise.all(attendanceRecords.map(async (att) => {
            try {
                const stuSnap = await getDoc(doc(db, 'users', att.student_id));
                const studentData = stuSnap.data();
                return { ...att, student: { id: stuSnap.id, full_name: studentData.full_name, email: studentData.email, avatar_url: studentData.avatar_url } };
            } catch (e) {
                return { ...att, student: null };
            }
        }));
    },

    /**
     * Get aggregated center telemetry (dashboard stats).
     */
    async getCenterDashboard(franchiseId, centerId) {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Today's attendance
        const todayQ = query(collection(db, 'franchises', franchiseId, 'centers', centerId, 'attendance'), where('check_in_at', '>=', todayStart));
        const todaySnap = await getCountFromServer(todayQ);

        // Weekly attendance
        const weekQ = query(collection(db, 'franchises', franchiseId, 'centers', centerId, 'attendance'), where('check_in_at', '>=', weekStart));
        const weekSnap = await getCountFromServer(weekQ);

        // Active students at this center (queries root users collection)
        const stuQ = query(collection(db, 'users'), where('center_id', '==', centerId), where('role', '==', 'student'));
        const stuSnap = await getCountFromServer(stuQ);

        // Open tickets at this center
        const ticketQ = query(collection(db, 'support_tickets'), where('center_id', '==', centerId), where('status', 'in', ['open', 'in_progress']));
        const ticketSnap = await getCountFromServer(ticketQ);

        return {
            center_id: centerId,
            today_attendance: todaySnap.data().count,
            week_attendance: weekSnap.data().count,
            total_students: stuSnap.data().count,
            open_tickets: ticketSnap.data().count,
        };
    },

    /**
     * Determine today's session type based on the center's config.
     */
    getTodaySessionType(effectiveConfig) {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = dayNames[new Date().getDay()];

        const studyHallDays = effectiveConfig?.study_hall_days || ['monday', 'wednesday', 'friday'];
        const campusDays = effectiveConfig?.campus_days || ['tuesday', 'thursday'];

        if (studyHallDays.includes(today)) return 'study_hall';
        if (campusDays.includes(today)) return 'campus_lab';
        return null; // not an operating day
    },
};

export default CenterOpsService;
