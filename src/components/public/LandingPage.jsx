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
    BookOpen,
    Award,
    Settings,
} from 'lucide-react';
import { FAQSection } from './FAQSection';
import { StudentSuccessStories } from './StudentSuccessStories';
import { CLEPSection } from './CLEPSection';

const HERO_SCHOOL_CARDS = [
    {
        name: 'Biomedics',
        tagline: 'Improve and extend human life.',
        image: '/images/visuals/hero_card_biomedics.jpg',
        icon: HeartPulse,
    },
    {
        name: 'Engineering',
        tagline: "Build what's next.",
        image: '/images/visuals/hero_card_engineering.jpg',
        icon: Settings,
    },
    {
        name: 'Business',
        tagline: 'Create value. Make an impact.',
        image: '/images/visuals/hero_card_business.jpg',
        icon: Briefcase,
    },
    {
        name: 'Law & Public Service',
        tagline: 'Lead. Serve. Make a difference.',
        image: '/images/visuals/hero_card_law.jpg',
        icon: Scale,
    },
];

const KITTY_HAWK_SCENES = [
    {
        step: '1. Learn',
        eyebrow: 'Engineering · Kitty Hawk, 1903',
        title: "You're not watching history.",
        highlight: "You're living it.",
        desc: 'Work alongside Orville and Wilbur Wright. Explore real aerodynamic problems, test airfoil ribs on the workbench, and see what happens.',
        image: '/images/visuals/kitty_hawk_1_live.jpg',
        cta: 'Continue the Experience',
        badge: 'Same knowledge. A different story.',
    },
    {
        step: '2. Experience',
        eyebrow: 'Active Agency · Decision Node',
        title: 'Your turn.',
        highlight: 'Make a decision.',
        desc: 'Real knowledge means making choices. Change the wing camber for greater lift, shift the pilot weight distribution, or test a lighter fabric.',
        image: '/images/visuals/kitty_hawk_2_decision.jpg',
        cta: 'See What Happens',
        badge: 'Real problems. Real decisions.',
    },
    {
        step: '3. Consequence',
        eyebrow: 'First Flight · Field Test',
        title: 'Your decision.',
        highlight: 'A real consequence.',
        desc: 'See the results of your choices in a real-world experience over the Kitty Hawk dunes. Productive failure and triumph bring physics to life.',
        image: '/images/visuals/kitty_hawk_3_flight.jpg',
        cta: 'Continue the Journey',
        badge: 'Ideas take flight when you make them real.',
    },
    {
        step: '4. Iterate',
        eyebrow: 'Iteration 2 · Engineering Notebook',
        title: 'We learn.',
        highlight: 'We try again.',
        desc: 'Real learning happens through iteration. Each attempt brings new insights into aerodynamics, materials, and flight mechanics.',
        image: '/images/visuals/kitty_hawk_4_iterate.jpg',
        cta: 'Iterate and Improve',
        badge: 'Try. Learn. Improve. Again.',
    },
    {
        step: '5. Analyze',
        eyebrow: 'From Experience to Formal Physics',
        title: 'Experience first.',
        highlight: 'Concept second.',
        desc: 'Only after you fly the Wright Flyer do you connect your lived intuition to formal university physics: Bernoulli pressure differentials, lift vectors, and net force.',
        image: '/images/visuals/airfoil_lift_diagram.jpg',
        cta: 'Continue to Assessment',
        badge: 'What you lived becomes knowledge you can use anywhere.',
    },
];

