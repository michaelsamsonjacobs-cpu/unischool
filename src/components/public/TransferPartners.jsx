import React, { useState } from 'react';
import { Search, MapPin, Award, ExternalLink } from 'lucide-react';
import transferData from '../../data/transfer-pathways.json';

export const TransferPartners = () => {
    const [search, setSearch] = useState('');
    const [tierFilter, setTierFilter] = useState('all'); // all, P0, P1
    const [stateFilter, setStateFilter] = useState('all');

    // Parse data to add 'state' and normalize fields
    const universities = transferData.universities.map(u => {
        const state = u.location.includes(',') ? u.location.split(',')[1].trim() : u.location;
        return {
            ...u,
            state: state,
            minGPA: u.requirements?.gpa || 'N/A',
            requirementsText: u.requirements?.spike ? u.requirements.spike : (u.requirements?.courses?.join(', ') || 'General Transfer'),
            programsText: Array.isArray(u.programs) ? u.programs.join(', ') : u.programs
        };
    });

    // Get unique states
    const states = [...new Set(universities.map(u => u.state))].sort();

    // Filter universities
    const filtered = universities.filter(uni => {
        const matchesSearch = uni.name.toLowerCase().includes(search.toLowerCase()) ||
            uni.location.toLowerCase().includes(search.toLowerCase());
        const matchesState = stateFilter === 'all' || uni.state === stateFilter;
        const matchesTier = tierFilter === 'all' || uni.tier === tierFilter;
        return matchesSearch && matchesState && matchesTier;
    });

    const guaranteed = filtered.filter(uni => uni.guaranteedSupport);
    const elite = filtered.filter(uni => !uni.guaranteedSupport);

    const UniversityCard = ({ uni }) => (
        <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-[#8B2332] transition-all group shadow-sm hover:shadow-lg flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                {uni.logo ? (
                    <img src={uni.logo} alt={uni.name} className="h-12 w-auto object-contain max-w-[60px]" />
                ) : (
                    <div className="h-12 w-12 bg-[#8B2332]/5 rounded-lg flex items-center justify-center font-serif font-bold text-[#8B2332] text-xl border border-[#8B2332]/10">
                        {uni.name.charAt(0)}
                    </div>
                )}
                <span className={`px-2 py-1 rounded text-xs font-bold ${uni.tier === 'P0' ? 'bg-[#8B2332]/10 text-[#8B2332]' :
                    uni.tier.includes('Ivy') || uni.tier.includes('Reach') ? 'bg-purple-100 text-purple-700' :
                        uni.tier.includes('Tier 1') ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {uni.tier.split('(')[0].trim()}
                </span>
            </div>

            <h3 className="font-bold text-[#2D2D2D] text-lg mb-1 group-hover:text-[#8B2332] transition-colors line-clamp-2">{uni.name}</h3>
            <div className="flex items-start gap-1 text-slate-500 text-sm mb-4">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span className="line-clamp-1">{uni.location}</span>
            </div>

            <div className="mt-auto space-y-3 text-sm border-t border-slate-100 pt-4">
                <div className="flex justify-between">
                    <span className="text-slate-500">Programs</span>
                    <span className="text-[#2D2D2D] font-medium text-right max-w-[60%] truncate" title={uni.programsText}>{uni.programsText}</span>
                </div>
                {uni.acceptanceRate && (
                    <div className="flex justify-between">
                        <span className="text-slate-500">Acceptance Rate</span>
                        <span className="text-[#2D2D2D] font-bold">{uni.acceptanceRate}</span>
                    </div>
                )}
                {uni.minGPA !== 'N/A' && (
                    <div className="flex justify-between">
                        <span className="text-slate-500">{uni.guaranteedSupport ? 'Min GPA' : 'Target GPA'}</span>
                        <span className="text-[#2D2D2D] font-bold">{uni.minGPA}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span className="text-slate-500">Requirements</span>
                    <span className="text-[#2D2D2D] font-medium text-right max-w-[60%] truncate" title={uni.requirementsText}>{uni.requirementsText}</span>
                </div>
            </div>

            {uni.online && (
                <div className="mt-4 pt-3 flex items-center gap-2 text-xs text-green-700 bg-green-50 p-2 rounded border border-green-100">
                    <Award size={14} /> 100% Online Options Available
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col pt-20 pb-32">
            {/* Header */}
            <section className="bg-white py-16 border-b border-[#8B2332]/10">
                <div className="max-w-7xl mx-auto px-4">
                    <span className="text-[#8B2332] font-bold tracking-widest text-xs uppercase mb-2 block">Legally Binding Transfer Agreements</span>
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-6">
                        Admissions is No Longer a <br />
                        <span className="text-[#8B2332]">Lottery.</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
                        These are not "likely" schools. These are <strong>100% guaranteed</strong> admissions pathways.
                        If you complete the Navigator's Quest Log for these universities, they <em>must</em> accept you.
                        University School's Admissions AI guides you into these guaranteed Tier 1 and 2 universities.
                    </p>
                </div>
            </section>

            {/* Search & Filter */}
            <section className="py-8 bg-[#FAF8F5] border-b border-[#8B2332]/10 sticky top-20 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search universities (e.g. UC Davis, ASU)..."
                                className="w-full bg-white border border-slate-200 text-[#2D2D2D] pl-12 pr-4 py-3 rounded-xl focus:border-[#8B2332] outline-none shadow-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="bg-white border border-slate-200 text-[#2D2D2D] px-4 py-3 rounded-xl outline-none shadow-sm focus:border-[#8B2332]"
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                        >
                            <option value="all">All States</option>
                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select
                            className="bg-white border border-slate-200 text-[#2D2D2D] px-4 py-3 rounded-xl outline-none shadow-sm focus:border-[#8B2332]"
                            value={tierFilter}
                            onChange={(e) => setTierFilter(e.target.value)}
                        >
                            <option value="all">All Tiers</option>
                            <option value="Tier 1 (Research)">Tier 1 (Research)</option>
                            <option value="Tier 2 (Large Public)">Tier 2 (Large Public)</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Guaranteed Results */}
            <section className="py-12 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-3 mb-8">
                        <Award className="text-[#8B2332]" size={32} />
                        <h2 className="text-3xl font-serif font-bold text-[#2D2D2D]">Guaranteed Admissions</h2>
                    </div>

                    {guaranteed.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                            {guaranteed.map((uni, i) => (
                                <UniversityCard key={i} uni={uni} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 italic mb-16">No guaranteed pathways match your search.</p>
                    )}

                    {/* Elite Opportunities Section */}
                    {elite.length > 0 && (
                        <>
                            <div className="border-t border-slate-200 pt-16 mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                                        <Award size={20} />
                                    </div>
                                    <h2 className="text-3xl font-serif font-bold text-[#2D2D2D]">Elite Opportunities</h2>
                                </div>
                                <p className="text-slate-600 max-w-3xl text-lg mb-8">
                                    While not legally guaranteed, University School students have a massive statistical advantage
                                    at these institutions due to our "Spike" curriculum and project-based portfolio.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {elite.map((uni, i) => (
                                    <UniversityCard key={i} uni={uni} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};
