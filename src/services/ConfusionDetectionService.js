/**
 * ConfusionDetectionService - Monitors video player events to detect student confusion.
 * This service tracks seek/rewind actions and duration spent on segments.
 */
export const ConfusionDetectionService = {
    // Thresholds for confusion detection
    REWIND_THRESHOLD: 3, // Number of rewinds in a short period
    TIME_WINDOW: 60000, // 1 minute window for tracking rewinds

    rewindLog: [],

    /**
     * trackRewind - Logs a rewind event and checks if it triggers a "confusion" status
     * @param {string} studentId 
     * @param {string} lectureId 
     * @param {number} timestamp - The video time where the rewind occurred
     */
    trackRewind(studentId, lectureId, timestamp) {
        const now = Date.now();
        this.rewindLog.push({ studentId, lectureId, timestamp, realTime: now });

        // Cleanup old logs
        this.rewindLog = this.rewindLog.filter(log => now - log.realTime < this.TIME_WINDOW);

        // Check if thresholds met
        const recentRewinds = this.rewindLog.filter(log =>
            log.studentId === studentId && log.lectureId === lectureId
        );

        if (recentRewinds.length >= this.REWIND_THRESHOLD) {
            console.warn(`Confusion detected for student ${studentId} on lecture ${lectureId} at ${timestamp}s`);
            this.triggerConfusionAlert(studentId, lectureId, timestamp);
            return true;
        }
        return false;
    },

    /**
     * triggerConfusionAlert - Fires an event or notifies the Tutor AI to be proactive
     */
    triggerConfusionAlert(studentId, lectureId, timestamp) {
        const event = new CustomEvent('concept-confusion', {
            detail: { studentId, lectureId, timestamp, message: "Would you like me to explain this part in a different way?" }
        });
        window.dispatchEvent(event);
    }
};
