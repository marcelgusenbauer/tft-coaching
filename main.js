/* Variant B — "Hextech Arcane" behaviors:
   config injection, testimonials, smooth scroll, scroll reveal, Web3Forms contact form. */
(function () {
  'use strict';

  // Signal that JS is running — CSS only hides .reveal elements under html.js,
  // so content stays visible if this script never executes.
  document.documentElement.classList.add('js');

  var cfg = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG) ? SITE_CONFIG : {};
  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function getConfigValue(key) {
    var raw = cfg[key];
    return (typeof raw === 'string') ? raw.trim() : '';
  }

  function markUnconfigured(el, key) {
    el.classList.add('cfg-missing');
    el.title = 'Set ' + key + ' in config.js';
  }

  /* ---------- data-config / data-config-href injection ---------- */

  function applyConfig() {
    document.querySelectorAll('[data-config]').forEach(function (el) {
      var key = el.getAttribute('data-config');
      var value = getConfigValue(key);
      if (value) {
        el.textContent = value;
      } else {
        markUnconfigured(el, key);
      }
    });

    document.querySelectorAll('[data-config-href]').forEach(function (el) {
      var key = el.getAttribute('data-config-href');
      var value = getConfigValue(key);
      if (value) {
        el.setAttribute('href', value);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      } else {
        el.setAttribute('href', '#');
        markUnconfigured(el, key);
      }
    });
  }

  /* ---------- Direct e-mail links (data-config-mailto) ---------- */

  function applyMailto() {
    document.querySelectorAll('[data-config-mailto]').forEach(function (el) {
      var key = el.getAttribute('data-config-mailto');
      var email = getConfigValue(key);
      if (email) {
        var subject = el.getAttribute('data-mailto-subject');
        el.setAttribute('href', 'mailto:' + email + (subject ? '?subject=' + subject : ''));
      } else {
        // Keep the link inert — the smooth-scroll handler swallows "#" clicks.
        el.setAttribute('href', '#');
        markUnconfigured(el, key);
      }
    });
  }

  /* ---------- Testimonials (SITE_CONFIG.testimonials) ---------- */

  // Shown while SITE_CONFIG.testimonials is empty — obviously placeholder,
  // never mistakable for a real review of a real person.
  var SAMPLE_TESTIMONIALS = [
    {
      name: 'Sample student',
      rank: 'Emerald II → Diamond IV',
      quote: 'Placeholder quote — describe the result a real student got from your coaching.'
    },
    {
      name: 'Sample student',
      rank: 'Platinum I → Emerald III',
      quote: 'Placeholder quote — swap this for a real review, with your student’s permission.'
    },
    {
      name: 'Sample student',
      rank: 'Gold IV → Platinum II',
      quote: 'Placeholder quote — add real entries to the testimonials list in config.js.'
    }
  ];

  function renderTestimonials() {
    var grid = document.getElementById('testimonial-grid');
    if (!grid) return;

    var configured = Array.isArray(cfg.testimonials) && cfg.testimonials.length > 0;
    var items = configured ? cfg.testimonials : SAMPLE_TESTIMONIALS;

    items.forEach(function (item) {
      if (!item || typeof item !== 'object') return;

      var card = document.createElement('figure');
      card.className = 'glass testimonial reveal';

      if (!configured) {
        var tag = document.createElement('p');
        tag.className = 'offer__tag offer__tag--violet';
        tag.textContent = 'Example — replace in config.js';
        card.appendChild(tag);
      }

      // All user-provided strings go through textContent — never innerHTML.
      var quote = document.createElement('blockquote');
      quote.className = 'testimonial__quote';
      var quoteText = document.createElement('p');
      quoteText.textContent = '“' + String(item.quote || '') + '”';
      quote.appendChild(quoteText);
      card.appendChild(quote);

      var byline = document.createElement('figcaption');
      byline.className = 'testimonial__byline';

      var name = document.createElement('p');
      name.className = 'testimonial__name';
      name.textContent = String(item.name || '');
      if (!configured) markUnconfigured(name, 'testimonials');
      byline.appendChild(name);

      var rank = document.createElement('p');
      rank.className = 'testimonial__rank';
      rank.textContent = String(item.rank || '');
      byline.appendChild(rank);

      card.appendChild(byline);
      grid.appendChild(card);
    });
  }

  /* ---------- Offer pricing (data-config-price) ---------- */

  function applyPricing() {
    var pricing = (cfg.pricing && typeof cfg.pricing === 'object') ? cfg.pricing : {};
    document.querySelectorAll('[data-config-price]').forEach(function (el) {
      var key = el.getAttribute('data-config-price');
      var raw = pricing[key];
      var value = (typeof raw === 'string') ? raw.trim() : '';
      // Empty price is a legitimate default, not a missing-config state.
      el.textContent = value || 'Price on request';
    });
  }

  /* ---------- Offer CTAs → preselect interest, then scroll to #contact ---------- */

  function setupOfferLinks() {
    var interestSelect = document.getElementById('f-interest');
    if (!interestSelect) return;
    document.querySelectorAll('[data-offer]').forEach(function (link) {
      link.addEventListener('click', function () {
        var offer = link.getAttribute('data-offer');
        var hasOption = Array.prototype.some.call(interestSelect.options, function (option) {
          return option.value === offer;
        });
        if (hasOption) interestSelect.value = offer;
        // Scrolling itself is handled by the shared smooth-scroll handler
        // (which already respects prefers-reduced-motion).
      });
    });
  }

  /* ---------- Smooth scrolling for in-page anchors ---------- */

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var href = link.getAttribute('href');
        if (href === '#') {
          // Unconfigured proof link — do nothing instead of jumping to top.
          event.preventDefault();
          return;
        }
        var target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({
          behavior: reducedMotionQuery.matches ? 'auto' : 'smooth',
          block: 'start'
        });
        if (history.replaceState) history.replaceState(null, '', href);
      });
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */

  function setupReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (reducedMotionQuery.matches || !('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Contact form (Web3Forms) ---------- */

  function setupForm() {
    var form = document.getElementById('coaching-form');
    if (!form) return;

    var statusEl = document.getElementById('form-status');
    var successEl = document.getElementById('form-success');
    var submitBtn = form.querySelector('button[type="submit"]');

    function setStatus(kind, message, offerMailto) {
      statusEl.className = 'form-status' + (kind ? ' is-' + kind : '');
      statusEl.textContent = message;
      if (offerMailto) {
        var email = getConfigValue('contactEmail');
        if (email) {
          statusEl.appendChild(document.createTextNode(' You can also reach me directly at '));
          var mailLink = document.createElement('a');
          mailLink.href = 'mailto:' + email;
          mailLink.textContent = email;
          statusEl.appendChild(mailLink);
          statusEl.appendChild(document.createTextNode('.'));
        }
      }
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      // Honeypot: bots tick the hidden checkbox — abort silently.
      var honeypot = form.querySelector('input[name="botcheck"]');
      if (honeypot && honeypot.checked) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var accessKey = getConfigValue('web3formsAccessKey');
      if (!accessKey) {
        setStatus('warn', "This form isn't connected yet — add your free Web3Forms access key in config.js.");
        return;
      }

      var data = new FormData(form);
      var name = String(data.get('name') || '').trim();
      var payload = {
        access_key: accessKey,
        subject: 'New TFT coaching request from ' + name,
        name: name,
        email: String(data.get('email') || '').trim(),
        rank: String(data.get('rank') || '').trim(),
        interest: String(data.get('interest') || '').trim(),
        message: String(data.get('message') || '').trim()
      };
      var discord = String(data.get('discord') || '').trim();
      if (discord) payload.discord = discord;

      var originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      setStatus('', '');

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(function (response) { return response.json(); })
        .then(function (result) {
          if (result && result.success) {
            form.hidden = true;
            successEl.hidden = false;
            // Announce via the live region without duplicating the visible card.
            statusEl.classList.add('visually-hidden');
            statusEl.textContent = "Request sent — I'll get back to you within 24 hours.";
            successEl.focus();
          } else {
            setStatus('error', 'Something went wrong sending your request. Please try again in a minute.', true);
          }
        })
        .catch(function () {
          setStatus('error', 'Network error — your request was not sent. Please try again.', true);
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        });
    });
  }

  /* ---------- Brand logo ---------- */

  // Swaps the header hex mark and favicon for assets/logo.png. Gated on
  // onload so a missing file leaves the built-in SVG mark untouched.
  function setupLogo() {
    var img = new Image();
    img.decoding = 'async';
    img.alt = '';
    img.className = 'nav__logo';
    img.onload = function () {
      var mark = document.querySelector('.nav__hex');
      if (mark && mark.parentNode) mark.parentNode.replaceChild(img, mark);
      var favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.type = 'image/png';
        favicon.href = img.src;
      }
    };
    img.src = 'assets/logo.png';
  }

  /* ---------- Init ---------- */

  document.addEventListener('DOMContentLoaded', function () {
    applyConfig();
    applyPricing();
    applyMailto();
    // Render before smooth-scroll/reveal setup so new nodes are wired up too.
    renderTestimonials();
    setupSmoothScroll();
    setupOfferLinks();
    setupReveal();
    setupForm();
    setupLogo();
  });
})();
