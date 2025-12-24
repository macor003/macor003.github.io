# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Mario Ortega (Software Engineer & Solution Architect) hosted on GitHub Pages (macor003.github.io). The site is a modern, fully responsive one-page portfolio with modular architecture.

**Latest Update (December 2024):** The codebase has been completely refactored from a single-file monolith (2,499 lines) to a clean modular structure with separated SCSS and JavaScript modules.

## Architecture

### Modern Modular Structure

The project now uses a clean separation of concerns:
- **HTML:** Clean semantic markup (777 lines, 46KB)
- **CSS:** Modular SCSS compiled to minified CSS (18KB)
- **JavaScript:** ES6 modules loaded natively (no bundler required)

### Directory Structure

```
/
├── index.html              # Clean HTML (no inline CSS/JS)
├── index-backup.html       # Backup of previous version
│
├── /scss/                  # SCSS Source Files (12 modules)
│   ├── creative.scss       # Main entry point (imports all modules)
│   ├── _variables.scss     # Design tokens (colors, spacing, etc.)
│   ├── _mixins.scss        # Reusable SCSS mixins
│   ├── _reset.scss         # CSS reset and base styles
│   ├── _navbar.scss        # Navigation bar styles
│   ├── _hero.scss          # Hero section with floating image
│   ├── _sections.scss      # About, Skills, Experience, Education
│   ├── _contact.scss       # Contact section social cards
│   ├── _contact-form.scss  # Form with validation styles
│   ├── _footer.scss        # Footer styles
│   ├── _buttons.scss       # Fixed buttons (CV, scroll-to-top)
│   ├── _animations.scss    # Keyframe animations
│   └── _responsive.scss    # Media queries for all breakpoints
│
├── /css/                   # Compiled CSS Output
│   ├── creative.css        # Compiled CSS (26KB)
│   └── creative.min.css    # Minified CSS (18KB) - Used in production
│
├── /js/                    # JavaScript Files
│   ├── main.js             # Entry point - imports all modules
│   └── /modules/           # ES6 Modules
│       ├── animations.js   # GSAP animations (~200 lines)
│       ├── language.js     # Bilingual switcher (~80 lines)
│       ├── navigation.js   # Navbar & mobile menu (~100 lines)
│       ├── contact-form.js # Form validation & EmailJS (~250 lines)
│       └── utils.js        # Helper functions (~50 lines)
│
├── /img/                   # Images (header, profile, etc.)
├── /files/                 # Downloadable files (CV PDF)
└── /iconos/                # Icons and favicon
```

## Build System

### SCSS Compilation

The project uses **Dart Sass** (via npx) for SCSS compilation. The old node-sass dependency has been replaced.

**Compile SCSS:**
```bash
# Compile SCSS to CSS
npx sass scss/creative.scss css/creative.css

# Minify CSS
npx clean-css-cli -o css/creative.min.css css/creative.css
```

**Note:** The legacy `npm install` and `gulp` commands may fail due to deprecated node-sass. Use the npx commands above instead.

### JavaScript Modules

The project uses **native ES6 modules** (no bundler required). Modules are loaded via:
```html
<script type="module" src="js/main.js"></script>
```

**Module Organization:**
- `main.js` - Entry point that imports and initializes all modules
- `modules/animations.js` - GSAP-based scroll animations
- `modules/language.js` - Spanish/English language toggle
- `modules/navigation.js` - Navbar scroll effects, mobile menu, smooth scrolling
- `modules/contact-form.js` - Form validation, EmailJS integration, Cloudflare Turnstile
- `modules/utils.js` - Reusable utility functions (sanitization, debounce, throttle)

### Development Workflow

**Local Testing:**
```bash
# Start local HTTP server (required for ES6 modules and Turnstile)
python3 -m http.server 8000

# Open in browser
# http://localhost:8000
```

**Making Changes:**

1. **CSS Changes:**
   ```bash
   # Edit SCSS files in /scss
   npx sass scss/creative.scss css/creative.css
   npx clean-css-cli -o css/creative.min.css css/creative.css
   ```

2. **JavaScript Changes:**
   - Edit module files in `/js/modules/`
   - No build step required (ES6 modules load natively)
   - Refresh browser to see changes

3. **HTML Changes:**
   - Edit `index.html`
   - Refresh browser to see changes

## Key Technologies

### Frontend Framework
- **Pure HTML/CSS/JS** - No framework dependencies
- **ES6 Modules** - Native browser module support
- **SCSS** - CSS preprocessor with modular architecture

### Libraries & Services
- **GSAP 3.12.5** - Animation library with ScrollTrigger plugin
- **Font Awesome 6.4.0** - Icon library
- **EmailJS** - Email service for static sites (contact form)
- **Cloudflare Turnstile** - Privacy-focused CAPTCHA alternative
- **Google Fonts** - Poppins font family

### Features

**Bilingual Support:**
- Spanish/English toggle using data attributes
- All content has `data-es` and `data-en` attributes
- Language state managed by `language.js` module

**Contact Form:**
- Client-side validation with real-time feedback
- Input sanitization (XSS prevention)
- EmailJS integration for email sending
- Cloudflare Turnstile for spam protection
- Bilingual error messages

**Animations:**
- GSAP timeline for hero section entrance
- Scroll-triggered animations for all sections
- Floating profile image animation
- Mobile-responsive with optimized animations

**Responsive Design:**
- Mobile-first approach
- Breakpoints: 480px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide)
- Mobile menu with hamburger toggle
- Optimized layouts for all screen sizes

## SCSS Module Details

### Core Modules
- `_variables.scss` - Colors, spacing, transitions, breakpoints, z-index scale
- `_mixins.scss` - Flexbox helpers, responsive breakpoints, gradient text, card styles

