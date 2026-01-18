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
        <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        Skill Tree
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Your academic abilities and progress
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: 'var(--crimson)' }}>
                        Lvl {totalLevel}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        Combined Level
                    </p>
                </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
                {SKILL_CATEGORIES.map((skill) => (
                    <SkillNode
                        key={skill.id}
                        skill={skill}
                        level={skillData[skill.id]?.level || 1}
                        xp={skillData[skill.id]?.xp || 0}
                        maxXp={skillData[skill.id]?.maxXp || 500}
                        onClick={onSkillClick}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-4 justify-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    <span className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ background: 'var(--gold)' }} />
                        XP Progress
                    </span>
                    <span className="flex items-center gap-1">
                        <div className="level-badge text-[10px] py-0 px-1 h-5 min-w-5">20</div>
                        Mastered
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SkillTree;
