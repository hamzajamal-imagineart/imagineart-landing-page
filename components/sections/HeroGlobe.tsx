"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { withBasePath } from "@/lib/assets";

/**
 * The hero's gallery as a three.js scene, after the TwelveLabs hero (studied
 * live, 6 Oct, including how their Framer component is parameterised; this
 * is our own implementation of the same idea with our media).
 *
 * What it is: tiles sit on the latitude rings of a sphere (radius GLOBE,
 * RINGS rows, PER_RING at the equator and fewer toward the poles). Where
 * theirs stands the camera inside the sphere looking across it, ours stands
 * outside (Hamza, 6 Oct: not a replica): the whole sphere turns slowly
 * behind the headline like a planet, on a tilted axis so the rings sweep
 * diagonally. Every tile is a billboard facing the
 * camera. A tile is "lit" once it crosses onto the camera's side of the
 * sphere (its direction from the centre, dotted with the camera's, above
 * WIPE_AT; at −1, as theirs runs, that is always): its image wipes in from
 * the left and its dark cover thins (the cover is off at 0/0, as theirs).
 * Lit tiles brighten and grow as they come near (DEPTH_FAR → DEPTH_NEAR), and bob a
 * little (BOB). Tiles can carry a gradient band that sweeps across them now
 * and then (BAND_SHARE, off).
 * The pointer drifts the camera (PARALLAX) and swells tiles under it
 * (HOVER_*), and only clips under the pointer play.
 *
 * Legibility behind the copy is the globe's own job when `softCentre` is
 * set: tiles that project inside that ellipse are dimmed (and optionally
 * blurred in the shader), strongest at the centre, clear by the rim.
 *
 * Media: stills as textures and clips as video textures parked on a frame
 * partway in; a clip plays only while hovered. Both come in as props
 * (defaulting to GLOBE_IMAGES / GLOBE_CLIPS) and can be swapped live, which
 * the home hero's use-case picker does.
 * Reduced motion stops the rotation and bob. Rendering pauses while the hero
 * is out of view.
 */

export const GLOBE_IMAGES = [
  /* Photographic stills only (Hamza, 7 Oct: "best quality, best
     photographic"). Kept from the generated globe set, the corridor, the
     outcomes and the mosaic; the CG-looking and stock-looking ones were cut
     (drink splash, both headphones, speaker, sneaker dust, exploding burger,
     concept car, cpg, ecommerce, telecom selfie, podcast, puppy, kids, the
     glitter figure). Joined by the Use Cases stills, minus the Wing Theory
     and "Nocté Serum" frames (they carry marks) and the stand-ins that
     duplicate stills already here. All unbranded, no text. */
  ...["beauty", "burger", "car", "coast-road", "cocktail", "fashion-dress", "film-noir", "house", "interior", "perfume", "ring", "sprinter", "travel"].map((n) => `/media/hero/globe/${n}.jpg`),
  ...["beauty", "fashion", "food-beverage", "home-decor"].map((n) => `/media/hero/corridor/${n}.jpg`),
  ...["advertising", "product", "brand"].map((n) => `/media/outcomes/${n}.jpg`),
  ...[9, 12, 13, 15, 17, 18].map((n) => `/media/hero/mosaic/m${n}.jpg`),
  ...[1, 2, 3, 4, 8, 10, 11].map((n) => `/media/use-cases/architecture/${n}.jpg`),
  ...[5, 6, 7, 8, 9, 10, 11].map((n) => `/media/use-cases/branding/${n}.jpg`),
  ...[1, 2, 3, 5, 6, 7, 8, 9, 10, 11].map((n) => `/media/use-cases/photography/${n}.jpg`),
  ...[1, 2, 3, 4].map((n) => `/media/use-cases/product/${n}.jpg`),
  ...[1, 2, 3, 4].map((n) => `/media/use-cases/style-transfer/${n}.jpg`),
  ...[1, 2, 3, 4, 5, 6, 8].map((n) => `/media/use-cases/try-on/${n}.jpg`),
];
export const GLOBE_CLIPS = [
  "/media/capabilities/video-extend.mp4",
  "/media/studios/fashion-studio.mp4",
  "/media/capabilities/inpaint.mp4",
  "/media/hero/modes/video/3-bike.mp4",
  "/media/capabilities/music.mp4",
  "/media/templates/product-studio.mp4",
  "/media/capabilities/ugc.mp4",
  "/media/capabilities/vfx.mp4",
  "/media/templates/fashion-tryon.mp4",
  "/media/capabilities/variate.mp4",
  "/media/studios/ad-studio.mp4",
  "/media/hero/modes/video/1-prompt.mp4",
  "/media/capabilities/sketch-to-render.mp4",
  "/media/tools/motion-sync.mp4",
  "/media/capabilities/reframe-presets.mp4",
  "/media/hero/modes/video/2-fashion.mp4",
  "/media/capabilities/outfit-tryon.mp4",
  "/media/tools/ai-voiceover.mp4",
  "/media/capabilities/video-reframe.mp4",
];

