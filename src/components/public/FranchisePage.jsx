import React, { useState } from 'react';
import {
    Map,
    Cpu,
    Building,
    Users,
    Globe,
    Award,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Laptop,
    Compass,
    Send,
    ShieldCheck,
    BookOpen,
    Home,
    GraduationCap,
} from 'lucide-react';

const CENTER_PILLAR_TILES = [
    {
        name: 'Collaborative Studios',
        tagline: '4-student Co-Op discovery tables & Socratic debate.',
        image: '/images/visuals/channel_centers.jpg',
        icon: Users,
    },
    {
        name: 'Aerodynamics & STEM Labs',
        tagline: 'Hands-on hardware, wind tunnels, 3D printing & VR.',
        image: '/images/visuals/kitty_hawk_1_live.jpg',
        icon: Compass,
    },
    {
        name: 'AI Narrator Workstations',
        tagline: 'Synced across Center, Tablet, Computer & TV App.',
        image: '/images/visuals/channel_computer.jpg',
        icon: Laptop,
    },
    {
        name: 'Accredited Degree Hub',
        tagline: 'Proctored university assessments & mentor guidance.',
        image: '/images/visuals/student_campus_lookup.jpg',
        icon: Award,
    },
];

const CENTER_LAUNCH_STEPS = [
    {
        step: 'STEP 01 · EXPLORE & ALIGN',
        title: 'Choose Your Community Format',
        desc: 'Connect with our Center Partnerships team to select the model that best serves your families—from an intimate Homeschool Co-Op Learning Pod (4–12 scholars) to a dedicated Neighborhood Micro-School (12–30 scholars) or an Enrichment Studio.',
        deliverable: 'Customized Center Blueprint & Curriculum Overview',
    },
    {
        step: 'STEP 02 · PREPARE YOUR SPACE',
        title: 'Set Up Your Collaborative Studio',
        desc: 'Transform a welcoming room, community annex, or dedicated micro-campus into an active discovery studio arranged around 4-person Co-Op tables, hands-on experiment stations, and quiet assessment nooks.',
        deliverable: 'Studio Layout Guide & Lab Equipment Checklist',
    },
    {
        step: 'STEP 03 · FACILITATOR ONBOARDING',
        title: 'Facilitator Orientation & Platform Provisioning',
        desc: 'Because our AI Narrator and accredited partner university syllabi handle 100% of formal lecture instruction and Socratic coaching, local facilitators don’t need to write lesson plans—you focus on mentorship, group discussion, and encouragement.',
        deliverable: 'Center OS Dashboard & Facilitator Certification',
    },
    {
        step: 'STEP 04 · LAUNCH YOUR COHORT',
        title: 'Welcome Scholars & Begin Quests',
        desc: 'Organize your learners (ages 11+) into 4-person Discovery Squads. Together they step into historical simulations, build real-world projects, and complete university assessments toward official college credit.',
        deliverable: 'Active Discovery Squads & Official Credit Tracking',
    },
];

const CENTER_FORMATS = [
    {
        id: 'Learning Pod / Homeschool Co-Op (4–12 Scholars)',
        badge: '4–12 Scholars · 1–3 Discovery Squads',
        title: 'Collaborative Learning Pod & Homeschool Co-Op',
        icon: Home,
        summary:
            'Designed for homeschooling families and parent-educators uniting a small cohort of middle- and high-school learners to experience accredited university courses, hands-on STEM labs, and Socratic seminars together.',
        highlights: [
            'Flexible 2-to-5 day weekly co-op schedules',
            'Zero lesson-planning burden—AI Narrator & university syllabi guide every session',
            'Turns solo homeschooling into a vibrant 4-person team quest',
        ],
    },
    {
        id: 'Independent Micro-School (12–30 Scholars)',
        badge: '12–30 Scholars · 3–8 Discovery Squads',
        title: 'Neighborhood Micro-School',
        icon: Building,
        summary:
            'A dedicated small-school learning community where scholars aged 11+ replace passive lecture classrooms with interactive historical simulations, peer seminars, and early-college degree pathways.',
        highlights: [
            'Full-time or hybrid micro-campus operating model',
            'Multi-age squads across Engineering, Biomedics, Business & Law',
            'Integrated parent progress portfolios & proctored university credit exams',
        ],
    },
    {
        id: 'Existing School / Enrichment Studio',
        badge: 'Flexible Cohorts · After-School or Integrated',
        title: 'Private School & Community Enrichment Studio',
        icon: GraduationCap,
        summary:
            'Built for independent schools, tutoring academies, libraries, and youth organizations adding University School’s interactive lab quests and accredited early-college credit tracks to their existing campus.',
        highlights: [
            'Plug-and-play honors & early-college elective tracks',
            'Complete Center OS telemetry for academic directors',
            'Co-branded community showcase & capstone events',
        ],
    },
];

