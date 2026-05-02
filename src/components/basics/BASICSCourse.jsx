import React, { useState, useEffect } from 'react';
import {
    BookOpen, CheckCircle, Lock, ChevronRight, Users, Calendar, Video,
    FileText, TrendingUp, Rocket, Award, Play, ArrowRight, Clock,
    Star, Target, BarChart3, Sparkles, ExternalLink
} from 'lucide-react';

/**
 * BASICSCourse — The 8-lecture BASICS accelerator course with gated progression.
 *
 * Lectures:
 * 1. Problem & Market
 * 2. AI Products
 * 3. Sales
 * 4. Marketing / Partnerships
 * 5. Running The Numbers
 * 6. Customer Discovery (GATED: 20 calendared ICP meetings)
 * 7. VCs and Funding
 * 8. Pitch Day Prep
 *
 * Each lecture has assignments that must be completed to unlock the next.
 * Course completion unlocks data room → incorporation → investor section.
 */

const LECTURES = [
    {
        id: 1,
        title: 'Problem & Market',
        subtitle: 'Find the pain. Size the opportunity.',
        icon: Target,
        color: '#3b82f6',
        assignments: [
            { id: 'pm-1', title: 'Write your problem statement', type: 'document' },
            { id: 'pm-2', title: 'TAM/SAM/SOM analysis', type: 'spreadsheet' },
            { id: 'pm-3', title: 'Customer persona canvas', type: 'document' },
        ],
    },
    {
        id: 2,
        title: 'AI Products',
        subtitle: 'Build something people want — with AI.',
        icon: Sparkles,
        color: '#8b5cf6',
        assignments: [
            { id: 'ai-1', title: 'Product spec document', type: 'document' },
            { id: 'ai-2', title: 'AI feature breakdown', type: 'document' },
            { id: 'ai-3', title: 'MVP demo or prototype', type: 'link' },
        ],
    },
    {
        id: 3,
        title: 'Sales',
        subtitle: 'Revenue is the only real validation.',
        icon: TrendingUp,
        color: '#10b981',
        assignments: [
            { id: 's-1', title: 'Sales strategy document', type: 'document' },
            { id: 's-2', title: 'Pricing model', type: 'spreadsheet' },
            { id: 's-3', title: 'First customer acquisition plan', type: 'document' },
        ],
    },
    {
        id: 4,
        title: 'Marketing & Partnerships',
        subtitle: 'Distribution is king. Build your channels.',
        icon: Users,
        color: '#f59e0b',
        assignments: [
            { id: 'mp-1', title: 'Go-to-market strategy', type: 'document' },
            { id: 'mp-2', title: 'Partnership outreach list', type: 'spreadsheet' },
            { id: 'mp-3', title: 'Content/brand strategy', type: 'document' },
        ],
    },
    {
        id: 5,
        title: 'Running The Numbers',
        subtitle: 'Unit economics. Financial model. Burn rate.',
        icon: BarChart3,
        color: '#ec4899',
        assignments: [
            { id: 'rn-1', title: 'Financial model (3-year)', type: 'spreadsheet' },
            { id: 'rn-2', title: 'Unit economics breakdown', type: 'document' },
            { id: 'rn-3', title: 'Funding requirements analysis', type: 'document' },
        ],
    },
    {
        id: 6,
        title: 'Customer Discovery',
        subtitle: 'Talk to 20 potential customers. Calendar required.',
        icon: Calendar,
        color: '#0ea5e9',
        isGated: true,
        gateType: 'customer_discovery',
        gateCount: 20,
        gateLabel: '20 Customer Discovery Meetings',
        assignments: [
            { id: 'cd-1', title: 'Customer interview notes (20 conversations)', type: 'document' },
            { id: 'cd-2', title: 'Key insights & pivots report', type: 'document' },
            { id: 'cd-3', title: 'Updated problem-solution fit', type: 'document' },
        ],
    },
    {
        id: 7,
        title: 'VCs and Funding',
        subtitle: 'Understand term sheets, SAFEs, and the game.',
        icon: Rocket,
        color: '#f97316',
        assignments: [
            { id: 'vc-1', title: 'Investor target list (30 Berkeley investors)', type: 'spreadsheet' },
            { id: 'vc-2', title: 'Pitch deck (final version)', type: 'document' },
            { id: 'vc-3', title: 'Executive summary', type: 'document' },
        ],
    },
    {
        id: 8,
        title: 'Pitch Day Prep',
        subtitle: 'Record your pitch. Fill your data room. Launch.',
        icon: Award,
        color: '#dc2626',
        assignments: [
            { id: 'pd-1', title: 'Record pitch video', type: 'video' },
            { id: 'pd-2', title: 'Complete data room', type: 'checklist' },
            { id: 'pd-3', title: 'Pitch rehearsal sign-off', type: 'document' },
        ],
    },
];

