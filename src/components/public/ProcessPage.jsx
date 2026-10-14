import React, { useState } from 'react';
import {
    ArrowRight,
    Sparkles,
    BookOpen,
    Compass,
    Users,
    Award,
    CheckCircle2,
    Zap,
    Wind,
    Settings,
    GraduationCap,
    Laptop,
    Tablet,
    Tv,
    Building2,
} from 'lucide-react';

const PROCESS_PILLAR_TILES = [
    {
        step: 'Step 01',
        name: 'Accredited Syllabus',
        tagline: 'Start with a real partner university course.',
        image: '/images/visuals/student_campus_lookup.jpg',
        icon: BookOpen,
    },
    {
        step: 'Step 02',
        name: 'Live the Story Lab',
        tagline: 'Test real physics with the Wrights & Earhart.',
        image: '/images/visuals/kitty_hawk_1_live.jpg',
        icon: Compass,
    },
    {
        step: 'Step 03',
        name: 'Co-Op Discovery Squad',
        tagline: 'Solve problems in 4-student teams.',
        image: '/images/visuals/channel_centers.jpg',
        icon: Users,
    },
    {
        step: 'Step 04',
        name: 'Earn Credits & Degrees',
        tagline: 'Pass university exams & stack credentials.',
        image: '/images/visuals/kitty_hawk_3_flight.jpg',
        icon: Award,
    },
];

const CURRICULUM_COMPARISON_MODULES = [
    {
        id: 'module-1',
        topic: 'Module 1: Forces, Equilibrium & Newton’s Laws',
        traditional: {
            heading: 'Chapter 1.1–1.2: Kinematics & Newton’s Second Law',
            format: 'Lecture Video (45 min) + Textbook Reading (pp. 1–38)',
            content:
                'Students begin by memorizing vector notation, free-body diagram conventions, and the formula ΣF = m · a in abstract Cartesian coordinates before seeing any physical engineering application.',
            assignment: 'Complete End-of-Chapter Problem Set #1–18 on a blank worksheet alone.',
            outcome: 'High cognitive fatigue; equations feel disconnected from physical reality.',
        },
        interactiveXP: {
            era: 'Dayton, Ohio · Wright Cycle Company (1899)',
            notice: 'HELP WANTED — Mechanical Assistance Needed',
            prompt:
                'You step into Wilbur and Orville Wright’s bicycle shop. Their early glider pitches violently in gusting winds. Before touching a single formula, you adjust wing surface area, pilot position, and tether tension on the workbench.',
            decisionOptions: [
                'Option A: Increase wing surface area without shifting center of gravity (Glider stalls)',
                'Option B: Balance lift center with pilot mass & add forward elevator control (+250 XP)',
                'Option C: Add heavier oak framing for strength (Weight exceeds Lift)',
            ],
            formalUnlock:
                'Once your glider stabilizes in the wind tunnel, the AI Narrator reveals the exact university physics you just discovered: ΣF = m · a and rotational torque equilibrium.',
            reward: '+250 Engineering XP · Unlocks ASU PHY 121 Module 1 Mastery',
            image: '/images/visuals/kitty_hawk_1_live.jpg',
        },
    },
    {
        id: 'module-2',
        topic: 'Module 2: Fluid Dynamics, Camber & Aerodynamic Lift',
        traditional: {
            heading: 'Chapter 2.1–2.4: Bernoulli’s Equation & Lift Coefficients',
            format: 'Slide Deck (62 slides) + Derivation Handout',
            content:
                'Students are presented with L = ½ · ρ · v² · S · C_L and asked to plug numbers into pressure differential equations without ever testing how wing curvature behaves in real airflow.',
            assignment: 'Memorize airfoil terminology and complete a timed multiple-choice quiz.',
            outcome: 'Students can plug numbers into a formula today, but forget why it works next week.',
        },
        interactiveXP: {
            era: 'Dayton Wind Tunnel Lab · 1901 (With Wilbur Wright & Amelia Earhart)',
            notice: 'WIND TUNNEL TRIALS — 200 Miniature Brass Airfoils',
            prompt:
                'Published lift tables from Lilienthal are wrong—the 1901 glider is only producing one-third of its predicted lift! Alongside Wilbur Wright and aviation pioneer Amelia Earhart, you build a 6-foot wooden wind tunnel to test camber ratios directly.',
            decisionOptions: [
                'Option A: Use high-camber 1-in-12 thick curvature (High drag at speed)',
                'Option B: Test 1-in-20 parabolically cambered airfoil at 5° angle of attack (+350 XP)',
                'Option C: Pitch nose above 18° to force climb (Boundary layer separation / stall)',
            ],
            formalUnlock:
                'After watching laminar smoke streamlines curve over your brass wing, you derive L = ½ · ρ · v² · S · C_L directly from your own wind-tunnel telemetry.',
            reward: '+350 Engineering XP · Unlocks ASU FSE 100 Aerodynamics Lab Credit',
            image: '/images/visuals/kitty_hawk_2_decision.jpg',
        },
    },
    {
        id: 'module-3',
        topic: 'Module 3: Propulsion, Drag & Powered Flight Integration',
        traditional: {
            heading: 'Chapter 3.1–3.5: Work, Energy, Thrust & Drag Polar Curves',
            format: 'Recorded Whiteboard Lecture + Midterm Exam',
            content:
                'Thrust, mechanical efficiency, and induced drag are taught as isolated algebraic chapters. Students never experience how changing one subsystem cascades across an entire aircraft.',
            assignment: 'Midterm exam covering Chapters 1–3 with zero hands-on synthesis.',
            outcome: 'High drop-out rate in freshman engineering courses.',
        },
        interactiveXP: {
            era: 'Kill Devil Hills, Kitty Hawk · December 17, 1903',
            notice: 'FIRST POWERED FLIGHT — Launch Rail Configuration',
            prompt:
                'Freezing 27 mph headwinds sweep across the Carolina dunes. Your 4-person Co-Op Discovery Squad must balance the custom 12-horsepower aluminum engine, counter-rotating twin propellers, and wing-warping controls for the 120-foot flight.',
            decisionOptions: [
                'Option A: Single propeller with high RPM (Torque roll pulls wingtip into sand)',
                'Option B: Counter-rotating twin chains + hip-cradle wing warping (+500 XP · Flight Success!)',
                'Option C: Launch downwind for higher ground speed (Insufficient airspeed over wings)',
            ],
            formalUnlock:
                'Your Flyer lifts off the rail and covers 852 feet on its fourth trial. You now complete the Socratic University Exam Prep and lock in 3.0 accredited university credits.',
            reward: '+500 Engineering XP · Ready for Proctored University Credit Exam',
            image: '/images/visuals/kitty_hawk_3_flight.jpg',
        },
    },
];

