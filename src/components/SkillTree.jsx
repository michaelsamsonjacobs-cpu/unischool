import React from 'react';

/**
 * SkillTree - Visual representation of student's academic skills
 * Displays skill categories as a hexagonal/circular layout with levels
 */

const SKILL_CATEGORIES = [
    { id: 'logic', label: 'Logic', icon: '🧮', color: '#1565C0', description: 'Mathematics, Reasoning, Problem Solving' },
    { id: 'rhetoric', label: 'Rhetoric', icon: '📝', color: '#7B1FA2', description: 'Writing, Speaking, Persuasion' },
    { id: 'stem', label: 'STEM', icon: '🔬', color: '#2E7D32', description: 'Science, Technology, Engineering' },
    { id: 'humanities', label: 'Humanities', icon: '📚', color: '#C62828', description: 'History, Philosophy, Literature' },
    { id: 'arts', label: 'Arts', icon: '🎨', color: '#F57C00', description: 'Visual Arts, Music, Design' },
    { id: 'athletics', label: 'Athletics', icon: '⚡', color: '#00838F', description: 'Physical Education, Sports' },
];

const SkillNode = ({ skill, level, xp, maxXp, onClick }) => {
    const percentage = Math.min((xp / maxXp) * 100, 100);
    const isMastered = level >= 20;

    return (
        <button
            onClick={() => onClick?.(skill)}
            className={`skill-node group relative ${isMastered ? 'mastered' : ''}`}
            style={{ '--skill-color': skill.color }}
        >
            {/* Level Badge */}
            <div className="level-badge absolute -top-2 -right-2">
                {level}
            </div>

            {/* Skill Icon */}
            <div
                className="text-4xl mb-2 transition-transform group-hover:scale-110"
                style={{ filter: isMastered ? 'drop-shadow(0 0 8px gold)' : 'none' }}
            >
                {skill.icon}
            </div>

            {/* Skill Name */}
            <h4 className="font-display text-sm font-semibold text-center mb-1" style={{ color: skill.color }}>
                {skill.label}
            </h4>

            {/* XP Bar */}
            <div className="xp-bar w-20">
                <div
                    className="xp-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* XP Text */}
            <span className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {xp}/{maxXp} XP
            </span>

            {/* Hover Tooltip */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{skill.description}</p>
            </div>
        </button>
    );
};

export const SkillTree = ({ skills = {}, onSkillClick }) => {
    // Default skill data if not provided
    const defaultSkills = {
        logic: { level: 8, xp: 450, maxXp: 500 },
        rhetoric: { level: 5, xp: 280, maxXp: 500 },
        stem: { level: 12, xp: 320, maxXp: 500 },
        humanities: { level: 6, xp: 150, maxXp: 500 },
        arts: { level: 3, xp: 80, maxXp: 500 },
        athletics: { level: 4, xp: 200, maxXp: 500 },
    };

    const skillData = { ...defaultSkills, ...skills };

    // Calculate total level
    const totalLevel = Object.values(skillData).reduce((sum, s) => sum + s.level, 0);

    return (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-[#2D2D2D]">
                        Skill Tree
                    </h3>
                    <p className="text-sm text-slate-500">
                        Your academic abilities and progress
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-[#8B2332]">
                        Lvl {totalLevel}
                    </div>
                    <p className="text-xs text-slate-400">
                        Combined Level
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {SKILL_CATEGORIES.map(category => {
                    const skill = skillData[category.id] || { level: 1, xp: 0, maxXp: 500 };
                    const percentage = Math.min((skill.xp / skill.maxXp) * 100, 100);
                    const isMastered = skill.level >= 20;

                    return (
                        <button
                            key={category.id}
                            onClick={() => onSkillClick?.(category)}
                            className="group relative p-5 rounded-2xl bg-white border border-slate-100 hover:border-[#8B2332]/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left overflow-hidden"
                            style={{
                                boxShadow: isMastered ? '0 4px 20px rgba(201, 180, 124, 0.15)' : 'none'
                            }}
                        >
                            {/* Decorative Background Blob */}
                            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: category.color }} />

                            {/* Header */}
                            <div className="relative z-10 flex justify-between items-start mb-4">
                                <div className="text-3xl p-2 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">
                                    {category.icon}
                                </div>
                                <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide ${isMastered ? 'bg-[#C9B47C] text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}>
                                    LVL {skill.level}
                                </div>
                            </div>

                            {/* Title */}
                            <div className="relative z-10">
                                <h4 className="font-serif font-bold text-lg text-[#2D2D2D] mb-1 group-hover:text-[#8B2332] transition-colors">
                                    {category.label}
                                </h4>
                                <p className="text-xs text-slate-400 mb-4 line-clamp-1">{category.description}</p>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative z-10 w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                                    style={{
                                        width: `${percentage}%`,
                                        backgroundColor: isMastered ? '#C9B47C' : category.color
                                    }}
                                />
                            </div>
                            <div className="relative z-10 flex justify-between text-[11px] font-medium text-slate-400">
                                <span>{skill.xp} XP</span>
                                <span>{skill.maxXp}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4 justify-center text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-[#C9B47C]" />
                        XP Progress
                    </span>
                    <span className="flex items-center gap-1">
                        <div className="text-[10px] py-0 px-1 font-bold text-[#C9B47C] bg-[#C9B47C]/10 rounded border border-[#C9B47C]/20">20</div>
                        Mastered
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SkillTree;
