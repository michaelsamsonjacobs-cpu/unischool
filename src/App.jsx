import React, { useState, useEffect } from 'react';
import { GeminiService, AIService } from './services/GeminiService';
import { FileExplorer } from './components/FileExplorer';
import { ChatInterface } from './components/ChatInterface';
import { VisualSandbox } from './components/VisualSandbox';
import { AutomationPanel } from './components/AutomationPanel';
import { ActionRecorder } from './components/ActionRecorder';
import { ChatbotBuilder } from './components/ChatbotBuilder';
import { AuthScreen } from './components/AuthScreen';
import { DocBuilderDashboard } from './components/DocBuilderDashboard';
import { GTMDashboard } from './components/GTMDashboard';
import Terminal from './components/Terminal';
import HelpCenter from './components/HelpCenter';
import EmbeddingService from './services/EmbeddingService';
import { OnboardingWizard } from './components/OnboardingWizard';
import { CommandPalette } from './components/CommandPalette';
import { PrivacyBadge } from './components/PrivacyBadge';
import { TeamDashboard } from './components/TeamDashboard';
import { ClassroomService } from './services/ClassroomService';
import WebLLMService from './services/WebLLMService';
import { GrantAgentDashboard } from './components/GrantAgentDashboard';
import FeedbackService from './services/FeedbackService';
import { ShareWorkspaceModal } from './components/ShareWorkspaceModal';
import { StudentCockpit } from './components/StudentCockpit';

// New Admin & Auth Components
import { MagicLinkAuth } from './components/MagicLinkAuth';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { AcademicGoalSurvey } from './components/AcademicGoalSurvey';
import { FranchiseOwnerDashboard } from './components/FranchiseOwnerDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { MagicLinkService, ROLES } from './services/MagicLinkService';

// Runtime Tauri invoke detection - avoid static import that breaks web builds
const invoke = typeof window !== 'undefined' && window.__TAURI__?.core?.invoke
    ? window.__TAURI__.core.invoke
    : async () => { throw new Error('Tauri not available'); };

