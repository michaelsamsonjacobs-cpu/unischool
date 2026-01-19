import React, { useState, useEffect } from 'react';
import {
    Users, Building, GraduationCap, Shield, Plus, Search,
    Mail, ChevronRight, Settings, BarChart3, UserPlus, Trash2,
    CheckCircle, XCircle, Clock, CreditCard
} from 'lucide-react';
import { MagicLinkService, ROLES, ROLE_LABELS } from '../services/MagicLinkService';
import { SuperAdminBilling } from './SuperAdminBilling';

/**
 * SuperAdminDashboard - Platform administration for Berkeley/UniSchool staff
 * Manages franchise owners, academic facilitators, and system-wide settings
 */

const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={20} style={{ color }} />
            </div>
            <span className="text-slate-400 text-sm">{label}</span>
        </div>
        <div className="text-3xl font-bold text-white">{value}</div>
        {subtext && <div className="text-xs text-slate-500 mt-1">{subtext}</div>}
    </div>
);

const UserRow = ({ user, onAction }) => {
    const roleColors = {
        [ROLES.SUPER_ADMIN]: '#8B2332',
        [ROLES.FRANCHISE_OWNER]: '#C9B47C',
        [ROLES.FACILITATOR]: '#1565C0',
        [ROLES.PARENT]: '#2E7D32',
        [ROLES.STUDENT]: '#7B1FA2',
    };

    return (
        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-4">
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: roleColors[user.role] || '#64748b' }}
                >
                    {user.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                    <div className="text-white font-medium">{user.name}</div>
                    <div className="text-slate-400 text-sm">{user.email}</div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                        background: `${roleColors[user.role]}20`,
                        color: roleColors[user.role]
                    }}
                >
                    {ROLE_LABELS[user.role]}
                </span>
                <div className="flex items-center gap-1">
                    {user.onboardingComplete ? (
                        <CheckCircle size={16} className="text-green-500" />
                    ) : (
                        <Clock size={16} className="text-amber-500" />
                    )}
                </div>
                <button
                    onClick={() => onAction('view', user)}
                    className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                >
                    <ChevronRight size={16} className="text-slate-400" />
                </button>
            </div>
        </div>
    );
};

