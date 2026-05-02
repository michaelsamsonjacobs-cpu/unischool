/**
 * BASICSCalendarService — Google Calendar integration for BASICS meeting gates.
 *
 * Adapted from the commander_qluu sync_calendar.py pattern (OAuth 2.0 flow).
 * Two calendar-gated milestones:
 *   1. 20 Customer Discovery meetings → unlocks later course sections
 *   2. 30 Investor meetings → unlocks fundraising/raising section
 *
 * In production, this would use the Google Calendar API via a backend proxy.
 * For MVP, we track meetings locally and validate via calendar event count.
 */

const GOOGLE_CALENDAR_SCOPES = 'https://www.googleapis.com/auth/calendar.events.readonly';

// Google OAuth Client ID — configure in .env.local
const GOOGLE_CLIENT_ID = import.meta.env?.VITE_GOOGLE_CLIENT_ID || '';

class BASICSCalendarServiceClass {
    constructor() {
        this.token = null;
        this.meetings = {
            customer_discovery: [],
            investor: [],
        };
        this._loadFromStorage();
    }

    _loadFromStorage() {
        try {
            const saved = localStorage.getItem('basics_calendar_data');
            if (saved) {
                const data = JSON.parse(saved);
                this.meetings = data.meetings || this.meetings;
                this.token = data.token || null;
            }
        } catch (e) {
            console.warn('[BASICSCalendar] Failed to load from storage:', e);
        }
    }

    _saveToStorage() {
        localStorage.setItem('basics_calendar_data', JSON.stringify({
            meetings: this.meetings,
            token: this.token,
        }));
    }

    /**
     * Initiate Google OAuth flow (popup-based).
     * Returns the access token on success.
     */
    async authenticate() {
        return new Promise((resolve, reject) => {
            if (!GOOGLE_CLIENT_ID) {
                // Fallback: manual tracking mode
                console.warn('[BASICSCalendar] No Google Client ID configured. Using manual tracking mode.');
                resolve(null);
                return;
            }

            const redirectUri = `${window.location.origin}/auth/google/callback`;
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
                `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
                `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                `&response_type=token` +
                `&scope=${encodeURIComponent(GOOGLE_CALENDAR_SCOPES)}`;

            const popup = window.open(authUrl, 'google-auth', 'width=500,height=600');
            if (!popup) {
                reject(new Error('Popup blocked. Please allow popups for this site.'));
                return;
            }

            const interval = setInterval(() => {
                try {
                    if (popup.closed) {
                        clearInterval(interval);
                        reject(new Error('Auth cancelled'));
                        return;
                    }
                    const url = popup.location.href;
                    if (url.includes('access_token=')) {
                        const hash = new URL(url).hash.substring(1);
                        const params = new URLSearchParams(hash);
                        const token = params.get('access_token');
                        popup.close();
                        clearInterval(interval);
                        this.token = token;
                        this._saveToStorage();
                        resolve(token);
                    }
                } catch (e) {
                    // Cross-origin — keep polling
                }
            }, 500);
        });
    }

    /**
     * Fetch calendar events for a date range and count meetings.
     */
    async fetchCalendarEvents(timeMin, timeMax) {
        if (!this.token) {
            throw new Error('Not authenticated. Call authenticate() first.');
        }

        const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
            `timeMin=${encodeURIComponent(timeMin)}` +
            `&timeMax=${encodeURIComponent(timeMax)}` +
            `&singleEvents=true&orderBy=startTime&maxResults=100`;

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${this.token}` },
        });

        if (!res.ok) {
            throw new Error(`Calendar API error: ${res.status}`);
        }

        const data = await res.json();
        return data.items || [];
    }

    /**
     * Manually add a meeting record (for when Google Calendar isn't connected).
     */
    addManualMeeting(type, meeting) {
        if (!this.meetings[type]) this.meetings[type] = [];
        this.meetings[type].push({
            id: `manual-${Date.now()}`,
            title: meeting.title,
            date: meeting.date,
            contact: meeting.contact,
            notes: meeting.notes || '',
            addedAt: new Date().toISOString(),
        });
        this._saveToStorage();
    }

    /**
     * Remove a meeting by ID.
     */
    removeMeeting(type, meetingId) {
        if (!this.meetings[type]) return;
        this.meetings[type] = this.meetings[type].filter(m => m.id !== meetingId);
        this._saveToStorage();
    }

    /**
     * Get meeting count for a gate type.
     */
    getMeetingCount(type) {
        return (this.meetings[type] || []).length;
    }

    /**
     * Get all meetings for a gate type.
     */
    getMeetings(type) {
        return this.meetings[type] || [];
    }

    /**
     * Check if a gate is met.
     */
    isGateMet(type) {
        const required = type === 'customer_discovery' ? 20 : 30;
        return this.getMeetingCount(type) >= required;
    }

    /**
     * Get gate progress.
     */
    getGateProgress(type) {
        const required = type === 'customer_discovery' ? 20 : 30;
        const current = this.getMeetingCount(type);
        return { current, required, percent: Math.min(100, Math.round((current / required) * 100)) };
    }
}

export const BASICSCalendarService = new BASICSCalendarServiceClass();
export default BASICSCalendarService;
