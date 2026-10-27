/**
 * MAIN APPLICATION ENTRY POINT
 *
 * IDE-style portfolio: language, IDE shell, effects, contact form and the
 * client-side CV generator.
 *
 * Portfolio Website for Mario Ortega
 * https://macor003.github.io
 */

import * as Language from './modules/language.js';
import * as ContactForm from './modules/contact-form.js';
import * as Shell from './modules/shell.js';
import * as Effects from './modules/effects.js';
import * as CV from './modules/cv.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio initialized');

    // 1. Language must be first (other modules may depend on it)
    Language.init();

    // 2. Shell (theme, explorer, tabs, scroll spy)
    Shell.init();

    // 3. Effects (terminal replay, reveal on scroll)
    Effects.init();

    // 4. Contact Form (depends on language module)
    ContactForm.init();

    // 5. CV generator (builds the PDF from the page content)
    CV.init();
});

// Make functions globally available for onclick handlers in HTML
window.toggleLanguage = Language.toggleLanguage;
window.toggleTheme = Shell.toggleTheme;
window.toggleRail = () => Shell.toggleRail();
window.dismissRailNote = Shell.dismissRailNote;
