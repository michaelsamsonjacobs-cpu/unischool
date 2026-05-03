import React from 'react';
import { ArrowRight, ChevronRight, Map, Trophy, Users, Zap, Sparkles, GraduationCap, BookOpen, Brain, Target, Star } from 'lucide-react';

export const LandingPage = ({ onNavigate }) => {
    return (
        <div className="flex flex-col pb-20">
            {/* ═══════════════════════════════════════════════════════════
                HERO SECTION — "Start college at 14."
                ═══════════════════════════════════════════════════════════ */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[#FAF8F5]">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#8B2332]/5 to-[#FAF8F5] opacity-60" />
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8B2332]/20 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 h-[20vh] bg-gradient-to-t from-[#FAF8F5] to-transparent" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Copy */}
                        <div className="text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9B47C]/10 border border-[#C9B47C]/20 text-[#C9B47C] text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in-up">
                                <Sparkles size={12} /> Project Hyper-Accelerate
                            </div>

                            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-[#2D2D2D] tracking-tight mb-8 leading-[1.05]">
                                Start college<br />
                                at <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9B47C] to-[#A89560]">14</span>.
                            </h1>

                            <p className="max-w-lg text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                                Traditional school is a conveyor belt. We built a spaceship.
                                Join an educational strategy game designed to launch you into
                                the world's top universities 2 years early.
                            </p>

                            {/* Split CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => onNavigate('students')}
                                    className="group relative overflow-hidden bg-[#8B2332] hover:bg-[#a62b3d] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-3"
                                >
                                    <Trophy size={18} />
                                    I am an Ambitious Student
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => onNavigate('franchise')}
                                    className="group bg-white hover:bg-[#C9B47C]/10 border-2 border-[#C9B47C]/30 hover:border-[#C9B47C] text-[#2D2D2D] px-8 py-4 rounded-2xl font-bold transition-all shadow-sm hover:shadow-lg flex items-center gap-3"
                                >
                                    <GraduationCap size={18} className="text-[#C9B47C]" />
                                    Open a University School
                                    <ArrowRight size={16} className="text-[#C9B47C] group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Right: Floating Navigator Preview Card */}
                        <div className="hidden lg:block relative">
                            {/* Glow behind card */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#C9B47C]/20 to-[#8B2332]/10 rounded-3xl blur-[60px]" />

                            {/* Main glassmorphic card */}
                            <div className="relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-200/60">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#8B2332] to-[#C9B47C] flex items-center justify-center shadow-lg">
                                        <Zap size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-[#2D2D2D] text-sm">Navigator Dashboard</div>
                                        <div className="text-xs text-[#C9B47C] font-semibold">Guest Preview</div>
                                    </div>
                                    <div className="ml-auto flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#C9B47C]" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                                    </div>
                                </div>

                                {/* Mini skill tree preview */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {[
                                        { label: 'Physics I', xp: '2,400 XP', pct: 85, color: '#8B2332' },
                                        { label: 'Calculus AB', xp: '1,800 XP', pct: 72, color: '#C9B47C' },
                                        { label: 'English 1A', xp: '3,100 XP', pct: 95, color: '#10b981' },
                                    ].map((skill, i) => (
                                        <div key={i} className="bg-[#FAF8F5] rounded-xl p-3 border border-slate-100">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{skill.label}</div>
                                            <div className="text-sm font-bold text-[#2D2D2D]">{skill.xp}</div>
                                            <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${skill.pct}%`, backgroundColor: skill.color }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Progress summary */}
                                <div className="bg-gradient-to-r from-[#8B2332]/5 to-[#C9B47C]/5 rounded-xl p-4 border border-[#C9B47C]/20">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-[#8B2332] uppercase tracking-wider">Transfer Progress</span>
                                        <span className="text-sm font-bold text-[#2D2D2D]">67%</span>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-[#8B2332] to-[#C9B47C] w-[67%]" />
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-2">18 of 27 units completed → UC Santa Barbara guaranteed</div>
                                </div>
                            </div>

                            {/* Floating accent badges */}
                            <div className="absolute -top-4 -right-4 bg-[#C9B47C] text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                                ⚡ Level 12
                            </div>
                            <div className="absolute -bottom-3 -left-3 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg">
                                🏆 3 Boss Battles Won
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                GOLDEN LEVEL-UP PATH — Stats Band
                ═══════════════════════════════════════════════════════════ */}
            <section className="relative py-20 bg-white border-y border-[#C9B47C]/20 overflow-hidden">
                {/* Subtle golden gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#C9B47C]/5 via-transparent to-[#C9B47C]/5" />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Golden connecting line (desktop only) */}
                    <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#C9B47C]/20 via-[#C9B47C]/40 to-[#C9B47C]/20 -translate-y-1/2" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 relative">
                        {[
                            { label: "Partner Universities", value: "60+", icon: GraduationCap },
                            { label: "Transfer Guarantee", value: "100%", icon: Target },
                            { label: "Avg. Graduation Age", value: "19", icon: Star },
                            { label: "Tuition Saved", value: "$80k+", icon: Sparkles },
                        ].map((stat, i) => (
                            <div key={i} className="text-center relative group">
                                {/* Gold dot connector */}
                                <div className="hidden md:flex absolute -top-3 left-1/2 -translate-x-1/2 items-center justify-center z-10">
                                    <div className="w-5 h-5 rounded-full bg-[#C9B47C] border-[3px] border-white shadow-md group-hover:scale-125 transition-transform" />
                                </div>
                                <div className="bg-[#FAF8F5] rounded-2xl p-6 pt-8 border border-[#C9B47C]/15 hover:border-[#C9B47C]/40 hover:shadow-lg transition-all">
                                    <stat.icon size={22} className="mx-auto text-[#C9B47C] mb-3" />
                                    <div className="text-3xl lg:text-4xl font-bold text-[#2D2D2D] mb-2 font-serif">{stat.value}</div>
                                    <div className="text-[10px] font-bold text-[#8B2332] uppercase tracking-wider">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                MEET YOUR AI NAVIGATORS — Persona Cards
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[#C9B47C] font-bold tracking-widest text-xs uppercase mb-3 block">Your Navigator</span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-6">
                            Meet Your AI Navigators
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            Choose your mentor personality. Each Navigator uses a different teaching philosophy
                            to guide you through university coursework — like having a personal professor who never sleeps.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                name: 'Socrates',
                                style: 'Socratic Inquiry',
                                description: 'Answers questions with deeper questions. Guides students to discover concepts through dialogue, contradiction, and self-reflection — never giving the answer directly.',
                                color: '#8B2332',
                                gradient: 'from-[#8B2332] to-[#601a25]',
                                emoji: '🏛️',
                                traits: ['Critical Thinking', 'Deep Analysis', 'Self-Discovery'],
                            },
                            {
                                name: 'Jarvis',
                                style: 'Strategic Planning',
                                description: 'An ultra-efficient AI strategist who builds personalized learning roadmaps, optimizes study schedules, and ensures zero wasted effort on the path to transfer.',
                                color: '#C9B47C',
                                gradient: 'from-[#C9B47C] to-[#A89560]',
                                emoji: '🤖',
                                traits: ['Efficiency', 'Goal Setting', 'Time Optimization'],
                            },
                            {
                                name: 'Mentor',
                                style: 'Industry Insider',
                                description: 'A warm, experienced guide who connects academic concepts to real-world careers. Shares industry stories, professional skills, and practical wisdom beyond the textbook.',
                                color: '#2D2D2D',
                                gradient: 'from-[#2D2D2D] to-[#4a4a4a]',
                                emoji: '🎓',
                                traits: ['Career Focus', 'Real-World Skills', 'Networking'],
                            },
                        ].map((nav, i) => (
                            <div key={i} className="group relative bg-white rounded-3xl border border-slate-200 hover:border-slate-300 p-8 hover:shadow-xl transition-all overflow-hidden">
                                {/* Accent top bar */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${nav.gradient}`} />

                                {/* Avatar */}
                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${nav.gradient} flex items-center justify-center text-4xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                    {nav.emoji}
                                </div>

                                <h3 className="font-serif text-2xl font-bold text-[#2D2D2D] mb-1">{nav.name}</h3>
                                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: nav.color }}>{nav.style}</p>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">{nav.description}</p>

                                {/* Trait tags */}
                                <div className="flex flex-wrap gap-2">
                                    {nav.traits.map((trait, j) => (
                                        <span key={j} className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border" style={{ color: nav.color, borderColor: `${nav.color}30`, backgroundColor: `${nav.color}08` }}>
                                            {trait}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                PHILOSOPHY — The Navigator Is Not a Teacher
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-white">
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
                                onClick={() => onNavigate('process')}
                                className="text-[#8B2332] border-b-2 border-[#C9B47C] pb-1 hover:text-[#C9B47C] transition-colors font-semibold"
                            >
                                See Our Process &rarr;
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#8B2332] to-[#C9B47C] rounded-3xl blur-2xl opacity-15" />
                            <div className="relative bg-[#FAF8F5] border border-slate-200 rounded-3xl p-8 shadow-xl">
                                <div className="text-center mb-6">
                                    <span className="text-xs font-bold text-[#C9B47C] uppercase tracking-widest">How It Feels</span>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { emoji: '🗺️', label: 'Side Quests', desc: 'Replace homework with real-world missions' },
                                        { emoji: '⚔️', label: 'Boss Battles', desc: 'Replace exams with skill demonstrations' },
                                        { emoji: '🌳', label: 'Skill Trees', desc: 'Track progress like a strategy game' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-slate-100 hover:border-[#C9B47C]/30 hover:shadow-md transition-all">
                                            <div className="text-3xl">{item.emoji}</div>
                                            <div>
                                                <div className="font-bold text-[#2D2D2D] text-sm">{item.label}</div>
                                                <div className="text-xs text-slate-500">{item.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
