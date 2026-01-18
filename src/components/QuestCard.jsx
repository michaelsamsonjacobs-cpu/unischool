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
            className={cardClass}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <DifficultyIcon
                        size={18}
                        style={{ color: difficulty.color }}
                    />
                    <span
                        className="text-xs font-semibold uppercase tracking-wide"
                        style={{ color: difficulty.color }}
                    >
                        {difficulty.label}
                    </span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(201, 180, 124, 0.15)' }}>
                    <Zap size={12} style={{ color: 'var(--gold)' }} />
                    <span className="text-xs font-bold" style={{ color: 'var(--gold-dark)' }}>
                        +{xpReward} XP
                    </span>
                </div>
            </div>

            {/* Title & Description */}
            <h4 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                {title}
            </h4>
            <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                {description}
            </p>

            {/* Skills & Time */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                    {skills.slice(0, 3).map((skill, i) => (
                        <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                                background: 'var(--bg-surface)',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            {skill}
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    <Clock size={12} />
                    {timeEstimate}
                </div>
            </div>

            {/* Actions */}
            {status === 'available' && (
                <div className="flex gap-2">
                    <button
                        onClick={() => onAccept?.(id)}
                        className="btn-quest flex-1 flex items-center justify-center gap-2"
                    >
                        Accept Mission
                        <ChevronRight size={16} />
                    </button>
                    {onDecline && (
                        <button
                            onClick={() => onDecline?.(id)}
                            className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                            style={{
                                background: 'var(--bg-surface)',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border-subtle)'
                            }}
                        >
                            Skip
                        </button>
                    )}
                </div>
            )}

            {status === 'active' && (
                <button
                    onClick={() => onView?.(id)}
                    className="btn-crimson w-full flex items-center justify-center gap-2"
                >
                    Continue Quest
                    <ChevronRight size={16} />
                </button>
            )}

            {status === 'completed' && (
                <div className="flex items-center justify-center gap-2 py-2 text-sm font-semibold" style={{ color: 'var(--accent-success)' }}>
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
        <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {title}
                </h3>
                <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {filteredQuests.length} quests
                </span>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {['all', 'active', 'available', 'main-quest', 'side-quest'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
                        style={{
                            background: filter === f ? 'var(--crimson)' : 'var(--bg-surface)',
                            color: filter === f ? 'white' : 'var(--text-secondary)',
                            border: `1px solid ${filter === f ? 'var(--crimson)' : 'var(--border-subtle)'}`,
                        }}
                    >
                        {f.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </button>
                ))}
            </div>

            {/* Quest List */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {filteredQuests.length === 0 ? (
                    <div className="text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
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
