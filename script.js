/* ============================================
   TAHMID PORTFOLIO — ANIMATIONS & INTERACTIVITY
   ============================================ */

/* ═══════════════════════════════════════════════
   FIREBASE AUTHENTICATION
   ═══════════════════════════════════════════════ */

// ── Firebase Config ──
// IMPORTANT: Replace with your own Firebase project config
// Go to https://console.firebase.google.com → Create Project → Web App → Copy config
const firebaseConfig = {
  apiKey: "AIzaSyCyXvn72cf9v_8niJPYopchV2sHB_PnLEQ",
  authDomain: "tahmid-portfolio-db9c0.firebaseapp.com",
  projectId: "tahmid-portfolio-db9c0",
  storageBucket: "tahmid-portfolio-db9c0.firebasestorage.app",
  messagingSenderId: "231961613791",
  appId: "1:231961613791:web:de49930a42d2853103e06a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// ── DOM Elements ──
const signInBtn       = document.getElementById('signInBtn');
const userProfile     = document.getElementById('userProfile');
const userAvatar      = document.getElementById('userAvatar');
const userNameEl      = document.getElementById('userName');
const signOutBtn      = document.getElementById('signOutBtn');
const loginGate       = document.getElementById('loginGate');
const gateSignInBtn   = document.getElementById('gateSignInBtn');
const authModal       = document.getElementById('authModal');
const closeAuthModal  = document.getElementById('closeAuthModal');
const googleSignInBtn = document.getElementById('googleSignInBtn');
const authForm        = document.getElementById('authForm');
const authTitle       = document.getElementById('authTitle');
const authSubmitText  = document.getElementById('authSubmitText');
const authSwitchText  = document.getElementById('authSwitchText');
const authSwitchBtn   = document.getElementById('authSwitchBtn');
const authErrorEl     = document.getElementById('authError');
const nameGroup       = document.getElementById('nameGroup');

let isRegisterMode = false;

// ── Open Auth Modal ──
function openAuthModal() {
  authModal.classList.add('active');
  authErrorEl.classList.remove('show');
}

function closeAuthModalFn() {
  authModal.classList.remove('active');
  authErrorEl.classList.remove('show');
}

signInBtn.addEventListener('click', openAuthModal);
gateSignInBtn.addEventListener('click', openAuthModal);
closeAuthModal.addEventListener('click', closeAuthModalFn);
authModal.addEventListener('click', (e) => {
  if (e.target === authModal) closeAuthModalFn();
});

// ── Toggle Register / Sign In ──
authSwitchBtn.addEventListener('click', () => {
  isRegisterMode = !isRegisterMode;
  authErrorEl.classList.remove('show');
  if (isRegisterMode) {
    authTitle.textContent      = 'Create Account';
    authSubmitText.textContent = 'Create Account';
    authSwitchText.textContent = 'Already have an account?';
    authSwitchBtn.textContent  = 'Sign in';
    nameGroup.style.display    = 'flex';
  } else {
    authTitle.textContent      = 'Sign In';
    authSubmitText.textContent = 'Sign In';
    authSwitchText.textContent = "Don't have an account?";
    authSwitchBtn.textContent  = 'Create one';
    nameGroup.style.display    = 'none';
  }
});

// ── Show Auth Error ──
function showAuthError(msg) {
  // Friendly error messages
  const errorMap = {
    'auth/email-already-in-use':  'This email is already registered. Try signing in.',
    'auth/invalid-email':         'Please enter a valid email address.',
    'auth/weak-password':         'Password must be at least 6 characters.',
    'auth/user-not-found':        'No account found with this email. Create one!',
    'auth/wrong-password':        'Incorrect password. Try again.',
    'auth/invalid-credential':    'Invalid email or password. Try again.',
    'auth/too-many-requests':     'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user':  'Sign-in popup was closed. Try again.',
    'auth/network-request-failed':'Network error. Check your internet connection.',
    'auth/api-key-not-valid':     '⚠️ Firebase API key not configured. See setup instructions below.',
  };
  const friendly = errorMap[msg] || msg;
  authErrorEl.textContent = friendly;
  authErrorEl.classList.add('show');
}

// ── Google Sign In ──
googleSignInBtn.addEventListener('click', async () => {
  try {
    await auth.signInWithPopup(googleProvider);
    closeAuthModalFn();
  } catch (err) {
    showAuthError(err.code || err.message);
  }
});

// ── Email/Password Submit ──
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email    = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  const name     = document.getElementById('authName').value.trim();

  authErrorEl.classList.remove('show');

  try {
    if (isRegisterMode) {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      if (name) {
        await cred.user.updateProfile({ displayName: name });
      }
    } else {
      await auth.signInWithEmailAndPassword(email, password);
    }
    closeAuthModalFn();
  } catch (err) {
    showAuthError(err.code || err.message);
  }
});

