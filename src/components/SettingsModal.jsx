import React, { useState } from 'react';
import { X, Cpu, Globe, Key, Database, Zap, Check, AlertCircle, HardDrive, Layout, Server, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const SettingsModal = ({
    onClose,
    provider, setProvider,
    localEndpoint, setLocalEndpoint,
    localModel, setLocalModel,
    geminiKey, setGeminiKey,
    groqKey, setGroqKey,
    activeTab: initialTab, setActiveTab: initialSetActiveTab, // Handle conflicting props if any
    embeddingMode, setEmbeddingMode,
    onIndexCodebase, indexingStatus,
    feedbackStats,
    gpuInfo, webGpuSupported,
    workspaces, addWorkspace, removeWorkspace,
    testConnection, testingConnection, connectionStatus
}) => {
    const [activeTab, setActiveTab] = useState('inference'); // inference, intelligence, hardware, workspaces

    const TABS = [
        { id: 'inference', label: 'AI Engine', icon: Cpu },
        { id: 'intelligence', label: 'Knowledge', icon: Database },
        { id: 'hardware', label: 'Hardware', icon: HardDrive },
        { id: 'workspaces', label: 'Project', icon: Layout },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">System Preferences</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-48 bg-slate-50 border-r border-slate-100 p-4 space-y-1">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-white text-[#8B2332] shadow-sm ring-1 ring-slate-200'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 overflow-y-auto bg-white">

                        {/* INFERENCE TAB */}
                        {activeTab === 'inference' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Model Provider</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {[
                                            { id: 'ollama', label: 'Ollama', icon: Server, desc: 'Local API' },
                                            { id: 'webgpu', label: 'WebGPU', icon: Zap, desc: 'In-Browser' },
                                            { id: 'gemini', label: 'Gemini', icon: Globe, desc: 'Google Cloud' },
                                            { id: 'groq', label: 'Groq', icon: Zap, desc: 'Ultra-Fast Cloud' }
                                        ].map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => setProvider(p.id)}
                                                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${provider === p.id
                                                    ? 'border-[#8B2332] bg-[#8B2332]/5 text-[#8B2332]'
                                                    : 'border-slate-200 hover:border-[#8B2332]/50 hover:bg-slate-50 text-slate-600'
                                                    }`}
                                            >
                                                <p.icon size={20} className="mb-2" />
                                                <div className="font-bold text-sm">{p.label}</div>
                                                <div className="text-[10px] opacity-75">{p.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {provider === 'ollama' && (
                                    <div className="space-y-4 pt-4 border-t border-slate-100">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-2">Endpoint URL</label>
                                                <input
                                                    value={localEndpoint}
                                                    onChange={(e) => setLocalEndpoint(e.target.value)}
                                                    className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-[#8B2332] outline-none"
                                                    placeholder="http://localhost:11434"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-2">Model Tag</label>
                                                <input
                                                    value={localModel}
                                                    onChange={(e) => setLocalModel(e.target.value)}
                                                    className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-[#8B2332] outline-none"
                                                    placeholder="llama3"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={testConnection}
                                                disabled={testingConnection}
                                                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 disabled:opacity-50"
                                            >
                                                {testingConnection ? 'Testing...' : 'Test Connection'}
                                            </button>
                                            {connectionStatus !== null && (
                                                <div className={`text-sm flex items-center gap-2 ${connectionStatus ? 'text-green-600' : 'text-red-500'}`}>
                                                    {connectionStatus ? <Check size={16} /> : <AlertCircle size={16} />}
                                                    {connectionStatus ? 'Connected' : 'Failed'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {provider === 'gemini' && (
                                    <div className="pt-4 border-t border-slate-100">
                                        <label className="block text-xs font-bold text-slate-500 mb-2">Gemini API Key</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={geminiKey}
                                                onChange={(e) => setGeminiKey(e.target.value)}
                                                className="w-full p-2.5 pl-10 rounded-lg border border-slate-200 text-sm focus:border-[#8B2332] outline-none"
                                                placeholder="AIza..."
                                            />
                                            <Key size={16} className="absolute left-3 top-2.5 text-slate-400" />
                                        </div>
                                    </div>
                                )}

                                {provider === 'groq' && (
                                    <div className="pt-4 border-t border-slate-100">
                                        <label className="block text-xs font-bold text-slate-500 mb-2">Groq API Key</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={groqKey}
                                                onChange={(e) => setGroqKey(e.target.value)}
                                                className="w-full p-2.5 pl-10 rounded-lg border border-slate-200 text-sm focus:border-[#8B2332] outline-none"
                                                placeholder="gsk_..."
                                            />
                                            <Key size={16} className="absolute left-3 top-2.5 text-slate-400" />
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-2">
                                            Get your key at <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-[#8B2332] hover:underline">console.groq.com</a>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* KNOWLEDGE TAB */}
                        {activeTab === 'intelligence' && (
                            <div className="space-y-6">
                                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-start gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Database size={20} /></div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm">Semantic Index</h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Your codebase is indexed locally. AI uses this index to answer context-aware questions.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Embedding Engine</label>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setEmbeddingMode('transformers')}
                                            className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-all ${embeddingMode === 'transformers' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 hover:bg-slate-50'
                                                }`}
                                        >
                                            In-Browser (Transformers.js)
                                        </button>
                                        <button
                                            onClick={() => setEmbeddingMode('ollama')}
                                            className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-all ${embeddingMode === 'ollama' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 hover:bg-slate-50'
                                                }`}
                                        >
                                            Local (Ollama)
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={onIndexCodebase}
                                    disabled={!!indexingStatus}
                                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-75 transition-all"
                                >
                                    {indexingStatus ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="animate-spin text-lg">⟳</span> Indexing... {indexingStatus.progress}%
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Database size={16} /> Re-Index Codebase
                                        </span>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* HARDWARE TAB */}
                        {activeTab === 'hardware' && (
                            <div className="space-y-6">
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-4">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Cpu size={20} /></div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm">Local Compute</h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {gpuInfo ? gpuInfo.description : (webGpuSupported ? "Compatible GPU Detected" : "No WebGPU Access")}
                                        </p>
                                        {gpuInfo && <div className="mt-2 text-[10px] font-mono bg-blue-100/50 p-1 px-2 rounded w-fit">{gpuInfo.device}</div>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* WORKSPACES TAB (Partial) */}
                        {activeTab === 'workspaces' && (
                            <div className="text-center text-slate-400 py-10">
                                <Layout size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Project management coming soon.</p>
                            </div>
                        )}

                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors">Close</button>
                    <button onClick={onClose} className="px-4 py-2 bg-[#8B2332] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#7a1e2b] transition-colors">Done</button>
                </div>
            </motion.div>
        </div>
    );
};
