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
 * and then (BAND_SHARE; on again since 8 Oct).
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
     duplicate stills already here. Blank mockups and abstracts dropped too
     (Hamza, 7 Oct: branding 5–7 and 9–11, photography 6, try-on 8). All
     unbranded, no text. */
  ...["beauty", "burger", "car", "coast-road", "cocktail", "fashion-dress", "film-noir", "house", "interior", "perfume", "ring", "sprinter", "travel"].map((n) => `/media/hero/globe/${n}.jpg`),
  ...["beauty", "fashion", "food-beverage", "home-decor"].map((n) => `/media/hero/corridor/${n}.jpg`),
  ...["advertising", "product", "brand"].map((n) => `/media/outcomes/${n}.jpg`),
  ...[9, 12, 13, 15, 17, 18].map((n) => `/media/hero/mosaic/m${n}.jpg`),
  ...[1, 2, 3, 4, 8, 10, 11].map((n) => `/media/use-cases/architecture/${n}.jpg`),
  ...[8].map((n) => `/media/use-cases/branding/${n}.jpg`),
  ...[1, 2, 3, 5, 7, 8, 9, 10, 11].map((n) => `/media/use-cases/photography/${n}.jpg`),
  ...[1, 2, 3, 4].map((n) => `/media/use-cases/product/${n}.jpg`),
  ...[1, 2, 3, 4].map((n) => `/media/use-cases/style-transfer/${n}.jpg`),
  ...[1, 2, 3, 4, 5, 6].map((n) => `/media/use-cases/try-on/${n}.jpg`),
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
/* TILT_X was 0.42 (toward the viewer); that swung the globe's empty north
   pole into the upper front, so the big near tiles all sat low and the top
   read thin (Hamza, 8 Oct: "more images at the bottom"). Level now, with
   the roll kept so the rings still run on a diagonal. */
const TILT_X = 0, TILT_Z = -0.3;
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
/* Always open (home hero, Hamza, 7 Oct): the globe sits opened at rest, as it
   used to only on hover. Once the pointer has stayed over the hero for
   BLOOM_DELAY seconds it parts further, the push growing by BLOOM_EXTRA ×
   (16 → 24 units), eased with BLOOM_TAU, and eases back when the pointer
   leaves. No further opening on touch screens or under reduced motion. */
const BLOOM_DELAY = 1, BLOOM_EXTRA = 0.5, BLOOM_TAU = 0.6;
/* Other shapes for the hero variants (Hamza, 7 Oct). The same tiles,
   billboarding, depth shading, hover and opening; only where tiles sit
   changes. `radius` is the shape's reach, which the depth shading and the
   opening measure against.

   spiral (/hero-3): a disc of SPIRAL_ARMS arms winding out from the centre,
   tiles small at the core and full size at the rim, tipped toward the
   viewer and turning.

   hourglass (/hero-4): tiles on an hourglass round a vertical axis, wide at
   the top, pinched in the middle, wide again at the foot. They stream
   downward at HG_FLOW of the height a second while the shape turns, so
   images come round to the front; each fades in at the top and out at the
   bottom, where it wraps. */
/* corridor (/hero-8; Hamza, 8 Oct): two walls of tiles, one each side, run
   away from the viewer to a vanishing point behind the copy. Tiles drift
   along them at CO_FLOW units a second, out of the centre, small, toward the
   edges of the screen, large (see CO_REVERSE), and wrap; they fade in and
   out at both ends. CO_ROWS lanes per wall, CO_WALL out from the
   centre, spanning CO_NEAR to CO_FAR in depth. */
const CO_ROWS = [-15, -5, 5, 15], CO_PER_LANE = 11, CO_WALL = 21, CO_NEAR = 54, CO_FAR = -90, CO_FLOW = 3.2, CO_FADE = 0.12;
/** Depth on the corridor is measured against this (it stands in for a radius). */
const CO_DEPTH_SCALE = 60;
/* Curved and reversed (Hamza, 8 Oct): the walls bend in as they recede
   (CO_BEND units by the far end, on a square so the curve tightens with
   distance) and the lanes draw together vertically (CO_PINCH of their
   height), so each lane reads as an arc; and the stream now runs outward,
   from the vanishing point behind the copy toward the viewer (CO_REVERSE). */