/* The globe (Hamza, 6 Oct: "not a replica"). Theirs stands the camera
   inside the sphere and looks across it, which gives their strands. Ours
   stands outside: a sphere of the work turns behind the headline like a
   planet, its axis tilted so the rings sweep diagonally, near tiles bright
   and large, far ones dim and small through the gaps. */
const RINGS = 6, PER_RING = 26, GLOBE = 27;
/** Rows thin toward the poles so the pitch stays even on a true sphere. */
const ringCount = (phi: number) => Math.max(8, Math.round(PER_RING * Math.sin(phi)));
const TILE_W = 2.4, TILE_H = 1.35, CORNER = 0.18, TILE_SCALE = 2;
const ROTATION = 0.065; // rad/s
/** Axis tilt (toward the viewer, then rolled) so the rings run diagonally. */
const TILT_X = 0.42, TILT_Z = -0.3;
const GLOBE_OFFSET = new THREE.Vector3(0, -3, 0);
const CAMERA_DIST = 76, FOV = 44;
const PARALLAX = 5;
/* Every tile is lit; the only dimming is brightness by depth plus the veil
   the section draws. */
const WIPE_AT = -1, BRIGHT_MIN = 0.62, BRIGHT_MAX = 1.3;
/** Near tiles grow and far ones shrink, linearly in depth: 0.7× to 1.25×. */
const DEPTH_FAR = 0.7, DEPTH_NEAR = 1.25;
const BOB = 0.5, HOVER_RADIUS = 0.2, HOVER_SCALE = 0.18;
/* Open on hover (Hamza, 7 Oct): while the pointer is over the hero the globe
   parts at the centre so the copy has room. Each tile moves out across the
   view, away from the axis to the camera, by up to OPEN_PUSH units, the most
   for tiles nearest the middle and none past OPEN_REACH × the radius;
   OPEN_WIDE stretches the opening sideways to suit a line of text. It eases
   in and out with a time constant of OPEN_TAU seconds. */
/** No two tiles closer than this (globe units, about two rings) share an image. */
const SPREAD_DIST = 24;
const OPEN_PUSH = 16, OPEN_REACH = 1.15, OPEN_WIDE = 1.5, OPEN_TAU = 0.45;
/** The pointer has to stay over the hero this long (s) before it opens. */
const OPEN_DELAY = 0.5;
const COVER_HIDDEN = 0, COVER_LIT = 0;
/* A gradient band can sweep across tiles now and then; off (Hamza, 6 Oct:
   no gradient on the images). Raise BAND_SHARE to bring it back. */
const BAND_SHARE = 0, BAND_WIDTH = 0.98, BAND_FEATHER = 0.5, BAND_OPACITY = 0.95;
/** Page colour behind the tiles and of the dark cover (the dark hero's
    --page-bg, kept literal here because it feeds a shader uniform). */
const BG = "#0b0b0c";
/** The band's gradient, in the brand's violets rather than their greens. */
const BAND_STOPS: [number, string][] = [[0, "#c4b5fd"], [0.4, "#8a3ffc"], [0.75, "#ff8fd8"], [1, "#ffd1a1"]];

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
/** The image: texture × brightness, revealed by a soft wipe along x. The
    texture is cropped to cover the 16:9 plate (uAspect is the texture's own
    width ÷ height), so a 3:4 still is not stretched. */