const KNOWLEDGE_SCHOOL_PORTRAITS = [
    {
        name: 'Biomedics',
        tagline: 'From discoveries to real impact.',
        mentor: 'Marie Curie · Cellular & Molecular Pioneers',
        image: '/images/visuals/school_portrait_biomedics.jpg',
        icon: HeartPulse,
    },
    {
        name: 'Engineering',
        tagline: 'From ideas to what moves the world.',
        mentor: 'Orville & Wilbur Wright · Tesla · Einstein',
        image: '/images/visuals/school_portrait_engineering.jpg',
        icon: Settings,
    },
    {
        name: 'Business',
        tagline: 'From vision to real opportunities.',
        mentor: 'Henry Ford · Industrial & Modern Builders',
        image: '/images/visuals/school_portrait_business.jpg',
        icon: Briefcase,
    },
    {
        name: 'Law & Public Service',
        tagline: 'From people to a better tomorrow.',
        mentor: 'Abraham Lincoln · Constitutional Leaders',
        image: '/images/visuals/school_portrait_law.jpg',
        icon: Scale,
    },
];

const LEARNING_CHANNELS = [
    {
        title: 'Centers',
        desc: 'Immersive, in-person experiences with real projects and real people.',
        image: '/images/visuals/channel_centers.jpg',
        icon: Users,
    },
    {
        title: 'Tablet',
        desc: 'Learn on the go. Interactive, engaging and personalized.',
        image: '/images/visuals/channel_tablet.jpg',
        icon: Tablet,
    },
    {
        title: 'Computer',
        desc: 'Deep learning. Real knowledge. Built for your future.',
        image: '/images/visuals/channel_computer.jpg',
        icon: Laptop,
    },
    {
        title: 'TV App',
        desc: 'Explore. Watch. Be inspired. Real stories, real people.',
        image: '/images/visuals/channel_tv.jpg',
        icon: Tv,
    },
];

