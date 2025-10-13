document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Header navigation toggle
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const primaryNav = document.getElementById('primary-nav');
  
  const closeMenu = () => {
    if (navToggle && primaryNav) {
      navToggle.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
  };
  
  const openMenu = () => {
    if (navToggle && primaryNav) {
      navToggle.setAttribute('aria-expanded', 'true');
      primaryNav.classList.add('open');
      document.body.classList.add('menu-open');
    }
  };
  
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }
  
  if (navClose) {
    navClose.addEventListener('click', closeMenu);
  }
  
  // Close menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) {
      closeMenu();
    }
  });
  
  // Close menu when clicking nav links
  if (primaryNav) {
    primaryNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

  // Pricing toggle
  const plans = document.querySelector('.plans');
  const toggle = document.querySelector('.pricing-toggle');
  if (plans && toggle) {
    toggle.addEventListener('click', (e) => {
      const btn = e.target.closest('.toggle-btn');
      if (!btn) return;
      toggle.querySelectorAll('.toggle-btn').forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });
      plans.setAttribute('data-pricing-mode', btn.dataset.mode);

      // Update visible prices
      const isAgency = btn.dataset.mode === 'agency';
      document.querySelectorAll('.price[data-business]')
        .forEach(p => {
          const text = isAgency ? p.getAttribute('data-agency') : p.getAttribute('data-business');
          if (text) {
            p.textContent = text;
            p.classList.remove('swap');
            void p.offsetWidth; // reflow to restart animation
            p.classList.add('swap');
          }
        });

      // subtle pulse on each card
      document.querySelectorAll('.plan').forEach(card => {
        card.classList.remove('swap');
        void card.offsetWidth;
        card.classList.add('swap');
      });

      // No inline toggling needed; CSS handles visibility based on data-pricing-mode
    });
  }
});


