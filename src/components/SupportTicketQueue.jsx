import React, { useState, useEffect } from 'react';
import { EscalationService } from '../services/EscalationService';
import { AlertTriangle, Clock, ShieldAlert, CheckCircle, MessageSquare } from 'lucide-react';

export const SupportTicketQueue = ({ franchiseId, centerId }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTickets();
    }, [franchiseId, centerId]);

    const loadTickets = async () => {
        setLoading(true);
        try {
            const data = await EscalationService.getTickets({ franchiseId, centerId, status: 'open' });
            setTickets(data || []);
        } catch (error) {
            console.error("Failed to load tickets:", error);
            // Fallback for UI demo
            setTickets([
                { id: '1', ticket_type: 'nce_failure', priority: 'high', title: 'Student failing consecutive NCE scenarios', description: 'Last 3 NCE evaluations scored below 50%.', student: { full_name: 'Alex Smith' }, created_at: new Date().toISOString() },
                { id: '2', ticket_type: 'attendance_risk', priority: 'critical', title: 'Student inactive for 96 hours', description: 'No progress updates detected.', student: { full_name: 'Maria Garcia' }, created_at: new Date().toISOString() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (ticketId) => {
        try {
            await EscalationService.resolveTicket(ticketId, "Mentor intervened and resolved issue.", 'mentor-id-mock');
            setTickets(tickets.filter(t => t.id !== ticketId));
        } catch (error) {
            console.error(error);
            // Fallback UI update
            setTickets(tickets.filter(t => t.id !== ticketId));
        }
    };

    if (loading) return <div className="animate-pulse h-32 bg-slate-800 rounded-2xl border border-slate-700"></div>;

    const getPriorityColor = (priority) => {
        if (priority === 'critical') return 'text-red-400 bg-red-400/10 border-red-400/20';
        if (priority === 'high') return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    };

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/80">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="text-red-400" size={20} />
                    <h3 className="font-bold text-white">Mentor Escalation Queue</h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
                    {tickets.length} Action Required
                </div>
            </div>

            {tickets.length === 0 ? (
                <div className="p-8 text-center">
                    <CheckCircle className="mx-auto text-emerald-500 mb-2" size={32} />
                    <p className="text-slate-400 text-sm font-medium">All student telemetry is optimal. No pending escalations.</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-700/50">
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="p-5 hover:bg-slate-700/30 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-bold text-white mb-1">{ticket.title}</h4>
                                    <p className="text-sm text-slate-400">{ticket.student?.full_name}</p>
                                </div>
                                <span className={`px-2.5 py-1 rounded text-xs font-bold border capitalize ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority} Priority
                                </span>
                            </div>

                            <p className="text-sm text-slate-300 mb-4 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                {ticket.description}
                            </p>

                            <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                    <Clock size={14} /> Created {new Date(ticket.created_at).toLocaleDateString()}
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2">
                                        <MessageSquare size={14} /> Message Student
                                    </button>
                                    <button
                                        onClick={() => handleResolve(ticket.id)}
                                        className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30 transition-colors"
                                    >
                                        Resolve
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SupportTicketQueue;
