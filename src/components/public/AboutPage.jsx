import React from 'react';
import {
    MapPin,
    Users,
    Award,
    BookOpen,
    Shield,
    Sparkles,
    GraduationCap,
    ArrowRight,
    Compass,
    CheckCircle2,
} from 'lucide-react';

const ABOUT_PILLAR_TILES = [
    {
        name: 'Interactive XP Pedagogy',
        tagline: 'Experience first, formal university equations second.',
        image: '/images/visuals/kitty_hawk_1_live.jpg',
        icon: Compass,
    },
    {
        name: '4 Knowledge Schools',
        tagline: 'Biomedics, Engineering, Business & Law starting at 11.',
        image: '/images/visuals/school_portrait_engineering.jpg',
        icon: BookOpen,
    },
    {
        name: 'Accredited University Degrees',
        tagline: 'Real university credits, certificates & full degrees.',
        image: '/images/visuals/student_campus_lookup.jpg',
        icon: GraduationCap,
    },
    {
        name: 'Global Micro-Campuses',
        tagline: 'Online, Tablet, TV App & in-person Learning Centers.',
        image: '/images/visuals/channel_centers.jpg',
        icon: Users,
    },
];

export const AboutPage = ({ onNavigate }) => {
    return (
        <div className="flex flex-col pb-20 bg-[#FAF8F5]">
            {/* ═══════════════════════════════════════════════════════════
                1. FULL-BLEED DARK BURGUNDY & GOLD HERO (MATCHES LANDING TILES)
                ═══════════════════════════════════════════════════════════ */}
            <section className="relative bg-[#1F070B] text-white overflow-hidden border-b border-[#C9B47C]/30">
                <div className="relative min-h-[540px] flex flex-col justify-between">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/visuals/hero_mentors_scene.jpg"
                            alt="University School student learning with Orville & Wilbur Wright, Albert Einstein, Nikola Tesla, and Amelia Earhart"
                            className="w-full h-full object-cover object-right-top opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1F070B] via-[#1F070B]/90 sm:via-[#1F070B]/70 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#190508] via-[#190508]/90 to-transparent" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 w-full">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B2332]/90 border border-[#E6C687]/40 text-[#E6C687] text-xs font-bold uppercase tracking-[0.2em] mb-5">
                                <MapPin size={14} /> Founded by Educators &amp; University Scholars
                            </div>

                            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight leading-[1.03] mb-5 drop-shadow-lg">
                                Rebuilding How the World<br />
                                <span className="text-[#E6C687]">Earns a College Degree.</span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-100/95 leading-relaxed mb-6 max-w-xl drop-shadow">
                                University School was built on a simple conviction: ambitious young minds shouldn&apos;t spend years waiting in passive lecture halls. Starting at age 11, students live real breakthroughs with history&apos;s greatest minds and earn accredited university credits, certificates, and full degrees.
                            </p>

                            <div className="flex flex-wrap items-center gap-3.5">
                                <button
                                    onClick={() => onNavigate && onNavigate('students')}
                                    className="group bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] hover:from-[#F7E0AD] hover:to-[#D4AF6A] text-[#23090D] px-7 py-4 rounded-2xl font-bold text-base shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-all flex items-center gap-2.5"
                                >
                                    Explore Knowledge Schools
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => onNavigate && onNavigate('asu-demo')}
                                    className="bg-[#8B2332]/90 hover:bg-[#A3293B] border border-[#E6C687]/50 text-white px-6 py-4 rounded-2xl font-bold text-sm sm:text-base shadow-xl transition-all"
                                >
                                    Try Live 1903 Sim Demo
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 4 Docked About Tiles (Matches First Tiles on Landing Page) */}
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {ABOUT_PILLAR_TILES.map((tile, i) => (
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
                2. OUR MISSION & ACADEMIC OVERSIGHT
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#FAF8F5] border-b border-[#8B2332]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6">
                            <span className="text-[#8B2332] font-bold tracking-[0.22em] text-xs uppercase mb-3 block">
                                Why We Built University School
                            </span>
                            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2D2D] mb-6 leading-tight">
                                Don&apos;t Just Learn It. <span className="text-[#8B2332]">Live It.</span>
                            </h2>
                            <p className="text-slate-600 text-lg mb-5 leading-relaxed">
                                Traditional online courses and lecture halls ask students to sit through hours of video and memorize abstract chapters before ever touching a real problem.
                            </p>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                We partnered with cognitive scientists, university faculty, and interactive simulation designers to build the <strong>Interactive XP Curriculum Model</strong>&mdash;transforming real, accredited university syllabi into first-person historical campaigns where students work alongside the Wright Brothers, Amelia Earhart, Marie Curie, Nikola Tesla, Henry Ford, and Abraham Lincoln.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    'Accredited university courses starting at age 11+',
                                    'College graduates & subject specialists oversee every course',
                                    'Stackable credits, certificates & full bachelor’s degrees',
                                    'Up to $80,000+ in university tuition saved',
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-2.5 text-sm font-semibold text-[#2D2D2D]">
                                        <CheckCircle2 size={18} className="text-[#8B2332] shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-6">
                            <div className="bg-gradient-to-br from-[#23090D] to-[#140508] text-white p-8 sm:p-10 rounded-3xl border border-[#C9B47C]/40 shadow-2xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-12 w-12 rounded-2xl bg-[#E6C687]/15 border border-[#E6C687]/40 flex items-center justify-center shrink-0">
                                        <Shield className="text-[#E6C687]" size={24} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-widest text-[#E6C687]">
                                            Academic Integrity &amp; Rigor
                                        </div>
                                        <h3 className="font-serif font-bold text-white text-2xl">
                                            Academic Oversight &amp; Standards
                                        </h3>
                                    </div>
                                </div>
                                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                                    Every interactive campaign, physics simulation, and Socratic exam preparation module is mapped directly to accredited university learning outcomes and reviewed by experienced university educators.
                                </p>
                                <div className="bg-[#F5EBDC] text-[#2B0A10] rounded-2xl p-5 border border-[#C9B47C] space-y-3">
                                    {[
                                        'Direct Alignment with Partner University Syllabi (e.g. ASU Online)',
                                        'First-Principles Socratic Coaching (Never Spoon-Fed Answers)',
                                        'Proctored University Assessments & Official Transcript Credits',
                                    ].map((name, i) => (
                                        <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-[#1F070B] font-bold">
                                            <Award size={16} className="text-[#8B2332] shrink-0" /> {name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                3. MEET THE FOUNDERS (RICH DARK BURGUNDY & GOLD TILES)
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#19090D] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="text-[#E6C687] font-bold tracking-[0.22em] text-xs uppercase mb-3 block">
                            Leadership
                        </span>
                        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
                            Meet the <span className="text-[#E6C687]">Founders</span>
                        </h2>
                        <p className="text-slate-300 max-w-2xl mx-auto text-lg">
                            University School is led by educators and researchers with decades of international K-12 and higher-education leadership.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Dr. Dave */}
                        <div className="bg-[#140709] rounded-3xl border border-[#E6C687]/35 p-8 shadow-2xl flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#8B2332] to-[#C9B47C] flex items-center justify-center text-white text-2xl font-serif font-bold shadow-lg border border-[#E6C687]/50">
                                        D
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-2xl font-bold text-white">Dr. Dave</h3>
                                        <p className="text-[#E6C687] text-sm font-bold">Co-Founder &amp; Academic Director</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                                    With a Ph.D. from Harvard University, Dr. Dave brings world-class academic credentials and research expertise to University School&apos;s Interactive XP curriculum architecture and accredited university degree partnerships.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                                <span className="px-3 py-1 rounded-full bg-[#8B2332] border border-[#E6C687]/40 text-[#E6C687] text-[10px] font-bold uppercase tracking-wider">
                                    Ph.D., Harvard University
                                </span>
                                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
                                    Academic Architecture
                                </span>
                            </div>
                        </div>

                        {/* Frank */}
                        <div className="bg-[#140709] rounded-3xl border border-[#E6C687]/35 p-8 shadow-2xl flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#C9B47C] to-[#8B2332] flex items-center justify-center text-white text-2xl font-serif font-bold shadow-lg border border-[#E6C687]/50">
                                        F
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-2xl font-bold text-white">Frank</h3>
                                        <p className="text-[#E6C687] text-sm font-bold">Co-Founder &amp; Education Director</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                    With over 20 years of experience in education, Frank has developed Canadian Offshore K-12 schools internationally. Canada is consistently recognized as one of the highest-performing English-speaking education systems in the world based on PISA results.
                                </p>
                                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                    Frank was honored to receive the Noble Partner in Education Medal from the Government of Canada during the celebration of Canada&apos;s 150th anniversary. He also holds the ASCA U Career Development Specialist and College Admissions Specialist designations from the American School Counselor Association (ASCA).
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                                <span className="px-3 py-1 rounded-full bg-[#8B2332] border border-[#E6C687]/40 text-[#E6C687] text-[10px] font-bold uppercase tracking-wider">
                                    20+ Years Global Education
                                </span>
                                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
                                    Noble Partner Medal
                                </span>
                                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
                                    ASCA Certified
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
