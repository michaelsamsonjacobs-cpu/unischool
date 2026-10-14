import React, { useState } from 'react';
import {
    ArrowRight,
    ChevronRight,
    Trophy,
    Users,
    Zap,
    Sparkles,
    GraduationCap,
    Target,
    Star,
    Play,
    CheckCircle2,
    Compass,
    Cpu,
    Briefcase,
    Scale,
    HeartPulse,
    Tv,
    Tablet,
    Laptop,
    Building2,
    Wind,
    Gauge,
    RotateCcw,
    BookOpen,
    Award,
} from 'lucide-react';
import { FAQSection } from './FAQSection';
import { StudentSuccessStories } from './StudentSuccessStories';
import { CLEPSection } from './CLEPSection';

const STORYBOARD_STEPS = [
    {
        step: '01',
        title: 'Choose Your Knowledge School',
        subtitle: 'Same Knowledge. Different Stories.',
        desc: 'Students pick a world that excites them—Biomedics, Engineering, Business, or Law & Public Service—while mastering the exact same university syllabus.',
        mentor: 'Orville & Wilbur Wright · Marie Curie · Abraham Lincoln',
        badge: '4 Knowledge Schools',
    },
    {
        step: '02',
        title: 'Live the Experience in First Person',
        subtitle: 'Kitty Hawk, North Carolina · 1903',
        desc: '"The wind is picking up over the dunes. If we increase the wing angle now, we get more lift—or we stall and crash into the sand."',
        mentor: 'AI Narrator: Wilbur Wright',
        badge: 'UC Berkeley Physics 7A · Dynamics',
    },
    {
        step: '03',
        title: 'Make the Engineering Decision',
        subtitle: 'Active Agency Over Passive Video',
        desc: 'Instead of watching a 45-minute lecture, you test wing camber, launch mass, and propeller thrust directly inside the workshop.',
        mentor: 'Interactive Side Quest',
        badge: 'Decision Node 05',
    },
    {
        step: '04',
        title: 'See the Real Consequence',
        subtitle: 'Learn by Getting It Wrong',
        desc: 'Too much angle pitches the nose up and stalls the glider. Productive failure makes the underlying physics unforgettable before any formula appears.',
        mentor: 'Flight Log · Iteration 1',
        badge: 'Stall Angle Exceeded (18° > 15°)',
    },
    {
        step: '05',
        title: 'Recalibrate & Fly',
        subtitle: 'Iterative Mastery',
        desc: 'Lower the angle of attack to 9° and shift the pilot center of gravity forward. The Flyer lifts cleanly off the rail and holds steady flight.',
        mentor: 'Flight Log · Iteration 2',
        badge: 'Sustained Lift Achieved',
    },
    {
        step: '06',
        title: 'Experience First. Concept Second.',
        subtitle: 'The Story Disappears. The Knowledge Remains.',
        desc: 'Only after you fly the Wright Flyer does your field notebook crystallize what you discovered into formal university physics: Net Force, Lift vs. Drag, and Vector Components.',
        mentor: 'University Credit Unlocked',
        badge: '8 / 12 Concepts Mastered',
    },
];

const KNOWLEDGE_SCHOOLS = [
    {
        name: 'Biomedics',
        tagline: 'Improve and extend human life',
        mentor: 'Mentored by pioneers like Marie Curie',
        description: 'Step into the lab to solve cellular biology, genetics, biomechanics, and physiology challenges while earning pre-med university credit.',
        color: '#10b981',
        gradient: 'from-emerald-700 to-teal-900',
        icon: HeartPulse,
        traits: ['Cellular Biology', 'Genetics & DNA', 'Human Physiology'],
    },
    {
        name: 'Engineering',
        tagline: "Build what's next",
        mentor: 'Mentored by Orville & Wilbur Wright, Tesla & Einstein',
        description: 'Design airfoils at Kitty Hawk, plot orbital trajectories, and master university physics, calculus, and robotics through live simulations.',
        color: '#8B2332',
        gradient: 'from-[#8B2332] to-[#601a25]',
        icon: Cpu,
        traits: ['Applied Physics', 'Aerospace & Robotics', 'Systems Thinking'],
    },
    {
        name: 'Business',
        tagline: 'Create value. Make an impact',
        mentor: 'Mentored by legendary industrial & modern founders',
        description: 'Scale production lines, allocate capital, and navigate high-stakes market decisions to master microeconomics, finance, and strategy.',
        color: '#C9B47C',
        gradient: 'from-[#C9B47C] to-[#8a7642]',
        icon: Briefcase,
        traits: ['Entrepreneurship', 'Microeconomics', 'Strategic Decisions'],
    },
    {
        name: 'Law & Public Service',
        tagline: 'Lead. Serve. Make a difference',
        mentor: 'Mentored by leaders like Abraham Lincoln',
        description: 'Argue landmark constitutional cases, draft policy, and negotiate treaties alongside historical leaders in law and governance.',
        color: '#2D2D2D',
        gradient: 'from-[#2D2D2D] to-[#4a4a4a]',
        icon: Scale,
        traits: ['Constitutional Law', 'Ethics & Policy', 'Public Leadership'],
    },
];

