/**
 * trackingPixels.js — Unified Google Analytics 4 + Meta Pixel tracking utility
 * 
 * Usage:
 *   import { trackPageView, trackEvent, trackBASICSView, trackRSVP } from '../utils/trackingPixels';
 *   trackPageView('BASICS Demo Day');
 *   trackBASICSView('University School');
 *   trackRSVP();
 */

// ─── GA4 Helpers ──────────────────────────────────────────────
function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
}

// ─── Meta Pixel Helpers ───────────────────────────────────────
function fbq(...args) {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq(...args);
    }
}

// ─── Public API ───────────────────────────────────────────────

/**
 * Track a virtual page view in both GA4 and Meta Pixel
 * @param {string} pageName - Human-readable page name
 * @param {string} [pagePath] - Optional URL path override
 */
export function trackPageView(pageName, pagePath) {
    const path = pagePath || window.location.pathname;

    // GA4
    gtag('event', 'page_view', {
        page_title: pageName,
        page_location: window.location.href,
        page_path: path,
    });

    // Meta Pixel
    fbq('track', 'PageView');
}

/**
 * Fire a custom event in both GA4 and Meta Pixel
 * @param {string} eventName - Event name (e.g., 'sign_up', 'lead')
 * @param {Object} [params] - Key-value parameters
 */
export function trackEvent(eventName, params = {}) {
    // GA4
    gtag('event', eventName, params);

    // Meta Pixel — map to standard events where possible
    const metaEventMap = {
        sign_up: 'CompleteRegistration',
        lead: 'Lead',
        contact: 'Contact',
        view_content: 'ViewContent',
    };
    const metaEvent = metaEventMap[eventName] || eventName;
    fbq('trackCustom', metaEvent, params);
}

/**
 * Track when an investor views a BASICS cohort company card
 * Fires Meta Pixel ViewContent for remarketing audience building
 * @param {string} companyName - Name of the company viewed
 */
export function trackBASICSView(companyName) {
    // GA4
    gtag('event', 'view_basics_company', {
        company_name: companyName,
        content_category: 'BASICS_Demo_Day',
        event_category: 'investor_engagement',
    });

    // Meta Pixel — ViewContent is a standard remarketing event
    fbq('track', 'ViewContent', {
        content_name: companyName,
        content_category: 'BASICS_Demo_Day',
        content_type: 'startup_deal',
    });
}

/**
 * Track when a user clicks the Partiful RSVP button
 * Fires a Lead conversion event for both platforms
 */
export function trackRSVP() {
    // GA4
    gtag('event', 'generate_lead', {
        event_category: 'BASICS_Demo_Day',
        event_label: 'Partiful_RSVP',
        value: 1,
    });

    // Meta Pixel — Lead is a high-value standard event
    fbq('track', 'Lead', {
        content_name: 'BASICS Demo Day RSVP',
        content_category: 'BASICS_Demo_Day',
    });
}

/**
 * Track Sydecar deal link clicks
 * @param {string} companyName - Company whose deal was clicked
 */
export function trackSydecarClick(companyName) {
    // GA4
    gtag('event', 'sydecar_click', {
        company_name: companyName,
        event_category: 'investor_conversion',
    });

    // Meta Pixel
    fbq('track', 'InitiateCheckout', {
        content_name: companyName,
        content_category: 'Sydecar_Deal',
    });
}
