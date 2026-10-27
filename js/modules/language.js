/**
 * LANGUAGE SWITCHER MODULE
 *
 * Bilingual support (Spanish/English)
 * Detects the visitor's browser language on first visit, remembers an
 * explicit manual choice in localStorage, and switches all elements with
 * data-es / data-en attributes.
 *
 * Dependencies: None
 */

const STORAGE_KEY = 'preferred-lang';

// Current language state
let currentLang = 'es';

/**
 * Reads the browser's language and maps it to 'es' or 'en'.
 * Defaults to 'es' for anything that isn't clearly English, since
 * that's the site's base content language.
 */
function detectBrowserLanguage() {
    const raw = (navigator.language || (navigator.languages && navigator.languages[0]) || 'es').toLowerCase();
    return raw.startsWith('en') ? 'en' : 'es';
}

/**
 * Applies a language to the DOM without persisting anything.
 */
function applyLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    const langText = document.getElementById('lang-text');
    if (langText) {
        langText.textContent = lang === 'es' ? 'EN' : 'ES';
    }

    document.querySelectorAll('[data-es][data-en]').forEach(element => {
        const text = element.getAttribute('data-' + lang);
        if (element.tagName === 'UL') {
            element.innerHTML = text;
        } else {
            element.textContent = text;
        }
    });

    document.querySelectorAll('[data-es-placeholder][data-en-placeholder]').forEach(element => {
        const placeholder = element.getAttribute(`data-${lang}-placeholder`);
        if (placeholder) {
            element.placeholder = placeholder;
        }
    });
}

function persistLanguage(lang) {
    try {
        localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
        // localStorage unavailable (private browsing, etc.) — ignore
    }
}

/**
 * Toggles between Spanish and English and remembers the choice.
 */
export function toggleLanguage() {
    const next = currentLang === 'es' ? 'en' : 'es';
    applyLanguage(next);
    persistLanguage(next);
}

/**
 * Gets the current language
 * @returns {string} - Current language code ('es' or 'en')
 */
export function getCurrentLang() {
    return currentLang;
}

/**
 * Sets the current language explicitly and remembers the choice.
 * @param {string} lang - Language code ('es' or 'en')
 */
export function setLanguage(lang) {
    if ((lang === 'es' || lang === 'en') && lang !== currentLang) {
        applyLanguage(lang);
        persistLanguage(lang);
    }
}

/**
 * Initializes the language module: an explicit earlier choice (localStorage)
 * wins; otherwise the browser's language is auto-detected.
 */
export function init() {
    console.log('Language module initialized');

    let stored = null;
    try {
        stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
        // localStorage unavailable — fall through to detection
    }

    const initialLang = (stored === 'es' || stored === 'en') ? stored : detectBrowserLanguage();

    // The markup already renders in Spanish by default, so only touch
    // the DOM when the resolved language actually differs from it.
    if (initialLang !== currentLang) {
        applyLanguage(initialLang);
    } else {
        document.documentElement.lang = currentLang;
    }
}