export const LandingPage = ({ onNavigate }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState('B');
    const [wingAngle, setWingAngle] = useState(9);
    const [sledMass, setSledMass] = useState(75);

    const scrollToStory = () => {
        const el = document.getElementById('live-story');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const isStall = wingAngle > 14;
    const liftRatio = Math.min(1.4, Math.max(0.4, ((wingAngle * 11.5) / sledMass).toFixed(2)));

    return (
        <div className="flex flex-col pb-20">
            {/* ═══════════════════════════════════════════════════════════
                HERO SECTION — "Don't Just Learn It. Live It. Starts at 11."
                ═══════════════════════════════════════════════════════════ */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-12">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[#FAF8F5]">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#8B2332]/5 to-[#FAF8F5] opacity-60" />
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8B2332]/20 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 h-[20vh] bg-gradient-to-t from-[#FAF8F5] to-transparent" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
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
                                Hours of video. Pages of reading. Tests that don&apos;t stick. Traditional online classes make students wait.
                                Step into first-person historical &amp; scientific missions guided by your AI Narrator and earn real, transferable university credit early.
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

                        {/* Right: Interactive Live AI Narrator Mission & Mastery Card */}
                        <div className="lg:col-span-6 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#C9B47C]/25 to-[#8B2332]/15 rounded-3xl blur-[60px]" />

                            <div className="relative bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-2xl">
                                {/* Top Header */}
                                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-200/60">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#8B2332] to-[#C9B47C] flex items-center justify-center shadow-md">
                                        <Compass size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-[#2D2D2D] text-sm">AI Narrator · Engineering School</div>
                                        <div className="text-xs text-[#8B2332] font-semibold">Kitty Hawk, 1903 &mdash; Orville &amp; Wilbur Wright</div>
                                    </div>
                                    <div className="ml-auto px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                                        Physics 7A Credit
                                    </div>
                                </div>

                                {/* Live First-Person Prompt */}
                                <div className="bg-[#0A1628] text-white rounded-2xl p-4 mb-4 border border-slate-800">
                                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#C9B47C] font-bold mb-1.5">
                                        <span>First-Person Challenge · Side Quest 04</span>
                                        <span>Wind: 24 mph NNE</span>
                                    </div>
                                    <p className="font-serif text-sm md:text-base text-slate-100 leading-snug mb-3">
                                        &ldquo;The Flyer is losing speed on the launch rail. How do we generate enough lift before the dune drops off?&rdquo;
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'A', label: 'Pitch Wing to 18°', status: 'Stalls! Too much drag.' },
                                            { id: 'B', label: 'Set 9° + Lighten Sled', status: 'Balanced lift! Airborne.' },
                                            { id: 'C', label: 'Double Rail Friction', status: 'Too slow to lift off.' },
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setSelectedChoice(opt.id)}
                                                className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                                                    selectedChoice === opt.id
                                                        ? 'bg-[#8B2332] border-[#C9B47C] text-white font-bold shadow-md'
                                                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                                }`}
                                            >
                                                <span className="text-[#C9B47C] font-bold mr-1">{opt.id}.</span>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                                        <span className="text-slate-300">
                                            <strong className="text-[#C9B47C]">Outcome:</strong>{' '}
                                            {selectedChoice === 'B'
                                                ? 'Lift exceeds weight without stalling — Newton’s 2nd Law unlocked!'
                                                : selectedChoice === 'A'
                                                ? 'Airflow separates above 15° — productive failure reveals drag!'
                                                : 'Net horizontal force drops — try adjusting angle & mass.'}
                                        </span>
                                    </div>
                                </div>

                                {/* Mini Mastery Metrics (from Slide 9: 68% Overall Progress) */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {[
                                        { label: 'Concepts Mastered', val: '8 / 12', pct: 68, color: '#8B2332' },
                                        { label: 'Side Quests', val: '6 / 8', pct: 75, color: '#C9B47C' },
                                        { label: 'Skills Built', val: '5 / 8', pct: 63, color: '#10b981' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-[#FAF8F5] rounded-xl p-3 border border-slate-200/70">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</div>
                                            <div className="text-sm font-bold text-[#2D2D2D]">{stat.val}</div>
                                            <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${stat.pct}%`, backgroundColor: stat.color }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Progress Summary */}
                                <div className="bg-gradient-to-r from-[#8B2332]/5 to-[#C9B47C]/10 rounded-xl p-4 border border-[#C9B47C]/30">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs font-bold text-[#8B2332] uppercase tracking-wider">Engineering University Course Progress</span>
                                        <span className="text-sm font-bold text-[#2D2D2D]">68%</span>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-[#8B2332] to-[#C9B47C] w-[68%]" />
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2 font-medium">
                                        <span>Experience first. Concept second.</span>
                                        <span className="text-[#8B2332] font-bold">Ready for Credit Exam &rarr;</span>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Accent Badges */}
                            <div className="hidden sm:flex absolute -top-4 -right-4 bg-[#C9B47C] text-[#0A1628] px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-lg">
                                Same Knowledge · Different Stories
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
                EXPERIENCE FIRST, CONCEPT SECOND — Interactive Kitty Hawk Lab
                ═══════════════════════════════════════════════════════════ */}
            <section id="live-story" className="py-24 bg-[#0A1628] text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-15 pointer-events-none">
                    <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[#8B2332] blur-[140px]" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#C9B47C] blur-[140px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Problem vs. Active Experience Header */}
                    <div className="grid lg:grid-cols-12 gap-10 items-center mb-16">
                        <div className="lg:col-span-6">
                            <span className="text-[#C9B47C] font-bold tracking-widest text-xs uppercase mb-3 block">
                                Experience First · Concept Second
                            </span>
                            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 leading-tight">
                                What if you could <span className="text-[#C9B47C] italic">live</span> knowledge instead of just memorizing it?
                            </h2>
                            <p className="text-lg text-slate-300 leading-relaxed">
                                In traditional online classes, students watch hours of passive video before they ever touch a real problem.
                                At University School, an 11-year-old starts inside the workshop—making decisions, seeing physical consequences, and discovering the laws of nature firsthand.
                            </p>
                        </div>

                        {/* Contrast Cards: Passive vs. Lived */}
                        <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">Traditional Online Class</div>
                                <h4 className="font-serif text-xl font-bold text-white mb-3">He Is Not Learning. He Is Waiting.</h4>
                                <ul className="space-y-2.5 text-sm text-slate-400">
                                    <li>&bull; 45-minute passive video lectures</li>
                                    <li>&bull; Dense textbook chapters with zero context</li>
                                    <li>&bull; Standardized multiple-choice drills that don&apos;t stick</li>
                                </ul>
                            </div>
                            <div className="bg-gradient-to-br from-[#8B2332]/40 to-[#C9B47C]/20 border border-[#C9B47C]/40 rounded-2xl p-6 shadow-xl">
                                <div className="text-xs font-bold uppercase tracking-wider text-[#C9B47C] mb-2">University School</div>
                                <h4 className="font-serif text-xl font-bold text-white mb-3">First-Person Apprenticeship</h4>
                                <ul className="space-y-2.5 text-sm text-slate-200">
                                    <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#C9B47C] shrink-0" /> Solve real problems alongside Einstein &amp; the Wright Brothers</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#C9B47C] shrink-0" /> Productive failure turns mistakes into intuition</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#C9B47C] shrink-0" /> Story dissolves into real university exam mastery</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Interactive 6-Step Mission & Physics Sandbox */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-6 md:p-10 mb-20">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-[#C9B47C]">
                                    Interactive Mission Walkthrough &middot; UC Berkeley Physics 7A
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
                                        {item.step}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                            {/* Left Interactive Sandbox Panel */}
                            <div className="lg:col-span-7 bg-[#060E1A] rounded-2xl border border-[#C9B47C]/30 p-6 flex flex-col justify-between">
                                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9B47C]">
                                        <Wind size={16} /> Kitty Hawk Wind-Tunnel &amp; Flight Sandbox
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-semibold">
                                        {STORYBOARD_STEPS[activeStep].badge}
                                    </span>
                                </div>

                                {/* Live Interactive Vector / Airfoil Visualizer */}
                                <div className="my-6 bg-[#0B192E] rounded-xl p-5 border border-white/10">
                                    <div className="grid sm:grid-cols-2 gap-6 items-center">
                                        <div>
                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                                                    <span>Wing Angle of Attack (&alpha;)</span>
                                                    <span className="text-[#C9B47C] font-bold">{wingAngle}&deg;</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="2"
                                                    max="20"
                                                    value={wingAngle}
                                                    onChange={(e) => setWingAngle(Number(e.target.value))}
                                                    className="w-full accent-[#C9B47C] cursor-pointer"
                                                />
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                                                    <span>Flyer + Sled Mass (m)</span>
                                                    <span className="text-[#C9B47C] font-bold">{sledMass} kg</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="55"
                                                    max="120"
                                                    value={sledMass}
                                                    onChange={(e) => setSledMass(Number(e.target.value))}
                                                    className="w-full accent-[#8B2332] cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-black/30 rounded-xl p-4 border border-white/10 text-center">
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                                                Live Flight Telemetry
                                            </div>
                                            <div className={`text-2xl font-serif font-bold mb-1 ${isStall ? 'text-rose-400' : liftRatio >= 1.0 ? 'text-emerald-400' : 'text-amber-300'}`}>
                                                {isStall ? 'AERODYNAMIC STALL' : liftRatio >= 1.0 ? 'SUSTAINED FLIGHT' : 'INSUFFICIENT LIFT'}
                                            </div>
                                            <div className="text-xs text-slate-300 mb-3">
                                                Lift-to-Weight Ratio: <strong>{liftRatio}x</strong>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/5 rounded-lg p-2">
                                                <div>
                                                    <span className="text-slate-400 block">Formal Concept</span>
                                                    <strong className="text-[#C9B47C]">&Sigma;F = m &middot; a</strong>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block">Vector Split</span>
                                                    <strong className="text-white">F_x = F cos(&theta;)</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 4 Pillars Revealed After Experience */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                                    {[
                                        { k: '1. Learn', v: 'Aerodynamics & Lift' },
                                        { k: '2. Experience', v: 'Forces & Motion' },
                                        { k: '3. Analyze', v: 'Weight & Balance' },
                                        { k: '4. Apply', v: 'Iterative Design' },
                                    ].map((pill, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                                            <div className="text-[10px] font-bold uppercase text-[#C9B47C]">{pill.k}</div>
                                            <div className="text-xs font-semibold text-white mt-0.5">{pill.v}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Step Description */}
                            <div className="lg:col-span-5 flex flex-col justify-between bg-white/5 rounded-2xl p-6 border border-white/10">
                                <div>
                                    <div className="inline-block px-3 py-1 rounded-full bg-[#8B2332] text-white text-xs font-bold uppercase tracking-wider mb-3">
                                        {STORYBOARD_STEPS[activeStep].subtitle}
                                    </div>
                                    <h4 className="font-serif text-2xl font-bold text-white mb-3">
                                        {STORYBOARD_STEPS[activeStep].title}
                                    </h4>
                                    <p className="text-slate-300 text-base leading-relaxed mb-5">
                                        {STORYBOARD_STEPS[activeStep].desc}
                                    </p>
                                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                                        <strong className="text-[#C9B47C] uppercase tracking-wider block mb-1">Active Guide</strong>
                                        {STORYBOARD_STEPS[activeStep].mentor}
                                    </div>
                                </div>

                                <div className="pt-5 mt-6 border-t border-white/10 flex items-center justify-between">
                                    <button
                                        onClick={() => setActiveStep((prev) => (prev === 0 ? STORYBOARD_STEPS.length - 1 : prev - 1))}
                                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold transition-colors"
                                    >
                                        &larr; Previous
                                    </button>
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                        Step {activeStep + 1} of {STORYBOARD_STEPS.length}
                                    </span>
                                    <button
                                        onClick={() => setActiveStep((prev) => (prev + 1) % STORYBOARD_STEPS.length)}
                                        className="px-5 py-2.5 rounded-xl bg-[#8B2332] hover:bg-[#a62b3d] text-white text-sm font-bold transition-colors flex items-center gap-1.5"
                                    >
                                        Next Step <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3 Narrative Outcome Pillars (Native UI Cards for Mastery, Learn Anywhere, and 5-Step University Outcomes) */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1: Real Mastery */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-7 flex flex-col justify-between">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9B47C]">Your Actions Create Progress</span>
                                <h4 className="font-serif text-2xl font-bold text-white mt-1 mb-3">
                                    Now You See What They Built.
                                </h4>
                                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                    The story disappears. The knowledge remains. Every decision updates real-time university concept mastery.
                                </p>
                            </div>
                            <div className="space-y-2.5 bg-black/30 rounded-2xl p-4 border border-white/10 text-xs">
                                <div className="flex justify-between"><span className="text-slate-300">Concepts Mastered</span><strong className="text-emerald-400">8 / 12</strong></div>
                                <div className="flex justify-between"><span className="text-slate-300">Experiences Completed</span><strong className="text-[#C9B47C]">3 / 5</strong></div>
                                <div className="flex justify-between"><span className="text-slate-300">Practice Activities</span><strong className="text-white">6 / 8</strong></div>
                            </div>
                        </div>

                        {/* Card 2: Learn Anywhere, Belong Somewhere */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-7 flex flex-col justify-between">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9B47C]">Community &amp; Locations</span>
                                <h4 className="font-serif text-2xl font-bold text-white mt-1 mb-3">
                                    Learn Anywhere. Belong Somewhere.
                                </h4>
                                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                    You are not learning alone. Find your people by passion—online from home or together at local University School Nodes.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2.5 text-xs">
                                {[
                                    { icon: Building2, label: 'Local Nodes' },
                                    { icon: Tablet, label: 'Tablet App' },
                                    { icon: Laptop, label: 'Computer' },
                                    { icon: Tv, label: 'TV App' },
                                ].map((ch, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-xl p-2.5 text-slate-200 font-semibold">
                                        <ch.icon size={15} className="text-[#C9B47C]" />
                                        {ch.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Card 3: Real University Outcomes */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-7 flex flex-col justify-between">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9B47C]">Real University Outcomes</span>
                                <h4 className="font-serif text-2xl font-bold text-white mt-1 mb-3">
                                    Not Behind. Years Ahead.
                                </h4>
                                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                    A clear 5-step ladder from age 11 to official university-issued credit and credentials:
                                </p>
                            </div>
                            <div className="space-y-1.5 text-xs">
                                {[
                                    '1. Start at Age 11+',
                                    '2. Enroll in Real University Course',
                                    '3. Live the Knowledge via AI Narrator',
                                    '4. Complete University Requirements',
                                    '5. Earn Official University Credit',
                                ].map((step, i) => (
                                    <div key={i} className="px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-slate-200 font-medium flex items-center justify-between">
                                        <span>{step}</span>
                                        <CheckCircle2 size={13} className="text-[#C9B47C]" />
                                    </div>
                                ))}
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

                    {/* 4 Knowledge Schools Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
                        {KNOWLEDGE_SCHOOLS.map((school, i) => (
                            <div key={i} className="group relative bg-white rounded-3xl border border-slate-200 hover:border-[#C9B47C] p-7 hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between">
                                <div>
                                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${school.gradient}`} />

                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${school.gradient} flex items-center justify-center text-white mb-5 shadow-md group-hover:scale-110 transition-transform`}>
                                        <school.icon size={26} />
                                    </div>

                                    <h3 className="font-serif text-2xl font-bold text-[#2D2D2D] mb-1">{school.name}</h3>
                                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: school.color }}>
                                        {school.tagline}
                                    </p>
                                    <p className="text-xs font-semibold text-slate-500 mb-3 italic">
                                        {school.mentor}
                                    </p>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                        {school.description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
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

                    {/* Starts at 11: A Bigger Future, Sooner (Native UI Banner inspired by Slide 11) */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-lg">
                        <div className="grid lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-5">
                                <span className="text-xs font-bold uppercase tracking-widest text-[#8B2332]">
                                    Starts at Age 11 &middot; A Bigger Future, Sooner
                                </span>
                                <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#2D2D2D] mt-2 mb-4">
                                    Same Knowledge. Different Stories.
                                </h3>
                                <p className="text-slate-600 text-base leading-relaxed">
                                    Starting university-level thinking at 11 compounds every single year—giving students the time to explore multiple fields, build real portfolios, and belong to a community of builders.
                                </p>
                            </div>
                            <div className="lg:col-span-7 grid sm:grid-cols-4 gap-4">
                                {[
                                    { age: 'Age 11–12', title: 'Build Early', desc: 'Discover physics, biomedics & logic through lived stories' },
                                    { age: 'Age 13–14', title: 'Explore More', desc: 'Complete transferable general-ed & STEM side quests' },
                                    { age: 'Age 15–16', title: 'Get Ahead', desc: 'Stack university credits & launch a standout Spike project' },
                                    { age: 'Age 17–18', title: 'Belong Sooner', desc: 'Step into top universities or graduate years early' },
                                ].map((stage, i) => (
                                    <div key={i} className="bg-[#FAF8F5] rounded-2xl p-4 border border-slate-200/80 flex flex-col justify-between">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B2332]">{stage.age}</span>
                                        <div className="font-serif font-bold text-lg text-[#2D2D2D] my-1.5">{stage.title}</div>
                                        <p className="text-xs text-slate-600 leading-relaxed">{stage.desc}</p>
                                    </div>
                                ))}
                            </div>
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
