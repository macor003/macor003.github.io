# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Mario Ortega (Software Engineer) hosted on GitHub Pages (macor003.github.io). The site is built using the Start Bootstrap "Creative" theme - a one-page responsive HTML template.

## Build System

This project uses Gulp for build automation. The workflow processes SCSS, minifies CSS/JS, and manages vendor dependencies.

### Common Commands

```bash
# Install dependencies (run first)
npm install

# Build all assets (SCSS -> CSS, minify CSS/JS, copy vendor files)
gulp

# Development mode with live reload
gulp dev

# Individual build tasks
gulp sass          # Compile SCSS to CSS
gulp minify-css    # Minify CSS files
gulp minify-js     # Minify JavaScript files
gulp copy          # Copy vendor files from node_modules to vendor/
```

### Development Workflow

- Run `gulp dev` to start BrowserSync server with live reload (serves from project root)
- SCSS files in `/scss` are compiled to `/css/creative.css`
- Custom JS in `/js/creative.js` is minified to `/js/creative.min.js`
- BrowserSync watches for changes and auto-reloads the browser
- Note: `minify-css` task depends on `sass` completing first (runs sequentially)

## Architecture

### Directory Structure

- **`/scss`** - SCSS source files organized by component (navbar, masthead, portfolio, services, etc.)
  - `creative.scss` - Main SCSS entry point that imports all partials
  - `_variables.scss` - Global SCSS variables
  - `_mixins.scss` - SCSS mixins
  - Component partials: `_navbar.scss`, `_masthead.scss`, `_portfolio.scss`, etc.

- **`/css`** - Compiled and minified CSS output

- **`/js`** - Custom JavaScript
  - `creative.js` - Main JS file with smooth scrolling, navbar behavior, ScrollReveal animations, and Magnific Popup gallery

- **`/vendor`** - Third-party libraries copied from node_modules via Gulp
  - Bootstrap 4 (beta)
  - jQuery
  - Font Awesome
  - Magnific Popup (lightbox)
  - ScrollReveal (scroll animations)
  - jQuery Easing
  - Popper.js

- **`/img`** - Images including header backgrounds, portfolio thumbnails, and avatar

### HTML Files

- **`index.html`** - Simple resume/CV page using W3.CSS framework (lightweight personal portfolio)
- **`index copy.html`** - Alternative version (likely using the Creative theme)

### Key Technologies

- **Bootstrap 4 (beta)** - CSS framework
- **SCSS** - CSS preprocessor with modular component files
- **jQuery** - DOM manipulation and animations
- **ScrollReveal** - Scroll-triggered animations
- **Magnific Popup** - Responsive lightbox for image galleries
- **Gulp** - Build automation and asset pipeline

### JavaScript Functionality (`js/creative.js`)

- Smooth scroll navigation using jQuery Easing
- Navbar collapse on mobile when links clicked
- Scrollspy for active navbar states
- Navbar shrink effect on scroll
- ScrollReveal animations for icons, buttons, and contact section
- Magnific Popup for portfolio image gallery

## Styling Architecture

SCSS is organized into modular partials imported by `creative.scss`:
- `_bootstrap-overrides.scss` - Bootstrap customizations
- `_global.scss` - Base styles
- `_navbar.scss` - Navigation bar styles
- `_masthead.scss` - Hero/header section
- `_services.scss` - Services section
- `_portfolio.scss` - Portfolio gallery
- `_cta.scss` - Call-to-action sections

## GitHub Pages Deployment

This repository is configured for GitHub Pages deployment. Changes pushed to the `master` branch are automatically published to https://macor003.github.io.

The site is static HTML/CSS/JS, so no server-side build process is needed for deployment - just push the compiled assets.
