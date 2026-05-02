import React, { useState } from 'react';
import { Building, ExternalLink, CheckCircle, CreditCard, ArrowRight, Shield, AlertCircle } from 'lucide-react';

/**
 * BASICSIncorporation — Stripe Atlas company creation for $250 via Techstars affiliate.
 * Triggered after course completion, before investor section unlocks.
 */

const TECHSTARS_AFFILIATE_URL = 'https://atlas.stripe.com/register?source=techstars';

export const BASICSIncorporation = ({ student, onComplete, onBack }) => {
    const [step, setStep] = useState('info'); // 'info' | 'confirm' | 'complete'
    const [companyName, setCompanyName] = useState('');

    const handleStartIncorporation = () => {
        if (!companyName.trim()) return;
        // Open Stripe Atlas with Techstars affiliate link
        window.open(TECHSTARS_AFFILIATE_URL, '_blank', 'noopener');
        setStep('confirm');
    };

    const handleConfirmIncorporation = () => {
        setStep('complete');
        if (onComplete) onComplete({ companyName, incorporatedAt: new Date().toISOString() });
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <button onClick={onBack} className="text-slate-400 hover:text-slate-600 text-sm mb-6 flex items-center gap-1 transition-colors">
                    ← Back to Course
                </button>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#003262] to-[#001a3d] text-white px-8 py-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Building size={16} className="text-[#C9B47C]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-[#C9B47C]">Company Formation</span>
                        </div>
                        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Incorporate Your Company
                        </h2>
                        <p className="text-white/50 text-sm mt-1">
                            Delaware C-Corp via Stripe Atlas — $250 with Techstars affiliate
                        </p>
                    </div>

                    <div className="p-8">
                        {step === 'info' && (
                            <>
                                <div className="space-y-4 mb-6">
                                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                                        <p className="text-sm text-blue-800 font-medium">
                                            <strong>Why incorporate?</strong> BASICS uses standardized SAFE agreements for investment.
                                            You need a Delaware C-Corp so investors can wire funds through Sydecar.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {[
                                            { label: 'Delaware C-Corp', detail: 'Standard startup structure' },
                                            { label: 'EIN + Bank Account', detail: 'Included via Stripe Atlas' },
                                            { label: 'Cost', detail: '$250 (Techstars affiliate pricing)' },
                                            { label: 'Time', detail: '~1 business day' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                                                <span className="text-sm font-medium text-[#2D2D2D]">{item.label}</span>
                                                <span className="text-xs text-slate-500">{item.detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company Name</label>
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="e.g., NewNav Inc."
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#003262] focus:ring-1 focus:ring-[#003262]/20 outline-none transition-all"
                                    />
                                </div>

                                <button
                                    onClick={handleStartIncorporation}
                                    disabled={!companyName.trim()}
                                    className="w-full bg-[#003262] hover:bg-[#001a3d] text-white py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                                >
                                    <CreditCard size={16} />
                                    Incorporate with Stripe Atlas — $250
                                    <ExternalLink size={14} />
                                </button>
                            </>
                        )}

                        {step === 'confirm' && (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                                    <Building size={28} className="text-amber-500" />
                                </div>
                                <h3 className="text-lg font-bold text-[#2D2D2D] mb-2">Confirm Incorporation</h3>
                                <p className="text-sm text-slate-500 mb-6">
                                    After completing Stripe Atlas registration, confirm below to unlock the investor section.
                                </p>
                                <button
                                    onClick={handleConfirmIncorporation}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={16} />
                                    I've Completed Incorporation
                                </button>
                            </div>
                        )}

                        {step === 'complete' && (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={28} className="text-green-500" />
                                </div>
                                <h3 className="text-lg font-bold text-[#2D2D2D] mb-2">🎉 Incorporated!</h3>
                                <p className="text-sm text-slate-500 mb-2">
                                    <strong>{companyName}</strong> is now a Delaware C-Corp.
                                </p>
                                <p className="text-xs text-slate-400">
                                    The investor section is now unlocked. Complete your data room to start raising.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
