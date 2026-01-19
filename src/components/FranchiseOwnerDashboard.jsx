import React, { useState, useEffect } from 'react';
import {
    Users, UserPlus, GraduationCap, BarChart3, Search, Mail,
    ChevronRight, Plus, Target, TrendingUp, Calendar, CheckCircle,
    Clock, AlertCircle, FileText, Wallet
} from 'lucide-react';
import { MagicLinkService, ROLES, ROLE_LABELS } from '../services/MagicLinkService';
import { FranchiseBilling } from './FranchiseBilling';

/**
 * FranchiseOwnerDashboard - Dashboard for Franchise Owners
 * Allows enrollment of students, linking parents, and monitoring progress
 */

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={20} style={{ color }} />
            </div>
            {trend && (
                <span className={`text-xs font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-slate-400">{label}</div>
    </div>
);

const StudentCard = ({ student, onViewDetails, onSendSurvey }) => {
    const statusColors = {
        active: 'bg-green-500/20 text-green-400 border-green-500/30',
        pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        inactive: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    };

    const status = student.onboardingComplete ? 'active' : 'pending';

    return (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B2332] to-[#C9B47C] flex items-center justify-center text-white font-bold text-lg">
                        {student.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                        <h4 className="font-semibold text-white">{student.name}</h4>
                        <p className="text-sm text-slate-400">{student.email}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}>
                    {status === 'active' ? 'Active' : 'Pending Survey'}
                </span>
            </div>

            {student.surveyData && (
                <div className="mb-4 p-3 bg-slate-900/50 rounded-xl">
                    <div className="text-xs text-slate-500 mb-1">Target Path</div>
                    <div className="text-sm text-[#C9B47C]">
                        {student.surveyData.specificMajor || 'Undeclared'} → UC Transfer
                    </div>
                </div>
            )}

            <div className="flex gap-2">
                <button
                    onClick={() => onViewDetails(student)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-700/50 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                    <FileText size={14} />
                    View Details
                </button>
                {!student.onboardingComplete && (
                    <button
                        onClick={() => onSendSurvey(student)}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#C9B47C]/20 text-[#C9B47C] text-sm font-medium hover:bg-[#C9B47C]/30 transition-colors flex items-center justify-center gap-2"
                    >
                        <Mail size={14} />
                        Send Survey
                    </button>
                )}
            </div>
        </div>
    );
};

const EnrollStudentModal = ({ isOpen, onClose, onEnroll, franchiseId }) => {
    const [studentEmail, setStudentEmail] = useState('');
    const [studentName, setStudentName] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);

    const handleEnroll = () => {
        if (!studentEmail.includes('@') || !studentName) {
            setError('Please fill in all required fields');
            return;
        }

        // Create student
        const studentResult = MagicLinkService.createUser(studentEmail, ROLES.STUDENT, franchiseId);
        if (!studentResult.success) {
            setError(studentResult.error);
            return;
        }

        // Update student name
        MagicLinkService.updateUser(studentResult.user.id, { name: studentName });

        // Create parent if provided
        if (parentEmail && parentEmail.includes('@')) {
            const parentResult = MagicLinkService.createUser(parentEmail, ROLES.PARENT, franchiseId);
            if (parentResult.success) {
                MagicLinkService.linkParentToStudent(parentResult.user.id, studentResult.user.id);
            }
        }

        // Send magic link to student
        MagicLinkService.requestMagicLink(studentEmail);

        onEnroll(studentResult.user);
        onClose();
        setStudentEmail('');
        setStudentName('');
        setParentEmail('');
        setStep(1);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-2">Enroll New Student</h3>
                <p className="text-slate-400 text-sm mb-6">Add a student to your franchise and start their journey.</p>

                {step === 1 && (
                    <>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-sm text-slate-400 block mb-2">Student Name *</label>
                                <input
                                    type="text"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9B47C]"
                                    placeholder="Alex Smith"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 block mb-2">Student Email *</label>
                                <input
                                    type="email"
                                    value={studentEmail}
                                    onChange={(e) => setStudentEmail(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9B47C]"
                                    placeholder="student@example.com"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 block mb-2">Parent Email <span className="text-slate-500">(optional)</span></label>
                                <input
                                    type="email"
                                    value={parentEmail}
                                    onChange={(e) => setParentEmail(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9B47C]"
                                    placeholder="parent@example.com"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 rounded-xl bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEnroll}
                                className="flex-1 px-4 py-3 rounded-xl bg-[#8B2332] text-white font-semibold hover:bg-[#a62d40] transition-colors flex items-center justify-center gap-2"
                            >
                                <UserPlus size={16} />
                                Enroll Student
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export const FranchiseOwnerDashboard = ({ ownerName, franchiseId = 'franchise-1', onLogout }) => {
    const [activeTab, setActiveTab] = useState('students');
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showEnrollModal, setShowEnrollModal] = useState(false);

    useEffect(() => {
        // Load students for this franchise
        const allUsers = MagicLinkService.getUsers({ role: ROLES.STUDENT });
        const franchiseStudents = allUsers.filter(u => u.franchiseId === franchiseId);

        if (franchiseStudents.length === 0) {
            // Seed demo data
            MagicLinkService.seedDemoData();
            const refreshed = MagicLinkService.getUsers({ role: ROLES.STUDENT });
            setStudents(refreshed.filter(u => u.franchiseId === franchiseId));
        } else {
            setStudents(franchiseStudents);
        }
    }, [franchiseId]);

    const stats = {
        totalStudents: students.length,
        activeStudents: students.filter(s => s.onboardingComplete).length,
        pendingSurveys: students.filter(s => !s.onboardingComplete).length,
        avgProgress: 72, // Mock data
    };

    const filteredStudents = students.filter(s =>
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleViewDetails = (student) => {
        console.log('View student:', student);
    };

    const handleSendSurvey = (student) => {
        MagicLinkService.requestMagicLink(student.email);
        alert(`Survey link sent to ${student.email}`);
    };

    const handleEnrollStudent = (newStudent) => {
        setStudents(prev => [...prev, newStudent]);
    };

    return (
        <div className="min-h-screen bg-[#050816] text-white">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9B47C] to-[#8B2332] flex items-center justify-center">
                            <GraduationCap size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Franchise Dashboard</h1>
                            <p className="text-xs text-slate-400">{ownerName || 'Franchise Owner'}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('students')}
                            className={`px-4 py-2 rounded-xl text-sm transition-colors ${activeTab === 'students' ? 'bg-[#8B2332] text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                        >
                            Students
                        </button>
                        <button
                            onClick={() => setActiveTab('billing')}
                            className={`px-4 py-2 rounded-xl text-sm transition-colors ${activeTab === 'billing' ? 'bg-[#8B2332] text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                        >
                            Billing
                        </button>
                    </div>
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === 'billing' ? (
                    <FranchiseBilling franchiseId={franchiseId} />
                ) : (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <StatCard icon={Users} label="Total Students" value={stats.totalStudents} color="#C9B47C" />
                            <StatCard icon={CheckCircle} label="Active Learners" value={stats.activeStudents} color="#22c55e" />
                            <StatCard icon={Clock} label="Pending Surveys" value={stats.pendingSurveys} color="#f59e0b" />
                            <StatCard icon={TrendingUp} label="Avg. Progress" value={`${stats.avgProgress}%`} color="#8B2332" trend={5} />
                        </div>

                        {/* Actions Bar */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex-1 relative">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#C9B47C]"
                                />
                            </div>
                            <button
                                onClick={() => setShowEnrollModal(true)}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8B2332] text-white font-semibold hover:bg-[#a62d40] transition-colors"
                            >
                                <Plus size={18} />
                                Enroll Student
                            </button>
                        </div>

                        {/* Student Grid */}
                        {filteredStudents.length === 0 ? (
                            <div className="text-center py-16">
                                <Users size={48} className="mx-auto mb-4 text-slate-600" />
                                <h3 className="text-xl font-semibold text-white mb-2">No Students Yet</h3>
                                <p className="text-slate-400 mb-6">Start building your cohort by enrolling your first student.</p>
                                <button
                                    onClick={() => setShowEnrollModal(true)}
                                    className="px-6 py-3 rounded-xl bg-[#C9B47C] text-slate-900 font-semibold hover:bg-[#b09b63] transition-colors"
                                >
                                    Enroll First Student
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredStudents.map(student => (
                                    <StudentCard
                                        key={student.id}
                                        student={student}
                                        onViewDetails={handleViewDetails}
                                        onSendSurvey={handleSendSurvey}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Enroll Modal */}
            <EnrollStudentModal
                isOpen={showEnrollModal}
                onClose={() => setShowEnrollModal(false)}
                onEnroll={handleEnrollStudent}
                franchiseId={franchiseId}
            />
        </div>
    );
};

export default FranchiseOwnerDashboard;
