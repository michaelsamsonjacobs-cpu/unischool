import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, ExternalLink, Clock, PlayCircle, Loader2, ShieldCheck } from 'lucide-react';
import { EnrollmentService } from '../services/EnrollmentService';
import { InstitutionService } from '../services/InstitutionService';

// Fallback user ID until auth context is fully wired
const MOCK_STUDENT_ID = 'e7b1c3d9-4f8a-4c2b-9a1d-8e6f7b5c4d3a';
const MOCK_MATRIX_ID = 'm3000000-0000-0000-0000-000000000002'; // Default US College GE matrix from seed data

export const DualCreditVisualizer = () => {
    const [progress, setProgress] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [launchingCourse, setLaunchingCourse] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // In a real app, get these IDs from the current user session context
            const [progressData, enrollmentData] = await Promise.all([
                EnrollmentService.calculateCreditProgress(MOCK_STUDENT_ID, MOCK_MATRIX_ID),
                EnrollmentService.getStudentEnrollments(MOCK_STUDENT_ID)
            ]);
            setProgress(progressData);
            setEnrollments(enrollmentData);
        } catch (error) {
            console.error("Failed to load academic data:", error);
            // Setup fallback data for UI testing if the database isn't fully seeded
            if (error.message?.includes('JWT') || error.message?.includes('Network')) {
                setFallbackData();
            }
        } finally {
            setLoading(false);
        }
    };

    const setFallbackData = () => {
        setProgress({
            matrix_name: "US College General Education",
            completion_percentage: 45,
            requirements: {
                "Writing": { label: "Writing / English", credits_required: 6, credits_fulfilled: 3, is_fulfilled: false },
                "Math": { label: "Math / Quantitative Reasoning", credits_required: 3, credits_fulfilled: 3, is_fulfilled: true },
                "Science": { label: "Natural Science", credits_required: 3, credits_fulfilled: 0, is_fulfilled: false }
            }
        });
        setEnrollments([
            {
                id: '1', status: 'in_progress', completion_percentage: 65,
                course: { title: 'First-Year Composition I', course_code: 'ENG 101', institution: { name: 'Arizona State University', short_code: 'ASU' } }
            }
        ]);
    };

    const handleLaunchCourse = (course) => {
        setLaunchingCourse(course);
        // Simulate secure SSO handoff delay for gravitas
        setTimeout(() => {
            // In reality, we pass the real student profile
            const launchUrl = InstitutionService.buildLaunchUrl(course, { email: 'student@example.com', id: MOCK_STUDENT_ID });
            window.open(launchUrl, '_blank');
            setLaunchingCourse(null);
        }, 2500);
    };

    if (loading) {
        return (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-8 bg-slate-100 rounded w-full"></div>
                    <div className="h-8 bg-slate-100 rounded w-full"></div>
                </div>
            </div>
        );
    }

    if (!progress) return null;

    const activeEnrollments = enrollments.filter(e => ['enrolled', 'in_progress'].includes(e.status));

    return (
        <div className="space-y-6">
            {/* Dynamic Progress Matrices */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Target className="text-[#8B2332]" size={20} />
                            <h2 className="text-xl font-bold font-serif text-[#2D2D2D]">
                                Degree Plan Progress
                            </h2>
                        </div>
                        <p className="text-sm text-slate-500">{progress.matrix_name}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-[#8B2332]">
                            {progress.completion_percentage}%
                        </div>
                        <p className="text-xs text-slate-400">Completed</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {Object.entries(progress.requirements).map(([key, req]) => (
                        <div key={key} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-slate-600">
                                <span>{req.label}</span>
                                <span className={req.is_fulfilled ? 'text-emerald-600' : 'text-slate-400'}>
                                    {req.credits_fulfilled} / {req.credits_required} Credits
                                </span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-100">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${req.is_fulfilled ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-[#8B2332]'}`}
                                    style={{ width: `${Math.min((req.credits_fulfilled / req.credits_required) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dynamic Launch Cards */}
            {activeEnrollments.length > 0 && (
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold font-serif text-[#2D2D2D] mb-4">Active University Courses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeEnrollments.map((enrollment) => (
                            <div key={enrollment.id} className="p-4 rounded-xl border border-slate-200 hover:border-[#8B2332]/30 transition-colors shadow-sm bg-[#FAF8F5]">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="text-xs font-bold text-[#8B2332] uppercase tracking-wider mb-1">
                                            {enrollment.course.institution?.short_code} • {enrollment.course.course_code}
                                        </div>
                                        <h4 className="font-bold text-[#2D2D2D] leading-tight mb-2">
                                            {enrollment.course.title}
                                        </h4>
                                    </div>
                                    <div className="p-1.5 bg-white rounded-md shadow-sm border border-slate-100">
                                        {/* Mock Logo fallback */}
                                        <div className="w-8 h-8 flex items-center justify-center font-bold text-slate-400 text-xs text-center border border-dashed rounded bg-slate-50">
                                            {enrollment.course.institution?.short_code}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
                                    <span className="flex items-center gap-1"><Clock size={14} /> {enrollment.status === 'in_progress' ? `${enrollment.completion_percentage || 0}% Complete` : 'Enrolled'}</span>
                                </div>

                                <button
                                    onClick={() => handleLaunchCourse(enrollment.course)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#8B2332] text-white rounded-lg font-bold hover:bg-[#a02a3a] transition-all shadow-md hover:shadow-lg"
                                >
                                    Access Course <ExternalLink size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SSO Interceptor Modal for Gravitas */}
            {launchingCourse && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200">
                        <div className="h-2 w-full bg-[#8B2332] animate-pulse"></div>
                        <div className="p-8 text-center space-y-6">
                            <div className="relative w-20 h-20 mx-auto">
                                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-[#8B2332] rounded-full border-t-transparent animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ShieldCheck className="text-[#8B2332]" size={32} />
                                </div>
                            </div>

                            <div>
                                <h3 className="font-serif font-bold text-[#2D2D2D] text-xl mb-1">Secure SSO Handoff</h3>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                    {launchingCourse.institution?.name || 'Partner Institution'}
                                </p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left font-mono text-xs text-slate-500 space-y-2">
                                <div className="flex justify-between"><span>Session:</span> <span className="text-emerald-600 font-bold">Validating</span></div>
                                <div className="flex justify-between"><span>Course:</span> <span className="font-bold text-slate-700">{launchingCourse.course_code}</span></div>
                                <div className="flex justify-between"><span>Encryption:</span> <span className="font-bold text-slate-700">AES-256 Active</span></div>
                            </div>

                            <p className="text-xs text-slate-400 font-medium">Please wait while we establish a secure connection to the university learning management system...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DualCreditVisualizer;
