import React, { useState } from 'react';
import {
    Target, GraduationCap, Briefcase, Heart, Globe, Sparkles,
    ChevronRight, ChevronLeft, Check, ArrowRight
} from 'lucide-react';
import transferPathways from '../data/transfer-pathways.json';

/**
 * AcademicGoalSurvey - Onboarding flow for new students
 * Collects academic goals to generate personalized Transfer Matrix
 */

const STEPS = [
    { id: 'welcome', title: 'Welcome' },
    { id: 'goals', title: 'Your Goals' },
    { id: 'interests', title: 'Interests' },
    { id: 'timeline', title: 'Timeline' },
    { id: 'confirmation', title: 'Your Matrix' },
];

const CAREER_PATHS = [
    { id: 'tech', label: 'Technology & Engineering', icon: '💻', majors: ['Computer Science', 'Data Science', 'Electrical Engineering'] },
    { id: 'health', label: 'Healthcare & Medicine', icon: '🏥', majors: ['Pre-Med', 'Nursing', 'Public Health'] },
    { id: 'business', label: 'Business & Finance', icon: '📊', majors: ['Business Administration', 'Economics', 'Accounting'] },
    { id: 'creative', label: 'Arts & Creative', icon: '🎨', majors: ['Design', 'Film', 'Architecture'] },
    { id: 'science', label: 'Natural Sciences', icon: '🔬', majors: ['Biology', 'Chemistry', 'Environmental Science'] },
    { id: 'social', label: 'Social Sciences', icon: '🌍', majors: ['Psychology', 'Political Science', 'Sociology'] },
    { id: 'law', label: 'Law & Policy', icon: '⚖️', majors: ['Pre-Law', 'Criminal Justice', 'Public Policy'] },
    { id: 'education', label: 'Education', icon: '📚', majors: ['Teaching', 'Educational Psychology', 'Curriculum Design'] },
];

const INTEREST_AREAS = [
    { id: 'problem_solving', label: 'Problem Solving', icon: '🧩' },
    { id: 'creativity', label: 'Creative Expression', icon: '🎭' },
    { id: 'leadership', label: 'Leadership', icon: '👑' },
    { id: 'helping', label: 'Helping Others', icon: '🤝' },
    { id: 'research', label: 'Research & Discovery', icon: '🔍' },
    { id: 'technology', label: 'Technology', icon: '🚀' },
    { id: 'communication', label: 'Communication', icon: '💬' },
    { id: 'analysis', label: 'Data & Analysis', icon: '📈' },
];

const TIMELINES = [
    { id: '2_years', label: '2 Years', description: 'Fast-track to transfer', recommended: ['Community College'] },
    { id: '3_years', label: '3 Years', description: 'Standard pace with buffer', recommended: ['Community College', 'Online Courses'] },
    { id: '4_years', label: '4 Years', description: 'Full undergraduate experience', recommended: ['Direct Enrollment'] },
    { id: 'flexible', label: 'Flexible', description: 'Self-paced, competency-based', recommended: ['WGU', 'BYU Pathway'] },
];

