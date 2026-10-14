import React from 'react';
import { Map, TrendingUp, Cpu, Building, Users, Shield, Globe, Award, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export const FranchisePage = ({ onNavigate }) => {
    return (
        <div className="flex flex-col pt-20 pb-20">
            {/* Hero */}
            <section className="relative min-h-[60vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-white">
                    <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-5" />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#C9B47C]/10 to-transparent" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10 w-full">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B2332]/10 border border-[#8B2332]/20 text-[#8B2332] text-xs font-bold uppercase tracking-widest mb-8">
                                <Building size={12} /> University School Node Operator
                            </div>
                            <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#2D2D2D] mb-8 leading-[1.05]">
                                Own the Future of <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9B47C] to-[#A89560]">Education.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed font-medium mb-10">
                                The traditional school system is collapsing. We are building the replacement: a decentralized network of high-tech, high-agency micro-schools.
                                Bring the next generation of AI-powered microschools to your city.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="group bg-[#C9B47C] hover:bg-[#b09b63] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                    Apply to Operate
                                    <TrendingUp size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="group border-2 border-slate-300 hover:border-[#8B2332] hover:bg-[#8B2332]/5 text-slate-700 px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                                    <Map size={18} />
                                    View Open Territories
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-5 flex justify-center lg:justify-end">
                            <div className="bg-[#FAF8F5] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 max-w-md w-full p-5">
                                <div className="rounded-2xl overflow-hidden h-52 mb-4 relative">
                                    <img
                                        src="/images/commons-lounge.jpg"
                                        alt="University School Node Collaborative Workspace"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0A1628]/85 backdrop-blur-md text-[#C9B47C] text-[10px] font-bold uppercase tracking-widest">
                                        University School Nodes
                                    </div>
                                </div>
                                <h3 className="font-serif text-xl font-bold text-[#2D2D2D] mb-1">
                                    Learn Anywhere. Belong Somewhere.
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                                    High-agency local hubs where students collaborate at workshop tables, build hardware projects, and find their peers by passion.
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 font-semibold text-[#2D2D2D] flex items-center gap-2">
                                        <CheckCircle size={14} className="text-[#8B2332]" /> 1,200 Sq. Ft. Footprint
                                    </div>
                                    <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 font-semibold text-[#2D2D2D] flex items-center gap-2">
                                        <CheckCircle size={14} className="text-[#8B2332]" /> 30-Student Cohort
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Campus Experience */}
            <section className="py-24 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[#8B2332] font-bold tracking-widest text-xs uppercase mb-3 block">The Physical Layer</span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-6">Built for "Hard" Fun.</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            University School Nodes are not classrooms. They are collaborative workspaces designed for
                            engineering, debate, and deep work. You own the Location; we provide the global network.
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
                            <div className="grid md:grid-cols-2 gap-2 bg-white">
                                <div className="relative group overflow-hidden h-80 md:h-96">
                                    <img src="/images/commons-lounge.jpg" alt="The Commons Student Lounge" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                </div>
                                <div className="relative group overflow-hidden h-80 md:h-96">
                                    <img src="/images/robotics-lab.jpg" alt="Tech & Testing Labs" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                </div>
                            </div>

                            <div className="p-8 md:p-12 grid md:grid-cols-2 gap-8">
                                <div>
                                    <div className="text-3xl mb-3">🏛️</div>
                                    <h3 className="text-[#2D2D2D] font-serif font-bold text-2xl mb-2">The Commons</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        A workspace for home-schooled and high-agency youth to collaborate, attend guest speaker events, and find their tribe.
                                    </p>
                                </div>
                                <div className="md:border-l md:border-slate-200 md:pl-8">
                                    <div className="text-3xl mb-3">🔬</div>
                                    <h3 className="text-[#2D2D2D] font-serif font-bold text-2xl mb-2">Tech & Testing Labs</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Access to professional STEM equipment (3D printers, VR).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Economic Model */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[#C9B47C] font-bold tracking-widest text-xs uppercase mb-3 block">Unit Economics</span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-4">The Node Economic Model</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            High margins. Low overhead. Designed for the "Teacher-Preneur."
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { icon: TrendingUp, value: "$450k", label: "Target Annual Revenue", sub: "Based on 30 students", emoji: '💰' },
                            { icon: Users, value: "1:15", label: "Navigator Ratio", sub: "Hyper-personalized", emoji: '👥' },
                            { icon: Building, value: "1,200", label: "Sq. Ft. Required", sub: "Micro-footprint efficiency", emoji: '🏢' },
                            { icon: Cpu, value: "AI", label: "Powered Operations", sub: "Zero administrative bloat", emoji: '🤖' }
                        ].map((stat, i) => (
                            <div key={i} className="group bg-[#FAF8F5] p-8 rounded-3xl border border-slate-200 hover:border-[#C9B47C]/40 hover:shadow-xl transition-all">
                                <div className="text-3xl mb-4">{stat.emoji}</div>
                                <div className="text-4xl font-serif font-bold text-[#2D2D2D] mb-2">{stat.value}</div>
                                <div className="font-bold text-slate-800 mb-1">{stat.label}</div>
                                <div className="text-sm text-slate-500">{stat.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack Section */}
            <section className="py-24 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-[#8B2332] font-bold tracking-widest text-xs uppercase mb-3 block">Powered by University School OS</span>
                            <h2 className="font-serif text-4xl font-bold text-[#2D2D2D] mb-6 leading-tight">
                                A "School-in-a-Box" <br />
                                Operating System.
                            </h2>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                You focus on mentoring students. Our "Sovereign Workstation" handles the rest.
                                From curriculum generation to UC Berkeley compliance, the entire backend is automated.
                            </p>

                            <ul className="space-y-4">
                                {[
                                    "Hardware-ready (VR, Robotics, 3D Printing) specs",
                                    "Workspaces for Home-Schooled & Remote Students",
                                    "Guest Speaker & Community Event Management"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <CheckCircle className="text-[#8B2332] flex-shrink-0" size={20} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#8B2332] to-[#C9B47C] rounded-3xl blur-[60px] opacity-10" />
                            <div className="relative bg-white border border-slate-200 rounded-3xl p-2 shadow-2xl">
                                <img
                                    src="/images/app-franchise-ops.png"
                                    alt="Springroll Node Dashboard"
                                    className="rounded-2xl w-full h-auto"
                                />
                            </div>

                            {/* BETT Brazil Badge */}
                            <div className="absolute -bottom-8 -left-8 bg-[#2D2D2D] text-white p-5 rounded-2xl shadow-2xl max-w-xs transform -rotate-2 border-2 border-[#C9B47C] hidden md:block">
                                <div className="flex items-center gap-3 mb-2">
                                    <Globe className="text-[#C9B47C]" size={20} />
                                    <span className="font-bold text-[#C9B47C] uppercase tracking-widest text-[10px]">Global Impact</span>
                                </div>
                                <p className="font-bold text-base leading-tight mb-1">
                                    Official Selection: BETT Brazil 2026
                                </p>
                                <p className="text-xs text-slate-400">
                                    Showcasing to Latin America's top education leaders.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
