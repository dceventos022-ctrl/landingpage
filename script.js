import * as localDb from 'localDb';

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Prevent querySelector from being called with an invalid selector like '#'
        if (href && href.length > 1 && href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Analytics tracking
let analytics = {
    pageViews: 0,
    whatsappClicks: 0
};

// Load analytics from localStorage
function loadAnalytics() {
    analytics = localDb.getAnalytics();
    return analytics;
}

// Save analytics to localStorage
function saveAnalytics() {
    localDb.saveAnalytics(analytics);
}

// Track page view
function trackPageView() {
    analytics.pageViews++;
    saveAnalytics();
}

// Track WhatsApp click
function trackWhatsAppClick() {
    analytics.whatsappClicks++;
    saveAnalytics();
}

// Update dashboard display
function updateDashboard() {
    const pageViewsElement = document.getElementById('dashboard-page-views');
    const whatsappClicksElement = document.getElementById('dashboard-whatsapp-clicks');
    
    if (pageViewsElement) pageViewsElement.textContent = analytics.pageViews;
    if (whatsappClicksElement) whatsappClicksElement.textContent = analytics.whatsappClicks;
}

// Add scroll-triggered animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Track page view on load
    loadAnalytics();
    trackPageView();
    
    const animatedElements = document.querySelectorAll('.ticket-card, .location-card, .why-attend-section .why-attend-image, .why-attend-section .why-attend-text');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add floating animation to CTA buttons
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.02)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// WhatsApp tracking (optional)
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
        // Track WhatsApp clicks for analytics
        trackWhatsAppClick();
        console.log('WhatsApp button clicked');
    });
});

// Admin Panel Logic
const adminPassword = 'Dji15011729$';
const adminPanelOverlay = document.getElementById('admin-panel-overlay');
const adminForm = document.getElementById('admin-form');
const logoMain = document.getElementById('logo-main'); // Get the logo element
const adminCancelBtn = document.getElementById('adminCancelBtn');

// DOM elements to manage
const heroTitle = document.querySelector('.hero-title');
const eventVenue = document.querySelector('.event-venue');
const eventDate = document.querySelector('.event-date');
const heroTagline = document.querySelector('.hero-tagline');
const whyAttendTitle = document.querySelector('.why-attend-section .section-title'); // New: Why Attend Title
const ticketsTitle = document.querySelector('.tickets-section .section-title');
const locationTitle = document.querySelector('.location-section .section-title');
const heroIframe = document.querySelector('.hero-video iframe');
const whatsappLinks = () => document.querySelectorAll('.whatsapp-link');
const whyAttendList = document.querySelector('.why-attend-text ul');
const finalTitleEl = document.querySelector('.final-title');
const locationNameEl = document.querySelector('.location-info h3');
const locationAddressEl = document.querySelector('.location-info p');
const mapIframe = document.querySelector('.map-placeholder iframe');

// Ticket & Countdown elements
const currentLoteName = document.getElementById('current-lote-name');
const currentLotePrice = document.getElementById('current-lote-price');
const countdownContainer = document.getElementById('countdown-container');
const daysSpan = document.getElementById('days');
const hoursSpan = document.getElementById('hours');
const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');
const nextLoteDisplay = document.getElementById('next-lote-display');
const nextLoteName = document.getElementById('next-lote-name');
const nextLotePrice = document.getElementById('next-lote-price');

