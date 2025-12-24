/**
 * MAIN APPLICATION ENTRY POINT
 *
 * Initializes all modules when DOM is ready
 * Handles module loading order and dependencies
 *
 * Portfolio Website for Mario Ortega
 * https://macor003.github.io
 */

import * as Animations from './modules/animations.js';
import * as Language from './modules/language.js';
import * as Navigation from './modules/navigation.js';
import * as ContactForm from './modules/contact-form.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio initialized');
    console.log('Version: 2.0.0');
    console.log('Build: ' + new Date().toISOString());

    // Initialize modules in order
    // 1. Language must be first (other modules may depend on it)
    Language.init();

    // 2. Navigation (navbar, mobile menu, scroll effects)
    Navigation.init();

    // 3. Animations (GSAP requires DOM to be ready)
    Animations.init();

    // 4. Contact Form (depends on language module)
    ContactForm.init();

    console.log('All modules loaded successfully');
});

// Make functions globally available for onclick handlers in HTML
window.toggleLanguage = Language.toggleLanguage;
window.scrollToTop = Navigation.scrollToTop;
window.toggleMobileMenu = Navigation.toggleMobileMenu;

// Export functions for external use if needed
export {
    Animations,
    Language,
    Navigation,
    ContactForm
};
