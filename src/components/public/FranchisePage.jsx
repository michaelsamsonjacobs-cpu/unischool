import React, { useState } from 'react';
import {
    Map,
    TrendingUp,
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
    ClipboardCheck,
    DollarSign,
    Calendar,
    Send,
    ShieldCheck,
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

const FRANCHISE_STEPS = [
    {
        step: 'STEP 01 · WEEKS 1–2',
        title: 'Territory Discovery & Qualification',
        desc: 'Submit your target city or suburb below. Meet with our Founding Center Team to review local student demographics, territory exclusivity, and unit economics. Ideal for educators, entrepreneurs, existing tutoring/micro-school owners, and community leaders.',
        deliverable: 'Exclusive Territory Hold & Franchise Prospectus',
    },
    {
        step: 'STEP 02 · WEEKS 3–6',
        title: 'Site Selection & Turnkey Studio Kit',
        desc: 'Secure a 1,200–1,800 sq. ft. commercial, retail, or campus-adjacent space. We ship your turnkey Center-in-a-Box hardware package: 4-person Co-Op discovery tables, desktop laminar wind tunnels, 4K seminar displays, and proctored testing stations.',
        deliverable: 'Architectural Layout & Hardware Delivery',
    },
    {
        step: 'STEP 03 · WEEKS 7–10',
        title: 'Director Certification & Cohort Launch',
        desc: 'Complete our 2-week University School OS Director Certification. Because our AI Narrator and partner university syllabi handle 100% of curriculum instruction, you hire warm college-graduate facilitators (1:15 ratio) and run our turnkey local enrollment playbook.',
        deliverable: 'Certified Staff & Founding 15–30 Student Cohort',
    },
    {
        step: 'STEP 04 · WEEK 12',
        title: 'Grand Opening & Recurring Tuition',
        desc: 'Open your doors. Students aged 11+ attend full-time or after-school in 4-person discovery squads, earning XP and official university credits while you manage community growth through the University School Center Operating System.',
        deliverable: '$360k–$720k+ Target Annual Recurring Tuition',
    },
];

export const FranchisePage = ({ onNavigate }) => {
    const [studentCount, setStudentCount] = useState(30);
    const [monthlyTuition, setMonthlyTuition] = useState(1250);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        cityState: '',
        background: 'Educator / School Leader',
        timeline: 'Within 3–6 Months',
        capitalTier: '$75k – $150k Ready',
        notes: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const annualRevenue = studentCount * monthlyTuition * 12;
    const mentorCount = Math.max(1, Math.ceil(studentCount / 15));
    const estOperatingCost = mentorCount * 62000 + 48000; // Facilitators + lease/ops estimate
    const estNetIncome = Math.max(0, annualRevenue - estOperatingCost);
    const recommendedSqFt = studentCount <= 25 ? '1,200' : studentCount <= 40 ? '1,600' : '2,200';

    const scrollToId = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="flex flex-col pb-20 bg-[#FAF8F5]">
            {/* ═══════════════════════════════════════════════════════════
                1. FULL-BLEED DARK BURGUNDY & GOLD HERO (MATCHES LANDING TILES)
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
                                <Building size={14} /> Become a Center Franchisee · Global Micro-Campus Network
                            </div>

                            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight leading-[1.03] mb-5 drop-shadow-lg">
                                Learn Anywhere.<br />
                                <span className="text-[#E6C687]">Belong Somewhere.</span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-100/95 leading-relaxed mb-6 max-w-xl drop-shadow">
                                Launch an accredited <strong className="text-[#E6C687]">University School Center</strong> in your community. We provide the AI-powered Interactive XP curriculum, 60+ university credit pathways, and turnkey hardware studio&mdash;you build the local community and recurring tuition business.
                            </p>

                            <div className="flex flex-wrap items-center gap-3.5">
                                <button
                                    onClick={() => scrollToId('franchise-application')}
                                    className="group bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] hover:from-[#F7E0AD] hover:to-[#D4AF6A] text-[#23090D] px-7 py-4 rounded-2xl font-bold text-base shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-all flex items-center gap-2.5"
                                >
                                    Apply to Launch a Center
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => scrollToId('how-to-launch')}
                                    className="bg-[#8B2332]/90 hover:bg-[#A3293B] border border-[#E6C687]/50 text-white px-6 py-4 rounded-2xl font-bold text-sm sm:text-base shadow-xl transition-all flex items-center gap-2"
                                >
                                    <Map size={17} className="text-[#E6C687]" />
                                    How to Become a Franchisee (4 Steps)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 4 Docked Center Feature Tiles (Matches First Tiles on Landing Page) */}
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
                2. HOW TO BECOME A FRANCHISEE — THE 4-STEP LAUNCH ROADMAP
                ═══════════════════════════════════════════════════════════ */}
            <section id="how-to-launch" className="py-20 bg-white border-b border-[#8B2332]/10 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="text-[#8B2332] font-bold tracking-[0.22em] text-xs uppercase mb-3 block">
                            How to Become a Franchisee · 90-Day Turnkey Launch
                        </span>
                        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2D2D] mb-4 leading-tight">
                            <span className="block">How to Launch a</span>
                            <span className="block text-[#8B2332] mt-1">University School Center.</span>
                        </h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            You don&apos;t need to build a curriculum or hire university professors. We provide the entire accredited academic engine, interactive simulations, and Center Operating System so you can launch in 12 weeks.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {FRANCHISE_STEPS.map((st, i) => (
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
                                    <div className="text-[10px] uppercase tracking-wider text-slate-400">Milestone Deliverable</div>
                                    <div className="text-xs font-bold text-[#E6C687] mt-0.5">{st.deliverable}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* What We Provide vs What You Do Comparison */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        <div className="bg-[#F5EBDC] text-[#2B0A10] rounded-3xl p-7 border border-[#C9B47C] shadow-lg">
                            <div className="text-xs font-bold uppercase tracking-widest text-[#8B2332] mb-2">
                                Turnkey Corporate Support
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-[#1F070B] mb-4">
                                What University School Provides
                            </h3>
                            <ul className="space-y-2.5 text-sm font-medium text-[#2B0A10]">
                                {[
                                    'Full Interactive XP Curriculum & 60fps Historical Simulations',
                                    '60+ Accredited University Credit, Certificate & Degree Pathways',
                                    'Socratic AI Homework & Exam Companion (24/7 Student Coaching)',
                                    'Center OS Dashboard: Attendance, XP Telemetry & Parent Reports',
                                    'Architectural Blueprints, Wind-Tunnel Lab Specs & Launch Marketing',
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
                                Local Franchisee Role
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-[#2D2D2D] mb-4">
                                What You Focus On Locally
                            </h3>
                            <ul className="space-y-2.5 text-sm font-medium text-slate-700">
                                {[
                                    'Secure a 1,200–1,800 sq. ft. safe, inspiring local studio space',
                                    'Host local Parent Open Houses & Demo Nights (1903 Wind Tunnel)',
                                    'Hire & lead 1–2 passionate college-graduate learning facilitators',
                                    'Guide daily 4-student Co-Op Squad check-ins & project showcases',
                                    'Proctor official university credit assessments & celebrate milestones',
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
                            University School Centers are not lecture halls. They are warm, studio-grade workshops designed for 4-student discovery squads, hands-on engineering builds, Socratic debate, and accredited university progress.
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
                4. UNIT ECONOMICS & NATIVE CENTER OPERATING SYSTEM
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
                            High impact. Compact footprint. Powered end-to-end by the University School Operating System.
                        </p>
                    </div>

                    {/* 4 Economic Tiles */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {[
                            { icon: TrendingUp, value: '$450k', label: 'Target Annual Revenue', sub: 'Based on 30-student local cohort' },
                            { icon: Users, value: '1 : 15', label: 'Mentor Ratio', sub: 'University-graduate facilitators' },
                            { icon: Building, value: '1,200', label: 'Sq. Ft. Footprint', sub: 'High-efficiency studio layout' },
                            { icon: Cpu, value: '100%', label: 'AI Curriculum Engine', sub: 'Automated syllabus transformation' },
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
                                A Complete &ldquo;School-in-a-Box&rdquo; Operating System.
                            </h3>
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                Center Directors focus on community, mentorship, and hands-on group labs while our platform handles syllabus-to-story transformation, XP mastery telemetry, parent reporting, and partner university credit tracking.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'Real-time cohort progress across all 4 Knowledge Schools',
                                    'Turnkey hardware specs for wind-tunnel, robotics & biomedical labs',
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
                                            30 Active Students · Ages 11–17 · 4 Knowledge Schools
                                        </div>
                                    </div>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-[#8B2332] border border-[#E6C687]/40 text-[#E6C687] text-[10px] font-bold uppercase tracking-wider">
                                    Live Center Telemetry
                                </span>
                            </div>

                            <div className="bg-[#F5EBDC] text-[#2B0A10] rounded-2xl p-5 border border-[#C9B47C] mb-5">
                                <div className="text-xs font-bold uppercase tracking-wider text-[#8B2332] mb-3">
                                    Active Today at Your Center
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                                    {[
                                        {
                                            squad: 'Engineering Squad Alpha (4 Students)',
                                            lab: '1903 Wright Wind Tunnel · PHY 121',
                                            status: '88% Mastery · 3.0 Credits',
                                        },
                                        {
                                            squad: 'Biomedics Squad Curie (4 Students)',
                                            lab: 'Cellular Diagnostics Lab · BIO 181',
                                            status: '82% Mastery · 4.0 Credits',
                                        },
                                        {
                                            squad: 'Business Squad Detroit (4 Students)',
                                            lab: 'Assembly Line Economics · ECN 212',
                                            status: '91% Mastery · 3.0 Credits',
                                        },
                                        {
                                            squad: 'Law & Policy Squad Lincoln (4 Students)',
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
                                <span className="text-[#E6C687] font-bold">Avg. 18.5 Credits / Student / Year</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                5. INTERACTIVE FRANCHISE ROI ESTIMATOR & CENTER APPLICATION FORM
                ═══════════════════════════════════════════════════════════ */}
            <section id="franchise-application" className="py-20 bg-[#FAF8F5] scroll-mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="text-[#8B2332] font-bold tracking-[0.22em] text-xs uppercase mb-3 block">
                            Reserve Your Territory &amp; Model Your Center
                        </span>
                        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2D2D] mb-4 leading-tight">
                            <span className="block">Launch a University School Center</span>
                            <span className="block text-[#8B2332] mt-1">In Your Community.</span>
                        </h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            Use the interactive cohort calculator on the left to model your center&apos;s annual economics, then submit your territory inquiry on the right to receive the Franchise Prospectus and schedule your Founding Director call.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        {/* Left 5 Cols: Interactive Center Cohort & Economics Calculator */}
                        <div className="lg:col-span-5 bg-[#18070B] text-white rounded-3xl p-7 sm:p-8 border border-[#E6C687]/40 shadow-2xl space-y-6">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-[#E6C687] block mb-1">
                                    Interactive Unit Economics Estimator
                                </span>
                                <h3 className="font-serif text-2xl font-bold text-white">
                                    Model Your Local Cohort
                                </h3>
                            </div>

                            {/* Student Count Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-300 font-medium">Target Enrolled Students</span>
                                    <span className="font-bold text-[#E6C687]">{studentCount} Students ({Math.ceil(studentCount / 4)} Squads)</span>
                                </div>
                                <input
                                    type="range"
                                    min="15"
                                    max="60"
                                    step="5"
                                    value={studentCount}
                                    onChange={(e) => setStudentCount(Number(e.target.value))}
                                    className="w-full accent-[#E6C687] cursor-pointer"
                                />
                                <div className="flex justify-between text-[11px] text-slate-400">
                                    <span>15 (Micro-Studio)</span>
                                    <span>30 (Standard Center)</span>
                                    <span>60 (Flagship Hub)</span>
                                </div>
                            </div>

                            {/* Monthly Membership Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-300 font-medium">Monthly Center Tuition / Student</span>
                                    <span className="font-bold text-[#E6C687]">${monthlyTuition.toLocaleString()} / mo</span>
                                </div>
                                <input
                                    type="range"
                                    min="950"
                                    max="1650"
                                    step="50"
                                    value={monthlyTuition}
                                    onChange={(e) => setMonthlyTuition(Number(e.target.value))}
                                    className="w-full accent-[#E6C687] cursor-pointer"
                                />
                                <div className="flex justify-between text-[11px] text-slate-400">
                                    <span>$950/mo (Suburban)</span>
                                    <span>$1,250/mo (Standard)</span>
                                    <span>$1,650/mo (Metro)</span>
                                </div>
                            </div>

                            {/* Calculated Outputs Box */}
                            <div className="bg-[#F5EBDC] text-[#2B0A10] rounded-2xl p-5 border border-[#C9B47C] space-y-3">
                                <div className="flex items-center justify-between pb-2.5 border-b border-[#2B0A10]/15">
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#8B2332]">
                                        Projected Annual Gross Revenue
                                    </span>
                                    <span className="font-serif text-2xl font-bold text-[#1F070B]">
                                        ${annualRevenue.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#2B0A10]/80 font-medium">Est. Net Operating Income</span>
                                    <span className="font-bold text-emerald-800">${estNetIncome.toLocaleString()} / yr</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#2B0A10]/80 font-medium">Facilitator Staffing (1:15 Ratio)</span>
                                    <span className="font-bold text-[#1F070B]">{mentorCount} Learning Facilitator{mentorCount > 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#2B0A10]/80 font-medium">Recommended Studio Footprint</span>
                                    <span className="font-bold text-[#1F070B]">{recommendedSqFt} sq. ft.</span>
                                </div>
                            </div>

                            <div className="text-[11px] text-slate-400 leading-relaxed">
                                *Estimates are for planning illustration based on standard 12-month cohort enrollment. Full financial disclosures are provided during Step 01 Territory Qualification.
                            </div>
                        </div>

                        {/* Right 7 Cols: Actionable Franchisee & Center Launch Application Form */}
                        <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-10 border border-[#C9B47C]/50 shadow-xl">
                            {submitted ? (
                                <div className="py-8 text-center space-y-5">
                                    <div className="w-16 h-16 rounded-2xl bg-[#8B2332] text-[#E6C687] flex items-center justify-center mx-auto shadow-lg">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <span className="inline-block px-3.5 py-1 rounded-full bg-[#8B2332]/10 text-[#8B2332] text-xs font-bold uppercase tracking-widest">
                                        Step 01 Initiated · Territory Inquiry Received
                                    </span>
                                    <h3 className="font-serif text-3xl font-bold text-[#1F070B]">
                                        Welcome to the Founding Center Pipeline, {formData.fullName || 'Partner'}.
                                    </h3>
                                    <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                                        We have logged your territory request for <strong>{formData.cityState || 'your community'}</strong> (modeled for a <strong>{studentCount}-student cohort</strong> at <strong>${annualRevenue.toLocaleString()}/yr</strong> projected gross tuition).
                                    </p>

                                    <div className="bg-[#FAF8F5] border border-[#C9B47C]/50 rounded-2xl p-6 text-left max-w-lg mx-auto space-y-3">
                                        <div className="text-xs font-bold uppercase tracking-wider text-[#8B2332]">
                                            Your Immediate Next Steps:
                                        </div>
                                        <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                                            <CheckCircle2 size={16} className="text-[#8B2332] shrink-0 mt-0.5" />
                                            <span><strong>1. Territory Availability Check:</strong> Our Founding Center Team is verifying zip-code exclusivity for {formData.cityState || 'your target market'}.</span>
                                        </div>
                                        <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                                            <CheckCircle2 size={16} className="text-[#8B2332] shrink-0 mt-0.5" />
                                            <span><strong>2. Prospectus &amp; Floorplan Kit:</strong> Sent to <strong>{formData.email || 'your email'}</strong> with hardware specs for Zone 01 (Commons) and Zone 02 (Wind-Tunnel &amp; Proctoring Lab).</span>
                                        </div>
                                        <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                                            <CheckCircle2 size={16} className="text-[#8B2332] shrink-0 mt-0.5" />
                                            <span><strong>3. Interactive Curriculum Walkthrough:</strong> Test the live course transformer below before your Founding Director call.</span>
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
                                            Edit Territory Inquiry
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleFormSubmit} className="space-y-5">
                                    <div className="border-b border-slate-100 pb-4">
                                        <span className="text-xs font-bold uppercase tracking-widest text-[#8B2332] block mb-1">
                                            Step 01 · Franchisee &amp; Center Director Application
                                        </span>
                                        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F070B]">
                                            Request Your Territory &amp; Launch Guide
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
                                                placeholder="Dr. Sarah Jenkins"
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
                                                Target City, State / Country *
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
                                                Your Background
                                            </label>
                                            <select
                                                value={formData.background}
                                                onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                                                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm text-[#1F070B] bg-white focus:outline-none focus:border-[#8B2332]"
                                            >
                                                <option>Educator / School Leader</option>
                                                <option>Entrepreneur / Operator</option>
                                                <option>Existing Tutoring / Micro-School</option>
                                                <option>Parent / Community Founder</option>
                                                <option>Real Estate / Multi-Unit Partner</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                                Launch Timeline
                                            </label>
                                            <select
                                                value={formData.timeline}
                                                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm text-[#1F070B] bg-white focus:outline-none focus:border-[#8B2332]"
                                            >
                                                <option>Immediate (Within 90 Days)</option>
                                                <option>Within 3–6 Months</option>
                                                <option>6–12 Months (Next Academic Term)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                                Capital &amp; Space Readiness
                                            </label>
                                            <select
                                                value={formData.capitalTier}
                                                onChange={(e) => setFormData({ ...formData, capitalTier: e.target.value })}
                                                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm text-[#1F070B] bg-white focus:outline-none focus:border-[#8B2332]"
                                            >
                                                <option>$75k – $150k Ready</option>
                                                <option>$150k+ (Multi-Center Territory)</option>
                                                <option>Have Existing Facility / Space</option>
                                                <option>Exploring Financing &amp; Options</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                            Tell Us About Your Community or Vision (Optional)
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            placeholder="Share any details about your target neighborhood, existing student community, or questions for our Founding Center Team..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-[#1F070B] focus:outline-none focus:border-[#8B2332]"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-[#8B2332] to-[#601620] hover:from-[#A3293B] hover:to-[#7A1C29] text-white py-4 px-6 rounded-2xl font-bold text-base shadow-xl flex items-center justify-center gap-2.5 transition-all"
                                    >
                                        <Send size={18} className="text-[#E6C687]" />
                                        Submit Franchisee Territory Application &amp; Get Launch Kit
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

