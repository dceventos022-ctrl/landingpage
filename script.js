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
        console.log('WhatsApp button clicked');
    });
});

// Admin Panel Logic
const adminPassword = 'Dji15011729$';
const adminPanelOverlay = document.getElementById('admin-panel-overlay');
const adminForm = document.getElementById('admin-form');
const adminAccessBtn = document.getElementById('admin-access-btn');
const adminCancelBtn = document.getElementById('adminCancelBtn');

// DOM elements to manage
const heroTitle = document.querySelector('.hero-title');
const eventVenue = document.querySelector('.event-venue');
const eventDate = document.querySelector('.event-date');
const heroTagline = document.querySelector('.hero-tagline');
const ticketsTitle = document.querySelector('.tickets-section .section-title');
const locationTitle = document.querySelector('.location-section .section-title');
const ticketLote = document.querySelector('.ticket-type h3');
const ticketPrice = document.querySelector('.price');
const paymentInfo = document.querySelector('.payment-info p');
const pixKeySpan = document.getElementById('pix-key'); // New element for PIX key span
const logoMain = document.querySelector('.logo-main');

// Form inputs
const adminEventName = document.getElementById('adminEventName');
const adminVenue = document.getElementById('adminVenue');
const adminDate = document.getElementById('adminDate');
const adminTagline = document.getElementById('adminTagline');
const adminTicketsTitle = document.getElementById('adminTicketsTitle');
const adminLocationTitle = document.getElementById('adminLocationTitle');
const adminTicketLote = document.getElementById('adminTicketLote');
const adminTicketPrice = document.getElementById('adminTicketPrice');
const adminPix = document.getElementById('adminPix');
const adminPrimaryColor = document.getElementById('adminPrimaryColor');
const adminHeroBg = document.getElementById('adminHeroBg');

// PIX copy elements
const copyPixBtn = document.getElementById('copy-pix-btn');
const copyFeedback = document.getElementById('copy-feedback');

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

    // Get PIX text directly from span
    const pixText = pixKeySpan ? pixKeySpan.textContent.trim() : '22997851781';

    const currentPrimaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    const currentHeroBgImage = getComputedStyle(document.documentElement).getPropertyValue('--hero-bg-image').replace(/url\(["']?(.*?)["']?\)/, '$1').trim();

    return {
        eventName: heroTitle.textContent,
        venue: venueText,
        date: dateText,
        tagline: heroTagline.innerHTML,
        ticketsTitle: ticketsTitle.textContent,
        locationTitle: locationTitle.textContent,
        ticketLote: ticketLote.textContent,
        ticketPrice: ticketPrice.textContent.replace('R$ ', ''), // Remove 'R$ ' for editing
        pix: pixText,
        primaryColor: currentPrimaryColor || '#ff6b35', // Fallback to default if not set
        heroBgImgSrc: currentHeroBgImage || '/O AFTER É LOGO ALI - STORIES.png' // Fallback to default if not set
    };
}

function loadSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('eventSettings'));
    const currentDOMSettings = getInitialDOMSettings();

    // Merge saved settings over current DOM settings if they exist
    return savedSettings ? { ...currentDOMSettings, ...savedSettings } : currentDOMSettings;
}

function applySettings(settings) {
    heroTitle.textContent = settings.eventName;
    eventVenue.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${settings.venue}`;
    eventDate.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> ${settings.date}`;
    heroTagline.innerHTML = settings.tagline;
    ticketsTitle.textContent = settings.ticketsTitle;
    locationTitle.textContent = settings.locationTitle;
    ticketLote.textContent = settings.ticketLote;
    ticketPrice.textContent = `R$ ${settings.ticketPrice}`;
    
    if (pixKeySpan) { // Update the span for PIX
        pixKeySpan.textContent = settings.pix;
    } else { // Fallback if span not found (shouldn't happen with updated HTML)
        paymentInfo.innerHTML = `<strong>PIX:</strong> ${settings.pix}`;
    }
    
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--hero-bg-image', `url('${settings.heroBgImgSrc}')`);

    // Update the logo main drop shadow color directly
    if (logoMain) {
        logoMain.style.filter = `drop-shadow(0 0 20px ${settings.primaryColor}4D)`; // 4D is ~30% opacity
    }
}

function populateAdminForm(settings) {
    adminEventName.value = settings.eventName;
    adminVenue.value = settings.venue;
    adminDate.value = settings.date;
    adminTagline.value = settings.tagline.replace(/<br>/g, '\n');
    adminTicketsTitle.value = settings.ticketsTitle;
    adminLocationTitle.value = settings.locationTitle;
    adminTicketLote.value = settings.ticketLote;
    adminTicketPrice.value = settings.ticketPrice;
    adminPix.value = settings.pix;
    adminPrimaryColor.value = settings.primaryColor;
    adminHeroBg.value = settings.heroBgImgSrc;
}

adminAccessBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const password = prompt('Digite a senha de administrador:');
    if (password === adminPassword) {
        adminPanelOverlay.style.display = 'flex';
        populateAdminForm(loadSettings()); // Load and populate
    } else if (password !== null) {
        alert('Senha incorreta!');
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
        ticketsTitle: adminTicketsTitle.value,
        locationTitle: adminLocationTitle.value,
        ticketLote: adminTicketLote.value,
        ticketPrice: adminTicketPrice.value,
        pix: adminPix.value,
        primaryColor: adminPrimaryColor.value,
        heroBgImgSrc: adminHeroBg.value
    };

    localStorage.setItem('eventSettings', JSON.stringify(newSettings));
    applySettings(newSettings);
    adminPanelOverlay.style.display = 'none';
    alert('Configurações salvas com sucesso!');
});

// Implement copy PIX functionality
if (copyPixBtn && pixKeySpan) {
    copyPixBtn.addEventListener('click', async () => {
        const pixKey = pixKeySpan.textContent.trim();
        try {
            await navigator.clipboard.writeText(pixKey);
            copyFeedback.textContent = 'Copiado!';
            copyFeedback.classList.add('show');
            setTimeout(() => {
                copyFeedback.classList.remove('show');
                copyFeedback.textContent = '';
            }, 2000);
        } catch (err) {
            console.error('Falha ao copiar o texto: ', err);
            copyFeedback.textContent = 'Erro ao copiar.';
            copyFeedback.classList.add('show');
            setTimeout(() => {
                copyFeedback.classList.remove('show');
                copyFeedback.textContent = '';
            }, 2000);
        }
    });
}

// Apply settings on initial load
document.addEventListener('DOMContentLoaded', () => {
    // Apply settings loaded from localStorage or current DOM
    applySettings(loadSettings());
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.ticket-card, .location-card, .why-attend-section .why-attend-image, .why-attend-section .why-attend-text');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});