export const FranchisePage = ({ onNavigate }) => {
    const [selectedFormat, setSelectedFormat] = useState(CENTER_FORMATS[0].id);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        cityState: '',
        role: 'Parent / Homeschool Co-Op Organizer',
        cohortSize: '4–12 Scholars (Learning Pod / Co-Op)',
        timeline: 'Upcoming Term (Within 90 Days)',
        notes: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const scrollToId = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleSelectFormat = (formatId) => {
        setSelectedFormat(formatId);
        if (formatId.includes('4–12')) {
            setFormData((prev) => ({ ...prev, cohortSize: '4–12 Scholars (Learning Pod / Co-Op)' }));
        } else if (formatId.includes('12–30')) {
            setFormData((prev) => ({ ...prev, cohortSize: '12–30 Scholars (Micro-School)' }));
        } else {
            setFormData((prev) => ({ ...prev, cohortSize: 'Flexible / Existing Campus Program' }));
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="flex flex-col pb-20 bg-[#FAF8F5]">
            {/* ═══════════════════════════════════════════════════════════
                1. FULL-BLEED DARK BURGUNDY & GOLD HERO
                ═══════════════════════════════════════════════════════════ */}
            <section className="relative bg-[#1F070B] text-white overflow-hidden border-b border-[#C9B47C]/30">
                <div className="relative min-h-[560px] flex flex-col justify-between">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/visuals/channel_centers.jpg"
                            alt="University School Center where students collaborate around an aerodynamics wind tunnel table"
                            className="w-full h-full object-cover object-center opacity-85"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1F070B] via-[#1F070B]/90 sm:via-[#1F070B]/70 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#190508] via-[#190508]/90 to-transparent" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 w-full">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B2332]/90 border border-[#E6C687]/40 text-[#E6C687] text-xs font-bold uppercase tracking-[0.2em] mb-5">
                                <Building size={14} /> Micro-Schools · Homeschool Co-Ops · Local Learning Centers
                            </div>

                            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight leading-[1.03] mb-5 drop-shadow-lg">
                                Learn Anywhere.<br />
                                <span className="text-[#E6C687]">Belong Somewhere.</span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-100/95 leading-relaxed mb-6 max-w-xl drop-shadow">
                                Bring a <strong className="text-[#E6C687]">University School Learning Center</strong> to your neighborhood. Whether you are organizing a homeschool co-op pod, launching an independent micro-school, or hosting a local study hub, we provide the complete interactive curriculum, Socratic AI coaching, and accredited university credit pathways.
                            </p>

                            <div className="flex flex-wrap items-center gap-3.5">
                                <button
                                    onClick={() => scrollToId('franchise-application')}
                                    className="group bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] hover:from-[#F7E0AD] hover:to-[#D4AF6A] text-[#23090D] px-7 py-4 rounded-2xl font-bold text-base shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-all flex items-center gap-2.5"
                                >
                                    Learn More &amp; Start a Center
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => scrollToId('how-to-launch')}
                                    className="bg-[#8B2332]/90 hover:bg-[#A3293B] border border-[#E6C687]/50 text-white px-6 py-4 rounded-2xl font-bold text-sm sm:text-base shadow-xl transition-all flex items-center gap-2"
                                >
                                    <Map size={17} className="text-[#E6C687]" />
                                    How to Run a Local Center
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 4 Docked Center Feature Tiles */}
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {CENTER_PILLAR_TILES.map((tile, i) => (
                                <div
                                    key={i}
                                    onClick={() => scrollToId('how-to-launch')}
                                    className="cursor-pointer group relative rounded-2xl overflow-hidden border border-[#E6C687]/35 hover:border-[#E6C687] bg-[#140709]/95 text-left shadow-xl transition-all hover:-translate-y-1"
                                >
                                    <div className="h-28 w-full overflow-hidden relative">
                                        <img
                                            src={tile.image}
                                            alt={tile.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#140709] via-[#140709]/35 to-transparent" />
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
                2. HOW TO RUN A CENTER — THE 4-STEP LAUNCH ROADMAP
                ═══════════════════════════════════════════════════════════ */}
            <section id="how-to-launch" className="py-20 bg-white border-b border-[#8B2332]/10 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="text-[#8B2332] font-bold tracking-[0.22em] text-xs uppercase mb-3 block">
                            Small-Group Learning Pods · Homeschool Co-Ops · Micro-Schools
                        </span>
                        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2D2D] mb-4 leading-tight">
                            <span className="block">How to Launch &amp; Run a</span>
                            <span className="block text-[#8B2332] mt-1">University School Center.</span>
                        </h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            You don&apos;t need to write college syllabi or teach advanced physics on your own. We provide the complete accredited academic engine, interactive simulations, and Center Operating System so parents and educators can focus on building an inspiring small-group community.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {CENTER_LAUNCH_STEPS.map((st, i) => (
                            <div
                                key={i}
                                className="bg-[#18070B] text-white rounded-3xl p-6 border border-[#E6C687]/35 shadow-xl flex flex-col justify-between"
                            >
                                <div>
                                    <span className="inline-block px-3 py-1 rounded-full bg-[#8B2332] border border-[#E6C687]/40 text-[#E6C687] text-[10px] font-bold uppercase tracking-widest mb-4">
                                        {st.step}
                                    </span>
                                    <h3 className="font-serif text-xl font-bold text-white mb-2.5">
                                        {st.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                                        {st.desc}
                                    </p>
                                </div>
                                <div className="pt-3 border-t border-[#E6C687]/20">
                                    <div className="text-[10px] uppercase tracking-wider text-slate-400">What You Receive</div>
                                    <div className="text-xs font-bold text-[#E6C687] mt-0.5">{st.deliverable}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* What We Provide vs What You Do Comparison */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        <div className="bg-[#F5EBDC] text-[#2B0A10] rounded-3xl p-7 border border-[#C9B47C] shadow-lg">
                            <div className="text-xs font-bold uppercase tracking-widest text-[#8B2332] mb-2">
                                Complete Academic &amp; Platform Support
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-[#1F070B] mb-4">
                                What University School Provides
                            </h3>
                            <ul className="space-y-2.5 text-sm font-medium text-[#2B0A10]">
                                {[
                                    'Full Interactive XP Curriculum & 60fps Historical Simulations',
                                    '60+ Accredited University Credit, Certificate & Degree Pathways',
                                    'Socratic AI Homework & Exam Companion (24/7 Student Coaching)',
                                    'Center OS Dashboard: Squad Progress, XP Telemetry & Parent Reports',
                                    'Hands-On Lab Guides, Co-Op Seminar Prompts & Facilitator Training',
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5">
                                        <CheckCircle2 size={17} className="text-[#8B2332] shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-lg">
                            <div className="text-xs font-bold uppercase tracking-widest text-[#8B2332] mb-2">
                                Local Community &amp; Facilitation
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-[#2D2D2D] mb-4">
                                What You Focus On Locally
                            </h3>
                            <ul className="space-y-2.5 text-sm font-medium text-slate-700">
                                {[
                                    'Host a welcoming learning environment (co-op studio, micro-school, or campus room)',
                                    'Organize scholars (ages 11+) into collaborative 4-person Discovery Squads',
                                    'Facilitate daily goal-setting, Socratic group discussions & hands-on builds',
                                    'Coordinate family showcase nights & project demonstrations',
                                    'Provide a quiet, supportive setting for proctored university credit assessments',
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5">
                                        <Sparkles size={17} className="text-[#8B2332] shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                3. THE PHYSICAL LAYER — BUILT FOR COLLABORATIVE DISCOVERY
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#FAF8F5] border-b border-[#8B2332]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="text-[#8B2332] font-bold tracking-[0.22em] text-xs uppercase mb-3 block">
                            The Physical Micro-Campus Layer
                        </span>
                        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2D2D] mb-4">
                            Find Your People by
                            <span className="block text-[#8B2332]">Passion.</span>
                        </h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            University School Centers are not lecture halls. Whether you run a small-group homeschool co-op or a neighborhood micro-school, each space is a warm, studio-grade workshop designed for 4-student discovery squads, hands-on engineering builds, Socratic debate, and accredited university progress.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <div className="bg-[#18070B] text-white rounded-3xl overflow-hidden border border-[#E6C687]/35 shadow-2xl flex flex-col justify-between">
                            <div className="h-72 relative overflow-hidden">
                                <img
                                    src="/images/visuals/channel_centers.jpg"
                                    alt="The Collaborative Commons & Wind Tunnel Studio"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#18070B] via-transparent to-transparent" />
                            </div>
                            <div className="p-8">
                                <span className="text-xs font-bold uppercase tracking-widest text-[#E6C687] block mb-2">
                                    Zone 01 · The Commons
                                </span>
                                <h3 className="font-serif text-2xl font-bold text-white mb-3">
                                    Co-Op Discovery &amp; Seminar Studio
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    High-agency youth aged 11+ gather in 4-person squads across Biomedics, Engineering, Business, and Law to solve historical challenges together and present capstone projects.
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#18070B] text-white rounded-3xl overflow-hidden border border-[#E6C687]/35 shadow-2xl flex flex-col justify-between">
                            <div className="h-72 relative overflow-hidden">
                                <img
                                    src="/images/visuals/school_portrait_engineering.jpg"
                                    alt="Aerodynamics, Robotics & Biomedical Maker Lab"
                                    className="w-full h-full object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#18070B] via-transparent to-transparent" />
                            </div>
                            <div className="p-8">
                                <span className="text-xs font-bold uppercase tracking-widest text-[#E6C687] block mb-2">
                                    Zone 02 · Fabrication &amp; Proctoring Lab
                                </span>
                                <h3 className="font-serif text-2xl font-bold text-white mb-3">
                                    Applied Science &amp; University Assessment Hub
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Equipped with desktop wind tunnels, 3D fabrication tools, biomedical models, and quiet proctored testing stations where students lock in official university credits and certificates.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                4. NATIVE CENTER OPERATING SYSTEM & SMALL-SCHOOL ARCHITECTURE
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#19090D] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="text-[#E6C687] font-bold tracking-[0.22em] text-xs uppercase mb-3 block">
                            Turnkey Micro-Campus Architecture
                        </span>
                        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
                            The University School
                            <span className="block text-[#E6C687]">Center Model.</span>
                        </h2>
                        <p className="text-slate-300 text-lg">
                            Intimate small-group belonging combined with world-class university rigor—powered end-to-end by the University School Operating System.
                        </p>
                    </div>

                    {/* 4 Community & Learning Architecture Tiles */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {[
                            { icon: Users, value: '4-Scholar', label: 'Discovery Squads', sub: 'Collaborative peer teams in every course' },
                            { icon: Home, value: '4 to 30', label: 'Flexible Cohort Size', sub: 'From homeschool pods to micro-schools' },
                            { icon: BookOpen, value: '60+ Unis', label: 'Accredited Pathways', sub: 'Real college credits starting at age 11+' },
                            { icon: Cpu, value: '100%', label: 'Turnkey Academic OS', sub: 'AI Narrator & Socratic coaching built in' },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="bg-[#140709] p-7 rounded-3xl border border-[#E6C687]/35 shadow-xl text-center"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[#E6C687]/15 border border-[#E6C687]/40 flex items-center justify-center text-[#E6C687] mx-auto mb-4">
                                    <stat.icon size={22} />
                                </div>
                                <div className="text-3xl sm:text-4xl font-serif font-bold text-white mb-1">{stat.value}</div>
                                <div className="font-bold text-[#E6C687] text-sm mb-1">{stat.label}</div>
                                <div className="text-xs text-slate-400">{stat.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Native University School Center Operating System Card */}
                    <div className="grid lg:grid-cols-12 gap-10 items-center bg-[#120609] border border-[#E6C687]/35 rounded-3xl p-6 sm:p-10 shadow-2xl">
                        <div className="lg:col-span-5 space-y-5">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6C687] block">
                                Powered by University School OS
                            </span>
                            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                                A Complete &ldquo;School-in-a-Box&rdquo; for Local Facilitators.
                            </h3>
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                Whether you are a parent leading a homeschool co-op or an educator directing a micro-school, you focus on mentorship and hands-on group labs while our platform handles syllabus-to-story transformation, XP mastery telemetry, parent reporting, and university credit tracking.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'Real-time squad progress across all 4 Knowledge Schools',
                                    'Step-by-step facilitation guides for wind-tunnel, robotics & biomedical labs',
                                    'Integrated Parent Portal & Official University Credit Ledger',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-200 font-medium">
                                        <CheckCircle2 className="text-[#E6C687] shrink-0" size={18} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right 7 Cols: Native Dark-Burgundy & Parchment Center OS Telemetry */}
                        <div className="lg:col-span-7 bg-[#1F0B10] border border-[#E6C687]/30 rounded-2xl p-6 shadow-xl">
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/images/unischool-logo.png"
                                        alt="University School"
                                        className="w-9 h-9 rounded-lg border border-[#E6C687]/40"
                                    />
                                    <div>
                                        <div className="font-serif font-bold text-white text-base">
                                            University School Center OS · Cohort Command
                                        </div>
                                        <div className="text-[11px] text-[#E6C687]">
                                            Active Discovery Squads · Ages 11–17 · 4 Knowledge Schools
                                        </div>
                                    </div>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-[#8B2332] border border-[#E6C687]/40 text-[#E6C687] text-[10px] font-bold uppercase tracking-wider">
                                    Live Center Telemetry
                                </span>
                            </div>

                            <div className="bg-[#F5EBDC] text-[#2B0A10] rounded-2xl p-5 border border-[#C9B47C] mb-5">
                                <div className="text-xs font-bold uppercase tracking-wider text-[#8B2332] mb-3">
                                    Active Today in Your Learning Center
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                                    {[
                                        {
                                            squad: 'Engineering Squad Alpha (4 Scholars)',
                                            lab: '1903 Wright Wind Tunnel · PHY 121',
                                            status: '88% Mastery · 3.0 Credits',
                                        },
                                        {
                                            squad: 'Biomedics Squad Curie (4 Scholars)',
                                            lab: 'Cellular Diagnostics Lab · BIO 181',
                                            status: '82% Mastery · 4.0 Credits',
                                        },
                                        {
                                            squad: 'Business Squad Detroit (4 Scholars)',
                                            lab: 'Assembly Line Economics · ECN 212',
                                            status: '91% Mastery · 3.0 Credits',
                                        },
                                        {
                                            squad: 'Law & Policy Squad Lincoln (4 Scholars)',
                                            lab: 'Constitutional Moot Court · POS 110',
                                            status: '85% Mastery · 3.0 Credits',
                                        },
                                    ].map((row, idx) => (
                                        <div key={idx} className="bg-white/85 rounded-xl p-3 border border-[#2B0A10]/10">
                                            <div className="font-serif font-bold text-[#1F070B]">{row.squad}</div>
                                            <div className="text-[11px] text-slate-600 mt-0.5">{row.lab}</div>
                                            <div className="text-[11px] font-bold text-[#8B2332] mt-1">{row.status}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                                <div className="flex items-center gap-2">
                                    <Globe size={15} className="text-[#E6C687]" />
                                    <span>Official Selection: BETT Brazil 2026 Education Showcase</span>
                                </div>
                                <span className="text-[#E6C687] font-bold">Avg. 18.5 Credits / Scholar / Year</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                5. FLEXIBLE CENTER FORMATS & LEARN MORE / START A CENTER INQUIRY
                ═══════════════════════════════════════════════════════════ */}
            <section id="franchise-application" className="py-20 bg-[#FAF8F5] scroll-mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="text-[#8B2332] font-bold tracking-[0.22em] text-xs uppercase mb-3 block">
                            Learn More &amp; Run a Local Center
                        </span>
                        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2D2D] mb-4 leading-tight">
                            <span className="block">Built for Small Schools,</span>
                            <span className="block text-[#8B2332] mt-1">Homeschool Co-Ops &amp; Local Pods.</span>
                        </h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            Select the community model that fits your group on the left, then request our Center Starter Guide on the right to learn how to bring University School to your learners.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        {/* Left 5 Cols: Three Flexible Center Models (Pods / Co-Ops / Micro-Schools) */}
                        <div className="lg:col-span-5 space-y-4">
                            {CENTER_FORMATS.map((fmt) => {
                                const isSelected = selectedFormat === fmt.id;
                                const IconComp = fmt.icon;
                                return (
                                    <div
                                        key={fmt.id}
                                        onClick={() => handleSelectFormat(fmt.id)}
                                        className={`cursor-pointer rounded-3xl p-6 transition-all border ${
                                            isSelected
                                                ? 'bg-[#18070B] text-white border-[#E6C687] shadow-2xl'
                                                : 'bg-white text-[#1F070B] border-[#C9B47C]/50 hover:border-[#8B2332] shadow-md'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-2.5">
                                            <span
                                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                    isSelected
                                                        ? 'bg-[#8B2332] text-[#E6C687] border-[#E6C687]/40'
                                                        : 'bg-[#F5EBDC] text-[#8B2332] border-[#C9B47C]'
                                                }`}
                                            >
                                                {fmt.badge}
                                            </span>
                                            <div
                                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                                    isSelected
                                                        ? 'bg-[#E6C687]/15 text-[#E6C687] border border-[#E6C687]/40'
                                                        : 'bg-[#8B2332]/10 text-[#8B2332]'
                                                }`}
                                            >
                                                <IconComp size={18} />
                                            </div>
                                        </div>

                                        <h3
                                            className={`font-serif text-xl font-bold mb-2 ${
                                                isSelected ? 'text-white' : 'text-[#1F070B]'
                                            }`}
                                        >
                                            {fmt.title}
                                        </h3>

                                        <p
                                            className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                                                isSelected ? 'text-slate-300' : 'text-slate-600'
                                            }`}
                                        >
                                            {fmt.summary}
                                        </p>

                                        <ul className="space-y-1.5">
                                            {fmt.highlights.map((hl, i) => (
                                                <li
                                                    key={i}
                                                    className={`flex items-start gap-2 text-xs font-medium ${
                                                        isSelected ? 'text-[#F5EBDC]' : 'text-slate-700'
                                                    }`}
                                                >
                                                    <CheckCircle2
                                                        size={14}
                                                        className={`shrink-0 mt-0.5 ${
                                                            isSelected ? 'text-[#E6C687]' : 'text-[#8B2332]'
                                                        }`}
                                                    />
                                                    <span>{hl}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right 7 Cols: Learn More & Request the Center Starter Guide Form */}
                        <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-10 border border-[#C9B47C]/50 shadow-xl">
                            {submitted ? (
                                <div className="py-8 text-center space-y-5">
                                    <div className="w-16 h-16 rounded-2xl bg-[#8B2332] text-[#E6C687] flex items-center justify-center mx-auto shadow-lg">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <span className="inline-block px-3.5 py-1 rounded-full bg-[#8B2332]/10 text-[#8B2332] text-xs font-bold uppercase tracking-widest">
                                        Center Starter Guide Requested
                                    </span>
                                    <h3 className="font-serif text-3xl font-bold text-[#1F070B]">
                                        Thank You, {formData.fullName || 'Partner'}.
                                    </h3>
                                    <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                                        We have received your inquiry to launch a <strong>{formData.cohortSize}</strong> in <strong>{formData.cityState || 'your community'}</strong>.
                                    </p>

                                    <div className="bg-[#FAF8F5] border border-[#C9B47C]/50 rounded-2xl p-6 text-left max-w-lg mx-auto space-y-3">
                                        <div className="text-xs font-bold uppercase tracking-wider text-[#8B2332]">
                                            What Happens Next:
                                        </div>
                                        <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                                            <CheckCircle2 size={16} className="text-[#8B2332] shrink-0 mt-0.5" />
                                            <span><strong>1. Center &amp; Co-Op Starter Guide:</strong> Sent to <strong>{formData.email || 'your email'}</strong> with sample weekly schedules for homeschool co-ops, learning pods, and micro-schools.</span>
                                        </div>
                                        <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                                            <CheckCircle2 size={16} className="text-[#8B2332] shrink-0 mt-0.5" />
                                            <span><strong>2. 1-on-1 Onboarding Call:</strong> A Center Partnerships Advisor will reach out to walk through curriculum tracks, group facilitation, and setup for {formData.cityState || 'your area'}.</span>
                                        </div>
                                        <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                                            <CheckCircle2 size={16} className="text-[#8B2332] shrink-0 mt-0.5" />
                                            <span><strong>3. Experience a Live Lab Quest:</strong> Explore the interactive course demo below to see what your students will experience together.</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-3 pt-3">
                                        <button
                                            onClick={() => onNavigate && onNavigate('asu-demo')}
                                            className="bg-[#8B2332] hover:bg-[#A3293B] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg inline-flex items-center gap-2 transition-all"
                                        >
                                            Try Interactive Course Demo <ArrowRight size={16} />
                                        </button>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3.5 rounded-xl font-bold text-sm transition-all"
                                        >
                                            Update Inquiry Details
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleFormSubmit} className="space-y-5">
                                    <div className="border-b border-slate-100 pb-4">
                                        <span className="text-xs font-bold uppercase tracking-widest text-[#8B2332] block mb-1">
                                            Learn More · Start a Pod, Co-Op, or Micro-School
                                        </span>
                                        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F070B]">
                                            Request the Center Starter Guide
                                        </h3>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                placeholder="Sarah Jenkins"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-[#1F070B] focus:outline-none focus:border-[#8B2332]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="sarah@example.com"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-[#1F070B] focus:outline-none focus:border-[#8B2332]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                                Phone / WhatsApp *
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="+1 (555) 234-5678"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-[#1F070B] focus:outline-none focus:border-[#8B2332]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                                City &amp; State / Country *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.cityState}
                                                onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                                                placeholder="e.g. Austin, TX or Scottsdale, AZ"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-[#1F070B] focus:outline-none focus:border-[#8B2332]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                                Your Role
                                            </label>
                                            <select
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm text-[#1F070B] bg-white focus:outline-none focus:border-[#8B2332]"
                                            >
                                                <option>Parent / Homeschool Co-Op Organizer</option>
                                                <option>Educator / Micro-School Founder</option>
                                                <option>Private School / Academic Director</option>
                                                <option>Community / Youth Program Leader</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                                Center Format
                                            </label>
                                            <select
                                                value={formData.cohortSize}
                                                onChange={(e) => setFormData({ ...formData, cohortSize: e.target.value })}
                                                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm text-[#1F070B] bg-white focus:outline-none focus:border-[#8B2332]"
                                            >
                                                <option>4–12 Scholars (Learning Pod / Co-Op)</option>
                                                <option>12–30 Scholars (Micro-School)</option>
                                                <option>Flexible / Existing Campus Program</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                                Target Timeline
                                            </label>
                                            <select
                                                value={formData.timeline}
                                                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm text-[#1F070B] bg-white focus:outline-none focus:border-[#8B2332]"
                                            >
                                                <option>Upcoming Term (Within 90 Days)</option>
                                                <option>Within 3–6 Months</option>
                                                <option>Next Academic Year</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                            Tell Us About Your Learners or Community Vision (Optional)
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            placeholder="Share a bit about the students or families you hope to serve, your ideal weekly schedule, or any questions for our team..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-[#1F070B] focus:outline-none focus:border-[#8B2332]"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-[#8B2332] to-[#601620] hover:from-[#A3293B] hover:to-[#7A1C29] text-white py-4 px-6 rounded-2xl font-bold text-base shadow-xl flex items-center justify-center gap-2.5 transition-all"
                                    >
                                        <Send size={18} className="text-[#E6C687]" />
                                        Request Center Starter Guide &amp; Schedule an Intro Call
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
