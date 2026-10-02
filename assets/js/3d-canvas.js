/* ==========================================================================
   INTERACTIVE 3D WEBGL BACKGROUND (THREE.JS)
   Features: Floating Glass & Wireframe Geometries, Particle Field & Mouse Parallax
   ========================================================================== */

(function initThreeJSBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  // Scene setup
  const scene = new THREE.Scene();
  
  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 30;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Mouse Parallax Trackers
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX) * 0.0015;
    mouseY = (e.clientY - windowHalfY) * 0.0015;
  });

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0xB8A9D4, 1.5, 60);
  pointLight1.position.set(15, 20, 15);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xD4A6A0, 1.5, 60);
  pointLight2.position.set(-15, -20, 10);
  scene.add(pointLight2);

  // Group for floating objects
  const geometriesGroup = new THREE.Group();
  scene.add(geometriesGroup);

  // Material definitions
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xEDE8F7,
    metalness: 0.05,
    roughness: 0.3,
    transmission: 0.92,
    thickness: 0.8,
    transparent: true,
    opacity: 0.15,
    wireframe: false
  });

  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xB8A9D4,
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });

  const wireframePurple = new THREE.MeshBasicMaterial({
    color: 0xD4B8E8,
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });

  // Create Shapes
  // 1. Torus Knot
  const torusKnotGeo = new THREE.TorusKnotGeometry(4.5, 1.2, 100, 16);
  const torusKnotMesh = new THREE.Mesh(torusKnotGeo, glassMaterial);
  const torusWireframe = new THREE.Mesh(torusKnotGeo, wireframeMaterial);
  torusKnotMesh.add(torusWireframe);
  torusKnotMesh.position.set(18, 8, -5);
  geometriesGroup.add(torusKnotMesh);

  // 2. Icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(3.5, 1);
  const icoMesh = new THREE.Mesh(icoGeo, glassMaterial);
  const icoWireframe = new THREE.Mesh(icoGeo, wireframePurple);
  icoMesh.add(icoWireframe);
  icoMesh.position.set(-18, -10, 0);
  geometriesGroup.add(icoMesh);

  // 3. Octahedron
  const octaGeo = new THREE.OctahedronGeometry(2.5, 0);
  const octaMesh = new THREE.Mesh(octaGeo, glassMaterial);
  const octaWireframe = new THREE.Mesh(octaGeo, wireframeMaterial);
  octaMesh.add(octaWireframe);
  octaMesh.position.set(-14, 12, -8);
  geometriesGroup.add(octaMesh);

  // 4. Dodecahedron
  const dodecaGeo = new THREE.DodecahedronGeometry(3, 0);
  const dodecaMesh = new THREE.Mesh(dodecaGeo, glassMaterial);
  const dodecaWireframe = new THREE.Mesh(dodecaGeo, wireframePurple);
  dodecaMesh.add(dodecaWireframe);
  dodecaMesh.position.set(16, -14, -6);
  geometriesGroup.add(dodecaMesh);

  // Particle System Background
  const particlesCount = 350;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);

  const colorOptions = [
    new THREE.Color(0xB8A9D4),
    new THREE.Color(0xD4B8E8),
    new THREE.Color(0xD4A6A0)
  ];

  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 90;
    positions[i + 1] = (Math.random() - 0.5) * 90;
    positions[i + 2] = (Math.random() - 0.5) * 50;

    const chosenColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    colors[i] = chosenColor.r;
    colors[i + 1] = chosenColor.g;
    colors[i + 2] = chosenColor.b;
  }

  const particlesGeo = new THREE.BufferGeometry();
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particlesMat = new THREE.PointsMaterial({
    size: 0.3,
    vertexColors: true,
    transparent: true,
    opacity: 0.25,
    blending: THREE.NormalBlending
  });

  const particleSystem = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particleSystem);

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Rotate objects
    torusKnotMesh.rotation.x = elapsedTime * 0.15;
    torusKnotMesh.rotation.y = elapsedTime * 0.2;

    icoMesh.rotation.x = elapsedTime * 0.12;
    icoMesh.rotation.y = elapsedTime * 0.18;

    octaMesh.rotation.x = elapsedTime * 0.25;
    octaMesh.rotation.z = elapsedTime * 0.15;

    dodecaMesh.rotation.y = elapsedTime * 0.18;
    dodecaMesh.rotation.x = elapsedTime * 0.1;

    // Rotate particle system slowly
    particleSystem.rotation.y = elapsedTime * 0.02;

    // Smooth Mouse Inertia
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 12;
    camera.position.y = -targetY * 12;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
