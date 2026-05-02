import React, { useState } from 'react';
import {
    TrendingUp, ExternalLink, Shield, FileText, Video, BarChart3,
    Users, CheckCircle, Eye, DollarSign, Sparkles, Lock, ArrowRight,
    Building, Star, GraduationCap, Filter
} from 'lucide-react';

/**
 * BASICSInvestorPortal — Berkeley-affiliated investors can log in to see:
 * - All cohort companies and their progress
 * - Standardized data rooms
 * - Pre-commit to deals (SAFE at same terms/cap)
 * - Company pitch videos & decks
 *
 * All deals use standardized SAFE at the same terms and cap.
 */

// Re-use company data from BASICSDemoDay (in production, shared data source)
const COHORT_COMPANIES = [
    { name: 'University School', founder: 'Frank Barcellos', description: 'AI-powered gamified educational platform', color: '#8B2332', isMentor: true, progress: 100, dataRoomComplete: true },
    { name: 'NewNav', founder: 'Mina Sonmez', description: 'AI college navigation for first-gen students', color: '#3b82f6', progress: 85, dataRoomComplete: true },
    { name: 'Lumina', founder: 'Ellen Zhang', description: 'Tinder-style STEM learning revolution', color: '#8b5cf6', progress: 78, dataRoomComplete: false },
    { name: 'TheseDays', founder: 'Claudius Ma', description: 'Spotify for your memory — AI life journaling', color: '#10b981', progress: 92, dataRoomComplete: true },
    { name: 'Breeze', founder: 'Jessica Miller', description: 'AI media bias detection for consumers', color: '#f59e0b', progress: 70, dataRoomComplete: false },
    { name: 'Cognitive Calendar', founder: 'Naomi Toubian', description: 'Neuroscience-backed cognitive scheduling', color: '#0ea5e9', progress: 88, dataRoomComplete: true },
    { name: 'Evardi Energy', founder: 'Aarya Borele, Evan Davis & Diva Shah', description: 'AI demand intelligence for energy grids', color: '#22c55e', progress: 95, dataRoomComplete: true },
    { name: 'BobbyPin', founder: 'Maya Mitchell', description: 'AI video editor for hair stylists', color: '#ec4899', progress: 82, dataRoomComplete: true },
    { name: 'YouLet', founder: 'Kaho Furukawa', description: 'Human Relational Intelligence Layer', color: '#a855f7', progress: 65, dataRoomComplete: false },
    { name: 'TradePath', founder: 'Chris Weiss', description: 'Neuroscience-backed trade career discovery', color: '#f97316', progress: 90, dataRoomComplete: true },
    { name: 'Heirloom', founder: 'Yasmine Baker', description: 'Ethically-sourced artisanal fashion marketplace', color: '#b45309', progress: 75, dataRoomComplete: false },
    { name: 'Qluu', founder: 'Mike Jacobs', description: 'AI integrated air and missile defense — Titanium Dome', color: '#dc2626', progress: 100, dataRoomComplete: true },
];

const DEAL_TERMS = {
    instrument: 'Post-Money SAFE',
    valCap: '$2M',
    discount: 'None (standard)',
    proRata: 'Yes',
    mfn: 'Yes',
    minInvestment: '$1,000',
    platform: 'Sydecar',
};

