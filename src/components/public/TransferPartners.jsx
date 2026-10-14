import React, { useState } from 'react';
import {
    GraduationCap,
    Award,
    BookOpen,
    CheckCircle2,
    Sparkles,
    ArrowRight,
    Building2,
    Users,
    HeartPulse,
    Settings,
    Briefcase,
    Scale,
    Search,
    Globe,
    ShieldCheck,
} from 'lucide-react';

const DEGREE_SCHOOL_TILES = [
    {
        id: 'All',
        name: 'All 4 Knowledge Schools',
        tagline: '60+ Universities · Accredited Credits & Degrees',
        image: '/images/visuals/student_campus_lookup.jpg',
        icon: GraduationCap,
    },
    {
        id: 'Engineering',
        name: 'Engineering & Aerospace',
        tagline: 'B.S. Engineering · Wright 1903 & Earhart Labs',
        image: '/images/visuals/hero_card_engineering.jpg',
        icon: Settings,
    },
    {
        id: 'Biomedics',
        name: 'Biomedics & Life Sciences',
        tagline: 'B.S. Biomedical Sciences · Curie & Cellular Labs',
        image: '/images/visuals/hero_card_biomedics.jpg',
        icon: HeartPulse,
    },
    {
        id: 'Business',
        name: 'Business & Venture',
        tagline: 'B.S. Business & Finance · Ford Industrial Labs',
        image: '/images/visuals/hero_card_business.jpg',
        icon: Briefcase,
    },
    {
        id: 'Law',
        name: 'Law & Public Service',
        tagline: 'B.A. Law & Policy · Lincoln Constitutional Labs',
        image: '/images/visuals/hero_card_law.jpg',
        icon: Scale,
    },
];

