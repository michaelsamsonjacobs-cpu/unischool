/**
 * MissionStore.js
 * Persistence layer for generated XP missions.
 *
 * Storage strategy:
 *   - Primary: localStorage (offline-first, instant access)
 *   - Secondary: Supabase missions table (sync when online)
 *   - Export: JSON files for sharing between franchise locations
 *
 * Manages mission lifecycle:
 *   draft → review → published → archived
 */

const STORAGE_KEY = 'xp_missions';
const INDEX_KEY = 'xp_missions_index';

// ── Core CRUD ───────────────────────────────────────────────────────────

/**
 * Save a mission to the local store.
 *
 * @param {Object} mission - Full mission package (course + chapter + narrative)
 * @param {Object} options - { overwrite: bool }
 * @returns {Object} Saved mission with metadata
 */
export function saveMission(mission, options = {}) {
    const index = getIndex();
    const narrativeId = mission.narrative?.id || `xp_${Date.now()}`;

    const entry = {
        id: narrativeId,
        title: mission.narrative?.title || mission.chapter?.title || 'Untitled',
        subtitle: mission.narrative?.subtitle || '',
        courseId: mission.course?.id || '',
        courseTitle: mission.course?.title || '',
        nodeCount: mission.narrative?.total_nodes || mission.narrative?.nodes?.length || 0,
        estimatedPlayTime: mission.narrative?.estimated_play_time || '',
        status: 'draft', // draft | review | published | archived
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
    };

    // Check for existing
    const existingIdx = index.findIndex(e => e.id === narrativeId);
    if (existingIdx >= 0) {
        if (!options.overwrite) {
            // Auto-version
            entry.version = (index[existingIdx].version || 1) + 1;
            entry.id = `${narrativeId}_v${entry.version}`;
        } else {
            entry.version = (index[existingIdx].version || 1) + 1;
            entry.updatedAt = new Date().toISOString();
            entry.createdAt = index[existingIdx].createdAt;
            index[existingIdx] = entry;
        }
    }

    if (existingIdx < 0 || !options.overwrite) {
        index.push(entry);
    }

    // Store mission data
    try {
        localStorage.setItem(`${STORAGE_KEY}_${entry.id}`, JSON.stringify(mission));
        localStorage.setItem(INDEX_KEY, JSON.stringify(index));
    } catch (e) {
        console.error('[MissionStore] Storage failed:', e.message);
        // If quota exceeded, try to evict archived missions
        if (e.name === 'QuotaExceededError') {
            evictArchived();
            localStorage.setItem(`${STORAGE_KEY}_${entry.id}`, JSON.stringify(mission));
            localStorage.setItem(INDEX_KEY, JSON.stringify(index));
        }
    }

    console.log(`[MissionStore] Saved: "${entry.title}" (${entry.id}, v${entry.version}, ${entry.nodeCount} nodes)`);
    return entry;
}

/**
 * Load a mission by ID.
 *
 * @param {string} missionId - Narrative ID
 * @returns {Object|null} Full mission package or null
 */
