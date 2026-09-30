/* ============================================================
   ZAIKCHI PORTFOLIO — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── LOADER ─────────────────────────────────────── */
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loaderFill');

  setTimeout(() => { loaderFill.style.width = '100%'; }, 100);

  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 2200);

  document.body.style.overflow = 'hidden';

  /* ── LENIS SMOOTH SCROLL (Calm, Slower Inertia) ── */
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 2.2, // Slower, deeper deceleration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential smoothing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.5, // Reduced from 0.75 for a significantly calmer, slower scroll pace
      touchMultiplier: 1.0,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth anchor scrolls via Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || href === '') return;
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl, { offset: 0, duration: 2.0 });
        }
      });
    });
  }

  /* ── CUSTOM CURSOR ───────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  })();

  /* ── NAV SCROLL ──────────────────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── MOBILE MENU ─────────────────────────────────── */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');

  menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuBtn.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── SCROLL REVEAL ───────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.editorial-card, .work-intro-statement, .about-grid, .service-item, .section-header, .contact-inner, .about-stats, .skill-tag'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el, i) => {
    el.dataset.delay = (i % 4) * 80;
    observer.observe(el);
  });

  /* ── PARALLAX HERO IMAGE (Logo Z Turun saat Scroll ke Bawah) ── */
  const heroImg = document.getElementById('heroImg');
  function updateHeroParallax() {
    if (heroImg) {
      const scrollY = window.scrollY;
      heroImg.style.transform = `translate3d(0, ${(scrollY * 0.15).toFixed(1)}px, 0)`;
    }
  }

  /* ── SERVICE ITEM — expand on click (mobile) ─────── */
  const serviceItems = document.querySelectorAll('.service-item');
  serviceItems.forEach(item => {
    item.addEventListener('click', () => {
      // On touch devices, toggle hover effect
      item.classList.toggle('active-touch');
    });
  });

  /* ── SMOOTH SCROLL BACK TO TOP ───────────────────── */
  const backTop = document.getElementById('back-to-top');
  if (backTop) {
    backTop.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.8 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /* ── MAGNETIC EFFECT ON CTA ──────────────────────── */
  function makeMagnetic(el, strength = 0.3) {
    if (!el) return;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0)';
      el.style.transition = 'transform .5s cubic-bezier(0.16,1,0.3,1)';
    });
    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform .15s';
    });
  }

  makeMagnetic(document.getElementById('hero-cta'));
  makeMagnetic(document.getElementById('cv-link'));

  /* ── TEXT SPLIT ANIMATION ON HERO TITLE ──────────── */
  // Extra shimmer pass over hero title
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.addEventListener('mouseenter', () => {
      heroTitle.style.background = 'linear-gradient(90deg, #f0ede8 0%, #c8ff00 50%, #f0ede8 100%)';
      heroTitle.style.backgroundSize = '200% auto';
      heroTitle.style.webkitBackgroundClip = 'text';
      heroTitle.style.webkitTextFillColor = 'transparent';
      heroTitle.style.backgroundClip = 'text';
      heroTitle.style.animation = 'shimmer 1.2s linear forwards';
    });
    heroTitle.addEventListener('mouseleave', () => {
      heroTitle.style.background = '';
      heroTitle.style.webkitBackgroundClip = '';
      heroTitle.style.webkitTextFillColor = '';
      heroTitle.style.backgroundClip = '';
      heroTitle.style.animation = '';
    });
  }

  /* ── ACTIVE NAV LINK ON SCROLL ───────────────────── */
  const sections = ['hero', 'manifesto', 'work', 'about', 'services', 'contact'];
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 200) current = id;
    });

    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current
        ? 'var(--fg)'
        : '';
    });
  }, { passive: true });

  /* ── NOTHIN EDITORIAL MANIFESTO SHRINK ANIMATION ─── */
  const manifestoTrack = document.getElementById('manifestoTrack');
  const manifestoHeader = document.getElementById('manifestoHeader');
  const manifestoTextCol = document.getElementById('manifestoTextCol');
  const manifestoMediaWrapper = document.getElementById('manifestoMediaWrapper');

  function updateManifesto() {
    if (!manifestoTrack || !manifestoHeader || !manifestoTextCol || !manifestoMediaWrapper) return;

    const rect = manifestoTrack.getBoundingClientRect();
    const vh = window.innerHeight;
    const scrollDist = manifestoTrack.offsetHeight - vh;

    // Toggle navbar light theme while over the white manifesto section
    if (nav) {
      const isOverManifesto = rect.top <= 65 && rect.bottom >= 65;
      nav.classList.toggle('light-theme', isOverManifesto);
    }

    if (rect.bottom < -100 || rect.top > vh + 100) return;

    const currentScroll = -rect.top;
    const rawProgress = scrollDist > 0 ? currentScroll / scrollDist : 0;
    const progress = Math.max(0, Math.min(1, rawProgress));

    const isMobile = window.innerWidth <= 900;
    if (isMobile) {
      manifestoHeader.style.opacity = '1';
      manifestoHeader.style.transform = 'none';
      manifestoTextCol.style.opacity = '1';
      manifestoTextCol.style.transform = 'none';
      manifestoMediaWrapper.style.width = '100%';
      manifestoMediaWrapper.style.height = '38vh';
      return;
    }

    // Smooth cubic easing for scrub animation
    const ease = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    // 1. Headline floats up & fades out early (0 to 0.35)
    const headP = Math.min(1, progress / 0.35);
    manifestoHeader.style.opacity = (1 - headP).toFixed(3);
    manifestoHeader.style.transform = `translate3d(0, ${(-headP * 70).toFixed(1)}px, 0)`;

    // 2. Editorial Text on left emerges smoothly (0.20 to 0.58)
    const textP = Math.max(0, Math.min(1, (progress - 0.2) / 0.38));
    manifestoTextCol.style.opacity = textP.toFixed(3);
    manifestoTextCol.style.transform = `translate3d(0, ${((1 - textP) * 35).toFixed(1)}px, 0)`;
    manifestoTextCol.style.pointerEvents = textP > 0.5 ? 'auto' : 'none';

    // 3. Media box shrinks from 100% width down to 48% (docked on right)
    const targetWidthPercent = 48;
    const currentWidth = 100 - (100 - targetWidthPercent) * ease;

    const startVh = 52;
    const targetVh = 38;
    const currentVh = startVh - (startVh - targetVh) * ease;

    manifestoMediaWrapper.style.width = `${currentWidth.toFixed(2)}%`;
    manifestoMediaWrapper.style.height = `${currentVh.toFixed(2)}vh`;
  }

  /* ── 3 EDITORIAL PROJECTS PARALLAX (Dual-Speed: Frame 1x, Gambar 2x) ── */
  const projectCards = document.querySelectorAll('.editorial-card');
  const frameSpeeds = [0.10, 0.15, 0.12]; // Kecepatan Frame (Kecepatan 1)

  function updateProjectParallax() {
    const isMobile = window.innerWidth <= 900;

    projectCards.forEach((card, index) => {
      const cardLink = card.querySelector('.editorial-card-link');
      const img = card.querySelector('.editorial-img');
      if (!cardLink) return;

      if (isMobile) {
        cardLink.style.transform = '';
        if (img) img.style.transform = '';
        return;
      }

      const vh = window.innerHeight;
      const rect = card.getBoundingClientRect();

      // Hitung hanya saat kartu masuk atau mendekati area pandang (viewport)
      if (rect.top < vh + 150 && rect.bottom > -250) {
        const distFromBottom = Math.max(0, vh - rect.top);
        const fSpeed = frameSpeeds[index] || 0.10;

        // 1. Gerakan Frame (Kecepatan 1 — bergerak naik saat scroll ke bawah)
        const frameShiftY = -distFromBottom * fSpeed;
        cardLink.style.transform = `translate3d(0, ${frameShiftY.toFixed(1)}px, 0)`;

        // 2. Gerakan Gambar di dalam Frame (Kecepatan 2 — bergerak naik 2x lebih cepat)
        if (img) {
          const totalDist = vh + rect.height;
          const currentDist = vh - rect.top;
          const progress = Math.max(0, Math.min(1, currentDist / totalDist));

          // Gambar meluncur naik dari bawah ke atas di dalam bingkainya (efek ilusi kedalaman)
          const maxInnerShift = 65;
          const imgInnerShiftY = (0.5 - progress) * (maxInnerShift * 2);
          img.style.transform = `translate3d(0, ${imgInnerShiftY.toFixed(1)}px, 0)`;
        }
      } else if (rect.top >= vh + 150) {
        cardLink.style.transform = 'translate3d(0, 0, 0)';
        if (img) img.style.transform = 'translate3d(0, 0, 0)';
      }
    });
  }

  function handleAllScrolls() {
    updateHeroParallax();
    updateManifesto();
    updateProjectParallax();
  }

  if (lenis) {
    lenis.on('scroll', handleAllScrolls);
  }

  let parallaxTicking = false;
  window.addEventListener('scroll', () => {
    if (!parallaxTicking) {
      requestAnimationFrame(() => {
        handleAllScrolls();
        parallaxTicking = false;
      });
      parallaxTicking = true;
    }
  }, { passive: true });

  handleAllScrolls();
  window.addEventListener('resize', handleAllScrolls, { passive: true });

});

/* ── SHIMMER KEYFRAME (injected) ─────────────────────── */
const style = document.createElement('style');
style.textContent = `
@keyframes shimmer {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}
`;
document.head.appendChild(style);
