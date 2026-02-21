/* =====================================================
   GenesiSpa — main.js
   App init · Navbar · GSAP ScrollTrigger · Particles
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
        document.querySelectorAll(
            '.gsap-fade, .gsap-slide-left, .gsap-slide-right, ' +
            '.gsap-card, .gsap-bubble, .gsap-float-card, .gsap-mosaic-item'
        ).forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    }

    function initGSAP() {
        const EASE = 'power3.out';
        const EASE_INOUT = 'power2.inOut';

        /* ── Custom Cursor ── */
        const cursor = document.getElementById('customCursor');
        if (cursor) {
            window.addEventListener('mousemove', (e) => {
                gsap.to(cursor, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.1,
                    ease: 'none'
                });
            });
            document.querySelectorAll('a, button, .service-card, .mosaic-item').forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('active'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
            });
        }

        /* ── Magnetic Buttons ── */
        document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
            });
        });

        /* ── Splash Screen & Hero Sequence ── */
        const splashTl = gsap.timeline({
            onComplete: () => {
                const splash = document.getElementById('splashScreen');
                if (splash) splash.style.display = 'none';
                initHeroSequence();
            }
        });

        splashTl
            .to('.splash-logo', { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1, ease: EASE })
            .to('.loader-bar', { width: '100%', duration: 1.5, ease: EASE_INOUT }, '-=0.5')
            .to('.splash-content', { opacity: 0, y: -20, duration: 0.6, ease: 'power2.in' })
            .to('.splash-screen', { yPercent: -100, duration: 0.8, ease: 'expo.inOut' });

        function initHeroSequence() {
            const heroTl = gsap.timeline({ defaults: { ease: EASE } });
            heroTl
                .to('#heroLine1', { opacity: 1, y: 0, duration: 0.9, delay: 0.1 })
                .to('#heroLine2', { opacity: 1, y: 0, duration: 0.9 }, '-=0.65')
                .to('#heroLine3', { opacity: 1, y: 0, duration: 0.9 }, '-=0.65')
                .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
                .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
                .to('.hero-actions', { opacity: 1, y: 0, duration: 0.7 }, '-=0.45');
        }

        /* ── Section Scoped Animations ── */
        gsap.to('.about .gsap-slide-left', {
            scrollTrigger: { trigger: '.about', start: 'top 75%', once: true },
            x: 0, opacity: 1, duration: 0.9, ease: EASE,
        });
        gsap.to('.about .gsap-slide-right', {
            scrollTrigger: { trigger: '.about', start: 'top 75%', once: true },
            x: 0, opacity: 1, duration: 0.9, ease: EASE, delay: 0.15,
        });

        ScrollTrigger.create({
            trigger: '.about-stats',
            start: 'top 80%',
            once: true,
            onEnter: () => animateCounters(document.querySelectorAll('.stat-num')),
        });

        document.querySelectorAll('.gsap-fade').forEach(el => {
            gsap.to(el, {
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
                y: 0, opacity: 1, duration: 0.75, ease: EASE,
            });
        });

        gsap.to('.gsap-card', {
            scrollTrigger: { trigger: '.services-grid', start: 'top 80%', once: true },
            y: 0, opacity: 1, stagger: 0.07, duration: 0.6, ease: EASE,
        });

        if (document.querySelector('.mosaic-grid')) {
            gsap.to('.gsap-mosaic-item', {
                scrollTrigger: { trigger: '.mosaic-grid', start: 'top 80%', once: true },
                y: 0, opacity: 1, scale: 1, stagger: 0.06, duration: 0.7, ease: EASE,
            });
        }

        gsap.to('.gsap-float-card', {
            scrollTrigger: { trigger: '.pricing-grid', start: 'top 80%', once: true },
            y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: EASE,
            onComplete() {
                document.querySelectorAll('.gsap-float-card').forEach(c => {
                    c.classList.add('pricing-card--float-loop');
                });
            },
        });

        gsap.to('.slide-label', {
            scrollTrigger: {
                trigger: '.gallery-carousel',
                start: 'top bottom', end: 'bottom top', scrub: 1.2,
            },
            y: -24, ease: 'none',
        });

        gsap.to('.ba-container', {
            scrollTrigger: { trigger: '.before-after', start: 'top 80%', once: true },
            y: 0, opacity: 1, duration: 0.9, ease: EASE,
        });

        gsap.to('.gsap-bubble', {
            scrollTrigger: { trigger: '.testimonials-grid', start: 'top 80%', once: true },
            y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: EASE,
            onComplete() {
                document.querySelectorAll('.gsap-bubble').forEach(el =>
                    el.classList.add('bubble-float-active')
                );
            },
        });

        gsap.to('.contact .gsap-slide-left, .contact-info', {
            scrollTrigger: { trigger: '.contact', start: 'top 75%', once: true },
            x: 0, opacity: 1, duration: 0.85, ease: EASE,
        });
        gsap.to('.contact .gsap-slide-right, .contact-form-wrap', {
            scrollTrigger: { trigger: '.contact', start: 'top 75%', once: true },
            x: 0, opacity: 1, duration: 0.85, ease: EASE, delay: 0.15,
        });

        document.fonts.ready.then(() => ScrollTrigger.refresh());
        window.addEventListener('load', () => ScrollTrigger.refresh());

        /* ── Theme Toggle Logic ── */
        const themeBtn = document.getElementById('themeToggle');
        const currentTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);

        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                // Optional: Refresh some animations if needed
            });
        }

        /* ── Portfolio Filter Logic ── */
        const filterBtns = document.querySelectorAll('.filter-btn');
        const mosaicItems = document.querySelectorAll('.mosaic-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Animate items
                gsap.to(mosaicItems, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.3,
                    stagger: 0.02,
                    onComplete: () => {
                        mosaicItems.forEach(item => {
                            if (filter === 'all' || item.dataset.category === filter) {
                                item.classList.remove('hidden');
                                gsap.to(item, { opacity: 1, scale: 1, duration: 0.4, delay: 0.1 });
                            } else {
                                item.classList.add('hidden');
                            }
                        });
                        ScrollTrigger.refresh();
                    }
                });
            });
        });
    }

    /* ── Utilities ── */
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
                const val = Math.round((1 - Math.pow(1 - t, 3)) * num);
                el.textContent = val + suffix;
                if (t < 1) requestAnimationFrame(tick);
            })(start);
        });
    }

    /* ── Navbar ── */
    (function initNavbar() {
        const navbar = document.getElementById('navbar');
        const toggle = document.getElementById('navToggle');
        const linksEl = document.getElementById('navLinks');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });

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
                    document.body.style.overflow = '';
                });
            });
        }
    })();

    /* ── Particles ── */
    (function initHeroParticles() {
        const container = document.getElementById('heroParticles');
        if (!container) return;
        const COLORS = ['#d4547a', '#f9c6d0', '#c47088', '#e87a9a', '#ffffff'];
        for (let i = 0; i < 30; i++) {
            const dot = document.createElement('div');
            const size = Math.random() * 5 + 1.5;
            dot.className = 'particle';
            Object.assign(dot.style, {
                width: size + 'px', height: size + 'px',
                left: Math.random() * 100 + '%', top: Math.random() * 100 + '%',
                background: COLORS[Math.floor(Math.random() * COLORS.length)],
                opacity: (0.08 + Math.random() * 0.3).toString(),
                animation: `orbFloat ${9 + Math.random() * 14}s ${Math.random() * 10}s ease-in-out infinite`,
            });
            container.appendChild(dot);
        }
    })();

    /* ── Lazy Loading ── */
    (function initLazy() {
        if (!('IntersectionObserver' in window)) return;
        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                if (e.target.tagName === 'IMG') {
                    e.target.src = e.target.dataset.src || e.target.src;
                } else {
                    e.target.style.backgroundImage = `url(${e.target.dataset.bg})`;
                }
                io.unobserve(e.target);
            });
        }, { rootMargin: '300px' });
        document.querySelectorAll('img[data-src], [data-bg]').forEach(el => io.observe(el));
    })();

    /* ── Internal Links ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - 80,
                behavior: 'smooth',
            });
        });
    });

    /* ── Scroll To Top ── */
    (function initScrollTop() {
        const btn = document.getElementById('scrollTopBtn');
        if (!btn) return;
        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 600);
        }, { passive: true });
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    })();

    /* ── Portfolio Zoom ── */
    document.querySelectorAll('.mosaic-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.querySelector('img')?.style.setProperty('transform', 'scale(1.08)');
        });
        item.addEventListener('mouseleave', () => {
            item.querySelector('img')?.style.setProperty('transform', 'scale(1)');
        });
    });

    /* ── FAQ Accordion ── */
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    /* ── Newsletter ── */
    const newsForm = document.getElementById('newsletterForm');
    if (newsForm) {
        newsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsForm.querySelector('button');
            const status = document.getElementById('newsStatus');
            btn.disabled = true;
            btn.textContent = 'Enviando...';
            setTimeout(() => {
                newsForm.style.display = 'none';
                status.textContent = '¡Gracias por unirte! Pronto recibirás novedades.';
                status.style.color = 'var(--gold)';
                status.style.opacity = '1';
            }, 1200);
        });
    }

})();
