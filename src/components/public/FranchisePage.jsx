import React from 'react';
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

export const FranchisePage = ({ onNavigate }) => {
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
                                <Building size={14} /> University School Learning Centers · Global Network
                            </div>

                            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight leading-[1.03] mb-5 drop-shadow-lg">
                                Learn Anywhere.<br />
                                <span className="text-[#E6C687]">Belong Somewhere.</span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-100/95 leading-relaxed mb-6 max-w-xl drop-shadow">
                                Bring a <strong className="text-[#E6C687]">University School Center</strong> to your city. We combine our AI-powered Interactive XP curriculum and accredited university degree pathways with inspiring local micro-campuses where students starting at age 11 build real projects together.
                            </p>

                            <div className="flex flex-wrap items-center gap-3.5">
                                <button
                                    onClick={() => onNavigate && onNavigate('students')}
                                    className="group bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] hover:from-[#F7E0AD] hover:to-[#D4AF6A] text-[#23090D] px-7 py-4 rounded-2xl font-bold text-base shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-all flex items-center gap-2.5"
                                >
                                    Launch a Local Center
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => onNavigate && onNavigate('process')}
                                    className="bg-[#8B2332]/90 hover:bg-[#A3293B] border border-[#E6C687]/50 text-white px-6 py-4 rounded-2xl font-bold text-sm sm:text-base shadow-xl transition-all flex items-center gap-2"
                                >
                                    <Map size={17} className="text-[#E6C687]" />
                                    Explore the Pedagogical Model
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
                                    className="group relative rounded-2xl overflow-hidden border border-[#E6C687]/35 bg-[#140709]/95 text-left shadow-xl"
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
                2. THE PHYSICAL LAYER — BUILT FOR COLLABORATIVE DISCOVERY
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#FAF8F5] border-b border-[#8B2332]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="text-[#8B2332] font-bold tracking-[0.22em] text-xs uppercase mb-3 block">
                            The Physical Micro-Campus Layer
                        </span>
                        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2D2D] mb-4">
                            Find Your People by <span className="text-[#8B2332]">Passion.</span>
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
                3. UNIT ECONOMICS & NATIVE CENTER OPERATING SYSTEM
                   (Replaces outdated app-franchise-ops.png "Springroll" image)
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#19090D] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="text-[#E6C687] font-bold tracking-[0.22em] text-xs uppercase mb-3 block">
                            Turnkey Micro-Campus Architecture
                        </span>
                        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
                            The University School <span className="text-[#E6C687]">Center Model.</span>
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
                                            lab: '1903 Wright Wind Tunnel · ASU FSE 100',
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
        </div>
    );
};