### Component Modules
- `_reset.scss` - CSS reset, body defaults, typography base
- `_navbar.scss` - Transparent navbar with scroll effect, mobile menu
- `_hero.scss` - Hero section with background image, floating profile picture, CTA buttons
- `_sections.scss` - About (grid layout), Skills (card grid), Experience (timeline), Education (card grid)
- `_contact.scss` - Social network cards in contact section
- `_contact-form.scss` - Form fields, validation states, Turnstile widget, submit button
- `_footer.scss` - Simple footer with copyright
- `_buttons.scss` - Fixed position buttons (Download CV, Scroll to Top)
- `_animations.scss` - Keyframe animations (fadeIn, slideUp, float, etc.)
- `_responsive.scss` - Media queries for mobile, tablet, desktop, landscape, print

## JavaScript Module Details

### main.js (Entry Point)
Imports and initializes all modules in correct order:
1. Language (must be first - other modules depend on it)
2. Navigation (navbar, mobile menu, scroll effects)
3. Animations (GSAP initialization)
4. Contact Form (form validation and submission)

Exposes global functions for onclick handlers:
- `window.toggleLanguage()`
- `window.scrollToTop()`
- `window.toggleMobileMenu()`

### modules/animations.js
**Dependencies:** GSAP 3.12.5, ScrollTrigger plugin

**Functions:**
- `initHeroAnimations()` - Hero entrance timeline, floating image
- `initScrollAnimations()` - Scroll-triggered animations for all sections
- `init()` - Main initialization function

### modules/language.js
**State:** `currentLang` - Current language ('es' or 'en')

**Functions:**
- `toggleLanguage()` - Switches between ES/EN, updates all data-* attributes
- `getCurrentLang()` - Returns current language
- `setLanguage(lang)` - Sets specific language
- `init()` - Initialization

### modules/navigation.js
**Functions:**
- `toggleMobileMenu()` - Toggles mobile menu visibility
- `closeMobileMenu()` - Closes mobile menu
- `scrollToTop()` - Smooth scroll to top
- `init()` - Initializes navbar scroll effect, mobile menu, smooth scrolling

### modules/contact-form.js
**Dependencies:** EmailJS, Cloudflare Turnstile, language.js, utils.js

**Configuration:**
```javascript
const EMAILJS_CONFIG = {
    publicKey: 'YOUR_EMAILJS_PUBLIC_KEY',
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID'
};
const TURNSTILE_SITE_KEY = 'YOUR_TURNSTILE_SITE_KEY';
```

**Functions:**
- `validateField(fieldName, value)` - Validates single field with bilingual errors
- `sanitizeInput(input)` - XSS prevention (imported from utils.js)
- `initEmailJS()` - Initializes EmailJS SDK
- `initTurnstile()` - Initializes Cloudflare Turnstile widget
- `initFormValidation()` - Real-time validation on blur/focus
- `initFormSubmission()` - Form submit handler with EmailJS
- `init()` - Main initialization

### modules/utils.js
**Utility Functions:**
- `sanitizeInput(input)` - Prevents XSS by escaping HTML
- `debounce(func, wait)` - Limits function execution rate
- `throttle(func, limit)` - Limits function execution frequency

## Configuration Files

### EmailJS & Turnstile
Update these values in `js/modules/contact-form.js`:
- **EmailJS:** Get keys from https://emailjs.com
- **Turnstile:** Get site key from https://dash.cloudflare.com/

## GitHub Pages Deployment

This repository is configured for GitHub Pages deployment:
- **URL:** https://macor003.github.io
- **Branch:** master
- **Build:** Not required (static files)

**Deployment Process:**
1. Make changes locally
2. Compile SCSS if needed
3. Test locally with HTTP server
4. Commit and push to master branch
5. GitHub Pages automatically deploys

**Important:** Always commit compiled CSS files (`css/creative.css` and `css/creative.min.css`) along with SCSS changes.

## Testing Checklist

Before deploying:
- [ ] Test on local HTTP server (not file://)
- [ ] Verify navbar scroll effect works
- [ ] Test mobile menu toggle
- [ ] Test language toggle (ES/EN)
- [ ] Verify GSAP animations trigger on scroll
- [ ] Test contact form validation
- [ ] Verify Turnstile widget loads
- [ ] Test on mobile (responsive layout)
- [ ] Check all sections render correctly
- [ ] Verify fixed buttons (CV download, scroll-to-top)

## Performance

**File Sizes (After Refactoring):**
- HTML: 46KB (was 94KB) - 51% reduction
- CSS (minified): 18KB (compiled from 12 SCSS modules)
- Total page size: ~64KB (excluding external libraries)

**Benefits:**
- Browser caching enabled (external CSS/JS)
- Modular code is easier to maintain
- ES6 modules load on-demand
- Minified CSS reduces bandwidth

## Troubleshooting

**SCSS compilation fails:**
- Use `npx sass` instead of `gulp sass`
- Deprecated warnings about `@import` are safe to ignore

**JavaScript modules not loading:**
- Must use HTTP server (not file://)
- Check browser console for CORS errors

**Turnstile error "cannot run in file:// url":**
- Start local HTTP server: `python3 -m http.server 8000`

**Animations not working:**
- Verify GSAP scripts load before `main.js`
- Check browser console for errors
- Ensure ScrollTrigger plugin is loaded

## Version History

**v2.0.0 (December 2024)** - Modular Refactoring
- Separated inline CSS into 12 SCSS modules
- Separated inline JS into 6 ES6 modules
- Reduced HTML from 2,499 to 777 lines
- Added comprehensive documentation
- Improved code maintainability

**v1.0.0** - Initial single-file implementation
- Contact form with EmailJS
- Cloudflare Turnstile integration
- GSAP animations
- Bilingual support
