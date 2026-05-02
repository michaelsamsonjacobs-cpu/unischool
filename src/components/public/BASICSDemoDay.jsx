import React, { useEffect } from 'react';
import { ArrowRight, ExternalLink, Award, Calendar, MapPin, Users, Sparkles, Star, GraduationCap, TrendingUp, Rocket, FileText, User, Camera } from 'lucide-react';
import { trackPageView, trackBASICSView } from '../../utils/trackingPixels';

/**
 * BASICS @ Berkeley — Spring 2026 Demo Day
 * Investor-targeted landing page with cohort company showcase & investment links.
 * 
 * BASICS = Berkeley Accelerator & Startup Incubator in Cognitive Science
 * Led by CogSci Lecturer Uri Korisky and BASICS Founder Mike Jacobs
 * Frank (CEO of USAI) is a BASICS mentor and University School is the mentor company.
 */

// ─── Cohort Companies Data ────────────────────────────────────
// Update this array with actual companies, logos, and deal links
const COHORT_COMPANIES = [
    {
        name: 'University School',
        slug: 'university-school',
        founder: 'Frank Barcellos',
        description: 'AI-powered, gamified educational platform that hyper-accelerates students into top universities 2 years early through sovereign AI mentorship.',
        dealUrl: 'https://sydecar.io/deal/university-school',
        isMentorCompany: true,
        mentorNote: 'Frank Barcellos, CEO of USAI, serves as BASICS mentor. University School is the official Mentor Company of the Spring 2026 cohort.',
        color: '#8B2332',
        logo: '/images/company-logos/usai-logo.png',
        pitchPhoto: '/images/basics-spring-2026/group-cohort-1.jpg',
    },
    {
        name: 'NewNav',
        slug: 'newnav',
        founder: 'Mina Sonmez',
        description: 'AI college navigation platform for first-gen and immigrant high school students — the map they never had, from zero to acceptance.',
        dealUrl: 'https://sydecar.io/deal/newnav',
        isMentorCompany: false,
        color: '#3b82f6',
        logo: '/images/company-logos/newnav-logo.png',
    },
    {
        name: 'Lumina',
        slug: 'lumina',
        founder: 'Ellen Zhang',
        description: 'A STEM learning revolution — combining AI personalization with Tinder-style interactive knowledge exploration for self-learners.',
        dealUrl: 'https://sydecar.io/deal/lumina',
        isMentorCompany: false,
        color: '#8b5cf6',
        logo: '/images/company-logos/lumina-logo.png',
    },
    {
        name: 'TheseDays',
        slug: 'thesedays',
        founder: 'Claudius Ma',
        description: 'Spotify for your memory — a new architecture that bridges love and self-actualization through AI-structured life journaling.',
        dealUrl: 'https://sydecar.io/deal/thesedays',
        isMentorCompany: false,
        color: '#10b981',
        logo: '/images/company-logos/thesedays-logo.png',
    },
    {
        name: 'Breeze',
        slug: 'breeze',
        founder: 'Jessica Miller',
        description: 'AI-powered media bias detection that helps consumers and businesses take back control of the information they trust.',
        dealUrl: 'https://sydecar.io/deal/breeze',
        isMentorCompany: false,
        color: '#f59e0b',
        logo: '/images/company-logos/breeze-logo.png',
    },
    {
        name: 'Cognitive Calendar',
        slug: 'cognitive-calendar',
        founder: 'Naomi Toubian',
        description: 'Neuroscience-backed scheduling that optimizes for cognition, not just time — reducing burnout and boosting productivity.',
        dealUrl: 'https://sydecar.io/deal/cognitive-calendar',
        isMentorCompany: false,
        color: '#0ea5e9',
        logo: '/images/company-logos/cognitive-calendar-logo.png',
    },
    {
        name: 'Evardi Energy',
        slug: 'evardi-energy',
        founder: 'Aarya Borele, Evan Davis & Diva Shah',
        description: 'AI-powered demand intelligence for renewable energy grids — live across 3 continents with 92% forecast accuracy.',
        dealUrl: 'https://sydecar.io/deal/evardi-energy',
        isMentorCompany: false,
        color: '#22c55e',
        logo: '/images/company-logos/evardi-logo.png',
    },
    {
        name: 'BobbyPin',
        slug: 'bobbypin',
        founder: 'Maya Mitchell',
        description: 'Intelligent AI video content editor designed specifically for hair stylists — clip, cut, and curate social media content automatically.',
        dealUrl: 'https://sydecar.io/deal/bobbypin',
        isMentorCompany: false,
        color: '#ec4899',
        logo: '/images/company-logos/bobbypin-logo.png',
    },
    {
        name: 'YouLet',
        slug: 'youlet',
        founder: 'Kaho Furukawa',
        description: 'Human Relational Intelligence Layer — redesigning human relationships using AI to rebuild genuine social connections.',
        dealUrl: 'https://sydecar.io/deal/youlet',
        isMentorCompany: false,
        color: '#a855f7',
        logo: '/images/company-logos/youlet-logo.png',
    },
    {
        name: 'TradePath',
        slug: 'tradepath',
        founder: 'Chris Weiss',
        description: 'The neuroscience-backed discovery brand for the post-college generation — find your trade, build your life.',
        dealUrl: 'https://sydecar.io/deal/tradepath',
        isMentorCompany: false,
        color: '#f97316',
        logo: '/images/company-logos/tradepath-logo.png',
    },
    {
        name: 'Heirloom',
        slug: 'heirloom',
        founder: 'Yasmine Baker',
        description: 'Connecting artisans with consumers globally — authentic, ethically-sourced, culturally-accurate fashion and craftsmanship.',
        dealUrl: 'https://sydecar.io/deal/heirloom',
        isMentorCompany: false,
        color: '#b45309',
        logo: '/images/company-logos/heirloom-logo.png',
    },
    {
        name: 'Qluu',
        slug: 'qluu',
        founder: 'Mike Jacobs & Arkadiy Okhman',
        description: 'AI-powered integrated air and missile defense platform — Titanium Dome. Full-spectrum threat interception at cost parity.',
        dealUrl: 'https://sydecar.io/deal/qluu',
        isMentorCompany: false,
        color: '#dc2626',
        logo: '/images/company-logos/qluu-logo.png',
    },
];

