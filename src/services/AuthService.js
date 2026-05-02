/**
 * AuthService.js
 * Firebase Authentication Service for University School.
 * Replaces the legacy MagicLinkService.js and Supabase Auth.
 * 
 * Implements Email Link (passwordless) and Google Sign-In,
 * resolving user roles from Firebase Custom Claims.
 */

import {
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './FirebaseClient';

// Shared Role Definitions
export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    FRANCHISE_OWNER: 'franchise_owner',
    CENTER_STAFF: 'center_staff',
    FACILITATOR: 'facilitator',
    GUIDANCE_COUNSELOR: 'guidance_counselor',
    PARENT: 'parent',
    STUDENT: 'student',
};

export const ROLE_LABELS = {
    [ROLES.SUPER_ADMIN]: 'System Administrator',
    [ROLES.FRANCHISE_OWNER]: 'Franchise Owner',
    [ROLES.CENTER_STAFF]: 'Center Staff',
    [ROLES.FACILITATOR]: 'Academic Facilitator',
    [ROLES.GUIDANCE_COUNSELOR]: 'Guidance Counselor',
    [ROLES.PARENT]: 'Parent/Guardian',
    [ROLES.STUDENT]: 'Student',
};

// Configuration for Email Links
const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: typeof window !== 'undefined' ? window.location.origin + '/auth/verify' : 'http://localhost:5173/auth/verify',
    // This must be true for email link sign-in.
    handleCodeInApp: true,
};

class FirebaseAuthService {
    constructor() {
        this.googleProvider = new GoogleAuthProvider();
        this.currentUser = null;
        this.currentProfile = null; // Enriched Firestore profile
        this.authListeners = new Set();

        // Setup persistent listener
        onAuthStateChanged(auth, async (user) => {
            this.currentUser = user;
            if (user) {
                this.currentProfile = await this.enrichUserProfile(user);
            } else {
                this.currentProfile = null;
            }
            this.notifyListeners(this.currentProfile);
        });
    }

    /**
     * Subscribe to authentication state changes.
     */
    onAuthStateChanged(callback) {
        this.authListeners.add(callback);
        // Fire immediately with current state
        callback(this.currentProfile);
        return () => this.authListeners.delete(callback);
    }

    notifyListeners(profile) {
        for (const listener of this.authListeners) {
            listener(profile);
        }
    }

    /**
     * Fetches the user profile from Firestore, creating defaults if missing.
     * Maps Firebase Custom Claims for RBAC.
     */
    async enrichUserProfile(firebaseUser) {
        try {
            // 1. Get custom claims from ID Token
            const tokenResult = await firebaseUser.getIdTokenResult();
            const claims = tokenResult.claims;

            // 2. Fetch extended profile from Firestore
            const userRef = doc(db, 'users', firebaseUser.uid);
            const userSnap = await getDoc(userRef);

            let firestoreData = {};
            if (userSnap.exists()) {
                firestoreData = userSnap.data();
            } else {
                // First-time fallback (Cloud Function normally handles this)
                firestoreData = {
                    email: firebaseUser.email,
                    full_name: firebaseUser.displayName || '',
                    role: ROLES.STUDENT,
                    onboarding_complete: false,
                    created_at: serverTimestamp()
                };
            }

            // 3. Merge Firebase Native + Custom Claims + Firestore Data
            return {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                name: firestoreData.full_name || firebaseUser.displayName || 'User',
                avatar_url: firebaseUser.photoURL || null,
                // Claims take precedence for security-critical attributes
                role: claims.role || firestoreData.role || ROLES.STUDENT,
                franchiseId: claims.franchise_id || firestoreData.franchise_id || null,
                centerId: claims.center_id || firestoreData.center_id || null,
                // App state attributes
                onboardingComplete: firestoreData.onboarding_complete || false,
                surveyData: firestoreData.survey_data || null,
            };
        } catch (error) {
            console.error("Error enriching user profile:", error);
            // Fallback for extreme offline scenarios
            return {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || 'User',
                role: ROLES.STUDENT
            };
        }
    }

    /**
     * Sends a passwordless login link to the user's email.
     */
    async requestMagicLink(email) {
        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            window.localStorage.setItem('emailForSignIn', email);
            return { success: true };
        } catch (error) {
            console.error("Error sending magical link:", error);
            return { error: error.message };
        }
    }

    /**
     * Completes the login process when the user clicks the magic link.
     */
    async verifyMagicLink(url) {
        if (isSignInWithEmailLink(auth, url)) {
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                // User opened the link on a different device. Prompt for email.
                email = window.prompt('Please provide your email for confirmation');
            }

            try {
                const result = await signInWithEmailLink(auth, email, url);
                window.localStorage.removeItem('emailForSignIn');
                const profile = await this.enrichUserProfile(result.user);
                return { user: profile, isNewUser: result.additionalUserInfo?.isNewUser };
            } catch (error) {
                console.error("Error signing in with link:", error);
                return { error: error.message };
            }
        }
        return { error: 'Invalid magic link URL.' };
    }

    /**
     * Authenticate via Google popup.
     */
    async signInWithGoogle() {
        try {
            const result = await signInWithPopup(auth, this.googleProvider);
            const profile = await this.enrichUserProfile(result.user);
            return { user: profile, isNewUser: result.additionalUserInfo?.isNewUser };
        } catch (error) {
            console.error("Error signing in with Google:", error);
            return { error: error.message };
        }
    }

    /**
     * Gets the current, enriched user immediately (if loaded).
     */
    getCurrentUser() {
        return this.currentProfile;
    }

    /**
     * Sign out the current user.
     */
    async logout() {
        try {
            await signOut(auth);
            this.currentProfile = null;
        } catch (error) {
            console.error("Logout error:", error);
        }
    }

    /**
     * Update user profile data in Firestore (not claims).
     */
    async updateUser(uid, updates) {
        try {
            const userRef = doc(db, 'users', uid);
            await setDoc(userRef, {
                ...updates,
                updated_at: serverTimestamp()
            }, { merge: true });

            // Refresh local state if updating self
            if (this.currentUser && this.currentUser.uid === uid) {
                this.currentProfile = { ...this.currentProfile, ...updates };
                this.notifyListeners(this.currentProfile);
                return this.currentProfile;
            }
            return true;
        } catch (error) {
            console.error("Error updating user:", error);
            return false;
        }
    }
}

export const AuthService = new FirebaseAuthService();
