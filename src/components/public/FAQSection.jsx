import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_DATA = [
    {
        q: 'How do students earn real university credits and degrees starting at age 11?',
        a: 'Students enroll in real, accredited university courses offered through our partner universities (such as Arizona State University) and CLEP credit-by-exam sequences. University School transforms those syllabi into interactive first-person historical campaigns, and upon completing the university assessments, the partner university issues official transcript credits that stack toward undergraduate certificates, associate degrees, and full bachelor’s degrees.',
    },
    {
        q: 'Are the credits, certificates, and degrees fully accredited?',
        a: 'Yes. The courses, certificates, and degrees are issued directly by regionally accredited partner universities. Credits appear on an official university transcript and are recognized by over 60 public and private universities nationwide.',
    },
    {
        q: 'How does the Interactive XP Curriculum Model work?',
        a: 'Instead of starting with dry textbook chapters and passive video lectures, students enter a historical breakthrough moment first—such as answering the 1899 "HELP WANTED — Mechanical Assistance Needed" notice at the Wright Cycle Company in Dayton, Ohio. Students test wing camber, thrust, and weight in first person, and only after building physical intuition do they connect their discoveries to formal university equations and exams.',
    },
    {
        q: 'Who are the AI Historical Mentors?',
        a: 'Each of our 4 Knowledge Schools pairs students with AI-powered historical pioneers: Orville & Wilbur Wright, Amelia Earhart, Nikola Tesla, and Albert Einstein in Engineering; Marie Curie in Biomedics; Henry Ford in Business; and Abraham Lincoln in Law & Public Service. College graduates and subject-matter mentors oversee every course.',
    },
    {
        q: 'How does University School help students pass real university exams?',
        a: 'Our Socratic Exam & Assignment Coach bridges every interactive historical lab directly to the partner university’s formal problem sets and proctored assessments. It never gives away answers—instead, it guides students step-by-step using the experiments they just completed so they pass university exams with genuine mastery.',
    },
    {
        q: 'Does this replace middle school or high school?',
        a: 'University School can either supplement a student’s existing public, private, or homeschool education (1–2 hours per day) or serve as their primary accelerated academic pathway at a local University School Center, allowing them to earn college credits, certificates, and degrees years early.',
    },
    {
        q: 'How do 4-Student Co-Op Discovery Squads and Centers work?',
        a: 'Students never learn in isolation. Whether collaborating online or in person at a local University School Center, students are grouped by passion into 4-person discovery squads to run wind-tunnel trials, debate constitutional cases, and build capstone projects together.',
    },
    {
        q: 'Can international students earn U.S. university credits and degrees?',
        a: 'Yes! Students anywhere in the world can access University School across Computer, Tablet, TV App, and international Learning Centers to earn official U.S. university credits, certificates, and degrees.',
    },
];

export const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-24 bg-[#140709] text-white border-t border-[#C9B47C]/30">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-[#E6C687] font-bold tracking-[0.22em] text-xs uppercase mb-3 block">
                        Common Questions
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
                        Frequently Asked <span className="text-[#E6C687]">Questions</span>
                    </h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-lg">
                        Everything parents and students need to know about earning accredited university credits, certificates, and degrees starting at age 11.
                    </p>
                </div>

                <div className="space-y-3.5">
                    {FAQ_DATA.map((item, i) => (
                        <div
                            key={i}
                            className="bg-[#1F0B10] border border-[#E6C687]/30 rounded-2xl overflow-hidden hover:border-[#E6C687] transition-colors shadow-lg"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <div className="flex items-center gap-3.5">
                                    <HelpCircle size={19} className="text-[#E6C687] flex-shrink-0" />
                                    <span className="font-serif font-bold text-white text-base md:text-lg">
                                        {item.q}
                                    </span>
                                </div>
                                <ChevronDown
                                    size={18}
                                    className={`text-[#E6C687] transition-transform duration-300 flex-shrink-0 ml-4 ${
                                        openIndex === i ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${
                                    openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <p className="px-6 pb-6 text-slate-300 text-sm sm:text-base leading-relaxed pl-14">
                                    {item.a}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
