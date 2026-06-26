/* =============================================
   SERAFIX® — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initCounters();
  initActiveNav();
});

/* =============================================
   NAVBAR — Transparent → Scrolled
   ============================================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function updateNav() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('transparent');
    } else {
      navbar.classList.remove('scrolled');
      navbar.classList.add('transparent');
    }
  }

  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });
}

/* =============================================
   MOBILE MENU
   ============================================= */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* =============================================
   SCROLL ANIMATIONS
   ============================================= */
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* =============================================
   ANIMATED COUNTERS
   ============================================= */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.counter, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();

  function update(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* =============================================
   ACTIVE NAV LINK
   ============================================= */
function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .nav-mobile-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === path || (path === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
}

/* =============================================
   SMOOTH SCROLL for anchor links
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* =============================================
   FORM SUBMISSION (Static — show success)
   ============================================= */
document.querySelectorAll('form[data-form]').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '&#10003; Message Sent!';
    btn.disabled = true;
    btn.style.background = '#16a34a';

    // Show success message
    let msg = form.querySelector('.form-success');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'form-success';
      msg.style.cssText = `
        margin-top: 16px;
        padding: 16px 20px;
        background: rgba(22,163,74,0.08);
        border: 1px solid rgba(22,163,74,0.3);
        border-radius: 8px;
        color: #16a34a;
        font-size: 0.9rem;
        font-weight: 500;
      `;
      form.appendChild(msg);
    }
    msg.textContent = 'Thank you! Our team will contact you within 24 hours.';
    msg.style.display = 'block';

    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style.background = '';
      form.reset();
      msg.style.display = 'none';
    }, 4000);
  });
});

/* =============================================
   PRODUCT FILTER (products page)
   ============================================= */
function initProductFilter() {
  const buttons = document.querySelectorAll('[data-filter-btn]');
  const items   = document.querySelectorAll('[data-filter-item]');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filterBtn;

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      items.forEach(item => {
        const cats = item.dataset.filterItem.split(',');
        if (filter === 'all' || cats.includes(filter)) {
          item.style.display = '';
          item.style.animation = 'fadeIn 0.4s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initProductFilter);
