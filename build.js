#!/usr/bin/env node
/* Builds dist/ from config.json + the HTML templates.
   Every piece of visible copy is rendered here, so the deployed HTML is fully
   static: no flash of old content, and search engines see the real text.
   A broken config.json fails the build — Cloudflare then keeps the last good
   deployment online instead of publishing a damaged page. */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const SITE_URL = 'https://tft-coaching.pages.dev';

function fail(message) {
  console.error('\n=== BUILD ABGEBROCHEN ===');
  console.error(message);
  console.error('Die Website bleibt unverändert online. Bitte config.json korrigieren.\n');
  process.exit(1);
}

/* ---------- config ---------- */

let cfg;
try {
  cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8'));
} catch (error) {
  fail('config.json ist kein gültiges JSON.\nDetails: ' + error.message);
}

const REQUIRED = [
  'coach.name', 'coach.peakRank', 'coach.region', 'coach.seasonsPlayed',
  'contact.email', 'hero.titleStart', 'hero.titleHighlight',
  'offerings.title', 'curriculum.title', 'how.title', 'contactSection.title'
];

function lookup(obj, dotted) {
  return dotted.split('.').reduce(function (acc, key) {
    return (acc && typeof acc === 'object') ? acc[key] : undefined;
  }, obj);
}

const missing = REQUIRED.filter(function (key) {
  const value = lookup(cfg, key);
  return typeof value !== 'string' || !value.trim();
});
if (missing.length) {
  fail('Diese Pflichtfelder in config.json sind leer:\n  - ' + missing.join('\n  - '));
}

if (!Array.isArray(cfg.testimonials)) fail('"testimonials" muss eine Liste sein (auch wenn sie leer ist: []).');
['offerings.singleSessions', 'offerings.trainingPlans', 'curriculum.cards', 'how.steps'].forEach(function (key) {
  if (!Array.isArray(lookup(cfg, key))) fail('"' + key + '" muss eine Liste sein.');
});

/* ---------- helpers ---------- */

function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function text(dotted) {
  const value = lookup(cfg, dotted);
  return typeof value === 'string' ? value.trim() : '';
}

/* ---------- offers ---------- */

// Plans carry their session count in the interest value so the contact form
// and the offer cards always describe the same thing.
function interestValue(offer, isPlan) {
  const title = String(offer.title || '').trim();
  const meta = String(offer.meta || '').trim();
  return (isPlan && meta) ? title + ' (' + meta + ')' : title;
}

function renderOffer(offer, isPlan) {
  const parts = [];
  const classes = 'glass offer reveal' + (offer.highlight ? ' offer--popular' : '');
  parts.push('<article class="' + classes + '">');
  if (String(offer.tag || '').trim()) {
    parts.push('  <p class="offer__tag offer__tag--' + (offer.highlight ? 'gold' : 'violet') + '">' + esc(offer.tag) + '</p>');
  }
  if (String(offer.meta || '').trim()) {
    parts.push('  <p class="offer__meta">' + esc(offer.meta) + '</p>');
  }
  parts.push('  <h4>' + esc(offer.title) + '</h4>');
  parts.push('  <p class="offer__desc">' + esc(offer.description) + '</p>');
  if (String(offer.perk || '').trim()) {
    parts.push('  <p class="offer__perk">' + esc(offer.perk) + '</p>');
  }
  parts.push('  <p class="offer__price">' + esc(String(offer.price || '').trim() || 'Price on request') + '</p>');
  parts.push('  <a class="btn btn--ghost btn--small offer__cta" href="#contact" data-offer="' +
    esc(interestValue(offer, isPlan)) + '">' + esc(offer.buttonLabel || 'Request this session') + '</a>');
  parts.push('</article>');
  return parts.join('\n');
}

const singleOffers = cfg.offerings.singleSessions.map(function (o) { return renderOffer(o, false); }).join('\n\n');
const planOffers = cfg.offerings.trainingPlans.map(function (o) { return renderOffer(o, true); }).join('\n\n');

const interestOptions = []
  .concat(cfg.offerings.singleSessions.map(function (o) { return interestValue(o, false); }))
  .concat(cfg.offerings.trainingPlans.map(function (o) { return interestValue(o, true); }))
  .filter(Boolean)
  .map(function (value) { return '<option>' + esc(value) + '</option>'; })
  .concat(['<option>Custom request</option>', '<option selected>Not sure yet</option>'])
  .join('\n                  ');

/* ---------- curriculum ---------- */

