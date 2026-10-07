import { DEMO_HREF, START_HREF } from "@/lib/links";
import { PlatformStrip } from "@/components/sections/Platform";
import { HeroGlobe, type GlobeShape } from "@/components/sections/HeroGlobe";
import { HeroDots } from "@/components/sections/HeroDots";

/** Stills only on the globe, no video (Hamza, 7 Oct). */
const NO_CLIPS: string[] = [];
/** Tiles behind the copy (Hamza, 7 Oct): on the globe blurred and darkened
    (both clear as it opens), on the spiral only blurred, on the hourglass
    dimmed under its block. */
const GLOBE_SOFT = { rx: 0.62, ry: 0.5, dim: 0.6, blur: 3 };
const SPIRAL_SOFT = { rx: 0.62, ry: 0.5, dim: 0, blur: 3 };
const HOURGLASS_SOFT = { rx: 0.62, ry: 0.5, dim: 0.4, blur: 0 };
/** How dark the black block behind the copy is (0–1). */
const VEIL_ALPHA = 0.85;
/** The glow behind the CTA: size as % of the button, and its strength. */
const CTA_GLOW_W = 140, CTA_GLOW_H = 220, CTA_GLOW_ALPHA = 0.35;

/**
 * Hero (Hamza, 6 Oct): a two-line claim, one line and the purple "Start
 * creating for free" centred, over a slowly turning globe of the product's
 * work. The globe is a three.js scene in <HeroGlobe> (which documents how it
 * works and how it differs from the TwelveLabs hero that prompted it). There
 * is a feathered black block behind the copy, and the globe also dims its
 * own tiles there (softCentre).
 *
 * The section is dark on a light page (Hamza, 6 Oct): it carries
 * data-theme="dark", which globals.css honours on any element, so every
 * token inside it (page colour, inks, tile) is the dark set while the nav's
 * scrolled state, the platform strip and the rest stay light.
 */
/** `shape` picks the tile arrangement: the globe (home), a spiral
 *  (/hero-3) or a streaming hourglass (/hero-4).
 *  `light` (Hamza, 7 Oct, /hero-2): the same hero on the light page, with
 *  ink dots, ink type, a white block behind the copy and tiles that fade to
 *  white rather than black. */
