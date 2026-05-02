import { collection, query, where, getDocs, addDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from './FirebaseClient';
import { getFunctions, httpsCallable } from 'firebase/functions';

/**
 * StripeService.js
 * Integrated with Firebase Firestore and Cloud Functions.
 */

const TRANSACTIONS_COLLECTION = 'transactions';
const CONFIG_DOC = 'platform_settings/stripe_config';

class StripeServiceClass {
    /**
     * Fetch platform configuration from Firestore
     */
    async getConfig() {
        const docRef = doc(db, 'settings', 'stripe_config');
        const snap = await getDoc(docRef);
        return snap.exists() ? snap.data() : {
            platformName: 'University School Co-op',
            currency: 'USD',
            franchiseFeePercent: 10,
            isConnected: true
        };
    }

    /**
     * Get transaction history for a specific franchise or student
     */
    async getTransactions(franchiseId = null, studentId = null) {
        let q = collection(db, TRANSACTIONS_COLLECTION);
        const conditions = [];

        if (franchiseId) conditions.push(where('franchiseId', '==', franchiseId));
        if (studentId) conditions.push(where('studentId', '==', studentId));

        const finalQuery = query(q, ...conditions, orderBy('date', 'desc'));
        const snap = await getDocs(finalQuery);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }

    /**
     * Triggers a tuition payment from a student to a franchise.
     * In production, this would call a Cloud Function that interfaces with Stripe.
     */
    async processStudentTuition(studentId, franchiseId, amount) {
        const functions = getFunctions();
        const processPayment = httpsCallable(functions, 'stripe-processPayment');

        try {
            // For now, we simulate the Cloud Function response OR simply write to Firestore
            // if we are bypassing actual Stripe API for beta.
            const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
                date: serverTimestamp(),
                studentId,
                franchiseId,
                description: 'Monthly Tuition',
                amount,
                status: 'succeeded'
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Payment processing failed:', error);
            throw error;
        }
    }

    /**
     * Logic for franchise fee pay-outs
     */
    async processFranchiseFee(franchiseId, amount, description = 'Franchise Royalty Fee') {
        return addDoc(collection(db, TRANSACTIONS_COLLECTION), {
            date: serverTimestamp(),
            franchiseId,
            description,
            amount,
            type: 'fee_payment',
            status: 'succeeded'
        });
    }
}

export const StripeService = new StripeServiceClass();
export default StripeService;
