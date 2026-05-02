/**
 * FirebaseClient.js
 * Central Firebase initialization module.
 * Replaces SupabaseClient.js as the single source of truth for backend connectivity.
 *
 * All Firebase services (Auth, Firestore, Functions) are initialized here
 * and exported for consumption by other service modules.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import {
    getFirestore,
    connectFirestoreEmulator,
    enableIndexedDbPersistence,
} from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// ---------------------------------------------------------------------------
// 1. Configuration — pulled from Vite env variables
// ---------------------------------------------------------------------------
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Guard: warn if credentials are missing (dev without a Firebase project)
const isConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

if (!isConfigured) {
    console.warn(
        '⚠️ Firebase credentials not configured.\n' +
        'Set VITE_FIREBASE_* variables in your .env.local file.\n' +
        'Auth and data services will operate in mock/offline mode.'
    );
}

// ---------------------------------------------------------------------------
// 2. Initialize Firebase App
// ---------------------------------------------------------------------------
const app = isConfigured
    ? initializeApp(firebaseConfig)
    : initializeApp({ apiKey: 'demo-key', projectId: 'demo-unischool' });

// ---------------------------------------------------------------------------
// 3. Auth
// ---------------------------------------------------------------------------
export const auth = getAuth(app);

// ---------------------------------------------------------------------------
// 4. Firestore
// ---------------------------------------------------------------------------
export const db = getFirestore(app);

// Enable offline persistence for physical centers with spotty connectivity.
// This caches Firestore data locally in IndexedDB so reads work without internet.
if (isConfigured) {
    enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
            // Multiple tabs open — persistence can only be enabled in one tab at a time
            console.warn('Firestore persistence failed: multiple tabs open.');
        } else if (err.code === 'unimplemented') {
            // Browser does not support IndexedDB persistence
            console.warn('Firestore persistence not supported in this browser.');
        }
    });
}

// ---------------------------------------------------------------------------
// 5. Cloud Functions
// ---------------------------------------------------------------------------
export const functions = getFunctions(app);

// ---------------------------------------------------------------------------
// 6. Emulator Support (local development)
// ---------------------------------------------------------------------------
const USE_EMULATORS = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';

if (USE_EMULATORS) {
    console.log('🔧 Connecting to Firebase Emulators...');
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectFunctionsEmulator(functions, 'localhost', 5001);
}

// ---------------------------------------------------------------------------
// 7. Utility Exports
// ---------------------------------------------------------------------------

/** Check if Firebase is properly configured for live operations. */
export const isFirebaseLive = () => isConfigured && !USE_EMULATORS;

/** Check if we are running against local emulators. */
export const isEmulatorMode = () => USE_EMULATORS;

export default app;
