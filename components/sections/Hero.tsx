import { withBasePath } from "@/lib/assets";
import { START_HREF } from "@/lib/links";
import { PlatformStrip } from "@/components/sections/Platform";
import { CorridorDrift } from "@/components/sections/CorridorDrift";

/**
 * Hero (Hamza, 6 Oct): the wordmark, a two-line claim, one line and the
 * purple "Start creating for free" centred between two walls of the
 * product's work receding toward the middle, like standing in a corridor of
 * screens.
 *
 * Real 3D: the stage has one perspective, and each column is a panel turned
 * 90° to stand on a wall plane at x = ±44vw, set at its own depth, so nearer
 * columns land tall at the screen edge and deeper ones shorter toward the
 * middle. Lengths are in vw, so it holds its proportions at any width.
 *
 * Deliberately irregular ("random mix and match"): each wall is built from its
 * own seeded sequence (identical on every build, no hydration mismatch), so
 * spacing, length, height, vertical offset, frame count and image order vary
 * and the walls do not mirror. It runs about 230vw deep.
 *
 * Made smoother after the TwelveLabs comparison: rounded frames, depth of
 * field (deeper columns soften as well as fade), a soft shadow under the near
 * frames, and a slight drift of the vanishing point with the pointer
 * (<CorridorDrift>).
 *
 * It keeps moving (Hamza, 6 Oct): every column walks slowly toward the
 * viewer and loops back to the far end, a quarter of them faster on a lane
 * just inside the wall; fog and blur are keyframed along the trip.
 * The copy sits on a soft pool of the page colour so it reads whatever
 * passes behind it.
 */
/** Ten industry images generated in ImagineArt for the corridor (Nano Banana
    Pro, 2K, 6 Oct), one per Industries category, interleaved with the
    eighteen mosaic tiles. */
const INDUSTRY = ["fashion", "cpg", "fast-food", "food-beverage", "home-decor", "electronics", "beauty", "automotive", "telecom", "ecommerce"].map((n) => `/media/hero/corridor/${n}.jpg`);
// m8 and m10 are abstract gradients, not work; left out of the corridor.
const MOSAIC = [3, 9, 12, 1, 13, 5, 15, 6, 11, 2, 17, 14, 4, 18, 7, 16].map((n) => `/media/hero/mosaic/m${n}.jpg`);
const IMAGES = MOSAIC.flatMap((m, i) => (i < INDUSTRY.length ? [INDUSTRY[i], m] : [m]));
/**
 * The corridor, deliberately irregular (Hamza, 6 Oct: "shouldn't feel like
 * perfect order, random mix and match"). Each wall is built from its own
 * seeded random sequence, so the two sides do not mirror and every build is
 * the same (no hydration mismatch): column spacing, length, height, vertical
 * offset, frame count and frame proportions all vary, and images are dealt
 * in a shuffled order.
 *
 * Depths run from just in front of the screen (cut by the viewport edge) to
 * about 230vw back toward the vanishing point; past ~36vw the columns fade
 * into the dark (fog), and the copy sits on a soft pool of the page colour
 * so it reads whatever passes behind it.
 */
type Col = { z: number; len: number; h: number; dy: number; rows: number[]; fast: boolean };

function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function buildWall(seed: number): Col[] {
  const r = rng(seed);
  const out: Col[] = [];
  let z = -6 - r() * 3;
  while (z < 230) {
    const deep = Math.max(0, z) / 230;
    const len = (7 + r() * 8) * (1 + deep * 2.2);
    const h = 24 + r() * 16;                 // 24–40vw tall
    const dy = (r() - 0.5) * 9;              // ±4.5vw off centre
    const n = 2 + Math.floor(r() * 3);       // 2–4 frames
    const rows = Array.from({ length: n }, () => 0.6 + r() * 0.9);
    out.push({ z: z + len / 2, len, h, dy, rows, fast: r() < 0.25 });
    z += len + (4 + r() * 8) * (1 + deep * 2.5); // never tight: 4vw minimum
  }
  return out;
}
const WALLS = { l: buildWall(7), r: buildWall(19) };

