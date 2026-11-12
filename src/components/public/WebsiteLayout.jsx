import React from 'react';
import { Shield, Menu, X, ArrowRight, Sparkles, Users } from 'lucide-react';

const APP_BASE_URL = 'https://usai-school-app.vercel.app';

export const WebsiteLayout = ({ children, activePage = 'home', onNavigate }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [activePage]);

    const NAV_LINKS = [
        { id: 'home', label: 'Home' },
        { id: 'students', label: 'Knowledge Schools' },
        { id: 'process', label: 'Our Process' },
        { id: 'partners', label: 'Open-Enrollment Credit' },
        { id: 'asu-demo', label: '1901 Wind Tunnel Demo' },
        { id: 'about', label: 'About' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-800 font-sans selection:bg-[#8B2332] selection:text-white overflow-x-hidden pb-20">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#8B2332]/15">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20 gap-3">
                        {/* Logo */}
                        <div
                            className="flex items-center gap-3 cursor-pointer group shrink-0"
                            onClick={() => onNavigate('landing')}
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
                            <div className="hidden h-10 w-10 bg-gradient-to-br from-[#8B2332] to-[#601a25] rounded-lg items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
                                U
                            </div>
                            <div>
                                <h1 className="font-serif text-xl font-bold tracking-tight text-[#2D2D2D]">
                                    University School
                                </h1>
                            </div>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden xl:flex items-center gap-4">
                            {NAV_LINKS.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => onNavigate(link.id === 'home' ? 'landing' : link.id)}
                                    className={`text-xs font-semibold transition-all hover:text-[#8B2332] flex items-center gap-1 whitespace-nowrap ${
                                        link.id === 'asu-demo'
                                            ? 'px-3 py-1.5 rounded-full bg-[#8B2332]/10 border border-[#8B2332]/25 text-[#8B2332] hover:bg-[#8B2332] hover:text-white shadow-sm'
                                            : activePage === link.id
                                            ? 'text-[#8B2332]'
                                            : 'text-slate-600'
                                    }`}
                                >
                                    {link.id === 'asu-demo' && <Sparkles size={12} className="text-[#C9B47C]" />}
                                    {link.label}
                                </button>
                            ))}

                            <a
                                href={`${APP_BASE_URL}/dashboard/class-studio`}
                                className="px-3.5 py-2 rounded-full border border-[#8B2332]/30 bg-white hover:bg-[#8B2332]/5 text-[#8B2332] text-xs font-bold transition-all whitespace-nowrap"
                            >
                                Class Studio &amp; SymPy Lab
                            </a>

                            <a
                                href={`${APP_BASE_URL}/login`}
                                className="bg-[#8B2332] hover:bg-[#a62b3d] text-white px-4 py-2.5 rounded-full text-xs font-bold transition-all hover:shadow-[0_0_20px_rgba(139,35,50,0.4)] flex items-center gap-1.5 group whitespace-nowrap"
                            >
                                <Users size={14} className="text-[#E6C687]" />
                                <span>Launch App (Parent · Child 1 · Child 2)</span>
                                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </a>
                        </div>

                        {/* Mobile / Tablet Quick CTA + Menu Button */}
                        <div className="flex xl:hidden items-center gap-2">
                            <a
                                href={`${APP_BASE_URL}/login`}
                                className="bg-[#8B2332] text-white px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1"
                            >
                                <span>Launch App</span>
                                <ArrowRight size={13} />
                            </a>
                            <button
                                className="p-2 text-slate-600 hover:text-[#8B2332]"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-lg">
                        {NAV_LINKS.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => {
                                    onNavigate(link.id === 'home' ? 'landing' : link.id);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                                    activePage === link.id
                                        ? 'text-[#8B2332] bg-[#8B2332]/5'
                                        : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {link.label}
                            </button>
                        ))}
                        <div className="pt-2 border-t border-slate-100 grid gap-2">
                            <a
                                href={`${APP_BASE_URL}/login`}
                                className="block w-full bg-[#8B2332] text-white px-4 py-3 rounded-xl font-bold text-sm text-center"
                            >
                                Launch App (Parent · Child 1 · Child 2)
                            </a>
                            <a
                                href={`${APP_BASE_URL}/dashboard/class-studio`}
                                className="block w-full bg-[#1F070B] text-[#E6C687] px-4 py-2.5 rounded-xl font-bold text-xs text-center"
                            >
                                Class Studio &amp; SymPy Lab
                            </a>
                            <a
                                href={`${APP_BASE_URL}/dashboard/asu-companion`}
                                className="block w-full bg-slate-100 text-slate-800 px-4 py-2.5 rounded-xl font-semibold text-xs text-center"
                            >
                                1854 Broad Street Investigation
                            </a>
                            <a
                                href={`${APP_BASE_URL}/dashboard/degree-planner`}
                                className="block w-full bg-slate-100 text-slate-800 px-4 py-2.5 rounded-xl font-semibold text-xs text-center"
                            >
                                Dual-Credit Architect (🇺🇸 / 🇧🇷)
                            </a>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Global Trust Footer */}
            <footer className="bg-white border-t border-[#8B2332]/10 pt-16 pb-8 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="font-serif text-2xl font-bold text-[#2D2D2D] mb-4">University School</h3>
                            <p className="text-slate-600 max-w-md mb-6 leading-relaxed">
                                Real university learning starting at age 11. Scholars build deep physical and quantitative intuition through interactive simulations and earn transferable college credit via Accredited Open-Enrollment Credit Providers (ASU Universal Learner, BYU Independent Study, CLEP).
                            </p>
                            <div className="flex items-start gap-3 p-4 bg-[#8B2332]/5 border border-[#8B2332]/10 rounded-xl max-w-md">
                                <Shield className="text-[#8B2332] flex-shrink-0 mt-1" size={24} />
                                <div>
                                    <h4 className="font-bold text-[#2D2D2D] text-sm mb-1">Academic Rigor &amp; Registrar Honesty</h4>
                                    <p className="text-xs text-slate-600">
                                        Official university transcripts are issued directly by Accredited Open-Enrollment Credit Providers (ASU Universal Learner NSC #001081, BYU Independent Study, CLEP) under zero-GPA-risk Pay-After-Pass rules.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-[#2D2D2D] mb-4">Live Platform</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href={`${APP_BASE_URL}/login`} className="hover:text-[#8B2332] font-semibold transition-colors">Launch App (Parent · Child 1 · Child 2)</a></li>
                                <li><a href={`${APP_BASE_URL}/dashboard/class-studio`} className="hover:text-[#8B2332] transition-colors">Class Studio &amp; SymPy Lab</a></li>
                                <li><a href={`${APP_BASE_URL}/dashboard/asu-companion`} className="hover:text-[#8B2332] transition-colors">1854 Broad Street Investigation</a></li>
                                <li><a href={`${APP_BASE_URL}/dashboard/degree-planner`} className="hover:text-[#8B2332] transition-colors">Dual-Credit Architect (🇺🇸 / 🇧🇷)</a></li>
                                <li><a href={`${APP_BASE_URL}/portal-pais`} className="hover:text-[#8B2332] transition-colors">Parent Household Portal</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-[#2D2D2D] mb-4">Explore</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><button onClick={() => onNavigate('students')} className="hover:text-[#8B2332] transition-colors">Knowledge Schools</button></li>
                                <li><button onClick={() => onNavigate('process')} className="hover:text-[#8B2332] transition-colors">Experience First Process</button></li>
                                <li><button onClick={() => onNavigate('partners')} className="hover:text-[#8B2332] transition-colors">Open-Enrollment Credit Providers</button></li>
                                <li><button onClick={() => onNavigate('franchise')} className="hover:text-[#8B2332] transition-colors">Micro-Campuses &amp; Centers</button></li>
                                <li><button onClick={() => onNavigate('about')} className="hover:text-[#8B2332] transition-colors">About University School</button></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
                        <p>© 2026 University School AI Inc. All rights reserved. &ldquo;University School&rdquo; is a registered trademark.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
