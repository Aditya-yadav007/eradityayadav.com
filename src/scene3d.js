/* ==========================================================================
   THREE.JS 3D SPATIAL SCENE ENGINE
   Hardware-accelerated cosmos, holographic grid & mouse parallax
   ========================================================================== */

import * as THREE from 'three';

export class Scene3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Objects
    this.particleSystem = null;
    this.particlePositions = null;
    this.particleVelocities = null;
    this.gridMesh = null;
    this.floatingPoly = null;
    this.floatingTorus = null;
    this.ambientLight = null;
    this.pointLight = null;

    // Interaction State
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollY = 0;
    this.targetScrollY = 0;
    this.startTime = performance.now();
    this.animationFrameId = null;

    // Theme Colors
    this.colors = {
      cyan: { primary: 0x00e5ff, secondary: 0xa855f7, background: 0x03060c },
      violet: { primary: 0xd946ef, secondary: 0x00e5ff, background: 0x05040d },
      emerald: { primary: 0x10b981, secondary: 0xf59e0b, background: 0x020a06 },
    };
    this.currentTheme = 'cyan';

    this.init();
  }

  init() {
    // 1. Scene & Fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(this.colors.cyan.background, 0.0018);

    // 2. Camera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 5, 28);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const isMobile = window.innerWidth < 768;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

    // 4. Lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(this.ambientLight);

    this.pointLight = new THREE.PointLight(this.colors.cyan.primary, 3, 60);
    this.pointLight.position.set(10, 15, 10);
    this.scene.add(this.pointLight);

    // 5. Build Meshes
    this.createCosmosParticles();
    this.createCyberGrid();
    this.createFloatingGeometries();

    // 6. Event Listeners
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });

    // 7. Start Loop
    this.animate();
  }

  createCosmosParticles() {
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 500 : 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = [];

    const color1 = new THREE.Color(this.colors[this.currentTheme].primary);
    const color2 = new THREE.Color(this.colors[this.currentTheme].secondary);

    for (let i = 0; i < particleCount; i++) {
      // Spread across deep 3D volume
      const x = (Math.random() - 0.5) * 120;
      const y = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 90 - 10;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      velocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
        baseY: y
      });

      // Gradient color blend
      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material with circular texture generated dynamically
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.particlePositions = positions;
    this.particleVelocities = velocities;
    this.scene.add(this.particleSystem);
  }

  createCyberGrid() {
    const size = 120;
    const divisions = 40;
    const planeGeo = new THREE.PlaneGeometry(size, size, divisions, divisions);
    planeGeo.rotateX(-Math.PI / 2);

    const gridMat = new THREE.MeshBasicMaterial({
      color: this.colors[this.currentTheme].primary,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });

    this.gridMesh = new THREE.Mesh(planeGeo, gridMat);
    this.gridMesh.position.y = -14;
    this.gridMesh.position.z = -15;
    this.scene.add(this.gridMesh);
  }

  createFloatingGeometries() {
    // 1. Futuristic Holographic Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(3.5, 1);
    const icoMat = new THREE.MeshStandardMaterial({
      color: this.colors[this.currentTheme].primary,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      emissive: this.colors[this.currentTheme].primary,
      emissiveIntensity: 0.3
    });
    this.floatingPoly = new THREE.Mesh(icoGeo, icoMat);
    this.floatingPoly.position.set(16, 2, -10);
    this.scene.add(this.floatingPoly);

    // 2. Holographic Torus Knot
    const torusGeo = new THREE.TorusKnotGeometry(2.4, 0.6, 64, 8);
    const torusMat = new THREE.MeshStandardMaterial({
      color: this.colors[this.currentTheme].secondary,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      emissive: this.colors[this.currentTheme].secondary,
      emissiveIntensity: 0.2
    });
    this.floatingTorus = new THREE.Mesh(torusGeo, torusMat);
    this.floatingTorus.position.set(-18, -4, -12);
    this.scene.add(this.floatingTorus);
  }

  onResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  onPointerMove(e) {
    this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  }

  onScroll() {
    this.targetScrollY = window.scrollY;
  }

  setTheme(themeName) {
    if (!this.colors[themeName]) return;
    this.currentTheme = themeName;
    const theme = this.colors[themeName];

    // Smooth color update
    if (this.pointLight) this.pointLight.color.setHex(theme.primary);
    if (this.gridMesh) this.gridMesh.material.color.setHex(theme.primary);
    if (this.floatingPoly) {
      this.floatingPoly.material.color.setHex(theme.primary);
      this.floatingPoly.material.emissive.setHex(theme.primary);
    }
    if (this.floatingTorus) {
      this.floatingTorus.material.color.setHex(theme.secondary);
      this.floatingTorus.material.emissive.setHex(theme.secondary);
    }

    // Re-blend particle colors
    if (this.particleSystem) {
      const colors = this.particleSystem.geometry.attributes.color.array;
      const c1 = new THREE.Color(theme.primary);
      const c2 = new THREE.Color(theme.secondary);
      const count = colors.length / 3;
      for (let i = 0; i < count; i++) {
        const mixed = c1.clone().lerp(c2, Math.random());
        colors[i * 3] = mixed.r;
        colors[i * 3 + 1] = mixed.g;
        colors[i * 3 + 2] = mixed.b;
      }
      this.particleSystem.geometry.attributes.color.needsUpdate = true;
    }
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

    const elapsed = (performance.now() - this.startTime) * 0.001;

    // Smooth mouse lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Smooth scroll lerp
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.08;

    // 1. Camera Parallax
    this.camera.position.x = this.mouse.x * 3.5;
    this.camera.position.y = 5 + this.mouse.y * 2.5 - (this.scrollY * 0.008);
    this.camera.lookAt(0, -this.scrollY * 0.005, 0);

    // 2. Rotate Floating Artifacts
    if (this.floatingPoly) {
      this.floatingPoly.rotation.x = elapsed * 0.25;
      this.floatingPoly.rotation.y = elapsed * 0.35;
      this.floatingPoly.position.y = 2 + Math.sin(elapsed * 1.2) * 1.5 - (this.scrollY * 0.005);
    }

    if (this.floatingTorus) {
      this.floatingTorus.rotation.x = elapsed * 0.3;
      this.floatingTorus.rotation.z = elapsed * 0.2;
      this.floatingTorus.position.y = -4 + Math.cos(elapsed * 0.9) * 1.2 - (this.scrollY * 0.004);
    }

    // 3. Cyber Grid Wave Undulation
    if (this.gridMesh) {
      const posAttr = this.gridMesh.geometry.attributes.position;
      const count = posAttr.count;
      for (let i = 0; i < count; i++) {
        const u = posAttr.getX(i);
        const w = posAttr.getZ(i);
        const wave = Math.sin(u * 0.15 + elapsed * 1.5) * Math.cos(w * 0.15 + elapsed * 1.2) * 0.9;
        posAttr.setY(i, wave);
      }
      posAttr.needsUpdate = true;
    }

    // 4. Particle Float & Flow
    if (this.particleSystem) {
      const positions = this.particlePositions;
      const count = positions.length / 3;
      for (let i = 0; i < count; i++) {
        const vel = this.particleVelocities[i];
        positions[i * 3 + 1] += Math.sin(elapsed + i) * 0.015;
        positions[i * 3] += Math.cos(elapsed * 0.5 + i) * 0.008;

        // Mouse repelling force
        const dx = positions[i * 3] - this.mouse.x * 20;
        const dy = positions[i * 3 + 1] - this.mouse.y * 15;
        const distSq = dx * dx + dy * dy;
        if (distSq < 150) {
          positions[i * 3] += (dx / distSq) * 0.4;
          positions[i * 3 + 1] += (dy / distSq) * 0.4;
        }
      }
      this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    // 5. Render
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('scroll', this.onScroll);
  }
}
