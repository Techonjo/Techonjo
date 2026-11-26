/**
 * Techonjo Portfolio Scripts
 * - Dark Mode Switcher (with persistence & shortcut 'D')
 * - One-Click Email Copy with Toast feedback
 * - Interactive Project Category Filter (All / Mobile / Websites)
 * - Live Bauchi Local Time ticker (Day/Night indicator & Remote ready)
 * - Interactive 3D tilt & Phone screen inspection
 * - Mobile Navigation Menu
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── 1. Toast Notification Helper ──────────────────────────────
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // ── 2. One-Click Copy Email ───────────────────────────────────
  function copyEmail(email, buttonEl) {
    if (!email) email = 'josephonoja58@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Email copied to clipboard!');
      if (buttonEl) {
        const originalText = buttonEl.querySelector('.btn-copy-text');
        if (originalText) {
          const prev = originalText.textContent;
          originalText.textContent = 'Copied!';
          setTimeout(() => { originalText.textContent = prev; }, 1800);
        }
      }
    }).catch(() => {
      // Fallback
      window.location.href = `mailto:${email}`;
    });
  }

  const heroCopyBtn = document.getElementById('hero-copy-email');
  if (heroCopyBtn) {
    heroCopyBtn.addEventListener('click', () => {
      copyEmail('josephonoja58@gmail.com', heroCopyBtn);
    });
  }

  const footerCopyBtn = document.getElementById('footer-copy-email');
  if (footerCopyBtn) {
    footerCopyBtn.addEventListener('click', () => {
      copyEmail('josephonoja58@gmail.com', footerCopyBtn);
    });
  }

  // ── 3. Dark Mode Switcher ──────────────────────────────────────
  const themeToggle = document.getElementById('theme-toggle');
  const mobThemeToggle = document.getElementById('mob-theme-toggle');

  function getActiveTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('techonjo-theme', theme);
  }

  function toggleTheme() {
    const next = getActiveTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (mobThemeToggle) mobThemeToggle.addEventListener('click', toggleTheme);

  // Keyboard Shortcut: D for Dark Mode
  window.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'd' || e.key === 'D') {
      toggleTheme();
    }
  });

  // ── 4. Interactive Project Filter ─────────────────────────────
  const filterButtons = document.querySelectorAll('.filter-btn');
  const groupMobile = document.getElementById('group-mobile');
  const groupWebsites = document.getElementById('group-websites');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      if (filter === 'all') {
        if (groupMobile) groupMobile.classList.remove('is-hidden');
        if (groupWebsites) groupWebsites.classList.remove('is-hidden');
      } else if (filter === 'mobile') {
        if (groupMobile) groupMobile.classList.remove('is-hidden');
        if (groupWebsites) groupWebsites.classList.add('is-hidden');
      } else if (filter === 'websites') {
        if (groupMobile) groupMobile.classList.add('is-hidden');
        if (groupWebsites) groupWebsites.classList.remove('is-hidden');
      }
    });
  });

  // ── 5. Live Local Time Ticker with Day/Night Awareness ─────────
  const bauchiTimeEl = document.getElementById('bauchi-time');
  function updateBauchiTime() {
    if (!bauchiTimeEl) return;
    try {
      const now = new Date();
      // Format time in Nigeria (Africa/Lagos)
      const options = {
        timeZone: 'Africa/Lagos',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      const timeStr = now.toLocaleTimeString('en-US', options);

      // Check hour for real SVG sun or moon icon
      const hourWAT = parseInt(now.toLocaleTimeString('en-US', { timeZone: 'Africa/Lagos', hour: 'numeric', hour12: false }), 10);
      const isDay = hourWAT >= 6 && hourWAT < 18;
      
      const sunSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="live-time-svg"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      const moonSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="live-time-svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      const iconSvg = isDay ? sunSvg : moonSvg;

      bauchiTimeEl.innerHTML = `${iconSvg} ${timeStr} WAT · Remote ready`;
    } catch (e) {
      bauchiTimeEl.textContent = 'WAT (UTC+1) · Remote ready';
    }
  }
  updateBauchiTime();
  setInterval(updateBauchiTime, 1000);

  // ── 6. Interactive Phone Screen Focus on Tap ──────────────────
  const visuals = document.querySelectorAll('.app-visual');
  visuals.forEach(visual => {
    const phones = visual.querySelectorAll('.phone-frame');
    phones.forEach(phone => {
      phone.addEventListener('click', () => {
        phones.forEach(p => p.style.zIndex = '1');
        phone.style.zIndex = '5';
      });
    });
  });

  // ── 7. Interactive 3D Tilt on Mobile App Cards ────────────────
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 900) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3.5;
      const rotateY = ((x - centerX) / centerX) * 3.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── 8. Mobile Nav Hamburger ───────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const closeNav = document.getElementById('close-nav');
  const mobLinks = document.querySelectorAll('.mob-link');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
  }
  if (closeNav && mobileNav) {
    closeNav.addEventListener('click', () => mobileNav.classList.remove('open'));
  }
  mobLinks.forEach(link => {
    link.addEventListener('click', () => mobileNav && mobileNav.classList.remove('open'));
  });
});
