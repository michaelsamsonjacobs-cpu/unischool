const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Triggered on user creation in Firebase Auth.
 * Automatically provisions the user document in Firestore and sets default Custom Claims.
 */
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
    const db = admin.firestore();
    const uid = user.uid;
    const email = user.email || '';

    // Determine initial role (e.g., from email domain or metadata if provided during creation)
    // For demo purposes, we'll default to 'student' unless it's a specific admin email.
    let role = 'student';
    if (email.endsWith('@unischool.edu') || email === 'admin@unischool.edu') {
        role = 'super_admin';
    } else if (email.includes('owner')) {
        role = 'franchise_owner';
    } else if (email.includes('parent')) {
        role = 'parent';
    } else if (email.includes('advisor')) {
        role = 'advisor';
    } else if (email.includes('mentor')) {
        role = 'mentor';
    }

    try {
        // 1. Set Custom Claims for RBAC
        await admin.auth().setCustomUserClaims(uid, { role });
        console.log(`Successfully set custom claim role=${role} for user ${uid}`);

        // 2. Create stub document in Firestore Users collection
        const userDocRef = db.collection('users').doc(uid);

        // We only create if it doesn't already exist (in case client-side pre-created it)
        const docSnap = await userDocRef.get();
        if (!docSnap.exists) {
            await userDocRef.set({
                id: uid,
                email: email,
                full_name: user.displayName || email.split('@')[0],
                role: role,
                franchise_id: 'franchise-1', // Default franchise for beta
                status: 'active',
                onboarding_complete: false,
                created_at: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`Created user document for ${uid} in Firestore.`);
        } else {
            // Update the role just to be sure it matches claims
            await userDocRef.update({ role });
            console.log(`Updated user document role for ${uid} in Firestore.`);
        }

    } catch (error) {
        console.error(`Error provisioning new user ${uid}:`, error);
    }
});
