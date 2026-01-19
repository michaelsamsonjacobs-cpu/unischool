import React, { useState, useEffect } from 'react';
import {
    CreditCard, DollarSign, Wallet, ShieldCheck,
    Calendar, History, Plus
} from 'lucide-react';
import { StripeService } from '../services/StripeService';

/**
 * FranchiseBilling - Financial Dashboard for Franchise Owners
 * Set up payment methods and view payouts from students.
 */

export const FranchiseBilling = ({ franchiseId }) => {
    const [stats, setStats] = useState({ revenue: 0, feesPaid: 0 });
    const [transactions, setTransactions] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [autoPayEnabled, setAutoPayEnabled] = useState(false);

    useEffect(() => {
        // Load franchise data
        const txs = StripeService.getTransactions(franchiseId);
        setTransactions(txs);

        const rev = txs.reduce((acc, t) => acc + t.amount, 0);
        const fees = txs.reduce((acc, t) => acc + t.platformFee, 0);
        setStats({ revenue: rev, feesPaid: fees });

        // Mock loading saved state
        const savedAutoPay = localStorage.getItem(`autopay_${franchiseId}`);
        if (savedAutoPay === 'true') setAutoPayEnabled(true);
    }, [franchiseId]);

    const handleConnectStripe = () => {
        // Mock connecting a card
        const pm = StripeService.addPaymentMethod(franchiseId, {});
        setPaymentMethod(pm);
        setAutoPayEnabled(true);
        localStorage.setItem(`autopay_${franchiseId}`, 'true');
        alert('Stripe account connected successfully!');
    };

    const toggleAutoPay = () => {
        const newState = !autoPayEnabled;
        setAutoPayEnabled(newState);
        localStorage.setItem(`autopay_${franchiseId}`, String(newState));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Financials & Payments</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
                    <div className="text-slate-400 text-sm mb-1">Total Revenue</div>
                    <div className="text-2xl font-bold text-white">${stats.revenue.toLocaleString()}</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
                    <div className="text-slate-400 text-sm mb-1">Franchise Fees Paid</div>
                    <div className="text-2xl font-bold text-red-400">-${stats.feesPaid.toLocaleString()}</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
                    <div className="text-slate-400 text-sm mb-1">Net Income</div>
                    <div className="text-2xl font-bold text-emerald-400">${(stats.revenue - stats.feesPaid).toLocaleString()}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Payment Settings */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Wallet size={20} className="text-[#C9B47C]" />
                        Payment Settings
                    </h3>

                    {!paymentMethod ? (
                        <div className="text-center py-6">
                            <p className="text-slate-400 text-sm mb-4">
                                Connect your bank account to receive tuition payouts and pay franchise fees automatically.
                            </p>
                            <button
                                onClick={handleConnectStripe}
                                className="w-full py-3 bg-[#635BFF] hover:bg-[#534be0] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="font-bold">Stripe</span> Connect
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-8 bg-white rounded flex items-center justify-center">
                                        <span className="text-blue-600 font-bold font-serif italic pr-1">Visa</span>
                                    </div>
                                    <div>
                                        <div className="text-white text-sm font-medium">•••• 4242</div>
                                        <div className="text-slate-500 text-xs">Expires 12/28</div>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg border border-emerald-500/30">
                                    Active
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                                <div>
                                    <div className="text-white font-medium text-sm">Auto-Pay Fees</div>
                                    <div className="text-slate-500 text-xs">Automatically pay 10% franchise fee</div>
                                </div>
                                <button
                                    onClick={toggleAutoPay}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${autoPayEnabled ? 'bg-[#C9B47C]' : 'bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${autoPayEnabled ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Transaction History */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 lg:col-span-2">
                    <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                    <div className="overflow-auto max-h-[300px]">
                        <table className="w-full text-left">
                            <thead className="text-xs text-slate-500 border-b border-slate-700">
                                <tr>
                                    <th className="pb-2">Date</th>
                                    <th className="pb-2">Description</th>
                                    <th className="pb-2 text-right">Amount</th>
                                    <th className="pb-2 text-right">Fee</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {transactions.map(tx => (
                                    <tr key={tx.id} className="border-b border-slate-700/50 last:border-0">
                                        <td className="py-3 text-slate-400">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className="py-3 text-white">{tx.description}</td>
                                        <td className="py-3 text-right text-emerald-400">+${tx.amount}</td>
                                        <td className="py-3 text-right text-red-400">-${tx.platformFee}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
