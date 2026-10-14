import React, { useState } from 'react';
import {
    ArrowRight,
    Sparkles,
    GraduationCap,
    HeartPulse,
    Settings,
    Briefcase,
    Scale,
    CheckCircle2,
    Users,
    Award,
    BookOpen,
    Compass,
    Zap,
    Play,
    ShieldCheck,
    Layers,
} from 'lucide-react';

const KNOWLEDGE_SCHOOLS = [
    {
        id: 'engineering',
        name: 'School of Engineering',
        shortName: 'Engineering',
        tagline: "Build what's next. From 1903 flight to modern robotics & AI.",
        heroImage: '/images/visuals/school_portrait_engineering.jpg',
        cardImage: '/images/visuals/hero_card_engineering.jpg',
        sceneImage: '/images/visuals/kitty_hawk_1_live.jpg',
        icon: Settings,
        mentors: ['Orville & Wilbur Wright', 'Amelia Earhart', 'Nikola Tesla', 'Albert Einstein'],
        featuredCampaign: {
            era: 'Dayton & Kitty Hawk · 1899–1903',
            noticeTitle: 'HELP WANTED — Mechanical Assistance Needed',
            noticeSub: 'Posted Inside Wright Cycle Co., Dayton, Ohio',
            summary:
                'Step into the Wright Cycle Company workshop and the windswept dunes of Kill Devil Hills. Discover Newton’s Second Law (F = ma), airfoil camber, pressure differentials, and three-axis control by building and flying the 1903 Wright Flyer.',
            xpReward: '+1,250 Engineering XP',
            creditMap: 'Maps to FSE 100 (Intro to Engineering) & PHY 121 (University Physics I: Mechanics)',
        },
        courses: [
            { code: 'FSE 100', title: 'Introduction to Engineering: Aerodynamics & Design', credits: '3.0 Accredited Credits' },
            { code: 'PHY 121', title: 'University Physics I: Mechanics, Force & Motion', credits: '4.0 Accredited Credits' },
            { code: 'MAT 265', title: 'Calculus for Engineers I', credits: '4.0 Accredited Credits' },
            { code: 'CSE 110', title: 'Principles of Programming & Autonomous Systems', credits: '3.0 Accredited Credits' },
        ],
        degreeOutcome: 'B.S. in Engineering / Aerospace & Autonomous Systems Certificates',
    },
    {
        id: 'biomedics',
        name: 'School of Biomedics',
        shortName: 'Biomedics',
        tagline: 'Improve and extend human life through cellular discovery.',
        heroImage: '/images/visuals/school_portrait_biomedics.jpg',
        cardImage: '/images/visuals/hero_card_biomedics.jpg',
        sceneImage: '/images/visuals/school_portrait_biomedics.jpg',
        icon: HeartPulse,
        mentors: ['Marie Curie', 'Louis Pasteur', 'Rosalind Franklin', 'Alexander Fleming'],
        featuredCampaign: {
            era: 'Paris Radium Institute · 1898–1914',
            noticeTitle: 'LAB APPRENTICE NEEDED — Molecular & Radiological Analysis',
            noticeSub: 'Posted at the Sorbonne Laboratory, Paris',
            summary:
                'Work alongside Marie Curie to isolate novel elements, model cellular pathology, and design life-saving mobile diagnostic units. Connect hands-on laboratory decisions directly to molecular biology and organic chemistry.',
            xpReward: '+1,250 Biomedics XP',
            creditMap: 'Maps to BIO 181 (General Biology I) & CHM 113 (General Chemistry I)',
        },
        courses: [
            { code: 'BIO 181', title: 'General Biology I: Cellular & Molecular Systems', credits: '4.0 Accredited Credits' },
            { code: 'CHM 113', title: 'General Chemistry I: Atomic Structure & Bonding', credits: '4.0 Accredited Credits' },
            { code: 'BIO 201', title: 'Human Anatomy & Physiology I', credits: '4.0 Accredited Credits' },
            { code: 'BME 100', title: 'Introduction to Biomedical Engineering & Diagnostics', credits: '3.0 Accredited Credits' },
        ],
        degreeOutcome: 'B.S. in Biological & Biomedical Sciences / Pre-Med Credentials',
    },
    {
        id: 'business',
        name: 'School of Business',
        shortName: 'Business',
        tagline: 'Create value, scale production, and lead global enterprises.',
        heroImage: '/images/visuals/school_portrait_business.jpg',
        cardImage: '/images/visuals/hero_card_business.jpg',
        sceneImage: '/images/visuals/school_portrait_business.jpg',
        icon: Briefcase,
        mentors: ['Henry Ford', 'Madam C.J. Walker', 'Andrew Carnegie', 'Modern Venture Builders'],
        featuredCampaign: {
            era: 'Highland Park Assembly Plant · 1913',
            noticeTitle: 'OPERATIONS ARCHITECT — Moving Assembly Line Initiative',
            noticeSub: 'Posted at Highland Park Plant, Detroit',
            summary:
                'Redesign the industrial supply chain alongside Henry Ford. Balance unit economics, worker wages, capital allocation, and throughput to make mobility affordable for millions while mastering microeconomics and accounting.',
            xpReward: '+1,250 Business XP',
            creditMap: 'Maps to ECN 212 (Microeconomic Principles) & ACC 231 (Financial Accounting)',
        },
        courses: [
            { code: 'ECN 212', title: 'Microeconomic Principles & Market Design', credits: '3.0 Accredited Credits' },
            { code: 'ACC 231', title: 'Uses of Accounting Information I', credits: '3.0 Accredited Credits' },
            { code: 'MGT 300', title: 'Organization & Management Leadership', credits: '3.0 Accredited Credits' },
            { code: 'FIN 300', title: 'Fundamentals of Finance & Capital Markets', credits: '3.0 Accredited Credits' },
        ],
        degreeOutcome: 'B.S. in Business Administration / Entrepreneurship & Finance Certificates',
    },
    {
        id: 'law',
        name: 'School of Law & Public Service',
        shortName: 'Law & Public Service',
        tagline: 'Lead, advocate, and build constitutional institutions.',
        heroImage: '/images/visuals/school_portrait_law.jpg',
        cardImage: '/images/visuals/hero_card_law.jpg',
        sceneImage: '/images/visuals/school_portrait_law.jpg',
        icon: Scale,
        mentors: ['Abraham Lincoln', 'John Marshall', 'Clara Barton', 'Constitutional Scholars'],
        featuredCampaign: {
            era: 'Philadelphia & Washington · 1787–1863',
            noticeTitle: 'COUNSEL & CONSTITUTIONAL DRAFTER — Federal Union Brief',
            noticeSub: 'Posted at Independence Hall & Executive Chambers',
            summary:
                'Step into pivotal constitutional debates and appellate moot courts with Abraham Lincoln. Draft arguments, weigh precedent, and negotiate civic policy while mastering constitutional law, ethics, and rhetoric.',
            xpReward: '+1,250 Law & Policy XP',
            creditMap: 'Maps to POS 110 (American Government) &CRJ 100 (Intro to Justice Studies)',
        },
        courses: [
            { code: 'POS 110', title: 'American Government & Constitutional Foundations', credits: '3.0 Accredited Credits' },
            { code: 'PHI 103', title: 'Principles of Sound Reasoning & Formal Logic', credits: '3.0 Accredited Credits' },
            { code: 'ENG 101', title: 'First-Year Composition & Legal Rhetoric', credits: '3.0 Accredited Credits' },
            { code: 'PAF 200', title: 'Public Service, Policy & Civic Leadership', credits: '3.0 Accredited Credits' },
        ],
        degreeOutcome: 'B.A. in Law, Public Policy & Civic Leadership / Pre-Law Credentials',
    },
];

