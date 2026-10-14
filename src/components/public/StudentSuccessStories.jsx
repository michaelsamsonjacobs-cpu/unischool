import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Sparkles, CheckCircle2, GraduationCap, Compass } from 'lucide-react';

const EARLY_COLLEGE_PRECEDENTS = [
    {
        name: "Clovis Hung",
        age: "Started at 9 · Graduated at 12",
        achievement: "Earned 5 Accredited Associate Degrees by Age 12 (Fullerton College)",
        detail: "Seeking greater academic challenge than he found in a conventional middle-school classroom, Clovis enrolled in open-access college courses and earned five associate degrees across history, social sciences, mathematics, and arts by age 12.",
        howWeHelp: "Clovis had to navigate traditional adult college lectures on his own. University School gives 11-to-14-year-olds a purpose-built bridge—turning those same accredited college syllabi into interactive Wright Brothers & Marie Curie simulations with 4-person peer squads.",
        link: "https://news.fullcoll.edu/at-12-clovis-hung-breaks-record-for-youngest-fullerton-college-graduate/",
        pathway: "Early-College Associate & Bachelor's Track",
    },
    {
        name: "Ethan River Luescher",
        age: "Started College at 12 · Degree at 15",
        achievement: "Earned College Degree & Cybersecurity Certifications at Age 15",
        detail: "Ethan began taking accredited college courses at age 12 while still in middle school, graduating with an Associate of Applied Science degree and professional cybersecurity certifications by 15 while staying active in music, scouting, and athletics.",
        howWeHelp: "With University School's gamified XP quests and Socratic Exam Companion, middle-schoolers don't have to sacrifice childhood to earn college credit—they master university STEM courses in 60–90 minute interactive sessions across computer, tablet, and local Centers.",
        link: "https://www.nbcdfw.com/news/local/15-year-old-earns-college-degree/4024315/",
        pathway: "Engineering & Technology Credit Track",
    },
    {
        name: "James 'Jimmy' Chilimigras",
        age: "High School by 12 · Bachelor's & Master's at 15",
        achievement: "Completed Bachelor's & Master's in Accounting at 15; Law Degree with Honors",
        detail: "By age 12, Jimmy completed high school requirements, earned both a bachelor's and master's degree at 15, became the youngest CPA on record, and graduated with highest honors from Loyola University College of Law.",
        howWeHelp: "University School's Schools of Business and Law & Public Service let students starting at age 11 step directly into Henry Ford's industrial venture lab and Abraham Lincoln's constitutional moot court to stack real university credits years ahead of schedule.",
        link: "https://law.loyno.edu/news/may-04-2026_after-starting-his-jd-fifteen-eighteen-year-old-loyola-law-student-graduates-may",
        pathway: "Business, Finance & Constitutional Law Track",
    },
    {
        name: "Zainab Al-Mansoori",
        age: "Graduated at 17",
        achievement: "Earned Three Accredited Engineering Degrees by Age 17 (University of Kentucky)",
        detail: "While most teenagers were still finishing high school worksheets, Zainab mastered university calculus, physics, and engineering systems—graduating from the University of Kentucky with three engineering degrees at age 17.",
        howWeHelp: "Our Experience-First engineering labs let young learners test aerodynamic lift, forces, and energy conservation inside a 60fps wind tunnel before tackling formal university equations—making college engineering intuitive at age 11+.",
        link: "https://www.egyptindependent.com/how-a-young-egyptian-student-earned-3-american-engineering-degrees/",
        pathway: "School of Engineering & Aerospace Track",
    },
    {
        name: "Ava Hauck",
        age: "Teen Researcher",
        achievement: "Patented an AI Blood-Disease Diagnostic System & Earned University Research Grant",
        detail: "Before finishing high school, Ava built and patented a portable AI diagnostic system capable of identifying malaria, leukemia, and anemia from medical imagery in seconds, earning a $50,000 research grant at the University of North Dakota.",
        howWeHelp: "In our School of Biomedics, students don't just memorize biology terms—they investigate cellular pathology and radiological diagnostics alongside Marie Curie, building a real mastery portfolio while earning accredited university biology credits.",
        link: "https://www.thecooldown.com/green-tech/student-diagnose-blood-diseases-north-dakota-grant/",
        pathway: "School of Biomedics & Life Sciences Track",
    },
];