// Form inputs
const adminEventName = document.getElementById('adminEventName');
const adminVenue = document.getElementById('adminVenue');
const adminDate = document.getElementById('adminDate');
const adminTagline = document.getElementById('adminTagline');
const adminWhyAttendTitle = document.getElementById('adminWhyAttendTitle'); // New: Why Attend Title input
const adminTicketsTitle = document.getElementById('adminTicketsTitle');
const adminLocationTitle = document.getElementById('adminLocationTitle');
const adminCurrentTicketLote = document.getElementById('adminCurrentTicketLote'); // Renamed
const adminCurrentTicketPrice = document.getElementById('adminCurrentTicketPrice'); // Renamed
const adminCountdownDateTime = document.getElementById('adminCountdownDateTime'); // New
const adminCountdownNextLoteName = document.getElementById('adminCountdownNextLoteName'); // New
const adminCountdownNextLotePrice = document.getElementById('adminCountdownNextLotePrice'); // New
const adminPrimaryColor = document.getElementById('adminPrimaryColor');
const adminHeroBg = document.getElementById('adminHeroBg');
const adminYouTubeURL = document.getElementById('adminYouTubeURL');
const adminWhatsAppLink = document.getElementById('adminWhatsAppLink');
const adminWhyAttendBullets = document.getElementById('adminWhyAttendBullets');
const adminFinalTitle = document.getElementById('adminFinalTitle');
const adminLocationName = document.getElementById('adminLocationName');
const adminLocationAddress = document.getElementById('adminLocationAddress');
const adminMapUrl = document.getElementById('adminMapUrl');
const adminSecondaryColor = document.getElementById('adminSecondaryColor');

let countdownInterval; // To store the interval ID for the countdown

