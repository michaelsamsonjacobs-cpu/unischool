import React, { useState } from 'react';
import { Search, Book, User, Cpu, AlertCircle, ChevronRight, MessageSquare, ExternalLink, Menu } from 'lucide-react';

export const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const ARTICLES = [
        { id: 1, title: 'How to Earn XP in University School', views: '2.5k', cat: 'Academics', image: '/images/xp-guide.png' },
        { id: 2, title: 'Understanding the Transfer Matrix', views: '1.8k', cat: 'Admissions', image: '/images/matrix-guide.png' },
        { id: 3, title: 'How to Connect with an Advisor', views: '950', cat: 'Support', image: '/images/advisor-guide.png' },
    ];

    return (
        <div className="min-h-full bg-white text-[#2D2D2D] font-sans">
            {/* Wiki Header */}
            <div className="border-b border-slate-200 px-6 py-4 flex items-center gap-4 bg-white sticky top-0 z-10">
                <img src="/images/unischool-logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                <div className="flex-1">
                    <h1 className="font-serif font-bold text-xl tracking-tight text-[#8B2332]">University<span className="text-[#C9B47C]">Wiki</span></h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">The Student Knowledge Base</p>
                </div>
                <div className="hidden md:flex gap-6 text-sm font-bold text-slate-600">
                    <a href="#" className="hover:text-[#8B2332]">Explore</a>
                    <a href="#" className="hover:text-[#8B2332]">Academics</a>
                    <a href="#" className="hover:text-[#8B2332]">Community</a>
                </div>
                <button className="md:hidden p-2 text-slate-600"><Menu size={24} /></button>
            </div>

            {/* Hero Search (WikiHow Style) */}
            <div className="bg-[#FAF8F5] py-16 px-6 text-center border-b border-slate-200">
                <h2 className="text-3xl md:text-5xl font-serif font-black mb-6 text-[#2D2D2D]">What do you want to learn today?</h2>

                <div className="max-w-2xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Search for guides (e.g., 'How to submit homework')"
                        className="w-full py-4 pl-6 pr-16 rounded-full border-2 border-slate-300 focus:border-[#8B2332] shadow-sm text-lg outline-none transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#8B2332] text-white p-2.5 rounded-full hover:bg-[#7A1E2B] transition-colors">
                        <Search size={20} />
                    </button>
                </div>
            </div>

            {/* Content Layout */}
            <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Articles Column */}
                <div className="lg:col-span-2 space-y-8">
                    <h3 className="font-bold text-xl border-b-2 border-slate-100 pb-2 mb-6">Trending Guides</h3>

                    {ARTICLES.map(article => (
                        <div key={article.id} className="group cursor-pointer flex gap-4 items-start sm:items-center p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                            {/* Placeholder for "WikiHow" style illustrations */}
                            <div className="w-24 h-24 sm:w-32 sm:h-24 bg-slate-200 rounded-lg shrink-0 overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                    <Book size={24} />
                                </div>
                            </div>

                            <div>
                                <span className="text-xs font-bold text-[#8B2332] uppercase mb-1 block">{article.cat}</span>
                                <h4 className="text-xl font-bold text-[#2D2D2D] group-hover:text-[#8B2332] group-hover:underline decoration-2 underline-offset-2 mb-1">
                                    {article.title}
                                </h4>
                                <div className="text-sm text-slate-500">
                                    Last updated yesterday • {article.views} views
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Categories Grid */}
                    <div className="mt-12">
                        <h3 className="font-bold text-xl border-b-2 border-slate-100 pb-2 mb-6">Browse by Category</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {['Admissions', 'Student Life', 'Tech Support', 'Financial Aid', 'Clubs', 'Study Tips'].map(cat => (
                                <button key={cat} className="p-4 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-[#FAF8F5] hover:text-[#8B2332] hover:border-[#8B2332] transition-colors">
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-slate-200 text-center">
                        <img src="/images/unischool-logo.png" alt="Logo" className="w-16 h-16 object-contain mx-auto mb-4" />
                        <h4 className="font-bold text-lg mb-2">Need an Expert?</h4>
                        <p className="text-sm text-slate-500 mb-4">Our advisors are online and ready to help you navigate your path.</p>
                        <button className="w-full py-3 bg-[#8B2332] text-white rounded-full font-bold hover:bg-[#7A1E2B] transition-colors shadow-sm">
                            Chat with Navigator
                        </button>
                    </div>

                    <div className="border border-slate-200 rounded-2xl p-6">
                        <h4 className="font-bold border-b border-slate-100 pb-2 mb-4">Community Activity</h4>
                        <div className="space-y-4">
                            <div className="flex gap-3 text-sm">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                <p><span className="font-bold">Sarah K.</span> asked about AP Calc limits</p>
                            </div>
                            <div className="flex gap-3 text-sm">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                <p><span className="font-bold">Mike J.</span> created a new Study Group</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