const WRIGHT_CAMPAIGN_NODES = [
    {
        step: 'Node 01',
        title: 'The Bicycle Shop Notice (Dayton, 1899)',
        status: 'Completed · +250 XP',
        desc: 'Answer the "HELP WANTED — Mechanical Assistance Needed" notice at Wright Cycle Co. Diagnose why unbalanced thrust and weight cause early gliders to pitch and stall.',
        concept: 'Forces, Equilibrium & Center of Gravity',
        done: true,
    },
    {
        step: 'Node 02',
        title: '1901 Wind Tunnel Airfoil Trials',
        status: 'Completed · +350 XP',
        desc: 'Test 200+ miniature brass wing sections with Wilbur Wright and Amelia Earhart. Adjust camber and angle of attack to maximize lift-to-drag ratios.',
        concept: 'Bernoulli Pressure Differential & Lift Coefficient (C_L)',
        done: true,
    },
    {
        step: 'Node 03',
        title: 'Kill Devil Hills First Flight (Dec 17, 1903)',
        status: 'Active Mission · +400 XP',
        desc: 'Balance twin-propeller thrust against 27 mph headwinds on the wooden launch rail. Apply F = ma to achieve sustained, controlled powered flight.',
        concept: "Newton's Second Law (ΣF = m · a) & Three-Axis Control",
        done: true,
    },
    {
        step: 'Node 04',
        title: 'Accredited University Exam & Credit Lock-In',
        status: 'Ready for Mastery Check · 3.0 Credits',
        desc: 'Translate your lived aerodynamic intuition into formal university equations and complete the proctored partner university assessment.',
        concept: 'Official University Transcript Credit (FSE 100 / PHY 121)',
        done: false,
    },
];