const UNIVERSITY_DEGREE_NETWORK = [
    {
        name: 'Arizona State University',
        code: 'ASU',
        region: 'Southwest · Online & Campus',
        iconicLandmark: 'Old Main & Fountain · Tempe',
        featured: true,
        credentialType: "Bachelor's Degrees, Certificates & Early College Credit",
        knowledgeSchools: ['Engineering', 'Biomedics', 'Business', 'Law'],
        flagshipCourses: 'FSE 100 Intro to Engineering · PHY 121 Mechanics · BIO 181 General Biology',
        immersiveHighlight: '1903 Wright Brothers & Amelia Earhart Aerodynamics Campaign',
        image: '/images/campuses/campus_asu.jpg',
    },
    {
        name: 'UC Berkeley',
        code: 'UCB',
        region: 'California · Research University',
        iconicLandmark: 'Doe Memorial Library · Berkeley',
        featured: true,
        credentialType: "Undergraduate Degree Credit & Honors Research Sequences",
        knowledgeSchools: ['Engineering', 'Biomedics', 'Business', 'Law'],
        flagshipCourses: 'Physics 7A Mechanics · Bio 1A Molecular Biology · Econ 1',
        immersiveHighlight: 'Quantum & Relativistic Physics with Einstein & Tesla',
        image: '/images/campuses/campus_ucb.jpg',
    },
    {
        name: 'UCLA',
        code: 'UCLA',
        region: 'California · Research University',
        iconicLandmark: 'Royce Hall · Westwood',
        featured: true,
        credentialType: "Bachelor's Degree Pathways & Accredited Course Credit",
        knowledgeSchools: ['Biomedics', 'Engineering', 'Law', 'Business'],
        flagshipCourses: 'Life Sciences 7A · Mechanical & Aerospace Core · Constitutional Law',
        immersiveHighlight: 'Marie Curie Cellular & Radiological Diagnostics Campaign',
        image: '/images/campuses/campus_ucla.jpg',
    },
    {
        name: 'University of Michigan',
        code: 'UM',
        region: 'Midwest · Flagship Public',
        iconicLandmark: 'Angell Hall · Ann Arbor',
        featured: true,
        credentialType: "Bachelor's Degrees in Engineering, Business & Public Policy",
        knowledgeSchools: ['Engineering', 'Business', 'Biomedics', 'Law'],
        flagshipCourses: 'ENGR 100 Aerospace Design · ECON 101 · Ross Business Foundations',
        immersiveHighlight: '1913 Detroit Highland Park Industrial Scale Campaign',
        image: '/images/campuses/campus_um.jpg',
    },
    {
        name: 'University of Virginia',
        code: 'UVA',
        region: 'East Coast · Flagship Public',
        iconicLandmark: 'The Rotunda & Lawn · Charlottesville',
        featured: true,
        credentialType: "Bachelor's Degrees in Law, Governance, Commerce & STEM",
        knowledgeSchools: ['Law', 'Business', 'Engineering', 'Biomedics'],
        flagshipCourses: 'Constitutional Foundations · Commerce & Ethics · Applied Calculus',
        immersiveHighlight: 'Constitutional Convention & Lincoln Appellate Moot Court',
        image: '/images/campuses/campus_uva.jpg',
    },
    {
        name: 'Georgia Institute of Technology',
        code: 'GT',
        region: 'Southeast · Technological Institute',
        iconicLandmark: 'Tech Tower · Atlanta',
        featured: true,
        credentialType: 'B.S. in Aerospace, Mechanical & Computer Engineering',
        knowledgeSchools: ['Engineering', 'Business'],
        flagshipCourses: 'AE 1601 Intro to Aerospace · CS 1301 Computing · PHYS 2211',
        immersiveHighlight: 'Kill Devil Hills Wind Tunnel & Flight Telemetry Lab',
        image: '/images/campuses/campus_gt.jpg',
    },
    {
        name: 'Purdue University',
        code: 'PU',
        region: 'Midwest · Aerospace & STEM',
        iconicLandmark: 'Purdue Bell Tower · West Lafayette',
        featured: true,
        credentialType: 'B.S. in Aeronautical Engineering, Aviation & Technology',
        knowledgeSchools: ['Engineering', 'Biomedics', 'Business'],
        flagshipCourses: 'AAE 203 Aeromechanics · ENGR 131 · MA 165 Analytic Geometry',
        immersiveHighlight: 'Amelia Earhart & Wright Brothers Flight Dynamics Sequence',
        image: '/images/campuses/campus_pu.jpg',
    },
    {
        name: 'University of Texas at Austin',
        code: 'UT',
        region: 'Southwest · Flagship Public',
        iconicLandmark: 'Main Building & Tower · Austin',
        featured: true,
        credentialType: "Bachelor's Degrees in Engineering, Natural Sciences & Business",
        knowledgeSchools: ['Engineering', 'Biomedics', 'Business', 'Law'],
        flagshipCourses: 'ASE 102 Intro to Aerospace · BIO 311C · ACC 310F',
        immersiveHighlight: 'Propulsion, Orbital Mechanics & Venture Scale Labs',
        image: '/images/campuses/campus_ut.jpg',
    },
    {
        name: 'University of Washington',
        code: 'UW',
        region: 'Pacific Northwest · Flagship Public',
        iconicLandmark: 'Suzzallo Library · Seattle',
        featured: false,
        credentialType: "Bachelor's Degrees in Aeronautics, Bioengineering & Computer Science",
        knowledgeSchools: ['Engineering', 'Biomedics', 'Business'],
        flagshipCourses: 'AA 210 Engineering Statics · BIOEN 215 · CSE 142',
        immersiveHighlight: 'Pacific Aviation & Biomedical Instrumentation Campaigns',
        image: '/images/campuses/campus_uw.jpg',
    },
    {
        name: 'University of Florida',
        code: 'UF',
        region: 'Southeast · Flagship Public',
        iconicLandmark: 'Century Tower · Gainesville',
        featured: false,
        credentialType: "Bachelor's Degrees & Accelerated Early-College Credits",
        knowledgeSchools: ['Biomedics', 'Engineering', 'Business', 'Law'],
        flagshipCourses: 'PHY 2048 Physics with Calculus · BSC 2010 · AEB 2014',
        immersiveHighlight: 'Cellular Pathology & Aerospace Propulsion Labs',
        image: '/images/campuses/campus_uf.jpg',
    },
    {
        name: 'UNC Chapel Hill',
        code: 'UNC',
        region: 'East Coast · Flagship Public',
        iconicLandmark: 'The Old Well · Chapel Hill',
        featured: false,
        credentialType: "Bachelor's Degrees in Biomedical Sciences, Law & Public Policy",
        knowledgeSchools: ['Biomedics', 'Law', 'Business'],
        flagshipCourses: 'BIOL 101 · PLCY 101 Public Policy · ECON 101',
        immersiveHighlight: 'Outer Banks Kitty Hawk Heritage & Public Service Labs',
        image: '/images/campuses/campus_unc.jpg',
    },
    {
        name: 'Penn State University',
        code: 'PSU',
        region: 'East Coast · World Campus & Flagship',
        iconicLandmark: 'Old Main · University Park',
        featured: false,
        credentialType: "Online & Campus Bachelor's Degrees, Certificates & Credits",
        knowledgeSchools: ['Engineering', 'Business', 'Biomedics', 'Law'],
        flagshipCourses: 'AERSP 101 · PHYS 211 Mechanics · BA 100 Business',
        immersiveHighlight: 'Full 120-Credit Accelerated Undergraduate Degree Pathways',
        image: '/images/campuses/campus_psu.jpg',
    },
    {
        name: 'Ohio State University',
        code: 'OSU',
        region: 'Midwest · Flagship Public',
        iconicLandmark: 'Thompson Library · Columbus',
        featured: false,
        credentialType: "Bachelor's Degrees in Aviation, Engineering & Health Sciences",
        knowledgeSchools: ['Engineering', 'Biomedics', 'Business'],
        flagshipCourses: 'ENGR 1181 Fundamentals of Engineering · PHYSICS 1250',
        immersiveHighlight: 'Dayton Wright Cycle Co. Mechanical Engineering Origins',
        image: '/images/campuses/campus_osu.jpg',
    },
    {
        name: 'UC San Diego',
        code: 'UCSD',
        region: 'California · Research University',
        iconicLandmark: 'Geisel Library · La Jolla',
        featured: false,
        credentialType: 'B.S. in Bioengineering, Aerospace & Cognitive Science',
        knowledgeSchools: ['Biomedics', 'Engineering'],
        flagshipCourses: 'BILD 1 The Cell · MAE 02 Aerospace · PHYS 2A',
        immersiveHighlight: 'Genomic & Aerodynamic Simulation Campaigns',
        image: '/images/campuses/campus_ucsd.jpg',
    },
    {
        name: 'New York University',
        code: 'NYU',
        region: 'East Coast · Global Research University',
        iconicLandmark: 'Washington Square Arch · NYC',
        featured: false,
        credentialType: "Bachelor's Degrees in Business, Law, Economics & Tandon STEM",
        knowledgeSchools: ['Business', 'Law', 'Engineering'],
        flagshipCourses: 'EG-UY 1004 Intro to Engineering · ECON-UA 1 · Law & Society',
        immersiveHighlight: 'Nikola Tesla Wardenclyffe & Wall Street Capital Labs',
        image: '/images/campuses/campus_nyu.jpg',
    },
    {
        name: 'University of Southern California',
        code: 'USC',
        region: 'California · Private Research University',
        iconicLandmark: 'Bovard Administration · Los Angeles',
        featured: false,
        credentialType: "Bachelor's Degrees in Astronautical Engineering, Business & Law",
        knowledgeSchools: ['Engineering', 'Business', 'Law', 'Biomedics'],
        flagshipCourses: 'AME 105 Intro to Aerodynamics · BUAD 304 · POSC 100',
        immersiveHighlight: 'Interactive Media, Flight Systems & Venture Labs',
        image: '/images/campuses/campus_usc.jpg',
    },
];

