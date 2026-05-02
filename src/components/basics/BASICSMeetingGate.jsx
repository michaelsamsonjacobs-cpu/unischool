import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Plus, Trash2, Users, TrendingUp, ArrowRight, ExternalLink, X } from 'lucide-react';
import BASICSCalendarService from '../../services/BASICSCalendarService';

/**
 * BASICSMeetingGate — Calendar-gated milestone tracker.
 * Two gates:
 *   1. Customer Discovery: 20 meetings with ICP → unlocks course sections
 *   2. Investor: 30 meetings → unlocks fundraising/raising section
 *
 * Reuses Google Calendar integration from commander_qluu.
 */

export const BASICSMeetingGate = ({ gateType, onGateMet, onClose }) => {
    const isCustomerDiscovery = gateType === 'customer_discovery';
    const required = isCustomerDiscovery ? 20 : 30;
    const title = isCustomerDiscovery ? 'Customer Discovery Meetings' : 'Investor Meetings';
    const subtitle = isCustomerDiscovery
        ? 'Talk to 20 potential customers in your ICP to unlock the next course section.'
        : 'Calendar 30 investor meetings to unlock the fundraising section.';

    const [meetings, setMeetings] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMeeting, setNewMeeting] = useState({ title: '', date: '', contact: '', notes: '' });

    useEffect(() => {
        setMeetings(BASICSCalendarService.getMeetings(gateType));
    }, [gateType]);

    const handleAddMeeting = (e) => {
        e.preventDefault();
        if (!newMeeting.title || !newMeeting.date || !newMeeting.contact) return;

        BASICSCalendarService.addManualMeeting(gateType, newMeeting);
        setMeetings(BASICSCalendarService.getMeetings(gateType));
        setNewMeeting({ title: '', date: '', contact: '', notes: '' });
        setShowAddForm(false);

        // Check if gate is now met
        if (BASICSCalendarService.isGateMet(gateType) && onGateMet) {
            onGateMet();
        }
    };

    const handleRemove = (id) => {
        BASICSCalendarService.removeMeeting(gateType, id);
        setMeetings(BASICSCalendarService.getMeetings(gateType));
    };

    const progress = BASICSCalendarService.getGateProgress(gateType);
    const gateMet = progress.current >= required;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
                {/* Header */}
                <div className={`px-6 py-5 ${isCustomerDiscovery ? 'bg-gradient-to-r from-[#0ea5e9] to-[#3b82f6]' : 'bg-gradient-to-r from-[#f97316] to-[#f59e0b]'} text-white`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            {isCustomerDiscovery ? <Users size={18} /> : <TrendingUp size={18} />}
                            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Calendar Gate</span>
                        </div>
                        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <h2 className="text-xl font-bold mb-1">{title}</h2>
                    <p className="text-white/70 text-sm">{subtitle}</p>

                    {/* Progress */}
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 h-2.5 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-500"
                                style={{ width: `${progress.percent}%` }}
                            />
                        </div>
                        <span className="text-sm font-bold">{progress.current}/{required}</span>
                    </div>

                    {gateMet && (
                        <div className="mt-3 flex items-center gap-2 text-sm font-bold bg-white/20 px-3 py-1.5 rounded-lg">
                            <CheckCircle size={14} />
                            Gate Unlocked!
                        </div>
                    )}
                </div>

                {/* Meeting List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {meetings.length === 0 ? (
                        <div className="text-center py-10">
                            <Calendar size={40} className="mx-auto text-slate-200 mb-3" />
                            <p className="text-slate-400 text-sm">No meetings logged yet. Start adding your scheduled meetings.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {meetings.map((meeting, i) => (
                                <div key={meeting.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${gateMet ? 'bg-green-500' : 'bg-slate-300'}`}>
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[#2D2D2D] truncate">{meeting.title}</p>
                                        <p className="text-xs text-slate-400">
                                            {meeting.contact} • {new Date(meeting.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(meeting.id)}
                                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Meeting Form */}
                <div className="border-t border-slate-200 p-4">
                    {showAddForm ? (
                        <form onSubmit={handleAddMeeting} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={newMeeting.title}
                                    onChange={(e) => setNewMeeting(m => ({ ...m, title: e.target.value }))}
                                    placeholder="Meeting title"
                                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#003262] outline-none"
                                    required
                                />
                                <input
                                    type="text"
                                    value={newMeeting.contact}
                                    onChange={(e) => setNewMeeting(m => ({ ...m, contact: e.target.value }))}
                                    placeholder="Contact name / company"
                                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#003262] outline-none"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="date"
                                    value={newMeeting.date}
                                    onChange={(e) => setNewMeeting(m => ({ ...m, date: e.target.value }))}
                                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#003262] outline-none"
                                    required
                                />
                                <input
                                    type="text"
                                    value={newMeeting.notes}
                                    onChange={(e) => setNewMeeting(m => ({ ...m, notes: e.target.value }))}
                                    placeholder="Notes (optional)"
                                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#003262] outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="submit"
                                    className="bg-[#003262] hover:bg-[#001a3d] text-white px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                                >
                                    <CheckCircle size={12} /> Add Meeting
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="text-slate-400 hover:text-slate-600 px-3 py-2 text-xs font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-sm font-bold text-slate-400 hover:text-[#003262] hover:border-[#003262]/30 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> Log a Meeting
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