const ICONS = {
  economy: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.5v9M9.4 9.8c0-1.1 1.1-1.8 2.6-1.8s2.6.7 2.6 1.8c0 2.7-5.2 1.7-5.2 4.4 0 1.1 1.1 1.8 2.6 1.8s2.6-.7 2.6-1.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  board: '<rect x="3" y="3" width="18" height="18" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".55"/><circle cx="12" cy="12" r="2.2" fill="currentColor"/>',
  flex: '<path d="M3 7h4.5l9 10H21M21 7h-4.5l-2.4 2.67M3 17h4.5l2.4-2.67" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="m18.4 4.6 2.6 2.4-2.6 2.4M18.4 14.6l2.6 2.4-2.6 2.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
  decisions: '<path d="M12 3v5M12 8 6 13M12 8l6 5M6 13v5M18 13v5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="3.5" r="1.6" fill="currentColor"/><circle cx="6" cy="19" r="1.6" fill="currentColor"/><circle cx="18" cy="19" r="1.6" fill="currentColor"/>',
  target: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/>',
  chart: '<path d="M4 19V5M4 19h16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="m7 15 3.5-4 3 2.5L19 7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>'
};

const curriculumCards = cfg.curriculum.cards.map(function (card) {
  const icon = ICONS[card.icon] || ICONS.target;
  return [
    '<article class="glass card reveal">',
    '  <div class="card__icon" aria-hidden="true">',
    '    <svg viewBox="0 0 24 24" width="24" height="24">' + icon + '</svg>',
    '  </div>',
    '  <h3>' + esc(card.title) + '</h3>',
    '  <p>' + esc(card.text) + '</p>',
    '</article>'
  ].join('\n');
}).join('\n\n');

/* ---------- steps ---------- */

const steps = cfg.how.steps.map(function (step, index) {
  return [
    '<li class="glass step reveal">',
    '  <span class="step__num" aria-hidden="true">' + String(index + 1).padStart(2, '0') + '</span>',
    '  <h3>' + esc(step.title) + '</h3>',
    '  <p>' + esc(step.text) + '</p>',
    '</li>'
  ].join('\n');
}).join('\n\n');

/* ---------- testimonials ---------- */

const SAMPLES = [
  { name: 'Sample student', rank: 'Emerald II → Diamond IV', quote: 'Placeholder quote — replace this with a real student review in the admin panel.' },
  { name: 'Sample student', rank: 'Platinum I → Emerald III', quote: 'Placeholder quote — add real entries once your students agree to be quoted.' },
  { name: 'Sample student', rank: 'Gold IV → Platinum II', quote: 'Placeholder quote — until then these example cards stay clearly marked.' }
];

const realTestimonials = cfg.testimonials.filter(function (item) {
  return item && String(item.quote || '').trim() && String(item.name || '').trim();
});
const usingSamples = realTestimonials.length === 0;
const testimonialItems = usingSamples ? SAMPLES : realTestimonials;

const testimonials = testimonialItems.map(function (item) {
  const parts = ['<figure class="glass testimonial reveal">'];
  if (usingSamples) {
    parts.push('  <p class="offer__tag offer__tag--violet">Example — replace in the admin panel</p>');
  }
  parts.push('  <blockquote class="testimonial__quote"><p>“' + esc(item.quote) + '”</p></blockquote>');
  parts.push('  <figcaption class="testimonial__byline">');
  parts.push('    <p class="testimonial__name' + (usingSamples ? ' cfg-missing' : '') + '">' + esc(item.name) + '</p>');
  parts.push('    <p class="testimonial__rank">' + esc(item.rank) + '</p>');
  parts.push('  </figcaption>');
  parts.push('</figure>');
  return parts.join('\n');
}).join('\n\n');

/* ---------- video ---------- */

function youtubeId(url) {
  const raw = String(url || '').trim();
  if (!raw) return '';
  const match = raw.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/) || raw.match(/^([\w-]{11})$/);
  return match ? match[1] : '';
}

const videoId = youtubeId(cfg.video && cfg.video.url);
if (cfg.video && String(cfg.video.url || '').trim() && !videoId) {
  fail('Der Video-Link ist keine erkennbare YouTube-Adresse: "' + cfg.video.url + '"');
}

const videoSection = videoId ? [
  '    <section class="section" id="video">',
  '      <div class="container">',
  '        <header class="section__head reveal">',
  '          <p class="eyebrow">' + esc(text('video.eyebrow') || 'Video') + '</p>',
  '          <h2>' + esc(text('video.title')) + '</h2>',
  '        </header>',
  '        <div class="video-frame reveal">',
  '          <iframe src="https://www.youtube-nocookie.com/embed/' + esc(videoId) + '" title="' + esc(text('video.title') || 'Coaching video') + '" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
  '        </div>',
  '      </div>',
  '    </section>'
].join('\n') : '';