const CO_BEND = 11, CO_PINCH = 0.4, CO_REVERSE = true;
const corridorAt = (u: number, side: number, row: number) => ({
  x: side * (CO_WALL - CO_BEND * u * u),
  y: CO_ROWS[row] * (1 - CO_PINCH * u),
  z: CO_NEAR - u * (CO_NEAR - CO_FAR),
});
export type GlobeShape = "globe" | "spiral" | "hourglass" | "corridor";
const SPIRAL_ARMS = 3, SPIRAL_PER_ARM = 34, SPIRAL_R0 = 4, SPIRAL_R1 = 42, SPIRAL_TURNS = 1.15;
/* Spiral, tuned (Hamza, 7 Oct): it turns at SPIRAL_ROTATION (slower than the
   globe), tiles grow from SPIRAL_SIZE_MIN× at the core to SPIRAL_SIZE_MAX× at
   the rim, and the core ones are blurred, SPIRAL_BLUR mip levels at the very
   centre easing to none by SPIRAL_SHARP_AT of the way out. */
const SPIRAL_ROTATION = 0.025, SPIRAL_SIZE_MIN = 0.32, SPIRAL_SIZE_MAX = 1.3, SPIRAL_BLUR = 3.2, SPIRAL_SHARP_AT = 0.6;
const HG_ROWS = 9, HG_PER_ROW = 13, HG_H = 36, HG_R_MIN = 9, HG_R_MAX = 36, HG_FLOW = 0.018, HG_FADE = 0.09;
const SHAPES: Record<GlobeShape, { radius: number; tilt: [number, number]; offset: THREE.Vector3 }> = {
  globe: { radius: GLOBE, tilt: [TILT_X, TILT_Z], offset: GLOBE_OFFSET },
  spiral: { radius: SPIRAL_R1, tilt: [1.0, -0.18], offset: new THREE.Vector3(0, 3, 0) },
  hourglass: { radius: HG_R_MAX, tilt: [0.06, 0], offset: new THREE.Vector3(0, 0, 0) },
  corridor: { radius: CO_DEPTH_SCALE, tilt: [0, 0], offset: new THREE.Vector3(0, 0, 0) },
};
/** Where each tile sits: position, ring and angle for the bob, a size
    factor, and (hourglass) its place down the height, 0 at the top. */