export const StudentSuccessStories = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex((prev) => (prev + 1) % EARLY_COLLEGE_PRECEDENTS.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + EARLY_COLLEGE_PRECEDENTS.length) % EARLY_COLLEGE_PRECEDENTS.length);

    const story = EARLY_COLLEGE_PRECEDENTS[currentIndex];

    return (
        <section className="py-24 bg-[#FAF8F5] border-t border-[#C9B47C]/30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Honest, Inspiring Framing Header */}
                <div className="text-center mb-14">
                    <span className="text-[#8B2332] font-bold tracking-[0.22em] text-xs uppercase mb-3 block">
                        Why Wait Until 18? · National Early-College Proof
                    </span>
                    <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2D2D] mb-5 leading-tight">
                        <span className="block">Young Minds Can Already Do College.</span>
                        <span className="block text-[#8B2332] mt-1">Imagine What&apos;s Possible With Our Help.</span>
                    </h2>
                    <p className="text-slate-600 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
                        Across the country, independent young learners have already proven in the national news that 11-to-15-year-olds can pass accredited college courses and earn degrees&mdash;even when they had to piece together dry adult textbooks on their own. <strong>University School was built to make early college accessible, social, and deeply engaging for every curious kid starting at age 11.</strong>
                    </p>
                </div>

                {/* 3 Pillar Strip: Why Kids Can Do College Earlier With Our Help */}
                <div className="grid md:grid-cols-3 gap-5 mb-12 max-w-5xl mx-auto">
                    {[
                        {
                            title: '1. No High School Diploma Needed',
                            desc: 'Partner universities and CLEP credit-by-exam pathways allow students aged 11+ to earn official, transferable college transcript credits right now.',
                        },
                        {
                            title: '2. Built for 11+ Minds, Not Lecture Halls',
                            desc: 'Independent prodigies had to grind through adult lectures alone. We transform those exact university syllabi into playable historical quests and XP skill trees.',
                        },
                        {
                            title: '3. Guided by Socratic AI & Peer Squads',
                            desc: 'Instead of struggling in isolation, our students team up in 4-player Co-Op Discovery Squads with a Socratic mentor that bridges every lab to the university exam.',
                        },
                    ].map((pillar, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl p-5 border border-[#C9B47C]/40 shadow-md flex flex-col justify-between"
                        >
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-[#8B2332] mb-1.5">
                                    {pillar.title}
                                </div>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                    {pillar.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* National Early-College Precedent + How University School Helps Card */}
                <div className="relative bg-gradient-to-br from-[#23090D] to-[#140508] text-white rounded-3xl border border-[#E6C687]/40 p-6 sm:p-10 shadow-2xl max-w-5xl mx-auto overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-white/10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B2332] border border-[#E6C687]/40 text-[#E6C687] text-[11px] font-bold uppercase tracking-wider">
                            <GraduationCap size={14} /> National Early-College Precedent (In the News)
                        </div>
                        <span className="text-xs text-slate-300 font-medium">
                            Case Study {currentIndex + 1} of {EARLY_COLLEGE_PRECEDENTS.length} · Independent Public Record
                        </span>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                        {/* Left 6 Cols: What This Young Student Proved On Their Own */}
                        <div className="lg:col-span-6 flex flex-col justify-between bg-[#1B070B] border border-white/10 rounded-2xl p-6">
                            <div>
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                    <h3 className="font-serif text-2xl font-bold text-white">{story.name}</h3>
                                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#E6C687]/15 text-[#E6C687] border border-[#E6C687]/40">
                                        {story.age}
                                    </span>
                                </div>
                                <p className="text-[#E6C687] font-serif font-bold text-base mb-3">
                                    {story.achievement}
                                </p>
                                <p className="text-slate-300 text-sm leading-relaxed mb-5">
                                    {story.detail}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                                <span className="text-[11px] text-slate-400 italic">
                                    Independent national news example (not a University School student)
                                </span>
                                <a
                                    href={story.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[#E6C687] text-xs font-bold hover:underline shrink-0"
                                >
                                    News Source <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>

                        {/* Right 6 Cols: How University School Makes This Possible for Your Child */}
                        <div className="lg:col-span-6 bg-[#F5EBDC] text-[#2B0A10] rounded-2xl p-6 border border-[#C9B47C] shadow-inner flex flex-col justify-between">
                            <div>
                                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#8B2332] mb-2">
                                    <Sparkles size={13} /> How We Make This Possible for Your Child
                                </div>
                                <h4 className="font-serif text-xl font-bold text-[#1F070B] mb-3">
                                    You Don&apos;t Have to Piece It Together Alone.
                                </h4>
                                <p className="text-xs sm:text-sm text-[#2B0A10]/90 leading-relaxed mb-4">
                                    {story.howWeHelp}
                                </p>
                                <div className="space-y-2 text-xs font-semibold text-[#1F070B]">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={15} className="text-[#8B2332] shrink-0" />
                                        <span>Real university syllabi transformed into 5-episode historical quests</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={15} className="text-[#8B2332] shrink-0" />
                                        <span>XP, Skill Trees &amp; 4-person Co-Op Squads keep 11–15 year olds engaged</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={15} className="text-[#8B2332] shrink-0" />
                                        <span>Socratic Homework &amp; Exam Companion prepares them to pass properly</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 pt-3 border-t border-[#2B0A10]/15 flex items-center justify-between text-xs font-bold text-[#8B2332]">
                                <span className="flex items-center gap-1.5">
                                    <Compass size={14} /> {story.pathway}
                                </span>
                                <span>Starts at Age 11+</span>
                            </div>
                        </div>
                    </div>

                    {/* Carousel Navigation */}
                    <div className="flex items-center justify-between mt-7 pt-5 border-t border-white/10">
                        <button
                            onClick={prev}
                            className="flex items-center gap-2 text-slate-300 hover:text-[#E6C687] transition-colors text-sm font-bold"
                        >
                            <ChevronLeft size={18} /> Previous Example
                        </button>
                        <div className="flex gap-2">
                            {EARLY_COLLEGE_PRECEDENTS.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                                        i === currentIndex ? 'bg-[#E6C687] scale-125' : 'bg-white/25 hover:bg-white/50'
                                    }`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={next}
                            className="flex items-center gap-2 text-slate-300 hover:text-[#E6C687] transition-colors text-sm font-bold"
                        >
                            Next Example <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