/* ---------- links ---------- */

function externalLink(url) {
  const value = String(url || '').trim();
  return value
    ? { href: esc(value), attrs: ' target="_blank" rel="noopener noreferrer"' }
    : { href: '#', attrs: ' class="cfg-missing"' };
}

const profileLink = externalLink(cfg.coach.profileUrl);
const discordLink = externalLink(cfg.contact.discordInviteUrl);
const mailHref = String(cfg.contact.email || '').trim()
  ? 'mailto:' + esc(cfg.contact.email) + '?subject=Custom%20coaching%20offer'
  : '#';

/* ---------- structured data ---------- */

const schemaOffers = []
  .concat(cfg.offerings.singleSessions.map(function (o) { return { o: o, plan: false }; }))
  .concat(cfg.offerings.trainingPlans.map(function (o) { return { o: o, plan: true }; }))
  .map(function (entry) {
    const price = parseFloat(String(entry.o.price || '').replace(/[^\d.,]/g, '').replace(',', '.'));
    if (!price) return null;
    return {
      '@type': 'Offer',
      name: interestValue(entry.o, entry.plan),
      price: price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock'
    };
  })
  .filter(Boolean);

const structuredData = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Challenger TFT Coaching',
  serviceType: 'Video game coaching (Teamfight Tactics)',
  url: SITE_URL + '/',
  description: text('meta.pageDescription'),
  provider: { '@type': 'Person', name: text('coach.name') },
  areaServed: 'Europe',
  offers: schemaOffers
}).replace(/</g, '\\u003c');

/* ---------- render ---------- */

const REPLACEMENTS = {
  'meta.pageTitle': text('meta.pageTitle'),
  'meta.pageDescription': text('meta.pageDescription'),
  'coach.name': text('coach.name'),
  'coach.riotId': text('coach.riotId'),
  'coach.region': text('coach.region'),
  'coach.peakRank': text('coach.peakRank'),
  'coach.seasonsPlayed': text('coach.seasonsPlayed'),
  'contact.discordHandle': text('contact.discordHandle'),
  'contact.email': text('contact.email'),
  'hero.eyebrow': text('hero.eyebrow'),
  'hero.badgeLabel': text('hero.badgeLabel'),
  'hero.titleStart': text('hero.titleStart'),
  'hero.titleHighlight': text('hero.titleHighlight'),
  'hero.titleEnd': text('hero.titleEnd'),
  'hero.subline': text('hero.subline'),
  'hero.ctaPrimary': text('hero.ctaPrimary'),
  'hero.ctaSecondary': text('hero.ctaSecondary'),
  'hero.trust1': text('hero.trust1'),
  'hero.trust2': text('hero.trust2'),
  'hero.trust3': text('hero.trust3'),
  'credentials.eyebrow': text('credentials.eyebrow'),
  'credentials.title': text('credentials.title'),
  'credentials.lede': text('credentials.lede'),
  'credentials.labelPeak': text('credentials.labelPeak'),
  'credentials.labelRegion': text('credentials.labelRegion'),
  'credentials.labelSeasons': text('credentials.labelSeasons'),
  'credentials.riotIdLabel': text('credentials.riotIdLabel'),
  'credentials.verifyButton': text('credentials.verifyButton'),
  'offerings.eyebrow': text('offerings.eyebrow'),
  'offerings.title': text('offerings.title'),
  'offerings.lede': text('offerings.lede'),
  'offerings.singleGroupTitle': text('offerings.singleGroupTitle'),
  'offerings.plansGroupTitle': text('offerings.plansGroupTitle'),
  'offerings.customTitle': text('offerings.customTitle'),
  'offerings.customText': text('offerings.customText'),
  'offerings.customButton': text('offerings.customButton'),
  'offerings.customMailLink': text('offerings.customMailLink'),
  'curriculum.eyebrow': text('curriculum.eyebrow'),
  'curriculum.title': text('curriculum.title'),
  'curriculum.lede': text('curriculum.lede'),
  'testimonialsSection.eyebrow': text('testimonialsSection.eyebrow'),
  'testimonialsSection.title': text('testimonialsSection.title'),
  'testimonialsSection.lede': text('testimonialsSection.lede'),
  'how.eyebrow': text('how.eyebrow'),
  'how.title': text('how.title'),
  'how.lede': text('how.lede'),
  'how.note': text('how.note'),
  'contactSection.eyebrow': text('contactSection.eyebrow'),
  'contactSection.title': text('contactSection.title'),
  'contactSection.lede': text('contactSection.lede'),
  'contactSection.discordButton': text('contactSection.discordButton'),
  'contactSection.labelName': text('contactSection.labelName'),
  'contactSection.labelEmail': text('contactSection.labelEmail'),
  'contactSection.labelRank': text('contactSection.labelRank'),
  'contactSection.labelInterest': text('contactSection.labelInterest'),
  'contactSection.labelDiscord': text('contactSection.labelDiscord'),
  'contactSection.labelMessage': text('contactSection.labelMessage'),
  'contactSection.messagePlaceholder': text('contactSection.messagePlaceholder'),
  'contactSection.submitButton': text('contactSection.submitButton'),
  'contactSection.replyHint': text('contactSection.replyHint'),
  'contactSection.successTitle': text('contactSection.successTitle'),
  'contactSection.successText': text('contactSection.successText')
};

