import { START_HREF } from "@/lib/links";
import { PlatformStrip } from "@/components/sections/Platform";
import { HeroGlobe } from "@/components/sections/HeroGlobe";
import { HeroDots } from "@/components/sections/HeroDots";

/** Stills only on the globe, no video (Hamza, 7 Oct). */
const NO_CLIPS: string[] = [];
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
export function HeroGlobeSection() {
  return (
    <>
      <section id="top" className="hc" data-theme="dark">
        {/* The halftone edges, live: dots give way to the pointer and spring
            back (sections/HeroDots). */}
        <HeroDots className="hs-dots" />

        <div className="hc-stage" aria-hidden>
          <HeroGlobe clips={NO_CLIPS} distance={68} softCentre={{ rx: 0.62, ry: 0.5, dim: 0.4, blur: 0 }} />
          {/* A feathered black block behind the copy, over the globe's own
              dimming (Hamza, 7 Oct: no blur on the globe). */}
          <span className="hc-veil" />
          <span className="hc-topband" />
        </div>

        <div className="hc-copy">
          <h1 className="hc-title"><span className="hc-line">One workspace for your</span><span className="hc-line">content generations</span></h1>
          <p className="hc-lede">
            Every leading model for image, video and audio in one workspace, with your brand held
            across every output and the security your organisation needs.
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
        /* Two lines, always (Hamza, 6 Oct, to a reference): "One canvas at
           scale for your" white, "work generations" muted, large at weight 500;
           each line is held whole and the size scales with the viewport so
           the longer one fits the column. */
        .hc-line { display: block; white-space: nowrap; }
        .hc-title {
          /* The first line is about 14em wide; 3.6vw keeps it inside the
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
          background: radial-gradient(closest-side, rgba(138, 63, 252, ${CTA_GLOW_ALPHA}), rgba(138, 63, 252, 0));
          filter: blur(18px);
          z-index: -1;
          pointer-events: none;
          transition: opacity 0.2s ease;
          opacity: 0.85;
        }
        .hs-cta:hover::before { opacity: 1; }
        .hs-cta:active { transform: translateY(1px); }
        .hs-cta:focus-visible { outline: 2px solid #8a3ffc; outline-offset: 3px; }

        .hs-strip { padding-top: clamp(40px, 5vw, 72px); padding-bottom: clamp(48px, 7vh, 88px); }

        /* Narrow: the copy needs the full width, so the globe steps back
           behind it as a dim frame. */
        @media (max-width: 760px) {
          .hc-copy { max-width: none; }
          .hc-stage { opacity: 0.35; }
          .hs-cta { height: 48px; padding: 0 20px 4px; font-size: 15px; }
        }
      `}</style>
    </>
  );
}
