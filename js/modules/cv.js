/**
 * CV GENERATOR MODULE
 *
 * Builds the résumé PDF from the text currently rendered on the page, in
 * the active language, so the PDF always matches the website. Uses pdfmake
 * (real, selectable text — ATS friendly), loaded lazily on first click.
 *
 * Any link with [data-cv-generate] triggers it. If generation fails (e.g.
 * the CDN is unreachable) it falls back to the browser's print dialog, where
 * the print stylesheet hides the IDE chrome and the page can be saved as PDF.
 *
 * Dependencies: language.js
 */

import { getCurrentLang } from './language.js';

const PDFMAKE_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.12/pdfmake.min.js';
const VFS_FONTS_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.12/vfs_fonts.min.js';

// Shown only in the PDF (not published on the page)
const CONTACT_EMAIL = 'mcor63@gmail.com';

const COLORS = {
    text: '#15171a',
    muted: '#5a5f6a',
    accent: '#2e7d16',
    rule: '#dcdfe4'
};

// Headings that have no exact equivalent on the page
const LABELS = {
    es: { profile: 'Perfil profesional', aiFocus: 'Enfoque en IA', languages: 'Idiomas', file: 'Mario Ortega CV.pdf' },
    en: { profile: 'Professional profile', aiFocus: 'AI focus', languages: 'Languages', file: 'Mario Ortega Resume.pdf' }
};

let pdfMakeLoading = null;

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
    });
}

function loadPdfMake() {
    if (window.pdfMake && window.pdfMake.vfs) return Promise.resolve(window.pdfMake);
    if (!pdfMakeLoading) {
        pdfMakeLoading = loadScript(PDFMAKE_SRC)
            .then(() => loadScript(VFS_FONTS_SRC))
            .then(() => window.pdfMake)
            .catch(error => {
                pdfMakeLoading = null;
                throw error;
            });
    }
    return pdfMakeLoading;
}

// ---------- DOM extraction helpers ----------

function clean(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
}

function textOf(selector, root = document) {
    const el = root.querySelector(selector);
    return el ? clean(el.textContent) : '';
}

function textsOf(selector, root = document) {
    return Array.from(root.querySelectorAll(selector)).map(el => clean(el.textContent)).filter(Boolean);
}

/**
 * Text of a list item without the text of its nested list.
 */
function ownText(li) {
    const copy = li.cloneNode(true);
    copy.querySelectorAll(':scope > ul, :scope > ol').forEach(child => child.remove());
    return clean(copy.textContent);
}

/**
 * Converts a <ul> (possibly grouped / nested) into pdfmake content.
 */
function listToContent(ul) {
    const items = Array.from(ul.children).filter(el => el.tagName === 'LI');

    // Grouped list: <li class="commit-group"><span>Title</span><ul>…</ul></li>
    if (items.some(li => li.classList.contains('commit-group'))) {
        return items.map(group => ({
            stack: [
                { text: textOf(':scope > span', group), style: 'groupTitle' },
                listToContent(group.querySelector(':scope > ul'))
            ],
            margin: [0, 2, 0, 4]
        }));
    }

    return {
        ul: items.map(li => {
            const nested = li.querySelector(':scope > ul');
            if (!nested) return clean(li.textContent);
            return {
                stack: [ownText(li), {
                    ul: Array.from(nested.children).map(sub => clean(sub.textContent)),
                    type: 'circle',
                    margin: [0, 2, 0, 0]
                }]
            };
        }),
        style: 'bullets'
    };
}

// Headings are tagged so pageBreakBefore can keep them with what follows
function sectionHeading(text) {
    return [keepWithNext({
        stack: [
            { text: text.toUpperCase(), style: 'sectionHeading' },
            {
                canvas: [{ type: 'line', x1: 0, y1: 0, x2: 516, y2: 0, lineWidth: 0.75, lineColor: COLORS.rule }],
                margin: [0, 2, 0, 8]
            }
        ]
    })];
}

function countDescendants(node) {
    const children = [].concat(node.stack || [], node.columns || [], node.ul || []);
    return children.reduce((total, child) =>
        total + (child && typeof child === 'object' ? 1 + countDescendants(child) : 0), 0);
}

/**
 * Marks a heading block so it is never left alone at the bottom of a page.
 * pdfmake hands pageBreakBefore stripped copies of the nodes (only
 * headlineLevel survives), so the block's own node count is stored there.
 */
function keepWithNext(block) {
    block.headlineLevel = countDescendants(block);
    return block;
}

function titleWithDate(title, date) {
    return {
        columns: [
            { text: title, style: 'itemTitle', width: '*' },
            { text: date || '', style: 'itemDate', width: 'auto' }
        ],
        columnGap: 10
    };
}

// ---------- Document definition ----------

