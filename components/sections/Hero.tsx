import { withBasePath } from "@/lib/assets";
import { START_HREF } from "@/lib/links";
import { PlatformStrip } from "@/components/sections/Platform";
import { CorridorDrift } from "@/components/sections/CorridorDrift";

/**
 * Hero (Hamza, 6 Oct): a two-line claim, one line and the purple "Start
 * creating for free" centred, with the product's work streaming out from
 * behind it to the left and right, in the manner of the TwelveLabs hero.
 * The section is dark on a light page (Hamza, 6 Oct): it carries
 * data-theme="dark", which globals.css honours on any element, so every
 * token inside it (page colour, inks, tile) is the dark set while the nav's
 * scrolled state, the platform strip and the rest stay light.
 * The gallery is described above the constants below. One CSS keyframe per
 * card (position, scale, focus), with negative delays so the rows are full
 * on load; no JS runs except the pointer drift of the field (<CorridorDrift>).
 * Reduced motion freezes them in place.
 */

/** The generated, top-quality set first: ten industry images, the four
    Outcomes cards and the nine Suite cards, then the best mosaic tiles (the
    two gradient tiles, m8 and m10, are left out). */
const IMAGES = [
  ...["fashion", "cpg", "fast-food", "food-beverage", "home-decor", "electronics", "beauty", "automotive", "telecom", "ecommerce"].map((n) => `/media/hero/corridor/${n}.jpg`),
  ...["advertising", "product", "brand"].map((n) => `/media/outcomes/${n}.jpg`),
  ...["workflows", "canvas", "brand-guidelines", "video-extend", "inpaint", "ugc", "music", "ad-studio", "fashion-studio"].map((n) => `/media/suite/${n}.jpg`),
  ...[3, 9, 12, 13, 15, 17, 18].map((n) => `/media/hero/mosaic/m${n}.jpg`),
];
/** Clips with real footage, on every other card so the field moves within
    the cards too (Hamza, 6 Oct). The UI screen recordings (Workflows, Canvas,
    the image modes) are left out: dark panels read wrong on a light page.
    Also left out: the two clips with recognisable brands and the two heavy
    files (film-studio, lipsync). About forty live decoders is as many as a
    laptop takes comfortably. */