export const BASICSInvestorPortal = ({ investor, onBack, onLogout }) => {
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all' | 'data_room_complete' | 'precommitted'
    const [precommits, setPrecommits] = useState(() => {
        const saved = localStorage.getItem(`basics_precommits_${investor?.email}`);
        return saved ? JSON.parse(saved) : [];
    });

    const togglePrecommit = (companyName) => {
        const updated = precommits.includes(companyName)
            ? precommits.filter(c => c !== companyName)
            : [...precommits, companyName];
        setPrecommits(updated);
        localStorage.setItem(`basics_precommits_${investor?.email}`, JSON.stringify(updated));
    };

    const filtered = COHORT_COMPANIES.filter(c => {
        if (filter === 'data_room_complete') return c.dataRoomComplete;
        if (filter === 'precommitted') return precommits.includes(c.name);
        return true;
    });

    return (
        <div className="min-h-screen bg-[#FAF8F5]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#003262] to-[#001a3d] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={onBack} className="text-white/50 hover:text-white text-sm transition-colors">← Back</button>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-white/40">{investor?.email}</span>
                            <button onClick={onLogout} className="text-xs text-white/30 hover:text-white/50 underline">Logout</button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                        <GraduationCap size={16} className="text-[#C9B47C]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[#C9B47C]">Investor Portal</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                        BASICS <span className="text-[#C9B47C]">@</span> Berkeley — Spring 2026
                    </h1>
                    <p className="text-white/50 text-sm mb-4">
                        Browse cohort companies, view data rooms, and pre-commit to standardized SAFE deals.
                    </p>

                    {/* Deal Terms Summary */}
                    <div className="flex flex-wrap gap-3 mt-4">
                        {Object.entries(DEAL_TERMS).map(([key, val]) => (
                            <div key={key} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs">
                                <span className="text-white/40 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1')}: </span>
                                <span className="text-white font-bold">{val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center gap-3 mb-6">
                    <Filter size={14} className="text-slate-400" />
                    {[
                        { id: 'all', label: `All (${COHORT_COMPANIES.length})` },
                        { id: 'data_room_complete', label: `Data Room Ready (${COHORT_COMPANIES.filter(c => c.dataRoomComplete).length})` },
                        { id: 'precommitted', label: `My Pre-Commits (${precommits.length})` },
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                filter === f.id ? 'bg-[#003262] text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Company Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((company) => {
                        const isPrecommitted = precommits.includes(company.name);
                        return (
                            <div key={company.name} className={`relative p-6 rounded-2xl border bg-white transition-all hover:shadow-lg ${
                                isPrecommitted ? 'border-green-300 ring-2 ring-green-100' : 'border-slate-200'
                            }`}>
                                {company.isMentor && (
                                    <div className="absolute -top-2.5 left-5 px-2.5 py-0.5 rounded-full bg-[#C9B47C] text-[#001a3d] text-[8px] font-bold uppercase tracking-widest shadow">
                                        <Star size={8} className="inline mr-0.5 -mt-0.5" /> Mentor
                                    </div>
                                )}

                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                                        style={{ background: `linear-gradient(135deg, ${company.color}, ${company.color}cc)` }}>
                                        {company.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-[#2D2D2D] text-base">{company.name}</h3>
                                        <p className="text-xs text-slate-400 font-medium">{company.founder}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-600 mb-4 leading-relaxed">{company.description}</p>

                                {/* Progress */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all" style={{ width: `${company.progress}%`, background: company.color }} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">{company.progress}%</span>
                                </div>

                                {/* Status badges */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {company.dataRoomComplete && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-lg">
                                            <CheckCircle size={10} /> Data Room
                                        </span>
                                    )}
                                    {!company.dataRoomComplete && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                                            <Lock size={10} /> In Progress
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {company.dataRoomComplete && (
                                        <button className="flex-1 text-xs font-bold text-[#003262] bg-[#003262]/5 hover:bg-[#003262]/10 py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                                            <Eye size={12} /> View Data Room
                                        </button>
                                    )}
                                    <button
                                        onClick={() => togglePrecommit(company.name)}
                                        className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                                            isPrecommitted
                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                : 'bg-[#C9B47C]/10 text-[#C9B47C] hover:bg-[#C9B47C]/20 border border-[#C9B47C]/20'
                                        }`}
                                    >
                                        {isPrecommitted ? <><CheckCircle size={12} /> Pre-Committed</> : <><DollarSign size={12} /> Pre-Commit</>}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Sydecar CTA */}
                <div className="mt-10 text-center p-8 rounded-2xl bg-white border border-slate-200">
                    <Sparkles size={24} className="mx-auto text-[#C9B47C] mb-3" />
                    <h3 className="text-xl font-bold text-[#2D2D2D] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Invest via Sydecar Syndicates
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 max-w-md mx-auto">
                        All BASICS companies raise through standardized Sydecar syndicates with identical SAFE terms.
                    </p>
                    <p className="text-xs text-slate-400">
                        Investments available to accredited investors only. SEC-compliant infrastructure by Sydecar.
                    </p>
                </div>
            </div>
        </div>
    );
};
