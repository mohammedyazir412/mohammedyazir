/**
 * App — GSAP Orchestration & Interactions
 * Mohammed Yazir S Portfolio
 */

(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─── Local time (IST) ───
    const timeEl = document.getElementById('local-time');
    const tick = () => {
        if (!timeEl) return;
        timeEl.textContent = new Date().toLocaleTimeString('en-GB', {
            timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit'
        });
    };
    tick();
    setInterval(tick, 15000);

    // ─── Nav background once scrolled ───
    const nav = document.getElementById('main-nav');
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // ─── Smooth anchor scrolling ───
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 70, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    });

    if (typeof gsap === 'undefined' || reduceMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    // ─── Hero Reveal Timeline ───
    gsap.timeline({ delay: 0.2, defaults: { ease: 'power3.out' } })
        .from('.hero-frame', { opacity: 0, scale: 0.94, duration: 1.2, ease: 'expo.out' })
        .from('.hero-frame .corner', { scale: 0, duration: 0.5, stagger: 0.06 }, '-=0.9')
        .from('.eyebrow', { opacity: 0, y: 12, duration: 0.7 }, '-=0.6')
        .from('.wordmark', { opacity: 0, y: 40, filter: 'blur(12px)', duration: 1.1 }, '-=0.6')
        .from('.hero-meta > *', { opacity: 0, y: 16, duration: 0.8, stagger: 0.1 }, '-=0.7')
        .fromTo('#hero .script',
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power2.inOut' }, '-=0.5')
        .from('.hero-services li', { opacity: 0, y: 10, duration: 0.6, stagger: 0.08 }, '-=1.1')
        .from('#main-nav, .status-badge', { opacity: 0, y: -10, duration: 0.8 }, '-=1');

    // ─── Atmosphere follows the pointer a little ───
    const glows = gsap.utils.toArray('.atmos-glow');
    window.addEventListener('pointermove', (e) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        glows.forEach((g, i) => {
            const depth = (i + 1) * 30;
            gsap.to(g, { x: x * depth, y: y * depth, duration: 1.6, ease: 'power2.out' });
        });
    });

    // ─── Hero frame lifts away as you scroll ───
    // fromTo with explicit start values: a plain .to() would record the intro's
    // opacity:0 as its start and leave the hero blank when scrolling back up.
    gsap.fromTo('.hero-frame', { yPercent: 0, opacity: 1 }, {
        yPercent: -12,
        opacity: 0.3,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // ─── Section Reveals ───
    const revealTargets = '.block-head > *, .about-text > *, .focus-list li, .stat, .exp, .skill-col, .work-row, .edu';
    gsap.utils.toArray(revealTargets).forEach(el => {
        gsap.from(el, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
    });

    // ─── Contact frame + script ───
    gsap.timeline({ scrollTrigger: { trigger: '#contact', start: 'top 65%', once: true } })
        .from('.contact-frame', { opacity: 0, scale: 0.94, duration: 1.1, ease: 'expo.out' })
        .from('.contact-frame > :not(.script):not(.corner)', { opacity: 0, y: 20, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, '-=0.7')
        .fromTo('#contact .script',
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 1.3, ease: 'power2.inOut' }, '-=0.6');

    // ─── Stats count-up ───
    document.querySelectorAll('.stat-num').forEach(el => {
        const match = el.textContent.trim().match(/^(\d+(?:\.\d+)?)(.*)$/);
        if (!match) return;
        const end = parseFloat(match[1]);
        const decimals = (match[1].split('.')[1] || '').length;
        const suffix = match[2] || '';
        const counter = { val: 0 };
        el.textContent = (0).toFixed(decimals) + suffix;
        gsap.to(counter, {
            val: end,
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate: () => { el.textContent = counter.val.toFixed(decimals) + suffix; }
        });
    });

    // ─── Magnetic Buttons ───
    document.querySelectorAll('.btn, .nav-cta').forEach(btn => {
        const strength = 0.3;
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * strength;
            const y = (e.clientY - rect.top - rect.height / 2) * strength;
            gsap.to(btn, { x, y, duration: 0.4, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        });
    });

    // Refresh ScrollTrigger once fonts/layout settle
    window.addEventListener('load', () => ScrollTrigger.refresh());
})();