// Function to get current settings from DOM as fallback/initial
function getInitialDOMSettings() {
    const venueTextElement = document.createElement('div');
    venueTextElement.innerHTML = eventVenue.innerHTML;
    if (venueTextElement.querySelector('svg')) venueTextElement.querySelector('svg').remove();
    const venueText = venueTextElement.textContent.trim();

    const dateTextElement = document.createElement('div');
    dateTextElement.innerHTML = eventDate.innerHTML;
    if (dateTextElement.querySelector('svg')) dateTextElement.querySelector('svg').remove();
    const dateText = dateTextElement.textContent.trim();

    const currentPrimaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    const currentHeroBgImage = getComputedStyle(document.documentElement).getPropertyValue('--hero-bg-image').replace(/url\(["']?(.*?)["']?\)/, '$1').trim();

    const firstWa = document.querySelector('.whatsapp-link');
    const ytSrc = heroIframe?.src || '';
    const bullets = Array.from(whyAttendList?.querySelectorAll('li') || []).map(li => li.textContent.trim());
    const secColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim();

    return {
        eventName: heroTitle.textContent,
        venue: venueText,
        date: dateText,
        tagline: heroTagline.innerHTML,
        whyAttendTitle: whyAttendTitle.textContent, // New
        ticketsTitle: ticketsTitle.textContent,
        locationTitle: locationTitle.textContent,
        currentTicketLote: currentLoteName.textContent,
        currentTicketPrice: currentLotePrice.textContent.replace('R$ ', ''),
        primaryColor: currentPrimaryColor || '#ff6b35',
        heroBgImgSrc: currentHeroBgImage || '/O AFTER É LOGO ALI - STORIES.png',
        // Default values for new countdown fields
        countdownDateTime: '2025-08-09T00:00', // Set new default countdown time
        countdownNextLoteName: 'TERCEIRO LOTE', // Set new default next lote name
        countdownNextLotePrice: '30', // Set new default next lote price
        whatsappLink: firstWa ? firstWa.getAttribute('href') : '',
        youtubeURL: ytSrc,
        whyAttendBullets: bullets.join('\n'),
        finalTitle: finalTitleEl.innerHTML,
        locationName: locationNameEl.textContent,
        locationAddress: locationAddressEl.innerHTML,
        mapUrl: mapIframe?.src || '',
        secondaryColor: secColor || '#7A3CFF'
    };
}

function loadSettings() {
    const savedSettings = localDb.getSettings();
    const currentDOMSettings = getInitialDOMSettings();

    // Merge saved settings with current DOM settings (DOM as fallback for new fields)
    return savedSettings ? { ...currentDOMSettings, ...savedSettings } : currentDOMSettings;
}

function applySettings(settings) {
    heroTitle.textContent = settings.eventName;
    eventVenue.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${settings.venue}`;
    eventDate.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> ${settings.date}`;
    heroTagline.innerHTML = settings.tagline;
    whyAttendTitle.textContent = settings.whyAttendTitle; // New
    ticketsTitle.textContent = settings.ticketsTitle;
    locationTitle.textContent = settings.locationTitle;
    
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--hero-bg-image', `url('${settings.heroBgImgSrc}')`);
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
    
    if (logoMain) {
        logoMain.style.filter = `drop-shadow(0 0 20px ${settings.primaryColor}4D)`;
    }

    // Ensure all WhatsApp CTA links are updated from settings
    setWhatsAppHref(settings.whatsappLink);
    
    // Apply ticket and countdown logic
    updateTicketAndCountdown(settings);
}

function updateTicketAndCountdown(settings) {
    const countdownDate = new Date(settings.countdownDateTime);
    const now = new Date();

    if (settings.countdownDateTime && countdownDate > now) {
        // Countdown is active
        currentLoteName.textContent = settings.currentTicketLote;
        currentLotePrice.textContent = `R$ ${parseFloat(settings.currentTicketPrice).toFixed(2).replace('.', ',')}`; // Format to currency
        nextLoteName.textContent = settings.countdownNextLoteName;
        nextLotePrice.textContent = `R$ ${parseFloat(settings.countdownNextLotePrice).toFixed(2).replace('.', ',')}`; // Format to currency
        countdownContainer.style.display = 'block';
        nextLoteDisplay.style.display = 'block';

        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            const distance = countdownDate - new Date();
            if (distance < 0) {
                clearInterval(countdownInterval);
                updateTicketAndCountdown(settings); // Call again to switch to next lote
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysSpan.textContent = String(days).padStart(2, '0');
            hoursSpan.textContent = String(hours).padStart(2, '0');
            minutesSpan.textContent = String(minutes).padStart(2, '0');
            secondsSpan.textContent = String(seconds).padStart(2, '0');
        }, 1000);
    } else {
        // Countdown is over or not set, display next lote as current
        currentLoteName.textContent = settings.countdownNextLoteName;
        currentLotePrice.textContent = `R$ ${parseFloat(settings.countdownNextLotePrice).toFixed(2).replace('.', ',')}`; // Format to currency
        countdownContainer.style.display = 'none';
        nextLoteDisplay.style.display = 'none';
        if (countdownInterval) clearInterval(countdownInterval);
    }
}

function populateAdminForm(settings) {
    // Update dashboard when admin panel opens
    updateDashboard();
    
    adminEventName.value = settings.eventName;
    adminVenue.value = settings.venue;
    adminDate.value = settings.date;
    adminTagline.value = settings.tagline.replace(/<br>/g, '\n');
    adminWhyAttendTitle.value = settings.whyAttendTitle; // New
    adminTicketsTitle.value = settings.ticketsTitle;
    adminLocationTitle.value = settings.locationTitle;
    adminCurrentTicketLote.value = settings.currentTicketLote;
    adminCurrentTicketPrice.value = settings.currentTicketPrice;
    adminPrimaryColor.value = settings.primaryColor;
    adminHeroBg.value = settings.heroBgImgSrc;

    // Set datetime-local input value, ensure format is correct
    if (settings.countdownDateTime) {
        const date = new Date(settings.countdownDateTime);
        // Format to YYYY-MM-DDTHH:MM for datetime-local input
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        adminCountdownDateTime.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    } else {
        adminCountdownDateTime.value = '';
    }
    
    adminCountdownNextLoteName.value = settings.countdownNextLoteName;
    adminCountdownNextLotePrice.value = settings.countdownNextLotePrice;
    adminYouTubeURL.value = settings.youtubeURL || '';
    adminWhatsAppLink.value = settings.whatsappLink || '';
    adminWhyAttendBullets.value = settings.whyAttendBullets || '';
    adminFinalTitle.value = settings.finalTitle || '';
    adminLocationName.value = settings.locationName || '';
    adminLocationAddress.value = settings.locationAddress || '';
    adminMapUrl.value = settings.mapUrl || '';
    adminSecondaryColor.value = settings.secondaryColor || '#7A3CFF';
}

// Admin access via logo clicks
let clickCount = 0;
let clickTimer = null;
const requiredClicks = 8;
const clickTimeoutMs = 500; // Time between clicks to count as "sequential"

logoMain.addEventListener('click', () => {
    clickCount++;
    if (clickTimer) {
        clearTimeout(clickTimer);
    }
    clickTimer = setTimeout(() => {
        clickCount = 0; // Reset count if too much time passes
        clickTimer = null;
    }, clickTimeoutMs);

    if (clickCount >= requiredClicks) {
        clickCount = 0; // Reset immediately after opening
        clearTimeout(clickTimer);
        clickTimer = null;

        const password = prompt('Digite a senha de administrador:');
        if (password === adminPassword) {
            adminPanelOverlay.style.display = 'flex';
            populateAdminForm(loadSettings()); // Load and populate
        } else if (password !== null) {
            alert('Senha incorreta!');
        }
    }
});

adminCancelBtn.addEventListener('click', () => {
    adminPanelOverlay.style.display = 'none';
});

adminForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newSettings = {
        eventName: adminEventName.value,
        venue: adminVenue.value,
        date: adminDate.value,
        tagline: adminTagline.value.replace(/\n/g, '<br>'),
        whyAttendTitle: adminWhyAttendTitle.value, // New
        ticketsTitle: adminTicketsTitle.value,
        locationTitle: adminLocationTitle.value,
        currentTicketLote: adminCurrentTicketLote.value,
        currentTicketPrice: adminCurrentTicketPrice.value,
        countdownDateTime: adminCountdownDateTime.value, // Save as string from datetime-local
        countdownNextLoteName: adminCountdownNextLoteName.value,
        countdownNextLotePrice: adminCountdownNextLotePrice.value,
        primaryColor: adminPrimaryColor.value,
        heroBgImgSrc: adminHeroBg.value,
        youtubeURL: adminYouTubeURL.value,
        whatsappLink: adminWhatsAppLink.value,
        whyAttendBullets: adminWhyAttendBullets.value,
        finalTitle: adminFinalTitle.value,
        locationName: adminLocationName.value,
        locationAddress: adminLocationAddress.value,
        mapUrl: adminMapUrl.value,
        secondaryColor: adminSecondaryColor.value
    };

    localDb.saveSettings(newSettings);
    applySettings(newSettings);
    adminPanelOverlay.style.display = 'none';
    alert('Configurações salvas com sucesso!');
});

// Apply settings on initial load
document.addEventListener('DOMContentLoaded', () => {
    applySettings(loadSettings());
});

function setWhatsAppHref(href) {
    if (!href) return;
    whatsappLinks().forEach(a => a.setAttribute('href', href));
}

function renderBullets(bulletsStr) {
    const lines = bulletsStr.split('\n').map(l => l.trim()).filter(Boolean);
    whyAttendList.innerHTML = '';
    lines.forEach(line => {
        const li = document.createElement('li');
        const parts = line.split(' – ');
        if (parts.length > 1) {
            li.innerHTML = `<strong>${parts[0]} –</strong> ${parts.slice(1).join(' – ')}`;
        } else {
            const dash = line.split(' - ');
            li.innerHTML = dash.length > 1 ? `<strong>${dash[0]} –</strong> ${dash.slice(1).join(' - ')}` : line;
        }
        whyAttendList.appendChild(li);
    });
}

function toEmbedUrl(url) {
    if (!url) return '';
    if (url.includes('youtube.com/embed/') || url.includes('youtu.be/') === false) return url.replace('watch?v=', 'embed/');
    const id = url.split('/').pop().split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
}