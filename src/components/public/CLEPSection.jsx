import React from 'react';
import { ArrowRight, DollarSign, Clock, BookOpen, Sparkles } from 'lucide-react';

export const CLEPSection = ({ onNavigate }) => {
    return (
        <section className="py-24 bg-[#19090D] text-white relative overflow-hidden border-t border-[#C9B47C]/30">
            {/* Background effects */}
            <div className="absolute inset-0 opacity-15">
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#C9B47C] blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#8B2332] blur-[100px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-[#E6C687] font-bold tracking-[0.22em] text-xs uppercase mb-3 block">
                        Accelerated University Credit &amp; CLEP Mastery
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                        Earn Accredited College Credits
                        <span className="block text-[#E6C687]">in 90 Minutes.</span>
                    </h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
                        Alongside full partner university courses and degree tracks, the College-Level Examination Program (CLEP) lets students earn official college credit by mastering the subject in our historical labs and passing a single exam.
                    </p>
                </div>

                {/* Impact Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
                    <div className="bg-[#140709] border border-[#E6C687]/30 rounded-3xl p-7 text-center hover:border-[#E6C687] transition-all shadow-xl">
                        <div className="w-12 h-12 rounded-2xl bg-[#E6C687]/15 border border-[#E6C687]/40 flex items-center justify-center mx-auto mb-4">
                            <DollarSign size={24} className="text-[#E6C687]" />
                        </div>
                        <p className="font-serif text-white text-2xl font-bold mb-2">Save $10,000 to $80,000+</p>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            The average cost of a single university course is $1,200+. Earning credits early and stacking toward your degree saves tens of thousands in tuition.
                        </p>
                    </div>
                    <div className="bg-[#140709] border border-[#E6C687]/30 rounded-3xl p-7 text-center hover:border-[#E6C687] transition-all shadow-xl">
                        <div className="w-12 h-12 rounded-2xl bg-[#E6C687]/15 border border-[#E6C687]/40 flex items-center justify-center mx-auto mb-4">
                            <Clock size={24} className="text-[#E6C687]" />
                        </div>
                        <p className="font-serif text-white text-2xl font-bold mb-2">Mastery at Your Pace</p>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Don&apos;t wait 5 months in a lecture hall when you have already mastered the material. Prove your capability and lock in official university credit.
                        </p>
                    </div>
                    <div className="bg-[#140709] border border-[#E6C687]/30 rounded-3xl p-7 text-center hover:border-[#E6C687] transition-all shadow-xl">
                        <div className="w-12 h-12 rounded-2xl bg-[#E6C687]/15 border border-[#E6C687]/40 flex items-center justify-center mx-auto mb-4">
                            <BookOpen size={24} className="text-[#E6C687]" />
                        </div>
                        <p className="font-serif text-white text-2xl font-bold mb-2">A Degree Roadmap, Not Debt</p>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            You don&apos;t need a student loan&mdash;you need an immersive learning architecture that builds real university credentials starting at age 11.
                        </p>
                    </div>
                </div>

                {/* CLEP CTA */}
                <div className="text-center">
                    <button
                        onClick={() => onNavigate && onNavigate('students')}
                        className="group bg-[#8B2332] hover:bg-[#A3293B] border border-[#E6C687]/50 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl inline-flex items-center gap-3"
                    >
                        <Sparkles size={18} className="text-[#E6C687]" />
                        Explore Knowledge Schools &amp; Credit Pathways
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
};

