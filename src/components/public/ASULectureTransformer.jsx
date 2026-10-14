import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, FileText, ChevronRight, Zap, Target, BookOpen, AlertCircle, Award, Brain, Terminal, Shield, ArrowRight } from 'lucide-react';
import { XPGame3D } from '../XPGame3D';
import physicsDemoData from '../../data/xp-demo-physics.json';

export const ASULectureTransformer = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState('lecture');
    const [boredomLevel, setBoredomLevel] = useState(10);
    const [showTransformer, setShowTransformer] = useState(false);
    const [transformationComplete, setTransformationComplete] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);

    // Increase boredom over time if on the boring side
    useEffect(() => {
        if (!transformationComplete) {
            const timer = setInterval(() => {
                setBoredomLevel(prev => Math.min(prev + 5, 100));
            }, 3000);
            return () => clearInterval(timer);
        }
    }, [transformationComplete]);

    const handleTransform = () => {
        setIsTransforming(true);
        setTimeout(() => {
            setTransformationComplete(true);
            setIsTransforming(false);
        }, 3000);
    };

    const BoringView = () => (
        <div className="w-full h-full bg-[#f5f5f5] flex flex-col font-sans text-gray-800 border-r border-gray-300 relative">
            {/* Clunky LMS Header */}
            <div className="bg-[#8C1D40] text-white p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-[#8C1D40]">ASU</div>
                    <div>
                        <h1 className="font-bold text-xl leading-tight">PHY 121: University Physics I</h1>
                        <p className="text-sm opacity-80">Section 40291 • Fall Semester</p>
                    </div>
                </div>
                <div className="text-sm">Welcome, Student</div>
            </div>

            {/* Clunky Nav */}
            <div className="flex border-b border-gray-300 bg-white">
                {['lecture', 'syllabus', 'modules', 'grades'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-medium border-b-4 transition-colors ${activeTab === tab ? 'border-[#8C1D40] text-[#8C1D40]' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-6 bg-[#f5f5f5]">
                {activeTab === 'lecture' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 mb-6">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Module 4: Newton's Laws of Motion - Lecture Recording</h2>
                            <div className="aspect-video bg-black relative mb-4">
                                {/* Real Physics Lecture Embed (MIT OCW used as placeholder for generic physics lecture) */}
                                <iframe 
                                    className="absolute inset-0 w-full h-full" 
                                    src="https://www.youtube.com/embed/Xv8w2h02zLw?si=Uq9kF1_Pz11n4V58" 
                                    title="Physics Lecture" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Please watch the entirety of this 50-minute lecture. Take notes. There will be a multiple-choice quiz on Blackboard following this module. Remember that attendance is tracked.
                            </p>
                        </div>
                    </div>
                )}
                
                {activeTab === 'syllabus' && (
                    <div className="max-w-4xl mx-auto bg-white p-8 rounded-sm shadow-sm border border-gray-200">
                        <h2 className="text-2xl font-bold mb-6 text-center underline">COURSE SYLLABUS</h2>
                        <div className="space-y-6 text-sm text-gray-700">
                            <section>
                                <h3 className="font-bold text-lg mb-2">Course Description</h3>
                                <p>Kinematics, Newton's laws, work, energy, momentum, conservation laws, dynamics of particles, solids, and fluids. Calculus based.</p>
                            </section>
                            <section>
                                <h3 className="font-bold text-lg mb-2">Grading Policy</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Midterm 1: 20%</li>
                                    <li>Midterm 2: 20%</li>
                                    <li>Final Exam: 30%</li>
                                    <li>Homework (MasteringPhysics): 30%</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="font-bold text-lg mb-2">Schedule</h3>
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100"><th className="border p-2 text-left">Week</th><th className="border p-2 text-left">Topic</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className="border p-2">1</td><td className="border p-2">1D Kinematics</td></tr>
                                        <tr><td className="border p-2">2</td><td className="border p-2">Vectors & 2D Motion</td></tr>
                                        <tr><td className="border p-2 bg-yellow-50 font-semibold text-red-600">3</td><td className="border p-2 bg-yellow-50 font-semibold text-red-600">Newton's Laws</td></tr>
                                    </tbody>
                                </table>
                            </section>
                        </div>
                    </div>
                )}
            </div>

            {/* Boredom Meter Overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-white p-4 shadow-lg rounded-lg border border-gray-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle size={24} />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                        <span>STUDENT ENGAGEMENT</span>
                        <span className={boredomLevel > 80 ? 'text-red-500 font-bold' : ''}>BOREDOM: {boredomLevel}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-red-500 h-full transition-all duration-1000 ease-in-out" style={{ width: `${boredomLevel}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const UnischoolView = () => (
        <div className="w-full h-full bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden font-sans">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Unischool Header */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-white/5 backdrop-blur-md relative z-10">
                <div className="flex items-center gap-3">
                    <img src="/images/unischool-logo.png" alt="Unischool" className="w-8 h-8 rounded-lg" />
                    <div>
                        <div className="font-bold tracking-widest uppercase text-xs text-purple-400">Unischool Spacecraft</div>
                        <div className="font-medium text-sm">Physics Simulation: Level 3</div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                        <Zap size={14} className="text-yellow-400" />
                        <span className="font-bold">450 XP</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                        <Shield size={14} className="text-green-400" />
                        <span className="font-bold">College Credit Active</span>
                    </div>
                </div>
            </div>

            {/* Game Engine Container */}
            <div className="flex-1 relative z-10 p-6 flex flex-col gap-6 overflow-y-auto">
                <div className="grid grid-cols-3 gap-6 h-full">
                    {/* Game View (takes up 2/3) */}
                    <div className="col-span-2 bg-black/40 border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl backdrop-blur-sm group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />
                        {/* We embed XPGame3D here */}
                        <div className="absolute inset-0">
                            <XPGame3D narrativeData={physicsDemoData} studentId="demo-student" onExit={() => {}} />
                        </div>
                    </div>

                    {/* Dashboard & Syllabus Mapping (takes up 1/3) */}
                    <div className="col-span-1 flex flex-col gap-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                                <Target size={18} className="text-purple-400" />
                                Mission Objectives
                            </h3>
                            <div className="space-y-4">
                                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                    <div className="text-xs text-purple-300 font-bold mb-1 uppercase tracking-wider">Primary Objective</div>
                                    <div className="text-sm">Design a wing structure that satisfies Newton's 3rd Law of Motion to generate lift.</div>
                                </div>
                                <div className="p-3 bg-white/5 border border-white/10 rounded-xl opacity-60">
                                    <div className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">Secondary Objective</div>
                                    <div className="text-sm">Calculate required thrust to overcome drag.</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex-1">
                            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                                <Brain size={18} className="text-blue-400" />
                                ASU Credit Mapping
                            </h3>
                            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                                Your gameplay actions are automatically graded and mapped to the ASU PHY 121 syllabus.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-2 rounded bg-green-500/10 border border-green-500/20">
                                    <span className="text-sm flex items-center gap-2"><CheckCircle size={14} className="text-green-400"/> 1D Kinematics</span>
                                    <span className="text-xs font-bold text-green-400">Mastered</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded bg-green-500/10 border border-green-500/20">
                                    <span className="text-sm flex items-center gap-2"><CheckCircle size={14} className="text-green-400"/> Vectors & 2D Motion</span>
                                    <span className="text-xs font-bold text-green-400">Mastered</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded bg-purple-500/10 border border-purple-500/20 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-purple-500/20 w-3/4"></div>
                                    <span className="text-sm flex items-center gap-2 relative z-10"><Play size={14} className="text-purple-400"/> Newton's Laws</span>
                                    <span className="text-xs font-bold text-purple-400 relative z-10">In Progress</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Simple CheckCircle component for the UI above
    const CheckCircle = ({size, className}) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    );

    return (
        <div className="fixed inset-0 z-50 bg-black flex overflow-hidden font-sans">
            {!transformationComplete ? (
                <>
                    {/* Full Boring View */}
                    <div className="w-full h-full relative">
                        <BoringView />
                        
                        {/* The Transformer Button */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                            <motion.button
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 2 }}
                                onClick={handleTransform}
                                disabled={isTransforming}
                                className="pointer-events-auto group relative flex flex-col items-center justify-center"
                            >
                                <div className="absolute inset-0 bg-purple-600 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                                <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-[2px] rounded-3xl overflow-hidden shadow-2xl transform transition-transform group-hover:scale-105">
                                    <div className="bg-gray-900 px-8 py-6 rounded-[22px] flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                            {isTransforming ? <Zap className="text-yellow-400 animate-bounce" size={24} /> : <Zap className="text-purple-400" size={24} />}
                                        </div>
                                        <div className="text-left">
                                            <div className="text-white font-bold text-xl uppercase tracking-widest mb-1">
                                                {isTransforming ? "Initiating Web3 Experience..." : "Transform Lecture"}
                                            </div>
                                            <div className="text-purple-300 text-sm">Powered by Unischool AI</div>
                                        </div>
                                    </div>
                                    
                                    {/* Transformation Progress Bar */}
                                    {isTransforming && (
                                        <motion.div 
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 3, ease: "easeInOut" }}
                                            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 to-green-400"
                                        />
                                    )}
                                </div>
                            </motion.button>
                        </div>

                        {/* Transition Overlay */}
                        <AnimatePresence>
                            {isTransforming && (
                                <motion.div
                                    initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                                    animate={{ clipPath: 'circle(150% at 50% 50%)' }}
                                    transition={{ duration: 2.5, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-[#0a0a0f] z-40 flex items-center justify-center"
                                >
                                    <div className="text-white text-center">
                                        <Zap className="text-purple-500 w-24 h-24 mx-auto mb-8 animate-pulse" />
                                        <h2 className="text-4xl font-bold font-serif tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                            UNISCHOOL
                                        </h2>
                                        <p className="mt-4 text-gray-400 tracking-widest uppercase text-sm">Constructing Immersive Environment</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            ) : (
                <>
                    {/* Split Screen View */}
                    <div className="w-1/2 h-full relative opacity-50 grayscale pointer-events-none transition-all duration-1000">
                        <BoringView />
                        <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center backdrop-blur-[2px]">
                            <div className="bg-black/80 px-6 py-3 rounded-full border border-white/20 text-white/70 font-mono text-sm tracking-widest uppercase">
                                Legacy System Disabled
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 h-full shadow-2xl shadow-purple-500/20 z-30 transition-all duration-1000 transform origin-right">
                        <UnischoolView />
                    </div>
                    
                    {/* Back Button */}
                    <button 
                        onClick={() => onNavigate('landing')}
                        className="absolute top-6 left-6 z-50 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-md border border-white/20 flex items-center gap-2 transition-colors"
                    >
                        <ArrowRight className="rotate-180" size={16} />
                        Exit Demo
                    </button>
                </>
            )}
        </div>
    );
};
