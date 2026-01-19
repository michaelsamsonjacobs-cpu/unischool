import React, { useState, useEffect, useRef } from 'react';
import { GeminiService } from '../services/GeminiService.js';
import { SearchService } from '../services/SearchService.js';
import { Send, Bot, User, Loader2, Paperclip, Sparkles, ArrowUp, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import transferPathways from '../data/transfer-pathways.json';
import { PersonalitySelector, PERSONALITIES } from './PersonalitySelector';

export const ChatInterface = ({ onVisualUpdate }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Welcome to University School. I am Navigator, your academic strategist. How can I help you optimize your path today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [personaId, setPersonaId] = useState('socratic');
    const [showSettings, setShowSettings] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const localContext = await SearchService.getLocalContext(input);
            const matrixData = JSON.stringify(transferPathways, null, 2);

            const systemPrompt = `You are Navigator, the AI guidance counselor and strategic advisor for University School.
            Your mission is to help students treating their education like an open-world RPG, where classes are quests and degrees are the victory condition.
            
            You have access to "The Matrix" (Guaranteed Transfer Pathways):
            ${matrixData}
            
            LOCAL CONTEXT (User's Workspace/Notes):
            ${localContext}
            
            INSTRUCTIONS:
            - **Persona**: ${PERSONALITIES.find(p => p.id === personaId)?.prompt_modifier || "You are wise, encouraging, and tactical."}
            - **Enrollment**: Help students pick the right "quests" (classes) to unlock transfer guarantees.
            - **The Matrix**: Always check the provided transfer data. If a student mentions a goal (e.g. "I want to study CS"), find the best P0 (Guaranteed) or P1 pathways for them.
            - **Terminology**: Use terms like "XP" (credits), "Guilds" (majors), "Boss Battles" (exams), and "Transfer Portal" (admission).
            - **Visuals**: If helpful, generate simple visual plans using strict <visual> tags.
            - **Advisor**: You work in tandem with human Advisors (Berkeley staff).`;

            const aiResponse = await GeminiService.generate(input, systemPrompt);

            const visualMatch = aiResponse.match(/<visual>([\s\S]*?)<\/visual>/);
            if (visualMatch && visualMatch[1]) {
                onVisualUpdate(visualMatch[1].trim());
            }

            setMessages(prev => [...prev, { role: 'assistant', text: aiResponse.replace(/<visual>[\s\S]*?<\/visual>/g, '[Visual Plan Generated]') }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', text: `Error: ${error.message}` }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="h-[70px] border-b border-[var(--border-subtle)] flex items-center justify-between px-6 bg-[var(--bg-surface)]/90 backdrop-blur shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B2332] to-[#C9B47C] flex items-center justify-center shadow-lg shadow-crimson/20">
                        <Sparkles size={16} className="text-white" />
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">Navigator</span>
                        <span className="ml-2 px-2 py-0.5 rounded-full text-[9px] bg-[var(--accent-green)]/10 text-[var(--accent-green)] font-medium">
                            {PERSONALITIES.find(p => p.id === personaId)?.name}
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
                >
                    {showSettings ? <X size={16} className="text-slate-400" /> : <Settings size={16} className="text-slate-400" />}
                </button>
            </div>

            {/* Settings / Persona Selector Overlay */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b border-slate-700 bg-slate-900/95 overflow-hidden z-10"
                    >
                        <div className="p-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Navigator Personality</h3>
                            <PersonalitySelector
                                selectedId={personaId}
                                onSelect={(id) => {
                                    setPersonaId(id);
                                    setShowSettings(false);
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#FAF8F5]">
                <AnimatePresence>
                    {messages.map((m, i) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            key={i}
                            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {m.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B2332] to-[#C9B47C] flex items-center justify-center shrink-0 shadow-sm border border-white">
                                    <Bot size={16} className="text-white" />
                                </div>
                            )}

                            <div className={`max-w-[75%] px-5 py-3 shadow-sm text-[15px] leading-relaxed relative ${m.role === 'user'
                                ? 'bg-[#8B2332] text-white rounded-2xl rounded-tr-sm'
                                : 'bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-sm'
                                }`}>
                                <div className="whitespace-pre-wrap">{m.text}</div>
                            </div>

                            {m.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                    <User size={16} className="text-slate-500" />
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-3"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B2332] to-[#C9B47C] flex items-center justify-center shrink-0 shadow-sm">
                                <Bot size={16} className="text-white" />
                            </div>
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin text-[#8B2332]" />
                                <span className="text-sm text-slate-500 font-medium">Processing...</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto flex items-end gap-2 bg-slate-50 p-2 rounded-[24px] border border-slate-200 focus-within:border-[#8B2332]/50 focus-within:ring-4 focus-within:ring-[#8B2332]/5 transition-all">
                    <button className="p-2.5 text-slate-400 hover:text-[#8B2332] hover:bg-[#8B2332]/10 rounded-full transition-colors shrink-0">
                        <Paperclip size={20} />
                    </button>

                    <textarea
                        className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-[120px] min-h-[44px] py-2.5 text-slate-700 placeholder:text-slate-400 text-[15px]"
                        placeholder="Message Navigator..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        style={{ height: '44px' }}
                    />

                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className={`p-2.5 rounded-full shrink-0 transition-all duration-200 ${input.trim()
                                ? 'bg-[#8B2332] text-white shadow-md hover:scale-105 active:scale-95'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <ArrowUp size={20} strokeWidth={2.5} />}
                    </button>
                </div>

                <div className="flex items-center justify-center gap-2 mt-3 text-[10px] text-slate-400 font-medium opacity-60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Secure Local Context Active
                </div>
            </div>
        </div>
    );
};
