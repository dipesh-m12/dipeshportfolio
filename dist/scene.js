// An original, procedural studio sculpture. No external model or texture requests.
(async () => {
  const host = document.querySelector('#scene');
  const toggle = document.querySelector('#motion-toggle');
  const modeToggle = document.querySelector('#scene-mode');
  const sceneStatus = document.querySelector('#scene-status');
  if (!host) return;

  let renderer;
  const showStaticArtwork = () => {
    host.dataset.ready = 'false';
    host.removeAttribute('tabindex');
    host.setAttribute('role', 'img');
    host.setAttribute('aria-label', 'Orange and chrome knot sculpture. Static artwork.');
    host.querySelector('.scene-fallback')?.setAttribute('aria-hidden', 'false');
    if (modeToggle) modeToggle.disabled = true;
    if (sceneStatus) sceneStatus.textContent = 'Static sculpture · 3D unavailable on this device';
    if (toggle) {
      toggle.disabled = true;
      toggle.textContent = 'Static artwork';
      toggle.setAttribute('aria-label', 'Static artwork');
      toggle.setAttribute('aria-pressed', 'false');
    }
  };
  try {
    const THREE = await import('./assets/three.module.min.js');
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    const canvas = renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab';
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-3, 3, 3, -3, 0.1, 100);
    camera.position.set(0, 0.38, 9);
    camera.lookAt(0, -0.04, 0);

    // A little virtual photographic studio gives the metal readable reflections.
    const studioCanvas = document.createElement('canvas');
    studioCanvas.width = 2048;
    studioCanvas.height = 1024;
    const studio = studioCanvas.getContext('2d');
    studio.fillStyle = '#55514b';
    studio.fillRect(0, 0, 2048, 1024);
    const glow = studio.createLinearGradient(0, 0, 0, 1024);
    glow.addColorStop(0, '#e8e1d5');
    glow.addColorStop(0.42, '#b5ada0');
    glow.addColorStop(0.52, '#403d39');
    glow.addColorStop(1, '#252523');
    studio.fillStyle = glow;
    studio.fillRect(0, 0, 2048, 1024);
    studio.fillStyle = '#fffaf0';
    studio.fillRect(200, 100, 360, 690);
    studio.fillRect(1160, 90, 200, 600);
    studio.fillStyle = '#fffdf9';
    studio.fillRect(650, 25, 660, 100);
    studio.fillStyle = '#e7bd8e';
    studio.fillRect(1700, 220, 250, 560);
    const envTexture = new THREE.CanvasTexture(studioCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    envTexture.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromEquirectangular(envTexture);
    scene.environment = environment.texture;
    envTexture.dispose();
    pmrem.dispose();

    scene.add(new THREE.AmbientLight(0xfff5e7, 1.7));
    const key = new THREE.DirectionalLight(0xfff5e8, 4.4);
    key.position.set(-3, 5, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 2.4);
    fill.position.set(4, 1, 2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffc08d, 3);
    rim.position.set(1, 3, -4);
    scene.add(rim);

    const sculpture = new THREE.Group();
    scene.add(sculpture);
    const knotGroup = new THREE.Group();
    knotGroup.rotation.set(-0.33, -0.35, 0.28);
    sculpture.add(knotGroup);

    const orange = new THREE.MeshPhysicalMaterial({
      color: 0xf44716, metalness: 0.43, roughness: 0.235,
      clearcoat: 1, clearcoatRoughness: 0.14, envMapIntensity: 1.15,
    });
    const chrome = new THREE.MeshPhysicalMaterial({
      color: 0xe6e1d7, metalness: 1, roughness: 0.15,
      clearcoat: 0.6, envMapIntensity: 1.8,
    });
    const charcoal = new THREE.MeshPhysicalMaterial({
      color: 0x181a18, metalness: 0.65, roughness: 0.2,
      clearcoat: 1, clearcoatRoughness: 0.15,
    });

    // A continuous three-fold knot becomes a metaphor for connected systems.
    const knotGeometry = new THREE.TorusKnotGeometry(1.14, 0.34, 240, 36, 2, 3);
    const knot = new THREE.Mesh(knotGeometry, orange);
    knotGroup.add(knot);
    const shellMaterial = orange.clone();
    shellMaterial.transparent = true;
    knot.material = shellMaterial;
    const structureMaterial = new THREE.LineBasicMaterial({ color: 0x71371d, transparent: true, opacity: 0 });
    const structureGeometry = new THREE.TorusKnotGeometry(1.14, 0.342, 80, 10, 2, 3);
    const structure = new THREE.LineSegments(new THREE.WireframeGeometry(structureGeometry), structureMaterial);
    structureGeometry.dispose();
    structure.visible = false;
    knotGroup.add(structure);
    const nodeMaterial = new THREE.MeshStandardMaterial({ color: 0xf34b19, metalness: 0.6, roughness: 0.25, transparent: true, opacity: 0 });
    const structureNodes = new THREE.Group();
    structureNodes.visible = false;
    knotGroup.add(structureNodes);

    // Two fitted metal collars follow the knot's centreline.
    const centreAt = (u) => {
      const radial = 1.14 * (2 + Math.cos(1.5 * u)) * 0.5;
      return new THREE.Vector3(radial * Math.cos(u), radial * Math.sin(u), 1.14 * Math.sin(1.5 * u) * 0.5);
    };
    const nodeGeometry = new THREE.SphereGeometry(0.075, 16, 12);
    for (let i = 0; i < 20; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.copy(centreAt(i / 20 * Math.PI * 4));
      structureNodes.add(node);
    }
    for (const u of [2.65, 8.9]) {
      const centre = centreAt(u);
      const direction = centreAt(u + 0.001).sub(centre).normalize();
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.346, 0.043, 12, 64), chrome);
      collar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
      collar.position.copy(centre);
      knotGroup.add(collar);
    }

    const satellites = [];
    const addSphere = (size, x, y, z, material) => {
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(size, 40, 28), material);
      sphere.position.set(x, y, z);
      sculpture.add(sphere);
      satellites.push({ sphere, y, phase: satellites.length * 2.2 });
      return sphere;
    };
    addSphere(0.30, 1.96, 1.38, 0.2, chrome);
    addSphere(0.22, -1.94, -0.91, 0.65, charcoal);
    addSphere(0.115, 1.62, -1.64, 0.3, orange);

    // Soft contact shadow, painted once and composited below the sculpture.
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = shadowCanvas.height = 256;
    const shadowContext = shadowCanvas.getContext('2d');
    const shadowGradient = shadowContext.createRadialGradient(128, 128, 0, 128, 128, 128);
    shadowGradient.addColorStop(0, 'rgba(36,24,14,0.20)');
    shadowGradient.addColorStop(0.35, 'rgba(36,24,14,0.10)');
    shadowGradient.addColorStop(1, 'rgba(36,24,14,0)');
    shadowContext.fillStyle = shadowGradient;
    shadowContext.fillRect(0, 0, 256, 256);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 1.1), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }));
    shadow.position.set(0, -2.03, -1);
    scene.add(shadow);

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let playing = !media.matches;
    let manuallyChosen = false;
    let visible = true;
    let frame = 0;
    let lastTime = 0;
    let elapsed = 0;
    let dragging = false;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let autoRotation = 0;
    let contextAvailable = true;
    let structureTarget = 0;
    let structureAmount = 0;

    const updateToggle = () => {
      if (!toggle) return;
      if (!contextAvailable) { showStaticArtwork(); return; }
      const label = playing ? 'Pause motion' : 'Play motion';
      toggle.textContent = label;
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('aria-pressed', String(playing));
      toggle.disabled = false;
    };
    const render = (time) => {
      frame = 0;
      if (!contextAvailable || !visible || document.hidden) { lastTime = 0; return; }
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;
      if (playing && !dragging) {
        elapsed += delta;
        autoRotation += delta * 0.085;
      }
      const damping = 1 - Math.exp(-12 * Math.max(delta, 1 / 60));
      structureAmount = media.matches ? structureTarget : structureAmount + (structureTarget - structureAmount) * damping;
      shellMaterial.opacity = 1 - structureAmount * 0.94;
      shellMaterial.depthWrite = structureAmount < 0.5;
      structureMaterial.opacity = structureAmount * 0.55;
      nodeMaterial.opacity = structureAmount;
      structure.visible = structureAmount > 0.001;
      structureNodes.visible = structure.visible;
      sculpture.rotation.x += (targetX - sculpture.rotation.x) * damping;
      sculpture.rotation.y += (targetY + autoRotation - sculpture.rotation.y) * damping;
      knotGroup.position.y = Math.sin(elapsed * 0.7) * 0.055;
      for (const { sphere, y, phase } of satellites) sphere.position.y = y + Math.sin(elapsed * 0.8 + phase) * 0.06;
      renderer.render(scene, camera);
      const settling = Math.abs(targetX - sculpture.rotation.x) > 0.0005 || Math.abs(targetY + autoRotation - sculpture.rotation.y) > 0.0005;
      if (playing || dragging || settling || Math.abs(structureTarget - structureAmount) > 0.001) frame = requestAnimationFrame(render);
    };
    const requestRender = () => {
      if (contextAvailable && !frame && visible && !document.hidden) frame = requestAnimationFrame(render);
    };

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (width < 1 || height < 1) return;
      const aspect = width / height;
      const halfHeight = Math.max(2.6, 2.45 / aspect);
      camera.left = -halfHeight * aspect;
      camera.right = halfHeight * aspect;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.render(scene, camera);
      requestRender();
    };
    new ResizeObserver(resize).observe(host);
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible && frame) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
      requestRender();
    }, { rootMargin: '80px' }).observe(host);

    toggle?.addEventListener('click', () => {
      if (!contextAvailable) return;
      playing = !playing;
      manuallyChosen = true;
      updateToggle();
      requestRender();
    });
    modeToggle?.addEventListener('click', () => {
      if (!contextAvailable) return;
      structureTarget = structureTarget ? 0 : 1;
      host.dataset.mode = structureTarget ? 'structure' : 'sculpture';
      modeToggle.setAttribute('aria-pressed', String(Boolean(structureTarget)));
      modeToggle.textContent = structureTarget ? 'Return to sculpture' : 'Explore structure';
      if (sceneStatus) sceneStatus.textContent = structureTarget ? 'Under the surface · One connected structure' : 'Drag to explore · Arrow keys to rotate';
      requestRender();
    });
    media.addEventListener('change', () => {
      if (!manuallyChosen) playing = !media.matches;
      updateToggle();
      requestRender();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
      lastTime = 0;
      requestRender();
    });
    canvas.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      dragging = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
      canvas.style.cursor = 'grabbing';
      canvas.setPointerCapture(event.pointerId);
      requestRender();
    });
    canvas.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      targetY += (event.clientX - pointerX) * 0.009;
      if (event.pointerType !== 'touch') targetX = THREE.MathUtils.clamp(targetX + (event.clientY - pointerY) * 0.006, -0.8, 0.8);
      pointerX = event.clientX;
      pointerY = event.clientY;
      requestRender();
    });
    const endDrag = () => { dragging = false; canvas.style.cursor = 'grab'; requestRender(); };
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);
    canvas.addEventListener('lostpointercapture', endDrag);
    host.addEventListener('keydown', (event) => {
      if (!contextAvailable || document.activeElement !== host || event.target !== host) return;
      const step = 0.18;
      switch (event.key) {
        case 'ArrowLeft': targetY -= step; break;
        case 'ArrowRight': targetY += step; break;
        case 'ArrowUp': targetX = THREE.MathUtils.clamp(targetX - step, -0.8, 0.8); break;
        case 'ArrowDown': targetX = THREE.MathUtils.clamp(targetX + step, -0.8, 0.8); break;
        case 'Home': targetX = 0; targetY = 0; autoRotation = 0; break;
        default: return;
      }
      event.preventDefault();
      requestRender();
    });
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      contextAvailable = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      canvas.style.display = 'none';
      showStaticArtwork();
    });

    resize();
    renderer.render(scene, camera);
    host.dataset.ready = 'true';
    host.dataset.mode = 'sculpture';
    if (modeToggle) modeToggle.disabled = false;
    host.setAttribute('tabindex', '0');
    host.setAttribute('role', 'img');
    host.setAttribute('aria-label', 'Interactive orange and chrome knot sculpture. Drag or use the arrow keys to rotate. Press Home to reset the view. Use the motion button to pause or play automatic rotation.');
    host.querySelector('.scene-fallback')?.setAttribute('aria-hidden', 'true');
    updateToggle();
    requestRender();
    host.dispatchEvent(new CustomEvent('scene-ready', { bubbles: true }));
  } catch (error) {
    renderer?.dispose();
    renderer?.domElement.remove();
    showStaticArtwork();
    // The authored fallback remains fully visible if WebGL is unavailable.
    console.info('Interactive sculpture unavailable; displaying the static artwork.');
  }
})();