const CLIPS = [
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

/**
 * The gallery, after twelvelabs.io (Hamza's screenshots, 6 Oct), run out to
 * both sides (Hamza, later that day: "from both sides like before"). Four
 * parallel rows, evenly spaced (about 11vw apart), run straight from behind
 * the centred copy out past the left and right edges; only in the last
 * quarter do they bow apart, the top rows lifting and the bottom ones
 * dipping, in proportion to their distance from the middle. Cards are
 * smallest at the far point behind the copy (3.4vw) and grow steadily to
 * 7.5vw at the edge. The pitch between neighbours tracks the card's size, so
 * the gap stays about a third of a card and each row reads as one chain.
 * Cards sit a little above or below their row, so the rows are not ruled
 * lines. Far cards are translucent, no blur (that smudged on the light page),
 * and a wash of the page colour lies over the middle, so the rows show
 * through faintly behind the copy, which also sits on a soft overlay of the
 * page colour; both edges are full and sharp. Drawn in 2D, no perspective.
 */
/** Row offsets from the vertical centre, in vw. */
const ROW_Y = [-16.5, -5.5, 5.5, 16.5];
/** How much a row's offset has grown by the edge; eased in hard (t⁴) so the
    bow is confined to the last quarter. */
const FAN = 1.45;
/** Near-end card width; the scale at the far point (behind the copy) and at
    the edge; the pitch between neighbours as a multiple of the card's width
    at that point; where the near end sits (past the edge); and the vertical
    jitter of a card off its row (vw), which keeps the rows from reading as
    ruled lines. */
const W = 7.5, S0 = 0.45, S1 = 1, PITCH = 1.35, X_NEAR = 62, JITTER = 1.1;
/** Seconds for one card's trip from behind the headline to past the edge. */
const TRIP = 40;

const scaleAt = (t: number) => S0 + (S1 - S0) * t;
/** Distance travelled per card-interval by time t: the integral of the pitch,
    which is PITCH × the card's width at that point (numerically, 200 steps). */
const travel = (() => {
  const out = [0];
  for (let i = 1; i <= 200; i++) out.push(out[i - 1] + (PITCH * W * scaleAt((i - 0.5) / 200)) / 200);
  return out;
})();
/** Cards per row per side: as many as span the half-width at that pitch. */
const PER_ROW = Math.ceil(X_NEAR / travel[200]);

/**
 * The keyframes, generated. Scale grows linearly from S0 to S1. Since cards
 * are evenly spaced in time, x is PER_ROW times the travel integral, signed
 * by the side (--dir), which lands the near end past the edge. Far cards
 * are translucent and come to full by just past halfway; a wash of the page
 * colour over the middle of the stage (below) and the overlay behind the
 * copy do the rest.
 */
const KEYFRAMES = (() => {
  const stops: string[] = [];
  for (let n = 0; n <= 20; n++) {
    const t = n / 20;
    const sc = scaleAt(t);
    const x = PER_ROW * travel[n * 10];
    const fan = 1 + (FAN - 1) * Math.pow(t, 4);
    // Far cards wash toward the page colour rather than blur: a blur on a
    // light page reads as grey smudges (Hamza, 6 Oct). In over the first
    // tenth, then up from a third to full by just past halfway.
    const op = t < 0.1 ? (t / 0.1) * 0.35 : Math.min(1, 0.35 + 0.65 * ((t - 0.1) / 0.45));
    stops.push(
      `${(t * 100).toFixed(1)}% { transform: translate(calc(var(--dir) * ${x.toFixed(2)}vw), calc(var(--y) * ${fan.toFixed(3)} + var(--j))) scale(${sc.toFixed(3)}); opacity: ${op.toFixed(2)}; }`,
    );
  }
  return `@keyframes hc-row { ${stops.join(" ")} }`;
})();

type Card = { dir: 1 | -1; y: number; j: number; delay: number; src: string; clip: boolean };
const CARDS: Card[] = (() => {
  const out: Card[] = [];
  let img = 0, vid = 0;
  ([1, -1] as const).forEach((dir, di) => {
    ROW_Y.forEach((y, ri) => {
      // Rows start at different points in the cycle so no two line up.
      const offset = (((ri * 0.381 + di * 0.5) % 1) * TRIP) / PER_ROW;
      for (let k = 0; k < PER_ROW; k++) {
        const clip = k % 2 === 1;
        out.push({
          dir,
          y,
          j: JITTER * Math.sin((di * 31 + ri * 7 + k) * 12.9898) /* deterministic, −1..1 */,
          delay: -(((k * TRIP) / PER_ROW + offset) % TRIP),
          src: clip ? CLIPS[vid++ % CLIPS.length] : IMAGES[(img++ * 7) % IMAGES.length],
          clip,
        });
      }
    });
  });
  return out;
})();

export function Hero() {
  return (
    <>
      <section id="top" className="hc" data-theme="dark">
        <span className="hs-dots hs-dots-l" aria-hidden />
        <span className="hs-dots hs-dots-r" aria-hidden />

        <CorridorDrift />
        <div className="hc-stage" aria-hidden>
          {CARDS.map((c, i) => (
            <span
              key={i}
              className="hc-card"
              style={{
                ["--dir" as string]: c.dir,
                ["--y" as string]: `${c.y}vw`,
                ["--j" as string]: `${c.j.toFixed(2)}vw`,
                animationDelay: `${c.delay.toFixed(2)}s`,
              }}
            >
              {c.clip ? (
                <video src={withBasePath(c.src)} muted autoPlay loop playsInline preload="auto" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={withBasePath(c.src)} alt="" decoding="async" />
              )}
            </span>
          ))}
        </div>

        <div className="hc-copy">
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

        /* The gallery's stage; the whole field drifts a little with the
           pointer (--px, --py from <CorridorDrift>). */
        .hc-stage {
          --px: 0; --py: 0;
          position: absolute;
          inset: 64px 0 0;
          z-index: 1;
          transform: translate(calc(var(--px) * -1.2vw), calc(var(--py) * -0.8vw));
          transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }
        /* A wash of the page colour over the middle, as on twelvelabs.io:
           the rows behind the copy read as a faint texture and both ends are
           full. */
        .hc-stage::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(90deg, transparent 18%, color-mix(in srgb, var(--page-bg) 40%, transparent) 32%, color-mix(in srgb, var(--page-bg) 70%, transparent) 42%, color-mix(in srgb, var(--page-bg) 70%, transparent) 58%, color-mix(in srgb, var(--page-bg) 40%, transparent) 68%, transparent 82%);
        }
        /* A card: rounded 16:9 at its near-end size, centred on the stage and
           moved out along its row by the keyframe (x, y, scale, focus). */
        .hc-card {
          position: absolute;
          left: 50%;
          top: 50%;
          width: ${W}vw;
          aspect-ratio: 16 / 9;
          margin-left: ${-W / 2}vw;
          margin-top: ${-W * 0.28125}vw;
          overflow: hidden;
          border-radius: calc(0.7vw * var(--corner));
          background: var(--tile);
          box-shadow: 0 0.5vw 1.5vw rgba(0, 0, 0, 0.35);
          opacity: 0;
          will-change: transform, opacity;
          animation: hc-row ${TRIP}s linear infinite;
        }
        .hc-card img, .hc-card video { width: 100%; height: 100%; object-fit: cover; display: block; }
        ${KEYFRAMES}
        @media (prefers-reduced-motion: reduce) {
          .hc-card { animation-play-state: paused; }
          .hc-card video { display: none; }
          .hc-stage { transition: none; }
        }

        /* A soft overlay of the page colour behind the copy (Hamza, 6 Oct:
           an overlay, not a blur): near-solid at the type, fading out across
           a wide ellipse so it has no edge, and the rows show through faintly
           at its rim. */
        .hc-copy::before {
          content: "";
          position: absolute;
          inset: -55% -42%;
          z-index: -1;
          border-radius: 50%;
          background: radial-gradient(closest-side, color-mix(in srgb, var(--page-bg) 94%, transparent) 40%, color-mix(in srgb, var(--page-bg) 72%, transparent) 70%, transparent 100%);
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
        .hc-muted { color: var(--heading-muted); }
        /* Two lines, always (Hamza, 6 Oct): each line is held whole and the
           size scales with the viewport so the longer one fits the column. */
        .hc-line { display: block; white-space: nowrap; }
        .hc-title {
          /* The first line is 12.3em wide; 3.25vw keeps it inside the
             46vw column (less padding) at every width. */
          font-size: clamp(24px, 3.25vw, 52px);
          line-height: 1.08;
          font-weight: 500;
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