type Point = { x: number; y: number; z: number; theta: number; ring: number; size: number; u: number };
const hourglassAt = (u: number, theta: number) => {
  const w = (2 * u - 1) ** 2;
  const r = HG_R_MIN + (HG_R_MAX - HG_R_MIN) * w;
  return { x: Math.cos(theta) * r, y: HG_H - u * 2 * HG_H, z: Math.sin(theta) * r, size: 0.8 + 0.35 * w };
};
function layout(shape: GlobeShape): Point[] {
  const pts: Point[] = [];
  if (shape === "spiral") {
    for (let a = 0; a < SPIRAL_ARMS; a++) for (let k = 0; k < SPIRAL_PER_ARM; k++) {
      const t = (k + 0.5) / SPIRAL_PER_ARM;
      const r = SPIRAL_R0 + (SPIRAL_R1 - SPIRAL_R0) * Math.sqrt(t);
      const theta = (a / SPIRAL_ARMS) * Math.PI * 2 + t * SPIRAL_TURNS * Math.PI * 2;
      // `u` carries how far out the tile is (0 core, 1 rim) for the blur.
      const out = Math.sqrt(t);
      pts.push({ x: Math.cos(theta) * r, y: (hash(a * 97 + k) - 0.5) * 1.5, z: Math.sin(theta) * r, theta, ring: a, size: SPIRAL_SIZE_MIN + (SPIRAL_SIZE_MAX - SPIRAL_SIZE_MIN) * out, u: out });
    }
  } else if (shape === "corridor") {
    // `theta` carries the side (-1 or 1), `ring` the lane, `u` the place
    // along it; lanes are offset so tiles don't line up across rows.
    for (const side of [-1, 1]) for (let row = 0; row < CO_ROWS.length; row++) for (let k = 0; k < CO_PER_LANE; k++) {
      const u = (k + hash(row * 7 + (side > 0 ? 3 : 0)) ) / CO_PER_LANE % 1;
      const p = corridorAt(u, side, row);
      pts.push({ ...p, theta: side, ring: row, size: 1, u });
    }
  } else if (shape === "hourglass") {
    for (let row = 0; row < HG_ROWS; row++) for (let k = 0; k < HG_PER_ROW; k++) {
      const u = (row + 0.5) / HG_ROWS;
      const theta = ((k + (row % 2) * 0.5) / HG_PER_ROW) * Math.PI * 2;
      const p = hourglassAt(u, theta);
      pts.push({ ...p, theta, ring: row, u });
    }
  } else {
    for (let r = 0; r < RINGS; r++) {
      const phi = ((r + 1) / (RINGS + 1)) * Math.PI;
      const per = ringCount(phi);
      for (let k = 0; k < per; k++) {
        // Alternate rings are offset by half a step so tiles brick rather than stack.
        const theta = ((k + (r % 2) * 0.5) / per) * Math.PI * 2;
        const ringR = Math.sin(phi) * GLOBE;
        pts.push({ x: Math.cos(theta) * ringR, y: Math.cos(phi) * GLOBE, z: Math.sin(theta) * ringR, theta, ring: r, size: 1, u: 0 });
      }
    }
  }
  return pts;
}
/* Morph (/hero-7; Hamza, 7 Oct, to a reference): at rest a few tiles stand
   as tall cards in two loose stacks at the screen's edges, the rest of the
   globe hidden; held over for OPEN_DELAY they fly into the globe, opened up
   as the home hero's is on hover, while the
   others grow in around them, and fly back out when the pointer leaves.
   Each card: x, y in screen space (-1..1), its height as a share of the
   screen at its distance, and that distance from the camera. MORPH_ASPECT
   is the cards' w ÷ h. */
const MORPH_ASPECT = 0.75;
/** The morph waits longer than the home hover before it forms (Hamza, 7 Oct). */
const MORPH_DELAY = 1.2;
/* The cards' own stills (Hamza, 8 Oct): the globe's are sized for small
   tiles and went soft at card size, so the cards have a set of their own,
   generated for them in ImagineArt at 3:4 and saved at 1080×1440. Bright,
   candid sport, nature and lifestyle frames, after a reference. By card
   (see MORPH_CARDS); the four front-column cards get the strongest. */
export const MORPH_IMAGES = [
  "horse", "hummingbird", "dunk", "steps", "bridge", "gymnast", "quarterback", "driver",
  "summit", "dancer", "surfer", "skier", "meadow", "tennis", "cyclist", "climber",
].map((n) => `/media/hero/cards/${n}.jpg`);
const MORPH_CARDS: { x: number; y: number; h: number; d: number }[] = [
  // Left: an outer column half off the edge, a front column, an inner one.
  { x: -1.02, y: 0.5, h: 0.34, d: 60 }, { x: -1.0, y: -0.3, h: 0.34, d: 60 },
  { x: -0.8, y: 0.62, h: 0.42, d: 52 }, { x: -0.8, y: -0.1, h: 0.42, d: 52 }, { x: -0.84, y: -0.82, h: 0.3, d: 58 },
  { x: -0.6, y: 0.38, h: 0.36, d: 56 }, { x: -0.6, y: -0.32, h: 0.36, d: 56 }, { x: -0.5, y: 0.02, h: 0.26, d: 62 },
  // Right, mirrored and staggered.
  { x: 1.02, y: 0.6, h: 0.36, d: 60 }, { x: 1.0, y: -0.2, h: 0.36, d: 60 },
  { x: 0.8, y: 0.45, h: 0.42, d: 52 }, { x: 0.8, y: -0.28, h: 0.42, d: 52 }, { x: 0.86, y: -0.86, h: 0.3, d: 58 },
  { x: 0.6, y: 0.3, h: 0.34, d: 56 }, { x: 0.62, y: -0.42, h: 0.3, d: 58 }, { x: 0.5, y: 0.66, h: 0.24, d: 62 },
];
/** Depth of field: tiles nearer than DOF_SHARP (on the -1..1 depth scale)
    are sharp; blur rises to the `depthBlur` prop at the very back. */
