/**
 * MagicLinkService - Hybrid Auth (Real Supabase + Mock Fallback)
 * 
 * If VITE_SUPABASE_URL is present, it uses real Supabase Auth.
 * Otherwise, it falls back to the localStorage simulation for development.
 */

import { supabase } from './SupabaseClient';

const STORAGE_KEYS = {
    pendingMagicLink: 'unischool_pending_magic_link',
    users: 'unischool_users',
    sessions: 'unischool_sessions',
};

// Check if we are in "Real Mode"
const IS_REAL_MODE = !!import.meta.env.VITE_SUPABASE_URL;

// --- Mock Helpers (Legacy) ---
const getMockUsers = () => {
    const saved = localStorage.getItem(STORAGE_KEYS.users);
    return saved ? JSON.parse(saved) : [];
};

const saveMockUsers = (users) => {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
};

// Role hierarchy (Shared)
export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    FRANCHISE_OWNER: 'franchise_owner',
    FACILITATOR: 'facilitator',
    PARENT: 'parent',
    STUDENT: 'student',
};

export const ROLE_LABELS = {
    [ROLES.SUPER_ADMIN]: 'Super Admin',
    [ROLES.FRANCHISE_OWNER]: 'Franchise Owner',
    [ROLES.FACILITATOR]: 'Academic Facilitator',
    [ROLES.PARENT]: 'Parent/Guardian',
    [ROLES.STUDENT]: 'Student',
};

// Role permissions
export const PERMISSIONS = {
    [ROLES.SUPER_ADMIN]: ['manage_franchises', 'manage_facilitators', 'view_all_students', 'system_config'],
    [ROLES.FRANCHISE_OWNER]: ['manage_students', 'manage_parents', 'view_franchise_analytics', 'onboard_students'],
    [ROLES.FACILITATOR]: ['view_students', 'approve_transfers', 'modify_matrix', 'message_parents'],
    [ROLES.PARENT]: ['view_child_progress', 'approve_major', 'message_facilitator'],
    [ROLES.STUDENT]: ['view_quests', 'chat_navigator', 'view_matrix'],
};

export const MagicLinkService = {
    /**
     * Request a magic link
     */
    async requestMagicLink(email) {
        if (IS_REAL_MODE) {
            // Real Supabase Auth
            const { error } = await supabase.auth.signInWithOtp({
                email: email.trim(),
                options: {
                    emailRedirectTo: window.location.origin,
                },
            });

            if (error) return { success: false, error: error.message };
            return { success: true };
        } else {
            // Mock Auth
            const token = crypto.randomUUID();
            const expiresAt = Date.now() + 15 * 60 * 1000;
            const pending = {
                email: email.toLowerCase().trim(),
                token,
                expiresAt,
                createdAt: Date.now(),
            };
            localStorage.setItem(STORAGE_KEYS.pendingMagicLink, JSON.stringify(pending));
            console.log(`[MagicLink] Demo token for ${email}: ${token}`);
            return { success: true, demoToken: token };
        }
    },

    /**
     * Verify a magic link token (Mock only - Supabase handles this via URL hash)
     */
    async verifyMagicLink(token) {
        if (IS_REAL_MODE) {
            // Supabase handles this automatically on page load via onAuthStateChange
            // This function might not be needed for Supabase flow directly
            return { success: false, error: "Use handleCallback for Real Mode" };
        }

        // Mock Logic
        const pendingData = localStorage.getItem(STORAGE_KEYS.pendingMagicLink);
        if (!pendingData) return { success: false, error: 'No pending magic link found' };

        const pending = JSON.parse(pendingData);
        if (pending.token !== token) return { success: false, error: 'Invalid token' };

        let users = getMockUsers();
        let user = users.find(u => u.email === pending.email);

        if (!user) {
            user = {
                id: crypto.randomUUID(),
                email: pending.email,
                name: pending.email.split('@')[0],
                role: ROLES.STUDENT,
                createdAt: Date.now(),
                onboardingComplete: false,
                franchiseId: null,
                parentId: null,
                childIds: [],
            };
            users.push(user);
            saveMockUsers(users);
        }

        localStorage.removeItem(STORAGE_KEYS.pendingMagicLink);

        const session = {
            userId: user.id,
            token: crypto.randomUUID(),
            createdAt: Date.now(),
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };
        localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(session));

        return { success: true, user, isNewUser: !user.onboardingComplete };

    },

    /**
     * Get current session user
     */
    async getCurrentUser() {
        if (IS_REAL_MODE) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            // Fetch generic profile data (role, name) from 'profiles' table
            // Only if you have a profiles table set up
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            return { ...user, ...profile };
        }

        const sessionData = localStorage.getItem(STORAGE_KEYS.sessions);
        if (!sessionData) return null;

        const session = JSON.parse(sessionData);
        if (Date.now() > session.expiresAt) {
            localStorage.removeItem(STORAGE_KEYS.sessions);
            return null;
        }

        const users = getMockUsers();
        return users.find(u => u.id === session.userId) || null;
    },

    /**
     * Logout
     */
    async logout() {
        if (IS_REAL_MODE) {
            await supabase.auth.signOut();
        } else {
            localStorage.removeItem(STORAGE_KEYS.sessions);
        }
    },

    /**
     * Seed Demo Data (Mock Only)
     */
    seedDemoData() {
        if (IS_REAL_MODE) {
            console.log("Skipping demo seed in Real Mode");
            return;
        }

        const users = [
            {
                id: 'admin-1',
                email: 'admin@unischool.edu',
                name: 'Berkeley Admin',
                role: ROLES.SUPER_ADMIN,
                createdAt: Date.now(),
                onboardingComplete: true,
            },
            {
                id: 'franchise-1',
                email: 'owner@bayarea-unischool.com',
                name: 'Bay Area Franchise',
                role: ROLES.FRANCHISE_OWNER,
                createdAt: Date.now(),
                onboardingComplete: true,
                franchiseId: 'franchise-1',
            },
            {
                id: 'facilitator-1',
                email: 'advisor@berkeley.edu',
                name: 'Dr. Sarah Chen',
                role: ROLES.FACILITATOR,
                createdAt: Date.now(),
                onboardingComplete: true,
            },
            {
                id: 'parent-1',
                email: 'parent@example.com',
                name: 'John Smith',
                role: ROLES.PARENT,
                createdAt: Date.now(),
                onboardingComplete: true,
                childIds: ['student-1'],
            },
            {
                id: 'student-1',
                email: 'student@example.com',
                name: 'Alex Smith',
                role: ROLES.STUDENT,
                createdAt: Date.now(),
                onboardingComplete: true,
                parentId: 'parent-1',
                franchiseId: 'franchise-1',
            },
        ];

        saveMockUsers(users);
        console.log('[MagicLink] Mock data seeded');
    }
};

export default MagicLinkService;