export const StudentPage = ({ onNavigate }) => {
    const [activeSchoolId, setActiveSchoolId] = useState('engineering');
    const activeSchool = KNOWLEDGE_SCHOOLS.find((s) => s.id === activeSchoolId) || KNOWLEDGE_SCHOOLS[0];

    return (
        <div className="flex flex-col pb-20 bg-[#FAF8F5]">
            {/* ═══════════════════════════════════════════════════════════
                1. DARK BURGUNDY & GOLD HERO — MATCHES LANDING PAGE TILES
                ═══════════════════════════════════════════════════════════ */}
            <section className="relative bg-[#1F070B] text-white overflow-hidden border-b border-[#C9B47C]/30">
                <div className="relative min-h-[540px] flex flex-col justify-between">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/visuals/hero_mentors_scene.jpg"
                            alt="University School student collaborating with Orville & Wilbur Wright, Albert Einstein, Nikola Tesla, and Amelia Earhart"
                            className="w-full h-full object-cover object-right-top opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1F070B] via-[#1F070B]/90 sm:via-[#1F070B]/65 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#190508] via-[#190508]/85 to-transparent" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 w-full">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B2332]/90 border border-[#E6C687]/40 text-[#E6C687] text-xs font-bold uppercase tracking-[0.2em] mb-5">
                                <GraduationCap size={14} /> Knowledge Schools · Starting at Age 11
                            </div>

                            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight leading-[1.03] mb-5 drop-shadow-lg">
                                Live the History.<br />
                                <span className="text-[#E6C687]">Earn the Degree.</span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-100/95 leading-relaxed mb-6 max-w-xl drop-shadow">
                                Every accredited university course is transformed into a first-person historical campaign alongside icons like the Wright Brothers, Amelia Earhart, Marie Curie, and Nikola Tesla&mdash;so students starting at 11 earn real college credits, certificates, and full degrees.
                            </p>

                            <div className="flex flex-wrap items-center gap-3.5">
                                <button
                                    onClick={() => onNavigate('asu-demo')}
                                    className="group bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] hover:from-[#F7E0AD] hover:to-[#D4AF6A] text-[#23090D] px-7 py-4 rounded-2xl font-bold text-base shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-all flex items-center gap-2.5"
                                >
                                    <Sparkles size={18} className="text-[#8B2332]" />
                                    Try Interactive Course Demo
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => onNavigate('partners')}
                                    className="bg-[#8B2332]/90 hover:bg-[#A3293B] border border-[#E6C687]/50 text-white px-6 py-4 rounded-2xl font-bold text-sm sm:text-base shadow-xl transition-all flex items-center gap-2"
                                >
                                    Explore 60+ Partner Universities
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 4 Interactive Knowledge School Selector Tiles (Identical Craft to Hero Tiles) */}
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
                        <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6C687] mb-3">
                            Select a Knowledge School to Inspect Curriculum &amp; Degree Track:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {KNOWLEDGE_SCHOOLS.map((school) => {
                                const isSelected = school.id === activeSchoolId;
                                return (
                                    <button
                                        key={school.id}
                                        onClick={() => setActiveSchoolId(school.id)}
                                        className={`group relative rounded-2xl overflow-hidden border text-left shadow-xl transition-all hover:-translate-y-1 ${
                                            isSelected
                                                ? 'border-[#E6C687] ring-2 ring-[#E6C687]/60 bg-[#26090F]'
                                                : 'border-[#E6C687]/30 hover:border-[#E6C687] bg-[#140709]/90'
                                        }`}
                                    >
                                        <div className="h-28 w-full overflow-hidden relative">
                                            <img
                                                src={school.cardImage}
                                                alt={school.shortName}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#140709] via-[#140709]/35 to-transparent" />
                                            {isSelected && (
                                                <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#E6C687] text-[#1F070B] text-[10px] font-bold uppercase tracking-wider shadow">
                                                    Active School
                                                </span>
                                            )}
                                        </div>
                                        <div className="px-4 pb-4 pt-1.5 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-[#E6C687]/15 border border-[#E6C687]/40 flex items-center justify-center text-[#E6C687] shrink-0">
                                                    <school.icon size={18} />
                                                </div>
                                                <div>
                                                    <div className="font-serif font-bold text-white text-base leading-tight">
                                                        {school.shortName}
                                                    </div>
                                                    <div className="text-[11px] text-slate-300 leading-snug mt-0.5 line-clamp-1">
                                                        {school.tagline}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-7 h-7 rounded-full border border-[#E6C687]/50 flex items-center justify-center text-[#E6C687] shrink-0">
                                                <ArrowRight size={13} />
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                2. SELECTED KNOWLEDGE SCHOOL DEEP-DIVE (RICH STUDIO TILE)
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-16 bg-[#FAF8F5] border-b border-[#8B2332]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-[#23090D] to-[#140508] text-white rounded-3xl border border-[#C9B47C]/40 shadow-2xl overflow-hidden">
                        <div className="grid lg:grid-cols-12 gap-0">
                            {/* Left 5 Cols: Portrait Studio Visual + Historical Mentors */}
                            <div className="lg:col-span-5 relative min-h-[420px] flex flex-col justify-end p-6 sm:p-8 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#E6C687]/20">
                                <img
                                    src={activeSchool.heroImage}
                                    alt={activeSchool.name}
                                    className="absolute inset-0 w-full h-full object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#140508] via-[#140508]/65 to-transparent" />

                                <div className="relative z-10">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B2332] border border-[#E6C687]/50 text-[#E6C687] text-xs font-bold uppercase tracking-widest mb-3">
                                        <activeSchool.icon size={13} /> {activeSchool.name}
                                    </span>
                                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">
                                        {activeSchool.tagline}
                                    </h2>
                                    <div className="mt-4 pt-4 border-t border-white/15">
                                        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E6C687] mb-2">
                                            AI Historical Mentors in This School
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {activeSchool.mentors.map((mentor, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 rounded-lg bg-black/50 backdrop-blur-sm border border-[#E6C687]/35 text-xs font-semibold text-white"
                                                >
                                                    {mentor}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right 7 Cols: Featured Historical Story Notice + Accredited University Course Stack */}
                            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                                {/* Historical Campaign Notice (Frank's Interactive XP Model) */}
                                <div className="bg-[#F5EBDC] text-[#2B0A10] rounded-2xl p-6 border border-[#C9B47C] shadow-inner">
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B2332]">
                                            {activeSchool.featuredCampaign.era} · {activeSchool.featuredCampaign.noticeSub}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-[#3A0C14] text-[#E6C687] text-[10px] font-bold">
                                            {activeSchool.featuredCampaign.xpReward}
                                        </span>
                                    </div>
                                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1F070B] mb-2">
                                        &ldquo;{activeSchool.featuredCampaign.noticeTitle}&rdquo;
                                    </h3>
                                    <p className="text-sm text-[#2B0A10]/90 leading-relaxed mb-3">
                                        {activeSchool.featuredCampaign.summary}
                                    </p>
                                    <div className="text-xs font-bold text-[#8B2332] flex items-center gap-2">
                                        <Award size={15} />
                                        {activeSchool.featuredCampaign.creditMap}
                                    </div>
                                </div>

                                {/* Accredited University Courses Transformed in This School */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-serif text-lg font-bold text-[#E6C687] uppercase tracking-wider">
                                            Accredited University Courses &amp; Degree Stack
                                        </h4>
                                        <span className="text-xs text-slate-300">Official University Transcript</span>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {activeSchool.courses.map((course, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-[#1B080C] border border-[#E6C687]/25 rounded-xl p-3.5 flex flex-col justify-between"
                                            >
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#8B2332] text-[#E6C687]">
                                                        {course.code}
                                                    </span>
                                                    <span className="text-[11px] font-semibold text-[#E6C687]">
                                                        {course.credits}
                                                    </span>
                                                </div>
                                                <div className="text-xs font-medium text-white leading-snug mt-1">
                                                    {course.title}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Degree Outcome Footer */}
                                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            Stackable Credential &amp; Degree Target
                                        </div>
                                        <div className="font-serif font-bold text-base text-[#E6C687]">
                                            {activeSchool.degreeOutcome}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onNavigate('asu-demo')}
                                        className="bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] hover:from-[#F7E0AD] hover:to-[#D4AF6A] text-[#23090D] px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all"
                                    >
                                        Experience Sample Lesson
                                        <ArrowRight size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                3. LIVE STUDENT CAMPAIGN & MASTERY COCKPIT
                   (Replaces outdated app-student-cockpit.png screenshot)
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#19090D] text-white border-b border-[#C9B47C]/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#E6C687] block mb-3">
                            Why We Gamify the College Experience
                        </span>
                        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                            <span className="block">Your Story Campaign, XP &amp;</span>
                            <span className="block text-[#E6C687] mt-1">Accredited Degree Ledger.</span>
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            Why use XP, Quests, and Co-Op Squads for college? Because 11–14 year olds thrive when every experiment earns Experience Points (XP), friends collaborate in 4-person discovery squads, and every skill node locks in real university credits toward their degree.
                        </p>
                    </div>

                    {/* Native Dark-Burgundy & Gold Interactive Cockpit */}
                    <div className="bg-[#120609] border border-[#E6C687]/35 rounded-3xl p-6 sm:p-10 shadow-2xl">
                        {/* Cockpit Top Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
                            <div className="flex items-center gap-3.5">
                                <img
                                    src="/images/unischool-logo.png"
                                    alt="University School"
                                    className="w-11 h-11 rounded-xl border border-[#E6C687]/40"
                                />
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-[#E6C687]">
                                        University School · Active Student Campaign
                                    </div>
                                    <div className="font-serif text-xl sm:text-2xl font-bold text-white">
                                        Dynamics Through the Wright Brothers (ASU FSE 100 / PHY 121)
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="px-4 py-2 rounded-xl bg-[#1F0B10] border border-[#E6C687]/30 text-xs">
                                    <span className="text-slate-400 block text-[10px] uppercase">Current Standing</span>
                                    <span className="font-bold text-[#E6C687]">18.0 Accredited University Credits</span>
                                </div>
                                <div className="px-4 py-2 rounded-xl bg-[#8B2332] border border-[#E6C687]/50 text-xs">
                                    <span className="text-[#F5EBDC]/80 block text-[10px] uppercase">Degree Track</span>
                                    <span className="font-bold text-white">B.S. Engineering Pathway</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-8 items-start">
                            {/* Left 7 Cols: 4 Interactive Story Nodes */}
                            <div className="lg:col-span-7 space-y-4">
                                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6C687] mb-2">
                                    Chapter 1 Mission Nodes · Dayton to Kitty Hawk (1899–1903)
                                </div>
                                {WRIGHT_CAMPAIGN_NODES.map((node, i) => (
                                    <div
                                        key={i}
                                        className={`p-5 rounded-2xl border transition-all ${
                                            node.done
                                                ? 'bg-[#1D0B10] border-[#E6C687]/35'
                                                : 'bg-[#2B0E16] border-[#E6C687] shadow-lg'
                                        }`}
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2.5">
                                                <span className="px-2.5 py-0.5 rounded-md bg-[#E6C687] text-[#1F070B] text-xs font-bold">
                                                    {node.step}
                                                </span>
                                                <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                                                    {node.title}
                                                </h3>
                                            </div>
                                            <span className="text-xs font-bold text-[#E6C687]">{node.status}</span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                                            {node.desc}
                                        </p>
                                        <div className="flex items-center justify-between pt-2.5 border-t border-white/10 text-xs">
                                            <span className="text-[#E6C687]/90 font-medium">
                                                Formal Physics Unlocked: <strong className="text-white">{node.concept}</strong>
                                            </span>
                                            <CheckCircle2 size={16} className="text-[#E6C687] shrink-0" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Right 5 Cols: Visual Sim Card + Co-Op Squad + Mastery Gauge */}
                            <div className="lg:col-span-5 space-y-6">
                                {/* Kitty Hawk Visual Preview Card */}
                                <div className="rounded-2xl overflow-hidden border border-[#E6C687]/40 bg-[#1B090E] shadow-xl">
                                    <div className="h-48 relative">
                                        <img
                                            src="/images/visuals/kitty_hawk_3_flight.jpg"
                                            alt="1903 Wright Flyer over Kitty Hawk dunes"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1B090E] via-transparent to-transparent" />
                                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 border border-[#E6C687]/50 text-[#E6C687] text-[10px] font-bold uppercase tracking-widest">
                                            Live Physics Telemetry · Lift &gt; Weight
                                        </span>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <div className="font-serif font-bold text-lg text-white">
                                                    Course Mastery: 88%
                                                </div>
                                                <div className="text-xs text-slate-300">
                                                    Ready for Proctored University Credit Exam
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => onNavigate('asu-demo')}
                                                className="bg-[#8B2332] hover:bg-[#A3293B] border border-[#E6C687]/50 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                                            >
                                                Open Course Demo
                                            </button>
                                        </div>
                                        <div className="w-full h-2.5 rounded-full bg-black/50 overflow-hidden mb-2">
                                            <div className="h-full bg-gradient-to-r from-[#8B2332] to-[#E6C687] w-[88%]" />
                                        </div>
                                        <div className="flex justify-between text-[11px] text-slate-400">
                                            <span>12 / 12 Historical Labs Complete</span>
                                            <span className="text-[#E6C687] font-bold">3.0 Credits Unlocked</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 4-Student Co-Op Discovery Squad */}
                                <div className="bg-[#F5EBDC] text-[#2B0A10] rounded-2xl p-5 border border-[#C9B47C] shadow-inner">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold uppercase tracking-wider text-[#8B2332]">
                                            4-Student Co-Op Discovery Squad
                                        </span>
                                        <Users size={16} className="text-[#8B2332]" />
                                    </div>
                                    <p className="text-xs text-[#2B0A10]/85 leading-relaxed mb-4">
                                        Students never study in isolation. Every historical lab pairs you with a 4-person peer squad online or at a local University School Center:
                                    </p>
                                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                                        {[
                                            { role: 'Aero-Physicist', task: 'Airfoil Camber & Lift' },
                                            { role: 'Propulsion Lead', task: 'Twin-Propeller Thrust' },
                                            { role: 'Structures Lead', task: 'Spruce & Muslin Mass' },
                                            { role: 'Flight Director', task: '3-Axis Pitch & Roll' },
                                        ].map((member, idx) => (
                                            <div key={idx} className="bg-white/80 rounded-xl p-2.5 border border-[#2B0A10]/10">
                                                <div className="font-serif font-bold text-[#1F070B]">{member.role}</div>
                                                <div className="text-[11px] text-slate-600">{member.task}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                4. AGE 11 TO FULL COLLEGE DEGREE TIMELINE & CTA
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#FAF8F5]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#8B2332] block mb-2">
                            Direct Degree Progression
                        </span>
                        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2D2D] leading-tight">
                            <span className="block">From First Historical Lab at 11</span>
                            <span className="block text-[#8B2332] mt-1">To a College Degree.</span>
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
                        {[
                            {
                                age: 'AGE 11–12',
                                title: 'Foundational Labs & First Credits',
                                desc: 'Step into 1903 Kitty Hawk, Marie Curie’s lab, and Lincoln’s courtroom. Complete your first 6–15 accredited university credits.',
                                badge: '6–15 University Credits',
                            },
                            {
                                age: 'AGE 13–14',
                                title: 'Undergraduate Certificates',
                                desc: 'Stack accredited courses across Engineering, Biomedics, Business, or Law into official university-issued certificates.',
                                badge: '15–30 University Credits',
                            },
                            {
                                age: 'AGE 15–16',
                                title: 'Associate Degree & Upper-Division',
                                desc: 'Reach 60+ accredited credits and transition into advanced upper-division university labs and micro-campus capstone projects.',
                                badge: '60+ Credits · Associate Degree',
                            },
                            {
                                age: 'AGE 17+',
                                title: "Full Accredited Bachelor's Degree",
                                desc: 'Graduate with an accredited university degree debt-free years ahead of schedule, ready for graduate school, research, or industry.',
                                badge: "120 Credits · Bachelor's Degree",
                            },
                        ].map((stage, i) => (
                            <div
                                key={i}
                                className="bg-[#1F070B] text-white rounded-3xl p-6 border border-[#E6C687]/35 shadow-xl flex flex-col justify-between"
                            >
                                <div>
                                    <span className="inline-block px-3 py-1 rounded-full bg-[#8B2332] border border-[#E6C687]/40 text-[#E6C687] text-xs font-bold tracking-widest mb-4">
                                        {stage.age}
                                    </span>
                                    <h3 className="font-serif text-xl font-bold text-white mb-2">
                                        {stage.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                                        {stage.desc}
                                    </p>
                                </div>
                                <div className="pt-3 border-t border-[#E6C687]/20 text-xs font-bold text-[#E6C687]">
                                    {stage.badge}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-br from-[#2B0A10] to-[#1A0508] text-white rounded-3xl p-8 sm:p-12 border border-[#C9B47C]/40 shadow-2xl text-center">
                        <h3 className="font-serif text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                            <span className="block">Ready to Start Your First</span>
                            <span className="block text-[#E6C687] mt-1">Historical Course Experience?</span>
                        </h3>
                        <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-base sm:text-lg">
                            Try our interactive course transformer demo and see how University School turns accredited university syllabi into gamified quests, wind-tunnel simulations, and unforgettable mastery.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button
                                onClick={() => onNavigate('asu-demo')}
                                className="bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] hover:from-[#F7E0AD] hover:to-[#D4AF6A] text-[#23090D] px-8 py-4 rounded-2xl font-bold text-base shadow-xl inline-flex items-center gap-2.5 transition-all"
                            >
                                <Sparkles size={18} className="text-[#8B2332]" />
                                Try Interactive Course Demo
                                <ArrowRight size={18} />
                            </button>
                            <button
                                onClick={() => onNavigate('partners')}
                                className="bg-[#8B2332] hover:bg-[#A3293B] border border-[#E6C687]/50 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-xl inline-flex items-center gap-2.5 transition-all"
                            >
                                View Accredited University Partners
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