export function buildDocDefinition(lang) {
    const labels = LABELS[lang] || LABELS.es;
    const name = document.querySelector('meta[name="author"]')?.content || textOf('.hero-title');
    const about = document.getElementById('about');
    const kvValues = textsOf('.kv dd', about);
    const kvKeys = textsOf('.kv dt', about);

    // Contact line: location + email + external profiles shown on the page
    const email = { text: CONTACT_EMAIL, link: `mailto:${CONTACT_EMAIL}`, color: COLORS.accent };
    const links = Array.from(document.querySelectorAll('#contact .social-card[href^="http"]')).map(a => ({
        text: a.href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
        link: a.href,
        color: COLORS.accent
    }));
    const contactLine = [kvValues[0], email].concat(links).filter(Boolean)
        .flatMap((part, i) => (i ? ['  ·  ', part] : [part]));

    const content = [
        { text: name, style: 'name' },
        { text: textOf('.about-text h3', about), style: 'role' },
        { text: textOf('.hero-tagline'), style: 'headline' },
        { text: contactLine, style: 'contact' }
    ];

    // Profile
    content.push(...sectionHeading(labels.profile));
    textsOf('.about-text > p', about).forEach(p => content.push({ text: p, style: 'paragraph' }));

    // AI focus (hero beats)
    const beats = Array.from(document.querySelectorAll('.beats .beat'));
    if (beats.length) {
        content.push(...sectionHeading(labels.aiFocus));
        content.push({
            ul: beats.map(beat => ({
                text: [
                    { text: textOf('h3', beat) + ' ', bold: true },
                    textOf('p', beat)
                ]
            })),
            style: 'bullets'
        });
    }

    // Experience
    const experience = document.getElementById('experience');
    content.push(...sectionHeading(textOf('.section-title', experience)));
    experience.querySelectorAll('.commit').forEach(commit => {
        // Header and body stay top-level nodes so pageBreakBefore sees the header
        content.push(keepWithNext({
            stack: [
                titleWithDate(textOf('h3', commit), textOf('.commit-date', commit)),
                { text: textOf('.commit-company', commit), style: 'company' }
            ]
        }));
        content.push({ stack: [listToContent(commit.querySelector('.commit-body'))], margin: [0, 0, 0, 10] });
    });

    // Skills
    const skills = document.getElementById('skills');
    content.push(...sectionHeading(textOf('.section-title', skills)));
    skills.querySelectorAll('.feature-card').forEach(card => {
        content.push({
            text: [
                { text: textOf('h3', card) + ': ', bold: true },
                textsOf('.chip', card).join(', ')
            ],
            style: 'paragraph',
            margin: [0, 0, 0, 4]
        });
    });

    // Education
    const education = document.getElementById('education');
    content.push(...sectionHeading(textOf('.section-title', education)));
    education.querySelectorAll('.feature-card').forEach(card => {
        content.push(keepWithNext({
            stack: [
                titleWithDate(textOf('h3', card), textOf('.feature-year', card)),
                { text: textOf('.feature-sub', card), style: 'company' }
            ]
        }));
        content.push({ text: textOf('p:not(.feature-sub)', card), style: 'paragraph', margin: [0, 0, 0, 8] });
    });

    // Languages (from the about key/value table)
    const langIndex = kvKeys.findIndex(key => /idiomas|languages/i.test(key));
    if (langIndex !== -1) {
        content.push(...sectionHeading(labels.languages));
        // The page shows them lowercase (code style); capitalize for print
        const languages = kvValues[langIndex].replace(/(^|·\s*)(\p{L})/gu, (m, sep, letter) => sep + letter.toUpperCase());
        content.push({ text: languages, style: 'paragraph' });
    }

    return {
        pageSize: 'LETTER',
        pageMargins: [48, 44, 48, 48],
        info: {
            title: `${name} — CV`,
            author: name,
            subject: textOf('.about-text h3', about)
        },
        content,
        // Never leave a heading alone at the bottom of a page
        // A heading is orphaned when only its own parts and the footer follow it
        pageBreakBefore: (node, followingNodesOnPage) =>
            node.headlineLevel > 0 &&
            followingNodesOnPage.length <= node.headlineLevel + 1,
        footer: (page, pages) => ({
            text: `${name}  ·  ${page}/${pages}`,
            alignment: 'center',
            fontSize: 7.5,
            color: COLORS.muted,
            margin: [0, 16, 0, 0]
        }),
        defaultStyle: { font: 'Roboto', fontSize: 9.5, lineHeight: 1.25, color: COLORS.text },
        styles: {
            name: { fontSize: 24, bold: true },
            role: { fontSize: 12, bold: true, color: COLORS.accent, margin: [0, 2, 0, 0] },
            headline: { fontSize: 10, italics: true, color: COLORS.muted, margin: [0, 4, 0, 0] },
            contact: { fontSize: 8.5, color: COLORS.muted, margin: [0, 6, 0, 0] },
            sectionHeading: { fontSize: 10, bold: true, color: COLORS.accent, characterSpacing: 1, margin: [0, 14, 0, 0] },
            paragraph: { margin: [0, 0, 0, 6] },
            itemTitle: { fontSize: 10.5, bold: true },
            itemDate: { fontSize: 8.5, color: COLORS.muted, margin: [0, 1.5, 0, 0] },
            company: { fontSize: 9, color: COLORS.accent, margin: [0, 1, 0, 4] },
            groupTitle: { fontSize: 9, bold: true, color: COLORS.muted, margin: [0, 2, 0, 3] },
            bullets: { margin: [0, 0, 0, 2] }
        }
    };
}

/**
 * Generates and downloads the CV PDF in the current language.
 */
export async function generateCV() {
    const lang = getCurrentLang();
    const pdfMake = await loadPdfMake();
    pdfMake.createPdf(buildDocDefinition(lang)).download((LABELS[lang] || LABELS.es).file);
}

export function init() {
    console.log('CV module initialized');

    document.querySelectorAll('[data-cv-generate]').forEach(link => {
        link.addEventListener('click', async e => {
            e.preventDefault();
            if (link.classList.contains('is-generating')) return;

            link.classList.add('is-generating');
            link.setAttribute('aria-busy', 'true');
            try {
                await generateCV();
            } catch (error) {
                console.error('CV generation failed, falling back to print:', error);
                window.print();
            } finally {
                link.classList.remove('is-generating');
                link.removeAttribute('aria-busy');
            }
        });
    });
}
