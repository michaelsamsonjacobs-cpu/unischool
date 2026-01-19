import React from 'react';
import { MapPin, Users, Award, BookOpen, Shield } from 'lucide-react';

export const AboutPage = ({ onNavigate }) => {
    return (
        <div className="flex flex-col pt-20 pb-32">
            {/* Hero */}
            <section className="bg-white py-24 border-b border-[#8B2332]/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/berkeley-campus.jpg')] bg-cover bg-center opacity-5" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/50" />

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B2332]/10 border border-[#8B2332]/20 text-[#8B2332] font-semibold text-sm mb-8">
                        <MapPin size={16} /> Headquartered at UC Berkeley
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#2D2D2D] mb-8">
                        The Engineers of <br />
                        <span className="text-[#8B2332]">Educational Mobility.</span>
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed font-light">
                        University School isn't a startup built by tech bros. It's a new educational infrastructure
                        architected by PhDs, Deans, and Admissions Officers from the world's leading public university.
                    </p>
                </div>
            </section>

            {/* Our Origins */}
            <section className="py-24 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="font-serif text-4xl font-bold text-[#2D2D2D] mb-6">Born in the Hallways of Berkeley.</h2>
                            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                                In 2024, a group of UC Berkeley administrators noticed a pattern: strictly
                                "playing the game" of high school APs and extracurriculars was no longer enough.
                                The admissions algorithm had changed, but students were still using an outdated playbook.
                            </p>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                We gathered a team of data scientists, former admissions officers, and game designers
                                to build <strong>The Matrix</strong>—a reverse-engineered map of guaranteed transfer pathways.
                            </p>
                            <div className="flex items-center gap-4 text-[#2D2D2D] font-bold">
                                <div className="h-12 w-12 rounded-full bg-[#003262] flex items-center justify-center text-[#FDB515] border border-[#FDB515]/30">
                                    <span className="font-serif text-xl">Cal</span>
                                </div>
                                <span>Official Research Spin-out</span>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#003262] to-[#FDB515] rounded-2xl blur-2xl opacity-10" />
                            <div className="relative bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
                                <div className="flex items-start gap-4">
                                    <Shield className="text-[#8B2332] mt-1" size={32} />
                                    <div>
                                        <h3 className="font-bold text-[#2D2D2D] text-xl mb-2">Academic Oversight Board</h3>
                                        <p className="text-slate-600 text-sm mb-4">Every curriculum module and algorithm update is reviewed by our board of active university faculty.</p>
                                        <ul className="space-y-2">
                                            {[
                                                "Department of Cognitive Science, UC Berkeley",
                                                "Graduate School of Education, UC Berkeley",
                                                "Office of Undergraduate Admissions, UCLA"
                                            ].map((name, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                                    <Award size={14} className="text-[#8B2332]" /> {name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-24 bg-white border-t border-[#8B2332]/10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="font-serif text-3xl font-bold text-[#2D2D2D] mb-16">The University School Standard</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: BookOpen, title: "Rigorous Inquiry", desc: "We don't teach to the test. We teach the Socratic method, critical analysis, and first-principles thinking." },
                            { icon: Users, title: "Sovereign Agency", desc: "Students are not passengers. They are pilots. We give them the controls to their own education." },
                            { icon: Shield, title: "Radical Transparency", desc: "No lottery tickets. We tell students exactly what the requirements are and how to meet them." }
                        ].map((val, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-[#FAF8F5] border border-slate-200 hover:border-[#8B2332]/50 transition-colors shadow-sm">
                                <val.icon className="mx-auto text-[#8B2332] mb-6" size={32} />
                                <h3 className="font-bold text-[#2D2D2D] text-lg mb-4">{val.title}</h3>
                                <p className="text-slate-600">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