const CreateUserModal = ({ isOpen, onClose, onCreate }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState(ROLES.FRANCHISE_OWNER);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.includes('@')) {
            setError('Please enter a valid email');
            return;
        }

        const result = MagicLinkService.createUser(email, role);
        if (result.success) {
            // Send magic link to new user
            MagicLinkService.requestMagicLink(email);
            onCreate(result.user);
            onClose();
            setEmail('');
            setError('');
        } else {
            setError(result.error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-4">Invite New User</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="text-sm text-slate-400 block mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9B47C]"
                            placeholder="user@example.com"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="text-sm text-slate-400 block mb-2">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9B47C]"
                        >
                            <option value={ROLES.FRANCHISE_OWNER}>Franchise Owner</option>
                            <option value={ROLES.FACILITATOR}>Academic Facilitator</option>
                            <option value={ROLES.SUPER_ADMIN}>Super Admin</option>
                        </select>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 rounded-xl bg-[#C9B47C] text-slate-900 font-semibold hover:bg-[#b09b63] transition-colors flex items-center justify-center gap-2"
                        >
                            <Mail size={16} />
                            Send Invite
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const SuperAdminDashboard = ({ adminName, onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        // Load users
        const allUsers = MagicLinkService.getUsers();
        if (allUsers.length === 0) {
            // Seed demo data if empty
            MagicLinkService.seedDemoData();
            setUsers(MagicLinkService.getUsers());
        } else {
            setUsers(allUsers);
        }
    }, []);

    const stats = {
        totalUsers: users.length,
        franchises: users.filter(u => u.role === ROLES.FRANCHISE_OWNER).length,
        facilitators: users.filter(u => u.role === ROLES.FACILITATOR).length,
        students: users.filter(u => u.role === ROLES.STUDENT).length,
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleUserAction = (action, user) => {
        if (action === 'view') {
            console.log('View user:', user);
            // In production: navigate to user detail view
        }
    };

    const handleCreateUser = (newUser) => {
        setUsers(MagicLinkService.getUsers());
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'franchises', label: 'Franchises', icon: Building },
        { id: 'billing', label: 'Billing & Fees', icon: CreditCard },
        { id: 'facilitators', label: 'Facilitators', icon: GraduationCap },
        { id: 'users', label: 'All Users', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#050816] text-white">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Shield className="text-[#8B2332]" size={28} />
                            <div>
                                <h1 className="text-lg font-bold">Super Admin Portal</h1>
                                <p className="text-xs text-slate-400">University School Platform Management</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-slate-400 text-sm">{adminName}</span>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? 'bg-[#8B2332] text-white'
                                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                                    }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Billing Tab */}
                {activeTab === 'billing' && (
                    <SuperAdminBilling />
                )}

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                icon={Users}
                                label="Total Users"
                                value={stats.totalUsers}
                                color="#C9B47C"
                                subtext="Across all roles"
                            />
                            <StatCard
                                icon={Building}
                                label="Franchise Owners"
                                value={stats.franchises}
                                color="#8B2332"
                                subtext="Active franchises"
                            />
                            <StatCard
                                icon={GraduationCap}
                                label="Facilitators"
                                value={stats.facilitators}
                                color="#1565C0"
                                subtext="Berkeley advisors"
                            />
                            <StatCard
                                icon={Users}
                                label="Students"
                                value={stats.students}
                                color="#2E7D32"
                                subtext="Active learners"
                            />
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-[#C9B47C] transition-colors text-left"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-[#C9B47C]/20 flex items-center justify-center">
                                        <UserPlus size={24} className="text-[#C9B47C]" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Invite User</div>
                                        <div className="text-sm text-slate-400">Add franchise owner or facilitator</div>
                                    </div>
                                </button>
                                <button className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-[#8B2332] transition-colors text-left">
                                    <div className="w-12 h-12 rounded-xl bg-[#8B2332]/20 flex items-center justify-center">
                                        <Building size={24} className="text-[#8B2332]" />
                                    </div>
                                    <div>
                                        <div className="font-medium">New Franchise</div>
                                        <div className="text-sm text-slate-400">Register a new location</div>
                                    </div>
                                </button>
                                <button className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-[#1565C0] transition-colors text-left">
                                    <div className="w-12 h-12 rounded-xl bg-[#1565C0]/20 flex items-center justify-center">
                                        <BarChart3 size={24} className="text-[#1565C0]" />
                                    </div>
                                    <div>
                                        <div className="font-medium">View Analytics</div>
                                        <div className="text-sm text-slate-400">Platform-wide statistics</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {(activeTab === 'users' || activeTab === 'franchises' || activeTab === 'facilitators') && (
                    <div className="space-y-6">
                        {/* Search & Filter */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#C9B47C]"
                                />
                            </div>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9B47C]"
                            >
                                <option value="all">All Roles</option>
                                <option value={ROLES.SUPER_ADMIN}>Super Admins</option>
                                <option value={ROLES.FRANCHISE_OWNER}>Franchise Owners</option>
                                <option value={ROLES.FACILITATOR}>Facilitators</option>
                                <option value={ROLES.PARENT}>Parents</option>
                                <option value={ROLES.STUDENT}>Students</option>
                            </select>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#C9B47C] text-slate-900 font-semibold hover:bg-[#b09b63] transition-colors"
                            >
                                <Plus size={18} />
                                Invite User
                            </button>
                        </div>

                        {/* User List */}
                        <div className="space-y-3">
                            {filteredUsers.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <Users size={48} className="mx-auto mb-4 opacity-30" />
                                    <p>No users found</p>
                                </div>
                            ) : (
                                filteredUsers.map(user => (
                                    <UserRow
                                        key={user.id}
                                        user={user}
                                        onAction={handleUserAction}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="max-w-2xl">
                        <h3 className="text-lg font-semibold mb-6">Platform Settings</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-2xl">
                                <h4 className="font-medium mb-2">Magic Link Expiration</h4>
                                <p className="text-sm text-slate-400 mb-3">How long magic links remain valid</p>
                                <select className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white">
                                    <option>15 minutes</option>
                                    <option>30 minutes</option>
                                    <option>1 hour</option>
                                </select>
                            </div>
                            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-2xl">
                                <h4 className="font-medium mb-2">Session Duration</h4>
                                <p className="text-sm text-slate-400 mb-3">How long users stay logged in</p>
                                <select className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white">
                                    <option>7 days</option>
                                    <option>14 days</option>
                                    <option>30 days</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create User Modal */}
            <CreateUserModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={handleCreateUser}
            />
        </div>
    );
};

export default SuperAdminDashboard;
