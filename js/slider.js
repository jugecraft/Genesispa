/* =====================================================
   GenesiSpa — slider.js
   Gallery Carousel + Before & After Comparison Slider
   ===================================================== */

(function () {
    'use strict';

    /* ══════════════════════════════════════
       GALLERY CAROUSEL
       ══════════════════════════════════════ */
    (function initCarousel() {
        const track = document.getElementById('carouselTrack');
        const prev = document.getElementById('carouselPrev');
        const next = document.getElementById('carouselNext');
        const dotsWrap = document.getElementById('carouselDots');

        if (!track || !prev || !next) return;

        const slides = Array.from(track.querySelectorAll('.carousel-slide'));
        const TOTAL = slides.length;
        let current = 0;
        let autoTimer = null;
        let startX = 0;
        let isDragging = false;

        /* Build dots */
        const dots = slides.map((_, i) => {
            const btn = document.createElement('button');
            btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            btn.setAttribute('aria-label', 'Ir a foto ' + (i + 1));
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            btn.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(btn);
            return btn;
        });

        function goTo(idx, smooth = true) {
            current = (idx + TOTAL) % TOTAL;
            track.style.transition = smooth ? 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none';
            track.style.transform = `translateX(-${current * 100}%)`;

            dots.forEach((d, i) => {
                d.classList.toggle('active', i === current);
                d.setAttribute('aria-selected', i === current ? 'true' : 'false');
            });
        }

        function startAuto() {
            clearInterval(autoTimer);
            autoTimer = setInterval(() => goTo(current + 1), 4500);
        }

        function stopAuto() { clearInterval(autoTimer); }

        prev.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
        next.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

        /* Touch / swipe */
        const carousel = document.getElementById('galleryCarousel');

        carousel.addEventListener('pointerdown', (e) => {
            startX = e.clientX;
            isDragging = true;
            carousel.setPointerCapture(e.pointerId);
        }, { passive: true });

        carousel.addEventListener('pointerup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const diff = startX - e.clientX;
            if (Math.abs(diff) > 50) {
                stopAuto();
                goTo(diff > 0 ? current + 1 : current - 1);
                startAuto();
            }
        });

        /* Pause on hover */
        carousel.addEventListener('mouseenter', stopAuto);
        carousel.addEventListener('mouseleave', startAuto);

        /* Keyboard */
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { stopAuto(); goTo(current - 1); startAuto(); }
            if (e.key === 'ArrowRight') { stopAuto(); goTo(current + 1); startAuto(); }
        });

        carousel.setAttribute('tabindex', '0');

        goTo(0, false);
        startAuto();
    })();


    /* ══════════════════════════════════════
       BEFORE & AFTER SLIDER
       ══════════════════════════════════════ */
    (function initBeforeAfter() {
        const slider = document.getElementById('baSlider');
        const handle = document.getElementById('baHandle');
        const afterEl = slider ? slider.querySelector('.ba-after') : null;

        if (!slider || !handle || !afterEl) return;

        let dragging = false;
        let pct = 50;

        function setPosition(clientX) {
            const rect = slider.getBoundingClientRect();
            const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            pct = (x / rect.width) * 100;

            handle.style.left = pct + '%';
            afterEl.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
            handle.setAttribute('aria-valuenow', Math.round(pct));
        }

        /* Mouse */
        handle.addEventListener('mousedown', (e) => {
            dragging = true;
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            setPosition(e.clientX);
        });

        window.addEventListener('mouseup', () => { dragging = false; });

        /* Touch */
        handle.addEventListener('touchstart', (e) => {
            dragging = true;
            e.preventDefault();
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (!dragging) return;
            setPosition(e.touches[0].clientX);
        }, { passive: true });

        window.addEventListener('touchend', () => { dragging = false; });

        /* Keyboard control */
        handle.addEventListener('keydown', (e) => {
            const step = e.shiftKey ? 10 : 2;
            if (e.key === 'ArrowLeft') { pct = Math.max(0, pct - step); }
            if (e.key === 'ArrowRight') { pct = Math.min(100, pct + step); }
            handle.style.left = pct + '%';
            afterEl.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
            handle.setAttribute('aria-valuenow', Math.round(pct));
        });

        /* Click on slider area (not just handle) */
        slider.addEventListener('click', (e) => {
            if (e.target === handle || handle.contains(e.target)) return;
            setPosition(e.clientX);
        });

        /* Initial position */
        setPosition(slider.getBoundingClientRect().left + slider.getBoundingClientRect().width * 0.5);

        /* Intro animation: auto-sweep to hint at the interaction */
        let sweepDone = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !sweepDone) {
                    sweepDone = true;
                    observer.disconnect();
                    setTimeout(() => autoSweep(), 400);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(slider);

        function autoSweep() {
            if (dragging) return;
            const duration = 1200;
            const start = performance.now();
            const from = 50;
            const to = 25;

            function step(now) {
                const progress = Math.min((now - start) / duration, 1);
                const ease = easeInOut(progress);
                const val = from + (to - from) * ease;
                if (!dragging) { setPosition(slider.getBoundingClientRect().left + slider.getBoundingClientRect().width * val / 100); }
                if (progress < 1) requestAnimationFrame(step);
            }

            requestAnimationFrame(step);
        }

        function easeInOut(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }
    })();

})();
