const SETTINGS_KEY = 'eventSettings';
const ANALYTICS_KEY = 'eventAnalytics';

/* Add default settings so the app loads LOTE PROMOCIONAL R$25 by default */
const DEFAULT_SETTINGS = {
    currentTicketLote: 'LOTE PROMOCIONAL',
    currentTicketPrice: '25',
    countdownDateTime: '2025-09-13T23:00',
    countdownNextLoteName: 'PRÓXIMO LOTE',
    countdownNextLotePrice: '30',
    whatsappLink: 'https://wa.link/up56az'
};

export function getSettings() {
    try {
        const savedSettings = localStorage.getItem(SETTINGS_KEY);
        return savedSettings ? { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) } : DEFAULT_SETTINGS;
    } catch (e) {
        console.error("Error parsing settings from localStorage", e);
        return DEFAULT_SETTINGS;
    }
}

export function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
        console.error("Error saving settings to localStorage", e);
    }
}

export function getAnalytics() {
    try {
        const savedAnalytics = localStorage.getItem(ANALYTICS_KEY);
        return savedAnalytics ? JSON.parse(savedAnalytics) : { pageViews: 0, whatsappClicks: 0 };
    } catch (e) {
        console.error("Error parsing analytics from localStorage", e);
        return { pageViews: 0, whatsappClicks: 0 };
    }
}

export function saveAnalytics(analytics) {
    try {
        localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
    } catch (e) {
        console.error("Error saving analytics to localStorage", e);
    }
}