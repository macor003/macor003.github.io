/**
 * EFFECTS MODULE
 *
 * Terminal replay in the hero and reveal-on-scroll for [data-reveal].
 * Lightweight replacement for GSAP; respects prefers-reduced-motion.
 *
 * Dependencies: None
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Reveals terminal lines one by one. Commands "type" (CSS clip-path
 * animation), outputs appear after a short pause. Works on whole lines,
 * so switching language mid-replay is safe.
 */
function initTerminal() {
    const terminal = document.querySelector('[data-terminal]');
    if (!terminal || reducedMotion) return;

    const lines = Array.from(terminal.querySelectorAll('.t-line'));
    terminal.classList.add('is-playing');

    let delay = 400;
    lines.forEach(line => {
        setTimeout(() => line.classList.add('shown'), delay);
        delay += line.classList.contains('t-cmd') ? 750 : 350;
    });
}

function initReveal() {
    const items = document.querySelectorAll('[data-reveal]');

    if (reducedMotion || !('IntersectionObserver' in window)) {
        return;
    }

    // Opt in to the hidden-until-visible state only now that JS is running
    document.documentElement.classList.add('reveal-ready');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -8% 0px' });

    items.forEach(item => observer.observe(item));
}

export function init() {
    console.log('Effects module initialized');
    initTerminal();
    initReveal();
}