const StepIndicator = ({ steps, currentStep }) => (
    <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, index) => {
            const isCurrent = step.id === currentStep;
            const isPast = steps.findIndex(s => s.id === currentStep) > index;
            return (
                <React.Fragment key={step.id}>
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${isCurrent
                            ? 'bg-[#8B2332] text-white scale-110'
                            : isPast
                                ? 'bg-green-500 text-white'
                                : 'bg-slate-700 text-slate-400'
                            }`}
                    >
                        {isPast ? <Check size={14} /> : index + 1}
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`w-8 h-0.5 ${isPast ? 'bg-green-500' : 'bg-slate-700'}`} />
                    )}
                </React.Fragment>
            );
        })}
    </div>
);

export const AcademicGoalSurvey = ({ studentName, onComplete }) => {
    const [currentStep, setCurrentStep] = useState('welcome');
    const [responses, setResponses] = useState({
        careerPath: null,
        specificMajor: null,
        interests: [],
        timeline: null,
        dreamSchools: [],
    });

    const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

    const nextStep = () => {
        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStep(STEPS[currentStepIndex + 1].id);
        }
    };

    const prevStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStep(STEPS[currentStepIndex - 1].id);
        }
    };

    const toggleInterest = (id) => {
        setResponses(prev => ({
            ...prev,
            interests: prev.interests.includes(id)
                ? prev.interests.filter(i => i !== id)
                : [...prev.interests, id]
        }));
    };

    const selectCareerPath = (id) => {
        setResponses(prev => ({ ...prev, careerPath: id, specificMajor: null }));
    };

    const selectTimeline = (id) => {
        setResponses(prev => ({ ...prev, timeline: id }));
    };

    const handleComplete = () => {
        // Generate matrix based on responses
        const matrix = generateTransferMatrix(responses);
        onComplete({ ...responses, generatedMatrix: matrix });
    };

    // Generate recommended universities based on survey
    const generateTransferMatrix = (data) => {
        const recommendations = [];

        // Filter universities based on career path - Use the flat list
        const allUniversities = transferPathways.universities || [];

        // Prioritize based on timeline
        if (data.timeline === '2_years' || data.timeline === '3_years') {
            // Recommend TAG schools (guaranteed transfer) -> Tier 1
            const tagSchools = allUniversities.filter(u => u.tag_available || u.tier.includes('Tier 1'));
            recommendations.push(...tagSchools.slice(0, 3));
        }

        if (data.timeline === 'flexible') {
            // Recommend online/competency-based
            const onlineSchools = allUniversities.filter(u => u.online);
            recommendations.push(...onlineSchools.slice(0, 3));
        }

        return {
            primaryPath: recommendations[0],
            alternativePaths: recommendations.slice(1),
            estimatedCompletion: data.timeline,
            requiredCredits: data.timeline === '2_years' ? 60 : 90,
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0a1628] to-[#050816] flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B2332]/20 text-[#C9B47C] text-sm font-medium mb-4">
                        <Sparkles size={14} />
                        Academic Goal Survey
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">
                        Chart Your Path to Victory
                    </h1>
                    <p className="text-slate-400">
                        Answer a few questions to generate your personalized Transfer Matrix
                    </p>
                </div>

                <StepIndicator steps={STEPS} currentStep={currentStep} />

                {/* Survey Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8">

                    {/* Welcome Step */}
                    {currentStep === 'welcome' && (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-6">🎓</div>
                            <h2 className="text-2xl font-bold text-white mb-4">
                                Welcome, {studentName || 'Future Scholar'}!
                            </h2>
                            <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                In the next few minutes, we'll learn about your academic goals
                                and create your personalized Transfer Matrix – your roadmap to
                                guaranteed university admission.
                            </p>
                            <button
                                onClick={nextStep}
                                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#8B2332] to-[#a62d40] text-white font-semibold text-lg hover:shadow-lg hover:shadow-[#8B2332]/30 transition-all flex items-center gap-2 mx-auto"
                            >
                                Let's Begin
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    )}

                    {/* Career Goals Step */}
                    {currentStep === 'goals' && (
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">What career path interests you?</h2>
                            <p className="text-slate-400 mb-6">Select the field that excites you most</p>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {CAREER_PATHS.map(path => (
                                    <button
                                        key={path.id}
                                        onClick={() => selectCareerPath(path.id)}
                                        className={`p-4 rounded-2xl border text-left transition-all ${responses.careerPath === path.id
                                            ? 'bg-[#8B2332]/20 border-[#8B2332] ring-2 ring-[#8B2332]/50'
                                            : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="text-2xl mb-2">{path.icon}</div>
                                        <div className="font-medium text-white text-sm">{path.label}</div>
                                    </button>
                                ))}
                            </div>

                            {responses.careerPath && (
                                <div className="mt-6">
                                    <label className="text-sm text-slate-400 block mb-2">Specific Major (Optional)</label>
                                    <select
                                        value={responses.specificMajor || ''}
                                        onChange={(e) => setResponses(prev => ({ ...prev, specificMajor: e.target.value }))}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
                                    >
                                        <option value="">Select a major...</option>
                                        {CAREER_PATHS.find(p => p.id === responses.careerPath)?.majors.map(major => (
                                            <option key={major} value={major}>{major}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Interests Step */}
                    {currentStep === 'interests' && (
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">What do you enjoy?</h2>
                            <p className="text-slate-400 mb-6">Select all that apply</p>

                            <div className="grid grid-cols-2 gap-3">
                                {INTEREST_AREAS.map(interest => (
                                    <button
                                        key={interest.id}
                                        onClick={() => toggleInterest(interest.id)}
                                        className={`p-4 rounded-2xl border text-left transition-all ${responses.interests.includes(interest.id)
                                            ? 'bg-[#C9B47C]/20 border-[#C9B47C] ring-2 ring-[#C9B47C]/50'
                                            : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="text-2xl mb-2">{interest.icon}</div>
                                        <div className="font-medium text-white text-sm">{interest.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Timeline Step */}
                    {currentStep === 'timeline' && (
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">What's your ideal timeline?</h2>
                            <p className="text-slate-400 mb-6">How quickly do you want to reach your university goal?</p>

                            <div className="space-y-3">
                                {TIMELINES.map(timeline => (
                                    <button
                                        key={timeline.id}
                                        onClick={() => selectTimeline(timeline.id)}
                                        className={`w-full p-4 rounded-2xl border text-left transition-all ${responses.timeline === timeline.id
                                            ? 'bg-[#8B2332]/20 border-[#8B2332] ring-2 ring-[#8B2332]/50'
                                            : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold text-white">{timeline.label}</div>
                                                <div className="text-sm text-slate-400">{timeline.description}</div>
                                            </div>
                                            {responses.timeline === timeline.id && (
                                                <Check className="text-[#8B2332]" size={20} />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Confirmation Step */}
                    {currentStep === 'confirmation' && (
                        <div className="text-center py-6">
                            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                                <Check size={40} className="text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Your Matrix is Ready!</h2>
                            <p className="text-slate-400 mb-8">
                                Based on your goals, we've generated a personalized transfer pathway
                                targeting top universities with guaranteed admission programs.
                            </p>

                            <div className="bg-slate-900/50 rounded-2xl p-6 mb-8 text-left">
                                <h3 className="text-sm font-semibold text-[#C9B47C] mb-3">YOUR RECOMMENDATIONS</h3>
                                <div className="space-y-2 text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <Target size={16} className="text-[#8B2332]" />
                                        <span>Primary Path: UC Transfer (TAG Program)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <GraduationCap size={16} className="text-[#C9B47C]" />
                                        <span>Target: {responses.specificMajor || CAREER_PATHS.find(p => p.id === responses.careerPath)?.majors[0] || 'Undeclared'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={16} className="text-blue-400" />
                                        <span>Timeline: {TIMELINES.find(t => t.id === responses.timeline)?.label || 'Flexible'}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleComplete}
                                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#8B2332] to-[#a62d40] text-white font-semibold text-lg hover:shadow-lg hover:shadow-[#8B2332]/30 transition-all flex items-center gap-2 mx-auto"
                            >
                                Start Your Journey
                                <Sparkles size={20} />
                            </button>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    {currentStep !== 'welcome' && currentStep !== 'confirmation' && (
                        <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
                            <button
                                onClick={prevStep}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors"
                            >
                                <ChevronLeft size={16} />
                                Back
                            </button>
                            <button
                                onClick={nextStep}
                                disabled={
                                    (currentStep === 'goals' && !responses.careerPath) ||
                                    (currentStep === 'interests' && responses.interests.length === 0) ||
                                    (currentStep === 'timeline' && !responses.timeline)
                                }
                                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#C9B47C] text-slate-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#b09b63] transition-colors"
                            >
                                Continue
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AcademicGoalSurvey;
