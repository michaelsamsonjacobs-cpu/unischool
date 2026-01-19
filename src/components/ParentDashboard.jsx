import React, { useState, useEffect } from 'react';
import {
    Users, BookOpen, GraduationCap, TrendingUp, AlertCircle,
    CheckCircle, Clock
} from 'lucide-react';
import { MagicLinkService, ROLES } from '../services/MagicLinkService';

/**
 * ParentDashboard.jsx
 * Allows parents to view their child's progress, approve plans, and manage account.
 */
export const ParentDashboard = ({ parentName, onLogout }) => {
    const [children, setChildren] = useState([]);
    const [activeChild, setActiveChild] = useState(null);

    useEffect(() => {
        // In a real app, we'd fetch children linked to this parent ID
        // For demo, we'll find students in the same franchise or just pick a demo student
        const allUsers = MagicLinkService.getUsers();
        const students = allUsers.filter(u => u.role === ROLES.STUDENT);

        // Simulating finding children
        if (students.length > 0) {
            setChildren(students);
            setActiveChild(students[0]);
        }
    }, [parentName]);

    return (
        <div className="min-h-screen bg-[#050816] text-white">
            <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B2332] to-[#C9B47C] flex items-center justify-center">
                            <Users size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold font-serif">University School</h1>
                            <p className="text-xs text-[#C9B47C] font-medium tracking-wider">PARENT PORTAL</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <div className="text-sm font-medium text-white">{parentName}</div>
                            <div className="text-xs text-slate-400">Parent / Guardian</div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {activeChild ? (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Progress for {activeChild.name}</h2>

                        {/* Status Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                        <CheckCircle size={20} className="text-emerald-400" />
                                    </div>
                                    <span className="text-slate-400 font-medium">Academic Status</span>
                                </div>
                                <div className="text-xl font-bold text-white">Good Standing</div>
                                <div className="text-sm text-slate-500 mt-1">On track for graduation</div>
                            </div>

                            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-[#C9B47C]/20 flex items-center justify-center">
                                        <TrendingUp size={20} className="text-[#C9B47C]" />
                                    </div>
                                    <span className="text-slate-400 font-medium">Credits Earned</span>
                                </div>
                                <div className="text-xl font-bold text-white">12 / 24</div>
                                <div className="text-sm text-slate-500 mt-1">50% Completed</div>
                            </div>

                            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                        <AlertCircle size={20} className="text-blue-400" />
                                    </div>
                                    <span className="text-slate-400 font-medium">Pending Approvals</span>
                                </div>
                                <div className="text-xl font-bold text-white">None</div>
                                <div className="text-sm text-slate-500 mt-1">All courses approved</div>
                            </div>
                        </div>

                        {/* Recent Activity Mock */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-xl">
                                    <BookOpen className="mt-1 text-slate-400" size={18} />
                                    <div>
                                        <div className="text-white font-medium">Completed: English 9</div>
                                        <div className="text-sm text-slate-400">Grade: A-</div>
                                    </div>
                                    <span className="ml-auto text-xs text-slate-500">2 days ago</span>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-xl">
                                    <Clock className="mt-1 text-slate-400" size={18} />
                                    <div>
                                        <div className="text-white font-medium">Started: Algebra I</div>
                                        <div className="text-sm text-slate-400">0% Progress</div>
                                    </div>
                                    <span className="ml-auto text-xs text-slate-500">1 week ago</span>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users size={32} className="text-slate-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">No Students Linked</h2>
                        <p className="text-slate-400">Please ask your franchise owner to link your student to your account.</p>
                    </div>
                )}
            </main>
        </div>
    );
};
