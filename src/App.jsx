import React, { useState, useEffect } from 'react';
import { WebsiteLayout } from './components/public/WebsiteLayout';
import { LandingPage } from './components/public/LandingPage';
import { StudentPage } from './components/public/StudentPage';
import { FranchisePage } from './components/public/FranchisePage';
import { TransferPartners } from './components/public/TransferPartners';
import { AboutPage } from './components/public/AboutPage';
import { ProcessPage } from './components/public/ProcessPage';
import { ASULectureTransformer } from './components/public/ASULectureTransformer';

export const USAI_APP_URL = '';

const VALID_PAGES = new Set([
    'landing',
    'students',
    'franchise',
    'partners',
    'about',
    'process',
    'asu-demo',
]);

function resolveInitialPage() {
    if (typeof window === 'undefined') return 'landing';
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    if (!path || path === 'home') return 'landing';
    if (VALID_PAGES.has(path)) return path;
    return 'landing';
}

function App() {
    const [activeView, setActiveView] = useState(resolveInitialPage);

    const handleNavigate = (target) => {
        if (target === 'signup') {
            window.location.href = `${USAI_APP_URL}/signup`;
            return;
        }
        if (target === 'login') {
            window.location.href = `${USAI_APP_URL}/login`;
            return;
        }
        if (target === 'class-studio') {
            window.location.href = `${USAI_APP_URL}/dashboard/class-studio`;
            return;
        }
        if (target === 'degree-planner') {
            window.location.href = `${USAI_APP_URL}/dashboard/degree-planner`;
            return;
        }
        if (target === 'asu-companion') {
            window.location.href = `${USAI_APP_URL}/dashboard/asu-companion`;
            return;
        }
        const normalized = target === 'home' ? 'landing' : target;
        setActiveView(VALID_PAGES.has(normalized) ? normalized : 'landing');
    };

    return (
        <WebsiteLayout
            activePage={activeView === 'landing' ? 'home' : activeView}
            onNavigate={handleNavigate}
        >
            {activeView === 'landing' && <LandingPage onNavigate={handleNavigate} />}
            {activeView === 'students' && <StudentPage onNavigate={handleNavigate} />}
            {activeView === 'franchise' && <FranchisePage onNavigate={handleNavigate} />}
            {activeView === 'partners' && <TransferPartners onNavigate={handleNavigate} />}
            {activeView === 'about' && <AboutPage onNavigate={handleNavigate} />}
            {activeView === 'process' && <ProcessPage onNavigate={handleNavigate} />}
            {activeView === 'asu-demo' && <ASULectureTransformer onNavigate={handleNavigate} />}
        </WebsiteLayout>
    );
}

export default App;
