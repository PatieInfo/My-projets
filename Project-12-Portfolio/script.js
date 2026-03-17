/* ═══════════════════════════════════════════════
   NAVBAR — scroll effect & active link highlight
═══════════════════════════════════════════════ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  // add background once user scrolls past 60px
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  // highlight the active nav link based on scroll position
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar(); // run once on load

/* ═══════════════════════════════════════════════
   MOBILE NAV TOGGLE
═══════════════════════════════════════════════ */
const navToggle   = document.getElementById('navToggle');
const navLinksEl  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinksEl.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

// close mobile menu when any link is clicked
navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

/* ═══════════════════════════════════════════════
   SMOOTH SCROLL — override default for anchors
═══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 64; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ═══════════════════════════════════════════════
   INTERSECTION OBSERVER — reveal on scroll
═══════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // once revealed, no need to watch anymore
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════
   SKILL BAR ANIMATION
   Triggered when the skill card enters the viewport
═══════════════════════════════════════════════ */
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) {
          fill.style.width = fill.dataset.width + '%';
        }
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll('.skill-card').forEach(card => barObserver.observe(card));

/* ═══════════════════════════════════════════════
   FOOTER YEAR
═══════════════════════════════════════════════ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ═══════════════════════════════════════════════
   CARD TILT — subtle 3-D tilt on mouse move
═══════════════════════════════════════════════ */
function addTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const tiltX = -dy * 6;
      const tiltY =  dx * 6;
      card.style.transform = `translateY(-5px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// only apply tilt on non-touch devices
if (!('ontouchstart' in window)) {
  addTilt('.card');
  addTilt('.skill-card');
  addTilt('.contact-card');
}
