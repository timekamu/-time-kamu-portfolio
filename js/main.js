import * as THREE from 'three';

// =====================================
// TIME KAMU — 3D CINEMATIC ENGINE
// CREATED BY INDRAJIT
// =====================================

const canvas = document.querySelector('#scene');

const reduceMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

let renderer;
let scene;
let camera;
let orb;
let ring;
let particles;

let pointerX = 0;
let pointerY = 0;
let scrollY = 0;

// =====================================
// THREE JS INITIALIZATION
// =====================================

function initScene() {

  try {

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 1.8)
    );

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    camera.position.set(0, 0, 8);

    // =================================
    // MAIN METALLIC RED SPHERE
    // =================================

    const geometry = new THREE.IcosahedronGeometry(
      1.35,
      5
    );

    const material = new THREE.MeshStandardMaterial({

      color: 0x8d101c,

      metalness: 0.82,

      roughness: 0.23,

      emissive: 0x280006,

      emissiveIntensity: 0.5

    });

    orb = new THREE.Mesh(
      geometry,
      material
    );

    orb.position.set(2.15, 0.05, -1.2);

    scene.add(orb);

    // =================================
    // FLOATING RED RING
    // =================================

    const ringGeometry = new THREE.TorusGeometry(
      1.9,
      0.012,
      12,
      180
    );

    const ringMaterial = new THREE.MeshBasicMaterial({

      color: 0xf12b36,

      transparent: true,

      opacity: 0.65

    });

    ring = new THREE.Mesh(
      ringGeometry,
      ringMaterial
    );

    ring.position.copy(orb.position);

    ring.rotation.set(
      1.1,
      0.35,
      -0.3
    );

    scene.add(ring);

    // =================================
    // CINEMATIC LIGHTING
    // =================================

    const ambient = new THREE.AmbientLight(
      0xffffff,
      1.15
    );

    scene.add(ambient);

    const redLight = new THREE.PointLight(
      0xf12b36,
      32,
      12
    );

    redLight.position.set(3, 2, 2);

    scene.add(redLight);

    const whiteLight = new THREE.PointLight(
      0xffffff,
      18,
      15
    );

    whiteLight.position.set(-3, 2, 4);

    scene.add(whiteLight);

    // =================================
    // FLOATING PARTICLES
    // =================================

    const count = 240;

    const positions = new Float32Array(
      count * 3
    );

    for (let i = 0; i < count; i++) {

      positions[i * 3] =
        (Math.random() - 0.5) * 14;

      positions[i * 3 + 1] =
        (Math.random() - 0.5) * 9;

      positions[i * 3 + 2] =
        (Math.random() - 0.5) * 8 - 2;

    }

    const particleGeometry = new THREE.BufferGeometry();

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({

      color: 0xf15a63,

      size: 0.018,

      transparent: true,

      opacity: 0.65

    });

    particles = new THREE.Points(
      particleGeometry,
      particleMaterial
    );

    scene.add(particles);

    animate();

  } catch (error) {

    console.warn(
      '3D scene unavailable. CSS fallback enabled.',
      error
    );

    canvas.style.display = 'none';

  }

}

// =====================================
// 3D ANIMATION LOOP
// =====================================

function animate() {

  if (reduceMotion) {
    renderer.render(scene, camera);
    return;
  }

  requestAnimationFrame(animate);

  const t = performance.now() * 0.00025;

  if (orb) {

    // Sphere rotation
    orb.rotation.y =
      t * 1.8 + pointerX * 0.15;

    orb.rotation.x =
      t * 0.7 + pointerY * 0.1;

    // Floating movement
    orb.position.y =
      0.05 + Math.sin(t * 4) * 0.12
      - scrollY * 0.00018;

    // Ring rotation
    ring.rotation.z += 0.0018;

    ring.rotation.x =
      1.1 + pointerY * 0.05;

    // Particle movement
    particles.rotation.y = t * 0.15;

  }

  renderer.render(scene, camera);

}

// =====================================
// RESPONSIVE CANVAS
// =====================================

function resizeScene() {

  if (!renderer || !camera) return;

  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

}

window.addEventListener(
  'resize',
  resizeScene
);

// =====================================
// MOUSE & TOUCH INTERACTION
// =====================================

window.addEventListener(
  'pointermove',
  function(event) {

    pointerX =
      (event.clientX / window.innerWidth - 0.5) * 2;

    pointerY =
      (event.clientY / window.innerHeight - 0.5) * 2;

    const glow =
      document.querySelector('#cursorGlow');

    if (glow && window.innerWidth > 800) {

      glow.style.left =
        `${event.clientX}px`;

      glow.style.top =
        `${event.clientY}px`;

    }

  }
);

// =====================================
// SCROLL INTERACTION
// =====================================

window.addEventListener(
  'scroll',
  function() {

    scrollY = window.scrollY;

  },
  { passive: true }
);

// =====================================
// CINEMATIC LOADING SCREEN
// =====================================

const loader =
  document.querySelector('#loader');

const progress =
  document.querySelector('#loaderProgress');

const percent =
  document.querySelector('#loaderPercent');

let value = 0;

const loading = setInterval(function() {

  value = Math.min(
    100,
    value + Math.ceil(Math.random() * 13)
  );

  progress.style.width = `${value}%`;

  percent.textContent =
    String(value).padStart(2, '0');

  if (value >= 100) {

    clearInterval(loading);

    setTimeout(function() {

      loader.classList.add('done');

    }, 350);

  }

}, 90);

// =====================================
// START 3D ENGINE
// =====================================

initScene();

// =====================================
// SCROLL REVEAL ANIMATION
// =====================================

const observer = new IntersectionObserver(

  function(entries) {

    entries.forEach(function(entry) {

      if (entry.isIntersecting) {

        entry.target.classList.add('visible');

        observer.unobserve(entry.target);

      }

    });

  },

  {
    threshold: 0.15
  }

);

document.querySelectorAll(
  '.reveal, .big-statement'
).forEach(function(element) {

  element.classList.add('reveal');

  observer.observe(element);

});

// =====================================
// MOBILE MENU
// =====================================

const menuToggle =
  document.querySelector('#menuToggle');

const mobileMenu =
  document.querySelector('#mobileMenu');

menuToggle.addEventListener(
  'click',
  function() {

    mobileMenu.classList.toggle('open');

  }
);

mobileMenu.querySelectorAll('a').forEach(
  function(link) {

    link.addEventListener(
      'click',
      function() {

        mobileMenu.classList.remove('open');

      }
    );

  }
);

// =====================================
// DYNAMIC COPYRIGHT YEAR
// =====================================

document.querySelector('#year').textContent =
  new Date().getFullYear();

// =====================================
// END — TIME KAMU
// =====================================
