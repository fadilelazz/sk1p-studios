/* ==================================================================
   SK1P STUDIOS — SCRIPT.JS
   Handles: preloader, animated background canvas, scroll-reveal
   animations, mobile navigation, header scroll state, back-to-top.
   Pure vanilla JS — no dependencies.
   ================================================================== */

(() => {
  'use strict';

  /* ---------------------------------------------------------------
     1. PRELOADER
     Hides the preloader once the page has fully loaded, with a
     minimum display time so it doesn't just flash on fast connections.
     --------------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  const MIN_PRELOAD_MS = 600;
  const loadStart = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - loadStart;
    const remaining = Math.max(0, MIN_PRELOAD_MS - elapsed);
    setTimeout(() => {
      preloader.classList.add('loaded');
    }, remaining);
  });

  /* ---------------------------------------------------------------
     2. SET CURRENT YEAR IN FOOTER
     --------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------
     3. HEADER SCROLL STATE
     Adds a frosted background to the nav once the user scrolls down.
     --------------------------------------------------------------- */
  const header = document.getElementById('site-header');
  const SCROLL_THRESHOLD = 40;

  function updateHeaderState() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  /* ---------------------------------------------------------------
     4. MOBILE NAVIGATION TOGGLE
     --------------------------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  function closeNav() {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the mobile menu whenever a nav link is tapped
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  /* ---------------------------------------------------------------
     5. SCROLL-REVEAL ANIMATIONS (fade-in on scroll)
     Uses IntersectionObserver for performance — no scroll-jank.
     Any element with [data-aos] fades + slides in once visible.
     --------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll('[data-aos]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach((el, i) => {
      // Slight stagger for elements that share a section, based on
      // their order in the DOM, for a more orchestrated reveal.
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 90}ms`;
      revealObserver.observe(el);
    });
  } else {
    // Fallback: just show everything if IntersectionObserver is unsupported
    revealTargets.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------------------------------------------------------------
     6. BACK TO TOP BUTTON
     --------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('back-to-top');
  const SHOW_AFTER_PX = 480;

  function updateBackToTop() {
    backToTopBtn.classList.toggle('visible', window.scrollY > SHOW_AFTER_PX);
  }
  updateBackToTop();
  window.addEventListener('scroll', updateBackToTop, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------------
     7. ANIMATED BACKGROUND — WIREFRAME PARTICLE NETWORK
     A subtle canvas animation evoking a 3D viewport / point cloud,
     reinforcing the "3D asset pipeline" identity of the brand.
     Particles drift slowly and connect with thin lines when close
     enough together, like a sparse mesh.
     --------------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  let width, height;
  let animationFrameId;

  const ACCENT_RGB = '229, 57, 53';
  const LINE_RGB = '255, 255, 255';

  // Respect users who prefer reduced motion: render a static frame only.
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  function getParticleCount() {
    // Fewer particles on small screens to keep things fast & uncluttered
    const area = width * height;
    return Math.max(28, Math.min(90, Math.floor(area / 22000)));
  }

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    const count = getParticleCount();
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      radius: Math.random() * 1.6 + 0.6,
      isAccent: Math.random() < 0.12, // a few particles glow red
    }));
  }

  const CONNECT_DISTANCE = 150;

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between nearby particles first (under dots)
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DISTANCE) {
          const opacity = (1 - dist / CONNECT_DISTANCE) * 0.12;
          ctx.strokeStyle = `rgba(${LINE_RGB}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.isAccent
        ? `rgba(${ACCENT_RGB}, 0.6)`
        : `rgba(${LINE_RGB}, 0.35)`;
      ctx.fill();
    });
  }

  function updateParticles() {
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges instead of bouncing, for a seamless drift
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;
    });
  }

  function animate() {
    updateParticles();
    drawFrame();
    animationFrameId = requestAnimationFrame(animate);
  }

  function startBackgroundAnimation() {
    resizeCanvas();

    if (prefersReducedMotion) {
      // Draw a single static frame and skip the animation loop entirely
      drawFrame();
      return;
    }

    animate();
  }

  // Debounced resize handler to avoid thrashing on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (!prefersReducedMotion) cancelAnimationFrame(animationFrameId);
      resizeCanvas();
      if (!prefersReducedMotion) animate();
      else drawFrame();
    }, 200);
  });

  // Pause animation when the tab isn't visible to save battery/CPU
  document.addEventListener('visibilitychange', () => {
    if (prefersReducedMotion) return;
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      animate();
    }
  });

  startBackgroundAnimation();

  /* ---------------------------------------------------------------
     8. ACTIVE NAV LINK HIGHLIGHT ON SCROLL (progressive enhancement)
     Adds a subtle "current section" indicator as the user scrolls,
     using the same IntersectionObserver pattern for performance.
     --------------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if ('IntersectionObserver' in window && sections.length && navAnchors.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navAnchors.forEach((a) => {
              const isCurrent = a.getAttribute('href') === `#${id}`;
              a.style.color = isCurrent ? 'var(--text)' : '';
            });
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((s) => sectionObserver.observe(s));
  }
})();
