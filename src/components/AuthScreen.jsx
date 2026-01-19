import React, { useState } from 'react';
import { Sparkles, ArrowRight, Mail, Loader2, AlertCircle } from 'lucide-react';
import { MagicLinkService } from '../services/MagicLinkService';

export const AuthScreen = ({ onLogin, onGuest }) => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState('email'); // 'email', 'sent', 'verifying', 'error'
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [demoToken, setDemoToken] = useState('');

    const handleRequestMagicLink = async (e) => {
        e.preventDefault();
        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Simulate Magic Link Request
            const result = await MagicLinkService.requestMagicLink(email);
            if (result.success) {
                setDemoToken(result.demoToken);
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
        try {
            const result = await MagicLinkService.verifyMagicLink(token);
            if (result.success) {
                // Map Magic Link user to App user structure
                onLogin({
                    name: result.user.name || 'Student',
                    email: result.user.email,
                    role: result.user.role || 'student',
                    id: result.user.id
                }, result.isNewUser);
            } else {
                setError(result.error);
                setStep('error');
            }
        } catch (err) {
            setError('Verification failed');
            setStep('error');
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 font-sans text-slate-900">
            <div className="w-full max-w-md">
                {/* Branding */}
                <div className="text-center mb-10">
                    <img src="/images/unischool-logo.png" alt="University School" className="h-16 w-auto mx-auto mb-6" />
                    <h1 className="font-serif text-3xl font-bold text-[#2D2D2D] mb-2">University School</h1>
                    <p className="text-slate-500 font-medium">Student Operating System</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B2332] to-[#C9B47C]" />

                    {step === 'email' && (
                        <form onSubmit={handleRequestMagicLink}>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="student@example.edu"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-lg outline-none focus:ring-2 focus:ring-[#8B2332]/20 focus:border-[#8B2332] transition-all"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-3">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading || !email}
                                className="w-full py-4 bg-[#8B2332] hover:bg-[#7a1f2c] text-white text-lg font-bold rounded-xl shadow-lg shadow-[#8B2332]/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <>Send Magic Link <Sparkles size={18} /></>}
                            </button>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                                <div className="relative flex justify-center text-xs uppercase tracking-widest text-slate-400 font-bold bg-white px-4">Or</div>
                            </div>

                            <button
                                type="button"
                                onClick={onGuest}
                                className="w-full py-3 bg-white border border-slate-200 hover:border-[#8B2332] text-slate-600 hover:text-[#8B2332] font-semibold rounded-xl transition-all"
                            >
                                Continue as Guest
                            </button>
                        </form>
                    )}

                    {step === 'sent' && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-[#C9B47C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Mail size={32} className="text-[#C9B47C]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">Check your inbox</h3>
                            <p className="text-slate-500 mb-8">We sent a magic link to <span className="font-bold text-[#8B2332]">{email}</span></p>

                            {/* Demo Action */}
                            <button
                                onClick={() => handleVerifyToken(demoToken)}
                                className="w-full py-3 bg-slate-50 border-2 border-dashed border-slate-300 text-slate-500 hover:text-[#8B2332] hover:border-[#8B2332] rounded-xl font-medium transition-colors mb-6 flex items-center justify-center gap-2"
                            >
                                <span className="text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Demo</span>
                                Click to Simulate Login
                            </button>

                            <button onClick={() => setStep('email')} className="text-slate-400 hover:text-slate-600 text-sm font-medium">Use a different email</button>
                        </div>
                    )}
                </div>

                <p className="text-center mt-8 text-xs text-slate-400">
                    &copy; 2026 University School AI Inc. <br />
                    Protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
                </p>
            </div>
        </div>
    );
};
