import React, { useState, useEffect } from 'react';
import {
    Users, GraduationCap, AlertCircle, CheckCircle, Search,
    MessageSquare, BookOpen, ShieldAlert, Sparkles, FileText, Plus, Brain
} from 'lucide-react';
import { SupportTicketQueue } from './SupportTicketQueue';
import { db } from '../services/FirebaseClient';
import { LectureControlPanel } from './LectureControlPanel';
import { LectureAssistantService } from '../services/LectureAssistantService';
import { collection, getDocs, doc, query, where, updateDoc } from 'firebase/firestore';

/**
 * AdvisorDashboard - GSE Supervision Portal
 * Berkeley advisors use this to monitor student progress and handle escalations.
 */
export const AdvisorDashboard = ({ advisorName, franchiseId = 'franchise-1', centerId = 'center-1', onLogout }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [activeTab, setActiveTab] = useState('roster');
    const [students, setStudents] = useState([
        { id: 1, name: "Student Alpha", grade: 10, target: "UC Berkeley (EECS)", xp: 12500, status: "On Track", alert: false },
        { id: 2, name: "Student Beta", grade: 9, target: "Stanford (CS)", xp: 8200, status: "Needs Review", alert: true },
        { id: 3, name: "Student Gamma", grade: 11, target: "UCLA (Bio)", xp: 15400, status: "On Track", alert: false },
    ]);

    const handleUploadSyllabus = async () => {
        try {
            // Trigger the AI parsing flow
            await LectureAssistantService.processSyllabus('course-101', 'Mock Syllabus Content for Macroeconomics 101');
            alert("Syllabus uploaded and AI parsing initiated. Hot Folder will be populated shortly.");
        } catch (err) {
            console.error("Syllabus upload failed:", err);
            alert("Failed to upload syllabus.");
        }
    };

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
                    <button
                        onClick={() => setActiveTab('roster')}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${activeTab === 'roster' ? 'bg-[#8B2332]/20 text-[#8B2332] border border-[#8B2332]/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Users size={16} /> Student Roster
                    </button>
                    <button
                        onClick={() => setActiveTab('escalations')}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${activeTab === 'escalations' ? 'bg-[#8B2332]/20 text-[#8B2332] border border-[#8B2332]/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <ShieldAlert size={16} /> Escalation Queue
                    </button>
                    <button className="w-full px-3 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                        <BookOpen size={16} /> Curriculum Review
                    </button>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-2">
                        <div className="h-8 w-8 rounded-full bg-[#C9B47C] flex items-center justify-center text-[#0f172a] font-bold">
                            {advisorName?.charAt(0) || 'A'}
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
                    <h1 className="font-serif text-xl font-bold">
                        {activeTab === 'roster' ? 'Advisor Cockpit' : 'Escalations'}
                    </h1>
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
                    {activeTab === 'escalations' ? (
                        <div className="max-w-4xl mx-auto">
                            <SupportTicketQueue franchiseId={franchiseId} centerId={centerId} />
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Top Row: Roster & Lecture Assistant */}
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                <div className="lg:col-span-1 space-y-6">
                                    {/* Course Setup Trigger */}
                                    <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/10 shadow-sm">
                                        <h3 className="font-bold text-white flex items-center gap-2 mb-4">
                                            <Sparkles size={18} className="text-[#C9B47C]" />
                                            AI Assistant Setup
                                        </h3>
                                        <div className="space-y-4">
                                            <button
                                                onClick={handleUploadSyllabus}
                                                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#8B2332]/20 border border-[#8B2332]/40 text-white font-semibold hover:bg-[#8B2332]/30 transition-all"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <FileText size={16} className="text-[#8B2332]" />
                                                    <span>Upload Syllabus</span>
                                                </div>
                                                <Plus size={16} />
                                            </button>
                                            <p className="text-[10px] text-slate-400 italic">Triggers AI Parsing & Hot Folder population</p>
                                        </div>
                                    </div>

                                    {/* Student List Sidebar */}
                                    <div className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden">
                                        <div className="p-4 border-b border-white/10 bg-[#0a0f1a]/50 flex justify-between items-center">
                                            <h2 className="font-bold text-white text-sm">Students</h2>
                                            <span className="text-[10px] bg-[#C9B47C]/10 text-[#C9B47C] px-2 py-1 rounded-full">{students.length} Assigned</span>
                                        </div>
                                        <div className="divide-y divide-white/5">
                                            {students.map(student => (
                                                <div
                                                    key={student.id}
                                                    className={`p-4 hover:bg-white/5 cursor-pointer transition-colors ${selectedStudent?.id === student.id ? 'bg-white/5' : ''}`}
                                                    onClick={() => setSelectedStudent(student)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 font-bold text-xs">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-bold text-white text-sm truncate">{student.name}</div>
                                                            <div className="text-[10px] text-slate-500 truncate">{student.target}</div>
                                                        </div>
                                                        {student.alert && <AlertCircle size={14} className="text-red-400" />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Lecture Assistant Main Panel */}
                                <div className="lg:col-span-3">
                                    <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 h-full">
                                        <LectureControlPanel courseId="course-101" />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Selected Student Detail / Audit */}
                            {selectedStudent && (
                                <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-8">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h2 className="text-3xl font-serif font-bold text-white mb-2">{selectedStudent.name}</h2>
                                            <div className="flex gap-4 text-sm">
                                                <span className="text-slate-400">Target: <span className="text-[#C9B47C] font-semibold">{selectedStudent.target}</span></span>
                                                <span className="text-slate-400">Total XP: <span className="text-white font-bold">{selectedStudent.xp.toLocaleString()}</span></span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                                                Full Profile
                                            </button>
                                            <button className="bg-[#8B2332] hover:bg-[#a62b3d] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                                                Intervention
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Transfer Matrix / Progress */}
                                        <div className="space-y-6">
                                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Academic Transfer Plan</h3>
                                            <div className="space-y-3">
                                                <div className="bg-[#0a0f1a] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <CheckCircle size={18} className="text-green-500" />
                                                        <div className="text-sm">English Composition (ENGL 1A)</div>
                                                    </div>
                                                    <span className="text-xs text-slate-500">A</span>
                                                </div>
                                                <div className="bg-[#0a0f1a] p-4 rounded-xl border border-white/5 flex justify-between items-center ring-1 ring-[#C9B47C]/30">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-5 w-5 rounded-full border-2 border-[#C9B47C] animate-pulse" />
                                                        <div className="text-sm text-white">Calculus I (MATH 1A)</div>
                                                    </div>
                                                    <span className="text-xs text-[#C9B47C] font-bold">IN PROGRESS</span>
                                                </div>
                                                <div className="bg-[#0a0f1a] p-4 rounded-xl border border-white/5 flex justify-between items-center opacity-40">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-5 w-5 rounded-full border-2 border-slate-600" />
                                                        <div className="text-sm">Intro to CS (COMPSCI 61A)</div>
                                                    </div>
                                                    <span className="text-xs text-slate-500">PLANNED</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Insights / Comms */}
                                        <div className="space-y-6">
                                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Performance Insights</h3>
                                            <div className="p-5 rounded-xl bg-[#C9B47C]/5 border border-[#C9B47C]/20">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Brain size={18} className="text-[#C9B47C]" />
                                                    <span className="font-bold text-sm text-[#C9B47C]">Navigator Prediction</span>
                                                </div>
                                                <p className="text-sm text-slate-300 leading-relaxed italic">
                                                    "Student exhibits strong retention in macroeconomics principles but shows signs of struggle with calculus derivative proofs. Recommend supplemental practice via the Tutor AI."
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3">
                                                <button className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-sm font-medium">
                                                    <MessageSquare size={18} className="text-[#8B2332]" />
                                                    Send Intervention Email
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
