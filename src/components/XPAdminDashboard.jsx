import React, { useState, useEffect, useCallback } from 'react';
import {
    Gamepad2, Upload, Brain, BookOpen, FileText, Video, CheckCircle,
    AlertCircle, Clock, ChevronRight, Layers, BarChart3, Users,
    Settings, RefreshCw, Eye, Edit3, Trash2, ArrowLeft, Sparkles,
    Target, TrendingUp, AlertTriangle, Database, Cpu, Zap,
    Play, Download, Archive, Plus, Wand2, Library
} from 'lucide-react';
import IngestService from '../services/IngestService';
import MissionStore from '../services/MissionStore';
import { quickGenerate, getStylePresets } from '../services/NarrativeGeneratorService';

// Import built-in demo missions
import physicsDemoData from '../data/xp-demo-physics.json';
import econDemoData from '../data/xp-demo-economics.json';
import bioDemoData from '../data/xp-demo-biology.json';
import psyDemoData from '../data/xp-demo-psychology.json';

const BUILT_IN_DEMOS = [
    { data: physicsDemoData, status: 'published' },
    { data: econDemoData, status: 'published' },
    { data: bioDemoData, status: 'published' },
    { data: psyDemoData, status: 'published' },
];
/**
 * XPAdminDashboard — School admin CMS for managing the XP Engine content pipeline
 * Sections: Pipeline Monitor, Course Catalog, Content Upload, Analytics, Compliance
 */

// Pipeline stages
const PIPELINE_STAGES = [
    { id: 'ingested', label: 'Ingested', icon: Upload, color: '#6366F1' },
    { id: 'concepts_extracted', label: 'Concepts', icon: Brain, color: '#8B5CF6' },
    { id: 'narrative_generated', label: 'Narrative', icon: Gamepad2, color: '#EC4899' },
    { id: 'art_generated', label: 'Art & Audio', icon: Sparkles, color: '#F59E0B' },
    { id: 'published', label: 'Published', icon: CheckCircle, color: '#10B981' },
];

function buildPipelineFromStore() {
    // Built-in demos always show
    const items = BUILT_IN_DEMOS.map(({ data }) => ({
        id: data.narrative?.id || data.chapter?.id,
        course: data.course?.id,
        chapter: data.chapter?.title,
        source_type: 'built_in',
        status: 'published',
        narrative_title: data.narrative?.title,
        node_count: data.narrative?.total_nodes || data.narrative?.nodes?.length || 0,
        concept_count: data.narrative?.concept_map?.length || 0,
        last_updated: data.narrative?.generated_at?.split('T')[0] || '2026-04-10',
        students_completed: 0,
    }));

    // Add user-generated missions from MissionStore
    const storedIndex = MissionStore.getIndex();
    storedIndex.forEach(entry => {
        if (!items.find(i => i.id === entry.id)) {
            items.push({
                id: entry.id,
                course: entry.courseId,
                chapter: entry.title,
                source_type: 'generated',
                status: entry.status === 'published' ? 'published' : entry.status === 'review' ? 'narrative_generated' : 'ingested',
                narrative_title: entry.title,
                node_count: entry.nodeCount,
                concept_count: 0,
                last_updated: entry.updatedAt?.split('T')[0] || 'Unknown',
                students_completed: 0,
            });
        }
    });

    return items;
}

const PipelineStatusBadge = ({ status }) => {
    const stage = PIPELINE_STAGES.find(s => s.id === status);
    if (!stage) return null;
    const Icon = stage.icon;
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: `${stage.color}15`, color: stage.color }}
        >
            <Icon size={12} />
            {stage.label}
        </span>
    );
};