function shuffled<T>(arr: T[], seed: number) {
  const r = rng(seed), a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const DECK = { l: shuffled(IMAGES, 3), r: shuffled(IMAGES, 11) };

/** Fog: full strength to 36vw deep, down to 0.3 by 80vw, then to 0.1. */
const fog = (z: number) =>
  z <= 36 ? 1 : z <= 80 ? 1 - ((z - 36) / 44) * 0.7 : Math.max(0.1, 0.3 - ((z - 80) / 150) * 0.2);
/** The walk: every column travels from FAR (deep) to NEAR (past the screen
    edge) and loops. SLOW is the trip in seconds; a quarter of the columns
    are FAST, and ride a lane 3vw inside the wall so they overtake without
    passing through the slower panels. A column's negative delay is its
    current depth as a share of the trip, so on load each sits where the
    static layout put it. */
const FAR = 230, NEAR = -30, SLOW = 90, FAST = 58;
const phase = (z: number) => (FAR - z) / (FAR - NEAR);

/** Depth of field: sharp to 30vw, softening to 3px by 120vw. */
const dof = (z: number) => (z <= 30 ? 0 : Math.min(3, ((z - 30) / 90) * 3));

export function Hero() {
  const wall = (side: "l" | "r") => {
    let img = 0;
    return WALLS[side].map((c, i) => {
      const blur = dof(c.z);
      return (
        <span
          key={`${side}${i}`}
          className={`hc-col hc-${side}`}
          style={{
            ["--sx" as string]: `${(side === "l" ? -1 : 1) * (c.fast ? 41 : 44)}vw`,
            ["--ry" as string]: side === "l" ? "90deg" : "-90deg",
            animationDuration: `${c.fast ? FAST : SLOW}s`,
            animationDelay: `${(-phase(c.z) * (c.fast ? FAST : SLOW)).toFixed(2)}s`,
            ["--z" as string]: `${c.z.toFixed(2)}vw`,
            ["--len" as string]: `${c.len.toFixed(2)}vw`,
            ["--h" as string]: `${c.h.toFixed(2)}vw`,
            ["--dy" as string]: `${c.dy.toFixed(2)}vw`,
            opacity: Number(fog(c.z).toFixed(3)),
            filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
          }}
        >
          {c.rows.map((g, k) => (
            <span key={k} className="hc-frame" style={{ flexGrow: Number(g.toFixed(3)) }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath(DECK[side][img++ % DECK[side].length])} alt="" />
            </span>
          ))}
        </span>
      );
    });
  };

  return (
    <>
      <section id="top" className="hc">
        <span className="hs-dots hs-dots-l" aria-hidden />
        <span className="hs-dots hs-dots-r" aria-hidden />

        <CorridorDrift />
        <div className="hc-stage" aria-hidden>
          {wall("l")}
          {wall("r")}
        </div>

        <div className="hc-copy">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hc-logo hc-logo-on-dark" src={withBasePath("/media/imagine-art-wordmark-dark.svg")} alt="ImagineArt" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hc-logo hc-logo-on-light" src={withBasePath("/media/imagine-art-wordmark.svg")} alt="" aria-hidden />
          <h1 className="hc-title"><span className="hc-line">Generate, animate, and edit</span><span className="hc-line hc-muted">at scale. One Canvas</span></h1>
          <p className="hc-lede">
            Every leading model for image, video and audio in one workspace, with your brand held
            across every output and the security and admin controls your organisation needs.
          </p>
          <a href={START_HREF} className="hs-cta">
            Start creating for free
            <svg width="13" height="12" viewBox="0 0 12 11" fill="none" aria-hidden>
              <path d="M11.17 5.5H1M7.75 10l3.585-3.97c.53-.53.54-.52 0-1.06L7.75 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </a>
        </div>
      </section>

      <div className="hs-strip">
        <div className="container-page">
          <PlatformStrip />
        </div>
      </div>

      <style>{`
        .hc {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          height: max(100svh, 720px);
          max-height: 1000px;
          display: grid;
          place-items: center;
          padding-top: 64px;
          background: var(--page-bg);
        }
        /* Halftone at the edges: a dot grid on each side, fading out toward
           the middle and patchy along its length. */
        .hs-dots {
          position: absolute;
          top: 0; bottom: 0;
          width: clamp(64px, 12vw, 200px);
          z-index: 0;
          pointer-events: none;
          background: radial-gradient(circle, var(--ink-heading) 1.1px, transparent 1.5px) 0 0 / 12px 12px;
          opacity: 0.32;
        }
        .hs-dots-l {
          left: 0;
          -webkit-mask-image: linear-gradient(to right, #000 0%, rgba(0, 0, 0, 0.5) 45%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 12%, rgba(0, 0, 0, 0.35) 40%, #000 62%, transparent 100%);
          -webkit-mask-composite: source-in;
          mask-image: linear-gradient(to right, #000 0%, rgba(0, 0, 0, 0.5) 45%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 12%, rgba(0, 0, 0, 0.35) 40%, #000 62%, transparent 100%);
          mask-composite: intersect;
        }
        .hs-dots-r {
          right: 0;
          -webkit-mask-image: linear-gradient(to left, #000 0%, rgba(0, 0, 0, 0.5) 45%, transparent 100%), linear-gradient(to bottom, #000 0%, rgba(0, 0, 0, 0.35) 30%, #000 55%, rgba(0, 0, 0, 0.2) 80%, #000 100%);
          -webkit-mask-composite: source-in;
          mask-image: linear-gradient(to left, #000 0%, rgba(0, 0, 0, 0.5) 45%, transparent 100%), linear-gradient(to bottom, #000 0%, rgba(0, 0, 0, 0.35) 30%, #000 55%, rgba(0, 0, 0, 0.2) 80%, #000 100%);
          mask-composite: intersect;
        }

        /* One perspective for the whole corridor. The vanishing point drifts
           a little with the pointer (--px, --py from <CorridorDrift>). */
        .hc-stage {
          --px: 0; --py: 0;
          position: absolute;
          inset: 64px 0 0;
          z-index: 1;
          perspective: 48vw;
          perspective-origin: calc(50% + var(--px) * 3vw) calc(50% + var(--py) * 2vw);
          transition: perspective-origin 900ms cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }
        /* A column: a panel --len long (along the wall) and --h tall, turned
           to stand on the wall plane and pushed to its depth. */
        .hc-col {
          position: absolute;
          left: 50%;
          top: 50%;
          width: var(--len);
          height: var(--h);
          margin-left: calc(var(--len) / -2);
          margin-top: calc(var(--h) / -2 + var(--dy));
          display: flex;
          flex-direction: column;
          gap: 1.6vw;
        }
        /* Static placement (and the reduced-motion state): each column at its
           own depth on its wall. */
        .hc-col { transform: translateX(var(--sx)) translateZ(calc(var(--z) * -1)) rotateY(var(--ry)); }
        /* The walk, FAR → NEAR. Opacity and blur follow depth: z = 230 − 260p,
           so fog lifts past ~62% and the blur clears by ~77%. The first 4%
           fades in so the loop's jump back to the far end is never seen. */
        .hc-col {
          animation-name: hc-walk;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
        @keyframes hc-walk {
          0%   { transform: translateX(var(--sx)) translateZ(-230vw) rotateY(var(--ry)); opacity: 0;    filter: blur(3px); }
          4%   {                                                                          opacity: 0.1; }
          42%  {                                                                          opacity: 0.16; filter: blur(3px); }
          62%  {                                                                          opacity: 0.3; }
          77%  {                                                                          filter: blur(0); }
          81%  {                                                                          opacity: 1; }
          100% { transform: translateX(var(--sx)) translateZ(30vw) rotateY(var(--ry));   opacity: 1;    filter: blur(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hc-col { animation: none; }
        }
        .hc-frame {
          position: relative;
          flex-basis: 0;
          min-height: 0;
          overflow: hidden;
          border-radius: calc(0.9vw * var(--corner));
          background: var(--tile);
          box-shadow: 0 0.8vw 2.4vw rgba(0, 0, 0, 0.35);
        }
        .hc-frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
        @media (prefers-reduced-motion: reduce) {
          .hc-stage { transition: none; }
        }



        /* A soft pool of the page colour behind the copy: the corridor runs
           back behind it, and this keeps the type on near-solid ground. */
        .hc-copy::before {
          content: "";
          position: absolute;
          inset: -40% -34%;
          z-index: -1;
          background: radial-gradient(closest-side, var(--page-bg) 72%, color-mix(in srgb, var(--page-bg) 70%, transparent) 86%, transparent 100%);
          pointer-events: none;
        }
        .hc-copy {
          position: relative;
          isolation: isolate;
          z-index: 2;
          max-width: min(720px, 46vw);
          padding: 0 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        /* The wordmark, in the theme's own file (light letters on dark). */
        .hc-logo { display: block; height: clamp(22px, 2vw, 30px); width: auto; margin-bottom: 28px; }
        .hc-logo-on-light { display: none; }
        :root:not([data-theme="dark"]) .hc-logo-on-dark { display: none; }
        :root:not([data-theme="dark"]) .hc-logo-on-light { display: block; }
        .hc-muted { color: var(--heading-muted); }
        /* Two lines, always (Hamza, 6 Oct): each line is held whole and the
           size scales with the viewport so the longer one fits the column. */
        .hc-line { display: block; white-space: nowrap; }
        .hc-title {
          /* The first line is 12.3em wide; 3.25vw keeps it inside the
             46vw column (less padding) at every width. */
          font-size: clamp(24px, 3.25vw, 52px);
          line-height: 1.08;
          font-weight: 600;
          letter-spacing: -0.03em;
          color: var(--ink-heading);
          text-wrap: balance;
        }
        .hc-lede {
          margin-top: 20px;
          max-width: 54ch;
          font-size: clamp(15px, 1.1vw, 17px);
          line-height: 1.6;
          color: var(--ink-2);
        }

        /* The purple action the hero carried before (from 8e207f9): the
           brand radial, a 4px lip along the foot, and a violet glow. */
        .hs-cta {
          margin-top: 32px;
          display: inline-flex;
          align-items: center;
          gap: 11px;
          height: 52px;
          padding: 0 28px 4px;
          border-radius: calc(21px * var(--corner));
          font-size: 16px;
          font-weight: 500;
          letter-spacing: -0.005em;
          white-space: nowrap;
          color: #fff;
          background: radial-gradient(63% 261% at 50% 50%, #8A3FFC 30.29%, #8A3FFC 63.46%, #491D8B 100%);
          box-shadow:
            0 6px 12px rgba(138, 63, 252, 0.15),
            0 12px 24px rgba(138, 63, 252, 0.15),
            inset 0 -4px 0 #491D8B;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hs-cta:hover {
          box-shadow:
            0 8px 16px rgba(138, 63, 252, 0.26),
            0 16px 32px rgba(138, 63, 252, 0.22),
            inset 0 -4px 0 #491D8B;
        }
        .hs-cta:active { transform: translateY(1px); }
        .hs-cta:focus-visible { outline: 2px solid #8a3ffc; outline-offset: 3px; }

        .hs-strip { padding-top: clamp(40px, 5vw, 72px); padding-bottom: clamp(48px, 7vh, 88px); }

        /* Narrow: the copy needs the full width, so the walls step back
           behind it as a dim frame. */
        @media (max-width: 760px) {
          .hc-copy { max-width: none; }
          .hc-stage { opacity: 0.35; }
          .hs-dots { width: 48px; }
          .hs-cta { height: 48px; padding: 0 20px 4px; font-size: 15px; }
        }
      `}</style>
    </>
  );
}
