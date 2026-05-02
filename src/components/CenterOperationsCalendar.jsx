import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Users, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { CenterOpsService } from '../services/CenterOpsService';

export const CenterOperationsCalendar = ({ franchiseId = 'mock-franchise-1', centerId = 'mock-center-1' }) => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConfig();
    }, [franchiseId, centerId]);

    const loadConfig = async () => {
        setLoading(true);
        try {
            const data = await CenterOpsService.getCenterConfig(franchiseId, centerId);
            setConfig(data.effective_config);
        } catch (error) {
            console.error("Failed to load center config:", error);
            // Fallback for UI visualization if DB is not seeded
            setConfig({
                study_hall_days: ['monday', 'wednesday', 'friday'],
                campus_days: ['tuesday', 'thursday'],
                operating_hours: { open: '08:00', close: '18:00' },
                timezone: 'America/Los_Angeles'
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 h-64 flex items-center justify-center animate-pulse">
                <Loader2 className="animate-spin text-slate-500" size={32} />
            </div>
        );
    }

    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/80">
                <div className="flex items-center gap-3">
                    <CalendarIcon className="text-[#C9B47C]" size={20} />
                    <h3 className="font-bold text-white">Center Operations Schedule</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-slate-300">
                        {config?.operating_hours?.open} - {config?.operating_hours?.close}
                    </span>
                    <span className="text-slate-500 uppercase ml-1">
                        {config?.timezone?.split('/')[1]?.replace('_', ' ') || 'Local'}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-7 gap-3">
                    {daysOfWeek.map((day) => {
                        const isStudyHall = config?.study_hall_days?.includes(day);
                        const isCampusDay = config?.campus_days?.includes(day);
                        const isToday = day === currentDayName;

                        let bgColor = 'bg-slate-900/50 border-slate-800';
                        let accentColor = 'text-slate-500';
                        let label = 'Closed';
                        let Icon = null;

                        if (isStudyHall) {
                            bgColor = isToday ? 'bg-[#8B2332]/20 border-[#8B2332]/50' : 'bg-slate-800 border-slate-700';
                            accentColor = 'text-[#8B2332]';
                            label = 'Study Hall';
                            Icon = Users;
                        } else if (isCampusDay) {
                            bgColor = isToday ? 'bg-[#C9B47C]/20 border-[#C9B47C]/50' : 'bg-slate-800 border-slate-700';
                            accentColor = 'text-[#C9B47C]';
                            label = 'Campus Lab';
                            Icon = MapPin;
                        }

                        return (
                            <div
                                key={day}
                                className={`flex flex-col rounded-xl border p-3 transition-colors ${bgColor} ${isToday ? 'ring-2 ring-white/10 shadow-lg' : ''}`}
                            >
                                <span className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isToday ? 'text-white' : 'text-slate-400'}`}>
                                    {day.substring(0, 3)}
                                </span>

                                <div className="flex-1 flex flex-col justify-end">
                                    {(isStudyHall || isCampusDay) ? (
                                        <>
                                            <div className="mb-2">
                                                <Icon size={16} className={accentColor} />
                                            </div>
                                            <span className={`text-xs font-bold leading-tight ${isToday ? 'text-white' : 'text-slate-300'}`}>
                                                {label}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-xs font-medium text-slate-600">Off Day</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Today's Context Actions */}
                <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">Center is Active</div>
                            <div className="text-xs text-slate-400">14 students checked in • 2 staff present</div>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg transition-colors border border-slate-600">
                        View Attendance Roster <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CenterOperationsCalendar;
