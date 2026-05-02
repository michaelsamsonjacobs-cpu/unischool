import React, { useState, useEffect } from 'react';
import { Gamepad2, Play, Clock, Brain, Trophy, ChevronRight, Lock, Sparkles, Zap, BookOpen, ArrowLeft, Star, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { LocalSessionManager } from '../services/XPSessionService';
import MissionStore from '../services/MissionStore';

// Import demo narrative data
import physicsDemoData from '../data/xp-demo-physics.json';
import econDemoData from '../data/xp-demo-economics.json';
import bioDemoData from '../data/xp-demo-biology.json';
import psyDemoData from '../data/xp-demo-psychology.json';

const sessionManager = new LocalSessionManager();

const BUILT_IN_MISSIONS = [
    { ...physicsDemoData, status: 'available' },
    { ...econDemoData, status: 'available' },
    { ...bioDemoData, status: 'available' },
    { ...psyDemoData, status: 'available' },
];

/**
 * MissionCard — Individual mission display
 */
const MissionCard = ({ mission, sessionData, onLaunch, onResume }) => {
    const narrative = mission.narrative;
    const isCompleted = sessionData?.status === 'completed';
    const isInProgress = sessionData?.status === 'in_progress';
    const isLocked = mission.status === 'locked';
    const conceptCount = narrative?.concept_map?.length || 0;
    const nodeCount = narrative?.total_nodes || narrative?.nodes?.length || 0;

    const statusColors = {
        available: { bg: 'bg-[#8B2332]/10', text: 'text-[#8B2332]', border: 'border-[#8B2332]/20' },
        in_progress: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
        completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' },
        locked: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-300/20' },
    };

    const statusConfig = statusColors[isCompleted ? 'completed' : isInProgress ? 'in_progress' : mission.status] || statusColors.available;

    return (
        <div className={`group relative bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${isLocked ? 'opacity-60' : 'hover:-translate-y-1'} ${statusConfig.border}`}>
            {/* Header Image/Banner */}
            <div className="relative h-40 bg-gradient-to-br from-[#0A1628] via-[#1a1a2e] to-[#16213e] overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 w-32 h-32 rounded-full bg-[#8B2332]/30 blur-3xl" />
                    <div className="absolute bottom-4 right-4 w-24 h-24 rounded-full bg-[#C9B47C]/30 blur-3xl" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <Gamepad2 size={36} className="mx-auto mb-2 text-[#C9B47C]/80" />
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                            {mission.course?.department || 'Academic'} Mission
                        </p>
                    </div>
                </div>
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.text}`}>
                    {isCompleted ? '✓ Completed' : isInProgress ? '▶ In Progress' : isLocked ? '🔒 Locked' : 'Available'}
                </div>
                {/* XP Badge */}
                {!isLocked && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                        <Zap size={12} className="text-[#C9B47C]" />
                        <span className="text-xs font-bold text-[#C9B47C]">
                            {isCompleted ? `${sessionData?.xp_earned || 0} XP earned` : `Up to 400+ XP`}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Course Tag */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                        {mission.course?.id || 'COURSE'}
                    </span>
                    <span className="text-xs text-slate-400">
                        Ch. {mission.chapter?.order || '?'}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#2D2D2D] mb-1 group-hover:text-[#8B2332] transition-colors font-serif">
                    {narrative?.title || 'Untitled Mission'}
                </h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {narrative?.subtitle || mission.chapter?.title}
                </p>

                {/* Stats Row */}
                <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {narrative?.estimated_play_time || mission.chapter?.estimated_play_time || '30 min'}
                    </span>
                    <span className="flex items-center gap-1">
                        <Brain size={12} />
                        {conceptCount} concepts
                    </span>
                    <span className="flex items-center gap-1">
                        <Target size={12} />
                        {nodeCount} scenes
                    </span>
                </div>

                {/* Concept Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                    {(narrative?.concept_map || []).slice(0, 4).map((cm, i) => (
                        <span
                            key={i}
                            className="px-2 py-1 rounded-md bg-[#8B2332]/5 text-[10px] font-medium text-[#8B2332] border border-[#8B2332]/10"
                        >
                            {cm.concept}
                        </span>
                    ))}
                    {(narrative?.concept_map || []).length > 4 && (
                        <span className="px-2 py-1 rounded-md bg-slate-50 text-[10px] font-medium text-slate-400">
                            +{narrative.concept_map.length - 4} more
                        </span>
                    )}
                </div>

                {/* Progress Bar (if in progress) */}
                {isInProgress && sessionData && (
                    <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">Progress</span>
                            <span className="text-amber-600 font-medium">
                                {sessionData.decision_history?.length || 0} decisions made
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all"
                                style={{
                                    width: `${Math.min(100, Math.round(((sessionData.decision_history?.length || 0) / nodeCount) * 100))}%`
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Completed Stats (if completed) */}
                {isCompleted && sessionData && (
                    <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                        <div className="text-center">
                            <div className="text-lg font-bold text-emerald-700">{sessionData.xp_earned || 0}</div>
                            <div className="text-[10px] text-emerald-500">XP</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-emerald-700">{sessionData.decision_history?.length || 0}</div>
                            <div className="text-[10px] text-emerald-500">Decisions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-emerald-700">{sessionData.misconception_hits?.length || 0}</div>
                            <div className="text-[10px] text-emerald-500">Explored</div>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                {isLocked ? (
                    <button disabled className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-400 text-sm font-semibold cursor-not-allowed">
                        <Lock size={16} />
                        Complete prerequisites
                    </button>
                ) : isInProgress ? (
                    <button
                        onClick={() => onResume?.(mission)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold shadow-sm transition-all active:scale-[0.98]"
                    >
                        <Play size={16} />
                        Resume Mission
                        <ChevronRight size={16} />
                    </button>
                ) : isCompleted ? (
                    <button
                        onClick={() => onLaunch?.(mission)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition-all active:scale-[0.98]"
                    >
                        <Trophy size={16} />
                        Play Again
                    </button>
                ) : (
                    <button
                        onClick={() => onLaunch?.(mission)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#8B2332] hover:bg-[#a02a3a] text-white text-sm font-bold shadow-[0_4px_14px_rgba(139,35,50,0.3)] hover:shadow-[0_6px_20px_rgba(139,35,50,0.4)] transition-all active:scale-[0.98]"
                    >
                        <Sparkles size={16} />
                        Begin Mission
                        <ChevronRight size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

/**
 * XPMissionSelect — Browse and launch XP interactive missions
 */
export const XPMissionSelect = ({ studentId = 'guest', onLaunchMission, onBack }) => {
    const [missions, setMissions] = useState(BUILT_IN_MISSIONS);
    const [filter, setFilter] = useState('all');
    const [sessions, setSessions] = useState({});

    // Load session data + stored missions
    useEffect(() => {
        // Merge built-in missions with user-published missions from MissionStore
        const storedMissions = MissionStore.getPublishedMissions();
        const storedLoaded = storedMissions
            .filter(entry => !BUILT_IN_MISSIONS.find(b => b.narrative?.id === entry.id))
            .map(entry => {
                const full = MissionStore.loadMission(entry.id);
                return full ? { ...full, status: 'available' } : null;
            })
            .filter(Boolean);

        setMissions([...BUILT_IN_MISSIONS, ...storedLoaded]);

        const loadedSessions = {};
        [...BUILT_IN_MISSIONS, ...storedLoaded].forEach(m => {
            const narrativeId = m.narrative?.id;
            if (narrativeId) {
                const session = sessionManager.findActiveSession(narrativeId);
                if (session) loadedSessions[narrativeId] = session;
            }
        });
        setSessions(loadedSessions);
    }, []);

    const handleLaunch = (mission) => {
        onLaunchMission?.(mission);
    };

    const handleResume = (mission) => {
        onLaunchMission?.(mission);
    };

    const filteredMissions = missions.filter(m => {
        if (filter === 'all') return true;
        const narrativeId = m.narrative?.id;
        const session = sessions[narrativeId];
        if (filter === 'in_progress') return session?.status === 'in_progress';
        if (filter === 'completed') return session?.status === 'completed';
        if (filter === 'available') return m.status === 'available' && !session;
        return true;
    });

    // Stats
    const totalMissions = missions.length;
    const completedCount = Object.values(sessions).filter(s => s?.status === 'completed').length;
    const inProgressCount = Object.values(sessions).filter(s => s?.status === 'in_progress').length;
    const totalXP = Object.values(sessions).reduce((sum, s) => sum + (s?.xp_earned || 0), 0);

    return (
        <div className="h-full overflow-auto bg-[#FAF8F5]">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            {onBack && (
                                <button
                                    onClick={onBack}
                                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                            )}
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#8B2332] to-[#6B1A27] shadow-lg shadow-[#8B2332]/20">
                                <Gamepad2 size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-serif font-bold text-[#2D2D2D]">XP Missions</h1>
                                <p className="text-sm text-slate-500">Interactive learning adventures</p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="flex gap-4">
                        {[
                            { icon: Star, label: 'Total XP', value: totalXP, color: '#C9B47C' },
                            { icon: Trophy, label: 'Completed', value: `${completedCount}/${totalMissions}`, color: '#10B981' },
                            { icon: TrendingUp, label: 'In Progress', value: inProgressCount, color: '#F59E0B' },
                        ].map(({ icon: Icon, label, value, color }) => (
                            <div key={label} className="text-center px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                                <Icon size={16} className="mx-auto mb-1" style={{ color }} />
                                <div className="text-lg font-bold text-[#2D2D2D]">{value}</div>
                                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description Banner */}
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#0A1628] to-[#1a1a2e] text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#C9B47C] blur-[100px]" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#8B2332] blur-[80px]" />
                    </div>
                    <div className="relative">
                        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <Sparkles size={20} className="text-[#C9B47C]" />
                            Choose Your Adventure
                        </h2>
                        <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                            Each mission transforms real university coursework into an interactive story.
                            Make decisions, explore consequences, and discover the concepts through experience — not memorization.
                            Every path teaches. Even the wrong ones.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {[
                        { key: 'all', label: 'All Missions' },
                        { key: 'available', label: 'Available' },
                        { key: 'in_progress', label: 'In Progress' },
                        { key: 'completed', label: 'Completed' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border
                                ${filter === key
                                    ? 'bg-[#8B2332] text-white border-[#8B2332] shadow-sm'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-[#8B2332]/30 hover:text-[#8B2332]'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Mission Grid */}
                {filteredMissions.length === 0 ? (
                    <div className="text-center py-16">
                        <BookOpen size={48} className="mx-auto mb-4 text-slate-300" />
                        <p className="text-slate-400 text-lg">No missions match this filter</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMissions.map((mission, i) => (
                            <MissionCard
                                key={mission.narrative?.id || i}
                                mission={mission}
                                sessionData={sessions[mission.narrative?.id]}
                                onLaunch={handleLaunch}
                                onResume={handleResume}
                            />
                        ))}
                    </div>
                )}

                {/* ASU Compliance Notice */}
                <div className="mt-12 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                    <AlertTriangle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-amber-800">Academic Compliance Notice</p>
                        <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                            XP Missions supplement your coursework but do not replace official ASU Online assignments,
                            quizzes, or proctored exams. Complete all Canvas-based requirements for full course credit.
                            Your XP progress is tracked separately from your official academic record.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default XPMissionSelect;