const ADDITIONAL_PARTNER_UNIVERSITIES = [
    'UC Davis',
    'UC Irvine',
    'UC Santa Barbara',
    'UC Santa Cruz',
    'UC Riverside',
    'UC Merced',
    'University of Wisconsin–Madison',
    'University of Illinois Urbana-Champaign',
    'University of Maryland',
    'Rutgers University',
    'Indiana University',
    'University of Minnesota',
    'Michigan State University',
    'Virginia Tech',
    'Texas A&M University',
    'University of Colorado Boulder',
    'University of Arizona',
    'Boston University',
    'Northeastern University',
    'George Washington University',
    'Fordham University',
    'Southern Methodist University',
    'Baylor University',
    'Clemson University',
    'University of Pittsburgh',
    'University of Iowa',
    'Iowa State University',
    'University of Oregon',
    'Oregon State University',
    'University of Utah',
    'Stony Brook University',
    'Binghamton University',
    'University at Buffalo',
    'Florida State University',
    'University of Central Florida',
    'North Carolina State University',
    'University of Georgia',
    'Auburn University',
    'University of Massachusetts Amherst',
    'University of Connecticut',
    'University of Delaware',
    'Temple University',
    'Drexel University',
    'yracuse University',
].map((n) => (n === 'yracuse University' ? 'Syracuse University' : n));

