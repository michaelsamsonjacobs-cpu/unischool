import React, { useState } from 'react';
import {
    Compass, Target, Award, Calendar, TrendingUp,
    ChevronRight, Sparkles, GraduationCap, MapPin
} from 'lucide-react';
import { SkillTree } from './SkillTree';
import { QuestCard, QuestList } from './QuestCard';

/**
 * StudentCockpit - Main student dashboard ("The Cockpit")
 * Shows skill tree, active quests, path to victory, and Navigator chat access
 */

// Sample data - in production this comes from backend/local storage
const SAMPLE_QUESTS = [
    {
        id: 'q1',
        title: 'Project Icarus: Build a Drone',
        description: 'Design and construct a quadcopter to master aerodynamics, electronics, and Python programming.',
        type: 'main-quest',
        xpReward: 500,
        timeEstimate: '2 weeks',
        skills: ['Physics', 'Engineering', 'Python'],
        status: 'active',
    },
    {
        id: 'q2',
        title: 'Rhetoric Challenge: Persuasive Essay',
        description: 'Write a 1000-word persuasive essay on a topic of your choice using ethos, pathos, and logos.',
        type: 'side-quest',
        xpReward: 150,
        timeEstimate: '3 hours',
        skills: ['Writing', 'Rhetoric'],
        status: 'available',
    },
    {
        id: 'q3',
        title: 'Calculus Boss Battle: Integration Exam',
        description: 'Prove your mastery of integration techniques in a timed assessment. 80% required to pass.',
        type: 'boss-battle',
        xpReward: 300,
        timeEstimate: '90 min',
        skills: ['Calculus', 'Logic'],
        status: 'available',
    },
    {
        id: 'q4',
        title: 'History Deep Dive: WWII Analysis',
        description: 'Research and present on a key turning point of World War II.',
        type: 'side-quest',
        xpReward: 100,
        timeEstimate: '2 hours',
        skills: ['History', 'Research'],
        status: 'available',
    },
];

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
            className={`w-4 h-4 rounded-full flex items-center justify-center ${isComplete ? 'bg-green-500' : isCurrent ? 'bg-amber-500 animate-pulse' : 'bg-gray-300'
                }`}
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
    const [quests, setQuests] = useState(SAMPLE_QUESTS);
    const [skills] = useState(SAMPLE_SKILLS);

    const handleAcceptQuest = (questId) => {
        setQuests(prev => prev.map(q =>
            q.id === questId ? { ...q, status: 'active' } : q
        ));
    };

    const handleViewQuest = (questId) => {
        // In production, navigate to quest detail view
        console.log('View quest:', questId);
    };

    const activeQuests = quests.filter(q => q.status === 'active');
    const totalXP = Object.values(skills).reduce((sum, s) => sum + s.xp + (s.level - 1) * 500, 0);

    return (
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
                <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center gap-2 mb-4">
                        <Target size={20} style={{ color: 'var(--crimson)' }} />
                        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                            Path to Victory
                        </h3>
                    </div>

                    {/* Target */}
                    <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(139, 35, 50, 0.1)', border: '1px solid var(--crimson)' }}>
                        <div className="flex items-center gap-2 mb-2">
                            <GraduationCap size={16} style={{ color: 'var(--crimson)' }} />
                            <span className="text-xs font-semibold uppercase" style={{ color: 'var(--crimson)' }}>
                                Target
                            </span>
                        </div>
                        <h4 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                            UC Berkeley
                        </h4>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Computer Science, Class of 2030
                        </p>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-4 relative before:absolute before:left-[7px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-200">
                        <PathMilestone year={14} title="Complete Pre-Algebra" isComplete={true} />
                        <PathMilestone year={15} title="AP Computer Science A" isComplete={true} />
                        <PathMilestone year={16} title="Calculus BC + Physics" isCurrent={true} />
                        <PathMilestone year={17} title="Community College Transfer Credits" />
                        <PathMilestone year={18} title="UC TAG Application" />
                        <PathMilestone year={19} title="🎓 Graduate with CS Degree" />
                    </div>

                    {/* Stats */}
                    <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-4" style={{ borderColor: 'var(--border-subtle)' }}>
                        <div className="text-center">
                            <div className="text-2xl font-bold" style={{ color: 'var(--gold)' }}>2.5</div>
                            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Years Ahead</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold" style={{ color: 'var(--accent-success)' }}>94%</div>
                            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>On Track</p>
                        </div>
                    </div>
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
