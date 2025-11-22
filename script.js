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

  // Pricing calculator & toggle
  const calculator = document.querySelector('.pricing-calculator');
  const toggle = document.querySelector('.pricing-toggle');
  const spendInput = document.getElementById('ad-spend');
  const spendDisplay = document.getElementById('ad-spend-display');
  const spendBubble = document.getElementById('ad-spend-bubble');
  const sliderCaption = document.querySelector('.pricing-slider .slider-caption');
  const feeDisplay = document.getElementById('fee-display');
  const feeBig = document.getElementById('fee-big');
  const feeSuffix = document.getElementById('fee-suffix');
  const feeNote = document.getElementById('fee-note');
  const planTitle = document.getElementById('plan-title');
  const planLogo = document.getElementById('plan-logo');
  const spendInputMobile = document.getElementById('spend-input-mobile');
  const stepperDec = document.getElementById('spend-decrease');
  const stepperInc = document.getElementById('spend-increase');

  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  const recalc = () => {
    if (!calculator || !spendInput) return;
    const min = Number(spendInput.min || 0);
    const max = Number(spendInput.max || 100);
    const mode = calculator.getAttribute('data-mode') || 'business';
    // Dynamic step: larger jumps after 100k and 300k
    let spend = Number(spendInput.value || 0);
    let desiredStep;
    if (spend >= 300000) {
      desiredStep = 100000;
    } else if (spend >= 100000) {
      desiredStep = 50000;
    } else {
      desiredStep = 10000;
    }
    const currentStep = Number(spendInput.step || 0);
    if (currentStep !== desiredStep) {
      spendInput.step = String(desiredStep);
      // snap to nearest step to avoid in-between values
      const snapped = Math.round(spend / desiredStep) * desiredStep;
      if (snapped !== spend) {
        spend = snapped;
        spendInput.value = String(snapped);
      }
    }
    if (spendDisplay) spendDisplay.textContent = formatCurrency(spend);
    if (spendInputMobile && document.activeElement !== spendInputMobile) {
      spendInputMobile.value = formatCurrency(spend);
    }
    if (spendBubble) {
      const pct = (spend - min) / (max - min);
      const left = pct * 100;
      spendBubble.style.left = `${left}%`;
      const compact = Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(spend);
      spendBubble.textContent = compact;
      // keep caption aligned with bubble
      const cap = document.querySelector('.pricing-slider .slider-caption');
      if (cap) cap.style.left = `${left}%`;
    }
    const fee = Math.max(97, Math.round(spend * 0.01)); // 1% with $97 minimum
    const suffix = mode === 'agency' ? ' per client/month' : ' per month';
    const isContact = spend >= 100000;
    // Keep price always visible
    if (feeDisplay) feeDisplay.textContent = `${formatCurrency(fee)}${suffix}`;
    if (feeBig) feeBig.textContent = `${formatCurrency(fee)}`;
    if (feeSuffix) feeSuffix.textContent = mode === 'agency' ? '/client/month' : '/monthly';

    // Switch CTA when over threshold
    const ctaBtn = document.querySelector('.pricing-calculator .calc-cta .button');
    if (ctaBtn) {
      if (isContact) {
        ctaBtn.textContent = 'Contact Sales';
        ctaBtn.href = 'https://www.goattracking.com/schedule';
        ctaBtn.classList.add('contact');
      } else {
        ctaBtn.textContent = 'Try for Free';
        ctaBtn.href = 'https://app.goattracking.com/sign-up';
        ctaBtn.classList.remove('contact');
      }
    }
    if (feeNote) feeNote.style.display = fee === 97 ? '' : 'none';
    if (planTitle) planTitle.textContent = mode === 'agency' ? 'Agency Pricing' : 'Business Pricing';
    if (planLogo) {
      if (mode === 'agency') {
        planLogo.onerror = () => { planLogo.src = './Images/logo_smiths.png'; };
        planLogo.src = './Images/Server-Side Tracking (4).png';
        planLogo.alt = 'Server-Side Tracking';
      } else {
        planLogo.onerror = null;
        planLogo.src = './Images/logo_business.png';
        planLogo.alt = 'Goat Tracking';
      }
    }

    // small pulse animation on value change (only if element exists)
    if (feeDisplay) {
      feeDisplay.classList.remove('swap');
      void feeDisplay.offsetWidth;
      feeDisplay.classList.add('swap');
    }

    // slider progress fill and moving caption
    const pctFill = Math.max(0, Math.min(100, ((spend - min) / (max - min)) * 100));
    spendInput.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pctFill}%, #1b1c21 ${pctFill}%, #1b1c21 100%)`;
    // also ensure alignment in case bubble block above didn't run
    if (sliderCaption) sliderCaption.style.left = `${pctFill}%`;
  };

  if (spendInput) {
    spendInput.addEventListener('input', recalc);
    spendInput.addEventListener('change', recalc);
    spendInput.addEventListener('mousemove', (e) => { if (e.buttons === 1) recalc(); });
    spendInput.addEventListener('pointermove', (e) => { if (e.buttons === 1) recalc(); });
  }
  // Mobile stepper controls
  const adjustSpend = (delta) => {
    if (!spendInput) return;
    let current = Number(spendInput.value || 0);
    // derive step consistent with recalc tiers
    let step;
    if (current >= 300000) step = 100000;
    else if (current >= 100000) step = 50000;
    else step = 10000;
    current = Math.max(0, Math.min(500000, current + delta * step));
    spendInput.value = String(current);
    recalc();
  };
  if (stepperDec) stepperDec.addEventListener('click', () => adjustSpend(-1));
  if (stepperInc) stepperInc.addEventListener('click', () => adjustSpend(1));
  // Do not attach input handlers when readonly; update programmatically via recalc()
  if (calculator && toggle) {
    toggle.addEventListener('click', (e) => {
      const btn = e.target.closest('.toggle-btn');
      if (!btn) return;
      toggle.querySelectorAll('.toggle-btn').forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });
      calculator.setAttribute('data-mode', btn.dataset.mode || 'business');
      recalc();
    });
  }

  // initial calculation
  recalc();
});


