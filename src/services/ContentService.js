/**
 * ContentService.js
 * 
 * Manages fetching of curriculum content (Quests, Assignments, Resources).
 * In production, this would connect to a Headless CMS (Contentful, Sanity) 
 * or a GitHub Repository to fetch standard JSON/Markdown course content.
 */

import mockCurriculum from '../data/curriculum.json';

// Simulate network delay
const DELAY_MS = 800;

export const ContentService = {
    /**
     * Fetch all available quests
     */
    async getQuests() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockCurriculum.quests);
            }, DELAY_MS);
        });
    },

    /**
     * Fetch a specific quest by ID
     */
    async getQuestById(questId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const quest = mockCurriculum.quests.find(q => q.id === questId);
                if (quest) {
                    resolve(quest);
                } else {
                    reject(new Error('Quest not found'));
                }
            }, DELAY_MS);
        });
    },

    /**
     * Parse formatting of external resources
     * (Helper to identify if it's a GDoc, YouTube, etc)
     */
    getResourceType(url) {
        if (url.includes('docs.google.com')) return 'google-doc';
        if (url.includes('youtube.com') || url.includes('youtu.be')) return 'video';
        if (url.includes('pdf')) return 'pdf';
        return 'link';
    }
};