export const TransferPartners = ({ onNavigate }) => {
    const [selectedSchool, setSelectedSchool] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUniversities = UNIVERSITY_DEGREE_NETWORK.filter((u) => {
        const matchesSchool = selectedSchool === 'All' || u.knowledgeSchools.includes(selectedSchool);
        const matchesSearch =
            !searchQuery.trim() ||
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.flagshipCourses.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.region.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSchool && matchesSearch;
    });

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
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1F070B] via-[#1F070B]/90 sm:via-[#1F070B]/70 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#190508] via-[#190508]/90 to-transparent" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 w-full">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B2332]/90 border border-[#E6C687]/40 text-[#E6C687] text-xs font-bold uppercase tracking-[0.2em] mb-5">
                                <GraduationCap size={14} /> 60+ Accredited University Partners
                            </div>

                            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight leading-[1.03] mb-5 drop-shadow-lg">
                                Real University Courses.<br />
                                <span className="text-[#E6C687]">Full College Degrees.</span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-100/95 leading-relaxed mb-6 max-w-xl drop-shadow">
                                University School students don&apos;t wait until 18 to start college. Starting at age 11, students take real, accredited university courses transformed into interactive historical campaigns&mdash;earning official university credits, stackable certificates, and full bachelor&apos;s degrees.
                            </p>

                            <div className="flex flex-wrap items-center gap-3.5">
                                <button
                                    onClick={() => onNavigate && onNavigate('asu-demo')}
                                    className="group bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] hover:from-[#F7E0AD] hover:to-[#D4AF6A] text-[#23090D] px-7 py-4 rounded-2xl font-bold text-base shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-all flex items-center gap-2.5"
                                >
                                    <Sparkles size={18} className="text-[#8B2332]" />
                                    See Interactive Course Demo
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => onNavigate && onNavigate('students')}
                                    className="bg-[#8B2332]/90 hover:bg-[#A3293B] border border-[#E6C687]/50 text-white px-6 py-4 rounded-2xl font-bold text-sm sm:text-base shadow-xl transition-all"
                                >
                                    Explore the 4 Knowledge Schools
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Docked Knowledge School Filter Tiles (Matches First Tiles on Landing Page) */}
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
                        <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6C687] mb-3">
                            Filter University Degree &amp; Credit Network by Knowledge School:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                            {DEGREE_SCHOOL_TILES.map((tile) => {
                                const active = selectedSchool === tile.id;
                                return (
                                    <button
                                        key={tile.id}
                                        onClick={() => setSelectedSchool(tile.id)}
                                        className={`group relative rounded-2xl overflow-hidden border text-left shadow-xl transition-all hover:-translate-y-1 ${
                                            active
                                                ? 'border-[#E6C687] ring-2 ring-[#E6C687]/60 bg-[#26090F]'
                                                : 'border-[#E6C687]/30 hover:border-[#E6C687] bg-[#140709]/90'
                                        }`}
                                    >
                                        <div className="h-24 w-full overflow-hidden relative">
                                            <img
                                                src={tile.image}
                                                alt={tile.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#140709] via-[#140709]/35 to-transparent" />
                                        </div>
                                        <div className="px-3.5 pb-3.5 pt-1 flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-xl bg-[#E6C687]/15 border border-[#E6C687]/40 flex items-center justify-center text-[#E6C687] shrink-0">
                                                    <tile.icon size={16} />
                                                </div>
                                                <div>
                                                    <div className="font-serif font-bold text-white text-sm leading-tight">
                                                        {tile.name}
                                                    </div>
                                                    <div className="text-[10px] text-slate-300 leading-snug mt-0.5 line-clamp-1">
                                                        {tile.tagline}
                                                    </div>
                                                </div>
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
                2. HOW UNIVERSITY DEGREE CREDITS WORK (SLIDE 10 / FRANK'S MODEL)
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-16 bg-white border-b border-[#C9B47C]/20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-[#2B0A10] to-[#1A0508] rounded-3xl p-6 sm:p-10 border border-[#C9B47C]/40 shadow-2xl">
                        <div className="grid md:grid-cols-12 gap-8 items-center">
                            <div className="md:col-span-4 rounded-2xl overflow-hidden border border-[#E6C687]/30 shadow-lg">
                                <img
                                    src="/images/visuals/student_campus_lookup.jpg"
                                    alt="Young student earning official university credits and degrees"
                                    className="w-full h-full max-h-[420px] object-cover object-top"
                                />
                            </div>

                            <div className="md:col-span-8">
                                <div className="mb-4">
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6C687] block mb-1">
                                        Direct University Credential Architecture
                                    </span>
                                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                                        How Students Earn Accredited Degrees Starting at 11
                                    </h2>
                                </div>

                                <div className="bg-[#F5EBDC] text-[#2B0A10] rounded-2xl p-5 sm:p-6 shadow-inner space-y-3">
                                    {[
                                        {
                                            icon: Users,
                                            title: '1. ENROLL STARTING AT AGE 11+',
                                            sub: 'No high school diploma required to begin accredited early-college and open-enrollment university courses.',
                                        },
                                        {
                                            icon: Building2,
                                            title: '2. REAL PARTNER UNIVERSITY SYLLABUS',
                                            sub: 'Every course is anchored to an accredited university syllabus (such as ASU Online FSE 100, PHY 121, or BIO 181).',
                                        },
                                        {
                                            icon: BookOpen,
                                            title: '3. LIVE THE COURSE THROUGH UNIVERSITY SCHOOL',
                                            sub: 'Our AI Narrator transforms dry textbook chapters into first-person labs with the Wright Brothers, Amelia Earhart, Marie Curie, and Nikola Tesla.',
                                        },
                                        {
                                            icon: Award,
                                            title: '4. UNIVERSITY-ISSUED CREDITS, CERTIFICATES & DEGREES',
                                            sub: "Complete the university's assessments to receive official university transcript credits that stack directly into undergraduate certificates, associate degrees, and bachelor's degrees.",
                                        },
                                    ].map((row, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-3.5 pb-3 border-b border-[#2B0A10]/12 last:border-b-0 last:pb-0"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-[#3A0C14] text-[#E6C687] flex items-center justify-center shrink-0 shadow mt-0.5">
                                                <row.icon size={18} />
                                            </div>
                                            <div>
                                                <div className="font-serif font-bold text-sm sm:text-base text-[#1F070B]">
                                                    {row.title}
                                                </div>
                                                <div className="text-xs text-[#2B0A10]/85 leading-relaxed">
                                                    {row.sub}
                                                </div>
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
                3. RICH STUDIO TILES — PARTNER UNIVERSITY DEGREE NETWORK
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-16 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#8B2332] block mb-2">
                                Accredited University Courses, Certificates &amp; Degrees
                            </span>
                            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2D2D]">
                                Featured University Degree &amp; Credit Tracks
                            </h2>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full sm:w-80">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search university or course..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#C9B47C]/40 text-sm text-[#2D2D2D] focus:outline-none focus:border-[#8B2332] shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Grid of Rich Dark-Burgundy & Gold University Tiles */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {filteredUniversities.map((uni, idx) => (
                            <div
                                key={idx}
                                className="group bg-[#18070B] text-white rounded-3xl overflow-hidden border border-[#E6C687]/35 hover:border-[#E6C687] shadow-2xl flex flex-col justify-between transition-all hover:-translate-y-1"
                            >
                                {/* Top Visual Banner */}
                                <div className="h-48 relative overflow-hidden">
                                    <img
                                        src={uni.image}
                                        alt={`${uni.name} — ${uni.iconicLandmark || uni.region}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#18070B] via-[#18070B]/25 to-transparent" />

                                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                                        <span className="px-3 py-1 rounded-full bg-[#1F070B]/90 backdrop-blur-md border border-[#E6C687]/40 text-[#E6C687] text-[10px] font-bold uppercase tracking-wider">
                                            {uni.iconicLandmark || uni.region}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-full bg-[#8B2332] border border-[#E6C687]/50 text-white text-[10px] font-bold uppercase tracking-wider">
                                            Age 11+ Eligible
                                        </span>
                                    </div>

                                    <div className="absolute bottom-3 left-5 right-5 flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-2xl bg-[#8B2332] border border-[#E6C687] text-[#E6C687] font-serif font-bold text-sm flex items-center justify-center shrink-0 shadow-lg">
                                            {uni.code}
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-xl font-bold text-white leading-tight drop-shadow">
                                                {uni.name}
                                            </h3>
                                            <div className="text-[11px] text-[#E6C687] font-medium">
                                                {uni.credentialType}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-3">
                                        {/* Knowledge Schools Pills */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {uni.knowledgeSchools.map((schoolName, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2.5 py-0.5 rounded-md bg-[#E6C687]/15 border border-[#E6C687]/30 text-[#E6C687] text-[10px] font-bold uppercase tracking-wider"
                                                >
                                                    {schoolName}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Parchment Inner Box: Transformed Courses */}
                                        <div className="bg-[#F5EBDC] text-[#2B0A10] rounded-2xl p-3.5 border border-[#C9B47C]">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8B2332] mb-1">
                                                Accredited Courses Transformed
                                            </div>
                                            <div className="text-xs font-bold text-[#1F070B] leading-snug mb-2">
                                                {uni.flagshipCourses}
                                            </div>
                                            <div className="text-[11px] text-[#2B0A10]/85 italic border-t border-[#2B0A10]/10 pt-1.5">
                                                Story Lab: {uni.immersiveHighlight}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="pt-3 border-t border-[#E6C687]/20 flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-[#E6C687] flex items-center gap-1.5">
                                            <CheckCircle2 size={14} /> Official Transcript Credit
                                        </span>
                                        <button
                                            onClick={() => onNavigate && onNavigate('asu-demo')}
                                            className="text-xs font-bold text-white hover:text-[#E6C687] inline-flex items-center gap-1 transition-colors"
                                        >
                                            Preview Lab <ArrowRight size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Full 60+ Accredited University Credit & Degree Ecosystem Directory */}
                    <div className="bg-[#19090D] text-white rounded-3xl p-8 sm:p-10 border border-[#E6C687]/35 shadow-2xl">
                        <div className="text-center max-w-3xl mx-auto mb-8">
                            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#E6C687] block mb-2">
                                Nationwide Credit &amp; Degree Recognition
                            </span>
                            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-3">
                                60+ Universities Accepting &amp; Issuing Accredited Credits
                            </h3>
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                Credits and credentials earned through University School&apos;s partner university courses and CLEP mastery sequences are recognized across more than 60 major public and private universities nationwide.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                            {ADDITIONAL_PARTNER_UNIVERSITIES.map((uniName, i) => (
                                <div
                                    key={i}
                                    className="bg-[#240B10] border border-[#E6C687]/25 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs font-medium text-slate-200"
                                >
                                    <Award size={14} className="text-[#E6C687] shrink-0" />
                                    <span className="truncate">{uniName}</span>
                                </div>
                            ))}
                        </div>

                        <div className="text-center pt-4 border-t border-white/10">
                            <button
                                onClick={() => onNavigate && onNavigate('students')}
                                className="bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] hover:from-[#F7E0AD] hover:to-[#D4AF6A] text-[#23090D] px-8 py-4 rounded-2xl font-bold text-sm sm:text-base shadow-xl inline-flex items-center gap-2.5 transition-all"
                            >
                                Choose Your Knowledge School &amp; Start at 11
                                <ArrowRight size={17} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
