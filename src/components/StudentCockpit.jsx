import React, { useState, useEffect } from 'react';
import { Trophy, Star, Target, Zap, Clock, BookOpen, ChevronRight, Activity, Calendar, Award, TrendingUp, MapPin, GraduationCap, Compass, ExternalLink, Sparkles } from 'lucide-react';
import { SkillTree } from './SkillTree';
import { QuestList } from './QuestCard';
import { ContentService } from '../services/ContentService';

// Sample skills (user progression) - still mocked locally for now
const SAMPLE_SKILLS = {
    logic: { level: 12, xp: 450, maxXp: 500 },
    rhetoric: { level: 8, xp: 280, maxXp: 500 },
    stem: { level: 15, xp: 320, maxXp: 500 },
    humanities: { level: 6, xp: 150, maxXp: 500 },
    arts: { level: 4, xp: 80, maxXp: 500 },
    athletics: { level: 5, xp: 200, maxXp: 500 },
};

// Path to Victory milestone component
const PathMilestone = ({ year, title, isComplete, isCurrent }) => (
    <div className="flex items-center gap-3">
        <div
            className={`w - 4 h - 4 rounded - full flex items - center justify - center ${isComplete ? 'bg-green-500' : isCurrent ? 'bg-amber-500 animate-pulse' : 'bg-gray-300'
                } `}
        >
            {isComplete && <span className="text-white text-xs">✓</span>}
        </div>
        <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: isCurrent ? 'var(--crimson)' : 'var(--text-primary)' }}>
                {title}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Age {year}</p>
        </div>
    </div>
);

export const StudentCockpit = ({ studentName = "Navigator", onOpenChat }) => {
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [skills] = useState(SAMPLE_SKILLS);

    // Fetch quests from "Remote" (simulated)
    useEffect(() => {
        const loadContent = async () => {
            try {
                const fetchedQuests = await ContentService.getQuests();
                setQuests(fetchedQuests);
            } catch (err) {
                console.error("Failed to load curriculum:", err);
            } finally {
                setLoading(false);
            }
        };
        loadContent();
    }, []);

    const handleAcceptQuest = (questId) => {
        setQuests(prev => prev.map(q =>
            q.id === questId ? { ...q, status: 'active' } : q
        ));
    };

    const handleViewQuest = (questId) => {
        const quest = quests.find(q => q.id === questId);
        if (quest?.content?.resource_url) {
            window.open(quest.content.resource_url, '_blank');
        } else {
            console.log('View quest:', questId);
        }
    };

    const activeQuests = quests.filter(q => q.status === 'active');
    <div className="cockpit-mode h-full overflow-auto p-6" style={{ background: 'var(--bg-app)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Welcome back, {studentName}
                </h1>
                <p className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <Sparkles size={14} style={{ color: 'var(--gold)' }} />
                    {activeQuests.length} active quests • {totalXP.toLocaleString()} total XP
                </p>
            </div>
            <button
                onClick={onOpenChat}
                className="btn-crimson flex items-center gap-2"
            >
                <Compass size={18} />
                Ask Navigator
            </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Skill Tree */}
            <div className="lg:col-span-2">
                <SkillTree skills={skills} onSkillClick={(skill) => console.log('Skill clicked:', skill)} />
            </div>

            {/* Right Column - Path to Victory */}
            <div className="p-6 rounded-2xl space-y-6" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-2 mb-2">
                    <Compass className="text-[#C9B47C]" size={24} style={{ color: 'var(--gold)' }} />
                    <h2 className="text-xl font-bold font-serif" style={{ color: 'var(--text-primary)' }}>Path to Victory</h2>
                </div>

                {/* Reach School Mode: Show Odds Calculator if targeting Ivy/Tier 1 Reach */}
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-white">Target: Stanford</h3>
                            <div className="text-xs text-[#C9B47C] font-bold uppercase tracking-wider">Ivy Plus (Reach)</div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-white">18%</div>
                            <div className="text-xs text-slate-400">Est. Probability</div>
                        </div>
                    </div>

                    {/* The 4 Pillars Visualizer */}
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Academics (GPA 4.0)</span>
                                <span className="text-emerald-400">Strong</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[95%]" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>The Spike (Tier 2)</span>
                                <span className="text-amber-400">Developing</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 w-[60%]" />
                            </div>
                            <div className="text-[10px] text-slate-500 text-right">Needs National Level</div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Narrative & Essays</span>
                                <span className="text-slate-500">Not Started</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-600 w-[0%]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 relative pl-4 border-l-2 border-slate-700 ml-2">
                    {/* Stage 1: High School */}
                    <div className="relative">
                        <span className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#050816]" />
                        <div className="mb-1 flex justify-between items-center">
                            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Stage 1: AP/Honors</h3>
                            <span className="text-emerald-400 text-xs font-bold">In Progress</span>
                        </div>
                        <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Advanced Diploma</div>
                        <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '65%' }} />
                        </div>
                        <div className="mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>GPA: 4.0 UW / 4.3 W</div>
                    </div>

                    {/* Stage 2: The Spike (New for Elite) */}
                    <div className="relative">
                        <span className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-[#C9B47C] animate-pulse border-2 border-[#050816] shadow-[0_0_10px_#C9B47C]" />
                        <div className="mb-1 flex justify-between items-center">
                            <h3 className="font-bold text-sm" style={{ color: 'var(--gold)' }}>Stage 2: Build The Spike</h3>
                            <span className="text-[#C9B47C] text-xs font-bold">Critical</span>
                        </div>
                        <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>National Distinction</div>
                        <div className="p-2 rounded bg-[#C9B47C]/10 border border-[#C9B47C]/30 text-xs text-[#C9B47C]">
                            🎯 Quest: Launch AI Startup
                        </div>
                    </div>

                    {/* Stage 3: Competitive Admit */}
                    <div className="relative opacity-50">
                        <span className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-slate-600 border-2 border-[#050816]" />
                        <div className="mb-1">
                            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Stage 3: Application</h3>
                        </div>
                        <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Apply Early Action</div>
                    </div>
                </div>

                <button
                    className="w-full py-3 rounded-xl bg-[#8B2332]/20 hover:bg-[#8B2332]/30 text-[#C9B47C] text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    style={{ border: '1px solid var(--crimson)' }}
                >
                    <Target size={16} />
                    Analyze My Odds
                </button>
            </div>
        </div>

        {/* Quest Log Section */}
        <div className="mt-6">
            <QuestList
                quests={quests}
                title="Quest Log"
                onAccept={handleAcceptQuest}
                onView={handleViewQuest}
            />
        </div>

        {/* Quick Actions */}
        <div className="mt-6 p-6 rounded-2xl" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { icon: Calendar, label: 'Schedule', desc: 'View calendar' },
                    { icon: Award, label: 'Achievements', desc: '12 unlocked' },
                    { icon: TrendingUp, label: 'Progress Report', desc: 'This semester' },
                    { icon: MapPin, label: 'Find Center', desc: 'Nearest outpost' },
                ].map(({ icon: Icon, label, desc }) => (
                    <button
                        key={label}
                        className="p-4 rounded-xl text-left transition-all hover:scale-105"
                        style={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)'
                        }}
                    >
                        <Icon size={24} style={{ color: 'var(--crimson)' }} className="mb-2" />
                        <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
                    </button>
                ))}
            </div>
        </div>
    </div>
    );
};

export default StudentCockpit;
