import React, { useState } from 'react';
import { Search, MapPin, Award, ExternalLink } from 'lucide-react';
import transferData from '../../data/transfer-pathways.json';

export const TransferPartners = () => {
    const [search, setSearch] = useState('');
    const [tierFilter, setTierFilter] = useState('all'); // all, P0, P1
    const [stateFilter, setStateFilter] = useState('all');

    // Get unique states
    const states = [...new Set(transferData.universities.map(u => u.state))].sort();

    const filtered = transferData.universities.filter(uni => {
        const matchesSearch = uni.name.toLowerCase().includes(search.toLowerCase());
        const matchesTier = tierFilter === 'all' || uni.tier === tierFilter;
        const matchesState = stateFilter === 'all' || uni.state === stateFilter;
        return matchesSearch && matchesTier && matchesState;
    });

    return (
        <div className="flex flex-col pt-20">
            {/* Header */}
            <section className="bg-[#0f172a] py-16 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                        The <span className="text-[#C9B47C]">Matrix</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl">
                        Our curriculum engine reverse-engineers the requirements for 60+ guaranteed admission pathways.
                        Find your target, follow the Navigator's plan, and get in.
                    </p>
                </div>
            </section>

            {/* Search & Filter */}
            <section className="py-8 bg-slate-900 border-b border-white/5 sticky top-20 z-40 shadow-xl">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search universities (e.g. UC Davis, ASU)..."
                                className="w-full bg-[#0f172a] border border-slate-700 text-white pl-12 pr-4 py-3 rounded-xl focus:border-[#C9B47C] outline-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="bg-[#0f172a] border border-slate-700 text-white px-4 py-3 rounded-xl outline-none"
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                        >
                            <option value="all">All States</option>
                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select
                            className="bg-[#0f172a] border border-slate-700 text-white px-4 py-3 rounded-xl outline-none"
                            value={tierFilter}
                            onChange={(e) => setTierFilter(e.target.value)}
                        >
                            <option value="all">All Tiers</option>
                            <option value="Tier 1 (Research)">Tier 1 (Research)</option>
                            <option value="Tier 2 (Large Public)">Tier 2 (Large Public)</option>
                            <option value="Tier 3 (Flexible)">Tier 3 (Flexible)</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="py-12 bg-[#0f172a]">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="text-slate-500 mb-6">Showing {filtered.length} transfer pathways</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((uni, i) => (
                            <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 hover:border-[#C9B47C]/30 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center font-serif font-bold text-slate-900 text-xl">
                                        {uni.name.charAt(0)}
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${uni.tier === 'P0' ? 'bg-[#C9B47C]/20 text-[#C9B47C]' :
                                        uni.tier === 'P1' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'
                                        }`}>
                                        {uni.tier}
                                    </span>
                                </div>

                                <h3 className="font-bold text-white text-lg mb-1 group-hover:text-[#C9B47C] transition-colors">{uni.name}</h3>
                                <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                                    <MapPin size={14} /> {uni.state} • {uni.program}
                                </div>

                                <div className="space-y-3 text-sm border-t border-slate-700/50 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Min GPA</span>
                                        <span className="text-white font-medium">{uni.minGPA}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Requirements</span>
                                        <span className="text-white font-medium text-right max-w-[60%]">{uni.requirements}</span>
                                    </div>
                                </div>

                                {uni.online && (
                                    <div className="mt-4 pt-3 flex items-center gap-2 text-xs text-green-400 bg-green-900/10 p-2 rounded">
                                        <Award size={14} /> 100% Online Options Available
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
