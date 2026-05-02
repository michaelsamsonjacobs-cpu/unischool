import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, Volume2, VolumeX, Zap, BookOpen, AlertTriangle, CheckCircle, ArrowLeft, Award, Brain, TrendingUp, Gamepad2 } from 'lucide-react';
import { LocalSessionManager } from '../services/XPSessionService';
import { speakText, stopSpeaking } from '../services/SceneGeneratorService';
import { resolveSceneImage } from '../data/xp-scene-registry';
import { getZoneForNode } from './VoxelScene';

const sessionManager = new LocalSessionManager();

/**
 * XPGame3D — Immersive 3D game player
 * Renders the Wright Brothers physics narrative inside a voxel world.
 */
export const XPGame3D = ({ narrativeData, studentId = 'guest', onExit }) => {
    const [session, setSession] = useState(null);
    const [currentNode, setCurrentNode] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [textRevealed, setTextRevealed] = useState(false);
    const [showDialogue, setShowDialogue] = useState(false);
    const [narrationEnabled, setNarrationEnabled] = useState(false);
    const [showCorrection, setShowCorrection] = useState(null);
    const [activeZone, setActiveZone] = useState('workshop');
    const [showCompletionScreen, setShowCompletionScreen] = useState(false);
    const panelRef = useRef(null);

    const narrative = narrativeData?.narrative;
    const nodes = narrative?.nodes || [];

    // Initialize session
    useEffect(() => {
        if (!narrative) return;
        const existing = sessionManager.findActiveSession(narrative.id);
        if (existing) {
            setSession(existing);
            const node = nodes.find(n => n.id === existing.current_node);
            setCurrentNode(node || nodes[0]);
        } else {
            const newSession = sessionManager.createSession(studentId, narrative.id, narrative.entry_node_id || nodes[0]?.id);
            setSession(newSession);
            setCurrentNode(nodes.find(n => n.id === narrative.entry_node_id) || nodes[0]);
        }
    }, [narrative, studentId]);

    // Update zone and text on node change
    useEffect(() => {
        if (!currentNode) return;
        setTextRevealed(false);
        setShowDialogue(false);
        setShowCorrection(null);
        setActiveZone(getZoneForNode(currentNode.id));
        const t1 = setTimeout(() => setTextRevealed(true), 400);
        const t2 = setTimeout(() => setShowDialogue(true), 900);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [currentNode?.id]);

    // Narration
    useEffect(() => {
        if (narrationEnabled && currentNode?.scene_text && textRevealed) {
            speakText(currentNode.scene_text, { rate: 0.85 });
        }
        return () => stopSpeaking();
    }, [narrationEnabled, currentNode?.id, textRevealed]);

    const handleChoice = useCallback((choice) => {
        if (isTransitioning) return;
        setIsTransitioning(true);

        // Record decision
        if (session) {
            const timeSpent = Math.round((Date.now() - (session._nodeStart || Date.now())) / 1000);
            session.decisions = session.decisions || [];
            session.decisions.push({
                from: currentNode.id, to: choice.next_node,
                choice_id: choice.id, tag: choice.hidden_tag || null,
                xp: choice.xp_bonus || 0, time_seconds: timeSpent,
            });
            session.xp_earned = (session.xp_earned || 0) + (choice.xp_bonus || 0);
            session.current_node = choice.next_node;

            // Track concepts
            const pedagogy = currentNode.hidden_pedagogy;
            if (pedagogy?.concepts_covered?.length) {
                session.concepts_covered = [...new Set([...(session.concepts_covered || []), ...pedagogy.concepts_covered])];
            }
            if (pedagogy?.misconception_tested && choice.hidden_tag?.includes('misconception')) {
                session.misconception_hits = [...new Set([...(session.misconception_hits || []), pedagogy.misconception_tested])];
            }
            sessionManager.saveSession?.(session);
        }

        // Check if exit
        const exitNodes = narrative.exit_node_ids || [];
        if (exitNodes.includes(choice.next_node)) {
            setTimeout(() => {
                setShowCompletionScreen(true);
                setIsTransitioning(false);
            }, 600);
            return;
        }

        // Navigate
        setTimeout(() => {
            const next = nodes.find(n => n.id === choice.next_node);
            if (next) {
                setCurrentNode(next);
                session._nodeStart = Date.now();
            }
            setIsTransitioning(false);
        }, 600);
    }, [isTransitioning, currentNode, session, nodes, narrative]);

    // Progress calculations
    const totalConcepts = narrative?.concept_map?.length || 10;
    const coveredConcepts = session?.concepts_covered?.length || 0;
    const conceptProgress = Math.round((coveredConcepts / totalConcepts) * 100);
    const xpEarned = session?.xp_earned || 0;
    const decisions = session?.decisions?.length || 0;

    if (!currentNode || !narrative) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#0A1628] text-white">
                <div className="animate-pulse text-xl">Loading Wright Lab...</div>
            </div>
        );
    }

    // ─── Completion Screen ───────────────────────────────
    if (showCompletionScreen) {
        return (
            <div className="h-screen bg-gradient-to-b from-[#0A1628] via-[#1a1040] to-[#0A1628] text-white flex items-center justify-center">
                <div className="text-center max-w-lg px-6 space-y-8 animate-fade-in">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#C9B47C] to-[#8B6914] flex items-center justify-center shadow-2xl">
                        <Award size={48} className="text-[#0A1628]" />
                    </div>
                    <h1 className="text-4xl font-serif font-bold">Mission Complete</h1>
                    <p className="text-slate-400 text-lg">You helped the Wright Brothers understand the forces of flight.</p>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <Zap size={20} className="text-[#C9B47C] mx-auto mb-2" />
                            <div className="text-2xl font-bold text-[#C9B47C]">{xpEarned}</div>
                            <div className="text-xs text-slate-500">XP Earned</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <Brain size={20} className="text-emerald-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-emerald-400">{conceptProgress}%</div>
                            <div className="text-xs text-slate-500">Concepts</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <TrendingUp size={20} className="text-blue-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-blue-400">{decisions}</div>
                            <div className="text-xs text-slate-500">Decisions</div>
                        </div>
                    </div>
                    <button onClick={() => onExit?.()} className="px-8 py-3 rounded-xl bg-[#8B2332] hover:bg-[#A52A3A] text-white font-semibold transition-all">
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    // Scene image for the current node
    const sceneImageSrc = resolveSceneImage(
        currentNode?.media?.scene_image_prompt || currentNode?.scene_text || ''
    );

    // Zone-specific accent colors
    const zoneAccents = {
        workshop: '#C9A96E', push_test: '#D4A574', bicycle: '#6B9080',
        sand_drawing: '#E8D5A3', propeller: '#8899AA', launch: '#F0C040', flight: '#80B0FF',
    };
    const accent = zoneAccents[activeZone] || '#C9A96E';

    // ─── Main Game View ──────────────────────────────────
    return (
        <div className="h-screen w-screen flex flex-col bg-[#0A1628] text-white overflow-hidden relative">
            {/* Scene Image Background */}
            <div className="absolute inset-0 z-0">
                {sceneImageSrc && (
                    <img
                        key={currentNode.id}
                        src={sceneImageSrc}
                        alt=""
                        className="w-full h-full object-cover"
                        style={{
                            filter: 'brightness(0.6) saturate(1.2)',
                            animation: 'sceneIn 1.2s ease-out',
                        }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                )}
                {/* Animated vignette + zone-color tint */}
                <div className="absolute inset-0" style={{
                    background: `
                        radial-gradient(ellipse at 70% 50%, transparent 30%, rgba(10,22,40,0.7) 70%),
                        linear-gradient(to right, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.5) 35%, rgba(10,22,40,0.15) 55%, transparent 75%),
                        linear-gradient(to bottom, rgba(10,22,40,0.4) 0%, transparent 30%, transparent 70%, rgba(10,22,40,0.6) 100%)
                    `,
                }} />
                {/* Zone accent glow */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: `radial-gradient(circle at 65% 45%, ${accent}15 0%, transparent 50%)`,
                    transition: 'all 1.5s ease',
                }} />
                {/* Floating dust particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            width: 2 + Math.random() * 3, height: 2 + Math.random() * 3,
                            borderRadius: '50%', backgroundColor: accent,
                            opacity: 0.1 + Math.random() * 0.2,
                            left: `${30 + Math.random() * 65}%`,
                            top: `${Math.random() * 90}%`,
                            animation: `particleDrift ${4 + Math.random() * 6}s ease-in-out infinite alternate`,
                            animationDelay: `${Math.random() * 4}s`,
                        }} />
                    ))}
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes sceneIn {
                    from { opacity: 0; transform: scale(1.05); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes particleDrift {
                    0% { transform: translateY(0) translateX(0); opacity: 0.1; }
                    50% { opacity: 0.3; }
                    100% { transform: translateY(-20px) translateX(12px); opacity: 0.05; }
                }
            `}</style>

            {/* Top HUD */}
            <div className="relative z-10 flex items-center justify-between px-6 py-4 bg-black/30 backdrop-blur-sm border-b border-white/5">
                <div className="flex items-center gap-3">
                    <button onClick={() => onExit?.()} className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Exit">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h2 className="text-sm font-bold text-[#C9B47C] flex items-center gap-2">
                            <Gamepad2 size={16} />
                            {narrative.title}
                        </h2>
                        <p className="text-xs text-slate-500">{narrative.subtitle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9B47C]/10 border border-[#C9B47C]/20">
                        <Zap size={14} className="text-[#C9B47C]" />
                        <span className="text-sm font-bold text-[#C9B47C]">{xpEarned} XP</span>
                    </div>
                    <button
                        onClick={() => { setNarrationEnabled(!narrationEnabled); if (narrationEnabled) stopSpeaking(); }}
                        className={`p-2 rounded-lg transition-colors ${narrationEnabled ? 'bg-[#C9B47C]/20 text-[#C9B47C]' : 'text-slate-500 hover:bg-white/10'}`}
                    >
                        {narrationEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                </div>
            </div>

            {/* Left Panel — Story + Choices */}
            <div className="relative z-10 flex-1 flex items-end pb-6 pointer-events-none">
                <div ref={panelRef} className="w-full max-w-lg ml-6 pointer-events-auto max-h-[calc(100vh-160px)] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#C9B47C33 transparent' }}>
                    <div className="bg-[#0A1628]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 space-y-5">
                        {/* Zone Badge */}
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-[#8B2332]/20 text-[#C9B47C] text-xs font-bold uppercase tracking-wider border border-[#8B2332]/30">
                                📍 {activeZone.replace(/_/g, ' ')}
                            </span>
                            <span className="text-xs text-slate-600">Node {currentNode.id}</span>
                        </div>

                        {/* Scene Text */}
                        <div className={`transition-all duration-700 ${textRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <p className="text-slate-200 leading-relaxed whitespace-pre-line" style={{ fontFamily: "'Georgia', serif" }}>
                                {currentNode.scene_text}
                            </p>
                        </div>

                        {/* Dialogue */}
                        <div className={`space-y-3 transition-all duration-500 ${showDialogue ? 'opacity-100' : 'opacity-0'}`}>
                            {(currentNode.character_dialogue || []).map((line, i) => {
                                const character = narrative.characters?.find(c => c.id === line.character);
                                return (
                                    <div key={i} className="flex items-start gap-3 pl-3 border-l-2 border-[#C9B47C]/50">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#C9B47C] to-[#8B6914] flex items-center justify-center text-xs font-bold text-[#0A1628]">
                                            {(character?.name || line.character)?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <span className="text-[#C9B47C] text-xs font-semibold capitalize block">{character?.name || line.character}</span>
                                            <span className="text-slate-300 italic text-sm">"{line.text}"</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Correction */}
                        {showCorrection && (
                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle size={16} className="text-amber-400 mt-0.5" />
                                    <div>
                                        <p className="text-amber-300 font-semibold text-xs">Learning Moment</p>
                                        <p className="text-slate-300 text-sm">{showCorrection}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Choices */}
                        {currentNode.choices?.length > 0 && (
                            <div className={`space-y-2 pt-2 border-t border-white/5 transition-all duration-500 delay-200 ${showDialogue ? 'opacity-100' : 'opacity-0'}`}>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                                    {currentNode.type === 'decision' ? '⚡ What do you do?' : 'Continue'}
                                </p>
                                {currentNode.choices.map((choice, i) => (
                                    <button
                                        key={choice.id}
                                        onClick={() => handleChoice(choice)}
                                        disabled={isTransitioning}
                                        className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group
                                            ${isTransitioning
                                                ? 'opacity-50 cursor-not-allowed border-white/5 bg-white/5'
                                                : 'border-white/10 bg-white/5 hover:bg-[#8B2332]/30 hover:border-[#8B2332]/50 cursor-pointer active:scale-[0.98]'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-[#C9B47C] group-hover:bg-[#8B2332] group-hover:text-white transition-colors">
                                                {choice.id.toUpperCase()}
                                            </span>
                                            <span className="text-sm text-slate-200 group-hover:text-white transition-colors">{choice.text}</span>
                                            <ChevronRight size={14} className="ml-auto text-slate-600 group-hover:text-[#C9B47C]" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="relative z-10 px-6 py-3 bg-black/40 backdrop-blur-sm border-t border-white/5">
                <div className="flex items-center justify-between max-w-5xl mx-auto">
                    <div className="flex items-center gap-3">
                        <BookOpen size={14} className="text-slate-500" />
                        <div className="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#8B2332] to-[#C9B47C] rounded-full transition-all duration-500" style={{ width: `${conceptProgress}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{conceptProgress}% concepts</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{decisions} decisions</span>
                        {session?.misconception_hits?.length > 0 && (
                            <span className="text-amber-500 flex items-center gap-1">
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

export default XPGame3D;
