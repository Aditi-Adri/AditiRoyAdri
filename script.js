(function () {
  'use strict';

  var html       = document.documentElement;
  var spotlight  = document.getElementById('spotlight');
  var themeBtn   = document.getElementById('theme-toggle');
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  var toTop      = document.getElementById('to-top');
  var cursorRing = document.getElementById('cursor-ring');

  // ── Theme toggle ─────────────────────────────────────
  var saved = localStorage.getItem('ara-theme') || 'dark';
  html.setAttribute('data-theme', saved);

  themeBtn.addEventListener('click', function () {
    var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('ara-theme', next);
  });

  // ── Hamburger / mobile menu ───────────────────────────
  hamburger.addEventListener('click', function () {
    var open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
  });

  // close mobile menu on link click
  mobileMenu.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });

  // ── Cursor highlight ring ─────────────────────────────
  // Ring tracks mouse and glows violet only over interactive elements.
  // Native cursor is untouched everywhere.
  var INTERACTIVE = 'a, button, .featured-card, .other-card, .social-icon, .icon-link, .contact-social-btn, .contact-email, .archive-link, .nav-item, .mobile-link, .theme-toggle, .cv-btn, .to-top';

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      cursorRing.style.left = e.clientX + 'px';
      cursorRing.style.top  = e.clientY + 'px';
    }, { passive: true });

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(INTERACTIVE)) cursorRing.classList.add('active');
    });

    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(INTERACTIVE)) cursorRing.classList.remove('active');
    });
  }

  // ── Spotlight effect ──────────────────────────────────
  document.addEventListener('mousemove', function (e) {
    spotlight.style.setProperty('--mx', e.clientX + 'px');
    spotlight.style.setProperty('--my', e.clientY + 'px');
  }, { passive: true });

  // ── Scroll-spy: highlight active nav item ─────────────
  var sections = Array.from(document.querySelectorAll('section[id]'));
  var navItems = Array.from(document.querySelectorAll('.nav-item[data-section]'));

  var spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navItems.forEach(function (item) {
          item.classList.toggle('active', item.getAttribute('data-section') === id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -65% 0px' });

  sections.forEach(function (s) { spyObserver.observe(s); });

  // ── Smooth scroll for anchor links ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var offset = 72; // topnav height + breathing room
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ── Back to top button ────────────────────────────────
  window.addEventListener('scroll', function () {
    toTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Topnav shadow on scroll ───────────────────────────
  var topnav = document.getElementById('topnav');
  window.addEventListener('scroll', function () {
    topnav.style.boxShadow = window.scrollY > 10
      ? '0 1px 24px rgba(0,0,0,.3)'
      : 'none';
  }, { passive: true });

  // ── Fade-in on scroll ─────────────────────────────────
  var fadeEls = Array.from(document.querySelectorAll(
    '.featured-card, .other-card, .edu-card, .about-stats, .skill-group, .contact-body'
  ));

  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  fadeEls.forEach(function (el) {
    el.classList.add('fade-item');
    fadeObserver.observe(el);
  });

  // ── See More / paginate projects ──────────────────────
  var featuredList = document.querySelector('.featured-list');
  if (featuredList) {
    var allCards = Array.from(featuredList.querySelectorAll('.featured-card'));
    var PER_PAGE = 4;
    if (allCards.length > PER_PAGE) {
      var shownCount = PER_PAGE;
      allCards.slice(PER_PAGE).forEach(function (c) { c.classList.add('fc-hidden'); });

      var seeMoreBtn = document.createElement('button');
      seeMoreBtn.className = 'see-more-btn';
      seeMoreBtn.textContent = 'See More Projects';
      featuredList.after(seeMoreBtn);

      seeMoreBtn.addEventListener('click', function () {
        var end = Math.min(shownCount + PER_PAGE, allCards.length);
        for (var i = shownCount; i < end; i++) {
          (function (card) {
            card.classList.remove('fc-hidden');
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                card.classList.add('visible');
              });
            });
          })(allCards[i]);
        }
        shownCount = end;
        if (shownCount >= allCards.length) {
          seeMoreBtn.style.display = 'none';
        }
      });
    }
  }
})();