const DOF_SHARP = 0.35;
const COVER_HIDDEN = 0, COVER_LIT = 0;
/* A gradient glow on tiles now and then (Hamza, 8 Oct, after TwelveLabs; it
   was off since 6 Oct): BAND_SHARE of the tiles each, on their own clock,
   wash over with the section washes' pastel gradient that swells to
   BAND_OPACITY and fades away, the image still showing through, then rest. */
const BAND_SHARE = 0.3, BAND_WIDTH = 0.98, BAND_FEATHER = 0.5, BAND_OPACITY = 0.85;
/** Page colour behind the tiles and of the dark cover (the dark hero's
    --page-bg, kept literal here because it feeds a shader uniform). */
const BG = "#0b0b0c";
/** The glow's gradient, top to bottom (Hamza, 8 Oct: no purple, no
    orange, something that sits with the brand violet): the section washes'
    pastels, green, butter, peach and lilac (the --wash-* tokens, literal
    here for the shader), matching the headline's "workspace". */
const BAND_STOPS: [number, string][] = [[0, "#cfe8a6"], [0.35, "#ecdf9f"], [0.7, "#f7d3a6"], [1, "#ecd2f6"]];

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
/** The image: texture × brightness, revealed by a soft wipe along x. The
    texture is cropped to cover the 16:9 plate (uAspect is the texture's own
    width ÷ height), so a 3:4 still is not stretched. */
