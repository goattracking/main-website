document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // If React header is present, it handles nav toggle
  if (!document.querySelector('.react-header')) {
    const navToggle = document.querySelector('.nav-toggle');
    const primaryNav = document.getElementById('primary-nav');
    if (navToggle && primaryNav) {
      navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        primaryNav.classList.toggle('open');
      });
    }
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
    });
  }
});


