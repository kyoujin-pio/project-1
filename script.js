/* ============================================================
   script.js — Mark Piolo Morente Custom Portfolio
   ============================================================ */
'use strict';

/* ============================================================
   PARTICLE SYSTEM
   ============================================================ */
(function () {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: null, y: null };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initParticles(); });

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function initParticles() {
    const count = Math.floor((W * H) / 18000);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: rand(0, W), y: rand(0, H),
        vx: rand(-0.2, 0.2), vy: rand(-0.2, 0.2),
        r: rand(1, 2.5),
        a: rand(0.1, 0.5),
      });
    }
  }
  initParticles();

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,107,43,${p.a})`;
      ctx.fill();

      // Connect nearby particles
      particles.forEach(q => {
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(255,107,43,${0.06 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      // Attract toward mouse
      if (mouse.x !== null) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.x += dx * 0.012;
          p.y += dy * 0.012;
        }
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(function () {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animateCursor() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Ring expand on interactive elements
  const hover = document.querySelectorAll('a, button, .tilt-card, input, textarea');
  hover.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
})();

/* ============================================================
   3D TILT ON CARDS
   ============================================================ */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / (rect.width  / 2);
    const dy    = (e.clientY - cy) / (rect.height / 2);
    const tiltX = dy * -6;
    const tiltY = dx *  6;
    card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.015)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ============================================================
   TYPED TEXT
   ============================================================ */
const typedEl = document.getElementById('typedText');
const phrases = [
  'Aspiring IT Professional',
  'Web Developer',
  'BSIT Student — NEUST',
  'Open to OJT',
];
let pi = 0, ci = 0, del = false;

function type() {
  const cur = phrases[pi];
  typedEl.textContent = del ? cur.slice(0, ci - 1) : cur.slice(0, ci + 1);
  del ? ci-- : ci++;
  let spd = del ? 45 : 85;
  if (!del && ci === cur.length)   { spd = 2200; del = true; }
  else if (del && ci === 0)        { del = false; pi = (pi + 1) % phrases.length; spd = 350; }
  setTimeout(type, spd);
}
type();

/* ============================================================
   NAVBAR — SCROLL & ACTIVE LINK
   ============================================================ */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function onScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  // Back to top
  const btn = document.getElementById('backToTop');
  if (btn) btn.classList.toggle('visible', window.scrollY > 500);

  // Active nav
  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - navbar.offsetHeight - 24) cur = s.id;
  });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ============================================================
   MOBILE HAMBURGER
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});
navMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ============================================================
   INTERSECTION OBSERVER — REVEAL & SKILL BARS
   ============================================================ */
const io = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.tl-item, .bento-card, .skill-group, .project-item, .cert-card, .contact-link, .contact-form, .coming-soon').forEach(el => {
  el.classList.add('reveal-item');
  io.observe(el);
});

// Skill bars
const skillIo = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.sk-fill').forEach(b => { b.style.width = b.dataset.w + '%'; });
      skillIo.unobserve(e.target);
    }
  }),
  { threshold: 0.2 }
);
document.querySelectorAll('.skill-group').forEach(g => skillIo.observe(g));

/* ============================================================
   SCREENSHOT GALLERY
   ============================================================ */
window.slideGallery = function (galleryId, dotsId, dir) {
  const gallery = document.getElementById(galleryId);
  const dotsEl  = document.getElementById(dotsId);
  if (!gallery) return;

  const slides = gallery.querySelectorAll('.gallery-slide');
  const dots   = dotsEl ? dotsEl.querySelectorAll('.gd') : [];
  let active   = [...slides].findIndex(s => s.classList.contains('active'));
  const next   = (active + dir + slides.length) % slides.length;

  slides[active].classList.remove('active');
  slides[next].classList.add('active');
  dots.forEach((d, i) => d.classList.toggle('active', i === next));
};

/* ============================================================
   CONTACT FORM — MAILTO FALLBACK
   ============================================================ */
const form     = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

form.addEventListener('submit', e => {
  e.preventDefault();
  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const subject = form.subject.value.trim() || 'Portfolio Contact';
  const message = form.message.value.trim();

  if (!name || !email || !message) { showNote('Please fill in all required fields.', 'error'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showNote('Please enter a valid email.', 'error'); return; }

  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  window.location.href = `mailto:morentemarkypiolo@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  showNote('Opening your email client… Thank you!', 'success');
  form.reset();
});

function showNote(msg, type) {
  formNote.textContent = msg;
  formNote.className   = 'form-note ' + type;
  setTimeout(() => { formNote.textContent = ''; formNote.className = 'form-note'; }, 6000);
}

/* ============================================================
   FOOTER YEAR & BACK TO TOP
   ============================================================ */
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ============================================================
   SMOOTH SCROLL FALLBACK
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