const PLATE_ASPECT = TILE_W / TILE_H;
const FRAG_IMAGE = /* glsl */ `
  uniform sampler2D uMap; uniform float uProgress; uniform float uBrightness; uniform float uAspect; uniform float uBlur; uniform float uLight; uniform float uPlate; uniform float uReady; varying vec2 vUv;
  void main() {
    // The plate's own shape (w ÷ h): 16:9 on the globe, taller while the
    // morph hero holds its cards upright.
    float plate = uPlate;
    vec2 uv = vUv - 0.5;
    if (uAspect > plate) uv.x *= plate / uAspect; else uv.y *= uAspect / plate;
    uv += 0.5;
    // Softness (behind the copy, and with depth on the home hero): a coarser
    // mip level plus a 13-tap disc in two rings, which smooths out the mip's
    // blockiness so it reads as a lens blur rather than pixelation.
    vec4 t;
    if (uBlur < 0.05) {
      t = texture2D(uMap, uv);
    } else {
      float o = uBlur * 0.008;
      t = texture2D(uMap, uv, uBlur) * 0.16;
      for (int k = 0; k < 6; k++) {
        float ang = float(k) * 1.0472;
        vec2 d = vec2(cos(ang), sin(ang));
        t += texture2D(uMap, clamp(uv + d * o, 0.0, 1.0), uBlur) * 0.08;
        t += texture2D(uMap, clamp(uv + d.yx * vec2(1.0, -1.0) * o * 2.0, 0.0, 1.0), uBlur) * 0.06;
      }
    }
    float soft = 0.4;
    float edge = 1.0 - uProgress * (1.0 + soft * 2.0) + soft;
    float a = smoothstep(edge - soft, edge + soft, vUv.x);
    // On a light page, dimming fades a tile toward white rather than black.
    vec3 c = uLight > 0.5 ? mix(vec3(1.0), t.rgb, clamp(uBrightness, 0.0, 1.0)) : t.rgb * uBrightness;
    // Hidden until its still has loaded, then faded in (uReady), so a
    // tile is never a dark plate while it waits.
    gl_FragColor = vec4(c, a * uReady);
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
    // The whole tile at once (uPos, uWidth and uFeather are unused since the
    // sweep became a swell).
    gl_FragColor = vec4(texture2D(uGrad, vec2(0.5, vUv.y)).rgb, uOpacity);
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
  /** Morph hero: this tile's card at rest, or -1 if it only joins the globe. */
  card: number;
  /** Size factor from the shape (smaller at the spiral's core). */
  size: number;
  /** Hourglass: place down the height, 0–1, advancing as tiles stream. */
  u: number;
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
  shape = "globe",
  parted,
  morph = false,
  alwaysOpen = false,
  depthBlur = 0,
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
  /** Where the tiles sit: the globe, a spiral disc, or a streaming hourglass. */
  shape?: GlobeShape;
  /** Held open all the time (/hero-6): the tiles part sideways into two
      wings either side of the copy, leaving a clear band `push` units each
      side of centre; tiles out to `wide` × the radius are squeezed outward.
      Hover no longer changes it. */
  parted?: { push: number; wide: number };
  /** Cards at the edges that become the globe on hover (/hero-7). */
  morph?: boolean;
  /** Depth-of-field blur at the back of the globe, in mip levels (0 = off). */
  depthBlur?: number;
  /** Opened from the start, then opened further after BLOOM_DELAY (home). */
  alwaysOpen?: boolean;
} = {}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  /** The scene's "swap the media" hook, set once the scene exists. */
  const applyRef = useRef<((images: string[], clips: string[]) => void) | null>(null);
  const initial = useRef({ images, clips, distance, light, shape, parted, morph, alwaysOpen });
  const softRef = useRef(softCentre);
  softRef.current = softCentre;

  useEffect(() => {
    const host = hostRef.current, canvas = canvasRef.current;
    if (!host || !canvas) return;
    const { images: images0, clips: clips0, distance: distance0, shape: shape0 } = initial.current;
    const form = SHAPES[shape0];
    const held = !!initial.current.parted || initial.current.alwaysOpen;
    const bloomOn = initial.current.alwaysOpen && !initial.current.parted;
    const morph = initial.current.morph;
    const tanHalf = Math.tan((FOV / 2) * Math.PI / 180);
    const ray = new THREE.Vector3(), cardAt = new THREE.Vector3();
    const openPush = initial.current.parted?.push ?? OPEN_PUSH, openWide = initial.current.parted?.wide ?? OPEN_WIDE;
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
    tilt.position.copy(form.offset);
    tilt.rotation.set(form.tilt[0], 0, form.tilt[1]);
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

    const points = layout(shape0);

    const plate = roundedPlate(TILE_W, TILE_H, TILE_H * CORNER);
    const grad = gradientTexture();
    const bg = new THREE.Color(BG);
    const tiles: Tile[] = [];
    points.forEach((pt, n) => {
      {
        const { x, y, z, theta, ring: r } = pt;
        const image = new THREE.ShaderMaterial({ uniforms: { uMap: { value: null }, uProgress: { value: 0 }, uBrightness: { value: 1 }, uAspect: { value: PLATE_ASPECT }, uBlur: { value: 0 }, uLight: { value: initial.current.light ? 1 : 0 }, uPlate: { value: PLATE_ASPECT }, uReady: { value: 0 } }, vertexShader: VERT, fragmentShader: FRAG_IMAGE, transparent: true, depthWrite: false, side: THREE.DoubleSide });
        const cover = new THREE.ShaderMaterial({ uniforms: { uColor: { value: bg.clone() }, uProgress: { value: 0 }, uMin: { value: COVER_HIDDEN }, uMax: { value: COVER_LIT } }, vertexShader: VERT, fragmentShader: FRAG_COVER, transparent: true, depthWrite: false, side: THREE.DoubleSide });
        const seed = n * 7 + 13;
        const hasBand = hash(seed + 99) < BAND_SHARE;
        const band = hasBand ? new THREE.ShaderMaterial({ uniforms: { uGrad: { value: grad }, uPos: { value: -2.5 }, uWidth: { value: BAND_WIDTH }, uFeather: { value: BAND_FEATHER }, uOpacity: { value: 0 } }, vertexShader: VERT, fragmentShader: FRAG_BAND, transparent: true, depthWrite: false, side: THREE.DoubleSide }) : null;
        const group = new THREE.Group();
        const mi = new THREE.Mesh(plate, image); mi.position.z = 0.002; mi.renderOrder = 1; group.add(mi);
        if (COVER_HIDDEN > 0 || COVER_LIT > 0) { const mc = new THREE.Mesh(plate, cover); mc.position.z = 0.006; mc.renderOrder = 2; group.add(mc); }
        if (band) { const mb = new THREE.Mesh(plate, band); mb.position.z = 0.004; mb.renderOrder = 1; group.add(mb); }
        group.position.set(x, y, z);
        globe.add(group);
        tiles.push({
          group, image, cover, band,
          bandAnim: band ? { duration: 2.5 + hash(seed + 1) * 2, pause: 3 + hash(seed + 2) * 7, offset: hash(seed) * 10 } : null,
          video: null, theta, ring: r, baseY: y, base: new THREE.Vector3(x, y, z), card: -1, size: pt.size, u: pt.u, progress: 0, scale: 1, dot: 0, hover: 0,
        });
      }
    });

    // Morph: spread the cards over the tile list so their images differ.
    if (initial.current.morph) MORPH_CARDS.forEach((_, k) => { const i = Math.floor((k + 0.5) * tiles.length / MORPH_CARDS.length); tiles[i].card = k; });

    // Morph: the cards' own stills, loaded once and kept across retextures.
    const cardTex = initial.current.morph ? loadStills(MORPH_IMAGES) : [];

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
        if (tile.card >= 0 && cardTex[tile.card]) { tile.image.uniforms.uMap.value = cardTex[tile.card]; tile.video = null; }
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
    let open = 0, insideFor = 0, lastOpen = -1, bloom = 0;
    const stage = (host.closest("section") as HTMLElement | null) ?? host;
    let disposed = false;

    const tick = () => {
      if (disposed || !running) return;
      frame = requestAnimationFrame(tick);
      const dt = clock.getDelta();
      const t = clock.elapsedTime;
      const step = Math.min(dt, 0.05);

      if (!reduced && shape0 !== "corridor") globe.rotation.y -= dt * (shape0 === "spiral" ? SPIRAL_ROTATION : ROTATION);
      const targetX = hover ? mouse.x * PARALLAX : 0;
      const targetY = hover ? mouse.y * PARALLAX * 0.5 : 0;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(form.offset);
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
      open = held ? 1 : open + ((insideFor >= (morph ? MORPH_DELAY : OPEN_DELAY) ? 1 : 0) - open) * (1 - Math.exp(-step / OPEN_TAU));
      const openE = open * open * (3 - 2 * open);
      // Always-open globe: part further after BLOOM_DELAY of hover.
      if (bloomOn) bloom += ((insideFor >= BLOOM_DELAY ? 1 : 0) - bloom) * (1 - Math.exp(-step / BLOOM_TAU));
      const bloomE = bloom * bloom * (3 - 2 * bloom);
      // Tell the section how open the globe is (--globe-open, 0–1), so
      // overlays behind the copy can clear as it parts (Hamza, 7 Oct).
      if (Math.abs(openE - lastOpen) > 0.002 || (openE === 0 && lastOpen !== 0)) {
        lastOpen = openE;
        stage.style.setProperty("--globe-open", openE.toFixed(3));
      }
      camRight.setFromMatrixColumn(camera.matrixWorld, 0);
      camUp.setFromMatrixColumn(camera.matrixWorld, 1);
      const playing: Record<string, HTMLVideoElement> = {};

      for (const tile of tiles) {
        tileWorld.setFromMatrixPosition(tile.group.matrixWorld);
        // Depth: how far toward the camera, against the shape's reach (on the
        // globe this is the same cosine as before; it also serves the disc
        // and the hourglass, whose tiles are not all one distance out).
        tileDir.subVectors(tileWorld, globeWorld);
        tile.dot = Math.max(-1, Math.min(1, tileDir.dot(toCam) / form.radius));
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
          // Clears as the globe opens: the parted tiles show sharp and full.
          if (e < 1) { const w = 1 - Math.sqrt(e); soft = w * w * (3 - 2 * w) * (morph ? openE : 1 - openE); }
        }
        tile.hover = hv;
        let coreBlur = 0;
        if (shape0 === "spiral") { const k = Math.max(0, 1 - tile.u / SPIRAL_SHARP_AT); coreBlur = SPIRAL_BLUR * k * k; }
        // Depth of field (Hamza, 8 Oct, after TwelveLabs): tiles on the far
        // side of the globe go soft, the near ones stay sharp.
        let dof = 0;
        if (depthBlur > 0) { const far = Math.max(0, Math.min(1, (DOF_SHARP - tile.dot) / (DOF_SHARP + 1))); dof = depthBlur * far * far * (3 - 2 * far); }
        tile.image.uniforms.uBlur.value = Math.max(soft * (sc?.blur ?? 0), coreBlur, dof);

        // Face the camera: undo the globe's turn, then take the camera's facing.
        tile.group.quaternion.copy(globeQuatInv).multiply(camera.quaternion);
        tile.progress += ((lit ? 1 : 0) - tile.progress) * step * 3;
        tile.image.uniforms.uProgress.value = tile.progress;
        tile.cover.uniforms.uProgress.value = tile.progress;
        tile.image.uniforms.uBrightness.value = (BRIGHT_MIN + ((tile.dot + 1) * 0.5) * (BRIGHT_MAX - BRIGHT_MIN)) * (1 - soft * (sc?.dim ?? 0.5));
        const mapTex = tile.image.uniforms.uMap.value as THREE.Texture | null;
        tile.image.uniforms.uAspect.value = (mapTex && aspects.get(mapTex)) ?? PLATE_ASPECT;
        // Fade a tile in once its still is there (clips count as ready).
        const loaded = !!mapTex && (aspects.has(mapTex) || !!tile.video);
        const ready = tile.image.uniforms.uReady;
        ready.value = loaded ? Math.min(1, ready.value + step * 2.5) : 0;

        if (tile.band && tile.bandAnim) {
          const a = tile.bandAnim, cycle = a.duration + a.pause, at = (t + a.offset) % cycle;
          // Swell in and out on a sine over the duration, then rest.
          tile.band.uniforms.uOpacity.value = (at < a.duration ? BAND_OPACITY * Math.sin((at / a.duration) * Math.PI) : 0) * ready.value;
        }

        // Hourglass: stream down, wrapping at the foot, faded at both ends.
        let ends = 1;
        if (shape0 === "hourglass") {
          if (!reduced) tile.u = (tile.u + step * HG_FLOW) % 1;
          const p = hourglassAt(tile.u, tile.theta);
          tile.base.set(p.x, p.y, p.z); tile.size = p.size;
          const a = Math.min(1, tile.u / HG_FADE, (1 - tile.u) / HG_FADE);
          ends = a * a * (3 - 2 * a);
          tile.image.uniforms.uBrightness.value *= ends;
        } else if (shape0 === "corridor") {
          if (!reduced) tile.u = (tile.u + (CO_REVERSE ? -1 : 1) * step * CO_FLOW / (CO_NEAR - CO_FAR) + 1) % 1;
          const p = corridorAt(tile.u, tile.theta, tile.ring);
          tile.base.set(p.x, p.y, p.z);
          const a = Math.min(1, tile.u / CO_FADE, (1 - tile.u) / CO_FADE);
          ends = a * a * (3 - 2 * a);
          tile.image.uniforms.uBrightness.value *= ends;
        }
        pos.copy(tile.base);
        if (!reduced) pos.y += Math.sin(tile.theta * 3 + t * 0.2 + tile.ring * 0.8) * BOB;
        let cardScale = -1, cardPlate = PLATE_ASPECT;
        if (morph) {
          // Between the card at the edge (rest) and the tile's place on the
          // globe opened up as on the home hero's hover (Hamza, 7 Oct: the
          // expanded globe, not the compact one), both in world space.
          pos.applyMatrix4(globe.matrixWorld);
          lat.subVectors(pos, globeWorld);
          const lx = lat.dot(camRight), ly = lat.dot(camUp);
          const r = Math.sqrt((lx / OPEN_WIDE) ** 2 + ly * ly) || 0.0001;
          const f = Math.max(0, 1 - r / (form.radius * OPEN_REACH));
          pos.addScaledVector(camRight, (lx / r) * OPEN_PUSH * f);
          pos.addScaledVector(camUp, (ly / r) * OPEN_PUSH * f);
          if (tile.card >= 0) {
            const c = MORPH_CARDS[tile.card];
            ray.set(c.x, c.y, 0.5).unproject(camera).sub(camera.position).normalize();
            cardAt.copy(camera.position).addScaledVector(ray, c.d);
            if (!reduced) cardAt.y += Math.sin(t * 0.5 + tile.card * 1.7) * 0.35;
            pos.lerpVectors(cardAt, pos, openE);
            cardScale = (c.h * 2 * c.d * tanHalf) / TILE_H; // card height in plate units
          }
          globe.worldToLocal(pos);
        } else if (openE > 0.001) {
          // Out across the view: the tile's offset from the camera axis, in
          // the camera's right/up plane, pushed further out, widest sideways.
          pos.applyMatrix4(globe.matrixWorld);
          lat.subVectors(pos, globeWorld);
          const lx = lat.dot(camRight), ly = lat.dot(camUp);
          if (held && !bloomOn) {
            // Parted for good: sideways only, so the tiles gather into two
            // full-height wings. The span 0..reach is squeezed into
            // push..reach, so nothing lands inside the clear band and the
            // tiles keep their order.
            const reach = form.radius * openWide;
            const f = Math.max(0, 1 - Math.abs(lx) / reach);
            pos.addScaledVector(camRight, (lx < 0 ? -1 : 1) * openPush * f);
          } else {
            const r = Math.sqrt((lx / openWide) ** 2 + ly * ly) || 0.0001;
            const f = Math.max(0, 1 - r / (form.radius * OPEN_REACH));
            const push = openE * openPush * f * (1 + BLOOM_EXTRA * bloomE);
            pos.addScaledVector(camRight, (lx / r) * push);
            pos.addScaledVector(camUp, (ly / r) * push);
          }
          globe.worldToLocal(pos);
        }
        tile.group.position.copy(pos);

        // Near tiles grow, far ones shrink.
        const depth = DEPTH_FAR + ((tile.dot + 1) * 0.5) * (DEPTH_NEAR - DEPTH_FAR);
        tile.scale += ((1 + tile.hover * HOVER_SCALE) - tile.scale) * step * 10;
        const g = TILE_SCALE * tile.scale * depth * tile.size * (0.6 + 0.4 * ends);
        if (morph && cardScale > 0) {
          // A card: tall at rest, easing to the globe's 16:9 tile.
          const sy = cardScale + (g - cardScale) * openE;
          const sx = cardScale * MORPH_ASPECT * (TILE_H / TILE_W) + (g - cardScale * MORPH_ASPECT * (TILE_H / TILE_W)) * openE;
          tile.group.scale.set(sx, sy, 1);
          cardPlate = (sx * TILE_W) / (sy * TILE_H);
          tile.image.uniforms.uBrightness.value = 1 + (tile.image.uniforms.uBrightness.value - 1) * openE;
        } else if (morph) {
          // Not a card: grows in only as the globe forms.
          tile.group.scale.setScalar(Math.max(0.0001, g * openE));
        } else {
          tile.group.scale.setScalar(g);
        }
        tile.image.uniforms.uPlate.value = cardPlate;

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
      cardTex.forEach((t) => t.dispose());
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
