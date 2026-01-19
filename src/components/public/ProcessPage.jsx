import React from 'react';
import { Shield, Trophy, ArrowRight, Target, Zap, AlertCircle, Award } from 'lucide-react';

export const ProcessPage = ({ onNavigate }) => {
    return (
        <div className="flex flex-col pt-20">
            {/* Hero */}
            <section className="bg-[#FAF8F5] py-24 border-b border-[#8B2332]/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/strategy-bg.png')] opacity-5" />
                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#2D2D2D] mb-8">
                        The Master Strategy.
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        We don't rely on luck. Our "Barbell Strategy" ensures you have a 100% guaranteed safety net
                        while aggressively targeting the world's most elite institutions.
                    </p>
                </div>
            </section>

            {/* The Dual Path Visualizer */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Path 1: The Guarantee */}
                        <div className="bg-[#FAF8F5] rounded-3xl p-8 border border-slate-200 hover:border-[#8B2332] shadow-sm hover:shadow-xl transition-all group">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-[#8B2332]/10 flex items-center justify-center text-[#8B2332] group-hover:scale-110 transition-transform">
                                    <Shield size={28} />
                                </div>
                                <div>
                                    <div className="text-[#8B2332] font-bold tracking-widest text-[10px] uppercase mb-1">The Foundation</div>
                                    <h2 className="text-2xl font-serif font-bold text-[#2D2D2D]">The Guarantee</h2>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm mb-6 h-20">
                                Reverse-engineer the transfer contracts for top public universities. Hit the GPA, take the classes, sign the paper.
                                It is legally impossible for them to reject you.
                            </p>
                            <ul className="space-y-3 mb-6">
                                {[
                                    "UC Santa Barbara (100% Guaranteed)",
                                    "Top State Colleges (e.g. NY)",
                                    "All 23 Cal State Universities"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#8B2332]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs inline-flex items-center gap-2">
                                <Shield size={12} /> Risk: 0% (Mathematical)
                            </div>
                        </div>

                        {/* Path 2: The Spike */}
                        <div className="bg-[#FAF8F5] rounded-3xl p-8 border border-slate-200 hover:border-[#C9B47C] shadow-sm hover:shadow-xl transition-all group">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-[#C9B47C]/10 flex items-center justify-center text-[#C9B47C] group-hover:scale-110 transition-transform">
                                    <Trophy size={28} />
                                </div>
                                <div>
                                    <div className="text-[#C9B47C] font-bold tracking-widest text-[10px] uppercase mb-1">The Moonshot</div>
                                    <h2 className="text-2xl font-serif font-bold text-[#2D2D2D]">The Elite Spike</h2>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm mb-6 h-20">
                                Target Ivy League & Stanford. We build a specialized "Spike" project—a published book,
                                patent, or nonprofit—to force admissions officers to pay attention.
                            </p>
                            <ul className="space-y-3 mb-6">
                                {[
                                    "Stanford, Harvard, MIT",
                                    "Building a 'Hook' Narrative",
                                    "National Competition Strategy"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#C9B47C]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg text-orange-600 text-xs inline-flex items-center gap-2">
                                <Zap size={12} /> Strategy: High Risk
                            </div>
                        </div>

                        {/* Path 3: The Sovereign Degree */}
                        <div className="bg-[#FAF8F5] rounded-3xl p-8 border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all group">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                    <Award size={28} />
                                </div>
                                <div>
                                    <div className="text-blue-500 font-bold tracking-widest text-[10px] uppercase mb-1">The Direct Path</div>
                                    <h2 className="text-2xl font-serif font-bold text-[#2D2D2D]">Sovereign Degree</h2>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm mb-6 h-20">
                                Graduate directly from our center. No dorms, no debt. We partner with accredited universities to let you
                                earn a Bachelor's degree entirely on-site or remote.
                            </p>
                            <ul className="space-y-3 mb-6">
                                {[
                                    "Brigham Young University (BYU)",
                                    "Arizona State University",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-xs inline-flex items-center gap-2">
                                <Award size={12} /> Speed: 2-3 Years Total
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Crimson Bot Section */}
            <section className="py-24 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-white border border-slate-200 rounded-3xl p-1 md:p-12 overflow-hidden relative shadow-lg">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('/images/noise.png')] opacity-10 mix-blend-multiply" />

                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center px-8 py-8 md:py-0">
                            <div>
                                <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-6">
                                    Meet Your Elite Admissions AI.
                                </h2>
                                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                    We trained a specialized AI on 50,000+ accepted Ivy League essays and profiles.
                                    It analyzes your current stats and "Spike" project to give you a real-time probability score for elite admission.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 text-slate-700">
                                        <Target size={20} className="text-[#8B2332]" />
                                        <span>Instant "Chance Me" Probability</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700">
                                        <Target size={20} className="text-[#8B2332]" />
                                        <span>Essay Narrative Optimization</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700">
                                        <Target size={20} className="text-[#8B2332]" />
                                        <span>Extracurricular "Spike" Recommendations</span>
                                    </li>
                                </ul>
                                <button
                                    onClick={() => onNavigate('cockpit')}
                                    className="bg-[#8B2332] text-white px-8 py-4 rounded-xl font-bold transition-transform hover:scale-105 shadow-lg flex items-center gap-2"
                                >
                                    Log In to Run Analysis <ArrowRight size={18} />
                                </button>
                            </div>

                            {/* AI Interface Mockup */}
                            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xl skew-x-[-2deg] hover:skew-x-0 transition-transform duration-500 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#8B2332]/5 to-transparent rounded-xl" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                        <div className="h-8 w-8 rounded-full bg-[#8B2332] flex items-center justify-center">
                                            <Zap size={16} className="text-white" />
                                        </div>
                                        <div>
                                            <div className="text-[#2D2D2D] font-bold text-sm">University School AI</div>
                                            <div className="text-xs text-[#C9B47C] font-semibold">Analysis Complete</div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-slate-50 rounded-lg p-3 text-slate-600 text-xs font-mono border border-slate-100">
                                            Analyzing applicant profile...
                                            <br />&gt; GPA: 4.0 [Top 1%]
                                            <br />&gt; Spike: Launched autonomous drone startup
                                            <br />&gt; Awards: ISEF Finalist
                                        </div>
                                        <div className="bg-[#8B2332]/5 border border-[#8B2332]/20 rounded-lg p-4">
                                            <div className="text-xs text-[#8B2332] font-bold uppercase mb-1">Stanford Probability</div>
                                            <div className="text-2xl font-bold text-[#2D2D2D]">18.4%</div>
                                            <div className="text-[10px] text-slate-500 mt-1">
                                                (3.6x higher than baseline 5.1%)
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#8B2332] w-[18%]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