// ── Sign Out ──
signOutBtn.addEventListener('click', async () => {
  await auth.signOut();
});

// ── Auth State Listener ──
auth.onAuthStateChanged((user) => {
  if (user) {
    // Signed in
    signInBtn.style.display     = 'none';
    userProfile.style.display   = 'flex';

    const displayName = user.displayName || user.email.split('@')[0];
    userNameEl.textContent = displayName;

    if (user.photoURL) {
      userAvatar.src = user.photoURL;
    } else {
      // Generate letter avatar
      const letter = displayName.charAt(0).toUpperCase();
      userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(letter)}&background=4F46E5&color=fff&bold=true&size=64`;
    }

    // Unlock pricing
    loginGate.classList.add('hidden');

  } else {
    // Signed out
    signInBtn.style.display   = 'inline-flex';
    userProfile.style.display = 'none';

    // Lock pricing
    loginGate.classList.remove('hidden');
  }
});

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

/* ─── BINANCE PAY MODAL LOGIC ─── */
const paymentModal = document.getElementById('paymentModal');
const closeModalBtn = document.getElementById('closeModal');
const payBtns = document.querySelectorAll('.pay-btn');
const modalAmount = document.getElementById('modalAmount');
const modalPlan = document.getElementById('modalPlan');
const copyIdBtn = document.getElementById('copyIdBtn');
const binanceIdEl = document.getElementById('binanceId');
const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');

let currentSelectedPlan = '';

// Open Modal logic
payBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Check if toggle is set to yearly
    const isYearly = document.getElementById('billingToggle').checked;
    
    // Get corresponding price
    const card = btn.closest('.pricing-card');
    const monthlyPrice = card.querySelector('.monthly-price').textContent;
    const yearlyPrice = card.querySelector('.yearly-price').textContent;
    
    const amount = isYearly ? `$${yearlyPrice}` : `$${monthlyPrice}`;
    const plan = btn.dataset.plan;
    
    currentSelectedPlan = plan;
    modalAmount.textContent = amount;
    modalPlan.textContent = plan;
    
    paymentModal.classList.add('active');
  });
});

// Close Modal
closeModalBtn.addEventListener('click', () => {
  paymentModal.classList.remove('active');
});

// Close on outside click
paymentModal.addEventListener('click', (e) => {
  if (e.target === paymentModal) {
    paymentModal.classList.remove('active');
  }
});

// Copy ID to clipboard
copyIdBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(binanceIdEl.textContent).then(() => {
    copyIdBtn.textContent = 'Copied!';
    copyIdBtn.classList.add('copied');
    setTimeout(() => {
      copyIdBtn.textContent = 'Copy';
      copyIdBtn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    alert("Failed to copy. Please select and copy the ID manually.");
  });
});

// Confirm Payment -> Redirect to Contact Form
confirmPaymentBtn.addEventListener('click', () => {
  paymentModal.classList.remove('active');
  
  // Smooth scroll to contact section
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  
  // Pre-fill the subject line
  const subjectInput = document.getElementById('subjectInput');
  subjectInput.value = `Payment Verification: ${currentSelectedPlan} Plan via Binance Pay`;
  
  // Highlight the input briefly
  setTimeout(() => {
    subjectInput.focus();
    subjectInput.style.backgroundColor = 'var(--off-white)';
    setTimeout(() => {
      subjectInput.blur();
      subjectInput.style.backgroundColor = 'var(--white)';
    }, 800);
  }, 600);
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
