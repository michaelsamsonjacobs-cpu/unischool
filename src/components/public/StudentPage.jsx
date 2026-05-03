import React from 'react';
import { Shield, BookOpen, Target, ChevronRight, CheckCircle, Trophy, Zap, Sparkles, ArrowRight, Star, Brain } from 'lucide-react';
import transferData from '../../data/transfer-pathways.json';

export const StudentPage = ({ onNavigate }) => {
    // Extract top tier partners for display
    const topPartners = transferData.universities
        .filter(u => u.tier === 'P0' || (u.tier === 'P1' && u.online))
        .slice(0, 6);

    return (
        <div className="flex flex-col pt-20 pb-20">
            {/* Hero */}
            <section className="relative min-h-[60vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-[#FAF8F5]">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#8B2332]/5 to-transparent" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B2332]/10 border border-[#8B2332]/20 text-[#8B2332] text-xs font-bold uppercase tracking-widest mb-8">
                            <Trophy size={12} /> For The Protagonist
                        </div>
                        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-[#2D2D2D] mb-8 leading-[1.05]">
                            Life is an Open-World<br />
                            <span className="text-[#8B2332]">Strategy Game.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed font-medium">
                            Stop grinding for grades that don't matter. Start completing quests that actually unlock your future.
                        </p>
                    </div>
                </div>
            </section>

            {/* Gameplay Metaphor — 3 Pillars */}
            <section className="py-24 bg-white border-b border-[#8B2332]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Target,
                                emoji: '🎯',
                                title: "Choose Your Path",
                                desc: "Select your target university (e.g. UC Berkeley). The Matrix reverse-engineers every step from age 14 to admission."
                            },
                            {
                                icon: BookOpen,
                                emoji: '⚡',
                                title: "Train for AI-Proof Careers",
                                desc: "No busy work. Earn XP by building drones, coding neural nets, and mastering high-value STEM skills that automation can't replace."
                            },
                            {
                                icon: Shield,
                                emoji: '🛡️',
                                title: "Transfer Guarantee",
                                desc: "Hit the requirements and get GUARANTEED admission to top universities. No lottery, just logic."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group bg-[#FAF8F5] border border-slate-200 p-8 rounded-3xl hover:border-[#8B2332]/30 hover:shadow-xl transition-all">
                                <div className="text-4xl mb-5">{feature.emoji}</div>
                                <h3 className="text-xl font-serif font-bold text-[#2D2D2D] mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interface Showcase */}
            <section className="py-24 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[#C9B47C] font-bold tracking-widest text-xs uppercase mb-3 block">The Operating System</span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-6">
                            Your New Command Center.
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            Forget clunky LMS portals. The Student Cockpit is designed like a high-performance HUD,
                            tracking your XP, quests, and admissions probabilities in real-time.
                        </p>
                    </div>

                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#8B2332] to-[#C9B47C] rounded-3xl blur-[60px] opacity-10" />
                        <div className="relative bg-white border border-slate-200 rounded-3xl p-2 shadow-2xl">
                            <img
                                src="/images/app-student-cockpit.png"
                                alt="Student Cockpit UI"
                                className="rounded-2xl w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Transfer Partners Preview */}
            <section className="py-24 bg-white border-b border-[#8B2332]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <span className="text-[#8B2332] font-bold tracking-widest text-xs uppercase mb-2 block">The Transfer Matrix</span>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-2">Guaranteed Admissions</h2>
                            <p className="text-slate-600 text-lg">Just a few of our 60+ university partners.</p>
                        </div>
                        <button
                            onClick={() => onNavigate('partners')}
                            className="hidden md:flex items-center gap-2 text-[#8B2332] font-bold hover:text-[#7a1e2b] transition-colors"
                        >
                            View Full Matrix <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {topPartners.map((uni, i) => (
                            <div key={i} className="group bg-[#FAF8F5] border border-slate-200 p-6 rounded-2xl flex items-start gap-4 hover:border-[#8B2332]/30 hover:shadow-lg transition-all">
                                <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center font-serif font-bold text-[#8B2332] text-xl flex-shrink-0 border border-[#8B2332]/10 shadow-sm">
                                    {uni.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#2D2D2D] text-lg group-hover:text-[#8B2332] transition-colors">{uni.name}</h4>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#8B2332]/10 text-[#8B2332] px-2 py-1 rounded-full">GPA {uni.minGPA}+</span>
                                        {uni.online && <span className="text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100">Online</span>}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">{uni.program}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => onNavigate('partners')}
                        className="md:hidden mt-8 w-full flex items-center justify-center gap-2 text-[#8B2332] font-bold py-3 border border-[#8B2332]/20 rounded-2xl hover:bg-[#8B2332]/5 transition-colors"
                    >
                        View Full Matrix <ChevronRight size={18} />
                    </button>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-[#8B2332] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8B2332] to-[#601a25]" />
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <div className="text-5xl mb-6">🚀</div>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">Ready to Start Your Run?</h2>
                    <p className="text-white/80 text-xl mb-10 max-w-xl mx-auto">
                        Talk to our team to learn how you can start earning college credit at 14.
                    </p>
                    <a
                        href="mailto:info@universityschool.ai"
                        className="bg-white text-[#8B2332] px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-transform inline-flex items-center gap-3"
                    >
                        Get Started <ArrowRight size={20} />
                    </a>
                </div>
            </section>
        </div>
    );
};
