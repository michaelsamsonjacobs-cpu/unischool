import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';

const STUDENT_STORIES = [
    {
        name: "Clovis Hung",
        age: "12",
        achievement: "Youngest graduate in the history of Fullerton College",
        detail: "Earned five associate degrees across disciplines including history, social sciences, mathematics, and the arts. Seeking greater academic challenge than he found in a conventional school setting, Clovis pursued college-level coursework years ahead of the typical schedule.",
        inspiration: "Today, Clovis continues exploring his interests in aviation, technology, and higher education while inspiring students around the world.",
        link: "https://news.fullcoll.edu/at-12-clovis-hung-breaks-record-for-youngest-fullerton-college-graduate/",
        color: "#8B2332",
    },
    {
        name: "Ava Hauck",
        age: "High School",
        achievement: "Created an AI-powered diagnostic system for blood diseases",
        detail: "As a high school student, Ava created and patented an AI-powered diagnostic system capable of identifying blood-related diseases such as malaria, leukemia, and anemia from medical images within seconds. Designed to operate on portable hardware without requiring internet access.",
        inspiration: "Her innovation earned a $50,000 grant to further develop the project and continue her research at the University of North Dakota.",
        link: "https://www.thecooldown.com/green-tech/student-diagnose-blood-diseases-north-dakota-grant/",
        color: "#C9B47C",
    },
    {
        name: "James 'Jimmy' Chilimigras",
        age: "15",
        achievement: "Youngest CPA on record; Law degree with highest honors",
        detail: "By age 12, he earned his high school diploma. At 15, he completed both a bachelor's and a master's degree in Accounting before becoming the youngest Certified Public Accountant (CPA) on record. He then graduated from Loyola University New Orleans College of Law with highest honors.",
        inspiration: "His story illustrates how exceptional motivation, family support, and access to advanced educational opportunities can enable students to progress far beyond conventional timelines.",
        link: "https://law.loyno.edu/news/may-04-2026_after-starting-his-jd-fifteen-eighteen-year-old-loyola-law-student-graduates-may",
        color: "#3b82f6",
    },
    {
        name: "Zainab Al-Mansoori",
        age: "17",
        achievement: "Three engineering degrees from the University of Kentucky",
        detail: "At just 17 years old, she graduated from the University of Kentucky with three engineering degrees, achieving a milestone that few students reach at any age. While many teenagers are still completing high school, Zainab was mastering advanced engineering concepts.",
        inspiration: "Her story serves as a reminder that academic pathways do not need to follow a traditional timeline. With the right support, students can accelerate their growth.",
        link: "https://www.egyptindependent.com/how-a-young-egyptian-student-earned-3-american-engineering-degrees/",
        color: "#10b981",
    },
    {
        name: "Ethan River Luescher",
        age: "15",
        achievement: "Associate degree + cybersecurity certifications",
        detail: "Ethan earned an Associate of Applied Science degree from Tarrant County College, along with specialized certifications in cybersecurity and ethical hacking. He began taking college-level courses at age 12 while still in middle school.",
        inspiration: "He is an honor society member, a Life Scout, a classical pianist, and a competitive judo athlete — demonstrating the power of a well-rounded, accelerated education.",
        link: "https://www.nbcdfw.com/news/local/15-year-old-earns-college-degree/4024315/",
        color: "#8B2332",
    },
    {
        name: "Dr. Salenah Cartier",
        age: "23",
        achievement: "Youngest doctoral graduate in University of Houston history",
        detail: "Salenah became the university's youngest bachelor's degree graduate at age 17, youngest master's degree graduate at 18, and earned her Doctor of Education (Ed.D.) at 23. Her story is one of resilience, overcoming significant challenges during her early years.",
        inspiration: "Through her research and advocacy, Dr. Cartier has emphasized the role of education and technology in creating pathways for opportunity, empowerment, and social impact.",
        link: "https://www.uh.edu/class/news/archive/2020/december/youngest-graduate-of-2020/",
        color: "#C9B47C",
    },
    {
        name: "Laurent Simons",
        age: "15",
        achievement: "Ph.D. in Quantum Physics from the University of Antwerp",
        detail: "At just 15 years old, Laurent earned a Ph.D. in Quantum Physics, completing research in one of the most advanced and mathematically demanding fields of modern science. His work focused on the behavior of quantum particles.",
        inspiration: "Following his doctorate, Laurent continued pursuing advanced studies at the intersection of medicine, AI, and scientific research, demonstrating a commitment to lifelong learning.",
        link: "https://www.sciencealert.com/belgiums-little-einstein-earns-phd-in-quantum-physics-at-age-15",
        color: "#a855f7",
    },
];

export const StudentSuccessStories = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex((prev) => (prev + 1) % STUDENT_STORIES.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + STUDENT_STORIES.length) % STUDENT_STORIES.length);

    const story = STUDENT_STORIES[currentIndex];

    return (
        <section className="py-24 bg-[#FAF8F5] border-t border-[#C9B47C]/20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-[#C9B47C] font-bold tracking-widest text-xs uppercase mb-3 block">Inspiration</span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-6">
                        Student Success Stories
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Real examples of students who achieved exceptional academic results through alternative, accelerated, or non-traditional learning pathways.
                    </p>
                </div>

                {/* Story Card */}
                <div className="relative bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-xl max-w-4xl mx-auto overflow-hidden">
                    {/* Accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r" style={{ background: `linear-gradient(to right, ${story.color}, ${story.color}80)` }} />

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Left: Avatar */}
                        <div className="flex-shrink-0">
                            <div className="h-20 w-20 rounded-2xl flex items-center justify-center text-white text-3xl font-serif font-bold shadow-lg" style={{ background: `linear-gradient(135deg, ${story.color}, ${story.color}CC)` }}>
                                {story.name.charAt(0)}
                            </div>
                        </div>

                        {/* Right: Content */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-serif text-2xl font-bold text-[#2D2D2D]">{story.name}</h3>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border" style={{ color: story.color, borderColor: `${story.color}30`, backgroundColor: `${story.color}08` }}>
                                    Age {story.age}
                                </span>
                            </div>
                            <p className="text-[#8B2332] font-bold text-sm mb-4">{story.achievement}</p>
                            <p className="text-slate-600 text-sm leading-relaxed mb-3">{story.detail}</p>
                            <p className="text-slate-500 text-sm leading-relaxed italic mb-6">{story.inspiration}</p>

                            <a href={story.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#8B2332] text-xs font-bold hover:underline">
                                Read Full Story <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                        <button onClick={prev} className="flex items-center gap-2 text-slate-500 hover:text-[#8B2332] transition-colors text-sm font-bold">
                            <ChevronLeft size={18} /> Previous
                        </button>
                        <div className="flex gap-2">
                            {STUDENT_STORIES.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentIndex ? 'bg-[#8B2332] scale-125' : 'bg-slate-300 hover:bg-slate-400'}`}
                                />
                            ))}
                        </div>
                        <button onClick={next} className="flex items-center gap-2 text-slate-500 hover:text-[#8B2332] transition-colors text-sm font-bold">
                            Next <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Disclaimer */}
                <p className="text-center text-xs text-slate-400 mt-8 max-w-2xl mx-auto">
                    These stories showcase real students who achieved exceptional results through alternative learning pathways. They are presented as inspiration and do not represent University School student outcomes.
                </p>
            </div>
        </section>
    );
};