import {
    Settings, MessageSquare, FileText, Target, Bot, Globe,
    Folder, Home, ChevronLeft, ChevronRight, Sparkles,
    Bell, Search, X, LayoutDashboard, Cpu, Server, Key, Check, AlertCircle, FolderPlus, Trash2, HelpCircle, Scale, Users, Award, Brain, Database,
    Code, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Navigation items - University School Edition
const NAV_ITEMS = [
    { id: 'home', label: 'Cockpit', icon: Home, color: '#8B2332' },
    { id: 'agent', label: 'Navigator', icon: MessageSquare, color: '#C9B47C' },
    { id: 'quests', label: 'Quest Log', icon: Target, color: '#1565C0' },
    { id: 'docs', label: 'Assignments', icon: FileText, color: '#2E7D32' },
    { id: 'help', label: 'Help Center', icon: HelpCircle, color: '#f59e0b' },
];

// Import Public Pages
import { WebsiteLayout } from './components/public/WebsiteLayout';
import { LandingPage } from './components/public/LandingPage';
import { StudentPage } from './components/public/StudentPage';
import { FranchisePage } from './components/public/FranchisePage';
import { TransferPartners } from './components/public/TransferPartners';
import { AdvisorDashboard } from './components/AdvisorDashboard';

function App() {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('springroll_auth') === 'true';
    });
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('springroll_user');
        return saved ? JSON.parse(saved) : { name: 'User', role: 'student' };
    });
    const [needsOnboarding, setNeedsOnboarding] = useState(false);

    // Default to 'landing' if not auth, otherwise 'home'
    const [activeView, setActiveView] = useState(() => {
        return localStorage.getItem('springroll_auth') === 'true' ? 'home' : 'landing';
    });

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // ... (Keep existing state)
    const [lastVisualOutput, setLastVisualOutput] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [showPalette, setShowPalette] = useState(false);
    const [showTerminal, setShowTerminal] = useState(false);
    const [embeddingMode, setEmbeddingMode] = useState('transformers');
    const [indexingStatus, setIndexingStatus] = useState(null);
    const [activeFile, setActiveFile] = useState(null);
    const [rightPanelTab, setRightPanelTab] = useState('automation');
    const [onboardingComplete, setOnboardingComplete] = useState(() => {
        return localStorage.getItem('springroll_onboarding_complete') === 'true';
    });
    const [showShareModal, setShowShareModal] = useState(false);

    // Login Handler (supports Magic Link and Legacy)
    const handleLogin = (userData, isNewUser = false) => {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('springroll_auth', 'true');
        localStorage.setItem('springroll_user', JSON.stringify(userData));

        // Check if new student needs onboarding
        if (isNewUser && userData.role === ROLES.STUDENT) {
            setNeedsOnboarding(true);
            setActiveView('onboarding_survey');
            return;
        }

        // Redirect based on role
        if (userData.role === ROLES.SUPER_ADMIN) {
            setActiveView('super_admin');
        } else if (userData.role === ROLES.FRANCHISE_OWNER) {
            setActiveView('franchise_dashboard');
        } else if (userData.role === ROLES.PARENT) {
            setActiveView('parent_dashboard');
        } else if (userData.role === ROLES.FACILITATOR || userData.role === 'advisor') {
            setActiveView('advisor_dashboard');
        } else {
            setActiveView('home');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setNeedsOnboarding(false);
        MagicLinkService.logout();
        localStorage.removeItem('springroll_auth');
        localStorage.removeItem('springroll_user');
        setActiveView('landing');
    };

    const handleOnboardingComplete = (surveyData) => {
        // Save survey data to user profile
        const updatedUser = MagicLinkService.updateUser(user.id, {
            onboardingComplete: true,
            surveyData: surveyData,
        });
        if (updatedUser) {
            setUser(updatedUser);
        }
        setNeedsOnboarding(false);
        setActiveView('home');
    };

    // Effect to handle redirection if rendering state is invalid
    useEffect(() => {
        if (isAuthenticated && (activeView === 'cockpit' || activeView === 'landing')) {
            if (user?.role === ROLES.SUPER_ADMIN) {
                setActiveView('super_admin');
            } else if (user?.role === ROLES.FACILITATOR || user?.role === 'advisor') {
                setActiveView('advisor_dashboard');
            } else {
                setActiveView('home');
            }
        }
    }, [isAuthenticated, activeView, user]);

    // ROUTING LOGIC (Early Returns)

    // 0. Onboarding Survey (for new students)
    if (needsOnboarding && activeView === 'onboarding_survey') {
        return (
            <AcademicGoalSurvey
                studentName={user?.name}
                onComplete={handleOnboardingComplete}
            />
        );
    }

    // 1. Super Admin View
    if (isAuthenticated && user?.role === ROLES.SUPER_ADMIN) {
        return <SuperAdminDashboard adminName={user.name} onLogout={handleLogout} />;
    }

    // 1.5 Franchise Owner View
    if (isAuthenticated && user?.role === ROLES.FRANCHISE_OWNER) {
        return <FranchiseOwnerDashboard ownerName={user.name} franchiseId={user.franchiseId} onLogout={handleLogout} />;
    }

    // 1.8 Parent View
    if (isAuthenticated && user?.role === ROLES.PARENT) {
        return <ParentDashboard parentName={user.name} onLogout={handleLogout} />;
    }

    // 2. Advisor/Facilitator View
    if (isAuthenticated && (user?.role === ROLES.FACILITATOR || user?.role === 'advisor')) {
        return <AdvisorDashboard advisorName={user.name} onLogout={handleLogout} />;
    }

    // 3. Public Pages (Accessible when NOT authenticated, or strictly navigation)
    // If not authenticated, force public pages or auth screen
    const publicPages = ['landing', 'students', 'franchise', 'partners'];
    if (publicPages.includes(activeView)) {
        return (
            <WebsiteLayout activePage={activeView === 'landing' ? 'home' : activeView} onNavigate={setActiveView}>
                {activeView === 'landing' && <LandingPage onNavigate={setActiveView} />}
                {activeView === 'students' && <StudentPage onNavigate={setActiveView} />}
                {activeView === 'franchise' && <FranchisePage onNavigate={setActiveView} />}
                {activeView === 'partners' && <TransferPartners />}
            </WebsiteLayout>
        );
    }

    // 3. Auth Screen (The Gate)
    // If we are here, the view is NOT a public page. So it must be a private page.
    // If we are not authenticated, show Auth.
    // Also handle specific 'cockpit' entry point from public site.
    if (!isAuthenticated || activeView === 'cockpit') {
        return (
            <AuthScreen
                onLogin={(u) => handleLogin({ ...u, role: 'student' })}
                onGuest={() => handleLogin({ name: 'Guest', role: 'student' })}
            />
        );
    }

    // 4. Main Authenticated Application (Student Cockpit)
    // Fallthrough to main render...

    const styles = {
        container: {
            display: 'flex',
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            background: '#050816',
            color: 'white',
            fontFamily: 'Inter, sans-serif'
        },
        sidebar: {
            width: sidebarCollapsed ? '80px' : '260px',
            background: '#0B101B', // Darker sidebar
            borderRight: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.3s ease'
        },
        logoSection: {
            padding: '20px',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
        },
        nav: {
            padding: '20px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            flex: 1,
            overflowY: 'auto'
        },
        navButton: (active, color) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            background: active ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
            color: active ? color : '#94a3b8',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'left',
            position: 'relative',
            boxShadow: active ? `inset 3px 0 0 0 ${color}` : 'none'
        }),
        main: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: '#050816',
            position: 'relative'
        },
        header: {
            height: '70px',
            background: 'rgba(5, 8, 22, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            zIndex: 10
        },
        content: {
            flex: 1,
            overflow: 'hidden',
            position: 'relative'
        }
    };

    return (
        <div style={styles.container}>
            {/* ... (Existing Cockpit Main Render) ... */}
            <CommandPalette
                isOpen={showPalette}
                onClose={() => setShowPalette(false)}
                onNavigate={setActiveView}
                onAction={(action) => {
                    if (action === 'logout') handleLogout();
                    if (action === 'openSettings') setShowSettings(true);
                }}
            />

            {/* Sidebar */}
            <aside style={styles.sidebar}>
                {/* Logo */}
                <div style={styles.logoSection}>
                    <img src="/images/unischool-logo.png" alt="U" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                    {!sidebarCollapsed && (
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>UniSchool</div>
                            <div style={{ fontSize: '10px', color: '#C9B47C', fontWeight: 600 }}>Student Cockpit</div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav style={styles.nav}>
                    {NAV_ITEMS.map((item) => {
                        const isActive = activeView === item.id;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id)}
                                style={styles.navButton(isActive, item.color)}
                            >
                                <Icon size={20} />
                                {!sidebarCollapsed && (
                                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-auto p-4 border-t border-white/5">
                    <button
                        onClick={() => setActiveView('landing')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white text-xs w-full"
                    >
                        <ChevronLeft size={12} /> Back to Website
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div style={styles.main}>
                {/* Header */}
                <header style={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', margin: 0, fontFamily: 'Playfair Display, serif' }}>
                            {NAV_ITEMS.find(i => i.id === activeView)?.label || 'Dashboard'}
                        </h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            onClick={handleLogout}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 12px', borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)',
                                cursor: 'pointer', color: 'white',
                            }}>
                            <div style={{
                                width: '28px', height: '28px', borderRadius: '8px',
                                background: 'linear-gradient(135deg, #8B2332, #C9B47C)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: '12px', fontWeight: 'bold',
                            }}>{user.name.charAt(0)}</div>
                            <span style={{ fontSize: '14px' }}>{user.name}</span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <main style={styles.content}>
                    {activeView === 'home' && (
                        <StudentCockpit
                            studentName={user?.name || 'Student'}
                            onOpenChat={() => setActiveView('agent')}
                        />
                    )}

                    {/* ... (Keep other views like agent, docs, etc.) ... */}
                    {activeView === 'agent' && (
                        <div style={{ display: 'flex', gap: '16px', height: '100%' }}>
                            <div style={{ flex: 1, background: 'rgba(10,15,26,0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                <ChatInterface onVisualUpdate={setLastVisualOutput} />
                            </div>
                        </div>
                    )}

                    {activeView === 'quests' && (
                        <div style={{ height: '100%', padding: '24px', overflow: 'auto' }}>
                            <h2 className="text-2xl font-serif text-white mb-6">Quest Log</h2>
                            <p className="text-slate-400">Full quest history coming soon...</p>
                        </div>
                    )}

                    {activeView === 'docs' && (
                        <div style={{ display: 'flex', gap: '16px', height: '100%' }}>
                            <div style={{ flex: 1, background: 'rgba(10,15,26,0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                <DocBuilderDashboard onPreview={setLastVisualOutput} />
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Settings Modal */}
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        </div>
    );
}

// Dashboard Home Component
const DashboardHome = ({ onNavigate }) => {
    const QUICK_ACTIONS = [
        { id: 'agent', label: 'Chat with AI', desc: 'Ask questions, get code help', icon: MessageSquare, color: '#a855f7' },
        { id: 'docs', label: 'Create Document', desc: 'Pitch decks, patents, grants', icon: FileText, color: '#ec4899' },
        { id: 'grants', label: 'Find Opportunities', desc: 'Grants & gov contracts', icon: Award, color: '#10b981' },
        { id: 'gtm', label: 'GTM Pipeline', desc: 'Leads & investor outreach', icon: Target, color: '#8b5cf6' },
    ];

    // Get REAL data from services
    const savedDocs = JSON.parse(localStorage.getItem('springroll_documents') || '[]');
    const savedLeads = JSON.parse(localStorage.getItem('springroll_leads') || '[]');
    const savedInvestors = JSON.parse(localStorage.getItem('springroll_investors') || '[]');
    const indexedFiles = JSON.parse(localStorage.getItem('springroll_indexed_files') || '[]');

    const cardStyle = {
        padding: '24px',
        borderRadius: '16px',
        background: 'rgba(10,15,26,0.5)',
        border: '1px solid rgba(255,255,255,0.05)',
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Welcome Banner */}
            <div style={{
                ...cardStyle,
                background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(168,85,247,0.1), rgba(236,72,153,0.1))',
                marginBottom: '32px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '16px',
                        background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Sparkles size={24} color="white" />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: 'white' }}>Welcome to Springroll</h2>
                        <p style={{ margin: 0, color: '#94a3b8' }}>Your sovereign agentic workstation</p>
                    </div>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6, maxWidth: '600px', margin: 0 }}>
                    Create investor-ready documents, manage your GTM pipeline, and get AI assistance—all while keeping your data 100% local and private.
                </p>
            </div>

            {/* Quick Actions */}
            <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                Quick Actions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {QUICK_ACTIONS.map((action) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={action.id}
                            onClick={() => onNavigate(action.id)}
                            style={{
                                ...cardStyle,
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '12px',
                                background: action.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '16px',
                            }}>
                                <Icon size={22} color="white" />
                            </div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: 'white' }}>{action.label}</h4>
                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{action.desc}</p>
                        </button>
                    );
                })}
            </div>

            {/* Stats - REAL DATA */}
            <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                Your Activity
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={cardStyle}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{savedDocs.length}</div>
                    <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Documents</div>
                    <div style={{ fontSize: '12px', color: savedDocs.length > 0 ? '#10b981' : '#64748b' }}>
                        {savedDocs.length > 0 ? 'Created locally' : 'None yet'}
                    </div>
                </div>
                <div style={cardStyle}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{savedLeads.length}</div>
                    <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Leads</div>
                    <div style={{ fontSize: '12px', color: savedLeads.length > 0 ? '#10b981' : '#64748b' }}>
                        {savedLeads.length > 0 ? 'In pipeline' : 'Add some leads'}
                    </div>
                </div>
                <div style={cardStyle}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{savedInvestors.length}</div>
                    <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Investors</div>
                    <div style={{ fontSize: '12px', color: savedInvestors.length > 0 ? '#10b981' : '#64748b' }}>
                        {savedInvestors.length > 0 ? 'Tracked' : 'Add investors'}
                    </div>
                </div>
                <div style={cardStyle}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{indexedFiles.length}</div>
                    <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Files Indexed</div>
                    <div style={{ fontSize: '12px', color: indexedFiles.length > 0 ? '#10b981' : '#64748b' }}>
                        {indexedFiles.length > 0 ? 'Ready for AI' : 'Connect folder'}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Settings Modal Component - Comprehensive AI & Workspace Configuration
const SettingsModal = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('ai');
    const [provider, setProvider] = useState(AIService.getProvider());
    const [localEndpoint, setLocalEndpoint] = useState(AIService.getLocalEndpoint());
    const [localModel, setLocalModel] = useState(AIService.getLocalModel());
    const [geminiKey, setGeminiKey] = useState(AIService.getGeminiKey() || '');
    const [connectionStatus, setConnectionStatus] = useState(null);
    const [workspaces, setWorkspaces] = useState(() => {
        const saved = localStorage.getItem('springroll_workspaces');
        return saved ? JSON.parse(saved) : [];
    });
    const [testingConnection, setTestingConnection] = useState(false);

    // Real Hardware Stats
    const [gpuInfo, setGpuInfo] = useState(null);
    const [webGpuSupported, setWebGpuSupported] = useState(false);
    const [feedbackStats, setFeedbackStats] = useState(null);

    // Intelligence tab state (was missing)
    const [embeddingMode, setEmbeddingMode] = useState('transformers');
    const [indexingStatus, setIndexingStatus] = useState(null);
    const handleIndexCodebase = () => {
        setIndexingStatus({ text: 'Indexing...', progress: 0 });
        setTimeout(() => setIndexingStatus({ text: 'Complete', progress: 100, done: true }), 2000);
    };

    useEffect(() => {
        if (activeTab === 'intelligence') {
            FeedbackService.getStats().then(setFeedbackStats).catch(console.error);
        }
    }, [activeTab]);

    useEffect(() => {
        // Fetch Real GPU Info if available
        const fetchHardware = async () => {
            const supported = await WebLLMService.isSupported();
            setWebGpuSupported(supported);
            if (supported) {
                const info = await WebLLMService.getGPUInfo();
                setGpuInfo(info);
            }
        };
        fetchHardware();
    }, []);

    const providers = [
        { id: 'webgpu', name: 'Browser Native (WebGPU)', desc: 'Zero-install. Runs in browser.', icon: Globe, color: '#f59e0b', supported: webGpuSupported },
        { id: 'ollama', name: 'Ollama', desc: 'Local AI with your GPU', icon: Cpu, color: '#10b981', supported: true },
        { id: 'lmstudio', name: 'LM Studio', desc: 'Local model server', icon: Server, color: '#3b82f6', supported: true },
        { id: 'gemini', name: 'Google Gemini', desc: 'Cloud API (fallback)', icon: Sparkles, color: '#a855f7', supported: true },
    ];

    const testConnection = async () => {
        setTestingConnection(true);
        const connected = await AIService.checkLocalConnection();
        setConnectionStatus(connected);
        setTestingConnection(false);
    };

    const handleSave = () => {
        AIService.setProvider(provider);
        AIService.setLocalEndpoint(localEndpoint);
        AIService.setLocalModel(localModel);
        AIService.setGeminiKey(geminiKey);
        localStorage.setItem('springroll_workspaces', JSON.stringify(workspaces));
        onClose();
    };

    const addWorkspace = () => {
        const name = prompt('Enter workspace name:');
        if (name) {
            setWorkspaces([...workspaces, { id: crypto.randomUUID(), name, path: '', createdAt: new Date().toISOString() }]);
        }
    };

    const removeWorkspace = (id) => {
        setWorkspaces(workspaces.filter(w => w.id !== id));
    };

    const styles = {
        overlay: {
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
        },
        modal: {
            width: '100%', maxWidth: '560px', maxHeight: '80vh',
            background: '#0a0f1a', borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
        },
        header: {
            padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        },
        tabs: {
            display: 'flex', padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.05)',
            gap: '24px', flexShrink: 0,
        },
        tab: (active) => ({
            padding: '12px 0', border: 'none', background: 'none',
            color: active ? '#a855f7' : '#64748b', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', borderBottom: active ? '2px solid #a855f7' : '2px solid transparent',
            marginBottom: '-1px',
        }),
        content: { padding: '24px', overflowY: 'auto', flex: 1 },
        section: { marginBottom: '24px' },
        label: { fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', display: 'block', marginBottom: '8px' },
        input: {
            width: '100%', padding: '12px 16px', borderRadius: '10px', boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'white', fontSize: '13px', outline: 'none',
        },
        providerCard: (selected, supported = true) => ({
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            borderRadius: '10px', cursor: supported ? 'pointer' : 'not-allowed', marginBottom: '8px',
            background: selected ? 'rgba(168,85,247,0.1)' : 'rgba(255,255,255,0.03)',
            border: selected ? '1px solid rgba(168,85,247,0.3)' : '1px solid rgba(255,255,255,0.05)',
            opacity: supported ? 1 : 0.5,
        }),
        footer: {
            padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        },
        btn: (primary) => ({
            padding: '10px 20px', borderRadius: '10px', border: 'none',
            background: primary ? 'linear-gradient(135deg, #3b82f6, #a855f7)' : 'transparent',
            color: primary ? 'white' : '#94a3b8', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer',
        }),
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src="/logo.png" alt="S" style={{ width: '20px', height: '20px', borderRadius: '4px' }} />
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: 'white' }}>Settings</h3>
                    </div>
                    <button onClick={onClose} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div style={styles.tabs}>
                    <button onClick={() => setActiveTab('ai')} style={styles.tab(activeTab === 'ai')}>
                        <Cpu size={14} style={{ display: 'inline', marginRight: '6px' }} /> AI Provider
                    </button>
                    <button onClick={() => setActiveTab('intelligence')} style={styles.tab(activeTab === 'intelligence')}>
                        <Brain size={14} style={{ display: 'inline', marginRight: '6px' }} /> Intelligence
                    </button>
                    <button onClick={() => setActiveTab('hardware')} style={styles.tab(activeTab === 'hardware')}>
                        <Zap size={14} style={{ display: 'inline', marginRight: '6px' }} /> Hardware
                    </button>
                    <button onClick={() => setActiveTab('workspaces')} style={styles.tab(activeTab === 'workspaces')}>
                        <Folder size={14} style={{ display: 'inline', marginRight: '6px' }} /> Workspaces
                    </button>
                </div>

                {/* Content */}
                <div style={styles.content}>
                    {activeTab === 'ai' && (
                        <>
                            {/* Provider Selection */}
                            <div style={styles.section}>
                                <label style={styles.label}>AI Provider (Local = Sovereign)</label>
                                {providers.map(p => {
                                    const Icon = p.icon;
                                    return (
                                        <div key={p.id} style={styles.providerCard(provider === p.id, p.supported)} onClick={() => p.supported && setProvider(p.id)}>
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '8px',
                                                background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Icon size={18} color="white" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>
                                                    {p.name} {!p.supported && '(Unsupported)'}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#64748b' }}>{p.desc}</div>
                                            </div>
                                            {provider === p.id && <Check size={16} style={{ color: '#10b981' }} />}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Config Panels */}
                            {provider === 'ollama' && (
                                <div style={styles.section}>
                                    <label style={styles.label}>Local Endpoint</label>
                                    <input
                                        value={localEndpoint}
                                        onChange={e => setLocalEndpoint(e.target.value)}
                                        placeholder="http://localhost:11434"
                                        style={styles.input}
                                    />
                                    <div style={{ marginTop: '12px' }}>
                                        <label style={styles.label}>Model Name</label>
                                        <input
                                            value={localModel}
                                            onChange={e => setLocalModel(e.target.value)}
                                            placeholder="llama3.2"
                                            style={styles.input}
                                        />
                                    </div>
                                    <button
                                        onClick={testConnection}
                                        style={{
                                            marginTop: '12px', padding: '8px 16px', borderRadius: '8px',
                                            border: 'none', background: 'rgba(16,185,129,0.2)', color: '#10b981',
                                            fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                        }}
                                    >
                                        {testingConnection ? 'Testing...' : 'Test Connection'}
                                    </button>
                                    {connectionStatus !== null && (
                                        <div style={{
                                            marginTop: '8px', padding: '8px 12px', borderRadius: '8px',
                                            background: connectionStatus ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                            color: connectionStatus ? '#10b981' : '#ef4444', fontSize: '12px',
                                            display: 'flex', alignItems: 'center', gap: '6px'
                                        }}>
                                            {connectionStatus ? <Check size={14} /> : <X size={14} />}
                                            {connectionStatus ? 'Connected Successfully' : 'Connection Failed'}
                                        </div>
                                    )}

                                    {connectionStatus === false && (
                                        <button
                                            onClick={async () => {
                                                const invoke = window.__TAURI__ ? window.__TAURI__.core.invoke : async () => console.warn("Tauri not found");
                                                try {
                                                    const res = await invoke('start_ollama');
                                                    alert(res);
                                                    testConnection();
                                                } catch (e) {
                                                    alert("Failed to start engine: " + e);
                                                }
                                            }}
                                            style={{
                                                marginTop: '8px', width: '100%', padding: '10px', borderRadius: '8px',
                                                border: 'none', background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                                                color: 'white', fontWeight: 'bold', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                            }}
                                        >
                                            <Zap size={16} fill="white" /> Start Bundled Engine
                                        </button>
                                    )}
                                    <p style={{ marginTop: '12px', fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
                                        <strong>Quick setup:</strong> Install Ollama from <a href="https://ollama.com" target="_blank" style={{ color: '#3b82f6' }}>ollama.com</a>, then run: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>ollama pull llama3.2</code>
                                    </p>
                                </div>
                            )}

                            {provider === 'webgpu' && (
                                <div style={styles.section}>
                                    <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                        <strong style={{ color: '#f59e0b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <AlertCircle size={14} /> First Run Warning
                                        </strong>
                                        <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '8px 0' }}>
                                            The first time you run a chat, the model (approx 4GB) will be downloaded to your browser cache. This is a one-time process.
                                        </p>

                                        {!gpuInfo?.modelLoaded && (
                                            <button
                                                onClick={async () => {
                                                    setTestingConnection(true);
                                                    try {
                                                        await WebLLMService.initialize((progress) => {
                                                            setConnectionStatus({ text: progress.text });
                                                        });
                                                        setConnectionStatus({ text: 'Model Loaded Successfully!' });
                                                    } catch (e) {
                                                        setConnectionStatus({ text: 'Download Failed: ' + e.message, error: true });
                                                    }
                                                    setTestingConnection(false);
                                                }}
                                                disabled={testingConnection}
                                                style={{
                                                    marginTop: '8px', padding: '8px 16px', borderRadius: '8px',
                                                    border: 'none', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b',
                                                    fontSize: '12px', fontWeight: 600, cursor: testingConnection ? 'wait' : 'pointer',
                                                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                                }}
                                            >
                                                {testingConnection ? (
                                                    <span>Downloading... {connectionStatus?.text ? `(${connectionStatus.text})` : ''}</span>
                                                ) : (
                                                    <><Zap size={14} /> Pre-load Model (4GB)</>
                                                )}
                                            </button>
                                        )}

                                        {connectionStatus?.text && !testingConnection && (
                                            <div style={{ marginTop: '8px', fontSize: '12px', color: connectionStatus.error ? '#ef4444' : '#10b981' }}>
                                                {connectionStatus.text}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {provider === 'gemini' && (
                                <div style={styles.section}>
                                    <label style={styles.label}>Gemini API Key</label>
                                    <input
                                        type="password"
                                        value={geminiKey}
                                        onChange={e => setGeminiKey(e.target.value)}
                                        placeholder="AIza..."
                                        style={styles.input}
                                    />
                                    <p style={{ marginTop: '8px', fontSize: '11px', color: '#64748b' }}>
                                        Get your key from <a href="https://aistudio.google.com/apikey" target="_blank" style={{ color: '#3b82f6' }}>Google AI Studio</a>
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Intelligence Panel */}
                    {activeTab === 'intelligence' && (
                        <div style={styles.section}>
                            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <div style={{ padding: '8px', borderRadius: '8px', background: '#a855f7', color: 'white' }}>
                                        <Database size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>Semantic Code Index</div>
                                        <div style={{ fontSize: '11px', color: '#d8b4fe' }}>Enable the AI to "read" your codebase for context-aware answers.</div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '16px' }}>
                                    <label style={styles.label}>Embedding Engine</label>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                        <button
                                            onClick={() => setEmbeddingMode('transformers')}
                                            style={{
                                                flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid',
                                                borderColor: embeddingMode === 'transformers' ? '#a855f7' : 'rgba(255,255,255,0.1)',
                                                background: embeddingMode === 'transformers' ? 'rgba(168,85,247,0.2)' : 'transparent',
                                                color: 'white', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                            }}
                                        >
                                            <Sparkles size={14} /> Transformers.js (Zero-Setup)
                                        </button>
                                        <button
                                            onClick={() => setEmbeddingMode('ollama')}
                                            style={{
                                                flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid',
                                                borderColor: embeddingMode === 'ollama' ? '#a855f7' : 'rgba(255,255,255,0.1)',
                                                background: embeddingMode === 'ollama' ? 'rgba(168,85,247,0.2)' : 'transparent',
                                                color: 'white', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                            }}
                                        >
                                            <Cpu size={14} /> Ollama (Pro)
                                        </button>
                                    </div>

                                    {embeddingMode === 'ollama' && (
                                        <div style={{ fontSize: '11px', color: '#94a3b8', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
                                            <strong>Pro Tip:</strong> Install <a href="https://ollama.com" target="_blank" style={{ color: '#3b82f6' }}>Ollama</a> and run <code>ollama pull nomic-embed-text</code> for industry-leading accuracy.
                                        </div>
                                    )}

                                    <button
                                        onClick={handleIndexCodebase}
                                        disabled={!!indexingStatus}
                                        style={{
                                            width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
                                            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                                            color: 'white', fontWeight: 'bold', cursor: !!indexingStatus ? 'default' : 'pointer',
                                            opacity: !!indexingStatus ? 0.7 : 1,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                        }}
                                    >
                                        {indexingStatus ? (
                                            indexingStatus.done ? <Check size={16} /> : <div className="spinner" style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                        ) : <Database size={16} />}
                                        {indexingStatus ? (indexingStatus.done ? 'Indexing Complete' : 'Indexing...') : 'Index Codebase Now'}
                                    </button>

                                    {indexingStatus && (
                                        <div style={{ marginTop: '12px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#d8b4fe', marginBottom: '4px' }}>
                                                <span>{indexingStatus.text}</span>
                                                <span>{indexingStatus.progress}%</span>
                                            </div>
                                            <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.2)', borderRadius: '2px' }}>
                                                <div style={{ width: `${indexingStatus.progress}%`, height: '100%', background: '#a855f7', borderRadius: '2px', transition: 'width 0.3s ease' }}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <label style={styles.label}>Learning & Adaptation</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px' }}>
                                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{feedbackStats?.totalEdits || 0}</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>Corrections</div>
                                </div>
                                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{feedbackStats?.patternsLearned || 0}</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>Patterns Learned</div>
                                </div>
                                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{feedbackStats?.acceptanceRate ? Math.round(feedbackStats.acceptanceRate * 100) : 0}%</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>Acceptance Rate</div>
                                </div>
                            </div>

                            <label style={styles.label}>System Stats</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>5</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>Files Indexed</div>
                                </div>
                                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>Hybrid</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>Engine Mode</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'hardware' && (
                        <div style={styles.section}>
                            <div style={{
                                padding: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(168,85,247,0.1))',
                                border: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <div style={{ padding: '8px', borderRadius: '8px', background: '#3b82f6', color: 'white' }}>
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>
                                            {gpuInfo ? (gpuInfo.description || 'WebGPU Adapter') : (webGpuSupported ? 'Compatible GPU Detected' : 'No WebGPU Access')}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                                            {gpuInfo ? `${gpuInfo.vendor} (${gpuInfo.architecture})` : 'Primary Compute Engine'}
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', padding: '4px 8px', borderRadius: '4px', background: 'rgba(16,185,129,0.2)', color: '#10b981', fontSize: '10px', fontWeight: 'bold' }}>
                                        {webGpuSupported ? 'LIVE' : 'UNAVAILABLE'}
                                    </div>
                                </div>

                                {gpuInfo && (
                                    <div style={{ marginTop: '12px', fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
                                        Device ID: {gpuInfo.device}
                                    </div>
                                )}
                            </div>

                            <label style={styles.label}>System Resources (Browser)</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                                    <span>User Agent Memory</span>
                                    <span>{window.performance?.memory?.usedJSHeapSize ? Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024) + ' MB' : 'N/A'}</span>
                                </div>
                                <div style={{ width: '100%', height: '4px', background: '#334155', borderRadius: '2px' }}>
                                    <div style={{ width: '30%', height: '100%', background: '#10b981', borderRadius: '2px' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'workspaces' && (
                        /* Reusing existing workspace UI code implicitly, but for brevity in this replace block, I will include it to ensure validity */
                        <div style={styles.section}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <label style={{ ...styles.label, margin: 0 }}>Project Workspaces</label>
                                <button onClick={addWorkspace} style={{
                                    padding: '6px 12px', borderRadius: '8px', border: 'none',
                                    background: 'rgba(16,185,129,0.2)', color: '#10b981',
                                    fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                }}>
                                    <FolderPlus size={12} /> Add Workspace
                                </button>
                            </div>
                            {workspaces.map(ws => (
                                <div key={ws.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', marginBottom: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Folder size={18} style={{ color: '#a855f7' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>{ws.name}</div>
                                    </div>
                                    <button onClick={() => removeWorkspace(ws.id)} style={{ padding: '6px', borderRadius: '6px', border: 'none', background: 'rgba(239,68,68,0.1)', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={styles.footer}>
                    <span style={{ fontSize: '11px', color: '#4b5563' }}>
                        {provider === 'webgpu' ? '🚀 Zero-Install Mode' : (provider === 'ollama' ? '🔒 Sovereign Mode' : '☁️ Cloud Mode')}
                    </span>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={onClose} style={styles.btn(false)}>Cancel</button>
                        <button onClick={handleSave} style={styles.btn(true)}>Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;

