import React, { useState, useEffect } from 'react';
import {
    CreditCard, DollarSign, Activity, Settings,
    CheckCircle, AlertCircle, Shield, Building,
    Download, TrendingUp
} from 'lucide-react';
import { StripeService } from '../services/StripeService';

/**
 * SuperAdminBilling - Configuration for the Platform's Financials
 * Allows setting franchise fees and viewing network-wide revenue.
 */

export const SuperAdminBilling = () => {
    const [config, setConfig] = useState(StripeService.getConfig());
    const [stats, setStats] = useState({ totalVolume: 0, platformFees: 0, activeFranchises: 0 });
    const [transactions, setTransactions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [tempConfig, setTempConfig] = useState({});

    useEffect(() => {
        // Load info
        refreshData();
    }, []);

    const refreshData = () => {
        setConfig(StripeService.getConfig());
        setStats(StripeService.getPlatformStats());
        setTransactions(StripeService.getTransactions());
    };

    const handleEdit = () => {
        setTempConfig({ ...config });
        setIsEditing(true);
    };

    const handleSave = () => {
        StripeService.updateConfig(tempConfig);
        setIsEditing(false);
        refreshData();
    };

    const handleSeed = () => {
        StripeService.seedDemoData();
        refreshData();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Platform Financials</h2>
                <p className="text-slate-400">Manage franchise fees and view network revenue via Stripe Connect.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <DollarSign size={20} className="text-emerald-400" />
                        </div>
                        <span className="text-slate-400 font-medium">Total Network Volume</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                        ${stats.totalVolume.toLocaleString()}
                    </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-[#8B2332]/20 flex items-center justify-center">
                            <Building size={20} className="text-[#8B2332]" />
                        </div>
                        <span className="text-slate-400 font-medium">Platform Revenue (Fees)</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                        ${stats.platformFees.toLocaleString()}
                    </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Activity size={20} className="text-blue-400" />
                        </div>
                        <span className="text-slate-400 font-medium">Active Franchises</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {stats.activeFranchises}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Fee Configuration */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 lg:col-span-1">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Settings size={20} className="text-slate-400" />
                            Fee Structure
                        </h3>
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="text-sm text-[#C9B47C] hover:text-[#b09b63]"
                            >
                                Edit
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => setIsEditing(false)} className="text-sm text-slate-400">Cancel</button>
                                <button onClick={handleSave} className="text-sm text-emerald-400 font-bold">Save</button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-slate-500 block mb-1">Percentage Fee (%)</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={tempConfig.franchiseFeePercent}
                                    onChange={(e) => setTempConfig({ ...tempConfig, franchiseFeePercent: parseFloat(e.target.value) })}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-xl px-3 py-2 text-white"
                                />
                            ) : (
                                <div className="text-xl font-mono text-white">{config.franchiseFeePercent}%</div>
                            )}
                            <p className="text-xs text-slate-500 mt-1">Automatically deducted from every tuition payment.</p>
                        </div>

                        <div className="pt-4 border-t border-slate-700">
                            <label className="text-sm text-slate-500 block mb-1">Flat Fee ($)</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={tempConfig.franchiseFeeFlat}
                                    onChange={(e) => setTempConfig({ ...tempConfig, franchiseFeeFlat: parseFloat(e.target.value) })}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-xl px-3 py-2 text-white"
                                />
                            ) : (
                                <div className="text-xl font-mono text-white">${config.franchiseFeeFlat}</div>
                            )}
                            <p className="text-xs text-slate-500 mt-1">Additional fixed amount per transaction.</p>
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-700">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1 rounded bg-[#635BFF] text-white">
                                    <span className="font-bold text-xs uppercase px-1">Stripe</span>
                                </div>
                                <span className="text-sm font-semibold text-white">Connected Status</span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg text-sm">
                                <CheckCircle size={14} />
                                System Operational
                            </div>
                        </div>

                        <button
                            onClick={handleSeed}
                            className="w-full mt-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm rounded-xl transition-colors"
                        >
                            (Dev) Seed Demo Data
                        </button>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 lg:col-span-2">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
                        <span>Recent Transactions</span>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                            <Download size={18} className="text-slate-400" />
                        </button>
                    </h3>

                    <div className="overflow-auto max-h-[400px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-slate-500 border-b border-slate-700">
                                    <th className="pb-3 pl-2">Franchise</th>
                                    <th className="pb-3">Description</th>
                                    <th className="pb-3 text-right">Volume</th>
                                    <th className="pb-3 text-right">Our Fee</th>
                                    <th className="pb-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {transactions.slice(0, 10).map((tx) => (
                                    <tr key={tx.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/20">
                                        <td className="py-3 pl-2 text-white font-medium">{tx.franchiseId}</td>
                                        <td className="py-3 text-slate-400">{tx.description}</td>
                                        <td className="py-3 text-right text-white">${tx.amount.toFixed(2)}</td>
                                        <td className="py-3 text-right text-[#C9B47C]">+${tx.platformFee.toFixed(2)}</td>
                                        <td className="py-3 text-center">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-slate-500">
                                            No transactions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