export const LandingPage = ({ onNavigate }) => {
    const [activeScene, setActiveScene] = useState(0);
    const [selectedConcept, setSelectedConcept] = useState(0);

    const scrollToHowItWorks = () => {
        const el = document.getElementById('how-it-works');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col pb-20">
            {/* ═══════════════════════════════════════════════════════════
                1. FULL-BLEED CINEMATIC HERO (Website 1.jpg & 2_university_school_home.png)
                ═══════════════════════════════════════════════════════════ */}
            <section className="relative bg-[#1F070B] text-white overflow-hidden border-b border-[#C9B47C]/25">
                {/* Main Hero Artwork Backdrop */}
                <div className="relative min-h-[640px] lg:min-h-[700px] flex flex-col justify-between">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/visuals/hero_mentors_scene.jpg"
                            alt="University School student working with Orville & Wilbur Wright, Albert Einstein, Nikola Tesla, and Henry Ford"
                            className="w-full h-full object-cover object-right-top opacity-95"
                        />
                        {/* Smooth Left & Bottom Vignettes so native typography & cards read crisply */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#22070B] via-[#22070B]/85 sm:via-[#22070B]/55 lg:via-transparent to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#190508] via-[#190508]/85 to-transparent" />
                    </div>

                    {/* Hero Copy (Left Column) */}
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 w-full">
                        <div className="max-w-xl">
                            <div className="text-xs sm:text-sm font-medium uppercase tracking-[0.22em] text-[#E6C687]/90 leading-relaxed mb-3">
                                REAL PEOPLE.<br />
                                REAL CHALLENGES.<br />
                                REAL YOU.
                                <span className="block w-10 h-0.5 bg-[#E6C687] mt-2.5" />
                            </div>

                            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.98] mb-5 drop-shadow-lg">
                                <span className="block text-white">DON&apos;T JUST</span>
                                <span className="block text-white">LEARN IT.</span>
                                <span className="block text-[#E6C687]">LIVE IT.</span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-100/95 leading-relaxed mb-3 max-w-md drop-shadow">
                                Step into real moments, work with great minds, and make real decisions.
                                Master knowledge that shapes your future.
                            </p>
                            <p className="text-sm font-serif italic text-[#E6C687] mb-7">
                                Starts at 11. Goes as far as you do.
                            </p>

                            <div className="flex flex-wrap items-center gap-4">
                                <button
                                    onClick={() => onNavigate('students')}
                                    className="group bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] hover:from-[#F7E0AD] hover:to-[#D4AF6A] text-[#23090D] px-8 py-4 rounded-2xl font-bold text-base sm:text-lg shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-all flex items-center gap-3"
                                >
                                    Start at 11
                                    <ArrowRight size={19} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={scrollToHowItWorks}
                                    className="group bg-black/45 hover:bg-black/65 backdrop-blur-md border border-[#E6C687]/40 text-white px-6 py-4 rounded-2xl font-semibold text-sm sm:text-base transition-all flex items-center gap-2.5"
                                >
                                    <Play size={16} className="text-[#E6C687] fill-[#E6C687]" />
                                    Watch How It Works
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 4 Docked Knowledge School Visual Cards (Bottom of Hero) */}
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {HERO_SCHOOL_CARDS.map((card, i) => (
                                <button
                                    key={i}
                                    onClick={() => onNavigate('students')}
                                    className="group relative rounded-2xl overflow-hidden border border-[#E6C687]/30 hover:border-[#E6C687] bg-[#140709]/90 text-left shadow-xl transition-all hover:-translate-y-1"
                                >
                                    <div className="h-24 w-full overflow-hidden relative">
                                        <img
                                            src={card.image}
                                            alt={card.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#140709] via-[#140709]/35 to-transparent" />
                                    </div>
                                    <div className="px-4 pb-3.5 pt-1 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-[#E6C687]/15 border border-[#E6C687]/40 flex items-center justify-center text-[#E6C687] shrink-0">
                                                <card.icon size={18} />
                                            </div>
                                            <div>
                                                <div className="font-serif font-bold text-white text-base leading-tight">
                                                    {card.name}
                                                </div>
                                                <div className="text-[11px] text-slate-300 leading-snug mt-0.5">
                                                    {card.tagline}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-7 h-7 rounded-full border border-white/30 group-hover:border-[#E6C687] flex items-center justify-center text-white group-hover:text-[#E6C687] shrink-0 transition-colors">
                                            <ArrowRight size={13} />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Bottom Hero Strip */}
                        <div className="mt-5 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-300/80">
                            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                                <span>AI-Powered Mentor</span>
                                <span className="text-[#E6C687]/40">|</span>
                                <span>Historical Experiences</span>
                                <span className="text-[#E6C687]/40">|</span>
                                <span>Real-World Skills</span>
                                <span className="text-[#E6C687]/40">|</span>
                                <span>Future-Ready You</span>
                            </div>
                            <div className="text-[#E6C687] font-semibold">
                                Knowledge Lives Here.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                2. GOLDEN LEVEL-UP PATH — Stats Band (Website 1.jpg)
                ═══════════════════════════════════════════════════════════ */}
            <section className="relative py-14 bg-white border-b border-[#C9B47C]/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#C9B47C]/5 via-transparent to-[#C9B47C]/5" />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#C9B47C]/20 via-[#C9B47C]/40 to-[#C9B47C]/20 -translate-y-1/2" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 relative">
                        {[
                            { label: 'Partner Universities', value: '60+', icon: GraduationCap },
                            { label: 'Credits Transferable', value: '100%', icon: Target },
                            { label: 'Start Age', value: '11+', icon: Star },
                            { label: 'Tuition Saved', value: '$80k+', icon: Sparkles },
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
                3. THE PROBLEM HOOK & STORY FLOW (Landing Page 1.jpg)
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#FAF8F5] border-b border-[#8B2332]/10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Clean Cropped Diptych Photo (Passive Video Lecture vs. Wikipedia Page) */}
                    <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 mb-12 bg-[#141414]">
                        <img
                            src="/images/visuals/passive_learning_diptych.jpg"
                            alt="Traditional passive online learning: watching long lectures and reading dense pages alone"
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* Centered Editorial Narrative Copy (Exact Layout from Landing Page 1.jpg) */}
                    <div className="text-center max-w-2xl mx-auto space-y-5">
                        <p className="font-serif text-xl sm:text-2xl text-slate-700 leading-relaxed">
                            Hours of video. Pages of reading.<br />
                            Tests that don&apos;t stick.
                        </p>
                        <p className="font-serif text-xl sm:text-2xl text-slate-600 italic">
                            He is not learning. He is waiting.
                        </p>
                        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2D2D] pt-2 leading-tight">
                            Build something real.<br />
                            Start college early.
                        </h2>
                        <div className="pt-4">
                            <button
                                onClick={scrollToHowItWorks}
                                className="bg-[#6E1723] hover:bg-[#8B2332] text-[#F5EBDC] px-9 py-4 rounded-xl font-serif font-bold text-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3"
                            >
                                Watch how it works.
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                4. INTERACTIVE KITTY HAWK 1903 WALKTHROUGH (Slides 4–8)
                ═══════════════════════════════════════════════════════════ */}
            <section id="how-it-works" className="py-20 bg-[#140B0E] text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header & Step Tabs */}
                    <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6C687] block mb-2">
                                How University School Works · First-Person Experience
                            </span>
                            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
                                Experience First. <span className="text-[#E6C687]">Concept Second.</span>
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {KITTY_HAWK_SCENES.map((s, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveScene(idx)}
                                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                                        activeScene === idx
                                            ? 'bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] text-[#23090D] shadow-lg'
                                            : 'bg-white/10 text-slate-300 hover:bg-white/20'
                                    }`}
                                >
                                    {activeScene > idx && <CheckCircle2 size={14} className="text-[#E6C687]" />}
                                    {s.step}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Scene Viewer */}
                    <div className="grid lg:grid-cols-12 gap-8 items-stretch bg-[#1E1115] border border-[#E6C687]/25 rounded-3xl overflow-hidden shadow-2xl">
                        {/* Left Column: Narrative + Controls */}
                        <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6C687] mb-2">
                                    {KITTY_HAWK_SCENES[activeScene].eyebrow}
                                    <span className="block w-8 h-0.5 bg-[#E6C687] mt-2" />
                                </div>

                                <h3 className="font-serif text-3xl sm:text-4xl font-bold leading-tight mt-5 mb-4">
                                    <span className="block text-white">{KITTY_HAWK_SCENES[activeScene].title}</span>
                                    <span className="block text-[#E6C687]">{KITTY_HAWK_SCENES[activeScene].highlight}</span>
                                </h3>

                                <p className="text-slate-200 text-base leading-relaxed mb-6">
                                    {KITTY_HAWK_SCENES[activeScene].desc}
                                </p>

                                {/* Scene-Specific Interactive Element on Step 5 (Concept Second) */}
                                {activeScene === 4 && (
                                    <div className="space-y-2 mb-6">
                                        {[
                                            { name: 'Aerodynamics', sub: 'How curved airfoil pressure differentials create lift.' },
                                            { name: 'Forces and Motion', sub: 'Balancing thrust, drag, lift, and weight vectors.' },
                                            { name: 'Iterative Design', sub: 'Test. Learn. Improve. Turning failure into data.' },
                                        ].map((c, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedConcept(i)}
                                                className={`w-full text-left p-3 rounded-xl border transition-all ${
                                                    selectedConcept === i
                                                        ? 'bg-[#2B171D] border-[#E6C687] text-white'
                                                        : 'bg-black/25 border-white/10 text-slate-300 hover:bg-black/40'
                                                }`}
                                            >
                                                <div className="text-xs font-bold text-[#E6C687]">{c.name}</div>
                                                <div className="text-xs text-slate-300 mt-0.5">{c.sub}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 text-xs italic text-[#E6C687]">
                                    &ldquo;{KITTY_HAWK_SCENES[activeScene].badge}&rdquo;
                                </div>
                            </div>

                            <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                                <button
                                    onClick={() => setActiveScene((prev) => (prev + 1) % KITTY_HAWK_SCENES.length)}
                                    className="bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] hover:from-[#F7E0AD] hover:to-[#D4AF6A] text-[#23090D] px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md flex items-center gap-2 transition-all"
                                >
                                    {KITTY_HAWK_SCENES[activeScene].cta}
                                    <ArrowRight size={16} />
                                </button>
                                <span className="text-xs text-slate-400 font-semibold">
                                    Scene {activeScene + 1} of {KITTY_HAWK_SCENES.length}
                                </span>
                            </div>
                        </div>

                        {/* Right Column: Clean Cropped Visual Scene */}
                        <div className="lg:col-span-7 relative min-h-[360px] bg-black flex items-center justify-center overflow-hidden">
                            <img
                                src={KITTY_HAWK_SCENES[activeScene].image}
                                alt={KITTY_HAWK_SCENES[activeScene].title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                5. "NOW YOU SEE WHAT HE BUILT" + NATIVE 68% PROGRESS CARD
                   (Landing Page 2.jpg Top + Slide 9)
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#FAF8F5] border-b border-[#8B2332]/10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Editorial Lead-In from Landing Page 2.jpg */}
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <p className="font-serif text-xl sm:text-2xl text-slate-600 mb-2">
                            Everyday someone is chasing him.
                        </p>
                        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2D2D]">
                            Now you see what he built.
                        </h2>
                    </div>

                    {/* Faithful Native Recreation of Slide 9 / Landing Page 2 Progress Card */}
                    <div className="grid lg:grid-cols-12 gap-8 items-center bg-[#161416] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#C9B47C]/30">
                        {/* Left 7 Cols: The University School Engineering Progress Card */}
                        <div className="lg:col-span-7 bg-[#1F1C1E] border border-white/15 rounded-2xl p-6 shadow-xl">
                            {/* Card Header */}
                            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/images/unischool-logo.png"
                                        alt="University School"
                                        className="w-9 h-9 rounded-lg"
                                    />
                                    <span className="font-serif text-xl font-bold text-white">University School</span>
                                </div>
                                <div className="text-right">
                                    <div className="font-serif text-lg font-bold text-white leading-none">Engineering</div>
                                    <div className="text-xs text-slate-400 mt-1">Learning Progress</div>
                                </div>
                            </div>

                            {/* Inner Cream Box: 68% Circular Gauge + 5 Checked Rows */}
                            <div className="bg-[#EFE9DF] text-[#222222] rounded-2xl p-5 sm:p-6 mb-6">
                                <div className="grid sm:grid-cols-12 gap-6 items-center">
                                    {/* 68% Donut Ring */}
                                    <div className="sm:col-span-5 flex flex-col items-center justify-center">
                                        <div className="relative w-36 h-36 flex items-center justify-center">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                                <circle
                                                    cx="60"
                                                    cy="60"
                                                    r="48"
                                                    fill="none"
                                                    stroke="#D8CDBB"
                                                    strokeWidth="10"
                                                />
                                                <circle
                                                    cx="60"
                                                    cy="60"
                                                    r="48"
                                                    fill="none"
                                                    stroke="#0F2537"
                                                    strokeWidth="10"
                                                    strokeDasharray="301.6"
                                                    strokeDashoffset={301.6 * (1 - 0.68)}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                                <span className="text-3xl font-bold text-[#141414]">68%</span>
                                                <span className="text-[11px] font-medium text-slate-600">Overall Progress</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 5 Checklist Rows */}
                                    <div className="sm:col-span-7 space-y-2.5 text-sm">
                                        {[
                                            { label: 'Concepts Mastered', val: '8 / 12', done: true },
                                            { label: 'Experiences Completed', val: '3 / 5', done: true },
                                            { label: 'Practice Activities', val: '6 / 8', done: true },
                                            { label: 'Skills Being Built', val: '5 / 8', done: true },
                                            { label: 'Ready for Assessment', val: '✓', done: true },
                                        ].map((row, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between pb-2 border-b border-black/10 last:border-b-0 last:pb-0"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <span className="w-5 h-5 rounded bg-[#1B1B1B] text-[#E6C687] flex items-center justify-center text-xs font-bold">
                                                        ✓
                                                    </span>
                                                    <span className="font-medium text-[#222222]">{row.label}</span>
                                                </div>
                                                <span className="font-bold text-[#141414]">{row.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Experiences Row (Clean Cropped Thumbnails) */}
                            <div>
                                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-3">
                                    <span>Recent Experiences</span>
                                    <span className="text-[#E6C687]">View All &rarr;</span>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { title: 'First Flight', sub: 'Design. Test. Improve.', img: '/images/visuals/exp_first_flight.jpg' },
                                        { title: 'Wing Design', sub: 'Iterate and Learn.', img: '/images/visuals/exp_wing_design.jpg' },
                                        { title: 'Airflow Simulation', sub: 'See the impact.', img: '/images/visuals/exp_airflow_sim.jpg' },
                                    ].map((exp, i) => (
                                        <div key={i} className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                                            <img src={exp.img} alt={exp.title} className="w-full h-20 object-cover" />
                                            <div className="p-2.5 flex items-center justify-between gap-1">
                                                <div>
                                                    <div className="text-xs font-bold text-white leading-tight">{exp.title}</div>
                                                    <div className="text-[10px] text-slate-400">{exp.sub}</div>
                                                </div>
                                                <span className="w-4 h-4 rounded-full bg-[#E6C687] text-[#141414] text-[10px] font-bold flex items-center justify-center shrink-0">
                                                    ✓
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right 5 Cols: Focused Student Photo + Caption */}
                        <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
                            <div className="rounded-2xl overflow-hidden border border-white/15 shadow-lg">
                                <img
                                    src="/images/visuals/student_focused_laptop.jpg"
                                    alt="Focused University School student building real engineering mastery"
                                    className="w-full h-72 sm:h-80 object-cover object-top"
                                />
                            </div>
                            <div>
                                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                                    Your actions <span className="text-[#E6C687]">create progress.</span>
                                </h3>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    Complete experiences. Build real skills. Every choice turns curiosity into measurable university capability.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                6. "FIND YOUR PEOPLE BY PASSION" — COLLABORATIVE HUBS & 4 CHANNELS
                   (Landing Page 2.jpg Bottom + Slide 12)
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-white border-b border-[#8B2332]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Editorial Lead-In from Landing Page 2.jpg */}
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <p className="font-serif text-xl sm:text-2xl text-slate-600 mb-2">
                            You are learning alone.
                        </p>
                        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2D2D]">
                            Find your people by passion.
                        </h2>
                    </div>

                    {/* Clean Collaborative Table Photo from Landing Page 2.jpg */}
                    <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-slate-200 mb-14">
                        <img
                            src="/images/storyboard/center_collaborative.jpg"
                            alt="Students collaborating around a table at a University School Center"
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* 4 Photographic Learning Channels (Slide 12: Centers, Tablet, Computer, TV App) */}
                    <div className="text-center mb-10">
                        <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#2D2D2D]">
                            Learn anywhere. <span className="text-[#8B2332]">Belong somewhere.</span>
                        </h3>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mt-2">
                            Real University Learning · Starting at 11
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {LEARNING_CHANNELS.map((ch, i) => (
                            <div
                                key={i}
                                className="bg-[#1B0E11] text-white rounded-3xl overflow-hidden border border-[#C9B47C]/30 shadow-xl flex flex-col justify-between group"
                            >
                                <div className="h-56 overflow-hidden relative">
                                    <img
                                        src={ch.image}
                                        alt={ch.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1B0E11] via-transparent to-transparent" />
                                </div>
                                <div className="p-6 text-center flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="inline-flex items-center justify-center gap-2 text-[#E6C687] mb-2">
                                            <ch.icon size={22} />
                                            <h4 className="font-serif text-2xl font-bold text-white">{ch.title}</h4>
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                            {ch.desc}
                                        </p>
                                    </div>
                                    <div className="pt-3 border-t border-[#E6C687]/20 text-[10px] font-bold uppercase tracking-[0.18em] text-[#E6C687]">
                                        Same Knowledge · A Bigger Future
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                7. "HE IS NOT BEHIND. HE IS AHEAD." — 5-STEP UNIVERSITY OUTCOMES
                   (Landing Page 3.jpg + Slide 10)
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#FAF8F5] border-b border-[#8B2332]/10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Editorial Lead-In from Landing Page 3.jpg */}
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <p className="font-serif text-xl sm:text-2xl text-slate-600 mb-2">
                            He is not behind.
                        </p>
                        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2D2D]">
                            He is ahead.
                        </h2>
                    </div>

                    {/* Faithful Native Recreation of Slide 10 / Landing Page 3 Outcomes Card */}
                    <div className="bg-gradient-to-br from-[#2B0A10] to-[#1A0508] rounded-3xl p-6 sm:p-10 border border-[#C9B47C]/40 shadow-2xl mb-14">
                        <div className="grid md:grid-cols-12 gap-8 items-center">
                            {/* Left 4 Cols: Clean Student Campus Lookup Photo */}
                            <div className="md:col-span-4 rounded-2xl overflow-hidden border border-[#E6C687]/30 shadow-lg">
                                <img
                                    src="/images/visuals/student_campus_lookup.jpg"
                                    alt="Young student arriving on a university campus"
                                    className="w-full h-full max-h-[460px] object-cover object-top"
                                />
                            </div>

                            {/* Right 8 Cols: REAL UNIVERSITY OUTCOMES Cream Card */}
                            <div className="md:col-span-8">
                                <div className="text-center mb-4">
                                    <h3 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-[0.14em] text-[#E6C687]">
                                        Real University Outcomes
                                    </h3>
                                </div>

                                <div className="bg-[#F5EBDC] text-[#2B0A10] rounded-2xl p-5 sm:p-7 shadow-inner space-y-3.5">
                                    {[
                                        { icon: Users, text: 'AGE 11+' },
                                        { icon: Building2, text: 'REAL UNIVERSITY COURSE' },
                                        { icon: BookOpen, text: 'LIVE THE KNOWLEDGE THROUGH UNIVERSITY SCHOOL' },
                                        { icon: CheckCircle2, text: 'COMPLETE UNIVERSITY REQUIREMENTS' },
                                        { icon: Award, text: 'UNIVERSITY-ISSUED CREDIT / CERTIFICATES / CREDENTIALS' },
                                    ].map((row, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-4 pb-3 border-b border-[#2B0A10]/12 last:border-b-0 last:pb-0"
                                        >
                                            <div className="w-11 h-11 rounded-full bg-[#3A0C14] text-[#E6C687] flex items-center justify-center shrink-0 shadow">
                                                <row.icon size={20} />
                                            </div>
                                            <div className="font-serif font-bold text-sm sm:text-base tracking-wide text-[#2B0A10]">
                                                {row.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-center mt-5">
                                    <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
                                        Real university learning. <span className="text-[#E6C687]">Starting at 11.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Closing CTA from Landing Page 3.jpg */}
                    <div className="text-center space-y-5">
                        <h3 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2D2D]">
                            Don&apos;t just learn it. Live it.
                        </h3>
                        <div>
                            <button
                                onClick={() => onNavigate('students')}
                                className="bg-[#6E1723] hover:bg-[#8B2332] text-[#F5EBDC] px-12 py-4 rounded-xl font-serif font-bold text-xl shadow-lg hover:shadow-xl transition-all"
                            >
                                Enroll now
                            </button>
                        </div>
                        <p className="font-serif text-base sm:text-lg font-bold text-[#2D2D2D]">
                            Founding members - limited spots.
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                8. MEET YOUR AI NARRATOR & EXPLORE YOUR FUTURE
                   (Website 1.jpg, Website 1.1.jpg, Slide 13 & Slide 11)
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-[#19090D] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#E6C687] block mb-3">
                            Choose Your Knowledge School
                        </span>
                        <h2 className="font-serif text-4xl sm:text-6xl font-bold text-white mb-5">
                            Meet Your AI Narrator. <span className="text-[#E6C687]">Explore your future.</span>
                        </h2>
                        <p className="text-slate-300 max-w-3xl mx-auto text-lg leading-relaxed">
                            Your AI Narrator guides you through the story &mdash; Marie Curie, the Wright Brothers, Henry Ford, or Abraham Lincoln.
                            You play in first person making the decisions and learn by getting it wrong.
                        </p>
                    </div>

                    {/* 4 Tall Portrait Knowledge School Cards (from Slide 13) */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {KNOWLEDGE_SCHOOL_PORTRAITS.map((school, i) => (
                            <div
                                key={i}
                                onClick={() => onNavigate('students')}
                                className="group cursor-pointer bg-[#140709] rounded-3xl overflow-hidden border border-[#E6C687]/35 hover:border-[#E6C687] shadow-2xl flex flex-col justify-between transition-all hover:-translate-y-1.5"
                            >
                                <div className="h-72 overflow-hidden relative">
                                    <img
                                        src={school.image}
                                        alt={school.name}
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#140709] via-[#140709]/25 to-transparent" />
                                </div>

                                <div className="px-6 pb-6 pt-2 text-center flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-[#E6C687]/15 border border-[#E6C687]/40 text-[#E6C687] flex items-center justify-center mx-auto -mt-8 relative z-10 mb-3 shadow-lg">
                                            <school.icon size={22} />
                                        </div>
                                        <h3 className="font-serif text-2xl font-bold text-white mb-1.5">
                                            {school.name}
                                        </h3>
                                        <p className="text-sm text-slate-200 mb-2">
                                            {school.tagline}
                                        </p>
                                        <p className="text-xs text-[#E6C687] italic mb-4">
                                            {school.mentor}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-[#E6C687]/25 text-[10px] font-bold uppercase tracking-[0.14em] text-[#E6C687]/90 leading-relaxed">
                                        University-Level Courses.<br />
                                        Transferable Credit Where Eligible.
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Starts at 11. A Bigger Future, Sooner (Slide 11 Visual Progression) */}
                    <div className="bg-[#240B10] rounded-3xl border border-[#E6C687]/30 p-8 sm:p-10 shadow-2xl">
                        <div className="text-center mb-8">
                            <h3 className="font-serif text-4xl sm:text-5xl font-bold text-white">
                                Starts at <span className="text-[#E6C687]">11.</span>
                            </h3>
                            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-slate-300 mt-2">
                                A Bigger Future, Sooner.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[
                                { title: 'BUILD EARLY', desc: 'Develop real knowledge and skills years earlier.' },
                                { title: 'EXPLORE MORE', desc: 'Discover your interests across different fields before college.' },
                                { title: 'GET AHEAD', desc: 'Make real academic progress and build confidence.' },
                                { title: 'BELONG SOONER', desc: 'Join a community of curious learners on the same journey.' },
                            ].map((item, i) => (
                                <div key={i} className="bg-black/25 border border-[#E6C687]/20 rounded-2xl p-5 text-center">
                                    <div className="text-sm font-bold uppercase tracking-wider text-[#E6C687] mb-2">
                                        {item.title}
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-2xl overflow-hidden border border-[#E6C687]/25">
                            <img
                                src="/images/visuals/timeline_progression_strip.jpg"
                                alt="Age 11 to College Progression"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                9. PHILOSOPHY — The Narrator is Not a Professor. (Website 1.2)
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
                                    'Real-time XP tracking for academic progress',
                                    'College graduates oversee every subject',
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
                10. ASU DEMO CALLOUT — "Experience the Transformation"
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
                11. CLEP PREPARATION, SUCCESS STORIES & FAQ
                ═══════════════════════════════════════════════════════════ */}
            <CLEPSection onNavigate={onNavigate} />
            <StudentSuccessStories />
            <FAQSection />
        </div>
    );
};
