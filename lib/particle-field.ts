import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";

export interface ParticleField {
  setColor(css: string): void;
  dispose(): void;
}

const CAMERA_Z = 60;
const FOV = 50;
const DEPTH = 15;
const MAX_ALPHA = 0.35;

// Browser-only and framework-free so the component can `import()` it lazily and keep
// three out of the initial client chunk. Returns null without WebGL, which leaves the CSS
// dot grid behind the canvas as the fallback.
export function mountParticleField(canvas: HTMLCanvasElement): ParticleField | null {
  const parent = canvas.parentElement;
  if (!parent) return null;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 200);
  camera.position.z = CAMERA_Z;
  const group = new Group();
  scene.add(group);

  const count = parent.clientWidth < 768 ? 45 : 90;
  const color = new Color(0x3b82f6);
  // Half extents of the box that fills the view at z = 0; refreshed on every resize.
  // Seeded from the container's aspect so the first spread is not a square in the middle.
  let halfH = Math.tan((FOV * Math.PI) / 360) * CAMERA_Z;
  let halfW = halfH * (Math.max(parent.clientWidth, 1) / Math.max(parent.clientHeight, 1));
  // Per-axis bounce limits, kept in step with halfW/halfH by resize() so tick() allocates nothing.
  const bounds = [halfW, halfH, DEPTH];

  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() * 2 - 1) * (i % 3 === 0 ? halfW : i % 3 === 1 ? halfH : DEPTH);
    velocities[i] = (Math.random() - 0.5) * 2.4;
  }

  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 32;
  const sctx = sprite.getContext("2d")!;
  const glow = sctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  glow.addColorStop(0, "rgba(255,255,255,1)");
  glow.addColorStop(0.5, "rgba(255,255,255,0.8)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  sctx.fillStyle = glow;
  sctx.fillRect(0, 0, 32, 32);
  const texture = new CanvasTexture(sprite);

  const pointGeo = new BufferGeometry();
  pointGeo.setAttribute("position", new BufferAttribute(positions, 3));
  const pointMat = new PointsMaterial({
    color,
    size: 1.4,
    sizeAttenuation: true,
    map: texture,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
  });
  group.add(new Points(pointGeo, pointMat));

  const maxPairs = (count * (count - 1)) / 2;
  const linePos = new BufferAttribute(new Float32Array(maxPairs * 6), 3);
  const lineCol = new BufferAttribute(new Float32Array(maxPairs * 8), 4);
  const lineGeo = new BufferGeometry();
  lineGeo.setAttribute("position", linePos);
  lineGeo.setAttribute("color", lineCol);
  lineGeo.setDrawRange(0, 0);
  const lineMat = new LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    depthWrite: false,
  });
  const lines = new LineSegments(lineGeo, lineMat);
  lines.frustumCulled = false;
  group.add(lines);

  const resize = () => {
    const w = Math.max(parent.clientWidth, 1);
    const h = Math.max(parent.clientHeight, 1);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    halfH = Math.tan((FOV * Math.PI) / 360) * CAMERA_Z;
    halfW = halfH * camera.aspect;
    bounds[0] = halfW;
    bounds[1] = halfH;
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(parent);
  resize();

  const target = { x: 0, y: 0 };
  const onPointerMove = (e: PointerEvent) => {
    target.y = (e.clientX / window.innerWidth - 0.5) * 0.3;
    target.x = (e.clientY / window.innerHeight - 0.5) * 0.3;
  };
  const finePointer = !window.matchMedia("(pointer: coarse)").matches;
  if (finePointer) window.addEventListener("pointermove", onPointerMove, { passive: true });

  let last = performance.now();
  let drift = 0;
  let firstFrame = true;
  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    for (let i = 0; i < count * 3; i++) {
      positions[i] += velocities[i] * dt;
      const b = bounds[i % 3];
      // Reflect only when heading outward: a point stranded outside a box that shrank on
      // resize then walks back in instead of flipping direction every frame.
      if ((positions[i] > b && velocities[i] > 0) || (positions[i] < -b && velocities[i] < 0)) {
        velocities[i] *= -1;
      }
    }
    pointGeo.attributes.position.needsUpdate = true;

    const threshold = halfH * 0.5;
    const t2 = threshold * threshold;
    let segments = 0;
    for (let a = 0; a < count; a++) {
      for (let b = a + 1; b < count; b++) {
        const dx = positions[a * 3] - positions[b * 3];
        const dy = positions[a * 3 + 1] - positions[b * 3 + 1];
        const dz = positions[a * 3 + 2] - positions[b * 3 + 2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 >= t2) continue;
        const alpha = (1 - Math.sqrt(d2) / threshold) * MAX_ALPHA;
        const o = segments * 2;
        linePos.setXYZ(o, positions[a * 3], positions[a * 3 + 1], positions[a * 3 + 2]);
        linePos.setXYZ(o + 1, positions[b * 3], positions[b * 3 + 1], positions[b * 3 + 2]);
        lineCol.setXYZW(o, color.r, color.g, color.b, alpha);
        lineCol.setXYZW(o + 1, color.r, color.g, color.b, alpha);
        segments++;
      }
    }
    lineGeo.setDrawRange(0, segments * 2);
    linePos.needsUpdate = true;
    lineCol.needsUpdate = true;

    drift += dt * 0.03;
    const k = 1 - Math.exp(-dt * 3);
    group.rotation.x += (target.x - group.rotation.x) * k;
    group.rotation.y += (target.y + Math.sin(drift) * 0.1 - group.rotation.y) * k;

    renderer.render(scene, camera);
    if (firstFrame) {
      firstFrame = false;
      canvas.dataset.ready = "";
    }
  };

  let inView = true;
  const sync = () => {
    if (inView && !document.hidden) {
      last = performance.now();
      renderer.setAnimationLoop(tick);
    } else {
      renderer.setAnimationLoop(null);
    }
  };
  const intersection = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  });
  intersection.observe(parent);
  document.addEventListener("visibilitychange", sync);
  sync();

  // `Color` cannot parse oklch(), so let the browser resolve the token to sRGB bytes.
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const pctx = probe.getContext("2d", { willReadFrequently: true })!;

  return {
    setColor(css) {
      if (!css) return;
      pctx.clearRect(0, 0, 1, 1);
      pctx.fillStyle = css;
      pctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = pctx.getImageData(0, 0, 1, 1).data;
      color.setRGB(r / 255, g / 255, b / 255, SRGBColorSpace);
      pointMat.color.copy(color);
    },
    dispose() {
      renderer.setAnimationLoop(null);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", sync);
      resizeObserver.disconnect();
      intersection.disconnect();
      pointGeo.dispose();
      lineGeo.dispose();
      pointMat.dispose();
      lineMat.dispose();
      texture.dispose();
      renderer.dispose();
      // dispose() frees three's resources but not the context itself; browsers cap live
      // contexts (~16), and every client-side return to `/` mounts a fresh canvas.
      renderer.forceContextLoss();
    },
  };
}
