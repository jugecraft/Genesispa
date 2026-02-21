/* =====================================================
   GenesiSpa — three-scene.js
   Three.js Hero Canvas: Floating geometry + particles
   ===================================================== */

(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  /* ── Renderer ── */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  /* ── Scene + Camera ── */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 6);

  /* ── Colors (Pink Palette) ── */
  const DEEP_PINK = new THREE.Color(0xd4547a);   // hot pink
  const BLUSH_PINK = new THREE.Color(0xf9c6d0);   // light blush
  const MAUVE = new THREE.Color(0xc47088);   // palo rosa
  const ROSE = new THREE.Color(0xe8829a);   // medium rose

  /* ── Lights ── */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0xd4547a, 3.5, 20);
  pointLight1.position.set(3, 3, 4);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xf9c6d0, 2.5, 20);
  pointLight2.position.set(-3, -2, 3);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0xc47088, 2, 15);
  pointLight3.position.set(0, -4, 2);
  scene.add(pointLight3);

  /* ── Main Torus Knot ── */
  const knotGeo = new THREE.TorusKnotGeometry(1.1, 0.35, 200, 20, 3, 5);
  const knotMat = new THREE.MeshPhongMaterial({
    color: DEEP_PINK,
    emissive: new THREE.Color(0x3d0a19),
    specular: new THREE.Color(0xff80aa),
    shininess: 140,
    wireframe: false,
  });
  const knotMesh = new THREE.Mesh(knotGeo, knotMat);
  knotMesh.position.set(2.4, 0, -1);
  knotMesh.scale.setScalar(0);     // start hidden, GSAP will scale in
  scene.add(knotMesh);

  /* ── Secondary Torus Ring ── */
  const torusGeo = new THREE.TorusGeometry(0.7, 0.12, 32, 80);
  const torusMat = new THREE.MeshPhongMaterial({
    color: BLUSH_PINK,
    emissive: new THREE.Color(0x3d0820),
    specular: new THREE.Color(0xffc0d0),
    shininess: 80,
    transparent: true,
    opacity: 0.85,
  });
  const torusMesh = new THREE.Mesh(torusGeo, torusMat);
  torusMesh.position.set(-2.5, 0.5, -0.5);
  torusMesh.scale.setScalar(0);
  scene.add(torusMesh);

  /* ── Small Ico Sphere ── */
  const sphereGeo = new THREE.IcosahedronGeometry(0.45, 2);
  const sphereMat = new THREE.MeshPhongMaterial({
    color: MAUVE,
    emissive: new THREE.Color(0x2a0a14),
    specular: new THREE.Color(0xffb0c8),
    shininess: 60,
    wireframe: false,
  });
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  sphereMesh.position.set(3, -2.2, -0.5);
  sphereMesh.scale.setScalar(0);
  scene.add(sphereMesh);

  /* ── Particle Cloud ── */
  const PARTICLE_COUNT = 300;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  const palette = [DEEP_PINK, BLUSH_PINK, MAUVE, ROSE, new THREE.Color(0xffffff)];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    // Spread particles across a wide volume
    positions[i3] = (Math.random() - 0.5) * 18;
    positions[i3 + 1] = (Math.random() - 0.5) * 12;
    positions[i3 + 2] = (Math.random() - 0.5) * 6 - 3;

    const col = palette[Math.floor(Math.random() * palette.length)];
    colors[i3] = col.r;
    colors[i3 + 1] = col.g;
    colors[i3 + 2] = col.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* ── Mouse Parallax ── */
  const mouse = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ── GSAP Scene-In Animation ── */
  function initSceneAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.to(knotMesh.scale, {
      x: 1, y: 1, z: 1,
      duration: 1.6,
      ease: 'elastic.out(1, 0.5)',
      delay: 0.5,
    });

    gsap.to(torusMesh.scale, {
      x: 1, y: 1, z: 1,
      duration: 1.4,
      ease: 'elastic.out(1, 0.6)',
      delay: 0.8,
    });

    gsap.to(sphereMesh.scale, {
      x: 1, y: 1, z: 1,
      duration: 1.2,
      ease: 'elastic.out(1, 0.5)',
      delay: 1.1,
    });
  }

  initSceneAnimations();

  /* ── Animation Loop ── */
  let clock = { t: 0 };

  function animate() {
    requestAnimationFrame(animate);

    const t = performance.now() * 0.001;

    // Smooth mouse parallax
    target.x += (mouse.x - target.x) * 0.04;
    target.y += (mouse.y - target.y) * 0.04;

    // Torus knot: rotate + float
    knotMesh.rotation.x = t * 0.25 + target.y * 0.3;
    knotMesh.rotation.y = t * 0.35 + target.x * 0.3;
    knotMesh.position.y = Math.sin(t * 0.6) * 0.25;

    // Torus ring
    torusMesh.rotation.x = t * 0.4;
    torusMesh.rotation.z = t * 0.2 - target.x * 0.4;
    torusMesh.position.y = 0.5 + Math.cos(t * 0.7) * 0.3;

    // Sphere
    sphereMesh.rotation.x = t * 0.5;
    sphereMesh.rotation.y = t * 0.3;
    sphereMesh.position.y = -2.2 + Math.sin(t * 0.9 + 1) * 0.2;

    // Particles gentle drift
    particles.rotation.y = t * 0.025 - target.x * 0.05;
    particles.rotation.x = target.y * 0.04;

    // Camera parallax
    camera.position.x += (target.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-target.y * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  /* ── Resize ── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

})();
