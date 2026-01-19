import React from 'react';
import { Sparkles, Brain, Zap, Coffee, Shield } from 'lucide-react';

export const PERSONALITIES = [
    {
        id: 'socratic',
        name: 'The Philosopher',
        icon: Brain,
        color: '#C9B47C',
        description: 'Asks guiding questions. Never gives the answer directly. Helps you think.',
        prompt_modifier: "You are a Socratic tutor. Never give the answer directly. Instead, ask guiding questions to help the student derive the answer themselves."
    },
    {
        id: 'drill_sergeant',
        name: 'The Commander',
        icon: Shield,
        color: '#8B2332',
        description: 'Strict, direct, and results-oriented. Focuses on discipline and efficiency.',
        prompt_modifier: "You are a strict Drill Sergeant. Be direct, concise, and focus on results. Do not coddle. Use military metaphors. Demand excellence."
    },
    {
        id: 'peer',
        name: 'The Study Buddy',
        icon: Coffee,
        color: '#3b82f6',
        description: 'Casual, encouraging, and relatable. Like a smart friend helping you out.',
        prompt_modifier: "You are a supportive peer/study buddy. Be casual, use emojis, and be encouraging. Explain things simply like a friend."
    },
    {
        id: 'hacker',
        name: 'The Hacker',
        icon: Zap,
        color: '#10b981',
        description: 'Tech-savvy, fast, and shortcut-focused. Loves optimization and code.',
        prompt_modifier: "You are a tech-savvy hacker. Focus on efficiency, shortcuts, and optimization. Use tech slang. Treat learning like 'leveling up' or 'hacking the system'."
    }
];

export const PersonalitySelector = ({ selectedId, onSelect }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PERSONALITIES.map(persona => {
                const Icon = persona.icon;
                const isSelected = selectedId === persona.id;

                return (
                    <button
                        key={persona.id}
                        onClick={() => onSelect(persona.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${isSelected
                                ? 'bg-slate-800 border-[#C9B47C] ring-1 ring-[#C9B47C]'
                                : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className={`p-3 rounded-lg ${isSelected ? 'bg-[#C9B47C] text-slate-900' : 'bg-slate-700 text-slate-400'}`}
                            >
                                <Icon size={24} />
                            </div>
                            <div>
                                <h3 className={`font-bold ${isSelected ? 'text-[#C9B47C]' : 'text-white'}`}>
                                    {persona.name}
                                </h3>
                                <p className="text-sm text-slate-400 mt-1">
                                    {persona.description}
                                </p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};
