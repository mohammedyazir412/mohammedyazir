/**
 * Skills 3D Centerpiece — Interactive Glowing Core
 * Mohammed Yazir S Portfolio
 */

(function () {
    'use strict';

    const canvas = document.getElementById('skills-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

    renderer.setSize(400, 400); 
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.position.z = 4;

    // ─── Geometry: "Data Sphere" (Metal + Glow) ───
    const ballGeo = new THREE.IcosahedronGeometry(0.8, 4);
    const ballMat = new THREE.MeshStandardMaterial({
        color: 0xF7D794,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0xEDA6A3,
        emissiveIntensity: 0.6
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    scene.add(ball);

    // Glowing rim/aura
    const auraGeo = new THREE.IcosahedronGeometry(0.85, 4);
    const auraMat = new THREE.MeshBasicMaterial({
        color: 0xF7D794,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    scene.add(aura);

    // Add lighting
    const light = new THREE.PointLight(0xF7D794, 3, 15);
    light.position.set(2, 2, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // ─── Animation: Jumping Logic ───
    let scrollProgress = 0;
    
    // Listen for scroll progress from app.js (via custom event)
    window.addEventListener('skillsScroll', (e) => {
        scrollProgress = e.detail.progress;
    });

    function animate() {
        requestAnimationFrame(animate);

        const time = performance.now() * 0.001;

        // Bouncing logic tied to scroll progress
        // We want multiple bounces (one for each skill category transition)
        const numBounces = 4;
        const jumpHeight = 1.5;
        const phase = (scrollProgress * numBounces) % 1;
        
        // Parabolic bounce curve: y = 4 * height * x * (1 - x)
        const bounceY = 4 * jumpHeight * phase * (1 - phase) - 0.5;
        
        ball.position.y = bounceY;
        aura.position.y = bounceY;
        
        // Squish effect on landing
        const squish = 1 - Math.max(0, (0.05 - Math.abs(bounceY + 0.5)) * 2);
        ball.scale.set(1/squish, squish, 1/squish);

        ball.rotation.y += 0.02;
        aura.rotation.z -= 0.01;

        renderer.render(scene, camera);
    }

    animate();

    // Handle container resizing (if needed)
    const resizeDisp = () => {
        const parent = canvas.parentElement;
        const size = Math.min(parent.clientWidth, 400);
        renderer.setSize(size, size);
    };
    window.addEventListener('resize', resizeDisp);
    resizeDisp();

})();
