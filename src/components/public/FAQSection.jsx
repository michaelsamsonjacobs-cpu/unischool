import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_DATA = [
    {
        q: "Is this accredited?",
        a: "University School partners with fully accredited universities and course providers. While we are not directly accredited ourselves, the courses students take through our partner institutions carry accredited credits that are recognized by universities nationwide."
    },
    {
        q: "How do transfer credits work?",
        a: "Students earn credits through our partner universities' accredited online courses. These credits transfer to other institutions through established transfer agreements, such as TAG (Transfer Admission Guarantee) programs with the UC system and articulation agreements with hundreds of colleges."
    },
    {
        q: "Does this replace high school?",
        a: "No. University School supplements a student's high school education by allowing them to simultaneously earn college credits. Students continue their high school coursework while accelerating their college pathway."
    },
    {
        q: "How many hours per day?",
        a: "Most students spend 1-2 hours per day on University School coursework, depending on the number of college courses they're taking. Our AI-driven gamified approach makes study time more efficient and engaging than traditional lecture-based learning."
    },
    {
        q: "Is this for homeschoolers only?",
        a: "Not at all. University School is designed for all ambitious students — whether they attend public school, private school, or are homeschooled. Any motivated student aged 11+ can benefit from earning college credits early."
    },
    {
        q: "Can international students participate?",
        a: "Yes! Our platform is accessible globally. International students can earn transferable college credits through our U.S.-based partner universities, giving them a head start before applying to American colleges or universities in other countries that accept U.S. transfer credits."
    },
    {
        q: "What universities are involved?",
        a: "We partner with over 60 accredited universities and community colleges across the United States, including institutions in the UC system, Cal State system, and many more. Our transfer pathways cover a wide range of top public and private universities."
    },
    {
        q: "What age should students start?",
        a: "Students can begin as early as 11 years old. Starting with interactive first-person missions at 11 builds foundational mastery and transferable college credits early, giving students maximum flexibility and tuition savings."
    },
    {
        q: "How does the AI Narrator work?",
        a: "Each course is guided by an AI Narrator — historical and scientific figures like Einstein or the Wright Brothers who fit the subject. You play in first person making real decisions, learning by getting it wrong, while college graduates oversee every subject."
    },
    {
        q: "How do Local Nodes work?",
        a: "University School Nodes are physical microschool locations where students can collaborate in person, build in robotics and science labs, and receive guidance from university-graduate facilitators alongside their online coursework."
    },
    {
        q: "What is the role of parents?",
        a: "Parents have full visibility into their child's progress through our Parent Dashboard. They can track course completion, XP progress, and upcoming milestones while our AI Narrator and subject-matter college graduates guide the coursework."
    },
    {
        q: "Are credits guaranteed to transfer?",
        a: "Credits earned through our accredited partner universities are widely accepted. However, transfer credit acceptance ultimately depends on the receiving institution's policies. We help students target courses with the highest transfer compatibility for their desired universities."
    }
];

export const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="py-24 bg-white border-t border-slate-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-[#C9B47C] font-bold tracking-widest text-xs uppercase mb-3 block">Common Questions</span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-6">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Everything parents and students need to know about University School.
                    </p>
                </div>

                <div className="space-y-3">
                    {FAQ_DATA.map((item, i) => (
                        <div key={i} className="bg-[#FAF8F5] border border-slate-200 rounded-2xl overflow-hidden hover:border-[#C9B47C]/40 transition-colors">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <HelpCircle size={18} className="text-[#8B2332] flex-shrink-0" />
                                    <span className="font-bold text-[#2D2D2D] text-sm md:text-base">{item.q}</span>
                                </div>
                                <ChevronDown
                                    size={18}
                                    className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ml-4 ${openIndex === i ? 'rotate-180' : ''}`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <p className="px-6 pb-6 text-slate-600 text-sm leading-relaxed pl-12">
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