export const BASICSCourse = ({ student, onOpenDataRoom, onOpenRecorder, onOpenCalendar, onBack }) => {
    // In production, progress would come from Supabase/Firebase
    const [progress, setProgress] = useState(() => {
        const saved = localStorage.getItem(`basics_progress_${student?.email}`);
        return saved ? JSON.parse(saved) : { completedAssignments: [], unlockedLectures: [1], calendarMeetings: { customer_discovery: 0, investor: 0 } };
    });

    const [activeLecture, setActiveLecture] = useState(null);

    useEffect(() => {
        localStorage.setItem(`basics_progress_${student?.email}`, JSON.stringify(progress));
    }, [progress, student]);

    const isLectureUnlocked = (lectureId) => progress.unlockedLectures.includes(lectureId);

    const isLectureComplete = (lecture) => {
        return lecture.assignments.every(a => progress.completedAssignments.includes(a.id));
    };

    const getLectureProgress = (lecture) => {
        const completed = lecture.assignments.filter(a => progress.completedAssignments.includes(a.id)).length;
        return { completed, total: lecture.assignments.length, percent: Math.round((completed / lecture.assignments.length) * 100) };
    };

    const isGateMet = (lecture) => {
        if (!lecture.isGated) return true;
        return (progress.calendarMeetings[lecture.gateType] || 0) >= lecture.gateCount;
    };

    const toggleAssignment = (assignmentId, lectureId) => {
        setProgress(prev => {
            const completed = prev.completedAssignments.includes(assignmentId)
                ? prev.completedAssignments.filter(id => id !== assignmentId)
                : [...prev.completedAssignments, assignmentId];

            // Check if this lecture is now complete → unlock next
            const lecture = LECTURES.find(l => l.id === lectureId);
            const allDone = lecture.assignments.every(a => completed.includes(a.id));
            let unlocked = [...prev.unlockedLectures];
            if (allDone && lectureId < 8 && !unlocked.includes(lectureId + 1)) {
                const nextLecture = LECTURES.find(l => l.id === lectureId + 1);
                // Check if next lecture has a gate
                if (!nextLecture.isGated || (prev.calendarMeetings[nextLecture.gateType] || 0) >= nextLecture.gateCount) {
                    unlocked.push(lectureId + 1);
                }
            }

            return { ...prev, completedAssignments: completed, unlockedLectures: unlocked };
        });
    };

    const overallProgress = Math.round(
        (progress.completedAssignments.length / LECTURES.reduce((sum, l) => sum + l.assignments.length, 0)) * 100
    );
    const courseComplete = overallProgress === 100;

    return (
        <div className="min-h-screen bg-[#FAF8F5]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#003262] to-[#001a3d] text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={onBack} className="text-white/50 hover:text-white text-sm flex items-center gap-1 transition-colors">
                            ← Back
                        </button>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-white/40 uppercase tracking-wider font-bold">
                                {student?.name || student?.email}
                            </span>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                        BASICS <span className="text-[#C9B47C]">Course</span>
                    </h1>
                    <p className="text-white/50 text-sm mb-6">
                        Complete all 8 lectures to unlock your data room and investor section.
                    </p>

                    {/* Overall progress bar */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#C9B47C] to-[#f59e0b] rounded-full transition-all duration-500"
                                style={{ width: `${overallProgress}%` }}
                            />
                        </div>
                        <span className="text-sm font-bold text-[#C9B47C]">{overallProgress}%</span>
                    </div>

                    {courseComplete && (
                        <div className="mt-4 flex items-center gap-4">
                            <button
                                onClick={onOpenDataRoom}
                                className="bg-[#C9B47C] hover:bg-[#b8a56d] text-[#001a3d] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                            >
                                <FileText size={14} /> Open Data Room
                            </button>
                            <button
                                onClick={onOpenRecorder}
                                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                            >
                                <Video size={14} /> Record Pitch Video
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Lecture Grid */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {LECTURES.map((lecture) => {
                        const unlocked = isLectureUnlocked(lecture.id);
                        const complete = isLectureComplete(lecture);
                        const prog = getLectureProgress(lecture);
                        const gateMet = isGateMet(lecture);
                        const Icon = lecture.icon;

                        return (
                            <button
                                key={lecture.id}
                                onClick={() => unlocked && setActiveLecture(lecture)}
                                disabled={!unlocked}
                                className={`relative p-5 rounded-2xl border text-left transition-all ${
                                    complete
                                        ? 'bg-green-50 border-green-200 shadow-sm'
                                        : unlocked
                                            ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg cursor-pointer'
                                            : 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'
                                } ${activeLecture?.id === lecture.id ? 'ring-2 ring-[#003262]/30 shadow-lg' : ''}`}
                            >
                                {/* Lecture number */}
                                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
                                    {lecture.id}
                                </div>

                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${complete ? 'bg-green-500' : 'bg-slate-100'}`}
                                    style={!complete ? { background: `${lecture.color}15` } : {}}>
                                    {complete ? (
                                        <CheckCircle size={18} className="text-white" />
                                    ) : unlocked ? (
                                        <Icon size={18} style={{ color: lecture.color }} />
                                    ) : (
                                        <Lock size={16} className="text-slate-300" />
                                    )}
                                </div>

                                <h3 className="font-bold text-sm text-[#2D2D2D] mb-1">{lecture.title}</h3>
                                <p className="text-xs text-slate-400 mb-3 leading-relaxed">{lecture.subtitle}</p>

                                {unlocked && !complete && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all" style={{ width: `${prog.percent}%`, background: lecture.color }} />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400">{prog.completed}/{prog.total}</span>
                                    </div>
                                )}

                                {lecture.isGated && !gateMet && (
                                    <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                                        <Calendar size={10} />
                                        {lecture.gateLabel} required
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Active Lecture Detail */}
                {activeLecture && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${activeLecture.color}15` }}>
                                        <activeLecture.icon size={20} style={{ color: activeLecture.color }} />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lecture {activeLecture.id}</span>
                                        <h2 className="text-xl font-bold text-[#2D2D2D]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                            {activeLecture.title}
                                        </h2>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500">{activeLecture.subtitle}</p>
                            </div>
                            <button onClick={() => setActiveLecture(null)} className="text-slate-300 hover:text-slate-500 transition-colors text-lg">✕</button>
                        </div>

                        {/* Gate warning */}
                        {activeLecture.isGated && !isGateMet(activeLecture) && (
                            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                                <Calendar size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-sm text-amber-800 mb-1">Calendar Gate: {activeLecture.gateLabel}</p>
                                    <p className="text-xs text-amber-600 mb-3">
                                        You've scheduled {progress.calendarMeetings[activeLecture.gateType] || 0} of {activeLecture.gateCount} required meetings.
                                    </p>
                                    <button
                                        onClick={onOpenCalendar}
                                        className="text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                                    >
                                        <Calendar size={12} /> Open Calendar Integration
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Assignments list */}
                        <div className="space-y-3">
                            {activeLecture.assignments.map((assignment) => {
                                const done = progress.completedAssignments.includes(assignment.id);
                                const isVideo = assignment.type === 'video';
                                return (
                                    <div key={assignment.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${done ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}>
                                        <button
                                            onClick={() => toggleAssignment(assignment.id, activeLecture.id)}
                                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${done ? 'bg-green-500 border-green-500' : 'border-slate-300 hover:border-slate-400'}`}
                                        >
                                            {done && <CheckCircle size={14} className="text-white" />}
                                        </button>
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${done ? 'text-green-700 line-through' : 'text-[#2D2D2D]'}`}>
                                                {assignment.title}
                                            </p>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{assignment.type}</span>
                                        </div>
                                        {isVideo && (
                                            <button
                                                onClick={onOpenRecorder}
                                                className="text-xs font-bold text-[#003262] bg-[#003262]/5 hover:bg-[#003262]/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                            >
                                                <Video size={12} /> Record
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