export const ProcessPage = ({ onNavigate }) => {
    const [activeModuleIdx, setActiveModuleIdx] = useState(0);
    const activeModule = CURRICULUM_COMPARISON_MODULES[activeModuleIdx];

    return (
        <div className="flex flex-col pb-20 bg-[#FAF8F5]">
            {/* ═══════════════════════════════════════════════════════════
                1. FULL-BLEED DARK BURGUNDY & GOLD HERO (MATCHES LANDING TILES)
                ═══════════════════════════════════════════════════════════ */}
            <section className="relative bg-[#1F070B] text-white overflow-hidden border-b border-[#C9B47C]/30">
                <div className="relative min-h-[560px] flex flex-col justify-between">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/visuals/hero_mentors_scene.jpg"
                            alt="University School student learning with Orville & Wilbur Wright, Albert Einstein, Nikola Tesla, and Amelia Earhart"
                            className="w-full h-full object-cover object-right-top opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1F070B] via-[#1F070B]/90 sm:via-[#1F070B]/65 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#190508] via-[#190508]/90 to-transparent" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 w-full">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B2332]/90 border border-[#E6C687]/40 text-[#E6C687] text-xs font-bold uppercase tracking-[0.2em] mb-5">
                                <Sparkles size={14} /> The University School Pedagogical Engine
                            </div>

                            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight leading-[1.03] mb-5 drop-shadow-lg">
                                Experience First.<br />
                                <span className="text-[#E6C687]">Equations Second.</span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-100/95 leading-relaxed mb-6 max-w-xl drop-shadow">
                                How does an 11-year-old master university-level engineering, biomedics, business, or law? By replacing passive chapter memorization with our <strong className="text-[#E6C687]">Interactive XP Curriculum Model</strong>&mdash;living the breakthrough moments first, then acing the university exams to earn real college degrees.
                            </p>

                            <div className="flex flex-wrap items-center gap-3.5">
                                <button
                                    onClick={() => onNavigate && onNavigate('asu-demo')}
                                    className="group bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] hover:from-[#F7E0AD] hover:to-[#D4AF6A] text-[#23090D] px-7 py-4 rounded-2xl font-bold text-base shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-all flex items-center gap-2.5"
                                >
                                    <Zap size={18} className="text-[#8B2332]" />
                                    Try Live 1903 Wright Brothers Lab
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => onNavigate && onNavigate('students')}
                                    className="bg-[#8B2332]/90 hover:bg-[#A3293B] border border-[#E6C687]/50 text-white px-6 py-4 rounded-2xl font-bold text-sm sm:text-base shadow-xl transition-all"
                                >
                                    Explore 4 Knowledge Schools
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 4 Docked Process Pillar Tiles (Matches First Tiles on Landing Page) */}
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {PROCESS_PILLAR_TILES.map((tile, i) => (
                                <div
                                    key={i}
                                    className="group relative rounded-2xl overflow-hidden border border-[#E6C687]/35 bg-[#140709]/95 text-left shadow-xl"
                                >
                                    <div className="h-28 w-full overflow-hidden relative">
                                        <img
                                            src={tile.image}
                                            alt={tile.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#140709] via-[#140709]/35 to-transparent" />
                                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#8B2332] border border-[#E6C687]/50 text-[#E6C687] text-[10px] font-bold uppercase tracking-wider">
                                            {tile.step}
                                        </span>
                                    </div>
                                    <div className="px-4 pb-4 pt-1.5 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-[#E6C687]/15 border border-[#E6C687]/40 flex items-center justify-center text-[#E6C687] shrink-0">
                                            <tile.icon size={18} />
                                        </div>
                                        <div>
                                            <div className="font-serif font-bold text-white text-base leading-tight">
                                                {tile.name}
                                            </div>
                                            <div className="text-[11px] text-slate-300 leading-snug mt-0.5">
                                                {tile.tagline}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                2. SIDE-BY-SIDE CURRICULUM ARCHITECTURE
                   (Frank's Traditional Chapter Model vs. Interactive XP Model)
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#FAF8F5] border-b border-[#8B2332]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#8B2332] block mb-2">
                            Curriculum Transformation · Dynamics Through the Wright Brothers
                        </span>
                        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2D2D] mb-4">
                            Traditional Chapter Instruction vs. <span className="text-[#8B2332]">Interactive XP Model</span>
                        </h2>
                        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                            Select any university physics &amp; engineering module below to see how University School transforms standard chapter-based coursework into a first-person 1903 mission.
                        </p>
                    </div>

                    {/* Module Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        {CURRICULUM_COMPARISON_MODULES.map((mod, idx) => (
                            <button
                                key={mod.id}
                                onClick={() => setActiveModuleIdx(idx)}
                                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
                                    activeModuleIdx === idx
                                        ? 'bg-[#1F070B] text-[#E6C687] border-[#E6C687] shadow-xl'
                                        : 'bg-white text-slate-700 border-slate-200 hover:border-[#8B2332]/40'
                                }`}
                            >
                                {mod.topic}
                            </button>
                        ))}
                    </div>

                    {/* Side-by-Side Comparison Cards */}
                    <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                        {/* Left 5 Cols: Traditional Chapter-Based Model */}
                        <div className="lg:col-span-5 bg-white rounded-3xl p-7 border border-slate-200 shadow-lg flex flex-col justify-between">
                            <div>
                                <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-4">
                                    Traditional Chapter-Based Instruction
                                </div>
                                <h3 className="font-serif text-2xl font-bold text-slate-800 mb-2">
                                    {activeModule.traditional.heading}
                                </h3>
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">
                                    {activeModule.traditional.format}
                                </div>

                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-5">
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                        How Traditional Courses Teach It:
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {activeModule.traditional.content}
                                    </p>
                                </div>

                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                        Standard Assignment:
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        {activeModule.traditional.assignment}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 italic">
                                Result: {activeModule.traditional.outcome}
                            </div>
                        </div>

                        {/* Right 7 Cols: University School Interactive XP Model */}
                        <div className="lg:col-span-7 bg-[#1F070B] text-white rounded-3xl overflow-hidden border border-[#E6C687]/45 shadow-2xl flex flex-col justify-between">
                            <div className="h-52 relative overflow-hidden">
                                <img
                                    src={activeModule.interactiveXP.image}
                                    alt={activeModule.interactiveXP.era}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1F070B] via-[#1F070B]/40 to-transparent" />
                                <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B2332] border border-[#E6C687]/50 text-[#E6C687] text-[10px] font-bold uppercase tracking-widest">
                                        <Sparkles size={11} /> University School Interactive XP Model
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-black/70 border border-[#E6C687]/40 text-white text-[10px] font-bold">
                                        {activeModule.interactiveXP.era}
                                    </span>
                                </div>
                            </div>

                            <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                                {/* Notice Box */}
                                <div className="bg-[#F5EBDC] text-[#2B0A10] rounded-2xl p-5 border border-[#C9B47C] shadow-inner">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#8B2332] mb-1">
                                        Historical Mission Dispatch
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-[#1F070B] mb-2">
                                        &ldquo;{activeModule.interactiveXP.notice}&rdquo;
                                    </h3>
                                    <p className="text-xs sm:text-sm text-[#2B0A10]/90 leading-relaxed">
                                        {activeModule.interactiveXP.prompt}
                                    </p>
                                </div>

                                {/* First-Person Decisions */}
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-[#E6C687] mb-2.5">
                                        First-Person Engineering Decisions:
                                    </div>
                                    <div className="space-y-2">
                                        {activeModule.interactiveXP.decisionOptions.map((opt, i) => (
                                            <div
                                                key={i}
                                                className={`px-4 py-2.5 rounded-xl text-xs font-medium border ${
                                                    i === 1
                                                        ? 'bg-[#8B2332]/40 border-[#E6C687] text-white font-bold'
                                                        : 'bg-black/30 border-white/10 text-slate-300'
                                                }`}
                                            >
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Concept Second Unlock */}
                                <div className="bg-black/35 border border-[#E6C687]/30 rounded-2xl p-4">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#E6C687] mb-1">
                                        Experience First &rarr; Formal University Physics Second
                                    </div>
                                    <p className="text-xs text-slate-200 leading-relaxed">
                                        {activeModule.interactiveXP.formalUnlock}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-[#E6C687]/20 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#E6C687]">
                                    <span>{activeModule.interactiveXP.reward}</span>
                                    <button
                                        onClick={() => onNavigate && onNavigate('asu-demo')}
                                        className="underline hover:text-white transition-colors"
                                    >
                                        Launch Interactive Lab &rarr;
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                3. SOCRATIC UNIVERSITY EXAM PREP & DEGREE COMPLETION
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#19090D] text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#E6C687] block mb-2">
                            Academic Integrity &amp; Real Mastery
                        </span>
                        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
                            How Students Ace Accredited <span className="text-[#E6C687]">University Exams.</span>
                        </h2>
                        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                            Our AI Narrator never does the work for the student. Instead, it bridges every historical mission directly to the university&apos;s official problem sets, labs, and proctored exams so students earn their college degrees with genuine mastery.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {[
                            {
                                step: 'Phase 1',
                                title: 'Historical Intuition',
                                desc: 'Build physical intuition by testing wing camber, molecular diagnostics, industrial supply chains, or constitutional briefs in first person.',
                            },
                            {
                                step: 'Phase 2',
                                title: 'Socratic Equation Bridge',
                                desc: 'Connect every experimental outcome to the university syllabus formulas, guided step-by-step by Socratic hints rather than spoon-fed answers.',
                            },
                            {
                                step: 'Phase 3',
                                title: 'University Transcript Credit',
                                desc: "Complete the partner university's official exams and assignments to lock in accredited credits toward certificates, associate degrees, and bachelor's degrees.",
                            },
                        ].map((card, i) => (
                            <div
                                key={i}
                                className="bg-[#140709] border border-[#E6C687]/35 rounded-3xl p-7 shadow-xl flex flex-col justify-between"
                            >
                                <div>
                                    <span className="inline-block px-3 py-1 rounded-full bg-[#8B2332] border border-[#E6C687]/40 text-[#E6C687] text-xs font-bold uppercase tracking-widest mb-4">
                                        {card.step}
                                    </span>
                                    <h3 className="font-serif text-2xl font-bold text-white mb-3">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        {card.desc}
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-[#E6C687]/20 text-xs font-bold text-[#E6C687] flex items-center gap-2">
                                    <CheckCircle2 size={15} /> Verified University Mastery
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => onNavigate && onNavigate('asu-demo')}
                            className="bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] hover:from-[#F7E0AD] hover:to-[#D4AF6A] text-[#23090D] px-9 py-4 rounded-2xl font-bold text-base shadow-xl inline-flex items-center gap-3 transition-all"
                        >
                            <Sparkles size={18} className="text-[#8B2332]" />
                            Test the 1903 Wright Flyer &amp; Socratic Exam Coach
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};
