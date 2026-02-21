/* =====================================================
   GenesiSpa — main.js
   App init · Navbar · GSAP ScrollTrigger · Particles
   BUG FIXES v2:
   - GSAP selectors scoped per section (no cross-fire)
   - Particle colors updated to pink palette
   - Portfolio photo mosaic animation added
   - Scroll-to-top button added
   - Image lazy-loading via IntersectionObserver
   ===================================================== */

(function () {
    'use strict';

    /* ══════════════════════════════════════
       GSAP SETUP
       ══════════════════════════════════════ */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initGSAP();
    } else {
        // Fallback: show everything if CDN fails
        document.querySelectorAll(
            '.gsap-fade, .gsap-slide-left, .gsap-slide-right, ' +
            '.gsap-card, .gsap-bubble, .gsap-float-card, .gsap-mosaic-item'
        ).forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    }

    function initGSAP() {
        const EASE = 'power3.out';

        /* ─────────────────────────────────────
           HERO ENTRANCE SEQUENCE
           ───────────────────────────────────── */
        const heroTl = gsap.timeline({ defaults: { ease: EASE } });
        heroTl
            .to('#heroLine1', { opacity: 1, y: 0, duration: 0.9, delay: 0.4 })
            .to('#heroLine2', { opacity: 1, y: 0, duration: 0.9 }, '-=0.65')
            .to('#heroLine3', { opacity: 1, y: 0, duration: 0.9 }, '-=0.65')
            .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
            .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
            .to('.hero-actions', { opacity: 1, y: 0, duration: 0.7 }, '-=0.45');

        /* ─────────────────────────────────────
           ABOUT SECTION
           FIX: scope selectors to .about only
           ───────────────────────────────────── */
        gsap.to('.about .gsap-slide-left', {
            scrollTrigger: { trigger: '.about', start: 'top 75%', once: true },
            x: 0, opacity: 1, duration: 0.9, ease: EASE,
        });
        gsap.to('.about .gsap-slide-right', {
            scrollTrigger: { trigger: '.about', start: 'top 75%', once: true },
            x: 0, opacity: 1, duration: 0.9, ease: EASE, delay: 0.15,
        });

        /* Stat number counter */
        ScrollTrigger.create({
            trigger: '.about-stats',
            start: 'top 80%',
            once: true,
            onEnter: () => animateCounters(document.querySelectorAll('.stat-num')),
        });

        /* ─────────────────────────────────────
           SECTION HEADERS (.gsap-fade)
           Each element is its own trigger
           ───────────────────────────────────── */
        document.querySelectorAll('.gsap-fade').forEach(el => {
            gsap.to(el, {
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
                y: 0, opacity: 1, duration: 0.75, ease: EASE,
            });
        });

        /* ─────────────────────────────────────
           SERVICE CARDS STAGGER
           ───────────────────────────────────── */
        gsap.to('.gsap-card', {
            scrollTrigger: { trigger: '.services-grid', start: 'top 80%', once: true },
            y: 0, opacity: 1, stagger: 0.07, duration: 0.6, ease: EASE,
        });

        /* ─────────────────────────────────────
           PHOTO MOSAIC (new section)
           ───────────────────────────────────── */
        if (document.querySelector('.mosaic-grid')) {
            gsap.to('.gsap-mosaic-item', {
                scrollTrigger: { trigger: '.mosaic-grid', start: 'top 80%', once: true },
                y: 0, opacity: 1, scale: 1, stagger: 0.06, duration: 0.7, ease: EASE,
            });
        }

        /* ─────────────────────────────────────
           PRICING CARDS
           ───────────────────────────────────── */
        gsap.to('.gsap-float-card', {
            scrollTrigger: { trigger: '.pricing-grid', start: 'top 80%', once: true },
            y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: EASE,
            onComplete() {
                document.querySelectorAll('.gsap-float-card').forEach(c => {
                    c.classList.add('pricing-card--float-loop');
                });
                const featured = document.querySelector('.pricing-card--featured');
                if (featured) featured.classList.add('gold-glow-active');
            },
        });

        /* ─────────────────────────────────────
           GALLERY LABEL PARALLAX
           ───────────────────────────────────── */
        gsap.to('.slide-label', {
            scrollTrigger: {
                trigger: '.gallery-carousel',
                start: 'top bottom', end: 'bottom top',
                scrub: 1.2,
            },
            y: -24, ease: 'none',
        });

        /* ─────────────────────────────────────
           BEFORE-AFTER REVEAL
           ───────────────────────────────────── */
        gsap.to('.ba-container', {
            scrollTrigger: { trigger: '.before-after', start: 'top 80%', once: true },
            y: 0, opacity: 1, duration: 0.9, ease: EASE,
        });

        /* ─────────────────────────────────────
           TESTIMONIAL BUBBLES
           ───────────────────────────────────── */
        gsap.to('.gsap-bubble', {
            scrollTrigger: { trigger: '.testimonials-grid', start: 'top 80%', once: true },
            y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: EASE,
            onComplete() {
                document.querySelectorAll('.gsap-bubble').forEach(el =>
                    el.classList.add('bubble-float-active')
                );
            },
        });

        /* ─────────────────────────────────────
           CONTACT SECTION
           FIX: scope to .contact, not global
           ───────────────────────────────────── */
        gsap.to('.contact .gsap-slide-left, .contact-info', {
            scrollTrigger: { trigger: '.contact', start: 'top 75%', once: true },
            x: 0, opacity: 1, duration: 0.85, ease: EASE,
        });
        gsap.to('.contact .gsap-slide-right, .contact-form-wrap', {
            scrollTrigger: { trigger: '.contact', start: 'top 75%', once: true },
            x: 0, opacity: 1, duration: 0.85, ease: EASE, delay: 0.15,
        });

        /* Refresh after fonts & images settle */
        document.fonts.ready.then(() => ScrollTrigger.refresh());
        window.addEventListener('load', () => ScrollTrigger.refresh());
    }


    /* ══════════════════════════════════════
       COUNTER ANIMATION
       ══════════════════════════════════════ */
    function animateCounters(els) {
        els.forEach(el => {
            const raw = el.textContent.trim();
            const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
            if (isNaN(num)) return;
            const suffix = raw.replace(/[0-9.]/g, '').trim();
            const start = performance.now();
            const dur = 1400;

            (function tick(now) {
                const t = Math.min((now - start) / dur, 1);
                const val = Math.round(easeOut(t) * num);
                el.textContent = val + suffix;
                if (t < 1) requestAnimationFrame(tick);
            })(start);
        });
    }

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }


    /* ══════════════════════════════════════
       NAVBAR
       ══════════════════════════════════════ */
    (function initNavbar() {
        const navbar = document.getElementById('navbar');
        const toggle = document.getElementById('navToggle');
        const linksEl = document.getElementById('navLinks');
        if (!navbar) return;

        /* Shrink on scroll */
        let wasScrolled = false;
        window.addEventListener('scroll', () => {
            const now = window.scrollY > 60;
            if (now !== wasScrolled) {
                wasScrolled = now;
                navbar.classList.toggle('scrolled', now);
            }
        }, { passive: true });

        /* Mobile hamburger */
        if (toggle && linksEl) {
            toggle.addEventListener('click', () => {
                const open = linksEl.classList.toggle('open');
                toggle.classList.toggle('active', open);
                toggle.setAttribute('aria-expanded', open);
                document.body.style.overflow = open ? 'hidden' : '';
            });
            linksEl.querySelectorAll('a').forEach(a => {
                a.addEventListener('click', () => {
                    linksEl.classList.remove('open');
                    toggle.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });
        }

        /* Active link highlight */
        const sections = document.querySelectorAll('section[id]');
        const navAnchors = linksEl ? linksEl.querySelectorAll('a[href^="#"]') : [];

        function updateActive() {
            const pos = window.scrollY + 120;
            let active = '';
            sections.forEach(s => { if (s.offsetTop <= pos) active = '#' + s.id; });
            navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === active));
        }

        window.addEventListener('scroll', updateActive, { passive: true });
        updateActive();
    })();


    /* ══════════════════════════════════════
       HERO CSS PARTICLE DOTS
       FIX: update color palette to pinks
       ══════════════════════════════════════ */
    (function initHeroParticles() {
        const container = document.getElementById('heroParticles');
        if (!container) return;

        const COLORS = ['#d4547a', '#f9c6d0', '#c47088', '#e87a9a', '#ffffff'];
        const COUNT = 30;

        for (let i = 0; i < COUNT; i++) {
            const dot = document.createElement('div');
            const size = Math.random() * 5 + 1.5;
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            const delay = Math.random() * 10;
            const dur = 9 + Math.random() * 14;

            dot.className = 'particle';
            Object.assign(dot.style, {
                width: size + 'px',
                height: size + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                background: color,
                opacity: (0.08 + Math.random() * 0.3).toString(),
                animation: `orbFloat ${dur}s ${delay}s ease-in-out infinite`,
            });

            container.appendChild(dot);
        }
    })();


    /* ══════════════════════════════════════
       LAZY BACKGROUND IMAGE LOADING
       (for mosaic + BA sections)
       ══════════════════════════════════════ */
    (function initLazyBg() {
        if (!('IntersectionObserver' in window)) return;

        /* <img data-src="..."> lazy load */
        const imgs = document.querySelectorAll('img[data-src]');
        if (imgs.length) {
            const io = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (!e.isIntersecting) return;
                    const img = e.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
                    io.unobserve(img);
                });
            }, { rootMargin: '300px' });
            imgs.forEach(img => io.observe(img));
        }

        /* [data-bg="..."] lazy background */
        const bgEls = document.querySelectorAll('[data-bg]');
        if (bgEls.length) {
            const bgIo = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (!e.isIntersecting) return;
                    e.target.style.backgroundImage = `url(${e.target.dataset.bg})`;
                    bgIo.unobserve(e.target);
                });
            }, { rootMargin: '400px' });
            bgEls.forEach(el => bgIo.observe(el));
        }
    })();


    /* ══════════════════════════════════════
       SMOOTH SCROLL FOR INTERNAL LINKS
       ══════════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const navH = document.getElementById('navbar')?.offsetHeight ?? 70;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - navH - 8,
                behavior: 'smooth',
            });
        });
    });


    /* ══════════════════════════════════════
       SCROLL-TO-TOP BUTTON
       ══════════════════════════════════════ */
    (function initScrollTop() {
        const btn = document.getElementById('scrollTopBtn');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 600);
        }, { passive: true });

        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    })();


    /* ══════════════════════════════════════
       MOSAIC HOVER ZOOM (accessibility-safe)
       ══════════════════════════════════════ */
    document.querySelectorAll('.mosaic-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.querySelector('img')?.style.setProperty('transform', 'scale(1.08)');
        });
        item.addEventListener('mouseleave', () => {
            item.querySelector('img')?.style.setProperty('transform', 'scale(1)');
        });
    });

})();
