import * as THREE from "./assets/vendor/three.module.js";

const host = document.querySelector("#scene");
const motion = document.querySelector("#motion");
const reset = document.querySelector("#reset-scene");
const preference = matchMedia("(prefers-reduced-motion: reduce)");
const fallback = host.firstElementChild;
let paused = preference.matches;
let renderer;
function updateMotion() {
  motion.textContent = paused ? "Resume motion" : "Pause motion";
  motion.setAttribute("aria-pressed", String(paused));
}
updateMotion();

try {
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute("aria-hidden", "true");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
  camera.position.set(0, 0.35, 10.4);
  camera.lookAt(0, 0, 0);

  // Locally generated studio lighting gives the metal broad, curved reflections.
  const studio = document.createElement("canvas");
  studio.width = 1024;
  studio.height = 512;
  const ctx = studio.getContext("2d");
  ctx.fillStyle = "#141c25";
  ctx.fillRect(0, 0, 1024, 512);
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, "#e6f3ff");
  gradient.addColorStop(0.24, "#7c92ac");
  gradient.addColorStop(0.48, "#090e16");
  gradient.addColorStop(0.7, "#435363");
  gradient.addColorStop(1, "#101825");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 512);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(80, 30, 170, 235);
  ctx.fillRect(570, 70, 60, 340);
  ctx.fillStyle = "#91bedf";
  ctx.fillRect(760, 170, 195, 115);
  const envSource = new THREE.CanvasTexture(studio);
  envSource.mapping = THREE.EquirectangularReflectionMapping;
  envSource.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromEquirectangular(envSource);
  scene.environment = environment.texture;
  envSource.dispose();
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xe4efff, 0x101a28, 2));
  const light = new THREE.DirectionalLight(0xffffff, 4);
  light.position.set(-3, 5, 5);
  scene.add(light);
  const rim = new THREE.DirectionalLight(0xa5d9ff, 2.5);
  rim.position.set(4, -2, -2);
  scene.add(rim);

  const sculpture = new THREE.Group();
  sculpture.rotation.set(0.22, -0.3, -0.3);
  scene.add(sculpture);
  const chrome = new THREE.MeshStandardMaterial({
    color: 0xd9e5f0,
    metalness: 1,
    roughness: 0.16,
    envMapIntensity: 1.7,
  });
  const darkChrome = new THREE.MeshStandardMaterial({
    color: 0x6589a6,
    metalness: 0.9,
    roughness: 0.24,
  });
  const ice = new THREE.MeshStandardMaterial({
    color: 0xb6def8,
    roughness: 0.18,
    metalness: 0.55,
    emissive: 0x426a9a,
    emissiveIntensity: 0.16,
  });
  function ring(radius, tube, material, x, y, z) {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, 24, 128),
      material,
    );
    mesh.rotation.set(x, y, z);
    sculpture.add(mesh);
    return mesh;
  }
  const ribbon = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.45, 0.36, 240, 32, 2, 3),
    chrome,
  );
  ribbon.rotation.set(0.5, -0.3, 0.25);
  sculpture.add(ribbon);
  ring(2.65, 0.012, darkChrome, 1.22, 0.1, -0.4);
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.43, 2), ice);
  sculpture.add(core);
  const coreEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(core.geometry),
    new THREE.LineBasicMaterial({
      color: 0xe3f5ff,
      transparent: true,
      opacity: 0.22,
    }),
  );
  core.add(coreEdges);
  const orbit = new THREE.Group();
  orbit.rotation.set(1.22, 0.1, -0.4);
  sculpture.add(orbit);
  const satellite = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 16), ice);
  satellite.position.set(2.65, 0, 0);
  orbit.add(satellite);
  const satellite2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 16, 12),
    chrome,
  );
  satellite2.position.set(-1.9, 1.1, 0.4);
  sculpture.add(satellite2);

  const particles = [];
  // Deterministic placement keeps the composition consistent across visits.
  for (let i = 0; i < 95; i++) {
    const angle = i * 2.39996;
    const radius = 2.55 + (((i * 17) % 29) / 29) * 0.9;
    particles.push(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      -1.4 + (i % 7) * 0.28,
    );
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(particles, 3),
  );
  const stars = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0xabc9df,
      size: 0.014,
      transparent: true,
      opacity: 0.6,
    }),
  );
  scene.add(stars);

  let inView = true;
  let lost = false;
  let frame = 0;
  let previousTime = 0;
  let elapsed = 0;
  let yaw = -0.3;
  let pitch = 0.22;
  let dragging = false;
  let previousX = 0;
  let previousY = 0;
  function draw() {
    renderer.render(scene, camera);
  }
  function animate(time) {
    frame = 0;
    if (paused || !inView || document.hidden || lost) return;
    const delta = previousTime
      ? Math.min((time - previousTime) / 1000, 0.05)
      : 0;
    previousTime = time;
    elapsed += delta;
    if (!dragging) yaw += delta * 0.075;
    sculpture.rotation.set(pitch, yaw, -0.3);
    sculpture.position.y = Math.sin(elapsed * 0.65) * 0.065;
    core.rotation.y = elapsed * 0.12;
    orbit.rotation.z = -0.4 + elapsed * 0.18;
    draw();
    frame = requestAnimationFrame(animate);
  }
  function schedule() {
    cancelAnimationFrame(frame);
    previousTime = 0;
    frame = 0;
    if (!paused && inView && !document.hidden && !lost)
      frame = requestAnimationFrame(animate);
  }
  function resize() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    camera.aspect = width / height;
    // Fit the full sculpture on portrait screens, not just its center.
    camera.position.z = camera.aspect < 0.9 ? 11.7 : 10.4;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    draw();
  }
  resize();
  host.appendChild(renderer.domElement);
  fallback.hidden = true;
  host.dataset.ready = "true";
  motion.disabled = false;
  reset.disabled = false;
  document.querySelector("#scene-help").textContent =
    "Drag to rotate · Arrow keys to explore";
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    schedule();
  }).observe(host);
  document.addEventListener("visibilitychange", schedule);
  motion.addEventListener("click", () => {
    paused = !paused;
    updateMotion();
    schedule();
  });
  preference.addEventListener("change", (event) => {
    paused = event.matches;
    updateMotion();
    schedule();
  });
  reset.addEventListener("click", () => {
    yaw = -0.3;
    pitch = 0.22;
    elapsed = 0;
    sculpture.rotation.set(pitch, yaw, -0.3);
    sculpture.position.y = 0;
    core.rotation.y = 0;
    orbit.rotation.z = -0.4;
    draw();
  });
  host.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    dragging = true;
    previousX = event.clientX;
    previousY = event.clientY;
    host.setPointerCapture(event.pointerId);
  });
  host.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    yaw += (event.clientX - previousX) * 0.008;
    pitch = THREE.MathUtils.clamp(
      pitch + (event.clientY - previousY) * 0.005,
      -1.1,
      1.1,
    );
    previousX = event.clientX;
    previousY = event.clientY;
    sculpture.rotation.set(pitch, yaw, -0.3);
    draw();
  });
  for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
    host.addEventListener(event, () => {
      dragging = false;
    });
  host.addEventListener("keydown", (event) => {
    if (
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(
        event.key,
      )
    )
      return;
    event.preventDefault();
    if (event.key === "Home") {
      yaw = -0.3;
      pitch = 0.22;
    }
    if (event.key === "ArrowLeft") yaw -= 0.15;
    if (event.key === "ArrowRight") yaw += 0.15;
    if (event.key === "ArrowUp") pitch -= 0.1;
    if (event.key === "ArrowDown") pitch += 0.1;
    pitch = THREE.MathUtils.clamp(pitch, -1.1, 1.1);
    sculpture.rotation.set(pitch, yaw, -0.3);
    draw();
  });
  renderer.domElement.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    lost = true;
    schedule();
    renderer.domElement.hidden = true;
    fallback.hidden = false;
    motion.disabled = true;
    reset.disabled = true;
    document.querySelector("#scene-help").textContent =
      "Static view · 3D temporarily unavailable";
  });
  renderer.domElement.addEventListener("webglcontextrestored", () => {
    lost = false;
    renderer.domElement.hidden = false;
    fallback.hidden = true;
    motion.disabled = false;
    reset.disabled = false;
    document.querySelector("#scene-help").textContent =
      "Drag to rotate · Arrow keys to explore";
    resize();
    schedule();
  });
  schedule();
} catch (error) {
  renderer?.dispose();
  document.querySelector("#scene-help").textContent =
    "Static chrome study · 3D unavailable";
  host.setAttribute("aria-label", "Static chrome sculpture");
  host.removeAttribute("tabindex");
  motion.disabled = true;
  reset.disabled = true;
  fallback.hidden = false;
}