// ─── Press Quotes ─────────────────────────────────────────────
const PRESS_ITEMS = [
    {
        quote: 'From stroke rehabilitation to supply chain resilience and diabetes care, Cognitive Science student entrepreneurs pitched their startups to potential investors at the Berkeley Accelerator & Startup Incubator in Cognitive Science\'s (BASICS) Fall Pitch Day.',
        source: 'UC Berkeley Letters & Science',
        url: 'https://ls.berkeley.edu/news/cognitive-science-students-pitch-health-tech-ai-assistants-investors',
    },
    {
        quote: 'Michael Jacobs is a software inventor, entrepreneur, and 2004 sociology graduate who teaches Startup Battle School. The innovative cognitive science course blends a classic M.B.A. curriculum with Jacobs\' business connections.',
        source: 'UC Berkeley Cognitive Science',
        url: 'https://cogsci.berkeley.edu/news/innovative-course-brings-startup-mentality-cognitive-science',
    },
    {
        quote: 'Yasmine Baker, a student in the BASICS program, is turning her love of Moroccan culture and her understanding of cognitive science principles into a blossoming fashion brand.',
        source: 'UC Berkeley Letters & Science',
        url: 'https://ls.berkeley.edu/news/student-entrepreneur-uses-cognitive-science-principles-build-fashion-startup',
    },
];

// ─── Past Investor Panelists ──────────────────────────────────
const INVESTOR_PANELISTS = [
    { name: 'Aman Verjee', firm: 'Practical Venture Capital', url: 'https://www.linkedin.com/in/amanverjee/' },
    { name: 'Dermot Mee', firm: 'Fourier', url: 'https://www.linkedin.com/in/dermot-mee/' },
    { name: 'Lucas Miller', firm: 'Berkeley Haas School of Business', url: 'https://www.linkedin.com/in/lucasdmiller/' },
    { name: 'Sudarshan Sridharan', firm: 'SF1', url: 'https://www.linkedin.com/in/sudarsridharan/' },
    { name: 'Andrey Karailiev', firm: 'Prima Mente', url: 'https://www.linkedin.com/in/andreykarailiev/' },
    { name: 'Tyler Bosmeny', firm: 'Y Combinator (Keynote Speaker)', url: 'https://www.linkedin.com/in/tylerbosmeny/' },
    { name: 'Oguzhan Aygoren', firm: 'Investor & Advisor', url: 'https://www.linkedin.com/in/oguzhanaygoren/' },
    { name: 'Dr. David Whitney', firm: 'UC Berkeley Cognitive Science', url: 'https://www.linkedin.com/in/david-whitney-b084454/' },
    { name: 'Elizabeth Redman Cleveland', firm: 'Berkeley Startup Cluster', url: 'https://www.linkedin.com/in/elizabethredmancleveland/' },
    { name: 'Jeremy Fiance', firm: 'The House Fund', url: 'https://www.linkedin.com/in/jeremyfiance/' },
];