const PLATE_ASPECT = TILE_W / TILE_H;
const FRAG_IMAGE = /* glsl */ `
  uniform sampler2D uMap; uniform float uProgress; uniform float uBrightness; uniform float uAspect; uniform float uBlur; uniform float uLight; varying vec2 vUv;
  void main() {
    float plate = ${(TILE_W / TILE_H).toFixed(5)};
    vec2 uv = vUv - 0.5;
    if (uAspect > plate) uv.x *= plate / uAspect; else uv.y *= uAspect / plate;
    uv += 0.5;
    // Softness behind the copy: a coarser mip level (stills) plus four
    // offset taps (which also softens clips, whose textures have no mips).
    float o = uBlur * 0.012;
    vec4 t = texture2D(uMap, uv, uBlur) * 0.4
      + (texture2D(uMap, uv + vec2(o, o), uBlur) + texture2D(uMap, uv + vec2(-o, o), uBlur)
       + texture2D(uMap, uv + vec2(o, -o), uBlur) + texture2D(uMap, uv + vec2(-o, -o), uBlur)) * 0.15;
    float soft = 0.4;
    float edge = 1.0 - uProgress * (1.0 + soft * 2.0) + soft;
    float a = smoothstep(edge - soft, edge + soft, vUv.x);
    // On a light page, dimming fades a tile toward white rather than black.
    vec3 c = uLight > 0.5 ? mix(vec3(1.0), t.rgb, clamp(uBrightness, 0.0, 1.0)) : t.rgb * uBrightness;
    gl_FragColor = vec4(c, a);
  }
`;
/** The cover: the page colour, thick on an unlit tile and thin on a lit one,
    thinning with the same wipe. */
const FRAG_COVER = /* glsl */ `
  uniform vec3 uColor; uniform float uProgress; uniform float uMin; uniform float uMax; varying vec2 vUv;
  void main() {
    float p = clamp(uProgress, 0.0, 1.0);
    float soft = 0.4;
    float edge = 1.0 - p * (1.0 + soft * 2.0) + soft;
    float f = smoothstep(edge - soft, edge + soft, vUv.x);
    float a = mix(uMin, mix(uMin, uMax, p), f);
    gl_FragColor = vec4(uColor, a);
  }
`;
/** The band: a soft horizontal stripe of the gradient sweeping down the tile. */
const FRAG_BAND = /* glsl */ `
  uniform sampler2D uGrad; uniform float uPos; uniform float uWidth; uniform float uFeather; uniform float uOpacity; varying vec2 vUv;
  void main() {
    float d = abs(vUv.y - uPos);
    float m = smoothstep(uWidth + uFeather, uWidth - uFeather, d);
    gl_FragColor = vec4(texture2D(uGrad, vec2(0.5, vUv.y)).rgb, m * uOpacity);
  }
`;

/** A rounded 16:9 plate with UVs spanning its box. */
function roundedPlate(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x, y + r);
  s.lineTo(x, y + h - r); s.quadraticCurveTo(x, y + h, x + r, y + h);
  s.lineTo(x + w - r, y + h); s.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
  s.lineTo(x + w, y + r); s.quadraticCurveTo(x + w, y, x + w - r, y);
  s.lineTo(x + r, y); s.quadraticCurveTo(x, y, x, y + r);
  const g = new THREE.ShapeGeometry(s);
  const uv = g.attributes.uv, pos = g.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) - x) / w, (pos.getY(i) - y) / h);
  uv.needsUpdate = true;
  return g;
}

