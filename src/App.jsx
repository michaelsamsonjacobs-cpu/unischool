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
import { StudentPortfolio } from './components/StudentPortfolio';

// New Admin & Auth Components
import { MagicLinkAuth } from './components/MagicLinkAuth';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { AcademicGoalSurvey } from './components/AcademicGoalSurvey';
import { FranchiseOwnerDashboard } from './components/FranchiseOwnerDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { SettingsModal } from './components/SettingsModal'; // New Import
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
import { AboutPage } from './components/public/AboutPage';
import { ProcessPage } from './components/public/ProcessPage';
import { AdvisorDashboard } from './components/AdvisorDashboard';
import { HelpCenter } from './components/HelpCenter';

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


    // Default to 'landing' for marketing focus, unless we differ to /app
    const [activeView, setActiveView] = useState(() => {
        if (window.location.pathname.startsWith('/app')) {
            return 'home';
        }
        return 'landing';
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

    // AI Configuration State
    const [provider, setProvider] = useState(() => AIService.getProvider());
    const [localEndpoint, setLocalEndpoint] = useState(() => AIService.getLocalEndpoint());
    const [localModel, setLocalModel] = useState(() => AIService.getLocalModel());
    const [geminiKey, setGeminiKey] = useState(() => AIService.getGeminiKey() || '');
    const [groqKey, setGroqKey] = useState(() => AIService.getGroqKey() || '');

    // Sync AI State with Service
    useEffect(() => {
        AIService.setProvider(provider);
    }, [provider]);

    useEffect(() => {
        AIService.setLocalEndpoint(localEndpoint);
    }, [localEndpoint]);

    useEffect(() => {
        AIService.setLocalModel(localModel);
    }, [localModel]);

    useEffect(() => {
        if (geminiKey) AIService.setGeminiKey(geminiKey);
    }, [geminiKey]);

    useEffect(() => {
        if (groqKey) AIService.setGroqKey(groqKey);
    }, [groqKey]);

    // Hardware Info (mock/stub for now)
    const [gpuInfo, setGpuInfo] = useState(null);
    const [webGpuSupported, setWebGpuSupported] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(null);
    const [testingConnection, setTestingConnection] = useState(false);
    const [workspaces, setWorkspaces] = useState([]);

    const testConnection = async () => {
        setTestingConnection(true);
        try {
            const result = await AIService.checkLocalConnection();
            setConnectionStatus(result);
        } catch (e) {
            setConnectionStatus(false);
        } finally {
            setTestingConnection(false);
        }
    };

    const addWorkspace = (ws) => setWorkspaces([...workspaces, ws]);
    const removeWorkspace = (id) => setWorkspaces(workspaces.filter(w => w.id !== id));

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
    const publicPages = ['landing', 'students', 'franchise', 'partners', 'about', 'process'];
    if (publicPages.includes(activeView)) {
        return (
            <WebsiteLayout activePage={activeView === 'landing' ? 'home' : activeView} onNavigate={setActiveView}>
                {activeView === 'landing' && <LandingPage onNavigate={setActiveView} />}
                {activeView === 'students' && <StudentPage onNavigate={setActiveView} />}
                {activeView === 'franchise' && <FranchisePage onNavigate={setActiveView} />}
                {activeView === 'partners' && <TransferPartners />}
                {activeView === 'about' && <AboutPage onNavigate={setActiveView} />}
                {activeView === 'process' && <ProcessPage onNavigate={setActiveView} />}
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
    // 4. Main Authenticated Application
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#FAF8F5] text-slate-800 font-sans">
            {/* Command Palette (Global) */}
            <CommandPalette
                isOpen={showPalette}
                onClose={() => setShowPalette(false)}
                onNavigate={setActiveView}
                onAction={(action) => {
                    if (action === 'logout') handleLogout();
                    if (action === 'openSettings') setShowSettings(true);
                }}
            />

            {/* Application Sidebar */}
            <aside
                className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-20 flex-shrink-0 shadow-sm`}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 border-b border-slate-100">
                    <img
                        src="/images/unischool-logo.png"
                        alt="Logo"
                        className="w-10 h-10 object-contain rounded-lg"
                    />
                    {!sidebarCollapsed && (
                        <div className="ml-3">
                            <h1 className="font-serif font-bold text-lg text-[#2D2D2D] leading-none">University</h1>
                            <span className="text-xs font-bold text-[#8B2332] tracking-wider uppercase">School</span>
                        </div>
                    )}
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive = activeView === item.id || (item.id === 'home' && activeView === 'cockpit');
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id === 'home' ? 'home' : item.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-[#8B2332]/5 text-[#8B2332] font-semibold ring-1 ring-[#8B2332]/10'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'
                                    }
                                `}
                                title={item.label}
                            >
                                <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-[#8B2332]' : 'bg-slate-100 group-hover:bg-white group-hover:shadow-sm'}`}>
                                    <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-[#8B2332]'} />
                                </div>
                                {!sidebarCollapsed && (
                                    <span>{item.label}</span>
                                )}
                                {isActive && !sidebarCollapsed && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#8B2332]" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <button
                        onClick={() => {
                            setActiveView('landing');
                            window.history.pushState({}, '', '/');
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg text-slate-500 hover:text-[#8B2332] transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
                        title="Back to Website"
                    >
                        <ChevronLeft size={18} />
                        {!sidebarCollapsed && <span className="text-xs font-semibold">Back to Website</span>}
                    </button>

                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="mt-4 w-full flex items-center justify-center p-2 text-slate-400 hover:text-slate-600"
                    >
                        {sidebarCollapsed ? <ChevronRight size={16} /> : <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold"><Layers size={14} /> Collapse</div>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-[#FAF8F5]">
                {/* Dynamic Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
                    {/* Views */}
                    {(activeView === 'cockpit' || activeView === 'home') && (
                        <StudentCockpit
                            studentName={user.name || "Guest"}
                            onOpenChat={() => setActiveView('agent')}
                        />
                    )}

                    {activeView === 'agent' && (
                        <div className="h-full bg-white max-w-5xl mx-auto shadow-sm border-x border-slate-200">
                            <ChatInterface
                                messages={[]}
                                onSendMessage={(msg) => console.log(msg)}
                                isProcessing={false}
                            />
                        </div>
                    )}

                    {activeView === 'quests' && (
                        <div className="p-8 max-w-7xl mx-auto">
                            <h1 className="text-3xl font-serif font-bold text-[#2D2D2D] mb-6">Quest Log</h1>
                            <div className="p-12 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400">
                                <Target size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Quest System Loading...</p>
                            </div>
                        </div>
                    )}

                    {activeView === 'docs' && (
                        <DocBuilderDashboard onPreview={(doc) => console.log(doc)} />
                    )}

                    {activeView === 'help' && (
                        <div className="h-full overflow-auto bg-white">
                            <HelpCenter />
                        </div>
                    )}
                </div>
            </main>

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettings && (
                    <SettingsModal
                        onClose={() => setShowSettings(false)}
                        provider={provider}
                        setProvider={setProvider}
                        localEndpoint={localEndpoint}
                        setLocalEndpoint={setLocalEndpoint}
                        localModel={localModel}
                        setLocalModel={setLocalModel}
                        geminiKey={geminiKey}
                        setGeminiKey={setGeminiKey}
                        groqKey={groqKey}
                        setGroqKey={setGroqKey}
                        activeTab={rightPanelTab === 'settings' ? 'inference' : 'inference'} // Default to inference
                        setActiveTab={(tab) => console.log(tab)} // Placeholder if needed
                        embeddingMode={embeddingMode}
                        setEmbeddingMode={setEmbeddingMode}
                        onIndexCodebase={() => setIndexingStatus({ progress: 10, text: 'Indexing...' })}
                        indexingStatus={indexingStatus}
                        gpuInfo={gpuInfo}
                        webGpuSupported={webGpuSupported}
                        workspaces={workspaces}
                        addWorkspace={addWorkspace}
                        removeWorkspace={removeWorkspace}
                        testConnection={testConnection}
                        testingConnection={testingConnection}
                        connectionStatus={connectionStatus}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;

