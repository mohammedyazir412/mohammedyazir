/**
 * App — GSAP Orchestration & Interactions
 * Mohammed Yazir S Portfolio
 */

(function () {
    'use strict';

    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // ─── Hero Reveal Timeline ───
    const heroTL = gsap.timeline({ delay: 0.3 });

    // Initial State for characters
    gsap.set('.interactive-name .char, .interactive-name .char-wrap', { 
        opacity: 0, 
        y: 100,
        rotationX: -90
    });

    heroTL
        .to('.hero-eyebrow', {
            opacity: 1, y: 0,
            duration: 1, ease: 'power3.out'
        })
        .to('.interactive-name .char, .interactive-name .char-wrap', {
            opacity: 1, 
            y: 0,
            rotationX: 0,
            duration: 1,
            stagger: 0.05,
            ease: 'back.out(1.7)', // The "Jumping" effect
        }, '-=0.7')
        .to('.hero-tagline', {
            opacity: 1, y: 0,
            duration: 1, ease: 'power3.out'
        }, '-=0.6')
        .to('.hero-cta-row', {
            opacity: 1, y: 0,
            duration: 1, ease: 'power3.out'
        }, '-=0.7');

    // ─── Interactive Name Hover Reaction ───
    document.querySelectorAll('.interactive-name .char, .interactive-name .char-wrap').forEach(char => {
        char.addEventListener('mouseenter', () => {
            gsap.to(char, {
                y: -15, // Jump on hover
                scale: 1.1,
                color: 'var(--accent)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        char.addEventListener('mouseleave', () => {
            gsap.to(char, {
                y: 0,
                scale: 1,
                color: '', // Reset
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)' // Bounce back
            });
        });
    });


    // ─── Section Reveals (Excluding Skills which has its own 3D loop) ───
    const revealSections = document.querySelectorAll('section:not(#hero):not(#skills)');

    revealSections.forEach(section => {
        const elements = section.querySelectorAll('.section-label, .section-heading, .section-sub, .skills-3d-wrapper, .lead-text, .about-text p, .mission-quote, .focus-card, .exp-block, .skill-category, .portfolio-item, .contact-heading, .contact-actions, .contact-meta');

        if (elements.length) {
            gsap.set(elements, { opacity: 0, y: 30 }); // Pre-set to invisible

            ScrollTrigger.create({
                trigger: section,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(elements, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        stagger: 0.1,
                        ease: 'power3.out',
                        overwrite: true
                    });
                }
            });
        }
    });

    // Refresh ScrollTrigger to catch correct offsets
    window.addEventListener('load', () => ScrollTrigger.refresh());

    // ─── Project Card 3D Tilt ───
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(card, {
                rotationX: -y * 8,
                rotationY: x * 8,
                duration: 0.4,
                ease: 'power2.out',
                transformPerspective: 600
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0, rotationY: 0,
                duration: 0.6, ease: 'power3.out'
            });
        });
    });

    // ─── Focus Card stagger on hover ───
    document.querySelectorAll('.focus-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.03, duration: 0.3, ease: 'power2.out'
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1, duration: 0.3, ease: 'power2.out'
            });
        });
    });

    // ─── Skill Category 3D Tilt ───
    document.querySelectorAll('.skill-category').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(card, {
                rotationX: -y * 6,
                rotationY: x * 6,
                duration: 0.4,
                ease: 'power2.out',
                transformPerspective: 800
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0, rotationY: 0,
                duration: 0.6, ease: 'power3.out'
            });
        });
    });

    // ─── Smooth anchor scrolling ───
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─── Hide scroll indicator on scroll ───
    ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom 70%',
        onLeave: () => gsap.to('.scroll-indicator', { opacity: 0, duration: 0.5 }),
        onEnterBack: () => gsap.to('.scroll-indicator', { opacity: 0.6, duration: 0.5 })
    });


    // ─── 3D Skills Carousel Scroll Rotation (Cinematic Snap) ───
    const carousel = document.querySelector('.skills-carousel');
    const skillsSection = document.querySelector('#skills');
    
    if (carousel && skillsSection) {
        // Initial setup
        gsap.set(carousel.querySelectorAll('.skill-category'), { opacity: 0.2, scale: 0.8 });
        gsap.set(carousel.querySelector('.skill-category:first-child'), { opacity: 1, scale: 1 });

        // Scramble effect function
        const scrambleText = (el) => {
            const originalText = el.innerText;
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
            let iteration = 0;
            
            const interval = setInterval(() => {
                el.innerText = originalText.split('').map((char, index) => {
                    if(index < iteration) return originalText[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('');
                
                if(iteration >= originalText.length) clearInterval(interval);
                iteration += 1/3;
            }, 30);
        };

        // Rotation: Vertical Ferris Wheel with Jumping Ball Sync
        ScrollTrigger.create({
            trigger: '#skills',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
            pin: '.skills-sticky',
            onEnter: () => {
                document.querySelector('.skills-sticky').classList.add('is-active');
            },
            onUpdate: (self) => {
                const panels = carousel.querySelectorAll('.skill-category');
                const progress = self.progress;

                // Dispatch event to 3D scene
                window.dispatchEvent(new CustomEvent('skillsScroll', { detail: { progress } }));
                
                // Ferris Wheel Rotation (Parent)
                const wheelAngle = progress * 360;
                gsap.set(carousel, { 
                    rotationX: wheelAngle,
                    rotationY: progress * 20 // Slight tilt for depth
                });

                // Parallax for the grid - moves vertically
                gsap.set('.skills-bg-grid', { 
                    backgroundPosition: `center ${-progress * 600}px`,
                    opacity: 0.1 + (progress * 0.3)
                });

                panels.forEach((p, i) => {
                    const panelBaseAngle = i * 90;
                    const currentAngle = panelBaseAngle + wheelAngle;
                    
                    // Counter-rotate each panel so it stays upright
                    gsap.set(p, { 
                        rotationX: -currentAngle,
                        rotationY: -progress * 20 
                    });

                    // Distance from "Front"
                    const modAngle = Math.abs((currentAngle + 180) % 360 - 180);
                    const focus = Math.max(0.1, 1 - (modAngle / 60));
                    
                    // Active state detection
                    const isFocusZone = focus > 0.85;
                    const isNewlyFocused = isFocusZone && p.getAttribute('data-focused') !== 'true';
                    
                    if (isNewlyFocused) {
                        p.setAttribute('data-focused', 'true');
                        p.style.pointerEvents = 'all'; 
                        
                        // Impact Effect (Sync with ball landing)
                        gsap.fromTo(p, 
                            { boxShadow: '0 0 0px var(--accent)', borderColor: 'var(--accent)' },
                            { boxShadow: '0 0 40px var(--accent-glow)', borderColor: 'var(--accent-light)', duration: 0.5 }
                        );
                        
                        p.querySelectorAll('.skill-tag').forEach(tag => scrambleText(tag));
                    } else if (focus < 0.6) {
                        p.setAttribute('data-focused', 'false');
                        p.style.pointerEvents = 'none';
                    }

                    gsap.to(p, { 
                        opacity: focus, 
                        scale: 0.7 + (focus * 0.3),
                        filter: `blur(${Math.min(10, modAngle / 15)}px)`,
                        duration: 0.2,
                        overwrite: 'auto'
                    });
                });
            }
        });
    }

    console.log('✓ Mohammed Yazir S — Portfolio Loaded');
})();
