import React from 'react';
import { ArrowRight, ChevronRight, Map, Trophy, Users, Zap } from 'lucide-react';

export const LandingPage = ({ onNavigate }) => {
    return (
        <div className="flex flex-col pb-32">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[#FAF8F5]">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#8B2332]/5 to-[#FAF8F5] opacity-60" />
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8B2332]/20 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 h-[20vh] bg-gradient-to-t from-[#FAF8F5] to-transparent" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 w-full">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9B47C]/10 border border-[#C9B47C]/20 text-[#C9B47C] text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in-up">
                        <Zap size={12} /> Project Hyper-Accelerate
                    </div>

                    <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-[#2D2D2D] tracking-tight mb-8 leading-[1.1]">
                        The School of the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9B47C] to-[#A89560]">Future</span>, Built on<br />
                        Wisdom of the Past.
                    </h1>

                    <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed font-medium">
                        Traditional school is a conveyor belt. We built a spaceship.
                        Join an educational strategy game designed to launch you into
                        the world's top universities 2 years early.
                    </p>

                    {/* Split Funnel */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <button
                            onClick={() => onNavigate('students')}
                            className="group relative overflow-hidden p-8 rounded-3xl bg-white border border-slate-200 hover:border-[#8B2332] transition-all hover:bg-[#8B2332]/5 text-left shadow-lg hover:shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#8B2332]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <div className="h-12 w-12 rounded-xl bg-[#8B2332] flex items-center justify-center mb-4 shadow-lg shadow-[#8B2332]/20 group-hover:scale-110 transition-transform">
                                    <Trophy className="text-white" />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-[#2D2D2D] mb-2">I am an Ambitious Student</h3>
                                <p className="text-slate-600 mb-6 text-base font-medium">Start your quest log, track your XP, and unlock your path to Berkeley, UCLA, and beyond.</p>
                                <span className="inline-flex items-center gap-2 text-[#8B2332] font-bold text-sm group-hover:translate-x-1 transition-transform">
                                    Start Your Game <ArrowRight size={16} />
                                </span>
                            </div>
                        </button>

                        <button
                            onClick={() => onNavigate('franchise')}
                            className="group relative overflow-hidden p-8 rounded-3xl bg-white border border-slate-200 hover:border-[#C9B47C] transition-all hover:bg-[#C9B47C]/10 text-left shadow-lg hover:shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#C9B47C]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <div className="h-12 w-12 rounded-xl bg-[#C9B47C] flex items-center justify-center mb-4 shadow-lg shadow-[#C9B47C]/20 group-hover:scale-110 transition-transform">
                                    <Map className="text-white" />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-[#2D2D2D] mb-2">I am a Visionary Educator</h3>
                                <p className="text-slate-600 mb-6 text-base font-medium">Open a University School enrichment center in your city. Empower high-agency youth.</p>
                                <span className="inline-flex items-center gap-2 text-[#C9B47C] font-bold text-sm group-hover:translate-x-1 transition-transform">
                                    Explore Franchise <ArrowRight size={16} />
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Band */}
            <div className="border-y border-[#8B2332]/10 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: "Partner Universities", value: "60+" },
                            { label: "Transfer Guarantee", value: "100%" },
                            { label: "Avg. Graduation Age", value: "19" },
                            { label: "Tuition Saved", value: "$80k+" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-5xl lg:text-6xl font-bold text-[#2D2D2D] mb-3 font-serif">{stat.value}</div>
                                <div className="text-sm font-bold text-[#8B2332] uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Philosophy Section */}
            <section className="py-24 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-6 leading-tight">
                                The "Navigator" is Not a Teacher. <br />
                                <span className="text-[#8B2332]">It's Your Strategic Advisor.</span>
                            </h2>
                            <p className="text-slate-600 text-xl mb-8 leading-relaxed">
                                University School replaces homework with "Side Quests." We replace standardized tests with "Boss Battles."
                                Your AI Navigator doesn't just grade you—it guides you through a personalized skill tree
                                mapped directly to college transfer requirements.
                            </p>
                            <ul className="space-y-6 mb-8">
                                {[
                                    "Customizable AI Personality (Socrates, Jarvis, or Mentor)",
                                    "Real-time XP tracking for academic progress",
                                    "Parent Oracle View for safety and oversight"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium text-lg">
                                        <div className="h-8 w-8 rounded-full bg-[#8B2332] flex items-center justify-center text-white shadow-md">
                                            <Users size={16} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => onNavigate('students')}
                                className="text-white border-b-2 border-[#C9B47C] pb-1 hover:text-[#C9B47C] transition-colors"
                            >
                                Meet the Navigator &rarr;
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#8B2332] to-[#C9B47C] rounded-2xl blur-2xl opacity-20" />
                            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl">
                                <img
                                    src="/images/app-student-cockpit.png"
                                    alt="University School Student Cockpit"
                                    className="rounded-xl w-full h-auto shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
