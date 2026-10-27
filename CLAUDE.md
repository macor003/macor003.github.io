# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Mario Ortega (Software Engineer & Solution Architect) hosted on GitHub Pages (macor003.github.io). It is a one-page, fully responsive, bilingual (ES/EN) portfolio styled as an IDE (design reference: thinkrail.ai).

**Latest Update (October 2026):** v3 redesign. The site now looks like an IDE window (titlebar, explorer rail, file tabs, status bar) where every section is a "file". GSAP was removed, and the CV PDF is generated client-side from the page content (there is no static CV file anymore).

## Architecture

- **HTML:** `index.html` — semantic markup, all copy bilingual via `data-es` / `data-en`
- **CSS:** Modular SCSS compiled to `css/style.min.css`
- **JavaScript:** Native ES6 modules (no bundler)

### Directory Structure

```
/
├── index.html              # The site (IDE-style one-pager)
├── index-backup.html       # Pre-refactor single-file version (historical, not linked)
├── favicon.svg             # ">_" prompt icon (+ img/favicon-32.png, img/apple-touch-icon.png)
│
├── /scss/                  # SCSS sources
│   ├── style.scss          # Entry point (imports all partials)
│   ├── _tokens.scss        # Layout constants + theme colors as CSS custom properties (dark/light)
│   ├── _base.scss          # Reset, typography, buttons, pills, chips, reveal-on-scroll, keyframes
│   ├── _shell.scss         # IDE chrome: titlebar, explorer rail, tabstrip, status bar
│   ├── _sections.scss      # Hero, terminal, beats, about, feature cards, git-log experience, footer
│   ├── _contact.scss       # Chat-style contact form + social cards
│   └── _responsive.scss    # Breakpoints + print stylesheet
│
├── /css/
│   ├── style.css           # Compiled CSS
│   └── style.min.css       # Minified CSS — used by index.html
│
├── /js/
│   ├── main.js             # Entry point — imports and initializes all modules
│   └── /modules/
│       ├── language.js     # ES/EN switcher (browser detection + localStorage)
│       ├── shell.js        # Theme toggle, explorer drawer, rail note, scroll spy
│       ├── effects.js      # Terminal replay + reveal on scroll (IntersectionObserver)
│       ├── contact-form.js # Validation, EmailJS, Cloudflare Turnstile
│       ├── cv.js           # Client-side CV PDF generator (pdfmake)
│       └── utils.js        # sanitizeInput, debounce, throttle
│
├── /img/                   # Profile photos (MarioOrtega.jpg, MarioOrtega2.jpeg), icons
└── /iconos/                # Legacy favicon.ico
```

`gulpfile.js`, `package.json` and `/vendor` are leftovers from the original Start Bootstrap template and are not used by the site.

## Build System

The project uses **Dart Sass** (via npx):

```bash
npx sass --no-source-map scss/style.scss css/style.css
npx clean-css-cli -o css/style.min.css css/style.css
```

Deprecation warnings about `@import` are expected and safe to ignore. Always commit `css/style.css` and `css/style.min.css` together with SCSS changes.

JavaScript needs no build step.

### Local Testing

```bash
# Serve from the repository root (required for ES modules and Turnstile)
python3 -m http.server 8000
# http://localhost:8000
```

`python3 -m http.server` sends no cache headers, so Chrome often keeps stale ES modules. While developing, open DevTools → Network → **Disable cache**; otherwise JS changes may appear not to work.

## Key Technologies

- **Pure HTML/CSS/JS** with native ES6 modules
- **Google Fonts:** Orbitron (display), Geist (text), JetBrains Mono (code)
- **Font Awesome 6.4.0** — icons
- **EmailJS** — contact form delivery
- **Cloudflare Turnstile** — spam protection widget
- **pdfmake 0.2.12** — CV PDF generation, loaded lazily from cdnjs on first CV click

## Features

**Theming:** dark (default) and light themes. Colors are CSS custom properties in `_tokens.scss` (`:root` / `:root[data-theme="light"]`). An inline script in `<head>` applies the saved theme (`localStorage` key `preferred-theme`) before first paint.

**Bilingual support:** every text node has `data-es` and `data-en`. `language.js` swaps `textContent`, except for `<ul>` elements, whose attributes hold escaped `<li>` HTML that is set via `innerHTML` (used by the experience lists). Placeholders use `data-es-placeholder` / `data-en-placeholder`.

**Reveal on scroll:** elements with `data-reveal` are visible by default; `effects.js` adds `.reveal-ready` to `<html>` only once JS runs, so content never stays hidden if modules fail to load.

**CV PDF (`cv.js`):** any element with `data-cv-generate` builds the résumé from the text currently on the page, in the active language (profile, AI focus beats, experience, skills, education, languages). The contact email is added only to the PDF (`CONTACT_EMAIL`). Headings use `keepWithNext()` so they never end up orphaned at a page bottom (pdfmake only passes `headlineLevel` through to `pageBreakBefore`, so the heading's node count is stored there). If pdfmake cannot load, it falls back to `window.print()`.

**Contact form:** client-side validation with bilingual errors, `sanitizeInput` before sending, EmailJS template params `name`, `email`, `title`, `time`, `message`. The recipient is fixed in the EmailJS template (not sent from the browser). Note: EmailJS does not verify the Turnstile token, so restrict allowed domains and rate limits in the EmailJS dashboard.

**Responsive:** breakpoints at 480px, 768px and 1024px. Below 1024px the explorer rail becomes a slide-in drawer (`body.rail-open`).

## Content Rules

- **Never name clients** (companies, brands, internal programs or frameworks) in experience text or any public content, including `README.md`. Describe them generically ("an insurance-sector client in Mexico", "a retail chain"). Employer names in job headers are fine.
- Experience entries are rendered as git commits (`.gitlog > .commit`); the current role has the `HEAD → main` pill.

## Configuration

EmailJS and Turnstile keys live in `js/modules/contact-form.js` (`EMAILJS_CONFIG`, `TURNSTILE_SITE_KEY`). Both are public by design.

## GitHub Pages Deployment

- **URL:** https://macor003.github.io
- **Branch:** master (static files, no build on GitHub)

Work on a feature branch, open a PR to `master`; GitHub Pages deploys on merge.

## Testing Checklist

- [ ] Serve over HTTP (not file://) with cache disabled
- [ ] Explorer rail, tabs and status bar follow the visible section
- [ ] Mobile drawer opens/closes (hamburger, backdrop, Esc)
- [ ] Language toggle (ES/EN) and theme toggle (dark/light)
- [ ] Terminal replay and reveal-on-scroll animations
- [ ] Contact form validation, Turnstile widget, email arrives with name/subject/time
- [ ] CV button generates the PDF in the active language
- [ ] No horizontal scroll at 390px width

## Version History

**v3.0.0 (October 2026)** — IDE-style redesign
- New design inspired by thinkrail.ai, dark/light themes, AI-focused content
- Client-side CV PDF generation; static CV PDF removed
- GSAP and v2 styles/modules removed (still available in git history)

**v2.0.0 (December 2024)** — Modular refactoring (SCSS modules + ES6 modules)

**v1.0.0** — Initial single-file implementation
