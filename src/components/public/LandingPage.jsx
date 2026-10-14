import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Trophy, Users, Zap, Sparkles, GraduationCap, Target, Star, Play, CheckCircle2, Compass, Cpu, Briefcase, Scale, HeartPulse } from 'lucide-react';
import { FAQSection } from './FAQSection';
import { StudentSuccessStories } from './StudentSuccessStories';
import { CLEPSection } from './CLEPSection';

const STORYBOARD_STEPS = [
    {
        step: '01',
        title: 'Choose Your School',
        subtitle: 'Biomedics, Engineering, Business, or Law',
        desc: 'Students pick a domain that excites them and step directly into real historical and scientific turning points.',
        image: '/images/storyboard/3_choose_engineering.png',
    },
    {
        step: '02',
        title: 'Live the Experience',
        subtitle: 'Kitty Hawk, 1903 — Wright Brothers',
        desc: '"Orville, the wind is picking up... If we increase the wing angle now, we get more lift — or we stall and crash."',
        image: '/images/storyboard/4_engineering_live_experience.png',
    },
    {
        step: '03',
        title: 'Make a Decision',
        subtitle: 'First-Person Agency',
        desc: 'What do you change? A) Increase wing angle, B) Reduce weight, or C) Adjust propeller power. You make the call.',
        image: '/images/storyboard/5_make_a_decision.png',
    },
    {
        step: '04',
        title: 'See the Consequence',
        subtitle: 'Learn by Getting It Wrong',
        desc: 'Too much angle—you gained lift, then lost control. Every mistake reveals how the underlying physics actually works.',
        image: '/images/storyboard/6_see_the_consequence.png',
    },
    {
        step: '05',
        title: 'Try Again & Succeed',
        subtitle: 'Iterative Mastery',
        desc: 'Recalibrate weight and balance. Now it flies—unlocking deep intuition before a single textbook formula appears.',
        image: '/images/storyboard/7_try_again.png',
    },
    {
        step: '06',
        title: 'Experience First. Concept Second.',
        subtitle: 'Mapped to Real College Credit',
        desc: 'Lift vs. Drag, Weight & Balance, and Control are mastered in context—earning XP toward transferable university credit.',
        image: '/images/storyboard/8_experience_first_concept_second.png',
    },
];

const KNOWLEDGE_SCHOOLS = [
    {
        name: 'Biomedics',
        tagline: 'Improve and extend human life',
        description: 'Step into the lab with pioneers of genetics, cellular biology, neuroscience, and modern medicine while earning pre-med university credits.',
        color: '#10b981',
        gradient: 'from-emerald-700 to-teal-900',
        icon: HeartPulse,
        traits: ['Cellular Biology', 'Genetics', 'Human Physiology'],
    },
    {
        name: 'Engineering',
        tagline: "Build what's next",
        description: 'Fly with the Wright Brothers, design orbital trajectories, and master physics, calculus, and robotics through first-person simulations.',
        color: '#8B2332',
        gradient: 'from-[#8B2332] to-[#601a25]',
        icon: Cpu,
        traits: ['Applied Physics', 'Aerospace & Robotics', 'Systems Thinking'],
    },
    {
        name: 'Business',
        tagline: 'Create value. Make an impact',
        description: 'Launch ventures, allocate capital, and navigate high-stakes market decisions to master microeconomics, finance, and strategy.',
        color: '#C9B47C',
        gradient: 'from-[#C9B47C] to-[#8a7642]',
        icon: Briefcase,
        traits: ['Entrepreneurship', 'Economics', 'Strategic Decisions'],
    },
    {
        name: 'Law & Public Service',
        tagline: 'Lead. Serve. Make a difference',
        description: 'Argue landmark constitutional cases, draft policy, and negotiate treaties alongside historical leaders in law and governance.',
        color: '#2D2D2D',
        gradient: 'from-[#2D2D2D] to-[#4a4a4a]',
        icon: Scale,
        traits: ['Constitutional Law', 'Ethics & Policy', 'Public Leadership'],
    },
];

