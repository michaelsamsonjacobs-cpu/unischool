import React, { useState, useEffect } from 'react';
import { Mail, Sparkles, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { MagicLinkService } from '../services/MagicLinkService';

/**
 * MagicLinkAuth - Passwordless authentication screen
 * Supports email magic links for all user roles
 */

export const MagicLinkAuth = ({ onLoginSuccess, onGuest }) => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState('email'); // 'email', 'sent', 'verifying', 'error'
    const [error, setError] = useState('');
    const [demoToken, setDemoToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Check for existing session on mount
    useEffect(() => {
        const existingUser = MagicLinkService.getCurrentUser();
        if (existingUser) {
            onLoginSuccess(existingUser);
        }
    }, [onLoginSuccess]);

    const handleRequestMagicLink = async (e) => {
        e.preventDefault();
        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const result = await MagicLinkService.requestMagicLink(email);
            if (result.success) {
                setDemoToken(result.demoToken); // For demo purposes
                setStep('sent');
            }
        } catch (err) {
            setError('Failed to send magic link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyToken = async (token) => {
        setStep('verifying');
        setError('');

        try {
            const result = await MagicLinkService.verifyMagicLink(token);
            if (result.success) {
                onLoginSuccess(result.user, result.isNewUser);
            } else {
                setError(result.error);
                setStep('error');
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
            setStep('error');
        }
    };

    const handleDemoLogin = () => {
        // For demo: directly verify the token we just generated
        if (demoToken) {
            handleVerifyToken(demoToken);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0a1628] to-[#050816] flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo & Branding */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#8B2332] to-[#C9B47C] flex items-center justify-center shadow-lg shadow-[#8B2332]/30">
                        <span className="text-white font-serif text-2xl font-bold">U</span>
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-white mb-2">University School</h1>
                    <p className="text-slate-400">Sign in with your email</p>
                </div>

                {/* Auth Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8">

                    {/* Email Input Step */}
                    {step === 'email' && (
                        <form onSubmit={handleRequestMagicLink}>
                            <div className="mb-6">
                                <label className="text-sm text-slate-400 block mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#C9B47C] transition-colors"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading || !email}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#8B2332] to-[#a62d40] text-white font-semibold text-lg hover:shadow-lg hover:shadow-[#8B2332]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Send Magic Link
                                    </>
                                )}
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-slate-800/50 px-4 text-slate-500">or</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => onGuest && onGuest()}
                                className="w-full py-4 rounded-xl bg-slate-700/50 border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
                            >
                                Continue as Guest
                            </button>
                        </form>
                    )}

                    {/* Link Sent Step */}
                    {step === 'sent' && (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                                <Mail size={32} className="text-green-500" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
                            <p className="text-slate-400 mb-6">
                                We sent a magic link to <span className="text-[#C9B47C]">{email}</span>
                            </p>
                            <p className="text-sm text-slate-500 mb-6">
                                Click the link in your email to sign in. The link expires in 15 minutes.
                            </p>

                            {/* Demo Button (for development) */}
                            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-4">
                                <p className="text-amber-400 text-sm mb-3">
                                    <strong>Demo Mode:</strong> Click below to simulate clicking the email link
                                </p>
                                <button
                                    onClick={handleDemoLogin}
                                    className="w-full py-3 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400 font-medium hover:bg-amber-500/30 transition-colors flex items-center justify-center gap-2"
                                >
                                    <ArrowRight size={16} />
                                    Simulate Email Click
                                </button>
                            </div>

                            <button
                                onClick={() => setStep('email')}
                                className="text-slate-400 text-sm hover:text-white transition-colors"
                            >
                                ← Use a different email
                            </button>
                        </div>
                    )}

                    {/* Verifying Step */}
                    {step === 'verifying' && (
                        <div className="text-center py-12">
                            <Loader2 size={48} className="animate-spin text-[#C9B47C] mx-auto mb-6" />
                            <h2 className="text-xl font-bold text-white mb-2">Signing You In...</h2>
                            <p className="text-slate-400">Please wait while we verify your session</p>
                        </div>
                    )}

                    {/* Error Step */}
                    {step === 'error' && (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                                <AlertCircle size={32} className="text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
                            <p className="text-slate-400 mb-6">{error || 'Something went wrong'}</p>
                            <button
                                onClick={() => {
                                    setStep('email');
                                    setError('');
                                }}
                                className="px-6 py-3 rounded-xl bg-[#8B2332] text-white font-medium hover:bg-[#a62d40] transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-xs text-slate-500">
                        Supervised by UC Berkeley Graduate School of Education
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MagicLinkAuth;
