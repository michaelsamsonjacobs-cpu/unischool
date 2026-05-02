import React, { useState } from 'react';
import { GraduationCap, ArrowRight, Shield, Mail, Users, TrendingUp, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * BASICSAuth — Berkeley email gate for the BASICS accelerator platform.
 * Accepts any email containing "berkeley" in the domain (e.g., @berkeley.edu, @haas.berkeley.edu, @alumni.berkeley.edu).
 * Supports two roles: student (founders) and investor.
 */

const isBerkeleyEmail = (email) => {
    const domain = email.split('@')[1]?.toLowerCase() || '';
    return domain.includes('berkeley');
};

export const BASICSAuth = ({ onLogin, onBack }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('student'); // 'student' | 'investor'
    const [step, setStep] = useState('email'); // 'email' | 'verify' | 'error'
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }

        // Investors can use any email — only students need berkeley email
        if (role === 'student' && !isBerkeleyEmail(email)) {
            setError('BASICS is open to anyone with a Cal email. Please use your @berkeley.edu address.');
            return;
        }

        setSending(true);
        // Simulate magic link send (Firebase Auth in production)
        setTimeout(() => {
            setSending(false);
            if (role === 'investor') {
                // Investors go straight to portal
                onLogin({ email, role: 'basics_investor', name: email.split('@')[0] });
            } else {
                setStep('verify');
            }
        }, 1200);
    };

    const handleVerify = () => {
        // In production: Firebase checks the magic link token
        onLogin({
            email,
            role: 'basics_student',
            name: email.split('@')[0],
            berkeleyVerified: true,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#003262] via-[#001a3d] to-[#0a0a1a] flex items-center justify-center p-4">
            {/* Subtle background grid */}
            <div className="absolute inset-0 opacity-5"
                style={{
                    backgroundSize: '50px 50px',
                    backgroundImage: 'linear-gradient(to right, rgba(201,180,124,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,180,124,0.4) 1px, transparent 1px)',
                }}
            />

            <div className="relative z-10 w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#C9B47C]/30 backdrop-blur-md mb-6">
                        <GraduationCap size={14} className="text-[#C9B47C]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[#C9B47C]">
                            UC Berkeley • Cognitive Science
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                        BASICS <span className="text-[#C9B47C]">@</span> Berkeley
                    </h1>
                    <p className="text-white/50 text-sm">
                        Berkeley Accelerator & Startup Incubator in Cognitive Science
                    </p>
                </div>

                {/* Auth Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {step === 'email' && (
                        <>
                            {/* Role Toggle */}
                            <div className="flex bg-white/5 rounded-xl p-1 mb-6">
                                <button
                                    onClick={() => setRole('student')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                        role === 'student'
                                            ? 'bg-[#C9B47C] text-[#001a3d] shadow-lg'
                                            : 'text-white/50 hover:text-white/70'
                                    }`}
                                >
                                    <GraduationCap size={14} />
                                    Founder
                                </button>
                                <button
                                    onClick={() => setRole('investor')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                        role === 'investor'
                                            ? 'bg-[#C9B47C] text-[#001a3d] shadow-lg'
                                            : 'text-white/50 hover:text-white/70'
                                    }`}
                                >
                                    <TrendingUp size={14} />
                                    Investor
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                                        {role === 'student' ? 'Cal Email Address' : 'Email Address'}
                                    </label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={role === 'student' ? 'you@berkeley.edu' : 'investor@email.com'}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/20 focus:border-[#C9B47C]/50 focus:ring-1 focus:ring-[#C9B47C]/30 outline-none transition-all text-sm"
                                        />
                                    </div>
                                    {role === 'student' && (
                                        <p className="text-white/30 text-xs mt-2 flex items-center gap-1">
                                            <Shield size={10} />
                                            Open to anyone with a @berkeley.edu email
                                        </p>
                                    )}
                                </div>

                                {error && (
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                        <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-red-300 text-xs">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full bg-[#C9B47C] hover:bg-[#b8a56d] text-[#001a3d] py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#C9B47C]/20 hover:shadow-[#C9B47C]/40 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {sending ? (
                                        <div className="w-4 h-4 border-2 border-[#001a3d]/30 border-t-[#001a3d] rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {role === 'student' ? 'Continue with Cal Email' : 'Access Investor Portal'}
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}

                    {step === 'verify' && (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-[#C9B47C]/10 flex items-center justify-center mx-auto mb-4">
                                <Mail size={28} className="text-[#C9B47C]" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
                            <p className="text-white/50 text-sm mb-6">
                                We sent a magic link to <strong className="text-white">{email}</strong>
                            </p>
                            {/* Dev shortcut — remove in production */}
                            <button
                                onClick={handleVerify}
                                className="w-full bg-white/10 hover:bg-white/15 text-white py-3 rounded-xl text-sm font-bold transition-all border border-white/10 flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={14} />
                                Continue (Dev Mode)
                            </button>
                        </div>
                    )}
                </div>

                {/* Back link */}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="mt-6 w-full text-center text-white/30 text-xs hover:text-white/50 transition-colors"
                    >
                        ← Back to BASICS Landing Page
                    </button>
                )}
            </div>
        </div>
    );
};