const PipelineProgress = ({ status }) => {
    const stageIndex = PIPELINE_STAGES.findIndex(s => s.id === status);
    return (
        <div className="flex items-center gap-1">
            {PIPELINE_STAGES.map((stage, i) => (
                <React.Fragment key={stage.id}>
                    <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            i <= stageIndex
                                ? 'text-white shadow-sm'
                                : 'bg-slate-100 text-slate-300'
                        }`}
                        style={i <= stageIndex ? { backgroundColor: stage.color } : {}}
                        title={stage.label}
                    >
                        {i < stageIndex ? (
                            <CheckCircle size={12} />
                        ) : i === stageIndex ? (
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        ) : (
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                        )}
                    </div>
                    {i < PIPELINE_STAGES.length - 1 && (
                        <div className={`w-6 h-0.5 ${i < stageIndex ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export const XPAdminDashboard = ({ onBack, onLaunchPlayer }) => {
    const [activeTab, setActiveTab] = useState('pipeline');
    const [pipeline, setPipeline] = useState(() => buildPipelineFromStore());
    const [uploading, setUploading] = useState(false);
    const [uploadForm, setUploadForm] = useState({ type: 'textbook_chapter', courseId: '', chapterTitle: '' });
    const [generating, setGenerating] = useState(false);
    const [quickTopic, setQuickTopic] = useState('');
    const [quickStyle, setQuickStyle] = useState('historical_adventure');
    const storageStats = MissionStore.getStorageStats();

    const refreshPipeline = useCallback(() => {
        setPipeline(buildPipelineFromStore());
    }, []);

    const tabs = [
        { id: 'pipeline', label: 'Pipeline Monitor', icon: Layers },
        { id: 'missions', label: 'Missions Library', icon: Library },
        { id: 'upload', label: 'Upload Content', icon: Upload },
        { id: 'analytics', label: 'Student Analytics', icon: BarChart3 },
    ];

    // Quick Generate handler
    const handleQuickGenerate = async () => {
        if (!quickTopic.trim()) return;
        setGenerating(true);
        try {
            const mission = await quickGenerate(quickTopic.trim(), quickStyle);
            // Wrap in mission package format
            const pkg = {
                course: { id: 'QG-001', title: quickTopic, institution: 'University School AI', department: '' },
                chapter: { id: `ch_qg_${Date.now()}`, title: mission.title || quickTopic, order: 1, estimated_play_time: `${(mission.nodes?.length || 10) * 2} min` },
                narrative: { ...mission },
            };
            MissionStore.saveMission(pkg);
            refreshPipeline();
            setQuickTopic('');
            alert(`✅ Mission generated: "${mission.title || quickTopic}" — ${mission.nodes?.length || 0} nodes`);
        } catch (err) {
            console.error('[QuickGen] Failed:', err);
            alert('Generation failed: ' + err.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const ext = file.name.split('.').pop().toLowerCase();
            const result = await IngestService.extractDocument(file, ext);
            console.log('[XPAdmin] Ingestion result:', result);
            // In production: save to Firestore, update pipeline
            alert(`✓ Ingested: ${file.name}\n${result.metadata?.word_count || 0} words extracted\n${result.sections?.length || 0} sections found`);
        } catch (err) {
            console.error('[XPAdmin] Upload failed:', err);
            alert('Upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="h-full overflow-auto bg-[#FAF8F5]">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] shadow-lg shadow-purple-500/20">
                            <Cpu size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-serif font-bold text-[#2D2D2D]">XP Engine Admin</h1>
                            <p className="text-sm text-slate-500">Content pipeline & analytics</p>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: Database, label: 'Total Missions', value: pipeline.length, color: '#6366F1' },
                        { icon: CheckCircle, label: 'Published', value: pipeline.filter(p => p.status === 'published').length, color: '#10B981' },
                        { icon: Clock, label: 'In Pipeline', value: pipeline.filter(p => p.status !== 'published').length, color: '#F59E0B' },
                        { icon: Database, label: 'Storage', value: `${storageStats.totalMB} MB`, color: '#8B2332' },
                    ].map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}10` }}>
                                    <Icon size={18} style={{ color }} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[#2D2D2D]">{value}</div>
                                    <div className="text-xs text-slate-400 font-medium">{label}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-slate-200 pb-0">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-px
                                ${activeTab === id
                                    ? 'text-[#8B2332] border-[#8B2332]'
                                    : 'text-slate-400 border-transparent hover:text-slate-600'
                                }`}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'pipeline' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-[#2D2D2D]">Content Pipeline</h2>
                            <button
                                onClick={refreshPipeline}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors"
                            >
                                <RefreshCw size={14} />
                                Refresh
                            </button>
                        </div>

                        {pipeline.map(item => (
                            <div key={item.id} className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-500">
                                                {item.course}
                                            </span>
                                            <PipelineStatusBadge status={item.status} />
                                        </div>
                                        <h3 className="font-bold text-[#2D2D2D]">{item.chapter}</h3>
                                        {item.narrative_title && (
                                            <p className="text-sm text-slate-500 mt-1">
                                                Mission: <span className="text-[#8B2332] font-medium">{item.narrative_title}</span>
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors" title="Preview">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors" title="Edit">
                                            <Edit3 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <PipelineProgress status={item.status} />

                                <div className="flex items-center gap-6 mt-4 text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <FileText size={12} />
                                        {item.source_type === 'lecture_video' ? 'Video' : 'Document'}
                                    </span>
                                    {item.concept_count > 0 && (
                                        <span className="flex items-center gap-1">
                                            <Brain size={12} />
                                            {item.concept_count} concepts
                                        </span>
                                    )}
                                    {item.node_count > 0 && (
                                        <span className="flex items-center gap-1">
                                            <Target size={12} />
                                            {item.node_count} nodes
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} />
                                        Updated {item.last_updated}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'upload' && (
                    <div className="max-w-2xl">
                        <h2 className="text-lg font-bold text-[#2D2D2D] mb-6">Upload Source Content</h2>

                        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
                            {/* Source Type */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Content Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'textbook_chapter', icon: BookOpen, label: 'Textbook / Document' },
                                        { id: 'lecture_video', icon: Video, label: 'Lecture Video' },
                                    ].map(({ id, icon: Icon, label }) => (
                                        <button
                                            key={id}
                                            onClick={() => setUploadForm({ ...uploadForm, type: id })}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                                                uploadForm.type === id
                                                    ? 'border-[#8B2332] bg-[#8B2332]/5'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <Icon size={24} className={uploadForm.type === id ? 'text-[#8B2332]' : 'text-slate-400'} />
                                            <p className={`mt-2 text-sm font-semibold ${uploadForm.type === id ? 'text-[#8B2332]' : 'text-slate-600'}`}>
                                                {label}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Course ID */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Course ID</label>
                                <input
                                    type="text"
                                    value={uploadForm.courseId}
                                    onChange={e => setUploadForm({ ...uploadForm, courseId: e.target.value })}
                                    placeholder="e.g., PHY-101"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B2332] focus:ring-1 focus:ring-[#8B2332] outline-none transition-all text-sm"
                                />
                            </div>

                            {/* Chapter Title */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Chapter / Module Title</label>
                                <input
                                    type="text"
                                    value={uploadForm.chapterTitle}
                                    onChange={e => setUploadForm({ ...uploadForm, chapterTitle: e.target.value })}
                                    placeholder="e.g., Ch. 4: Dynamics — Forces & Newton's Laws"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B2332] focus:ring-1 focus:ring-[#8B2332] outline-none transition-all text-sm"
                                />
                            </div>

                            {/* File Upload */}
                            {uploadForm.type === 'textbook_chapter' ? (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-2">Upload File</label>
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-[#8B2332]/40 transition-colors">
                                        <Upload size={32} className="mx-auto mb-3 text-slate-300" />
                                        <p className="text-sm text-slate-500 mb-2">Drag & drop or click to upload</p>
                                        <p className="text-xs text-slate-400 mb-4">PDF, DOCX, PPTX, or TXT</p>
                                        <input
                                            type="file"
                                            accept=".pdf,.docx,.pptx,.txt"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all ${
                                                uploading
                                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                    : 'bg-[#8B2332] text-white hover:bg-[#a02a3a] shadow-sm'
                                            }`}
                                        >
                                            {uploading ? (
                                                <>
                                                    <RefreshCw size={16} className="animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload size={16} />
                                                    Choose File
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-2">Video URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B2332] focus:ring-1 focus:ring-[#8B2332] outline-none transition-all text-sm"
                                    />
                                    <p className="text-xs text-slate-400 mt-2">
                                        Supports: YouTube, Vimeo, Panopto, direct .mp4/.webm
                                    </p>

                                    {/* Transcription Model Selector */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-semibold text-slate-600 mb-2">Transcription Model</label>
                                        <div className="space-y-2">
                                            {Object.entries(IngestService.WHISPER_MODELS).map(([key, model]) => (
                                                <div key={key} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-[#8B2332]/30 transition-colors cursor-pointer">
                                                    <input type="radio" name="model" value={key} defaultChecked={key === 'whisper-large-v3-turbo'} className="accent-[#8B2332]" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-[#2D2D2D]">{model.name}</p>
                                                        <p className="text-xs text-slate-400">{model.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'missions' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-[#2D2D2D]">Missions Library</h2>
                            <div className="text-sm text-slate-400">{pipeline.length} total missions</div>
                        </div>

                        {/* Quick Generate Card */}
                        <div className="p-6 rounded-xl bg-gradient-to-r from-[#0A1628] to-[#1a1a2e] text-white mb-6 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#C9B47C] blur-[100px]" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#8B2332] blur-[80px]" />
                            </div>
                            <div className="relative">
                                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                                    <Wand2 size={20} className="text-[#C9B47C]" />
                                    Quick Generate
                                </h3>
                                <p className="text-slate-400 text-sm mb-4">
                                    Enter any topic and the AI will generate a complete branching narrative mission instantly.
                                </p>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={quickTopic}
                                        onChange={e => setQuickTopic(e.target.value)}
                                        placeholder="e.g., photosynthesis, game theory, the French Revolution..."
                                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-[#C9B47C] focus:ring-1 focus:ring-[#C9B47C] outline-none text-sm"
                                        onKeyDown={e => e.key === 'Enter' && handleQuickGenerate()}
                                    />
                                    <select
                                        value={quickStyle}
                                        onChange={e => setQuickStyle(e.target.value)}
                                        className="px-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none"
                                    >
                                        {Object.entries(getStylePresets()).map(([key, preset]) => (
                                            <option key={key} value={key} className="text-black">{preset.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleQuickGenerate}
                                        disabled={generating || !quickTopic.trim()}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                                            generating
                                                ? 'bg-slate-600 text-slate-300 cursor-wait'
                                                : 'bg-[#C9B47C] hover:bg-[#d4c08f] text-[#0A1628] shadow-lg'
                                        }`}
                                    >
                                        {generating ? (
                                            <><RefreshCw size={16} className="animate-spin" /> Generating...</>
                                        ) : (
                                            <><Sparkles size={16} /> Generate Mission</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Missions Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pipeline.filter(p => p.status === 'published').map(item => (
                                <div key={item.id} className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                                            {item.course}
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                                            <CheckCircle size={10} /> Published
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-[#2D2D2D] mb-1">{item.narrative_title || item.chapter}</h3>
                                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                                        <span className="flex items-center gap-1"><Target size={12} /> {item.node_count} nodes</span>
                                        {item.concept_count > 0 && (
                                            <span className="flex items-center gap-1"><Brain size={12} /> {item.concept_count} concepts</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#8B2332] text-white text-xs font-semibold hover:bg-[#a02a3a] transition-all"
                                            title="Preview in XP Player"
                                        >
                                            <Play size={12} /> Play
                                        </button>
                                        {item.source_type === 'generated' && (
                                            <button
                                                onClick={() => {
                                                    MissionStore.exportMission(item.id);
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-500 text-xs font-semibold hover:bg-slate-50 transition-all"
                                                title="Export JSON"
                                            >
                                                <Download size={12} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div>
                        <h2 className="text-lg font-bold text-[#2D2D2D] mb-6">Student Analytics</h2>
                        <div className="p-12 rounded-xl bg-white border border-slate-200 text-center">
                            <BarChart3 size={48} className="mx-auto mb-4 text-slate-300" />
                            <p className="text-slate-500 text-lg font-medium">Analytics Coming Soon</p>
                            <p className="text-sm text-slate-400 mt-2">
                                Student data will populate as students complete XP missions
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default XPAdminDashboard;
