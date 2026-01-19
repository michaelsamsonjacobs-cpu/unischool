import React from 'react';
import { GraduationCap, Shield, Globe, Menu, X, ArrowRight } from 'lucide-react';

/**
 * WebsiteLayout - Main wrapper for all public-facing University School pages
 * Features global navigation and the critical "Supervised by UC Berkeley Administrators" footer
 */
export const WebsiteLayout = ({ children, activePage = 'home', onNavigate }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const NAV_LINKS = [
        { id: 'home', label: 'Home' },
        { id: 'students', label: 'For Students' },
        { id: 'franchise', label: 'For Educators' },
        { id: 'partners', label: 'University Partners' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 font-sans selection:bg-[#8B2332] selection:text-white overflow-x-hidden">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => onNavigate('home')}
                        >
                            <img
                                src="/images/unischool-logo.png"
                                alt="University School"
                                className="h-10 w-10 rounded-lg group-hover:scale-105 transition-transform"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="hidden h-10 w-10 bg-gradient-to-br from-[#8B2332] to-[#601a25] rounded-lg items-center justify-center text-white font-serif font-bold text-xl">
                                U
                            </div>
                            <div>
                                <h1 className="font-serif text-xl font-bold tracking-tight text-white">
                                    University School
                                </h1>
                                <p className="text-[10px] uppercase tracking-widest text-[#C9B47C] font-semibold">
                                    Hyper-Accelerate
                                </p>
                            </div>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            {NAV_LINKS.map(link => (
                                <button
                                    key={link.id}
                                    onClick={() => onNavigate(link.id)}
                                    className={`text-sm font-medium transition-colors hover:text-[#C9B47C] ${activePage === link.id ? 'text-[#C9B47C]' : 'text-slate-300'
                                        }`}
                                >
                                    {link.label}
                                </button>
                            ))}
                            <button
                                onClick={() => onNavigate('cockpit')}
                                className="bg-[#8B2332] hover:bg-[#a62b3d] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(139,35,50,0.4)] flex items-center gap-2 group"
                            >
                                Student Login
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-slate-300 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-[#0f172a] border-b border-white/5 px-4 py-4 space-y-4">
                        {NAV_LINKS.map(link => (
                            <button
                                key={link.id}
                                onClick={() => {
                                    onNavigate(link.id);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`block w-full text-left py-2 text-base font-medium ${activePage === link.id ? 'text-[#C9B47C]' : 'text-slate-300'
                                    }`}
                            >
                                {link.label}
                            </button>
                        ))}
                        <button
                            onClick={() => onNavigate('cockpit')}
                            className="w-full bg-[#8B2332] text-white px-5 py-3 rounded-xl font-semibold mt-4"
                        >
                            Student Login
                        </button>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Global Trust Footer */}
            <footer className="bg-[#0a0f1a] border-t border-white/5 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="font-serif text-2xl font-bold text-white mb-4">University School</h3>
                            <p className="text-slate-400 max-w-md mb-6 leading-relaxed">
                                We are re-engineering the K-12 experience to be a direct pipeline to the world's best universities. Life is a strategy game—we help you win it.
                            </p>
                            <div className="flex items-start gap-3 p-4 bg-[#8B2332]/10 border border-[#8B2332]/20 rounded-xl max-w-md">
                                <Shield className="text-[#8B2332] flex-shrink-0 mt-1" size={24} />
                                <div>
                                    <h4 className="font-bold text-white text-sm mb-1">Academic Supervision</h4>
                                    <p className="text-xs text-slate-300">
                                        All curriculum and learning pathways are independently supervised by administrators from
                                        <span className="text-[#C9B47C] font-semibold"> UC Berkeley's Graduate School of Education</span>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Platform</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><button onClick={() => onNavigate('students')} className="hover:text-[#C9B47C] transition-colors">Student Cockpit</button></li>
                                <li><button onClick={() => onNavigate('partners')} className="hover:text-[#C9B47C] transition-colors">Transfer Matrix</button></li>
                                <li><button onClick={() => onNavigate('franchise')} className="hover:text-[#C9B47C] transition-colors">Open a Center</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li>Privacy Policy</li>
                                <li>Terms of Service</li>
                                <li>Student Safety</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
                        <p>© 2026 Project Hyper-Accelerate. All rights reserved.</p>
                        <div className="flex items-center gap-6 mt-4 md:mt-0">
                            <span className="flex items-center gap-2">
                                <Globe size={14} />
                                Global Campus Network
                            </span>
                            <span>San Francisco • New York • London • Singapore</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
