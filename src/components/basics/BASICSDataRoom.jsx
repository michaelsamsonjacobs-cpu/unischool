import React, { useState } from 'react';
import {
    FileText, CheckCircle, Upload, ExternalLink, Lock, Shield,
    Video, BarChart3, Users, Presentation, Lightbulb, Briefcase, AlertCircle
} from 'lucide-react';

/**
 * BASICSDataRoom — Standardized data room filled with class assignments.
 * Founders complete this to unlock the investor section.
 *
 * Required deliverables:
 * - Executive Summary
 * - Pitch Deck
 * - Pitch Video (recorded internally via BASICSVideoRecorder)
 * - Financial Model
 * - Product Demo / MVP
 * - Customer Discovery Results
 * - Market Research
 */

const DATA_ROOM_ITEMS = [
    { id: 'exec-summary', title: 'Executive Summary', description: '1-page overview of your company, problem, solution, traction, and ask.', icon: FileText, type: 'document', required: true },
    { id: 'pitch-deck', title: 'Pitch Deck', description: 'Investor-ready deck (10-15 slides). Follow BASICS format.', icon: Presentation, type: 'document', required: true },
    { id: 'pitch-video', title: 'Pitch Video', description: 'Record your 3-minute pitch using the built-in recorder.', icon: Video, type: 'video', required: true },
    { id: 'financial-model', title: 'Financial Model', description: '3-year financial projections with unit economics.', icon: BarChart3, type: 'spreadsheet', required: true },
    { id: 'product-demo', title: 'Product Demo / MVP', description: 'Link to live product, prototype, or demo video.', icon: Lightbulb, type: 'link', required: true },
    { id: 'customer-discovery', title: 'Customer Discovery Results', description: 'Summary of 20 customer interviews with key insights.', icon: Users, type: 'document', required: true },
    { id: 'market-research', title: 'Market Research', description: 'TAM/SAM/SOM analysis and competitive landscape.', icon: Briefcase, type: 'document', required: true },
];

export const BASICSDataRoom = ({ student, companyName, onOpenRecorder, onBack }) => {
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem(`basics_dataroom_${student?.email}`);
        return saved ? JSON.parse(saved) : DATA_ROOM_ITEMS.map(item => ({ ...item, status: 'empty', fileUrl: null, fileName: null }));
    });

    const saveItems = (updated) => {
        setItems(updated);
        localStorage.setItem(`basics_dataroom_${student?.email}`, JSON.stringify(updated));
    };

    const handleFileUpload = (itemId) => {
        // In production: S3/Firebase Storage upload
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.doc,.docx,.pptx,.xlsx,.csv,.mp4,.webm,.png,.jpg';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const updated = items.map(item =>
                    item.id === itemId
                        ? { ...item, status: 'uploaded', fileName: file.name, fileUrl: URL.createObjectURL(file) }
                        : item
                );
                saveItems(updated);
            }
        };
        input.click();
    };

    const handleLinkSubmit = (itemId, url) => {
        const updated = items.map(item =>
            item.id === itemId
                ? { ...item, status: 'uploaded', fileName: url, fileUrl: url }
                : item
        );
        saveItems(updated);
    };

    const completedCount = items.filter(i => i.status === 'uploaded').length;
    const totalRequired = items.filter(i => i.required).length;
    const isComplete = completedCount >= totalRequired;
    const progress = Math.round((completedCount / totalRequired) * 100);

    return (
        <div className="min-h-screen bg-[#FAF8F5]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#003262] to-[#001a3d] text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button onClick={onBack} className="text-white/50 hover:text-white text-sm flex items-center gap-1 transition-colors mb-4">
                        ← Back to Course
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <Shield size={20} className="text-[#C9B47C]" />
                        <span className="text-xs font-bold text-[#C9B47C] uppercase tracking-widest">Data Room</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {companyName || 'Your Company'} <span className="text-[#C9B47C]">Data Room</span>
                    </h1>
                    <p className="text-white/50 text-sm mb-6">
                        Complete all required deliverables to unlock the investor section and start raising.
                    </p>

                    {/* Progress */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#C9B47C] to-[#22c55e] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-sm font-bold text-[#C9B47C]">{completedCount}/{totalRequired}</span>
                    </div>

                    {isComplete && (
                        <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-400" />
                            <span className="text-green-300 text-sm font-bold">Data Room Complete — Investor section unlocked!</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Items Grid */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="space-y-4">
                    {items.map((item) => {
                        const Icon = DATA_ROOM_ITEMS.find(d => d.id === item.id)?.icon || FileText;
                        const isVideo = item.type === 'video';
                        const isLink = item.type === 'link';

                        return (
                            <div key={item.id} className={`p-5 rounded-2xl border transition-all ${
                                item.status === 'uploaded'
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-white border-slate-200 hover:shadow-md'
                            }`}>
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                        item.status === 'uploaded' ? 'bg-green-500' : 'bg-slate-100'
                                    }`}>
                                        {item.status === 'uploaded'
                                            ? <CheckCircle size={18} className="text-white" />
                                            : <Icon size={18} className="text-slate-400" />
                                        }
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-[#2D2D2D] text-sm">{item.title}</h3>
                                            {item.required && (
                                                <span className="text-[9px] font-bold text-red-500 uppercase bg-red-50 px-1.5 py-0.5 rounded">Required</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 mb-3">{item.description}</p>

                                        {item.status === 'uploaded' && (
                                            <div className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
                                                <CheckCircle size={10} />
                                                {item.fileName}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-shrink-0">
                                        {isVideo ? (
                                            <button
                                                onClick={onOpenRecorder}
                                                className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                                            >
                                                <Video size={12} /> Record
                                            </button>
                                        ) : isLink ? (
                                            <button
                                                onClick={() => {
                                                    const url = prompt('Paste your product/demo URL:');
                                                    if (url) handleLinkSubmit(item.id, url);
                                                }}
                                                className="text-xs font-bold text-[#003262] bg-[#003262]/5 hover:bg-[#003262]/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                                            >
                                                <ExternalLink size={12} /> Add Link
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleFileUpload(item.id)}
                                                className="text-xs font-bold text-[#003262] bg-[#003262]/5 hover:bg-[#003262]/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                                            >
                                                <Upload size={12} /> Upload
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
