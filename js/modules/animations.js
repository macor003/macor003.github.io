/**
 * GSAP ANIMATIONS MODULE
 *
 * Handles all GSAP-based animations using ScrollTrigger
 * - Hero section entrance timeline
 * - Scroll-triggered animations for all sections
 * - Floating image animation
 *
 * Dependencies: GSAP 3.12.5, ScrollTrigger
 */

/**
 * Initializes hero section animations
 */
export function initHeroAnimations() {
    if (typeof gsap === 'undefined') {
        console.error('GSAP not loaded');
        return;
    }

    // Hero entrance timeline
    const heroTimeline = gsap.timeline({ defaults: { ease: "power2.out" } });

    heroTimeline
        .from(".hero-image", {
            scale: 0.8,
            opacity: 0,
            duration: 0.8
        })
        .from(".hero h1", {
            y: 30,
            opacity: 0,
            duration: 0.6
        }, "-=0.4")
        .from(".hero .subtitle", {
            y: 20,
            opacity: 0,
            duration: 0.5
        }, "-=0.3")
        .from(".hero .description", {
            y: 20,
            opacity: 0,
            duration: 0.5
        }, "-=0.2")
        .fromTo(".cta-buttons .btn", {
            y: 20,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.15,
            clearProps: "all"
        }, "-=0.2");

    // Floating animation for hero image
    gsap.to(".hero-image", {
        y: -20,
        duration: 3,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true
    });
}

/**
 * Initializes scroll-triggered animations for all sections
 */
export function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP or ScrollTrigger not loaded');
        return;
    }

    // Section Titles
    gsap.utils.toArray(".section-title").forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out"
        });
    });

    // About Section
    gsap.from(".about-image img", {
        scrollTrigger: {
            trigger: ".about-content",
            start: "top 70%",
            toggleActions: "play none none reverse"
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.2)"
    });

    gsap.from(".about-text", {
        scrollTrigger: {
            trigger: ".about-content",
            start: "top 70%",
            toggleActions: "play none none reverse"
        },
        x: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out"
    });

    // Skills Section
    gsap.utils.toArray(".skill-category").forEach(category => {
        const items = category.querySelectorAll(".skill-item");

        gsap.from(items, {
            scrollTrigger: {
                trigger: category,
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            x: -20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out"
        });
    });

    // Timeline Items
    gsap.utils.toArray(".timeline-item").forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Education Cards
    const educationCards = gsap.utils.toArray(".education-card");
    educationCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
                once: true
            },
            y: 40,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.15,
            ease: "power2.out"
        });
    });

    // Contact Section - Social Links Wrapper
    gsap.from(".contact-social-wrapper", {
        scrollTrigger: {
            trigger: ".contact-social-wrapper",
            start: "top 85%",
            toggleActions: "play none none none",
            once: true
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });

    // Contact Section - Social Link Cards
    const socialLinkCards = gsap.utils.toArray(".social-link-card");
    socialLinkCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none none",
                once: true
            },
            x: -30,
            opacity: 0,
            duration: 0.5,
            delay: index * 0.1,
            ease: "power2.out"
        });
    });

    // Contact Section - Contact Form
    gsap.from(".contact-form-wrapper", {
        scrollTrigger: {
            trigger: ".contact-form-wrapper",
            start: "top 85%",
            toggleActions: "play none none none",
            once: true
        },
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });

    // Animate form fields individually
    const formGroups = gsap.utils.toArray(".form-group");
    formGroups.forEach((group, index) => {
        gsap.from(group, {
            scrollTrigger: {
                trigger: group,
                start: "top 90%",
                toggleActions: "play none none none",
                once: true
            },
            y: 20,
            opacity: 0,
            duration: 0.5,
            delay: index * 0.1,
            ease: "power2.out"
        });
    });

    // Animate submit button
    gsap.from(".btn-submit", {
        scrollTrigger: {
            trigger: ".btn-submit",
            start: "top 90%",
            toggleActions: "play none none none",
            once: true
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.5)"
    });
}

/**
 * Initializes all animations
 */
export function init() {
    if (typeof gsap === 'undefined') {
        console.error('GSAP not loaded. Animations will not work.');
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    console.log('Animations module initialized');
    initHeroAnimations();
    initScrollAnimations();
}
