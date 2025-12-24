/**
 * LANGUAGE SWITCHER MODULE
 *
 * Bilingual support (Spanish/English)
 * Switches all elements with data-es and data-en attributes
 * Updates form placeholders dynamically
 *
 * Dependencies: None
 */

// Current language state
let currentLang = 'es';

/**
 * Toggles between Spanish and English
 */
export function toggleLanguage() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    const langText = document.getElementById('lang-text');
    if (langText) {
        langText.textContent = currentLang === 'es' ? 'EN' : 'ES';
    }

    // Update all elements with data-es and data-en attributes
    document.querySelectorAll('[data-es][data-en]').forEach(element => {
        const text = element.getAttribute('data-' + currentLang);
        if (element.tagName === 'UL') {
            element.innerHTML = text;
        } else {
            element.textContent = text;
        }
    });

    // Update form placeholders
    document.querySelectorAll('[data-es-placeholder][data-en-placeholder]').forEach(element => {
        const placeholder = element.getAttribute(`data-${currentLang}-placeholder`);
        if (placeholder) {
            element.placeholder = placeholder;
        }
    });
}

/**
 * Gets the current language
 * @returns {string} - Current language code ('es' or 'en')
 */
export function getCurrentLang() {
    return currentLang;
}

/**
 * Sets the current language
 * @param {string} lang - Language code ('es' or 'en')
 */
export function setLanguage(lang) {
    if (lang === 'es' || lang === 'en') {
        currentLang = lang;
        toggleLanguage(); // Apply language change
    }
}

/**
 * Initializes the language module
 */
export function init() {
    console.log('Language module initialized');
    // Set initial language
    currentLang = 'es';
}
