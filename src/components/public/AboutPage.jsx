import React from 'react';
import { MapPin, Users, Award, BookOpen, Shield, Sparkles, Globe, GraduationCap } from 'lucide-react';

export const AboutPage = ({ onNavigate }) => {
    return (
        <div className="flex flex-col pt-20 pb-20">
            {/* Hero */}
            <section className="relative min-h-[50vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-white">
                    <div className="absolute inset-0 bg-[url('/images/berkeley-campus.jpg')] bg-cover bg-center opacity-5" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/50" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B2332]/10 border border-[#8B2332]/20 text-[#8B2332] text-xs font-bold uppercase tracking-widest mb-8">
                        <MapPin size={12} /> Headquartered at UC Berkeley
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#2D2D2D] mb-8 leading-[1.05]">
                        The Engineers of <br />
                        <span className="text-[#8B2332]">Educational Mobility.</span>
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        University School isn't a startup built by tech bros. It's a new educational infrastructure
                        architected by PhDs, Deans, and Admissions Officers from the world's leading public university.
                    </p>
                </div>
            </section>

            {/* Our Origins */}
            <section className="py-24 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-[#C9B47C] font-bold tracking-widest text-xs uppercase mb-3 block">Our Story</span>
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
                                <div className="h-12 w-12 rounded-xl bg-[#003262] flex items-center justify-center text-[#FDB515] border border-[#FDB515]/30 shadow-lg">
                                    <span className="font-serif text-lg">Cal</span>
                                </div>
                                <span>Official Research Spin-out</span>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#003262] to-[#FDB515] rounded-3xl blur-[60px] opacity-10" />
                            <div className="relative bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-[#8B2332]/10 flex items-center justify-center flex-shrink-0">
                                        <Shield className="text-[#8B2332]" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#2D2D2D] text-xl mb-2">Academic Oversight Board</h3>
                                        <p className="text-slate-600 text-sm mb-4">Every curriculum module and algorithm update is reviewed by our board of active university faculty.</p>
                                        <ul className="space-y-3">
                                            {[
                                                "Department of Cognitive Science, UC Berkeley",
                                                "Graduate School of Education, UC Berkeley",
                                                "Office of Undergraduate Admissions, UCLA"
                                            ].map((name, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                                    <Award size={14} className="text-[#8B2332] flex-shrink-0" /> {name}
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
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[#C9B47C] font-bold tracking-widest text-xs uppercase mb-3 block">What We Stand For</span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2D2D2D]">The University School Standard</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { emoji: '📖', icon: BookOpen, title: "Rigorous Inquiry", desc: "We don't teach to the test. We teach the Socratic method, critical analysis, and first-principles thinking." },
                            { emoji: '🧭', icon: Users, title: "Sovereign Agency", desc: "Students are not passengers. They are pilots. We give them the controls to their own education." },
                            { emoji: '🔍', icon: Shield, title: "Radical Transparency", desc: "No lottery tickets. We tell students exactly what the requirements are and how to meet them." }
                        ].map((val, i) => (
                            <div key={i} className="group p-8 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all">
                                <div className="text-4xl mb-5">{val.emoji}</div>
                                <h3 className="font-serif font-bold text-[#2D2D2D] text-xl mb-4">{val.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                MEET THE FOUNDERS
                ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-[#FAF8F5] border-t border-[#C9B47C]/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[#C9B47C] font-bold tracking-widest text-xs uppercase mb-3 block">Leadership</span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-6">Meet the Founders</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            University School is led by a team with deep expertise in education, technology, and academic counseling.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Dave */}
                        <div className="bg-white rounded-3xl border border-slate-200 p-8 hover:shadow-xl transition-all">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#8B2332] to-[#C9B47C] flex items-center justify-center text-white text-2xl font-serif font-bold shadow-lg">D</div>
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-[#2D2D2D]">Dr. Dave</h3>
                                    <p className="text-[#8B2332] text-sm font-bold">Co-Founder &amp; Academic Director</p>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                With a Ph.D. from Harvard University, Dave brings world-class academic credentials and research expertise
                                to University School&apos;s curriculum design and academic partnerships.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 rounded-full bg-[#8B2332]/10 text-[#8B2332] text-[10px] font-bold uppercase tracking-wider">Ph.D., Harvard</span>
                                <span className="px-3 py-1 rounded-full bg-[#C9B47C]/10 text-[#C9B47C] text-[10px] font-bold uppercase tracking-wider">Academic Strategy</span>
                            </div>
                        </div>
                        {/* Frank */}
                        <div className="bg-white rounded-3xl border border-slate-200 p-8 hover:shadow-xl transition-all">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#C9B47C] to-[#A89560] flex items-center justify-center text-white text-2xl font-serif font-bold shadow-lg">F</div>
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-[#2D2D2D]">Frank</h3>
                                    <p className="text-[#C9B47C] text-sm font-bold">Co-Founder &amp; Education Director</p>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                With over 20 years of experience in education, Frank has developed Canadian Offshore K-12 schools internationally.
                                Canada is consistently recognized as one of the highest-performing English-speaking education systems in the world
                                based on PISA results.
                            </p>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                Frank was honored to receive the Noble Partner in Education Medal from the Government of Canada during the
                                celebration of Canada&apos;s 150th anniversary. He also holds the ASCA U Career Development Specialist and
                                College Admissions Specialist designations from the American School Counselor Association (ASCA).
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 rounded-full bg-[#C9B47C]/10 text-[#C9B47C] text-[10px] font-bold uppercase tracking-wider">20+ Years Education</span>
                                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-wider">Noble Partner Medal</span>
                                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-bold uppercase tracking-wider">ASCA Certified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
