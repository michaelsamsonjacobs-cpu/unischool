import React, { useState, useEffect } from 'react';
import { db } from '../services/FirebaseClient';
import { doc, getDoc } from 'firebase/firestore';
import { Trophy, Star, Target, Zap, Clock, BookOpen, ChevronRight, Activity, Calendar, Award, TrendingUp, MapPin, GraduationCap, Compass, ExternalLink, Sparkles, Gamepad2, Play } from 'lucide-react';
import { SkillTree } from './SkillTree';
import { QuestList } from './QuestCard';
import { ContentService } from '../services/ContentService';
import { LectureControlPanel } from './LectureControlPanel';
import { DualCreditVisualizer } from './DualCreditVisualizer';
import { PathwayHub } from './PathwayHub';

const MOCK_STUDENT_ID = 'e7b1c3d9-4f8a-4c2b-9a1d-8e6f7b5c4d3a';

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
            className={`w-4 h-4 rounded-full flex items-center justify-center ${isComplete ? 'bg-emerald-500' : isCurrent ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'
                }`}
        >
            {isComplete && <span className="text-white text-xs">✓</span>}
        </div>
        <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: isCurrent ? '#8B2332' : '#2D2D2D' }}>
                {title}
            </p>
            <p className="text-xs text-slate-400">Age {year}</p>
        </div>
    </div>
);