export function loadMission(missionId) {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${missionId}`);
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        console.error(`[MissionStore] Failed to parse mission: ${missionId}`);
        return null;
    }
}

/**
 * Delete a mission by ID.
 *
 * @param {string} missionId - Narrative ID
 */
export function deleteMission(missionId) {
    localStorage.removeItem(`${STORAGE_KEY}_${missionId}`);
    const index = getIndex().filter(e => e.id !== missionId);
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
    console.log(`[MissionStore] Deleted: ${missionId}`);
}

/**
 * Get the mission index (metadata for all stored missions).
 *
 * @returns {Object[]} Array of mission metadata entries
 */
export function getIndex() {
    try {
        const raw = localStorage.getItem(INDEX_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

/**
 * List all missions, optionally filtered by status.
 *
 * @param {string} status - Filter by status (null for all)
 * @returns {Object[]} Sorted by updatedAt descending
 */
export function listMissions(status = null) {
    let entries = getIndex();
    if (status) {
        entries = entries.filter(e => e.status === status);
    }
    return entries.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

// ── Status Management ───────────────────────────────────────────────────

/**
 * Update a mission's status.
 *
 * @param {string} missionId - Narrative ID
 * @param {string} newStatus - draft | review | published | archived
 */
export function updateStatus(missionId, newStatus) {
    const validStatuses = ['draft', 'review', 'published', 'archived'];
    if (!validStatuses.includes(newStatus)) {
        throw new Error(`Invalid status: ${newStatus}. Valid: ${validStatuses.join(', ')}`);
    }

    const index = getIndex();
    const entry = index.find(e => e.id === missionId);
    if (!entry) throw new Error(`Mission not found: ${missionId}`);

    entry.status = newStatus;
    entry.updatedAt = new Date().toISOString();
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));

    console.log(`[MissionStore] Status updated: ${missionId} → ${newStatus}`);
}

/**
 * Publish a mission (make it available to students).
 */
export function publishMission(missionId) {
    updateStatus(missionId, 'published');
}

/**
 * Archive a mission (soft delete).
 */
export function archiveMission(missionId) {
    updateStatus(missionId, 'archived');
}

// ── Export / Import ─────────────────────────────────────────────────────

/**
 * Export a mission as a downloadable JSON file.
 *
 * @param {string} missionId - Narrative ID
 */
export function exportMission(missionId) {
    const mission = loadMission(missionId);
    if (!mission) throw new Error(`Mission not found: ${missionId}`);

    const blob = new Blob([JSON.stringify(mission, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${missionId}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log(`[MissionStore] Exported: ${missionId}`);
}

/**
 * Import a mission from a JSON file.
 *
 * @param {File} file - JSON file
 * @returns {Promise<Object>} Imported mission metadata
 */
export async function importMission(file) {
    const text = await file.text();
    const mission = JSON.parse(text);

    if (!mission.narrative?.nodes) {
        throw new Error('Invalid mission file: missing narrative.nodes');
    }

    return saveMission(mission);
}

// ── Published Missions (for student access) ─────────────────────────────

/**
 * Get all published missions available for students.
 *
 * @returns {Object[]} Published mission metadata
 */
export function getPublishedMissions() {
    return listMissions('published');
}

/**
 * Load a published mission for student playback.
 *
 * @param {string} missionId - Narrative ID
 * @returns {Object|null} Mission package or null if not published
 */
export function loadPublishedMission(missionId) {
    const index = getIndex();
    const entry = index.find(e => e.id === missionId);
    if (!entry || entry.status !== 'published') return null;
    return loadMission(missionId);
}

// ── Storage Utilities ───────────────────────────────────────────────────

/**
 * Get storage usage stats.
 */
export function getStorageStats() {
    const index = getIndex();
    let totalBytes = 0;

    index.forEach(entry => {
        const raw = localStorage.getItem(`${STORAGE_KEY}_${entry.id}`);
        if (raw) totalBytes += raw.length * 2; // rough UTF-16 estimate
    });

    return {
        missionCount: index.length,
        publishedCount: index.filter(e => e.status === 'published').length,
        draftCount: index.filter(e => e.status === 'draft').length,
        archivedCount: index.filter(e => e.status === 'archived').length,
        totalBytes,
        totalMB: (totalBytes / (1024 * 1024)).toFixed(2),
        estimatedCapacity: '5 MB (localStorage)',
    };
}

/**
 * Evict archived missions to free storage space.
 */
function evictArchived() {
    const index = getIndex();
    const archived = index.filter(e => e.status === 'archived');

    archived.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));

    // Remove oldest half of archived
    const toRemove = archived.slice(0, Math.ceil(archived.length / 2));
    toRemove.forEach(entry => {
        localStorage.removeItem(`${STORAGE_KEY}_${entry.id}`);
    });

    const newIndex = index.filter(e => !toRemove.find(r => r.id === e.id));
    localStorage.setItem(INDEX_KEY, JSON.stringify(newIndex));

    console.log(`[MissionStore] Evicted ${toRemove.length} archived missions`);
}

/**
 * Clear all missions (USE WITH CAUTION).
 */
export function clearAll() {
    const index = getIndex();
    index.forEach(entry => {
        localStorage.removeItem(`${STORAGE_KEY}_${entry.id}`);
    });
    localStorage.removeItem(INDEX_KEY);
    console.log('[MissionStore] All missions cleared');
}

export default {
    saveMission,
    loadMission,
    deleteMission,
    listMissions,
    getIndex,
    updateStatus,
    publishMission,
    archiveMission,
    exportMission,
    importMission,
    getPublishedMissions,
    loadPublishedMission,
    getStorageStats,
    clearAll,
};
