/* ===========================
   WANDER – SCRIPT.JS
   =========================== */

/* ---------- NAVBAR SCROLL BEHAVIOR ---------- */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();


/* ---------- HAMBURGER MENU ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});


/* ---------- SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ---------- INTERSECTION OBSERVER – FADE IN ---------- */
const fadeElements = document.querySelectorAll('.animate-fade-up');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

fadeElements.forEach(el => observer.observe(el));


/* ---------- FAQ ACCORDION ---------- */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all others
    faqItems.forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', false);
        other.querySelector('.faq-answer').classList.remove('open');
      }
    });

    // Toggle current
    item.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', !isOpen);
    answer.classList.toggle('open', !isOpen);
  });
});


/* ---------- PRICING BILLING TOGGLE ---------- */
const billingToggle = document.getElementById('billing-toggle');
const toggleMonthly = document.getElementById('toggle-monthly');
const toggleAnnual = document.getElementById('toggle-annual');
const priceAmounts = document.querySelectorAll('.price-amount');

let isAnnual = false;

billingToggle.addEventListener('click', () => {
  isAnnual = !isAnnual;
  billingToggle.classList.toggle('active', isAnnual);
  toggleMonthly.classList.toggle('active', !isAnnual);
  toggleAnnual.classList.toggle('active', isAnnual);

  priceAmounts.forEach(el => {
    const newPrice = isAnnual ? el.dataset.annual : el.dataset.monthly;
    animatePrice(el, newPrice);
  });
});

function animatePrice(el, newValue) {
  el.style.transform = 'translateY(-8px)';
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = newValue;
    el.style.transform = 'translateY(8px)';
    requestAnimationFrame(() => {
      el.style.transition = 'transform .25s ease, opacity .25s ease';
      el.style.transform = 'translateY(0)';
      el.style.opacity = '1';
    });
  }, 150);
}


/* ---------- PHONE BAR CHART ANIMATION ---------- */
function animateChartBars() {
  const bars = document.querySelectorAll('.bar');
  bars.forEach((bar, i) => {
    const targetHeight = bar.style.height;
    bar.style.height = '0%';
    setTimeout(() => {
      bar.style.transition = 'height 0.8s cubic-bezier(.4,0,.2,1)';
      bar.style.height = targetHeight;
    }, 300 + i * 80);
  });
}

// Trigger chart animation when phone comes into view
const phoneSection = document.querySelector('.hero-phone');
if (phoneSection) {
  const phoneObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(animateChartBars, 600);
        phoneObserver.disconnect();
      }
    },
    { threshold: 0.3 }
  );
  phoneObserver.observe(phoneSection);
}


/* ---------- ANIMATED RING FILL ---------- */
function animateRing() {
  const circle = document.querySelector('.ring-svg circle:last-child');
  if (!circle) return;
  circle.style.strokeDashoffset = '251';
  setTimeout(() => {
    circle.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)';
    circle.style.strokeDashoffset = '70';
  }, 500);
}

const ringSection = document.querySelector('.app-ring-container');
if (ringSection) {
  const ringObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateRing();
        ringObserver.disconnect();
      }
    },
    { threshold: 0.5 }
  );
  ringObserver.observe(ringSection);
}


/* ---------- ANIMATED COUNTER (Trust Bar) ---------- */
function animateCounter(el, target, duration = 1800) {
  const isDecimal = target.toString().includes('.');
  const isPercent = target.toString().includes('%');
  const isStar = target.toString().includes('/5');
  const numericTarget = parseFloat(target);
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    let current = numericTarget * eased;

    if (isDecimal) {
      el.textContent = current.toFixed(1) + (isStar ? '/5' : '');
    } else {
      el.textContent = Math.round(current).toLocaleString() + (isPercent ? '%' : '');
    }

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const trustNumbers = document.querySelectorAll('.trust-number');
const trustObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      trustNumbers.forEach(el => {
        const text = el.textContent;
        if (text === '500K+') {
          let count = 0;
          const interval = setInterval(() => {
            count += 10;
            el.textContent = count + 'K+';
            if (count >= 500) { el.textContent = '500K+'; clearInterval(interval); }
          }, 4);
        } else if (text === '2.4B') {
          let count = 0;
          const interval = setInterval(() => {
            count += 0.05;
            el.textContent = count.toFixed(1) + 'B';
            if (count >= 2.4) { el.textContent = '2.4B'; clearInterval(interval); }
          }, 30);
        } else if (text === '4.9/5') {
          let count = 0;
          const interval = setInterval(() => {
            count += 0.1;
            el.textContent = count.toFixed(1) + '/5';
            if (count >= 4.9) { el.textContent = '4.9/5'; clearInterval(interval); }
          }, 20);
        } else if (text === '98%') {
          let count = 0;
          const interval = setInterval(() => {
            count += 2;
            el.textContent = count + '%';
            if (count >= 98) { el.textContent = '98%'; clearInterval(interval); }
          }, 20);
        }
      });
      trustObserver.disconnect();
    }
  },
  { threshold: 0.5 }
);

const trustBar = document.querySelector('.trust-bar');
if (trustBar) trustObserver.observe(trustBar);


/* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

function highlightActiveNav() {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.style.fontWeight = (scrollPos >= top && scrollPos < bottom) ? '700' : '';
    }
  });
}

window.addEventListener('scroll', highlightActiveNav, { passive: true });


/* ---------- FEATURE CARDS HOVER SPARKLE EFFECT ---------- */
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(34,197,94,.04) 0%, white 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});


/* ---------- SCROLL TO TOP BUTTON ---------- */
const scrollBtn = document.createElement('button');
scrollBtn.className = 'scroll-top-btn';
scrollBtn.setAttribute('aria-label', 'Scroll to top');
scrollBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="20" height="20"><polyline points="18,15 12,9 6,15"/></svg>`;
scrollBtn.style.cssText = `
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #16a34a, #0284c7);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(22,163,74,.4);
  display: grid;
  place-items: center;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity .3s ease, transform .3s ease;
  z-index: 999;
`;
document.body.appendChild(scrollBtn);

scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

window.addEventListener('scroll', () => {
  const show = window.scrollY > 400;
  scrollBtn.style.opacity = show ? '1' : '0';
  scrollBtn.style.transform = show ? 'translateY(0)' : 'translateY(16px)';
  scrollBtn.style.pointerEvents = show ? 'auto' : 'none';
}, { passive: true });


/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // Trigger entrance animation for elements already in view
  setTimeout(() => {
    document.querySelectorAll('.animate-fade-up').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.classList.add('visible');
    });
  }, 100);
});