const BLOCKS = {
  'offers-single': singleOffers,
  'offers-plans': planOffers,
  'curriculum-cards': curriculumCards,
  'steps': steps,
  'testimonials': testimonials,
  'video-section': videoSection,
  'interest-options': interestOptions,
  'structured-data': structuredData,
  'profile-href': profileLink.href,
  'profile-attrs': profileLink.attrs,
  'discord-href': discordLink.href,
  'discord-attrs': discordLink.attrs,
  'mail-href': mailHref,
  'site-url': SITE_URL
};

let html;
try {
  html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
} catch (error) {
  fail('index.html konnte nicht gelesen werden: ' + error.message);
}

const unresolved = [];

// Triple braces first — they contain a double-brace pattern themselves.
// {{{key}}} inserts pre-rendered HTML.
html = html.replace(/\{\{\{([\w.-]+)\}\}\}/g, function (match, key) {
  if (Object.prototype.hasOwnProperty.call(BLOCKS, key)) return BLOCKS[key];
  unresolved.push(key);
  return match;
});

// {{key}} inserts escaped text.
html = html.replace(/\{\{([\w.-]+)\}\}/g, function (match, key) {
  if (Object.prototype.hasOwnProperty.call(REPLACEMENTS, key)) return esc(REPLACEMENTS[key]);
  unresolved.push(key);
  return match;
});

if (unresolved.length) {
  fail('Unbekannte Platzhalter im Template: ' + Array.from(new Set(unresolved)).join(', '));
}

/* ---------- runtime config (only what the browser really needs) ---------- */

const runtime = 'window.SITE_RUNTIME = ' + JSON.stringify({
  web3formsAccessKey: String(cfg.contact.web3formsAccessKey || '').trim(),
  contactEmail: String(cfg.contact.email || '').trim()
}) + ';\n';

/* ---------- write dist ---------- */

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });

fs.writeFileSync(path.join(DIST, 'index.html'), html);
fs.writeFileSync(path.join(DIST, 'runtime.js'), runtime);

['styles.css', 'main.js', 'legal.html', 'robots.txt', 'sitemap.xml'].forEach(function (file) {
  const from = path.join(ROOT, file);
  if (fs.existsSync(from)) fs.copyFileSync(from, path.join(DIST, file));
  else console.warn('Hinweis: ' + file + ' fehlt und wurde übersprungen.');
});

['logo.png', 'og-image.png'].forEach(function (file) {
  const from = path.join(ROOT, 'assets', file);
  if (fs.existsSync(from)) fs.copyFileSync(from, path.join(DIST, 'assets', file));
});

// The admin panel (Sveltia CMS) ships as-is, plus the config the CMS reads.
const adminSrc = path.join(ROOT, 'admin');
if (fs.existsSync(adminSrc)) {
  fs.mkdirSync(path.join(DIST, 'admin'), { recursive: true });
  fs.readdirSync(adminSrc).forEach(function (file) {
    fs.copyFileSync(path.join(adminSrc, file), path.join(DIST, 'admin', file));
  });
}
fs.copyFileSync(path.join(ROOT, 'config.json'), path.join(DIST, 'config.json'));

console.log('Build OK — ' +
  (cfg.offerings.singleSessions.length + cfg.offerings.trainingPlans.length) + ' Angebote, ' +
  cfg.curriculum.cards.length + ' Curriculum-Karten, ' +
  cfg.how.steps.length + ' Schritte, ' +
  (usingSamples ? 'Beispiel-Testimonials' : realTestimonials.length + ' Testimonials') +
  (videoId ? ', Video aktiv' : ', kein Video') + '.');
