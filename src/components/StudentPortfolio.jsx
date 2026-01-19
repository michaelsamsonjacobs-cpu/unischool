import React, { useState } from 'react';
import { Folder, FileText, ChevronRight, MoreVertical, BookOpen, RefreshCw, MessageSquare, Download } from 'lucide-react';

export const StudentPortfolio = ({ onOpenAgent }) => {
    const [currentPath, setCurrentPath] = useState([]); // Array of folder IDs

    // Mock Data System with Archives
    const fileSystem = {
        root: {
            id: 'root',
            title: 'My Work',
            type: 'folder',
            children: ['current_term', 'archive'],
        },
        current_term: {
            id: 'current_term',
            title: 'Current Semester (Fall 2025)',
            type: 'folder',
            description: 'Active classes',
            color: '#8B2332',
            children: ['math', 'history', 'cs'],
        },
        archive: {
            id: 'archive',
            title: 'Archive / Past Work',
            type: 'folder',
            description: 'Previous terms and saved materials',
            color: '#64748b',
            children: ['term_spring25', 'personal_old'],
        },

        // Active Classes
        math: {
            id: 'math',
            title: 'AP Calculus BC',
            type: 'folder',
            color: '#1565C0',
            children: ['math_u1', 'math_u2', 'math_hw1'],
        },
        history: {
            id: 'history',
            title: 'World History',
            type: 'folder',
            color: '#8B2332',
            children: ['hist_essay1', 'hist_notes'],
        },
        cs: {
            id: 'cs',
            title: 'Intro to CS',
            type: 'folder',
            color: '#2E7D32',
            children: ['cs_proj1'],
        },

        // Archived
        term_spring25: {
            id: 'term_spring25',
            title: 'Spring 2025',
            type: 'folder',
            color: '#94a3b8',
            children: [],
        },
        personal_old: {
            id: 'personal_old',
            title: 'Old Projects',
            type: 'folder',
            color: '#C9B47C',
            children: [],
        },

        // Files
        math_u1: { id: 'math_u1', type: 'file', title: 'Unit 1: Limits', date: '2 days ago', grade: 'A-' },
        math_u2: { id: 'math_u2', type: 'file', title: 'Unit 2: Derivatives', date: 'Yesterday', grade: 'Pending' },
        math_hw1: { id: 'math_hw1', type: 'file', title: 'Problem Set 1.pdf', date: '1 week ago', grade: '95/100' },

        hist_essay1: { id: 'hist_essay1', type: 'file', title: 'The Industrial Revolution', date: '3 days ago', grade: 'B+' },
        hist_notes: { id: 'hist_notes', type: 'file', title: 'Lecture Notes.md', date: 'Today', grade: null },

        cs_proj1: { id: 'cs_proj1', type: 'file', title: 'Python Basics.py', date: '5 days ago', grade: '100/100' },
    };

    const getCurrentFolder = () => {
        if (currentPath.length === 0) return fileSystem.root;
        const currentId = currentPath[currentPath.length - 1];
        return fileSystem[currentId];
    };

    const handleNavigate = (folderId) => {
        setCurrentPath([...currentPath, folderId]);
    };

    const handleUp = (index) => {
        if (index === -1) setCurrentPath([]);
        else setCurrentPath(currentPath.slice(0, index + 1));
    };

    const currentFolder = getCurrentFolder();

    return (
        <div className="h-full bg-[#FAF8F5] p-6 flex flex-col">
            {/* Header & Breadcrumbs */}
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-[#2D2D2D] mb-4">Quest Log & Assignments</h1>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 w-fit shadow-sm">
                    <button
                        onClick={() => handleUp(-1)}
                        className="hover:text-[#8B2332] font-medium transition-colors"
                    >
                        Home
                    </button>
                    {currentPath.map((folderId, idx) => (
                        <React.Fragment key={folderId}>
                            <ChevronRight size={14} />
                            <button
                                onClick={() => handleUp(idx)}
                                className="hover:text-[#8B2332] font-medium transition-colors"
                            >
                                {fileSystem[folderId].title}
                            </button>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentFolder.children.map(childId => {
                    const item = fileSystem[childId];
                    if (!item) return null;

                    if (item.type === 'folder') {
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigate(item.id)}
                                className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-[#8B2332]/30 shadow-sm hover:shadow-xl transition-all text-left flex flex-col justify-between h-[160px]"
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: `${item.color}15` }}>
                                    <Folder size={24} style={{ color: item.color }} fill={item.color} fillOpacity={0.2} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-[#8B2332] transition-colors">{item.title}</h3>
                                    <p className="text-xs text-slate-400 mt-1">{item.children.length} files</p>
                                </div>
                            </button>
                        );
                    }

                    // File Card
                    return (
                        <div key={item.id} className="group relative bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
                                    <FileText size={20} className="text-slate-400 group-hover:text-[#8B2332] transition-colors" />
                                </div>
                                {item.grade && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.grade.includes('A') || item.grade === '100/100' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {item.grade}
                                    </span>
                                )}
                            </div>

                            <h3 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h3>
                            <p className="text-xs text-slate-400 mb-4">Edited {item.date}</p>

                            {/* Actions Overlay */}
                            <div className="grid grid-cols-3 gap-1 pt-3 border-t border-slate-100">
                                <button className="flex flex-col items-center gap-1 p-1 hover:bg-slate-50 rounded-lg group/btn" title="Review">
                                    <BookOpen size={14} className="text-slate-400 group-hover/btn:text-[#8B2332]" />
                                    <span className="text-[9px] text-slate-400">Study</span>
                                </button>
                                <button className="flex flex-col items-center gap-1 p-1 hover:bg-slate-50 rounded-lg group/btn" title="Redo">
                                    <RefreshCw size={14} className="text-slate-400 group-hover/btn:text-[#C9B47C]" />
                                    <span className="text-[9px] text-slate-400">Redo</span>
                                </button>
                                <button className="flex flex-col items-center gap-1 p-1 hover:bg-slate-50 rounded-lg group/btn" title="Ask AI">
                                    <MessageSquare size={14} className="text-slate-400 group-hover/btn:text-[#1565C0]" />
                                    <span className="text-[9px] text-slate-400">Ask</span>
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {currentFolder.children.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                        <Folder size={48} className="mx-auto mb-4 opacity-20" />
                        <p>This folder is empty.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
