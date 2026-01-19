/**
 * StripeService.js
 * Mock service for handling Stripe payments and Connect platform simulation.
 * 
 * In a real implementation:
 * - This would interface with a backend (Node/Python) that holds the actual Stripe Secret Key.
 * - 'Connect' would be handled via OAuth flows.
 */

const STORAGE_KEYS = {
    CONFIG: 'stripe_config',
    TRANSACTIONS: 'stripe_transactions',
    SUBSCRIPTIONS: 'stripe_subscriptions',
    CONNECTED_ACCOUNTS: 'stripe_connected_accounts'
};

// Default Platform Config
const DEFAULT_CONFIG = {
    platformName: 'University School Co-op',
    currency: 'USD',
    franchiseFeePercent: 10, // 10% valid off top
    franchiseFeeFlat: 0,
    isConnected: false,
    stripePublicKey: 'pk_test_mock_university_school_123'
};

class StripeMockService {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
            localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
        }
        if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
            localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
        }
    }

    // --- Platform Configuration (Super Admin) ---

    getConfig() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG));
    }

    updateConfig(updates) {
        const current = this.getConfig();
        const next = { ...current, ...updates };
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(next));
        return next;
    }

    getPlatformStats() {
        const txs = this.getTransactions();
        const totalVolume = txs.reduce((acc, tx) => acc + tx.amount, 0);
        const platformFees = txs.reduce((acc, tx) => acc + (tx.platformFee || 0), 0);

        return {
            totalVolume,
            platformFees,
            activeFranchises: new Set(txs.map(tx => tx.franchiseId)).size
        };
    }

    // --- Franchise Payment Methods ---

    // Simulate connecting a Franchise's bank account or card
    addPaymentMethod(franchiseId, details) {
        // Mock success
        return {
            id: `pm_${Math.random().toString(36).substr(2, 9)}`,
            brand: 'Visa',
            last4: '4242',
            expMonth: 12,
            expYear: 2028,
            ...details
        };
    }

    // --- Transactions ---

    getTransactions(franchiseId = null) {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS));
        if (franchiseId) {
            return all.filter(t => t.franchiseId === franchiseId);
        }
        return all;
    }

    // Process a payment from a Student -> Franchise (with Platform Fee split)
    processStudentTuition(studentId, franchiseId, amount) {
        const config = this.getConfig();
        const fee = (amount * (config.franchiseFeePercent / 100)) + config.franchiseFeeFlat;
        const net = amount - fee;

        const tx = {
            id: `tx_${Math.random().toString(36).substr(2, 9)}`,
            date: new Date().toISOString(),
            studentId,
            franchiseId,
            description: 'Monthly Tuition',
            amount,
            platformFee: fee,
            netAmount: net,
            status: 'succeeded'
        };

        const current = this.getTransactions();
        current.unshift(tx);
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(current));

        return tx;
    }

    // Process a direct Franchise Fee payment (Auto-Pay)
    processFranchiseFee(franchiseId, amount, description = 'Franchise Royalty Fee') {
        const tx = {
            id: `tx_${Math.random().toString(36).substr(2, 9)}`,
            date: new Date().toISOString(),
            franchiseId,
            description,
            amount, // This is money LEAVING the franchise
            platformFee: amount, // All of it goes to platform
            netAmount: 0,
            status: 'succeeded',
            type: 'fee_payment'
        };

        const current = this.getTransactions();
        current.unshift(tx);
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(current));

        return tx;
    }

    // --- Demo Data ---
    seedDemoData() {
        // Generate some fake transaction history
        const now = new Date();
        const txs = [];

        for (let i = 0; i < 20; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i * 2);

            const amount = 500 + Math.floor(Math.random() * 500); // $500 - $1000
            const fee = amount * 0.10;

            txs.push({
                id: `tx_demo_${i}`,
                date: date.toISOString(),
                franchiseId: i % 2 === 0 ? 'franchise-1' : 'franchise-2',
                studentId: `student-${i}`,
                description: 'Monthly Tuition',
                amount: amount,
                platformFee: fee,
                netAmount: amount - fee,
                status: 'succeeded'
            });
        }

        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
    }
}

export const StripeService = new StripeMockService();
