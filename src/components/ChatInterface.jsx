import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/FirebaseClient';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ConfusionDetectionService } from '../services/ConfusionDetectionService';
import { NCEService } from '../services/NCEService';
import { LectureAssistantService } from '../services/LectureAssistantService';
import { Sparkles, ArrowRight, Loader2, User, Bot, BookOpen, AlertCircle, Award, FileText, Send } from 'lucide-react';

const MOCK_STUDENT_ID = 'e7b1c3d9-4f8a-4c2b-9a1d-8e6f7b5c4d3a';
// Sample scenario from seed data
const MOCK_SCENARIO_ID = 'n5000000-0000-0000-0000-000000000001';

export const ChatInterface = ({ scenarioId = MOCK_SCENARIO_ID, studentId = MOCK_STUDENT_ID, onClose }) => {
    const [progress, setProgress] = useState(null);
    const [scenario, setScenario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiThinking, setAiThinking] = useState(false);

    // UI state for inputs
    const [textInput, setTextInput] = useState('');
    const [artifactInput, setArtifactInput] = useState('');
    const [chatLog, setChatLog] = useState([]);

    const scrollRef = useRef(null);

    // Initial Load & State Machine Sync
    useEffect(() => {
        loadNCEState();
    }, [scenarioId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatLog, progress]);

    // Listen for Confusion Events from Lecture Player
    useEffect(() => {
        const handleConfusion = (e) => {
            const { message } = e.detail;
            setChatLog(prev => [...prev, {
                role: 'system',
                text: `[Proactive Tutor]: ${message}`,
                isProactive: true
            }]);
        };

        window.addEventListener('concept-confusion', handleConfusion);
        return () => window.removeEventListener('concept-confusion', handleConfusion);
    }, []);

    const loadNCEState = async () => {
        setLoading(true);
        try {
            const [scen, prog] = await Promise.all([
                NCEService.getScenarioById(scenarioId),
                NCEService.getOrCreateProgress(studentId, scenarioId)
            ]);
            setScenario(scen);
            setProgress(prog);

            // Seed initial chat log if starting fresh
            if (prog.current_step === 1 && Object.keys(prog.step_data || {}).length === 0) {
                triggerAiNarrative(studentId, scenarioId);
            } else {
                buildChatLogFromHistory(scen, prog);
            }
        } catch (error) {
            console.error("Failed to load NCE State:", error);
            // Setup fallback for UI demo
            setupDemoFallback();
        } finally {
            setLoading(false);
        }
    };

    const triggerAiNarrative = async (stuId, scenId) => {
        setAiThinking(true);
        try {
            // Hot Folder Integration: Fetch syllabus-based context if course matches
            const courseId = scenario?.course_id || 'course-econ-101';
            const courseContext = await LectureAssistantService.getHotFolderContext(courseId);

            const narrative = await NCEService.runStep(stuId, scenId, courseContext);
            setChatLog(prev => [...prev, { role: 'system', text: narrative }]);
        } catch (e) {
            setChatLog(prev => [...prev, { role: 'system', text: 'Connection to Narrative Engine lost. Operating in degraded mode.' }]);
        } finally {
            setAiThinking(false);
        }
    };

    const buildChatLogFromHistory = (scen, prog) => {
        const history = [];
        // Reconstruct narrative history simply based on current step
        history.push({ role: 'system', text: `Resuming Simulation: ${scen.title}` });
        if (prog.current_step > 5) {
            history.push({ role: 'system', text: `Simulation Complete. Final Score: ${prog.evaluation_score}` });
        }
        setChatLog(history);
    };

    // Submissions for each phase
    const handleStepSubmit = async (responseData) => {
        if (!progress) return;

        try {
            // Append user action to log UI
            if (responseData.text) setChatLog(prev => [...prev, { role: 'user', text: responseData.text }]);
            if (responseData.decision) setChatLog(prev => [...prev, { role: 'user', text: `Selected: ${responseData.decision}` }]);
            if (responseData.artifact_content) setChatLog(prev => [...prev, { role: 'user', text: `[Artifact Submitted]` }]);

            const newProg = await NCEService.advanceStep(studentId, scenarioId, responseData);
            setProgress(newProg);

            // If we just hit Step 5, trigger automatic evaluation
            if (newProg.current_step === 5 && !newProg.evaluation_score) {
                await evaluateArtifact(studentId, scenarioId);
            } else if (newProg.current_step <= 5) {
                // Trigger next narrative prompt
                triggerAiNarrative(studentId, scenarioId);
            }

        } catch (e) {
            console.error("Failed to advance NCE step:", e);
        }
    };

    const evaluateArtifact = async (stuId, scenId) => {
        setAiThinking(true);
        try {
            await NCEService.evaluateExtraction(stuId, scenId);
            // Refresh progress to get score
            const updatedProg = await NCEService.getOrCreateProgress(studentId, scenarioId);
            setProgress(updatedProg);
        } catch (e) {
            console.error(e);
        } finally {
            setAiThinking(false);
        }
    };

    const setupDemoFallback = () => {
        setScenario({
            title: "The Wright Brothers Problem: Engineering Failure",
            step1_confusion: { prompt: "No modern engine. What do you change?" },
            step2_immersion: { decision_branches: [{ id: '1', label: 'Modify wing camber' }, { id: '2', label: 'New engine' }] }
        });
        setProgress({
            current_step: 1,
            step_data: {}
        });
        setChatLog([{ role: 'system', text: "It is 1901. Kitty Hawk, North Carolina. Three gliders have failed. Investors are skeptical. What do you do?" }]);
    };

    if (loading) {
        return <div className="flex h-full items-center justify-center bg-[#FAF8F5]"><Loader2 className="animate-spin text-[#8B2332]" size={32} /></div>;
    }

    const currentPhase = progress?.current_step || 1;

    return (
        <div className="flex flex-col h-full overflow-hidden bg-[#FAF8F5]">
            {/* Header: NCE Phase Indicator */}
            <div className="h-[70px] border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B2332] to-[#C9B47C] flex items-center justify-center shadow-md">
                        <Sparkles size={18} className="text-white" />
                    </div>
                    <div>
                        <span className="text-sm font-bold text-[#2D2D2D] block leading-tight">{scenario?.title || 'NCE Payload Active'}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phase {currentPhase}/5</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                                {currentPhase === 1 && 'Cognitive Disruption'}
                                {currentPhase === 2 && 'Decision Branching'}
                                {currentPhase === 3 && 'Theory Bridge'}
                                {currentPhase === 4 && 'Artifact Generation'}
                                {currentPhase === 5 && 'Mental Model Extraction'}
                                {currentPhase > 5 && 'Simulation Complete'}
                            </span>
                        </div>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="text-sm font-bold text-slate-400 hover:text-[#8B2332]">Exit Simulator</button>
                )}
            </div>

            {/* Narrative Log Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                {chatLog.map((msg, i) => (
                    <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'system' && (
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                                <ShieldAlert size={14} className="text-white" />
                            </div>
                        )}
                        <div className={`max-w-[75%] px-5 py-4 text-[15px] leading-relaxed shadow-sm ${msg.role === 'user'
                            ? 'bg-white border border-slate-200 text-[#2D2D2D] rounded-2xl rounded-tr-sm font-medium'
                            : 'bg-[#2D2D2D] text-slate-100 rounded-2xl rounded-tl-sm'
                            }`}>
                            <div className="whitespace-pre-wrap font-serif">{msg.text}</div>
                        </div>
                    </div>
                ))}

                {aiThinking && (
                    <div className="flex gap-4 justify-start">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                            <Loader2 size={14} className="animate-spin text-white" />
                        </div>
                        <div className="px-5 py-4 bg-[#2D2D2D] text-slate-400 rounded-2xl rounded-tl-sm text-sm italic font-serif">
                            Generating narrative consequence...
                        </div>
                    </div>
                )}
            </div>

            {/* Dynamic Input Control Surface */}
            <div className="p-6 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto">

                    {/* Phase 1 & 3: Free Text Reply */}
                    {(currentPhase === 1 || currentPhase === 3) && !aiThinking && (
                        <div className="flex gap-2">
                            <input
                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2332] transition-colors"
                                placeholder="Your response..."
                                value={textInput}
                                onChange={e => setTextInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && textInput && (handleStepSubmit({ text: textInput }), setTextInput(''))}
                            />
                            <button
                                onClick={() => { handleStepSubmit({ text: textInput }); setTextInput(''); }}
                                disabled={!textInput}
                                className="px-6 py-3 bg-[#8B2332] text-white font-bold rounded-xl hover:bg-[#a02a3a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                Submit <ArrowRight size={16} />
                            </button>
                        </div>
                    )}

                    {/* Phase 2: Decisions Buttons */}
                    {currentPhase === 2 && !aiThinking && (
                        <div className="space-y-3">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Select your approach:</p>
                            {scenario?.step2_immersion?.decision_branches?.map(branch => (
                                <button
                                    key={branch.id}
                                    onClick={() => handleStepSubmit({ decision: branch.label, branchId: branch.id })}
                                    className="w-full p-4 bg-white border-2 border-slate-200 hover:border-[#8B2332] rounded-xl text-left font-bold text-[#2D2D2D] transition-all hover:shadow-md flex items-center justify-between group"
                                >
                                    {branch.label}
                                    <ArrowRight size={18} className="text-slate-300 group-hover:text-[#8B2332] transition-colors" />
                                </button>
                            ))}
                            {/* Fallback if DB missing */}
                            {!scenario?.step2_immersion?.decision_branches && (
                                <button onClick={() => handleStepSubmit({ decision: 'Proceed with default' })} className="w-full p-4 bg-white border-2 border-slate-200 hover:border-[#8B2332] rounded-xl text-left font-bold transition-all">
                                    Proceed Default Action
                                </button>
                            )}
                        </div>
                    )}

                    {/* Phase 4: Artifact Generation */}
                    {currentPhase === 4 && !aiThinking && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[#8B2332] font-bold">
                                <FileText size={20} /> Submit Engineering Brief (Artifact)
                            </div>
                            <textarea
                                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2332] font-mono text-sm resize-none"
                                placeholder="Write your artifact here..."
                                value={artifactInput}
                                onChange={e => setArtifactInput(e.target.value)}
                            />
                            <button
                                onClick={() => handleStepSubmit({ artifact_content: artifactInput })}
                                disabled={artifactInput.length < 20}
                                className="w-full py-4 bg-[#2D2D2D] text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <CheckCircle size={18} /> Seal & Submit Artifact
                            </button>
                        </div>
                    )}

                    {/* Phase 5/6: Execution Complete */}
                    {currentPhase >= 5 && (
                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                            {aiThinking ? (
                                <div className="space-y-4">
                                    <Loader2 size={32} className="animate-spin text-[#8B2332] mx-auto" />
                                    <p className="text-sm font-bold text-slate-500">Evaluating mental models...</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Award size={48} className="text-[#C9B47C] mx-auto mb-2" />
                                    <h3 className="text-2xl font-serif font-bold text-[#2D2D2D]">Evaluation Complete</h3>
                                    <div className="text-5xl font-bold text-[#8B2332]">{progress?.evaluation_score || 0}</div>
                                    <p className="text-sm text-slate-600 max-w-md mx-auto">{progress?.evaluation_feedback || "Good job navigating the constraints."}</p>

                                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                                        {progress?.extracted_models?.map((model, i) => (
                                            <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 shadow-sm">{model}</span>
                                        ))}
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

export default ChatInterface;
