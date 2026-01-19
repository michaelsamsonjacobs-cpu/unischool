import React, { useState } from 'react';
import { Clock, Star, Zap, BookOpen, Trophy, ChevronRight } from 'lucide-react';

/**
 * QuestCard - Individual quest display with accept/decline actions
 * Types: side-quest (gold), main-quest (crimson), boss-battle (dark crimson)
 */

const DIFFICULTY_ICONS = {
    'side-quest': { icon: Star, label: 'Side Quest', color: 'var(--gold)' },
    'main-quest': { icon: BookOpen, label: 'Main Quest', color: 'var(--crimson)' },
    'boss-battle': { icon: Trophy, label: 'Boss Battle', color: 'var(--crimson-dark)' },
};

export const QuestCard = ({
    id,
    title,
    description,
    type = 'side-quest',
    xpReward = 100,
    timeEstimate = '30 min',
    skills = [],
    status = 'available', // available, active, completed
    onAccept,
    onDecline,
    onView,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const difficulty = DIFFICULTY_ICONS[type] || DIFFICULTY_ICONS['side-quest'];
    const DifficultyIcon = difficulty.icon;

    const cardClass = `quest-card ${type} ${status === 'completed' ? 'opacity-60' : ''}`;

    return (
        <div
            className={`group p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer bg-white border-slate-200 hover:border-[#8B2332]/30 ${type === 'boss-battle' ? 'border-red-200 bg-red-50/30' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <DifficultyIcon
                        size={18}
                        className={type === 'main-quest' ? 'text-[#8B2332]' : type === 'boss-battle' ? 'text-red-700' : 'text-[#C9B47C]'}
                    />
                    <span
                        className={`text-xs font-semibold uppercase tracking-wide ${type === 'main-quest' ? 'text-[#8B2332]' : type === 'boss-battle' ? 'text-red-700' : 'text-[#C9B47C]'}`}
                    >
                        {difficulty.label}
                    </span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#C9B47C]/10">
                    <Zap size={12} className="text-[#C9B47C]" />
                    <span className="text-xs font-bold text-[#b09650]">
                        +{xpReward} XP
                    </span>
                </div>
            </div>

            {/* Title & Description */}
            <h4 className="font-display text-lg font-semibold mb-2 text-[#2D2D2D] group-hover:text-[#8B2332] transition-colors">
                {title}
            </h4>
            <p className="text-sm mb-4 line-clamp-2 text-slate-500">
                {description}
            </p>

            {/* Skills & Time */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                    {skills.slice(0, 3).map((skill, i) => (
                        <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-500 font-medium"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={12} />
                    {timeEstimate}
                </div>
            </div>

            {/* Actions */}
            {status === 'available' && (
                <div className="flex gap-2">
                    <button
                        onClick={() => onAccept?.(id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#8B2332] text-white text-sm font-bold shadow-sm hover:bg-[#7a1e2b] transition-colors"
                    >
                        Accept Mission
                        <ChevronRight size={16} />
                    </button>
                    {onDecline && (
                        <button
                            onClick={() => onDecline?.(id)}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200"
                        >
                            Skip
                        </button>
                    )}
                </div>
            )}

            {status === 'active' && (
                <button
                    onClick={() => onView?.(id)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors"
                >
                    Continue Quest
                    <ChevronRight size={16} />
                </button>
            )}

            {status === 'completed' && (
                <div className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-emerald-600">
                    <Trophy size={16} />
                    Quest Complete!
                </div>
            )}
        </div>
    );
};

/**
 * QuestList - Container for multiple quests with filtering
 */
export const QuestList = ({ quests = [], title = "Quest Log", onAccept, onDecline, onView }) => {
    const [filter, setFilter] = useState('all');

    const filteredQuests = quests.filter(q => {
        if (filter === 'all') return true;
        if (filter === 'active') return q.status === 'active';
        if (filter === 'available') return q.status === 'available';
        return q.type === filter;
    });

    return (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#2D2D2D]">
                    {title}
                </h3>
                <span className="text-sm text-slate-400">
                    {filteredQuests.length} quests
                </span>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {['all', 'active', 'available', 'main-quest', 'side-quest'].map((f) => {
                    const isActive = filter === f;
                    const activeStyle = isActive
                        ? 'bg-[#8B2332] text-white border-[#8B2332] shadow-sm'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100';

                    return (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${activeStyle}`}
                        >
                            {f.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </button>
                    )
                })}
            </div>

            {/* Quest List */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredQuests.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
                        <p>No quests available</p>
                    </div>
                ) : (
                    filteredQuests.map((quest) => (
                        <QuestCard
                            key={quest.id}
                            {...quest}
                            onAccept={onAccept}
                            onDecline={onDecline}
                            onView={onView}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default QuestCard;
