import React from 'react';
import { ArrowRight, DollarSign, Clock, BookOpen, Sparkles } from 'lucide-react';

export const CLEPSection = ({ onNavigate }) => {
    return (
        <section className="py-24 bg-gradient-to-br from-[#0A1628] to-[#1a1a2e] text-white relative overflow-hidden border-t border-[#C9B47C]/20">
            {/* Background effects */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#C9B47C] blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#8B2332] blur-[100px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-[#C9B47C] font-bold tracking-widest text-xs uppercase mb-3 block">CLEP Exam Preparation</span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                        Earn College Credits in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9B47C] to-[#A89560]">90 Minutes.</span>
                    </h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
                        The College Level Examination Program (CLEP) lets students earn college credits by passing a single exam. 
                        No semester-long courses. No lectures. Our AI-powered learning model prepares students to pass with confidence.
                    </p>
                </div>

                {/* Impact Quotes */}
                <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors">
                        <DollarSign size={28} className="text-[#C9B47C] mx-auto mb-4" />
                        <p className="text-white text-lg font-bold mb-2">Save $10,000+</p>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            The average cost of a college class is $1,200 at a university. If you take 9 college classes in high school, you will save over $10,000.
                        </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors">
                        <Clock size={28} className="text-[#C9B47C] mx-auto mb-4" />
                        <p className="text-white text-lg font-bold mb-2">90 Minutes, Not 5 Months</p>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            You don&apos;t need to take a college class for 5 months, sitting in a class 4 days a week. Earn College Credits in 90 minutes.
                        </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors">
                        <BookOpen size={28} className="text-[#C9B47C] mx-auto mb-4" />
                        <p className="text-white text-lg font-bold mb-2">You Need a PLAN</p>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            You DO NOT need a Student Loan... you need a PLAN. University School provides the roadmap to earn credits affordably.
                        </p>
                    </div>
                </div>

                {/* CLEP CTA */}
                <div className="text-center">
                    <p className="text-slate-400 text-sm mb-6">
                        Inspired by <a href="https://modernstates.org" target="_blank" rel="noopener noreferrer" className="text-[#C9B47C] underline hover:text-white transition-colors">Modern States</a> &mdash; we take CLEP preparation further with AI-driven gamified learning.
                    </p>
                    <button
                        onClick={() => onNavigate && onNavigate('students')}
                        className="group bg-[#8B2332] hover:bg-[#a62b3d] border border-[#C9B47C]/30 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-3"
                    >
                        <Sparkles size={18} className="text-[#C9B47C]" />
                        Start Your CLEP Journey
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
};
