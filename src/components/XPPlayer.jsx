import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, Volume2, VolumeX, RotateCcw, Map, Award, Zap, BookOpen, AlertTriangle, CheckCircle, ArrowLeft, Sparkles, Clock, Brain, TrendingUp } from 'lucide-react';
import { LocalSessionManager } from '../services/XPSessionService';
import { speakText, stopSpeaking } from '../services/SceneGeneratorService';
import { resolveSceneImage } from '../data/xp-scene-registry';

const sessionManager = new LocalSessionManager();

/**
 * XPPlayer — Interactive branching narrative player
 * The core student-facing component for XP missions.
 * Renders scenes, choices, tracks progress, and manages session state.
 */
export const XPPlayer = ({ narrativeData, studentId = 'guest', onExit, onComplete }) => {
    const [session, setSession] = useState(null);
    const [currentNode, setCurrentNode] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [textRevealed, setTextRevealed] = useState(false);
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [showDialogue, setShowDialogue] = useState(false);
    const [narrationEnabled, setNarrationEnabled] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [showCorrection, setShowCorrection] = useState(null);
    const [nodeStartTime, setNodeStartTime] = useState(Date.now());
    const sceneRef = useRef(null);
    const textRef = useRef(null);

    const narrative = narrativeData?.narrative;
    const nodes = narrative?.nodes || [];

    // Initialize or resume session
    useEffect(() => {
        if (!narrative) return;

        const existing = sessionManager.findActiveSession(narrative.id);
        if (existing) {
            setSession(existing);
            const node = nodes.find(n => n.id === existing.current_node);
            setCurrentNode(node || nodes[0]);
        } else {
            const newSession = sessionManager.createSession(
                studentId,
                narrative.id,
                narrative.entry_node_id || nodes[0]?.id
            );
            setSession(newSession);
            setCurrentNode(nodes.find(n => n.id === narrative.entry_node_id) || nodes[0]);
        }
    }, [narrative, studentId]);

    // Reset text reveal on node change
    useEffect(() => {
        setTextRevealed(false);
        setDialogueIndex(0);
        setShowDialogue(false);
        setShowCorrection(null);
        setNodeStartTime(Date.now());

        // Auto-reveal text after a delay
        const timer1 = setTimeout(() => setTextRevealed(true), 300);
        // Show dialogue after text
        const timer2 = setTimeout(() => setShowDialogue(true), 800);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [currentNode?.id]);

    // Speak narration
    useEffect(() => {
        if (narrationEnabled && currentNode?.scene_text && textRevealed) {
            speakText(currentNode.scene_text, { rate: 0.85 });
        }
        return () => stopSpeaking();
    }, [narrationEnabled, currentNode?.id, textRevealed]);

    const handleChoice = useCallback((choice) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        stopSpeaking();

        const nextNode = nodes.find(n => n.id === choice.next_node);
        if (!nextNode) {
            console.error('[XPPlayer] Target node not found:', choice.next_node);
            setIsTransitioning(false);
            return;
        }

        // Check if we're hitting an error path — show correction first
        if (currentNode?.hidden_pedagogy?.is_error_path && currentNode?.hidden_pedagogy?.correction_text) {
            setShowCorrection(currentNode.hidden_pedagogy.correction_text);
        }

        // Record decision
        if (session) {
            const updated = sessionManager.recordDecision(
                session.id,
                currentNode,
                choice.id,
                choice.next_node
            );
            setSession(updated);
        }

        // Transition to next node
        setTimeout(() => {
            setCurrentNode(nextNode);
            setIsTransitioning(false);

            // Check for mission complete
            if (nextNode.type === 'end') {
                onComplete?.(session);
            }
        }, 600);
    }, [isTransitioning, currentNode, nodes, session, onComplete]);

    const getConceptProgress = useCallback(() => {
        if (!session?.concept_coverage || !narrative?.concept_map) return 0;
        const covered = Object.values(session.concept_coverage).filter(Boolean).length;
        const total = narrative.concept_map.length;
        return total > 0 ? Math.round((covered / total) * 100) : 0;
    }, [session, narrative]);

    const getNodeTypeIcon = (type) => {
        switch (type) {
            case 'convergence': return '🔀';
            case 'formalization': return '📐';
            case 'recap': return '📋';
            case 'end': return '🏆';
            case 'decision': return '⚡';
            default: return '📖';
        }
    };

    if (!narrative || !currentNode) {
        return (
            <div className="flex items-center justify-center h-full bg-[#0A1628] text-white">
                <div className="text-center">
                    <Sparkles className="mx-auto mb-4 animate-pulse" size={48} />
                    <p className="text-lg font-medium">Loading Mission...</p>
                </div>
            </div>
        );
    }

    const conceptProgress = getConceptProgress();
    const decisions = session?.decision_history?.length || 0;
    const xpEarned = session?.xp_earned || 0;

    // Mission Complete Screen
    if (currentNode.type === 'end') {
        return (
            <div className="h-full overflow-auto bg-gradient-to-b from-[#0A1628] via-[#1a1a2e] to-[#0A1628] text-white">
                <div className="max-w-3xl mx-auto px-6 py-12">
                    {/* Hero */}
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#C9B47C] to-[#8B6914] flex items-center justify-center shadow-[0_0_40px_rgba(201,180,124,0.4)]">
                            <Award size={48} />
                        </div>
                        <h1 className="text-4xl font-serif font-bold mb-3 bg-gradient-to-r from-[#C9B47C] to-[#fff] bg-clip-text text-transparent">
                            Mission Complete
                        </h1>
                        <p className="text-lg text-slate-400">{narrative.title}</p>
                    </div>

                    {/* Scene Text */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
                        <p className="text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                            {currentNode.scene_text}
                        </p>
                        {currentNode.character_dialogue?.map((line, i) => (
                            <div key={i} className="mt-4 pl-4 border-l-2 border-[#C9B47C]">
                                <span className="text-[#C9B47C] font-semibold capitalize">{line.character}: </span>
                                <span className="text-slate-200 italic">"{line.text}"</span>
                            </div>
                        ))}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { icon: Zap, label: 'XP Earned', value: xpEarned, color: '#C9B47C' },
                            { icon: Brain, label: 'Concepts Mastered', value: `${conceptProgress}%`, color: '#10B981' },
                            { icon: TrendingUp, label: 'Decisions Made', value: decisions, color: '#6366F1' },
                            { icon: Clock, label: 'Time', value: `${Math.round((Date.now() - new Date(session?.started_at).getTime()) / 60000)}m`, color: '#F59E0B' },
                        ].map(({ icon: Icon, label, value, color }) => (
                            <div key={label} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                                <Icon size={20} className="mx-auto mb-2" style={{ color }} />
                                <div className="text-2xl font-bold" style={{ color }}>{value}</div>
                                <div className="text-xs text-slate-500 mt-1">{label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Misconception Review */}
                    {(session?.misconception_hits?.length > 0) && (
                        <div className="bg-amber-500/10 rounded-xl p-6 mb-8 border border-amber-500/20">
                            <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                                <AlertTriangle size={18} />
                                Misconceptions Explored (This is Good!)
                            </h3>
                            <ul className="space-y-2">
                                {session.misconception_hits.map((m, i) => (
                                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                        <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>{m.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => onExit?.()}
                            className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all border border-white/10"
                        >
                            Return to Missions
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main Game View
    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-[#0A1628] via-[#0f1b30] to-[#0A1628] text-white overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/30 border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onExit?.()}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        title="Exit Mission"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h2 className="text-sm font-bold text-[#C9B47C]">{narrative.title}</h2>
                        <p className="text-xs text-slate-500">{narrative.subtitle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* XP Counter */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9B47C]/10 border border-[#C9B47C]/20">
                        <Zap size={14} className="text-[#C9B47C]" />
                        <span className="text-sm font-bold text-[#C9B47C]">{xpEarned} XP</span>
                    </div>
                    {/* Narration Toggle */}
                    <button
                        onClick={() => {
                            setNarrationEnabled(!narrationEnabled);
                            if (narrationEnabled) stopSpeaking();
                        }}
                        className={`p-2 rounded-lg transition-colors ${narrationEnabled ? 'bg-[#C9B47C]/20 text-[#C9B47C]' : 'text-slate-500 hover:bg-white/10'}`}
                        title={narrationEnabled ? 'Mute narration' : 'Enable narration'}
                    >
                        {narrationEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                </div>
            </div>

            {/* Scene Content */}
            <div ref={sceneRef} className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-6 py-8">
                    {/* Scene Image */}
                    {(() => {
                        const sceneImageSrc = resolveSceneImage(
                            currentNode.media?.scene_image_prompt || currentNode.scene_text || ''
                        );
                        return sceneImageSrc ? (
                            <div className="relative mb-8 rounded-2xl overflow-hidden border border-white/5 aspect-[21/9]">
                                <img
                                    src={sceneImageSrc}
                                    alt={currentNode.media?.scene_image_prompt?.substring(0, 60) || 'Scene'}
                                    className="w-full h-full object-cover transition-opacity duration-700"
                                    style={{ opacity: textRevealed ? 1 : 0.3 }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                {/* Gradient overlay for text readability */}
                                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A1628] to-transparent" />
                            </div>
                        ) : (
                            <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-white/5 aspect-[21/9]">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center opacity-60">
                                        <div className="text-4xl mb-2">{getNodeTypeIcon(currentNode.type)}</div>
                                        <p className="text-xs text-slate-500 max-w-xs px-4">
                                            {currentNode.media?.scene_image_prompt?.substring(0, 80)}...
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A1628] to-transparent" />
                            </div>
                        );
                    })()}

                    {/* Scene Text */}
                    <div
                        ref={textRef}
                        className={`transition-all duration-700 ${textRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    >
                        <p className="text-slate-200 leading-relaxed text-lg whitespace-pre-line mb-6" style={{ fontFamily: "'Georgia', serif" }}>
                            {currentNode.scene_text}
                        </p>
                    </div>

                    {/* Character Dialogue */}
                    <div className={`space-y-4 mb-8 transition-all duration-500 ${showDialogue ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {(currentNode.character_dialogue || []).map((line, i) => {
                            const character = narrative.characters?.find(c => c.id === line.character);
                            return (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 pl-4 border-l-2 border-[#C9B47C]/50"
                                    style={{ animationDelay: `${i * 200}ms` }}
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#C9B47C] to-[#8B6914] flex items-center justify-center text-sm font-bold text-[#0A1628] shadow-lg">
                                        {(character?.name || line.character)?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <span className="text-[#C9B47C] text-sm font-semibold capitalize block mb-0.5">
                                            {character?.name || line.character}
                                        </span>
                                        <span className="text-slate-200 italic leading-relaxed">
                                            "{line.text}"
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Correction Banner (shown when leaving an error path) */}
                    {showCorrection && (
                        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 animate-fade-in">
                            <div className="flex items-start gap-3">
                                <AlertTriangle size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-amber-300 font-semibold text-sm mb-1">Learning Moment</p>
                                    <p className="text-slate-300 text-sm leading-relaxed">{showCorrection}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Choices */}
                    {currentNode.choices && currentNode.choices.length > 0 && (
                        <div
                            className={`space-y-3 mt-8 transition-all duration-500 delay-300 ${showDialogue ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        >
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-4">
                                {currentNode.type === 'decision' ? '⚡ What do you do?' : 'Continue'}
                            </p>
                            {currentNode.choices.map((choice, i) => (
                                <button
                                    key={choice.id}
                                    onClick={() => handleChoice(choice)}
                                    disabled={isTransitioning}
                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group
                                        ${isTransitioning
                                            ? 'opacity-50 cursor-not-allowed border-white/5 bg-white/5'
                                            : 'border-white/10 bg-white/5 hover:bg-[#8B2332]/20 hover:border-[#8B2332]/40 hover:shadow-[0_0_20px_rgba(139,35,50,0.15)] cursor-pointer active:scale-[0.99]'
                                        }`}
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-[#C9B47C] group-hover:bg-[#8B2332] group-hover:text-white transition-colors">
                                            {choice.id.toUpperCase()}
                                        </span>
                                        <span className="text-slate-200 group-hover:text-white transition-colors font-medium">
                                            {choice.text}
                                        </span>
                                        <ChevronRight size={16} className="ml-auto text-slate-600 group-hover:text-[#C9B47C] transition-colors" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="flex-shrink-0 px-4 py-3 bg-black/40 border-t border-white/5">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    {/* Concept Progress */}
                    <div className="flex items-center gap-3 flex-1">
                        <BookOpen size={14} className="text-slate-500" />
                        <div className="flex-1 max-w-[200px]">
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#8B2332] to-[#C9B47C] rounded-full transition-all duration-500"
                                    style={{ width: `${conceptProgress}%` }}
                                />
                            </div>
                        </div>
                        <span className="text-xs text-slate-500">{conceptProgress}% concepts</span>
                    </div>

                    {/* Decision Counter */}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                            <Map size={12} />
                            {decisions} decisions
                        </span>
                        {session?.misconception_hits?.length > 0 && (
                            <span className="flex items-center gap-1 text-amber-500">
                                <AlertTriangle size={12} />
                                {session.misconception_hits.length} explored
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default XPPlayer;