export const LandingPage = ({ onNavigate }) => {
    const [activeStep, setActiveStep] = useState(0);

    const scrollToStory = () => {
        const el = document.getElementById('live-story');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col pb-20">
            {/* ═══════════════════════════════════════════════════════════
                HERO SECTION — "Don't Just Learn It. Live It. Start at 11."
                ═══════════════════════════════════════════════════════════ */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-12">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[#FAF8F5]">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#8B2332]/5 to-[#FAF8F5] opacity-60" />
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8B2332]/20 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 h-[20vh] bg-gradient-to-t from-[#FAF8F5] to-transparent" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
                    <div className="grid lg:grid-cols-12 gap-10 items-center">
                        {/* Left: Copy */}
                        <div className="text-left lg:col-span-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9B47C]/15 border border-[#C9B47C]/30 text-[#8B2332] text-xs font-bold uppercase tracking-widest mb-6">
                                <Sparkles size={12} className="text-[#C9B47C]" /> Real People. Real Challenges. Real You.
                            </div>

                            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-[#2D2D2D] tracking-tight mb-6 leading-[1.05]">
                                Don&apos;t Just Learn It.<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B2332] via-[#a62b3d] to-[#C9B47C]">
                                    Live It.
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl font-serif font-semibold text-[#2D2D2D] mb-4">
                                Starts at <span className="text-[#8B2332] underline decoration-[#C9B47C] decoration-2 underline-offset-4">11</span>. Goes as far as you do.
                            </p>

                            <p className="max-w-lg text-base md:text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                                Learning doesn&apos;t have to be boring. Step into interactive first-person missions guided by your AI Narrator, build real projects, and earn transferable university credits years ahead of schedule.
                            </p>

                            {/* Split CTAs */}
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => onNavigate('students')}
                                    className="group relative overflow-hidden bg-[#8B2332] hover:bg-[#a62b3d] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-3"
                                >
                                    <Trophy size={18} />
                                    Start at 11
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={scrollToStory}
                                    className="group bg-white hover:bg-[#C9B47C]/10 border-2 border-[#C9B47C]/40 hover:border-[#C9B47C] text-[#2D2D2D] px-7 py-4 rounded-2xl font-bold transition-all shadow-sm hover:shadow-lg flex items-center gap-3"
                                >
                                    <Play size={18} className="text-[#8B2332] fill-[#8B2332]" />
                                    Watch How It Works
                                </button>
                            </div>
                        </div>

                        {/* Right: Hero Visual from Frank's Storyboard */}
                        <div className="lg:col-span-6 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#C9B47C]/30 to-[#8B2332]/15 rounded-3xl blur-[50px]" />

                            <div className="relative bg-white/90 backdrop-blur-xl border border-[#C9B47C]/30 rounded-3xl p-3 shadow-2xl">
                                <img
                                    src="/images/storyboard/2_university_school_home.png"
                                    alt="Don't Just Learn It. Live It. Starts at 11."
                                    className="w-full h-auto rounded-2xl shadow-inner object-cover"
                                />
                                <div className="mt-3 px-3 py-2 flex items-center justify-between text-xs text-slate-600 bg-[#FAF8F5] rounded-xl border border-slate-200/70">
                                    <span className="font-bold text-[#8B2332] uppercase tracking-wider flex items-center gap-1.5">
                                        <Compass size={14} className="text-[#C9B47C]" /> First-Person AI Narrator Missions
                                    </span>
                                    <span className="font-semibold text-slate-700">60+ Partner Universities</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                GOLDEN LEVEL-UP PATH — Stats Band
                ═══════════════════════════════════════════════════════════ */}
            <section className="relative py-16 bg-white border-y border-[#C9B47C]/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#C9B47C]/5 via-transparent to-[#C9B47C]/5" />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#C9B47C]/20 via-[#C9B47C]/40 to-[#C9B47C]/20 -translate-y-1/2" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 relative">
                        {[
                            { label: "Partner Universities", value: "60+", icon: GraduationCap },
                            { label: "Credits Transferable", value: "100%", icon: Target },
                            { label: "Start Age", value: "11+", icon: Star },
                            { label: "Tuition Saved", value: "$80k+", icon: Sparkles },
                        ].map((stat, i) => (
                            <div key={i} className="text-center relative group">
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
                STORY HOOK — Landing Page 1..3 + Interactive Storyboard
                ═══════════════════════════════════════════════════════════ */}
            <section id="live-story" className="py-24 bg-[#0A1628] text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-15 pointer-events-none">
                    <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[#8B2332] blur-[140px]" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#C9B47C] blur-[140px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Problem vs. Vision Contrast (Landing Page 1) */}
                    <div className="grid lg:grid-cols-12 gap-10 items-center mb-20">
                        <div className="lg:col-span-5">
                            <div className="rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
                                <img
                                    src="/images/storyboard/1_traditional_learning.jpg"
                                    alt="Traditional Passive Learning"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-7">
                            <span className="text-[#C9B47C] font-bold tracking-widest text-xs uppercase mb-3 block">
                                Why Traditional Online School Fails
                            </span>
                            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 leading-tight">
                                Hours of video. Pages of reading. Tests that don&apos;t stick.
                            </h2>
                            <p className="text-xl text-slate-300 mb-6 leading-relaxed">
                                He is not learning. <span className="text-white font-semibold">He is waiting.</span>
                            </p>
                            <p className="text-lg text-[#C9B47C] font-serif italic mb-8">
                                &ldquo;Build something real. Start college early. Experience first, concept second.&rdquo;
                            </p>
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200">
                                <Sparkles size={16} className="text-[#C9B47C]" />
                                Click through the 6-step mission below to see how an 11-year-old learns aerospace physics:
                            </div>
                        </div>
                    </div>

                    {/* Interactive 6-Step Mission Player (Slides 3 to 8) */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-6 md:p-10 mb-20">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-[#C9B47C]">
                                    Interactive Mission Walkthrough
                                </span>
                                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mt-1">
                                    {STORYBOARD_STEPS[activeStep].step}. {STORYBOARD_STEPS[activeStep].title}
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {STORYBOARD_STEPS.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveStep(idx)}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                            activeStep === idx
                                                ? 'bg-[#C9B47C] text-[#0A1628] shadow-lg scale-105'
                                                : 'bg-white/10 text-slate-300 hover:bg-white/20'
                                        }`}
                                    >
                                        {item.step} {item.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-8">
                                <div className="rounded-2xl overflow-hidden border border-[#C9B47C]/30 shadow-2xl bg-black/40">
                                    <img
                                        src={STORYBOARD_STEPS[activeStep].image}
                                        alt={STORYBOARD_STEPS[activeStep].title}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                            <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
                                <div>
                                    <div className="inline-block px-3 py-1 rounded-full bg-[#8B2332] text-white text-xs font-bold uppercase tracking-wider mb-3">
                                        {STORYBOARD_STEPS[activeStep].subtitle}
                                    </div>
                                    <h4 className="font-serif text-2xl font-bold text-white mb-4">
                                        {STORYBOARD_STEPS[activeStep].title}
                                    </h4>
                                    <p className="text-slate-300 text-base leading-relaxed">
                                        {STORYBOARD_STEPS[activeStep].desc}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                    <button
                                        onClick={() => setActiveStep((prev) => (prev === 0 ? STORYBOARD_STEPS.length - 1 : prev - 1))}
                                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold transition-colors"
                                    >
                                        &larr; Previous
                                    </button>
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                        Scene {activeStep + 1} of {STORYBOARD_STEPS.length}
                                    </span>
                                    <button
                                        onClick={() => setActiveStep((prev) => (prev + 1) % STORYBOARD_STEPS.length)}
                                        className="px-5 py-2.5 rounded-xl bg-[#8B2332] hover:bg-[#a62b3d] text-white text-sm font-bold transition-colors flex items-center gap-1.5"
                                    >
                                        Next Scene <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3 Narrative Outcome Pillars (Landing Page 2 & 3 + Slides 9, 10, 12) */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col">
                            <img
                                src="/images/storyboard/9_progress_updated.png"
                                alt="Engineering Learning Progress 68%"
                                className="w-full h-48 object-cover border-b border-white/10"
                            />
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9B47C]">Real Mastery</span>
                                    <h4 className="font-serif text-xl font-bold text-white mt-1 mb-2">
                                        Now You See What They Built.
                                    </h4>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        Every decision updates real-time skill mastery across Problem Solving, Systems Thinking, and Applied Physics.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col">
                            <img
                                src="/images/storyboard/12_learn_anywhere_belong_somewhere.png"
                                alt="Learn Anywhere. Belong Somewhere."
                                className="w-full h-48 object-cover border-b border-white/10"
                            />
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9B47C]">Community & Nodes</span>
                                    <h4 className="font-serif text-xl font-bold text-white mt-1 mb-2">
                                        Learn Anywhere. Belong Somewhere.
                                    </h4>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        You are not learning alone. Find your people by passion—online from home or together at local University School locations.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col">
                            <img
                                src="/images/storyboard/10_real_university_outcomes.png"
                                alt="Real University Outcomes"
                                className="w-full h-48 object-cover border-b border-white/10"
                            />
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9B47C]">Real University Outcomes</span>
                                    <h4 className="font-serif text-xl font-bold text-white mt-1 mb-2">
                                        Not Behind. Years Ahead.
                                    </h4>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        Earn real university credits, build a standout portfolio, and unlock pathways to MIT, Stanford, UC Berkeley, and 60+ partners.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                MEET YOUR AI NARRATOR & KNOWLEDGE SCHOOLS (Website 1 & 1.1)
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-6">
                            Meet Your AI Narrator
                        </h2>
                        <p className="text-slate-600 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
                            Your AI Narrator guides you through the story &mdash; Einstein, Wright Brothers, whoever fits the subject.
                            You play in first person making the decisions and learn by getting it wrong.
                        </p>
                    </div>

                    {/* 4 Knowledge Schools Grid (Replacing Socrates/Jarvis/Mentor per Website 1.1 & Slide 13) */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
                        {KNOWLEDGE_SCHOOLS.map((school, i) => (
                            <div key={i} className="group relative bg-white rounded-3xl border border-slate-200 hover:border-[#C9B47C] p-7 hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between">
                                <div>
                                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${school.gradient}`} />

                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${school.gradient} flex items-center justify-center text-white mb-5 shadow-md group-hover:scale-110 transition-transform`}>
                                        <school.icon size={26} />
                                    </div>

                                    <h3 className="font-serif text-2xl font-bold text-[#2D2D2D] mb-1">{school.name}</h3>
                                    <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: school.color }}>
                                        {school.tagline}
                                    </p>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                        {school.description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                                    {school.traits.map((trait, j) => (
                                        <span
                                            key={j}
                                            className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                                            style={{
                                                color: school.color,
                                                borderColor: `${school.color}30`,
                                                backgroundColor: `${school.color}08`,
                                            }}
                                        >
                                            {trait}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Visual Banner from Storyboard Slide 11 & 13 */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-white p-2">
                            <img
                                src="/images/storyboard/13_explore_your_future.png"
                                alt="Explore Your Future Across Knowledge Schools"
                                className="w-full h-auto rounded-2xl object-cover"
                            />
                        </div>
                        <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-white p-2">
                            <img
                                src="/images/storyboard/11_starts_at_age_11.png"
                                alt="Starts at Age 11 — Path to Top Universities"
                                className="w-full h-auto rounded-2xl object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                PHILOSOPHY — The Narrator is Not a Professor. (Website 1.2)
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-6 leading-tight">
                                The Narrator is Not a Professor.
                            </h2>
                            <p className="text-slate-600 text-xl mb-8 leading-relaxed">
                                University School transforms college coursework into interactive missions.
                                Your AI Narrator doesn&apos;t just grade you&mdash;it guides you through a personalized skill tree mapped directly to college transfer requirements.
                            </p>
                            <ul className="space-y-6">
                                {[
                                    "Real-time XP tracking for academic progress",
                                    "College graduates oversee every subject"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium text-lg">
                                        <div className="h-8 w-8 rounded-full bg-[#8B2332] flex items-center justify-center text-white shadow-md flex-shrink-0">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
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

            {/* ═══════════════════════════════════════════════════════════
                ASU DEMO CALLOUT — "Experience the Transformation"
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-gradient-to-br from-[#0A1628] to-[#1a1a2e] text-white relative overflow-hidden border-t border-[#C9B47C]/20">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#C9B47C] blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#8B2332] blur-[100px]" />
                </div>
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9B47C]/10 border border-[#C9B47C]/20 text-[#C9B47C] text-xs font-bold uppercase tracking-widest mb-6">
                        <Sparkles size={12} className="animate-pulse" /> Try it now
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                        Transform Dry Lectures into Immersive Quests
                    </h2>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                        Watch how we take a standard, whiteboard-based ASU Online college lecture and morph it instantly into an interactive strategy game built for ambitious students starting at age 11.
                    </p>
                    <button
                        onClick={() => onNavigate('asu-demo')}
                        className="group bg-[#8B2332] hover:bg-[#a62b3d] border border-[#C9B47C]/30 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-3 active:scale-[0.98]"
                    >
                        <Zap size={18} className="text-[#C9B47C]" />
                        Launch ASU Course Transformer Demo
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                CLEP PREPARATION SECTION
                ═══════════════════════════════════════════════════════════ */}
            <CLEPSection onNavigate={onNavigate} />

            {/* ═══════════════════════════════════════════════════════════
                STUDENT SUCCESS STORIES
                ═══════════════════════════════════════════════════════════ */}
            <StudentSuccessStories />

            {/* ═══════════════════════════════════════════════════════════
                FAQ SECTION
                ═══════════════════════════════════════════════════════════ */}
            <FAQSection />
        </div>
    );
};