export const StudentCockpit = ({ studentId = MOCK_STUDENT_ID, studentName = "Navigator", onOpenChat, onOpenXPMissions }) => {
    const [stats, setStats] = useState(null);
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch student profile and quests from Firestore
    useEffect(() => {
        const loadStudentData = async () => {
            try {
                // 1. Fetch user stats from Firestore
                const userDoc = await getDoc(doc(db, 'users', studentId));
                if (userDoc.exists()) {
                    setStats(userDoc.data());
                }

                // 2. Fetch quests
                const fetchedQuests = await ContentService.getQuests();
                setQuests(fetchedQuests);
            } catch (err) {
                console.error("Failed to load student data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadStudentData();
    }, [studentId]);

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

    // Skills derived from Firestore or fallback to mock
    const skills = stats?.skills || SAMPLE_SKILLS;
    const totalXP = stats?.total_xp || 1250;
    const displayName = stats?.full_name || studentName;

    return (
        <div className="h-full overflow-auto p-6 bg-[#FAF8F5] relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-6 border-b border-[#8B2332]/10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 bg-[#8B2332]/10 text-[#8B2332] text-xs font-bold uppercase tracking-widest rounded-full">
                            Student Operator
                        </div>
                        <h1 className="text-4xl font-serif font-bold text-[#2D2D2D]">
                            Hello, {displayName}
                        </h1>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-[#5A5A5A]">
                        <div className="flex items-center gap-2">
                            <Activity size={16} className="text-[#8B2332]" />
                            <span>System Status: <span className="text-[#2E7D32] font-bold">Excellent</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star size={16} className="text-[#F59E0B]" />
                            <span className="font-semibold text-[#2D2D2D]">{totalXP.toLocaleString()} XP</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onOpenChat}
                    className="mt-4 md:mt-0 flex items-center gap-3 bg-[#8B2332] hover:bg-[#a02a3a] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-[0_4px_14px_rgba(139,35,50,0.3)] hover:shadow-[0_6px_20px_rgba(139,35,50,0.4)] hover:-translate-y-0.5"
                >
                    <Compass size={20} />
                    <span>Ask Navigator</span>
                </button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Academic & Pathways */}
                <div className="lg:col-span-2 space-y-6">
                    {/* XP Missions Hero Card */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0A1628] to-[#1a1a2e] text-white relative overflow-hidden shadow-lg">
                        <div className="absolute inset-0 opacity-15">
                            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#C9B47C] blur-[80px]" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-[#8B2332] blur-[60px]" />
                        </div>
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] shadow-lg shadow-purple-500/30">
                                    <Gamepad2 size={28} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold font-serif">XP Missions</h2>
                                    <p className="text-sm text-slate-400 mt-1">Interactive learning adventures — choose your path, discover concepts</p>
                                </div>
                            </div>
                            <button
                                onClick={onOpenXPMissions}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B2332] hover:bg-[#a02a3a] text-white font-bold text-sm transition-all shadow-[0_4px_14px_rgba(139,35,50,0.4)] hover:shadow-[0_6px_20px_rgba(139,35,50,0.5)] hover:-translate-y-0.5"
                            >
                                <Play size={16} />
                                <span>Launch</span>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                        {/* Available mission preview */}
                        <div className="relative mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">⚡</div>
                                    <div>
                                        <p className="text-sm font-semibold">The Wright Problem</p>
                                        <p className="text-xs text-slate-400">PHY-101 · Ch.4: Dynamics & Newton's Laws · 45 min</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C9B47C]/15">
                                    <Zap size={12} className="text-[#C9B47C]" />
                                    <span className="text-xs font-bold text-[#C9B47C]">400+ XP</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The new API-driven Academic Mapping Dashboard */}
                    <DualCreditVisualizer />

                    {/* The new Dynamic Career Pathways Module */}
                    <PathwayHub />
                    {/* AI Lecture Assistant Feed */}
                    <div className="mt-8">
                        <LectureControlPanel courseId="course-101" />
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hidden">
                        <div className="flex items-center gap-3 mb-6">
                            <Target className="text-[#8B2332]" size={24} />
                            <h2 className="text-xl font-bold font-serif text-[#2D2D2D]">Active Quests</h2>
                        </div>
                        {/* Hidden legacy quests */}
                    </div>
                </div>

                {/* Right Column - University Progression */}
                <div className="p-6 rounded-2xl space-y-6 bg-white border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Compass className="text-[#8B2332]" size={24} />
                        <h2 className="text-xl font-bold font-serif text-[#2D2D2D]">University Trajectory</h2>
                    </div>

                    {/* Reach School Mode: Show Odds Calculator if targeting Ivy/Tier 1 Reach */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-[#8B2332] text-lg font-serif">Target: Stanford</h3>
                                <div className="text-xs text-[#C9B47C] font-bold uppercase tracking-wider">Ivy Plus (Reach)</div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-[#2D2D2D]">18%</div>
                                <div className="text-xs text-slate-500 font-medium">Est. Probability</div>
                            </div>
                        </div>

                        {/* The 4 Pillars Visualizer */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-semibold text-slate-600">
                                    <span>Academics (GPA 4.0)</span>
                                    <span className="text-emerald-600">Strong</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-100">
                                    <div className="h-full bg-emerald-500 w-[95%] shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-semibold text-slate-600">
                                    <span>The Spike (Tier 2)</span>
                                    <span className="text-amber-600">Developing</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-100">
                                    <div className="h-full bg-amber-400 w-[60%] shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
                                </div>
                                <div className="text-[10px] text-slate-400 text-right font-medium">Needs National Level</div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-semibold text-slate-600">
                                    <span>Narrative & Essays</span>
                                    <span className="text-slate-400">Not Started</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-100">
                                    <div className="h-full bg-slate-300 w-[5%]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 relative pl-4 border-l-2 border-slate-200 ml-2">
                        {/* Stage 1: High School */}
                        <div className="relative">
                            <span className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                            <div className="mb-1 flex justify-between items-center">
                                <h3 className="font-bold text-sm text-[#2D2D2D]">Stage 1: AP/Honors</h3>
                                <span className="text-emerald-600 text-xs font-bold">In Progress</span>
                            </div>
                            <div className="text-xs mb-2 text-slate-500">Advanced Diploma</div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '65%' }} />
                            </div>
                            <div className="mt-2 text-xs text-slate-400">GPA: 4.0 UW / 4.3 W</div>
                        </div>

                        {/* Stage 2: The Spike (New for Elite) */}
                        <div className="relative">
                            <span className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-[#8B2332] animate-pulse border-2 border-white shadow-[0_0_10px_#8B2332]" />
                            <div className="mb-1 flex justify-between items-center">
                                <h3 className="font-bold text-sm text-[#8B2332]">Stage 2: Build The Spike</h3>
                                <span className="text-[#8B2332] text-xs font-bold">Critical</span>
                            </div>
                            <div className="text-xs mb-2 text-slate-500">National Distinction</div>
                            <div className="p-2 rounded bg-[#8B2332]/5 border border-[#8B2332]/20 text-xs text-[#8B2332] font-semibold">
                                🎯 Quest: Launch AI Startup
                            </div>
                        </div>

                        {/* Stage 3: Competitive Admit */}
                        <div className="relative opacity-50">
                            <span className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-slate-300 border-2 border-white" />
                            <div className="mb-1">
                                <h3 className="font-bold text-sm text-[#2D2D2D]">Stage 3: Application</h3>
                            </div>
                            <div className="text-xs mb-2 text-slate-500">Apply Early Action</div>
                        </div>
                    </div>

                    <button
                        className="w-full py-3 rounded-xl bg-[#8B2332]/5 hover:bg-[#8B2332]/10 text-[#8B2332] text-sm font-bold transition-colors flex items-center justify-center gap-2 border border-[#8B2332]/20"
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
            <div className="mt-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-[#2D2D2D]">
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
                            className="p-4 rounded-xl text-left transition-all hover:scale-105 bg-[#FAF8F5] border border-slate-100 hover:border-[#8B2332]/20 hover:shadow-md"
                        >
                            <Icon size={24} className="mb-2 text-[#8B2332]" />
                            <p className="font-medium text-sm text-[#2D2D2D]">{label}</p>
                            <p className="text-xs text-slate-500">{desc}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentCockpit;
