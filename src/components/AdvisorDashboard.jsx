import React, { useState } from 'react';
import { Users, GraduationCap, AlertCircle, CheckCircle, Search, MessageSquare, BookOpen } from 'lucide-react';

export const AdvisorDashboard = ({ advisorName, onLogout }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Mock Data for "Berkeley Supervised" Students
    const students = [
        { id: 1, name: "Student Alpha", grade: 10, target: "UC Berkeley (EECS)", xp: 12500, status: "On Track", alert: false },
        { id: 2, name: "Student Beta", grade: 9, target: "Stanford (CS)", xp: 8200, status: "Needs Review", alert: true },
        { id: 3, name: "Student Gamma", grade: 11, target: "UCLA (Bio)", xp: 15400, status: "On Track", alert: false },
    ];

    return (
        <div className="flex h-screen bg-[#0f172a] text-slate-100 font-sans overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-[#0a0f1a] border-r border-white/5 flex flex-col p-4">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <img src="/images/unischool-logo.png" alt="UniSchool" className="h-8 w-8 rounded" />
                        <span className="font-serif font-bold text-lg">UniSchool</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-[#C9B47C] font-semibold">
                        GSE Supervision Portal
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="px-3 py-2 bg-[#8B2332]/10 text-[#8B2332] rounded-lg text-sm font-semibold flex items-center gap-2">
                        <Users size={16} /> Student Roster
                    </div>
                    <div className="px-3 py-2 text-slate-400 hover:text-white rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer transition-colors">
                        <BookOpen size={16} /> Curriculum Review
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-2">
                        <div className="h-8 w-8 rounded-full bg-[#C9B47C] flex items-center justify-center text-[#0f172a] font-bold">
                            {advisorName.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-bold">{advisorName}</div>
                            <div className="text-xs text-slate-500">Berkeley Advisor</div>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="mt-4 w-full text-xs text-slate-400 hover:text-white text-center"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-[#0a0f1a] border-b border-white/5 flex items-center justify-between px-6">
                    <h1 className="font-serif text-xl font-bold">Performance Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="bg-[#0f172a] border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-white focus:border-[#C9B47C] outline-none w-64"
                            />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Student List */}
                        <div className="bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-white/10 bg-[#0a0f1a]/50 flex justify-between items-center">
                                <h2 className="font-bold text-white">Active Students</h2>
                                <span className="text-xs bg-[#C9B47C]/10 text-[#C9B47C] px-2 py-1 rounded-full">3 Assigned</span>
                            </div>
                            <div className="divide-y divide-white/5">
                                {students.map(student => (
                                    <div
                                        key={student.id}
                                        className={`p-4 hover:bg-white/5 cursor-pointer transition-colors ${selectedStudent?.id === student.id ? 'bg-white/5' : ''}`}
                                        onClick={() => setSelectedStudent(student)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 font-bold">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white mb-0.5">{student.name}</div>
                                                    <div className="text-xs text-slate-400">Target: {student.target}</div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                {student.alert ? (
                                                    <span className="flex items-center gap-1 text-xs text-red-400 font-bold bg-red-900/20 px-2 py-0.5 rounded">
                                                        <AlertCircle size={12} /> Needs Review
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-xs text-green-400 font-bold bg-green-900/20 px-2 py-0.5 rounded">
                                                        <CheckCircle size={12} /> On Track
                                                    </span>
                                                )}
                                                <span className="text-xs text-[#C9B47C]">Lvl {Math.floor(student.xp / 1000)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detail View */}
                        <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6">
                            {selectedStudent ? (
                                <>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="text-2xl font-serif font-bold text-white mb-1">{selectedStudent.name}</h2>
                                            <p className="text-slate-400 text-sm">Targeting: <span className="text-[#C9B47C] font-semibold">{selectedStudent.target}</span></p>
                                        </div>
                                        <button className="bg-[#8B2332] hover:bg-[#a62b3d] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                            View Full Profile
                                        </button>
                                    </div>

                                    {/* Enrollment / Transfer Plan */}
                                    <div className="mb-8">
                                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Transfer Matrix Plan</h3>
                                        <div className="space-y-3">
                                            <div className="bg-[#0a0f1a] p-3 rounded-lg border border-white/5 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle size={16} className="text-green-500" />
                                                    <div className="text-sm">English Composition (ENGL 1A)</div>
                                                </div>
                                                <span className="text-xs text-slate-500">Completed</span>
                                            </div>
                                            <div className="bg-[#0a0f1a] p-3 rounded-lg border border-white/5 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-4 w-4 rounded-full border-2 border-[#C9B47C]" />
                                                    <div className="text-sm text-white">Calculus I (MATH 1A)</div>
                                                </div>
                                                <span className="text-xs text-[#C9B47C]">Current Quest</span>
                                            </div>
                                            <div className="bg-[#0a0f1a] p-3 rounded-lg border border-white/5 flex justify-between items-center opacity-60">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-4 w-4 rounded-full border-2 border-slate-600" />
                                                    <div className="text-sm">Intro to CS (COMPSCI 61A)</div>
                                                </div>
                                                <span className="text-xs text-slate-500">Planned (Fall)</span>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex justify-end">
                                            <button className="text-xs text-[#C9B47C] hover:underline flex items-center gap-1">
                                                AI Recommended Schedule <CheckCircle size={10} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Intervention */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Advisor Actions</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="bg-white/5 hover:bg-white/10 p-3 rounded-lg text-sm font-medium text-left border border-white/5">
                                                <MessageSquare size={16} className="mb-2 text-[#C9B47C]" />
                                                Message Parent
                                            </button>
                                            <button className="bg-white/5 hover:bg-white/10 p-3 rounded-lg text-sm font-medium text-left border border-white/5">
                                                <GraduationCap size={16} className="mb-2 text-[#8B2332]" />
                                                Modify Transfer Plan
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                                    <Users size={48} className="mb-4 opacity-20" />
                                    <p>Select a student to view their audit.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
