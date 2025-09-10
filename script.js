/* Removed admin/localDb dependency — keep landing data in-source and use localStorage for analytics */

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

// Analytics tracking (persisted in localStorage)
let analyticsKey = 'eventAnalytics';
let analytics = { pageViews: 0, whatsappClicks: 0 };
function loadAnalytics() {
    try {
        const raw = localStorage.getItem(analyticsKey);
        analytics = raw ? JSON.parse(raw) : analytics;
    } catch (e) { analytics = analytics; }
    return analytics;
}
function saveAnalytics() {
    try { localStorage.setItem(analyticsKey, JSON.stringify(analytics)); } catch (e) {}
}

// Track page view
function trackPageView() { analytics.pageViews++; saveAnalytics(); }

// Track WhatsApp click
function trackWhatsAppClick() { analytics.whatsappClicks++; saveAnalytics(); }

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
document.querySelectorAll('a[href*="wa.me"], a[href*="wa.link"]').forEach(link => {
    link.addEventListener('click', () => {
        // Track WhatsApp clicks for analytics
        trackWhatsAppClick();
        console.log('WhatsApp button clicked');
    });
});

// Declare countdownInterval to avoid ReferenceError when used before initialization
let countdownInterval = null;

/* DOM elements to manage (no admin) */
const heroTitle = document.querySelector('.hero-title');
const eventVenue = document.querySelector('.event-venue');
const eventDate = document.querySelector('.event-date');
const heroTagline = document.querySelector('.hero-tagline');
const whyAttendTitle = document.querySelector('.why-attend-section .section-title');
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

function getInitialDOMSettings() {
    const venueHTML = (eventVenue && eventVenue.innerHTML) || '';
    const venueTextElement = document.createElement('div');
    venueTextElement.innerHTML = venueHTML;
    if (venueTextElement.querySelector('svg')) venueTextElement.querySelector('svg').remove();
    const venueText = venueTextElement.textContent.trim();

    const dateHTML = (eventDate && eventDate.innerHTML) || '';
    const dateTextElement = document.createElement('div');
    dateTextElement.innerHTML = dateHTML;
    if (dateTextElement.querySelector('svg')) dateTextElement.querySelector('svg').remove();
    const dateText = dateTextElement.textContent.trim();
    
    const currentPrimaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    const currentHeroBgImage = getComputedStyle(document.documentElement).getPropertyValue('--hero-bg-image').replace(/url\(["']?(.*?)["']?\)/, '$1').trim();
    const firstWa = document.querySelector('.whatsapp-link');
    const ytSrc = heroIframe?.src || '';
    const bullets = Array.from((whyAttendList?.querySelectorAll('li') || [])).map(li => li.textContent.trim());
    const secColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim();

    return {
        eventName: heroTitle?.textContent || '',
        venue: venueText || 'Clube União – Itaocara/RJ',
        date: dateText || 'Sábado, 13 de Setembro - 23h',
        tagline: heroTagline?.innerHTML || '',
        whyAttendTitle: whyAttendTitle?.textContent || '',
        ticketsTitle: ticketsTitle?.textContent || '',
        locationTitle: locationTitle?.textContent || '',
        currentTicketLote: currentLoteName?.textContent || 'SEGUNDO LOTE',
        currentTicketPrice: currentLotePrice?.textContent.replace('R$', '').replace(',', '.').trim() || '30',
        primaryColor: currentPrimaryColor || '#ff6b35',
        heroBgImgSrc: currentHeroBgImage || '/O AFTER É LOGO ALI - STORIES.png',
        countdownDateTime: '2025-09-13T23:00',
        countdownNextLoteName: 'PRÓXIMO LOTE',
        countdownNextLotePrice: '30',
        whatsappLink: firstWa ? firstWa.getAttribute('href') : 'https://wa.link/up56az',
        youtubeURL: ytSrc,
        whyAttendBullets: bullets.join('\n'),
        finalTitle: finalTitleEl?.innerHTML || '',
        locationName: locationNameEl?.textContent || 'Clube União',
        locationAddress: locationAddressEl?.innerHTML || 'Av. Pres. Sodré, 5 – Centro<br>Itaocara/RJ',
        mapUrl: mapIframe?.src || '',
        secondaryColor: secColor || '#7A3CFF'
    };
}

function loadSettings() {
    // Keep landing data in source (no admin). Allow overrides via localStorage for dev convenience.
    const currentDOMSettings = getInitialDOMSettings();
    try {
        const raw = localStorage.getItem('eventSettings');
        const saved = raw ? JSON.parse(raw) : null;
        return saved ? { ...currentDOMSettings, ...saved } : currentDOMSettings;
    } catch (e) {
        return currentDOMSettings;
    }
}

function applySettings(settings) {
    heroTitle.textContent = settings.eventName;
    eventVenue.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${settings.venue}`;
    eventDate.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> ${settings.date}`;
    heroTagline.innerHTML = settings.tagline;
    whyAttendTitle.textContent = settings.whyAttendTitle;
    ticketsTitle.textContent = settings.ticketsTitle;
    locationTitle.textContent = settings.locationTitle;
    
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--hero-bg-image', `url('${settings.heroBgImgSrc}')`);
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
    
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
        countdownContainer.style.display = 'block';

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
        if (countdownInterval) clearInterval(countdownInterval);
    }
}

// Apply settings on initial load
document.addEventListener('DOMContentLoaded', () => {
    // Load analytics, apply source-based settings
    loadAnalytics();
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