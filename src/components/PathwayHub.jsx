import React, { useState, useEffect } from 'react';
import { Compass, Book, Briefcase, HeartPulse, Cpu, Leaf, ChevronRight, Lock } from 'lucide-react';
import { PathwayService } from '../services/PathwayService';

const ICON_MAP = {
    'heart-pulse': HeartPulse,
    'cpu': Cpu,
    'briefcase': Briefcase,
    'leaf': Leaf,
};

export const PathwayHub = ({ studentId }) => {
    const [pathways, setPathways] = useState([]);
    const [isEligible, setIsEligible] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [studentId]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Check eligibility (GE completion) and fetch pathways via DB
            const [eligibleStatus, pathwaysData] = await Promise.all([
                PathwayService.checkEligibility(studentId || 'mock-id'),
                PathwayService.getPathways()
            ]);
            setIsEligible(eligibleStatus);
            setPathways(pathwaysData);
        } catch (error) {
            console.error("Failed to load pathways:", error);
            // Fallback for UI demo
            setPathways([
                { id: '1', name: 'Engineering & Technology', description: 'Computer Science, AI, Mechanical', icon_name: 'cpu', color: '#3182CE', pathway_courses: [{ count: 12 }] },
                { id: '2', name: 'Health & Life Sciences', description: 'Medicine, Biology, Public Health', icon_name: 'heart-pulse', color: '#E53E3E', pathway_courses: [{ count: 8 }] },
            ]);
            setIsEligible(false); // keep locked to show UI state
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse h-64"></div>;
    }

    return (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
            {/* Lock Overlay */}
            {!isEligible && (
                <div className="absolute inset-0 z-20 backdrop-blur-sm bg-white/60 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <Lock className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-xl font-bold font-serif text-[#2D2D2D] mb-2">Pathway Selection Locked</h3>
                    <p className="text-sm text-slate-500 max-w-md">
                        You must complete your core General Education requirements before unlocking Career Pathways. Focus on your Degree Plan progress first.
                    </p>
                </div>
            )}

            <div className={`relative z-10 transition-opacity ${!isEligible ? 'opacity-30 pointer-events-none' : ''}`}>
                <div className="flex items-center gap-2 mb-6">
                    <Compass className="text-[#8B2332]" size={24} />
                    <h2 className="text-xl font-bold font-serif text-[#2D2D2D]">Career Pathways Hub</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pathways.map((pathway) => {
                        const IconComponent = ICON_MAP[pathway.icon_name] || Briefcase;
                        return (
                            <button
                                key={pathway.id}
                                className="group p-5 rounded-2xl bg-[#FAF8F5] border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all text-left relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: pathway.color || '#8B2332' }} />
                                <div className="pl-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                                            style={{ backgroundColor: pathway.color || '#8B2332' }}
                                        >
                                            <IconComponent size={20} />
                                        </div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
                                            {pathway.pathway_courses[0]?.count || 0} Courses
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-[#2D2D2D] text-lg mb-1 group-hover:text-[#8B2332] transition-colors">
                                        {pathway.name}
                                    </h4>
                                    <p className="text-xs text-slate-500 line-clamp-2 pr-6">
                                        {pathway.description}
                                    </p>

                                    <div className="absolute right-4 bottom-5 bg-white p-1 rounded-full shadow-sm opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                        <ChevronRight size={16} className="text-[#8B2332]" />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PathwayHub;
