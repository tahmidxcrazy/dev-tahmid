/* ============================================
   TAHMID PORTFOLIO — ANIMATIONS & INTERACTIVITY
   ============================================ */

/* ─── CUSTOM CURSOR ─── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

/* Cursor scale on hover */
document.querySelectorAll('a, button, .pricing-btn, .social-btn, .about-card, .skill-card, .pricing-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    cursor.style.background = 'rgba(79,70,229,0.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.background = '#4F46E5';
  });
});

/* ─── PARTICLE CANVAS ─── */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 2.5 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '79,70,229' : '6,182,212';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(79,70,229,${0.12 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ─── NAVBAR SCROLL ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}

/* ─── HAMBURGER ─── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});

/* ─── TYPEWRITER EFFECT ─── */
const words = [
  'Web Developer',
  'Creative Coder',
  'UI Enthusiast',
  'Problem Solver',
  'Tech Explorer'
];
let wIndex = 0, cIndex = 0, deleting = false;
const tw = document.getElementById('typewriter');

function typeWrite() {
  const word = words[wIndex];
  if (!deleting) {
    tw.textContent = word.slice(0, ++cIndex);
    if (cIndex === word.length) { deleting = true; setTimeout(typeWrite, 1800); return; }
    setTimeout(typeWrite, 90);
  } else {
    tw.textContent = word.slice(0, --cIndex);
    if (cIndex === 0) { deleting = false; wIndex = (wIndex + 1) % words.length; setTimeout(typeWrite, 400); return; }
    setTimeout(typeWrite, 45);
  }
}
typeWrite();

/* ─── SCROLL REVEAL ─── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObs.observe(el));

/* ─── SKILL BARS ─── */
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.skill-fill');
      const bar  = entry.target.querySelector('.skill-bar');
      if (fill && bar) {
        const target = bar.dataset.width;
        setTimeout(() => { fill.style.width = target + '%'; }, 200);
      }
      skillObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.skill-card').forEach(card => skillObs.observe(card));

/* ─── COUNTER ANIMATION ─── */
function animateCount(el, target, duration = 1800) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-number').forEach(el => {
        animateCount(el, parseInt(el.dataset.count));
      });
      counterObs.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObs.observe(heroStats);

/* ─── MAGNETIC BUTTONS ─── */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
    setTimeout(() => { btn.style.transition = ''; }, 500);
  });
});

/* ─── PRICING TOGGLE ─── */
const toggle       = document.getElementById('billingToggle');
const monthlyLabel = document.getElementById('monthlyLabel');
const yearlyLabel  = document.getElementById('yearlyLabel');
const monthlyPrices = document.querySelectorAll('.monthly-price');
const yearlyPrices  = document.querySelectorAll('.yearly-price');

toggle.addEventListener('change', () => {
  const yearly = toggle.checked;
  monthlyPrices.forEach(el => el.style.display = yearly ? 'none' : 'inline');
  yearlyPrices.forEach(el  => el.style.display = yearly ? 'inline' : 'none');
  monthlyLabel.classList.toggle('active-label', !yearly);
  yearlyLabel.classList.toggle('active-label', yearly);
});

/* ─── CONTACT FORM — Web3Forms → tahmid.taysir1530@gmail.com ─── */
const form      = document.getElementById('contactForm');
const success   = document.getElementById('formSuccess');
const errorBox  = document.getElementById('formError');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btnLabel = submitBtn.querySelector('span');
  const accessKey = document.getElementById('web3AccessKey').value;

  // Guard: remind user to add their key
  if (!accessKey || accessKey === 'YOUR_ACCESS_KEY') {
    errorBox.textContent = '⚠️ Please add your Web3Forms access key. See setup instructions.';
    errorBox.style.display = 'block';
    setTimeout(() => { errorBox.style.display = 'none'; }, 6000);
    return;
  }

  // Loading state
  btnLabel.textContent = 'Sending…';
  submitBtn.disabled   = true;
  success.style.display  = 'none';
  errorBox.style.display = 'none';

  try {
    const formData = {
      access_key:  accessKey,
      name:        document.getElementById('nameInput').value.trim(),
      email:       document.getElementById('emailInput').value.trim(),
      subject:     document.getElementById('subjectInput').value.trim(),
      message:     document.getElementById('messageInput').value.trim(),
      botcheck:    ''
    };

    const res = await fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify(formData)
    });

    const result = await res.json();

    if (res.ok && result.success) {
      success.textContent   = '✅ Message sent! Tahmid will reply soon.';
      success.style.display = 'block';
      form.reset();
      setTimeout(() => { success.style.display = 'none'; }, 7000);
    } else {
      throw new Error(result.message || 'Submission failed');
    }
  } catch (err) {
    errorBox.textContent   = `❌ Error: ${err.message}. Try emailing tahmid.taysir1530@gmail.com directly.`;
    errorBox.style.display = 'block';
    setTimeout(() => { errorBox.style.display = 'none'; }, 8000);
  } finally {
    btnLabel.textContent = 'Send Message';
    submitBtn.disabled   = false;
  }
});

/* ─── SMOOTH NAV SCROLL (close mobile menu) ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ─── NAV CTA SCROLL ─── */
document.getElementById('navCta').addEventListener('click', () => {
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
});

/* ─── PRICING CARD TILT EFFECT ─── */
document.querySelectorAll('.pricing-card:not(.featured), .about-card, .skill-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
    card.style.transform = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
    card.style.transformStyle = 'preserve-3d';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.5s cubic-bezier(0.4,0,0.2,1)';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

/* ─── MOBILE NAV STYLE ─── */
const style = document.createElement('style');
style.textContent = `
  @media (max-width: 768px) {
    #navLinks {
      position: fixed;
      top: 0; right: -100%;
      width: 75vw; max-width: 320px;
      height: 100vh;
      background: rgba(255,255,255,0.97);
      backdrop-filter: blur(20px);
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1.5rem;
      transition: right 0.4s cubic-bezier(0.4,0,0.2,1);
      display: flex !important;
      box-shadow: -20px 0 60px rgba(0,0,0,0.1);
      z-index: 999;
    }
    #navLinks.open { right: 0; }
    .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  }
`;
document.head.appendChild(style);

/* ─── PAGE LOAD ANIMATION ─── */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
