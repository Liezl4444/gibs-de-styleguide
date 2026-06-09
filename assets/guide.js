/* ============================================================
   GIBS Style Guide — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- Main nav ---- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.sidenav .sidenav-item'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('main > .panel'));
  var mobileSectionName = document.getElementById('mobile-section-name');

  function activate(id, push) {
    tabs.forEach(function (t) {
      var on = t.id === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on && mobileSectionName) {
        var lbl = t.querySelector('.nav-label');
        if (lbl) mobileSectionName.textContent = lbl.textContent;
      }
    });
    panels.forEach(function (p) {
      p.classList.toggle('active', p.id === 'p-' + id.slice(2));
    });
    if (push) {
      try { history.replaceState(null, '', '#' + id.slice(2)); } catch (e) {}
      try { localStorage.setItem('gibs-guide-tab', id); } catch (e) {}
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      activate(t.id, true);
      closeNav();
    });
    t.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var next = (i + dir + tabs.length) % tabs.length;
      tabs[next].focus();
      activate(tabs[next].id, true);
    });
  });

  /* Restore from hash or storage */
  var start = null;
  if (location.hash) {
    var byHash = document.getElementById('t-' + location.hash.slice(1));
    if (byHash) start = byHash.id;
  }
  if (!start) {
    try {
      var saved = localStorage.getItem('gibs-guide-tab');
      if (saved && document.getElementById(saved)) start = saved;
    } catch (e) {}
  }
  if (start) activate(start, false);

  /* ---- Mobile hamburger ---- */
  var navToggle  = document.getElementById('nav-toggle');
  var navSidenav = document.getElementById('sidenav');
  var navOverlay = document.getElementById('nav-overlay');

  function openNav() {
    navToggle.setAttribute('aria-expanded', 'true');
    navSidenav.classList.add('open');
    navOverlay.classList.add('show');
    navOverlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    if (!navToggle) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navSidenav.classList.remove('open');
    navOverlay.classList.remove('show');
    navOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      navSidenav.classList.contains('open') ? closeNav() : openNav();
    });
  }
  if (navOverlay) navOverlay.addEventListener('click', closeNav);

  /* ---- Flip cards ---- */
  document.querySelectorAll('.flip').forEach(function (card) {
    function toggle() {
      var on = card.classList.toggle('flipped');
      card.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  /* ---- Mini tab widgets ---- */
  document.querySelectorAll('.mtabs').forEach(function (group) {
    var mtabs = Array.prototype.slice.call(group.querySelectorAll('.mtab'));
    var mpanels = Array.prototype.slice.call(group.querySelectorAll('.mtab-panel'));
    mtabs.forEach(function (mt, i) {
      mt.addEventListener('click', function () {
        mtabs.forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
        mpanels.forEach(function (p) { p.classList.remove('active'); });
        mt.setAttribute('aria-selected', 'true');
        if (mpanels[i]) mpanels[i].classList.add('active');
      });
      mt.addEventListener('keydown', function (e) {
        var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        var n = (i + dir + mtabs.length) % mtabs.length;
        mtabs[n].focus();
        mtabs[n].click();
      });
    });
  });
})();