function gradientTexture() {
  const c = document.createElement("canvas");
  c.width = 1; c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  BAND_STOPS.forEach(([o, col]) => g.addColorStop(o, col));
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Deterministic noise in [0, 1) from an integer. */
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

type Tile = {
  group: THREE.Group;
  image: THREE.ShaderMaterial;
  cover: THREE.ShaderMaterial;
  band: THREE.ShaderMaterial | null;
  bandAnim: { duration: number; pause: number; offset: number } | null;
  video: HTMLVideoElement | null;
  theta: number;
  ring: number;
  baseY: number;
  base: THREE.Vector3;
  progress: number;
  scale: number;
  dot: number;
  hover: number;
};

export function HeroGlobe({
  images = GLOBE_IMAGES,
  clips = GLOBE_CLIPS,
  distance = CAMERA_DIST,
  softCentre,
  light = false,
}: {
  /** Stills for the tiles. Changing the list retextures the globe in place. */
  images?: string[];
  /** Clips for the tiles (play only under the pointer). Empty for none. */
  clips?: string[];
  /** Camera distance from the globe's centre; larger shows more of it. */
  distance?: number;
  /** Quieten tiles that project behind the copy: an ellipse of half-widths
      rx, ry in clip space (1 = the frame's half-size); `dim` is how much
      brightness is taken at the centre (0–1) and `blur` the mip levels of
      blur there (0 for none). Off when omitted. */
  softCentre?: { rx: number; ry: number; dim?: number; blur?: number };
  /** On a light page: dimmed and far tiles fade toward white, not black. */
  light?: boolean;
} = {}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  /** The scene's "swap the media" hook, set once the scene exists. */
  const applyRef = useRef<((images: string[], clips: string[]) => void) | null>(null);
  const initial = useRef({ images, clips, distance, light });
  const softRef = useRef(softCentre);
  softRef.current = softCentre;

  useEffect(() => {
    const host = hostRef.current, canvas = canvasRef.current;
    if (!host || !canvas) return;
    const { images: images0, clips: clips0, distance: distance0 } = initial.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hover = window.matchMedia("(hover: hover)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.sortObjects = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 300);
    camera.position.set(0, 0, distance0);
    const tilt = new THREE.Group();
    tilt.position.copy(GLOBE_OFFSET);
    tilt.rotation.set(TILT_X, 0, TILT_Z);
    scene.add(tilt);
    const globe = new THREE.Group();
    tilt.add(globe);

    /* Media: every still as a texture, every clip as a video texture parked
       partway in. Tiles take media in a shuffled, deterministic order.
       applyMedia builds the set and hands it to the tiles; it runs once here
       and again whenever the images/clips props change. */
    const loader = new THREE.TextureLoader();
    /** Texture aspect (w ÷ h) per media item, filled in as each loads. */
    const aspects = new Map<THREE.Texture, number>();
    type Clip = { video: HTMLVideoElement; texture: THREE.VideoTexture };
    const media = { stills: [] as THREE.Texture[], clips: [] as Clip[] };
    const loadStills = (srcs: string[]) => srcs.map((src) => {
      const t = loader.load(withBasePath(src), (tex) => { const im = tex.image as HTMLImageElement; if (im?.width && im?.height) aspects.set(tex, im.width / im.height); });
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearMipmapLinearFilter; // mips: the centre blur reads coarser levels
      t.generateMipmaps = true;
      return t;
    });
    const loadClips = (srcs: string[]) => srcs.map((src, i) => {
      const v = document.createElement("video");
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = "auto";
      v.src = withBasePath(src);
      const t = new THREE.VideoTexture(v);
      v.addEventListener("loadedmetadata", () => {
        v.currentTime = Math.min(v.duration * (0.2 + 0.6 * hash(i + 3)), Math.max(0, v.duration - 0.5));
        if (v.videoWidth && v.videoHeight) aspects.set(t, v.videoWidth / v.videoHeight);
      }, { once: true });
      v.load();
      return { video: v, texture: t };
    });
    const disposeMedia = () => {
      media.clips.forEach((c) => { c.video.pause(); c.video.removeAttribute("src"); c.video.load(); c.texture.dispose(); });
      media.stills.forEach((t) => { aspects.delete(t); t.dispose(); });
      media.stills = []; media.clips = [];
    };
    /** A shuffled, deterministic assignment of `count` media items over `total` tiles. */
    const shuffledOrder = (total: number, count: number) => {
      const order = Array.from({ length: total }, (_, i) => i % Math.max(1, count));
      for (let i = total - 1; i > 0; i--) { const j = Math.floor(hash(i * 31 + 7 + 42) * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      return order;
    };

    /* Media per tile, kept apart (Hamza, 7 Oct: repeats were landing side by
       side): tiles are visited in a shuffled order and each takes the
       least-used item that no tile within SPREAD_DIST already shows, falling
       back to the least-used overall only if every item is nearby. */
    const spreadOrder = (count: number) => {
      const n = tiles.length, out = new Array<number>(n).fill(-1);
      if (count <= 0) return out;
      const visit = shuffledOrder(n, n);
      const uses = new Array<number>(count).fill(0);
      const rank = Array.from({ length: count }, (_, k) => hash(k * 17 + 5));
      const d2 = SPREAD_DIST * SPREAD_DIST;
      for (const i of visit) {
        const near = new Set<number>();
        for (let j = 0; j < n; j++) if (out[j] >= 0 && tiles[j].base.distanceToSquared(tiles[i].base) < d2) near.add(out[j]);
        let best = -1;
        for (const pass of [true, false]) {
          for (let k = 0; k < count; k++) {
            if (pass && near.has(k)) continue;
            if (best < 0 || uses[k] < uses[best] || (uses[k] === uses[best] && rank[k] < rank[best])) best = k;
          }
          if (best >= 0) break;
        }
        out[i] = best; uses[best]++;
      }
      return out;
    };

    const counts = Array.from({ length: RINGS }, (_, r) => ringCount(((r + 1) / (RINGS + 1)) * Math.PI));
    const total = counts.reduce((a, b) => a + b, 0);

    const plate = roundedPlate(TILE_W, TILE_H, TILE_H * CORNER);
    const grad = gradientTexture();
    const bg = new THREE.Color(BG);
    const tiles: Tile[] = [];
    let n = -1;
    for (let r = 0; r < RINGS; r++) {
      const phi = ((r + 1) / (RINGS + 1)) * Math.PI;
      const per = counts[r];
      for (let k = 0; k < per; k++) {
        n++;
        // Alternate rings are offset by half a step so tiles brick rather than stack.
        const theta = ((k + (r % 2) * 0.5) / per) * Math.PI * 2;
        const ringR = Math.sin(phi) * GLOBE;
        const x = Math.cos(theta) * ringR, y = Math.cos(phi) * GLOBE, z = Math.sin(theta) * ringR;
        const image = new THREE.ShaderMaterial({ uniforms: { uMap: { value: null }, uProgress: { value: 0 }, uBrightness: { value: 1 }, uAspect: { value: PLATE_ASPECT }, uBlur: { value: 0 }, uLight: { value: initial.current.light ? 1 : 0 } }, vertexShader: VERT, fragmentShader: FRAG_IMAGE, transparent: true, depthWrite: false, side: THREE.DoubleSide });
        const cover = new THREE.ShaderMaterial({ uniforms: { uColor: { value: bg.clone() }, uProgress: { value: 0 }, uMin: { value: COVER_HIDDEN }, uMax: { value: COVER_LIT } }, vertexShader: VERT, fragmentShader: FRAG_COVER, transparent: true, depthWrite: false, side: THREE.DoubleSide });
        const seed = n * 7 + 13;
        const hasBand = hash(seed + 99) < BAND_SHARE;
        const band = hasBand ? new THREE.ShaderMaterial({ uniforms: { uGrad: { value: grad }, uPos: { value: -2.5 }, uWidth: { value: BAND_WIDTH }, uFeather: { value: BAND_FEATHER }, uOpacity: { value: 0 } }, vertexShader: VERT, fragmentShader: FRAG_BAND, transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide }) : null;
        const group = new THREE.Group();
        const mi = new THREE.Mesh(plate, image); mi.position.z = 0.002; mi.renderOrder = 1; group.add(mi);
        if (COVER_HIDDEN > 0 || COVER_LIT > 0) { const mc = new THREE.Mesh(plate, cover); mc.position.z = 0.006; mc.renderOrder = 2; group.add(mc); }
        if (band) { const mb = new THREE.Mesh(plate, band); mb.position.z = 0.004; mb.renderOrder = 3; group.add(mb); }
        group.position.set(x, y, z);
        globe.add(group);
        tiles.push({
          group, image, cover, band,
          bandAnim: band ? { duration: 2.5 + hash(seed + 1) * 2, pause: 3 + hash(seed + 2) * 7, offset: hash(seed) * 10 } : null,
          video: null, theta, ring: r, baseY: y, base: new THREE.Vector3(x, y, z), progress: 0, scale: 1, dot: 0, hover: 0,
        });
      }
    }

    const applyMedia = (imgs: string[], cls: string[]) => {
      disposeMedia();
      media.stills = loadStills(imgs);
      media.clips = loadClips(cls);
      const items = [
        ...media.stills.map((texture) => ({ texture, video: null as HTMLVideoElement | null })),
        ...media.clips.map((c) => ({ texture: c.texture as THREE.Texture, video: c.video as HTMLVideoElement | null })),
      ];
      const order = spreadOrder(items.length);
      tiles.forEach((tile, i) => {
        const m = items[order[i]];
        tile.image.uniforms.uMap.value = m?.texture ?? null;
        tile.video = m?.video ?? null;
      });
    };
    applyMedia(images0, clips0);
    applyRef.current = applyMedia;

    /* Pointer: -1..1 across the window for the camera drift, and across the
       hero for the hover swell. */
    const mouse = { x: 0, y: 0 }, pointer = { x: 9999, y: 9999 };
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      const b = host.getBoundingClientRect();
      if (b.width > 0 && b.height > 0) { pointer.x = ((e.clientX - b.left) / b.width) * 2 - 1; pointer.y = -((e.clientY - b.top) / b.height) * 2 + 1; }
    };
    const onLeave = () => { pointer.x = 9999; pointer.y = 9999; };
    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (w > 0 && h > 0) { camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false); }
    };
    resize();
    window.addEventListener("resize", resize);
    if (hover) {
      window.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
    }

    /* Run only while on screen. (Hidden tabs need no gate of their own:
       the browser stops animation frames there, and some embedded views
       report "hidden" while still painting.) */
    let inView = true, running = false, frame = 0;
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); });
    io.observe(host);

    const clock = new THREE.Clock();
    const camDir = new THREE.Vector3(), toCam = new THREE.Vector3(), globeWorld = new THREE.Vector3(), tileWorld = new THREE.Vector3(), tileDir = new THREE.Vector3(), proj = new THREE.Vector3();
    const globeQuatInv = new THREE.Quaternion(), globeQuat = new THREE.Quaternion();
    const camRight = new THREE.Vector3(), camUp = new THREE.Vector3(), lat = new THREE.Vector3(), pos = new THREE.Vector3();
    let open = 0, insideFor = 0;
    let disposed = false;

    const tick = () => {
      if (disposed || !running) return;
      frame = requestAnimationFrame(tick);
      const dt = clock.getDelta();
      const t = clock.elapsedTime;
      const step = Math.min(dt, 0.05);

      if (!reduced) globe.rotation.y -= dt * ROTATION;
      const targetX = hover ? mouse.x * PARALLAX : 0;
      const targetY = hover ? mouse.y * PARALLAX * 0.5 : 0;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(GLOBE_OFFSET);
      scene.updateMatrixWorld(true);
      camera.updateMatrixWorld(true);

      globe.getWorldPosition(globeWorld);
      toCam.subVectors(camera.position, globeWorld).normalize();
      camera.getWorldDirection(camDir);
      globe.getWorldQuaternion(globeQuat);
      globeQuatInv.copy(globeQuat).invert();
      const aspect = camera.aspect || 1;
      // Open while the pointer is over the hero, eased both ways.
      const inside = hover && !reduced && Math.abs(pointer.x) <= 1 && Math.abs(pointer.y) <= 1;
      insideFor = inside ? insideFor + step : 0;
      open += ((insideFor >= OPEN_DELAY ? 1 : 0) - open) * (1 - Math.exp(-step / OPEN_TAU));
      const openE = open * open * (3 - 2 * open);
      camRight.setFromMatrixColumn(camera.matrixWorld, 0);
      camUp.setFromMatrixColumn(camera.matrixWorld, 1);
      const playing: Record<string, HTMLVideoElement> = {};

      for (const tile of tiles) {
        tileWorld.setFromMatrixPosition(tile.group.matrixWorld);
        tileDir.subVectors(tileWorld, globeWorld).normalize();
        tile.dot = tileDir.dot(toCam);
        const lit = tile.dot > WIPE_AT;
        let hv = 0, soft = 0;
        proj.copy(tileWorld).project(camera);
        const onScreen = proj.z >= -1 && proj.z <= 1;
        if (lit && hover && onScreen) {
          const dx = (proj.x - pointer.x) * aspect, dy = proj.y - pointer.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < HOVER_RADIUS) { const w = 1 - d / HOVER_RADIUS; hv = w * w * (3 - 2 * w); }
        }
        const sc = softRef.current;
        if (sc && onScreen) {
          // 0 at the ellipse's rim and beyond, 1 at its centre, eased.
          const e = (proj.x / sc.rx) ** 2 + (proj.y / sc.ry) ** 2;
          if (e < 1) { const w = 1 - Math.sqrt(e); soft = w * w * (3 - 2 * w); }
        }
        tile.hover = hv;
        tile.image.uniforms.uBlur.value = soft * (sc?.blur ?? 0);

        // Face the camera: undo the globe's turn, then take the camera's facing.
        tile.group.quaternion.copy(globeQuatInv).multiply(camera.quaternion);
        tile.progress += ((lit ? 1 : 0) - tile.progress) * step * 3;
        tile.image.uniforms.uProgress.value = tile.progress;
        tile.cover.uniforms.uProgress.value = tile.progress;
        tile.image.uniforms.uBrightness.value = (BRIGHT_MIN + ((tile.dot + 1) * 0.5) * (BRIGHT_MAX - BRIGHT_MIN)) * (1 - soft * (sc?.dim ?? 0.5));
        tile.image.uniforms.uAspect.value = aspects.get(tile.image.uniforms.uMap.value as THREE.Texture) ?? PLATE_ASPECT;

        if (tile.band && tile.bandAnim) {
          const a = tile.bandAnim, cycle = a.duration + a.pause, at = (t + a.offset) % cycle;
          if (at < a.duration) { tile.band.uniforms.uPos.value = -2.5 + (at / a.duration) * 6; tile.band.uniforms.uOpacity.value = BAND_OPACITY; }
          else { tile.band.uniforms.uPos.value = -2.5; tile.band.uniforms.uOpacity.value = 0; }
        }

        pos.copy(tile.base);
        if (!reduced) pos.y += Math.sin(tile.theta * 3 + t * 0.2 + tile.ring * 0.8) * BOB;
        if (openE > 0.001) {
          // Out across the view: the tile's offset from the camera axis, in
          // the camera's right/up plane, pushed further out, widest sideways.
          pos.applyMatrix4(globe.matrixWorld);
          lat.subVectors(pos, globeWorld);
          const lx = lat.dot(camRight), ly = lat.dot(camUp);
          const r = Math.sqrt((lx / OPEN_WIDE) ** 2 + ly * ly) || 0.0001;
          const f = Math.max(0, 1 - r / (GLOBE * OPEN_REACH));
          const push = openE * OPEN_PUSH * f;
          pos.addScaledVector(camRight, (lx / r) * push);
          pos.addScaledVector(camUp, (ly / r) * push);
          globe.worldToLocal(pos);
        }
        tile.group.position.copy(pos);

        // Near tiles grow, far ones shrink.
        const depth = DEPTH_FAR + ((tile.dot + 1) * 0.5) * (DEPTH_NEAR - DEPTH_FAR);
        tile.scale += ((1 + tile.hover * HOVER_SCALE) - tile.scale) * step * 10;
        tile.group.scale.setScalar(TILE_SCALE * tile.scale * depth);

        if (tile.video && tile.hover > 0.25) playing[tile.video.src] = tile.video;
      }
      for (const c of media.clips) {
        if (playing[c.video.src]) { if (c.video.paused) c.video.play().catch(() => {}); }
        else if (!c.video.paused) c.video.pause();
      }
      renderer.render(scene, camera);
    };
    function sync() {
      const should = inView;
      if (should && !running) { running = true; clock.getDelta(); tick(); }
      else if (!should && running) { running = false; cancelAnimationFrame(frame); }
    }
    sync();
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __hg?: unknown }).__hg = { scene, camera, globe, tiles, renderer, get running() { return running; } };
    }

    return () => {
      disposed = true; running = false;
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      applyRef.current = null;
      disposeMedia();
      grad.dispose();
      plate.dispose();
      tiles.forEach((tile) => { tile.image.dispose(); tile.cover.dispose(); tile.band?.dispose(); });
      renderer.dispose();
    };
  }, []);

  /* Retexture in place when the media props change (the first set is applied
     by the scene effect above). */
  const imagesKey = images.join("|"), clipsKey = clips.join("|");
  useEffect(() => {
    if (imagesKey === initial.current.images.join("|") && clipsKey === initial.current.clips.join("|")) return;
    applyRef.current?.(images, clips);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagesKey, clipsKey]);

  return (
    <div ref={hostRef} className="hg-host" aria-hidden>
      <canvas ref={canvasRef} className="hg-canvas" />
    </div>
  );
}
