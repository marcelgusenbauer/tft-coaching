/* Runtime behaviour only — all copy is baked into the HTML by build.js.
   What is left: scroll behaviour, reveal animations and the Web3Forms submit. */
(function () {
  'use strict';

  // CSS only hides .reveal elements under html.js, so the page stays readable
  // if this script never runs.
  document.documentElement.classList.add('js');

  var runtime = window.SITE_RUNTIME || {};
  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

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
        // Scrolling is handled by the shared smooth-scroll handler.
      });
    });
  }

  /* ---------- Smooth scrolling for in-page anchors ---------- */

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var href = link.getAttribute('href');
        if (href === '#') {
          // Unconfigured link — do nothing instead of jumping to the top.
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

    // Safety net: if the observer never fired (e.g. it is unavailable in an
    // embedded/headless context), reveal everything rather than leaving the
    // page blank below the hero.
    window.setTimeout(function () {
      if (document.querySelector('.reveal.in')) return;
      elements.forEach(function (el) { el.classList.add('in'); });
    }, 2500);
  }

  /* ---------- Logo fallback ---------- */

  // Hides the brand image instead of showing a broken-image icon.
  function setupLogoFallback() {
    var logo = document.querySelector('.nav__logo');
    if (!logo) return;
    logo.addEventListener('error', function () { logo.style.display = 'none'; });
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
      if (offerMailto && runtime.contactEmail) {
        statusEl.appendChild(document.createTextNode(' You can also reach me directly at '));
        var mailLink = document.createElement('a');
        mailLink.href = 'mailto:' + runtime.contactEmail;
        mailLink.textContent = runtime.contactEmail;
        statusEl.appendChild(mailLink);
        statusEl.appendChild(document.createTextNode('.'));
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

      var accessKey = String(runtime.web3formsAccessKey || '').trim();
      if (!accessKey) {
        setStatus('warn', "This form isn't connected yet — add the Web3Forms access key in the admin panel.");
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

  /* ---------- Init ---------- */

  document.addEventListener('DOMContentLoaded', function () {
    setupSmoothScroll();
    setupOfferLinks();
    setupReveal();
    setupLogoFallback();
    setupForm();
  });
})();
