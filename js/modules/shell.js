/**
 * IDE SHELL MODULE
 *
 * Theme toggle (dark/light), explorer drawer on mobile, dismissible rail
 * note, and scroll spy that keeps the explorer, tabs and status bar in
 * sync with the visible section.
 *
 * Dependencies: None
 */

const THEME_KEY = 'preferred-theme';
const NOTE_KEY = 'rail-note-dismissed';

// File names shown in the status bar for each section
const SECTION_FILES = {
    home: 'README.md',
    about: 'about.md',
    skills: 'skills.yaml',
    experience: 'experience.log',
    education: 'education.json',
    contact: 'contact.sh'
};

function store(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        // localStorage unavailable — ignore
    }
}

function read(key) {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        return null;
    }
}

/**
 * Switches between dark and light themes and remembers the choice.
 */
export function toggleTheme() {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    store(THEME_KEY, next);
}

/**
 * Opens/closes the explorer drawer (tablet & mobile).
 */
export function toggleRail(force) {
    document.body.classList.toggle('rail-open', force);
}

/**
 * Hides the explorer hint and remembers it.
 */
export function dismissRailNote() {
    const note = document.getElementById('railNote');
    if (note) note.classList.add('hidden');
    store(NOTE_KEY, '1');
}

/**
 * Marks the explorer row, tab and status bar entry for the active section.
 */
function setActive(id) {
    document.querySelectorAll('[data-section]').forEach(el => {
        el.classList.toggle('active', el.dataset.section === id);
    });

    const statusFile = document.getElementById('statusFile');
    if (statusFile && SECTION_FILES[id]) {
        statusFile.textContent = SECTION_FILES[id];
    }

    // Keep the active tab visible when the strip overflows
    const tab = document.querySelector(`.tab[data-section="${id}"]`);
    if (tab && tab.parentElement.scrollWidth > tab.parentElement.clientWidth) {
        tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
}

function initScrollSpy() {
    const sections = document.querySelectorAll('.file-section[id]');
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setActive(entry.target.id);
        });
    }, {
        // A section is "active" when it crosses a thin band near the top
        rootMargin: '-30% 0px -65% 0px'
    });

    sections.forEach(section => observer.observe(section));
    setActive('home');
}

function initDrawer() {
    // Close the drawer after picking a file
    document.querySelectorAll('.rail-left a').forEach(link => {
        link.addEventListener('click', () => toggleRail(false));
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') toggleRail(false);
    });
}

export function init() {
    console.log('Shell module initialized');

    if (read(NOTE_KEY) === '1') {
        const note = document.getElementById('railNote');
        if (note) note.classList.add('hidden');
    }

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    initDrawer();
    initScrollSpy();
}
