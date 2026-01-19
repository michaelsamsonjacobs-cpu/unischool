import React from 'react';
import { Shield, BookOpen, Target, ChevronRight, CheckCircle } from 'lucide-react';
import transferData from '../../data/transfer-pathways.json';

export const StudentPage = ({ onNavigate }) => {
    // Extract top tier partners for display
    const topPartners = transferData.universities
        .filter(u => u.tier === 'P0' || (u.tier === 'P1' && u.online))
        .slice(0, 6);

    return (
        <div className="flex flex-col pt-20 pb-32">
            {/* Header */}
            <section className="bg-white py-20 border-b border-[#8B2332]/10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <span className="text-[#8B2332] font-bold tracking-widest text-xs uppercase mb-4 block">For The Protagonist</span>
                    <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#2D2D2D] mb-6">
                        Life is an Open-World <br />
                        <span className="text-[#8B2332]">Strategy Game.</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Stop grinding for grades that don't matter. Start completing quests that actually unlock your future.
                    </p>
                </div>
            </section>

            {/* Gameplay Metaphor */}
            <section className="py-24 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Target,
                                title: "Choose Your Path",
                                desc: "Select your target university (e.g. UC Berkeley). The Matrix reverse-engineers every step from age 14 to admission."
                            },
                            {
                                icon: BookOpen,
                                title: "Train for AI-Proof Careers",
                                desc: "No busy work. Earn XP by building drones, coding neural nets, and mastering high-value STEM skills that automation can't replace."
                            },
                            {
                                icon: Shield,
                                title: "Transfer Guarantee",
                                desc: "Hit the requirements and get GUARANTEED admission to top universities. No lottery, just logic."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-[#8B2332]/50 transition-colors shadow-sm">
                                <div className="h-12 w-12 bg-[#8B2332]/10 rounded-xl flex items-center justify-center text-[#8B2332] mb-6">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-[#2D2D2D] mb-3">{feature.title}</h3>
                                <p className="text-slate-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interface Showcase */}
            <section className="py-24 bg-white border-b border-[#8B2332]/10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-[#8B2332] font-bold tracking-widest text-xs uppercase mb-2 block">The Operating System</span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-6">
                            Your New Command Center.
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            Forget clunky LMS portals. The Student Cockpit is designed like a high-performance HUD,
                            tracking your XP, quests, and admissions probabilities in real-time.
                        </p>
                    </div>

                    <div className="relative bg-[#FAF8F5] border border-slate-200 rounded-2xl p-2 shadow-2xl max-w-5xl mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#8B2332]/5 to-transparent blur-xl opacity-50" />
                        <img
                            src="/images/app-student-cockpit.png"
                            alt="Student Cockpit UI"
                            className="relative rounded-xl w-full h-auto shadow-2xl"
                        />
                    </div>
                </div>
            </section>

            {/* Transfer Partners Grid */}
            <section className="py-24 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="font-serif text-3xl font-bold text-[#2D2D2D] mb-2">Guaranteed Admissions</h2>
                            <p className="text-slate-600">Just a few of our 60+ university partners.</p>
                        </div>
                        <button
                            onClick={() => onNavigate('partners')}
                            className="flex items-center gap-2 text-[#8B2332] font-semibold hover:text-[#7a1e2b]"
                        >
                            View Full Matrix <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {topPartners.map((uni, i) => (
                            <div key={i} className="bg-white border border-slate-200 p-6 rounded-xl flex items-start gap-4 hover:shadow-lg transition-shadow">
                                <div className="h-12 w-12 bg-[#8B2332]/5 rounded-lg flex items-center justify-center font-serif font-bold text-[#8B2332] text-xl flex-shrink-0 border border-[#8B2332]/10">
                                    {uni.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#2D2D2D] text-lg">{uni.name}</h4>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="text-xs bg-[#8B2332]/10 text-[#8B2332] px-2 py-1 rounded">GPA {uni.minGPA}+</span>
                                        {uni.online && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Online Available</span>}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">{uni.program}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-[#8B2332] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="font-serif text-4xl font-bold text-white mb-6">Ready to Start Your Run?</h2>
                    <p className="text-white/80 text-xl mb-8">
                        Create your Navigator, define your mission, and start earning XP today.
                    </p>
                    <button
                        onClick={() => onNavigate('cockpit')}
                        className="bg-white text-[#8B2332] px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform"
                    >
                        Enter The Cockpit
                    </button>
                </div>
            </section>
        </div>
    );
};
