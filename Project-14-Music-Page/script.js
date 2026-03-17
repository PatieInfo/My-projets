/* ============================================================
   Djembe — script.js
   Scroll animations, navbar behavior, mobile menu
   ============================================================ */

'use strict';

// ----------------------------- NAVBAR SCROLL
const navbar = document.getElementById('navbar');
const SCROLL_THRESHOLD = 50;

function handleNavbarScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
}
window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

// ----------------------------- ACTIVE NAV LINK
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// ----------------------------- HAMBURGER / MOBILE MENU
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a link is clicked
navLinksEl.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ----------------------------- INTERSECTION OBSERVER — SCROLL ANIMATIONS
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on sibling index within parent
      const siblings = Array.from(entry.target.parentElement.children);
      const index = siblings.indexOf(entry.target);
      const delay = Math.min(index * 80, 500);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// ----------------------------- SMOOTH SCROLL FOR ANCHOR LINKS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top: targetPos, behavior: 'smooth' });
  });
});

// ----------------------------- PLAY BUTTON RIPPLE EFFECT
document.querySelectorAll('.play-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    // Visual feedback: brief scale pulse
    this.style.transform = 'scale(0.9)';
    setTimeout(() => { this.style.transform = ''; }, 150);

    // Toggle icon
    const isPlaying = this.textContent === '⏸';
    this.textContent = isPlaying ? '▶' : '⏸';
    this.style.background = isPlaying ? 'var(--blue)' : '#22c55e';

    // Stop other playing buttons
    if (!isPlaying) {
      document.querySelectorAll('.play-btn').forEach(other => {
        if (other !== this) {
          other.textContent = '▶';
          other.style.background = '';
        }
      });
    }
  });
});

// ----------------------------- CHART ROW HOVER INDICATOR
document.querySelectorAll('.chart-row').forEach(row => {
  row.addEventListener('mouseenter', function() {
    const rankEl = this.querySelector('.chart-rank');
    if (rankEl) rankEl.style.color = 'var(--blue-light)';
  });
  row.addEventListener('mouseleave', function() {
    const rankEl = this.querySelector('.chart-rank');
    if (rankEl) rankEl.style.color = '';
  });
});

// ----------------------------- FOLLOW BUTTON TOGGLE
document.querySelectorAll('.artist-card .btn').forEach(btn => {
  if (btn.textContent.trim() === 'Follow') {
    btn.addEventListener('click', function() {
      const isFollowing = this.dataset.following === 'true';
      if (isFollowing) {
        this.textContent = 'Follow';
        this.dataset.following = 'false';
        this.classList.remove('btn--primary');
        this.classList.add('btn--outline');
        this.style.background = '';
      } else {
        this.textContent = '✓ Following';
        this.dataset.following = 'true';
        this.classList.remove('btn--outline');
        this.classList.add('btn--primary');
      }
    });
  }
});
// Also hero featured card follow button
const heroFollowBtn = document.querySelector('.featured-card .btn--primary');
if (heroFollowBtn) {
  heroFollowBtn.addEventListener('click', function() {
    const following = this.dataset.following === 'true';
    this.textContent = following ? 'Follow Artist' : '✓ Following';
    this.dataset.following = following ? 'false' : 'true';
  });
}

// ----------------------------- TICKET BUTTON FEEDBACK
document.querySelectorAll('.event-card .btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const original = this.textContent;
    this.textContent = '✓ Added to Cart';
    this.disabled = true;
    this.style.opacity = '0.8';
    setTimeout(() => {
      this.textContent = original;
      this.disabled = false;
      this.style.opacity = '';
    }, 2500);
  });
});

// ----------------------------- READ MORE LINK TRACKING
document.querySelectorAll('.news-card__link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    // Visual feedback
    const original = this.textContent;
    this.textContent = 'Loading story...';
    setTimeout(() => { this.textContent = original; }, 1000);
  });
});

// ----------------------------- PARALLAX HERO ORBS (subtle)
const orb1 = document.querySelector('.hero-orb--1');
const orb2 = document.querySelector('.hero-orb--2');

function handleParallax() {
  if (!orb1 || !orb2) return;
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight) {
    orb1.style.transform = `translateY(${scrollY * 0.12}px)`;
    orb2.style.transform = `translateY(${scrollY * -0.08}px)`;
  }
}
window.addEventListener('scroll', handleParallax, { passive: true });

// ----------------------------- GENRE PILL FILTER (visual feedback)
document.querySelectorAll('.genre-pill').forEach(pill => {
  pill.addEventListener('click', function() {
    document.querySelectorAll('.genre-pill').forEach(p => {
      p.style.borderColor = '';
      p.style.color = '';
      p.style.background = '';
    });
    this.style.borderColor = 'var(--blue)';
    this.style.color = 'var(--blue-light)';
    this.style.background = 'rgba(0,104,168,0.1)';
  });
});

// ----------------------------- NUMBERS COUNTER ANIMATION
function animateCounter(el, target, suffix = '') {
  const duration = 1500;
  const startTime = performance.now();
  const startVal = 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Counter observer for stats
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const text = el.textContent.trim();

    // Parse numeric value from stat
    const match = text.match(/^(\d+\.?\d*)(M|B|k)?/);
    if (match) {
      const num = parseFloat(match[1]);
      const unit = match[2] || '';
      animateCounter(el, num, unit);
    }
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat__num, .mini-stat > span').forEach(el => {
  statObserver.observe(el);
});

// ----------------------------- STREAMING LINK FEEDBACK
document.querySelectorAll('.stream-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const platform = this.classList.contains('stream-btn--spotify') ? 'Spotify'
                   : this.classList.contains('stream-btn--apple')   ? 'Apple Music'
                   : 'YouTube';

    // Micro-toast feedback
    showToast(`Opening on ${platform}...`);
  });
});

function showToast(message) {
  // Remove existing toasts
  document.querySelectorAll('.djembe-toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'djembe-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--card);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 500;
    z-index: 9999;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    pointer-events: none;
    font-family: var(--font);
  `;
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  // Animate out
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

// ----------------------------- BACK TO TOP (scroll beyond 600px)
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '↑';
backToTopBtn.setAttribute('aria-label', 'Back to top');
backToTopBtn.style.cssText = `
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 44px; height: 44px;
  background: var(--blue);
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 999;
  box-shadow: 0 4px 20px var(--blue-glow);
  transition: all 0.3s ease;
  opacity: 0;
  transform: scale(0.8);
  pointer-events: none;
  font-family: var(--font);
  display: flex; align-items: center; justify-content: center;
`;
document.body.appendChild(backToTopBtn);

backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
backToTopBtn.addEventListener('mouseenter', () => backToTopBtn.style.background = 'var(--blue-light)');
backToTopBtn.addEventListener('mouseleave', () => backToTopBtn.style.background = 'var(--blue)');

window.addEventListener('scroll', () => {
  const show = window.scrollY > 600;
  backToTopBtn.style.opacity = show ? '1' : '0';
  backToTopBtn.style.transform = show ? 'scale(1)' : 'scale(0.8)';
  backToTopBtn.style.pointerEvents = show ? 'all' : 'none';
}, { passive: true });

// ----------------------------- INIT LOG
console.log('%cDjembe 🥁', 'color:#C8A84B;font-size:20px;font-weight:900;');
console.log('%cThe Rhythm of African Music Worldwide', 'color:#0068A8;font-size:12px;');
