import React from 'react';
import { Shield, Trophy, ArrowRight, Target, Zap, AlertCircle, Award } from 'lucide-react';

export const ProcessPage = ({ onNavigate }) => {
    return (
        <div className="flex flex-col pt-20">
            {/* Hero */}
            <section className="relative min-h-[50vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-[#FAF8F5]">
                    <div className="absolute inset-0 bg-[url('/images/strategy-bg.png')] opacity-5" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B2332]/10 border border-[#8B2332]/20 text-[#8B2332] text-xs font-bold uppercase tracking-widest mb-8 mx-auto">
                        <Target size={12} /> Our Process
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#2D2D2D] mb-8 leading-[1.05]">
                        Our Students <br />
                        <span className="text-[#8B2332]">Graduate from College.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Every student who completes our program earns university credit.
                        A clear, proven pathway from age 11 to a college degree.
                    </p>
                </div>
            </section>

            {/* The Dual Path Visualizer */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Path 1: The Guarantee */}
                        <div className="bg-[#FAF8F5] rounded-3xl p-8 border border-slate-200 hover:border-[#8B2332] shadow-sm hover:shadow-xl transition-all group flex flex-col">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-[#8B2332]/10 flex items-center justify-center text-[#8B2332] group-hover:scale-110 transition-transform">
                                    <Shield size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-serif font-bold text-[#2D2D2D]">The Guarantee</h2>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                Reverse-engineer the transfer contracts for top public universities. Hit the GPA, take the classes, sign the paper.
                                Admission becomes a formality, not a lottery. 100% guarantee when you meet the requirement.
                            </p>
                            <ul className="space-y-3 mb-6 mt-auto">
                                {[
                                    "UC Santa Barbara (Transfer Pathway)",
                                    "Top State Colleges (e.g. NY)",
                                    "All 23 Cal State Universities"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#8B2332]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Path 2: The Moonshot */}
                        <div className="bg-[#FAF8F5] rounded-3xl p-8 border border-slate-200 hover:border-[#C9B47C] shadow-sm hover:shadow-xl transition-all group flex flex-col">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-[#C9B47C]/10 flex items-center justify-center text-[#C9B47C] group-hover:scale-110 transition-transform">
                                    <Trophy size={28} />
                                </div>
                                <div>
                                    <div className="text-[#C9B47C] font-bold tracking-widest text-xs uppercase">The Moonshot</div>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                Target Ivy League &amp; Stanford. We build a specialized &ldquo;Spike&rdquo; project—a published book,
                                a patent, or a nonprofit to make admissions officers notice.
                            </p>
                            <ul className="space-y-3 mb-6 mt-auto">
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
                            <div>
                                <div className="px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg text-orange-600 text-xs inline-flex items-center gap-2 font-semibold">
                                    <Zap size={12} /> High Risk / High Reward
                                </div>
                            </div>
                        </div>

                        {/* Path 3: The Direct Path */}
                        <div className="bg-[#FAF8F5] rounded-3xl p-8 border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                    <Award size={28} />
                                </div>
                                <div>
                                    <div className="text-blue-500 font-bold tracking-widest text-xs uppercase">The Direct Path</div>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                No dorms, no debt. We partner with accredited universities to let you
                                earn a Bachelor&apos;s degree entirely on-site or remote.
                            </p>
                            <ul className="space-y-3 mb-6 mt-auto">
                                {[
                                    "Arizona State University",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div>
                                <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-xs inline-flex items-center gap-2 font-semibold">
                                    <Award size={12} /> Speed: 2-3 Years Total
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                LEARNING THROUGH PLAY — GAME-BASED APPROACH
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-white border-b border-[#8B2332]/10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-[#C9B47C] font-bold tracking-widest text-xs uppercase mb-2 block">Our Secret Weapon</span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-6">
                            College Classes, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9B47C] to-[#A89560]">Disguised as Games.</span>
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            Students don&apos;t want to sit through lectures. So we turned university coursework into
                            side quests and skill trees. They&apos;re earning real college credit &mdash;
                            they just don&apos;t realize how hard they&apos;re working.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {[
                            {
                                title: 'Side Quests',
                                description: 'Every lecture becomes a playable mission. Students explore branching storylines where their choices determine what they learn next — like a choose-your-own-adventure textbook.',
                                color: '#8B2332',
                            },
                            {
                                title: 'Skill Trees',
                                description: 'Inspired by RPGs, students unlock abilities as they master subjects. Visual progress tracking makes it impossible to fall behind — and hooked to get ahead.',
                                color: '#C9B47C',
                            },
                            {
                                title: 'AI Narrator',
                                description: 'Adapts to each student\'s pace, identifies knowledge gaps in real-time, and reroutes their learning path — like GPS for education.',
                                color: '#10b981',
                            },
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 rounded-2xl bg-[#FAF8F5] border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all">
                                <h3 className="text-xl font-serif font-bold text-[#2D2D2D] mb-3">{feature.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* How it works in practice */}
                    <div className="bg-[#FAF8F5] rounded-3xl border border-slate-200 p-8 md:p-12">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-6">
                                    How an 11-Year-Old Takes a UC Berkeley Physics Class
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { step: '1', text: 'Our AI watches the lecture and generates an interactive "Side Quest" with branching choices and embedded quiz checkpoints.' },
                                        { step: '2', text: 'The student plays through the mission like a game — exploring concepts, making decisions, and earning XP for correct reasoning.' },
                                        { step: '3', text: 'Wrong answers don\'t mean failure. The AI uses "Productive Failure" — routing students into harder paths that build deeper understanding.' },
                                        { step: '4', text: 'At the end they take the real exam and earn the credit that counts.' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8B2332] text-white flex items-center justify-center font-bold text-sm shadow-md">
                                                {item.step}
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed pt-1">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#8B2332] to-[#C9B47C] rounded-2xl blur-[80px] opacity-10" />
                                <div className="relative bg-white border border-slate-200 rounded-2xl p-2 shadow-2xl">
                                    <img
                                        src="/images/storyboard/8_experience_first_concept_second.png"
                                        alt="University School Side Quest Interface"
                                        className="rounded-xl w-full h-auto"
                                    />
                                </div>
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
                                <a
                                    href="mailto:info@universityschool.ai"
                                    className="bg-[#8B2332] text-white px-8 py-4 rounded-2xl font-bold transition-transform hover:scale-105 shadow-lg flex items-center gap-2"
                                >
                                    Get Your Analysis <ArrowRight size={18} />
                                </a>
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
