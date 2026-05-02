import React, { useState, useEffect } from 'react';
import {
    Video, Book, FileText, Sparkles, Brain,
    ChevronRight, Play, Download, ExternalLink,
    CheckCircle, Clock, AlertCircle, Search, Scale
} from 'lucide-react';
import { LectureAssistantService } from '../services/LectureAssistantService';
import { ConfusionDetectionService } from '../services/ConfusionDetectionService';

/**
 * LectureControlPanel - UI for interacting with AI-summarized lectures and hot folders
 */
export const LectureControlPanel = ({ courseId, studentId }) => {
    const [hotFolder, setHotFolder] = useState([]);
    const [summaries, setSummaries] = useState([]);
    const [synthesisData, setSynthesisData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            if (!courseId) return;
            setLoading(true);
            try {
                // 1. Fetch hot folder context
                const context = await LectureAssistantService.getHotFolderContext(courseId);
                setHotFolder(context);

                // 2. Fetch synthesis data (Concept Collisions)
                const synthesis = await LectureAssistantService.getSynthesisData(courseId);
                setSynthesisData(synthesis);

                // 3. Fetch lecture summaries
                // In a real app, we'd have a LectureAssistantService.getSummaries(courseId)
                // For now, we simulate or use the service if available.
                setSummaries([
                    {
                        id: 'L1',
                        title: 'Introduction to Macroeconomics',
                        date: '2026-03-01',
                        summary: 'Key concepts: GDP vs GNP, the circular flow of income, and the role of stakeholders in the economy.',
                        simplifiedForAge: 'Think of the economy as a big giant machine where everyone trades tokens for things they need.',
                        status: 'processed'
                    },
                    {
                        id: 'L2',
                        title: 'Supply and Demand Dynamics',
                        date: '2026-03-04',
                        summary: 'Analysis of equilibrium points, shifts in curves due to external shocks, and price elasticity.',
                        simplifiedForAge: 'If there are many toys and nobody wants them, the price goes down. If everyone wants the same toy, the price goes up!',
                        status: 'processed'
                    }
                ]);
            } catch (err) {
                console.error("Failed to load lecture data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [courseId]);

    const handlePlay = (lectureId) => {
        // Track "play" actions. If repeated quickly, it simulates confusion/rewind logic for the demo.
        ConfusionDetectionService.trackRewind(studentId || 'demo-student', lectureId, 0);
    };

    if (!courseId) {
        return (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <Video size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">Select a course to view AI-assisted materials</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-[#2D2D2D] flex items-center gap-2">
                        <Sparkles className="text-[#C9B47C]" />
                        Lecture Assistant
                    </h2>
                    <p className="text-sm text-slate-500">AI-summarized content for course ID: {courseId}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Hot Folder / Resource List */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Brain className="text-[#8B2332]" size={20} />
                            <h3 className="font-bold text-slate-800">Hot Folder Context</h3>
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                                ))}
                            </div>
                        ) : hotFolder.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No syllabus resources indexed yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {hotFolder.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#8B2332]/20 transition-all cursor-default group">
                                        <div className="p-2 rounded-lg bg-white shadow-sm">
                                            <Book size={14} className="text-[#8B2332]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-700 truncate">{item.title}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{item.category}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-[#8B2332] to-[#6b1b26] p-5 rounded-2xl text-white shadow-lg">
                        <h4 className="font-bold flex items-center gap-2 mb-2">
                            <Sparkles size={16} />
                            Tutor Insight
                        </h4>
                        <p className="text-xs opacity-90 leading-relaxed">
                            These resources are currently being used to ground your AI Tutor's responses.
                        </p>
                    </div>
                </div>

                {/* Right Column: Lecture Summaries & The Great Debate */}
                <div className="lg:col-span-2 space-y-6">
                    {/* The Great Debate (Concept Synthesis) */}
                    {synthesisData.length > 0 && (
                        <div className="bg-white p-6 rounded-2xl border-2 border-[#C9B47C]/30 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-1 bg-[#C9B47C]/10 rounded-bl-xl">
                                <Scale size={16} className="text-[#C9B47C]" />
                            </div>
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <Sparkles className="text-[#C9B47C]" />
                                The Great Debate
                                <span className="text-[10px] bg-[#C9B47C]/20 text-[#8B2332] px-2 py-0.5 rounded-full uppercase tracking-tighter">Dialectical Synthesis</span>
                            </h3>

                            <div className="space-y-4">
                                {synthesisData.map(item => (
                                    <div key={item.id} className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                                                <AlertCircle size={16} className="text-[#8B2332]" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-700">{item.concept}</h4>
                                                <p className="text-xs text-slate-500 leading-relaxed italic mt-1">"{item.contradiction}"</p>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#C9B47C]/20">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Brain size={14} className="text-[#8B2332]" />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Synthesis Resolution</span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-800">{item.studentExplanation}</p>
                                            <div className="mt-3 text-[10px] text-[#C9B47C] font-bold">
                                                THEORETICAL BASIS: {item.resolution}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Video className="text-[#8B2332]" size={20} />
                            Recent Lectures
                        </h3>
                        <button className="text-xs font-bold text-[#8B2332] hover:underline">View All</button>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {summaries.map(lecture => (
                                <div key={lecture.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-800 group-hover:text-[#8B2332] transition-colors">{lecture.title}</h4>
                                            <p className="text-xs text-slate-400 font-medium">{lecture.date}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handlePlay(lecture.id)}
                                                className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-[#8B2332] transition-colors"
                                            >
                                                <Play size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <FileText size={14} className="text-slate-400" />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Academic Summary</span>
                                            </div>
                                            <p className="text-sm text-slate-600 italic">"{lecture.summary}"</p>
                                        </div>

                                        <div className="p-3 rounded-xl bg-[#C9B47C]/10 border border-[#C9B47C]/20">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Sparkles size={14} className="text-[#C9B47C]" />
                                                <span className="text-[10px] font-bold text-[#8B2332] uppercase tracking-widest">Simplified Explainer</span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-800">{lecture.simplifiedForAge}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