export function HeroGlobeSection({ light = false, shape = "globe" }: { light?: boolean; shape?: GlobeShape } = {}) {
  return (
    <>
      <section id="top" className={`hc${light ? " hc-light" : ""}`} data-theme={light ? undefined : "dark"}>
        {/* The halftone edges, live: dots give way to the pointer and spring
            back (sections/HeroDots). */}
        <HeroDots className="hs-dots" />

        <div className="hc-stage" aria-hidden>
          <HeroGlobe clips={NO_CLIPS} distance={68} softCentre={shape === "hourglass" ? HOURGLASS_SOFT : shape === "spiral" ? SPIRAL_SOFT : GLOBE_SOFT} light={light} shape={shape} />
          {/* A feathered black block behind the copy, over the globe's own
              dimming (Hamza, 7 Oct: no blur on the globe). */}
          {/* The spiral has no block behind the copy (Hamza, 7 Oct): its
              centre tiles are blurred instead. */}
          {/* A feathered dark block behind the copy on the globe and the
              hourglass (Hamza, 7 Oct), over the tiles' own blur and dimming;
              on the globe it clears as the globe opens. */}
          {shape !== "spiral" && <span className={`hc-veil${shape === "globe" ? " hc-veil-opens" : ""}`} />}
          <span className="hc-topband" />
        </div>

        <div className="hc-copy">
          <h1 className="hc-title"><span className="hc-line">One workspace for your</span><span className="hc-line">content generations</span></h1>
          <p className="hc-lede">
            Every leading model for image, video and audio in one workspace, with your brand held
            across every output and the security your organisation needs.
          </p>
          {/* Two actions (Hamza, 7 Oct): start free, or talk to sales. */}
          <div className="hc-actions">
            <a href={START_HREF} className="hs-cta">
              Start creating for free
              <svg width="13" height="12" viewBox="0 0 12 11" fill="none" aria-hidden>
                <path d="M11.17 5.5H1M7.75 10l3.585-3.97c.53-.53.54-.52 0-1.06L7.75 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </a>
            <a href={DEMO_HREF} className="hc-sales">
              Contact sales
            </a>
          </div>
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
          height: 100vh; /* exactly one screen (Hamza, 7 Oct) */
          display: grid;
          place-items: center;
          padding-top: 64px;
          background: var(--page-bg);
        }
        /* Halftone at the edges, drawn by <HeroDots> on a canvas over the
           whole stage (its colour is this element's color). */
        .hs-dots {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          /* Whiter than the heading ink (Hamza, 7 Oct). */
          color: #fff;
        }

        /* The globe fills the section behind the copy. */
        .hc-stage { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .hg-host { position: absolute; inset: 0; }
        .hg-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
        /* The veil behind the copy: the page colour, sized to the copy
           column with a margin, feathered by a wide blur so it melts into the
           tiles rather than cutting them. */
        .hc-veil {
          position: absolute;
          left: 50%;
          top: 50%;
          width: calc(min(960px, 62vw) + 120px);
          height: clamp(300px, 36%, 360px);
          transform: translate(-50%, -50%);
          border-radius: 80px;
          background: rgba(0, 0, 0, ${VEIL_ALPHA});
          filter: blur(44px);
        }

        .hc-veil-opens { opacity: calc(1 - var(--globe-open, 0)); }

        /* A band of the page colour under the nav (Hamza, 7 Oct): solid for
           the bar's height, gone by 170px, so the tiles never pass behind the
           links. */
        .hc-topband {
          position: absolute;
          left: 0; right: 0; top: 0;
          height: 170px;
          background: linear-gradient(to bottom, var(--page-bg) 0%, var(--page-bg) 72px, transparent 100%);
        }

        .hc-copy {
          position: relative;
          isolation: isolate;
          z-index: 3;
          max-width: min(960px, 62vw);
          padding: 0 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        /* Two lines, always (Hamza, 7 Oct): "One workspace for your" /
           "content generations", both white, weight 600;
           each line is held whole and the size scales with the viewport so
           the longer one fits the column. */
        .hc-line { display: block; white-space: nowrap; }
        .hc-title {
          /* The first line is about 11.5em wide; 3.6vw keeps it inside the
             62vw column (less padding) at every width. */
          font-size: clamp(28px, 3.6vw, 58px);
          line-height: 1.1;
          font-weight: 600;
          letter-spacing: -0.03em;
          color: #fff; /* both lines pure white (Hamza, 7 Oct) */
          text-wrap: balance;
        }
        .hc-lede {
          margin-top: 22px;
          max-width: 54ch; /* narrower than the title, so it breaks after "with your" (7 Oct) */
          font-size: clamp(15px, 1.15vw, 18px);
          line-height: 1.6;
          color: var(--ink-2);
        }

        /* The purple action the hero carried before (from 8e207f9): the
           brand radial, a 4px lip along the foot, and a violet glow. */
        .hc-actions { margin-top: 32px; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 12px; }
        /* The secondary action: glass on the stage, same height as the
           primary, no fill colour of its own. */
        .hc-sales {
          display: inline-flex; align-items: center;
          height: 52px;
          padding: 0 26px;
          border-radius: calc(21px * var(--corner));
          font-size: 16px; font-weight: 500; letter-spacing: -0.005em; white-space: nowrap;
          color: var(--ink-heading);
          background: color-mix(in srgb, var(--ink-heading) 8%, transparent);
          border: 1px solid color-mix(in srgb, var(--ink-heading) 18%, transparent);
          -webkit-backdrop-filter: blur(var(--glass-blur));
          backdrop-filter: blur(var(--glass-blur));
          transition: background var(--dur-fast) ease, border-color var(--dur-fast) ease;
        }
        .hc-sales:hover { background: color-mix(in srgb, var(--ink-heading) 14%, transparent); border-color: color-mix(in srgb, var(--ink-heading) 30%, transparent); }
        .hc-sales:focus-visible { outline: 2px solid var(--ink-heading); outline-offset: 3px; }
        .hs-cta {
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
          background: radial-gradient(63% 261% at 50% 50%, var(--brand) 30.29%, var(--brand) 63.46%, var(--brand-deep) 100%);
          box-shadow:
            0 6px 12px rgb(var(--brand-rgb) / 0.15),
            0 12px 24px rgb(var(--brand-rgb) / 0.15),
            inset 0 -4px 0 var(--brand-deep);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hs-cta:hover {
          box-shadow:
            0 8px 16px rgb(var(--brand-rgb) / 0.26),
            0 16px 32px rgb(var(--brand-rgb) / 0.22),
            inset 0 -4px 0 var(--brand-deep);
        }
        /* A violet glow behind the button so it carries over the globe
           (Hamza, 7 Oct): a wide blurred ellipse under it, not on it. The
           button itself makes no stacking context, so z-index -1 puts the
           glow behind its fill but in front of the stage. */
        .hs-cta { position: relative; }
        .hs-cta::before {
          content: "";
          position: absolute;
          left: 50%; top: 55%;
          width: ${CTA_GLOW_W}%;
          height: ${CTA_GLOW_H}%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(closest-side, rgb(var(--brand-rgb) / ${CTA_GLOW_ALPHA}), rgb(var(--brand-rgb) / 0));
          filter: blur(18px);
          z-index: -1;
          pointer-events: none;
          transition: opacity 0.2s ease;
          opacity: 0.85;
        }
        .hs-cta:hover::before { opacity: 1; }
        .hs-cta:active { transform: translateY(1px); }
        .hs-cta:focus-visible { outline: 2px solid var(--brand); outline-offset: 3px; }

        /* Light variant: ink in place of white, a white block in place of
           the black one. */
        .hc-light .hs-dots { color: #171717; }
        .hc-light .hc-title { color: var(--ink-heading); }
        .hc-light .hc-veil { background: rgba(255, 255, 255, ${VEIL_ALPHA}); }

        .hs-strip { padding-top: clamp(40px, 5vw, 72px); padding-bottom: clamp(48px, 7vh, 88px); }

        /* Narrow: the copy needs the full width, so the globe steps back
           behind it as a dim frame. */
        @media (max-width: 760px) {
          .hc-copy { max-width: none; }
          .hc-stage { opacity: 0.35; }
          .hs-cta { height: 48px; padding: 0 20px 4px; font-size: 15px; }
          .hc-sales { height: 48px; padding: 0 20px; font-size: 15px; }
        }
      `}</style>
    </>
  );
}