export const BASICSDemoDay = ({ onNavigate }) => {
    // Fire remarketing events on page load
    useEffect(() => {
        trackPageView('BASICS Demo Day', '/basics');
        // Fire Meta Pixel ViewContent for remarketing
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'ViewContent', {
                content_name: 'BASICS Demo Day Landing Page',
                content_category: 'BASICS_Demo_Day',
            });
        }
    }, []);

    const handleCompanyClick = (company) => {
        trackBASICSView(company.name);
        window.open(company.dealUrl, '_blank', 'noopener');
    };

    return (
        <div className="flex flex-col pb-20">
            {/* ═══════════════════════════════════════════════════════════
                HERO SECTION
                ═══════════════════════════════════════════════════════════ */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#003262] via-[#001a3d] to-[#0a0a1a]" />
                    {/* Hero image overlay */}
                    <img
                        src="/images/basics-hero-banner.png"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
                    />
                    {/* Animated grid */}
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            backgroundSize: '60px 60px',
                            backgroundImage: 'linear-gradient(to right, rgba(201,180,124,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,180,124,0.3) 1px, transparent 1px)',
                        }}
                    />
                    {/* Glow orbs */}
                    <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#C9B47C]/15 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#003262]/30 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 pb-20">
                    {/* Berkeley badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#C9B47C]/30 backdrop-blur-md mb-8">
                        <GraduationCap size={14} className="text-[#C9B47C]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[#C9B47C]">
                            UC Berkeley • Cognitive Science
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.05]"
                        style={{ fontFamily: "'Playfair Display', serif" }}>
                        <span className="text-white">BASICS</span>
                        <span className="text-[#C9B47C]"> @ </span>
                        <span className="text-white">Berkeley</span>
                    </h1>

                    <p className="text-2xl md:text-3xl font-semibold text-white/80 mb-2"
                        style={{ fontFamily: "'Sora', sans-serif" }}>
                        Spring 2026 Demo Day
                    </p>

                    <div className="flex items-center justify-center gap-6 text-white/60 text-sm font-medium mb-10">
                        <span className="flex items-center gap-2">
                            <Calendar size={14} className="text-[#C9B47C]" />
                            May 1, 2026
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#C9B47C]" />
                        <span className="flex items-center gap-2">
                            <MapPin size={14} className="text-[#C9B47C]" />
                            UC Berkeley Campus
                        </span>
                    </div>

                    <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                        The <strong className="text-white">Berkeley Accelerator & Startup Incubator in Cognitive Science</strong> presents
                        its Spring 2026 cohort of student-founded startups to investors.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="#cohort"
                            className="w-full sm:w-auto bg-[#C9B47C] hover:bg-[#b8a56d] text-[#001a3d] px-10 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all shadow-xl shadow-[#C9B47C]/20 hover:shadow-[#C9B47C]/40 hover:scale-105 flex items-center justify-center gap-2"
                        >
                            View Cohort Companies
                            <ArrowRight size={16} />
                        </a>
                        <a
                            href="mailto:basics@universityschool.ai"
                            className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white border border-white/20 px-10 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                        >
                            Investor Inquiries
                            <ArrowRight size={16} />
                        </a>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                ABOUT BASICS SECTION
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-white border-y border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#003262] mb-4">About the Program</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-6 leading-tight"
                                style={{ fontFamily: "'Playfair Display', serif" }}>
                                Berkeley Accelerator & Startup Incubator in Cognitive Science
                            </h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                BASICS is UC Berkeley's undergraduate startup accelerator, housed within the Cognitive Science Program.
                                Founded by <strong>Mike Jacobs</strong> (Berkeley '04), the program blends classic MBA curriculum
                                with hands-on AI tooling and connections to top-tier venture capital.
                            </p>
                            <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                Led by Cognitive Science Lecturer <strong>Uri Korisky</strong> and BASICS Founder <strong>Mike Jacobs</strong>,
                                each cohort of student entrepreneurs builds, iterates, and pitches AI-integrated startups to a panel
                                of professional investors from firms including <strong>Y Combinator</strong>, <strong>Practical Venture Capital</strong>,
                                <strong>The House Fund</strong>, <strong>Techstars</strong>, and <strong>Berkeley Haas IBI</strong>.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {['Multiple Cohorts', 'Y Combinator Exposure', 'Techstars Network', 'VC Pitch Practice', 'AI-First Startups'].map((tag) => (
                                    <span key={tag} className="px-3 py-1 rounded-full bg-[#003262]/5 text-[#003262] text-xs font-bold border border-[#003262]/10">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            {/* Stats grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { value: '6+', label: 'Cohorts Run', icon: Rocket },
                                    { value: '50+', label: 'Startups Launched', icon: TrendingUp },
                                    { value: '3', label: 'UC Berkeley Press Features', icon: Star },
                                    { value: '20+', label: 'Investor Panelists', icon: Users },
                                ].map((stat, i) => (
                                    <div key={i} className="p-5 rounded-2xl bg-[#FAF8F5] border border-slate-200 text-center hover:shadow-md transition-shadow">
                                        <stat.icon size={20} className="mx-auto text-[#C9B47C] mb-2" />
                                        <div className="text-3xl font-bold text-[#2D2D2D] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.value}</div>
                                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                PRESS & CREDIBILITY
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#FAF8F5]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#C9B47C] mb-3">Featured In</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#2D2D2D]"
                            style={{ fontFamily: "'Playfair Display', serif" }}>
                            As Seen in UC Berkeley Press
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {PRESS_ITEMS.map((item, i) => (
                            <a
                                key={i}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#003262]/30 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <GraduationCap size={16} className="text-[#003262]" />
                                    <span className="text-xs font-bold text-[#003262] uppercase tracking-wider">{item.source}</span>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed italic mb-4">
                                    "{item.quote}"
                                </p>
                                <span className="text-[#003262] text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Read Full Article <ExternalLink size={12} />
                                </span>
                            </a>
                        ))}
                    </div>

                    {/* Past Investor Panelists */}
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-[#2D2D2D] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Past Investor Panelists & Keynote Speakers
                        </h3>
                        <p className="text-slate-500 text-sm">Our cohorts have pitched to leading Silicon Valley investors</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {INVESTOR_PANELISTS.map((person, i) => {
                            const Tag = person.url ? 'a' : 'div';
                            const linkProps = person.url ? { href: person.url, target: '_blank', rel: 'noopener noreferrer' } : {};
                            return (
                                <Tag key={i} {...linkProps} className={`px-4 py-3 rounded-xl bg-white border border-slate-200 text-center hover:shadow-md transition-shadow ${person.url ? 'cursor-pointer hover:border-[#003262]/30' : ''}`}>
                                    <div className="font-bold text-[#2D2D2D] text-sm">{person.name}</div>
                                    <div className="text-xs text-slate-500">{person.firm}</div>
                                </Tag>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SPRING 2026 COHORT COMPANIES
                ═══════════════════════════════════════════════════════════ */}
            <section id="cohort" className="py-20 bg-white border-t border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#8B2332] mb-3">Spring 2026 Cohort</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-4"
                            style={{ fontFamily: "'Playfair Display', serif" }}>
                            Invest in the Next Generation
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto mb-6">
                            Click any company to express interest and learn more about their mission.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {COHORT_COMPANIES.map((company, i) => (
                            <div
                                key={i}
                                className={`group relative p-6 rounded-2xl border transition-all hover:shadow-xl cursor-pointer ${
                                    company.isMentorCompany
                                        ? 'bg-gradient-to-br from-[#8B2332]/5 to-[#C9B47C]/5 border-[#C9B47C]/30 ring-2 ring-[#C9B47C]/10'
                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                                onClick={() => handleCompanyClick(company)}
                                onMouseEnter={() => trackBASICSView(company.name)}
                            >
                                {/* Mentor badge */}
                                {company.isMentorCompany && (
                                    <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-[#C9B47C] text-[#001a3d] text-[9px] font-bold uppercase tracking-widest shadow-lg">
                                        <Award size={10} className="inline mr-1 -mt-0.5" />
                                        Mentor Company
                                    </div>
                                )}

                                {/* Company logo */}
                                {company.logo ? (
                                    <div className="w-14 h-14 rounded-xl overflow-hidden mb-4 shadow-lg bg-white border border-slate-100 flex items-center justify-center p-1">
                                        <img src={company.logo} alt={`${company.name} logo`} className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg text-white font-bold text-xl"
                                        style={{
                                            background: `linear-gradient(135deg, ${company.color}, ${company.color}dd)`,
                                            fontFamily: "'Playfair Display', serif",
                                        }}
                                    >
                                        {company.name.charAt(0)}
                                    </div>
                                )}

                                <h3 className="text-xl font-bold text-[#2D2D2D] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {company.name}
                                </h3>

                                {company.founder && (
                                    <p className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-1">
                                        <User size={10} />
                                        {company.founder}
                                    </p>
                                )}

                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    {company.description}
                                </p>

                                {company.mentorNote && (
                                    <p className="text-xs text-[#8B2332] font-medium bg-[#8B2332]/5 px-3 py-2 rounded-lg mb-4 leading-relaxed">
                                        {company.mentorNote}
                                    </p>
                                )}

                                <div className="flex items-center gap-2 text-sm font-bold text-[#003262] group-hover:translate-x-1 transition-transform">
                                    <Sparkles size={14} className="text-[#C9B47C]" />
                                    Support this Berkeley Company
                                    <ArrowRight size={12} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                DEMO DAY PHOTO GALLERY
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#FAF8F5] border-t border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#003262]/5 border border-[#003262]/10 mb-4">
                            <Camera size={12} className="text-[#003262]" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#003262]">May 1, 2026</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-3"
                            style={{ fontFamily: "'Playfair Display', serif" }}>
                            Spring 2026 Pitch Day
                        </h2>
                        <p className="text-slate-500 max-w-lg mx-auto text-sm">
                            Highlights from our Spring 2026 cohort Demo Day at UC Berkeley.
                        </p>
                    </div>

                    {/* Pitching Shots */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[
                            { src: 'pitch-mina-newnav.jpg', label: 'Mina Sonmez — NewNav' },
                            { src: 'pitch-ellen-lumina.jpg', label: 'Ellen Zhang — Lumina' },
                            { src: 'pitch-claudius-thesedays.jpg', label: 'Claudius Ma — TheseDays' },
                            { src: 'pitch-jessica-breeze.jpg', label: 'Jessica Miller — Breeze' },
                            { src: 'pitch-naomi-cogcal.jpg', label: 'Naomi Toubian — Cognitive Calendar' },
                            { src: 'pitch-evardi.jpg', label: 'Evardi Energy Team' },
                            { src: 'pitch-yasmine-heirloom.jpg', label: 'Yasmine Baker — Heirloom' },
                            { src: 'pitch-mike-qluu.jpg', label: 'Mike Jacobs — Qluu' },
                        ].map((photo, i) => (
                            <div key={i} className="break-inside-avoid rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group relative">
                                <img
                                    src={`/images/basics-spring-2026/${photo.src}`}
                                    alt={photo.label}
                                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                                    <p className="text-white text-[10px] font-bold tracking-wide">{photo.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Group Shots */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { src: 'group-cohort-1.jpg', label: 'Spring 2026 Cohort' },
                            { src: 'group-cohort-2.jpg', label: 'Demo Day at Berkeley' },
                            { src: 'group-stage.jpg', label: 'On Stage' },
                        ].map((photo, i) => (
                            <div key={i} className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group relative">
                                <img
                                    src={`/images/basics-spring-2026/${photo.src}`}
                                    alt={photo.label}
                                    className="w-full aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                                    <p className="text-white text-[10px] font-bold tracking-wide">{photo.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SUPPORT BERKELEY COMPANIES
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-16 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Sparkles size={32} className="mx-auto text-[#C9B47C] mb-4" />
                    <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}>
                        Support Berkeley Companies
                    </h2>
                    <p className="text-slate-600 max-w-xl mx-auto mb-6 leading-relaxed">
                        Each BASICS company is building something remarkable.
                        Click any company above to express interest and connect with the founding team.
                    </p>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Investment opportunities are available to accredited investors. Contact us for details.
                    </p>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                BOTTOM CTA
                ═══════════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#003262] to-[#001a3d]" />
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundSize: '40px 40px',
                        backgroundImage: 'linear-gradient(to right, rgba(201,180,124,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,180,124,0.4) 1px, transparent 1px)',
                    }}
                />

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6"
                        style={{ fontFamily: "'Playfair Display', serif" }}>
                        Spring 2026 <span className="text-[#C9B47C]">Demo Day</span>
                    </h2>
                    <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
                        Berkeley's brightest student founders pitched live. Support these companies and invest early.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                        <a
                            href="#cohort"
                            className="w-full sm:w-auto bg-[#C9B47C] hover:bg-[#b8a56d] text-[#001a3d] px-10 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all shadow-xl shadow-[#C9B47C]/20 hover:shadow-[#C9B47C]/40 hover:scale-105 flex items-center justify-center gap-2"
                        >
                            View Companies
                            <ArrowRight size={16} />
                        </a>
                        <a
                            href="mailto:basics@universityschool.ai"
                            className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white border border-white/20 px-10 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                        >
                            Investor Inquiries
                            <ArrowRight size={16} />
                        </a>
                    </div>

                    <p className="text-white/30 text-xs">
                        BASICS @ Berkeley is a program of UC Berkeley's Cognitive Science Department.
                        <br />© 2026 University School AI Inc. All rights reserved.
                    </p>
                </div>
            </section>
        </div>
    );
};
