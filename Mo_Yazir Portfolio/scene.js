/**
 * 3D Scene — High-Fidelity Particle Wave Field (The Sea of Data)
 * Mohammed Yazir S Portfolio
 */

(function () {
    'use strict';

    const canvas = document.getElementById('three-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // ─── Setup ───
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); 

    camera.position.set(0, 4, 10);
    camera.lookAt(0, 0, 0);

    // ─── Particle Wave ───
    const countX = 80;
    const countY = 80;
    const particleCount = countX * countY;
    const gap = 0.45;
    
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const accent_primary = new THREE.Color(0x111111);
    const accent_secondary = new THREE.Color(0xF7D794);

    for (let i = 0, ix = 0; ix < countX; ix++) {
        for (let iy = 0; iy < countY; iy++) {
            positions[i * 3] = ix * gap - (countX * gap) / 2;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = iy * gap - (countY * gap) / 2;

            // Color gradient based on X position
            const mixed = accent_primary.clone().lerp(accent_secondary, Math.sin(ix / countX * Math.PI));
            colors[i * 3] = mixed.r;
            colors[i * 3 + 1] = mixed.g;
            colors[i * 3 + 2] = mixed.b;

            scales[i] = 1;
            i++;
        }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const mat = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true
    });

    // Custom shader material for better particle control
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ─── Mouse Tracking ───
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    window.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // ─── Scroll Progress ───
    let scrollProgress = 0;
    window.addEventListener('scroll', () => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        scrollProgress = window.scrollY / (maxScroll || 1);
    });

    // ─── Render Loop ───
    function animate() {
        requestAnimationFrame(animate);

        const t = performance.now() * 0.001;
        const posAttr = geo.attributes.position.array;
        const scaleAttr = geo.attributes.scale.array;

        // Smooth mouse move
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        // Animate Wave vertices
        for (let ix = 0, i = 0; ix < countX; ix++) {
            for (let iy = 0; iy < countY; iy++) {
                const px = ix * gap - (countX * gap) / 2;
                const py = iy * gap - (countY * gap) / 2;
                
                // Double Sine Wave + Mouse influence
                const distToMouse = Math.sqrt(Math.pow(px/5 - mouseX, 2) + Math.pow(py/5 - mouseY, 2));
                const mouseWave = Math.max(0, 1.5 - distToMouse * 2) * 0.5;

                const waveY = (Math.sin(ix * 0.2 + t) + Math.cos(iy * 0.2 + t)) * 0.5 + mouseWave;
                
                posAttr[i * 3 + 1] = waveY;
                i++;
            }
        }
        geo.attributes.position.needsUpdate = true;

        // Camera tilt
        camera.position.x += (mouseX * 4 - camera.position.x) * 0.03;
        camera.position.y += (4 + mouseY * 2 - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);

        // Scroll drift
        points.position.y = -scrollProgress * 6;
        points.rotation.y = t * 0.05;

        renderer.render(scene, camera);
    }

    // ─── Resize ───
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
})();
