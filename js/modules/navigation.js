/**
 * NAVIGATION MODULE
 *
 * Handles navbar scroll effects and mobile menu
 * - Navbar background on scroll
 * - Mobile menu toggle
 * - Smooth scrolling
 * - Scroll to top button visibility
 *
 * Dependencies: None
 */

/**
 * Toggles the mobile menu
 */
export function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

/**
 * Closes the mobile menu
 */
export function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.remove('active');
    }
}

/**
 * Scrolls to the top of the page smoothly
 */
export function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Initializes navbar scroll effect
 */
function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Show/hide scroll to top button
        const scrollTopBtn = document.querySelector('.scroll-top');
        if (scrollTopBtn) {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        }
    });
}

/**
 * Initializes mobile menu functionality
 */
function initMobileMenu() {
    // Close mobile menu when clicking on a navigation link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
}

/**
 * Initializes smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initializes all navigation functionality
 */
export function init() {
    console.log('Navigation module initialized');
    initNavbarScroll();
    initMobileMenu();
    initSmoothScroll();
}
