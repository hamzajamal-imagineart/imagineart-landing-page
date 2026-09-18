"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { START_HREF } from "@/lib/links";
import { SlidingIndicator, slidingIndicatorCss, useSlidingIndicator } from "@/components/primitives/SlidingIndicator";
import { BlurHeading } from "@/components/BlurHeading";
import { SectionGlow, sectionGlowCss } from "@/components/primitives/SectionGlow";

/**
 * Hero, on the ElevenLabs pattern, pared down.
 *
 * Headline left, supporting copy right, two pill buttons. Below, one framed
 * panel: a three-way tab bar (Creative · Workflows · Computer) and one 16:9
 * clip per tab. Nothing else in the panel.
 *
 * All three clips render into the HTML, stacked in one cell; only the visible
 * one plays, and the visible one shows native controls while the pointer is
 * over the frame. Creative and Workflows stream real footage; Computer is
 * still a placeholder.
 */
const LINES = [
  // Real campaign footage, streamed. withBasePath() passes an absolute URL
  // through untouched, so it needs no local copy.
  { id: "creative", label: "Creative", video: null },
  { id: "workflows", label: "Workflows", video: "https://www.imagine.art/business/media/modes/quick-iterations.mp4" },
  { id: "computer", label: "Computer", video: "/media/hero/computer.mp4" },
];

/**
 * The Creative tab's carousel.
 *
 * Five tools, one card each, the selected one brought forward and the rest
 * held back at reduced scale. The chips below are the control: they are the
 * same five names, so there is no caption under the card repeating them.
 *
 * **Every entry is currently the same clip**, while the shape of the section
 * is being tried out, so picking a chip does not change what is playing. Give
 * each entry its own `video` when the real footage exists and that starts
 * working on its own.
 */
const PLACEHOLDER = "/media/hero/creative-suite-image.webm";

const CREATIVE = [
  { id: "image", label: "Image Generator", video: PLACEHOLDER },
  { id: "upscale", label: "Upscaler", video: PLACEHOLDER },
  { id: "variations", label: "Variations", video: PLACEHOLDER },
  { id: "relight", label: "Relight", video: PLACEHOLDER },
  { id: "angles", label: "Camera Angles", video: PLACEHOLDER },
];


/**
 * The Creative tab: one clip, full width, and a chip row under it.
 *
 * The chips select a tool and the clip is the selected tool's own footage.
 * While the section is being tried out every chip points at the same file, so
 * the clip does not change when you pick one; give each entry in CREATIVE its
 * own `video` and this starts working with no other change.
 *
 * Single-source, so there is nothing here to load twice: the earlier version
 * showed five cards at once, which meant five <video> elements on one URL
 * firing five range requests in the same millisecond, none of them able to
 * hit the cache the others were still filling.
 */
function CreativeCarousel({ live }: { live: boolean }) {
  const [card, setCard] = useState(0);
  const chips = useSlidingIndicator<HTMLButtonElement>(card);
  const clip = useRef<HTMLVideoElement | null>(null);

  // The autoplay attribute only fires when the element first enters the
  // document, so a clip paused because the tab moved away never restarts.
  // Drive it from the tab's state instead, as the other two panels are.
  useEffect(() => {
    const v = clip.current;
    if (!v) return;
    if (live) void v.play().catch(() => {});
    else v.pause();
  }, [live]);

  const onChipKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (card + d + CREATIVE.length) % CREATIVE.length;
    setCard(next);
    document.getElementById(`hero-chip-${CREATIVE[next].id}`)?.focus();
  };

  return (
    <div className="hc">
      <div className="hc-stage" id={`hero-card-${CREATIVE[card].id}`}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={clip}
          src={withBasePath(CREATIVE[card].video)}
          title={`${CREATIVE[card].label} in ImagineArt`}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
        />
      </div>

      <div
        className="hc-chips"
        role="tablist"
        aria-label="Creative tools"
        onKeyDown={onChipKey}
        ref={chips.containerRef as React.Ref<HTMLDivElement>}
      >
        <SlidingIndicator box={chips.box} ready={chips.ready} className="hc-chip-fill" />
        {CREATIVE.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => { chips.itemRefs.current[i] = el; }}
            id={`hero-chip-${c.id}`}
            role="tab"
            type="button"
            aria-selected={i === card}
            aria-controls={`hero-card-${c.id}`}
            tabIndex={i === card ? 0 : -1}
            className={`hc-chip ${i === card ? "hc-chip-on" : ""}`}
            onClick={() => setCard(i)}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * The hero's ground: a mosaic of work, run edge to edge behind the copy.
 *
 * The tiles are the seven showcase pieces and the bento's six photographs,
 * downscaled to 440px wide in `hero/mosaic/` — 432KB for all thirteen, where
 * the originals are 2.6MB and would render at a third of their size. Rebuild
 * them with `sips -Z 440` if the set changes.
 *
 * Laid out in CSS columns rather than a grid: the tiles are a mix of 1:1,
 * 3:4 and 9:16, and columns let each keep its own ratio and pack, which is
 * what makes the edges ragged rather than a tidy grid of equal boxes.
 */
const MOSAIC = Array.from({ length: 13 }, (_, i) => `/media/hero/mosaic/m${i + 1}.jpg`);

export function Hero() {
  const [line, setLine] = useState(0);
  /**
   * Native controls appear on the visible clip while the pointer is over the
   * frame, or while anything inside it has focus. `controls` is an attribute,
   * not a style, so it cannot be a CSS hover; and it goes on the active panel
   * only, since the other two are stacked behind it in the same cell.
   */
  const [showControls, setShowControls] = useState(false);
  const tabs = useSlidingIndicator<HTMLButtonElement>(line);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === line) void v.play().catch(() => {});
      else v.pause();
    });
  }, [line]);

  const onTabKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (line + d + LINES.length) % LINES.length;
    setLine(next);
    document.getElementById(`hero-tab-${LINES[next].id}`)?.focus();
  };

  return (
    <section id="top" className="hero-section">
      {/* Lower than the sections further down: the hero opens under a fixed
          bar and a pool at 0% would sit behind it, so it is centred on the
          headline instead. */}
      <SectionGlow position="50% 20%" />
      {/* The ground, and the scrim that makes the copy legible over it. */}
      <div className="hero-bg" aria-hidden>
        <div className="hero-mosaic">
          {MOSAIC.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={withBasePath(src)} alt="" />
          ))}
        </div>
        <span className="hero-bg-scrim" />
      </div>
      <div className="container-page">
        {/* One centred column: heading, copy, actions. */}
        <div className="hero-top">
          <BlurHeading
            as="h1"
            className="display hero-h1"
            lead="Imagine, design, animate,"
            muted="edit. One platform."
            mutedClassName=""
            lineBreak
          />
          <p className="hero-copy">
            ImagineArt is the best AI creative suite that generates images, videos,
            shorts, and voice from text prompt. Built for creators, teams and the
            developers shipping alongside them.
          </p>
          <div className="hero-actions">
            <a href={START_HREF} className="hero-cta">
              Start creating for free
              <svg className="hero-cta-go" width="12" height="11" viewBox="0 0 12 11" fill="none" aria-hidden>
                <path d="M11.17 5.5H1M7.75 10l3.585-3.97c.53-.53.54-.52 0-1.06L7.75 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* The tab bar stands on the page between the actions and the panel,
            rather than sitting inside the panel's own chrome. */}
        <div className="hero-tabbar">
        <div
          className="hero-tabs"
          ref={tabs.containerRef as React.Ref<HTMLDivElement>}
          role="tablist"
          aria-label="Product lines"
          onKeyDown={onTabKey}
        >
          {/* The hero tabs do not walk themselves: under the headline, a
              panel changing on its own competes with the copy for the eye.
              The Use Cases wheel, further down, does. */}
          <SlidingIndicator box={tabs.box} ready={tabs.ready} className="hero-tab-fill" />
          {LINES.map((l, i) => (
            <button
              key={l.id}
              ref={(el) => { tabs.itemRefs.current[i] = el; }}
              id={`hero-tab-${l.id}`}
              role="tab"
              type="button"
              aria-selected={i === line}
              aria-controls={`hero-panel-${l.id}`}
              tabIndex={i === line ? 0 : -1}
              className={`hero-tab ${i === line ? "hero-tab-on" : ""}`}
              onClick={() => setLine(i)}
            >
              {l.label}
            </button>
          ))}
        </div>
        </div>

        <div className="hero-frame">
          <div className="hero-body">
            <div
              className="hero-stack"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
              onFocusCapture={() => setShowControls(true)}
              onBlurCapture={() => setShowControls(false)}
            >
            {LINES.map((l, i) => (
              <div
                key={l.id}
                id={`hero-panel-${l.id}`}
                role="tabpanel"
                aria-labelledby={`hero-tab-${l.id}`}
                aria-hidden={i !== line}
                className={`hero-panel ${i === line ? "hero-panel-on" : ""}`}
              >
                {l.video === null ? (
                  <CreativeCarousel live={i === line} />
                ) : (
                  /* eslint-disable-next-line jsx-a11y/media-has-caption */
                  <video
                    ref={(el) => { videoRefs.current[i] = el; }}
                    src={withBasePath(l.video)}
                    title={`${l.label} in ImagineArt`}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    controls={showControls && i === line}
                    controlsList="nodownload noremoteplayback"
                    disablePictureInPicture
                  />
                )}
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Hosts a <SectionGlow> at z-index -1, and the mosaic below it. */
        .hero-section {
          position: relative;
          isolation: isolate;
          padding-top: clamp(168px, 20vh, 232px);
          padding-bottom: clamp(40px, 6vh, 72px);
        }
        ${sectionGlowCss}
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: -2;
          overflow: hidden;
          pointer-events: none;
        }
        .hero-mosaic {
          column-count: 6;
          column-gap: 8px;
          padding: 8px;
          /* Taller than the section so the columns are always cut off rather
             than running out partway down and leaving a bald foot. */
          height: 130%;
        }
        .hero-mosaic img {
          display: block;
          width: 100%;
          margin-bottom: 8px;
          border-radius: 10px;
          break-inside: avoid;
        }
        /* Heavy, because the tiles are faces and bright grounds and the copy
           is centred right over the middle of them. Three layers: a flat wash
           over the whole mosaic, a heavier pool behind the copy, and the fade
           to --page-bg that lands the foot of the section on the page so the
           seam into Partners stays invisible. */
        .hero-bg-scrim {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(rgba(9, 9, 11, 0.44), rgba(9, 9, 11, 0.44)),
            radial-gradient(76% 56% at 50% 34%, rgba(9, 9, 11, 0.7) 0%, rgba(9, 9, 11, 0.4) 60%, rgba(9, 9, 11, 0.12) 100%),
            linear-gradient(to bottom, rgba(9, 9, 11, 0.5) 0%, rgba(9, 9, 11, 0.2) 30%, rgba(9, 9, 11, 0.55) 72%, var(--page-bg) 98%);
        }
        .hero-section .container-page { position: relative; z-index: 1; }
        .hero-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .hero-h1 {
          font-size: clamp(36px, 5.2vw, 72px);
          line-height: 1.04;
          letter-spacing: -0.025em;
          text-align: center;
          text-wrap: initial;
        }
        /* Flat white, not the page's gradient heading: one ink at one weight,
           as the rest of the hero now is. .display paints its text
           transparent to carry that gradient, so the fill has to be set as
           well as the colour, and the halo goes with it. */
        .hero-h1, .hero-h1 span {
          font-weight: 500;
          color: var(--ink-heading);
          background: none;
          -webkit-text-fill-color: var(--ink-heading);
          text-shadow: none;
        }
        .hero-copy {
          font-size: clamp(16px, 1.25vw, 18px);
          line-height: 1.6;
          color: var(--ink-2);
          max-width: 56ch;
          margin-top: 20px;
        }
        .hero-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 28px; }
        /* The CTA, built from the supplied SVG rather than approximated.
           The shape is 48 tall on an 18 radius; the fill is that SVG's radial
           gradient, whose rx and ry were 161.58 and 125.29 against a 255x48
           button, so 63% and 261%; the two glows are its drop shadows, both
           #8A3FFC at 15% (stdDeviation 6 and 12, which is 12px and 24px of
           CSS blur); and the lip is its inner shadow, offset up 4 with no
           blur, which lands as a 4px band inside the bottom edge. */
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          height: 48px;
          /* The 4px lip eats the bottom of the button, so the visible face is
             the top 44px. Centring on the box put the label 1.8px below the
             middle of what you actually see; this pads it back up. */
          padding: 0 26px 4px;
          border-radius: 18px;
          font-size: 15px;
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
        .hero-cta:hover {
          box-shadow:
            0 8px 16px rgba(138, 63, 252, 0.26),
            0 16px 32px rgba(138, 63, 252, 0.22),
            inset 0 -4px 0 #491D8B;
        }
        .hero-cta:active { transform: translateY(1px); }
        .hero-cta-go { flex: 0 0 auto; }

        .hero-frame {
          margin-top: clamp(20px, 3vh, 32px);
          border: 1px solid var(--line);
          border-radius: var(--radius-6);
          background: var(--tile);
          overflow: hidden;
          padding: 6px;
        }
        /* A segmented control standing on the page: the groove is the token
           for exactly this, --track, and it hugs its tabs rather than
           stretching, so the row stays centred at any width. */
        .hero-tabbar {
          display: flex;
          justify-content: center;
          margin-top: clamp(30px, 5vh, 52px);
        }
        .hero-tabs {
          display: inline-flex;
          gap: 4px;
          padding: 5px;
          position: relative;
          border-radius: 999px;
          background: var(--track);
          max-width: 100%;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .hero-tabs::-webkit-scrollbar { display: none; }
        /* Tabs are squarer than the pill buttons on purpose: the radius is
           what separates a tab from a button at a glance. No border either,
           the fill and its shadow carry it. */
        /* --tile is only six values off the page in dark, so the selected
           tab was all but invisible once the bar left the panel and stood on
           --page-bg. --panel is the token for a raised surface, which is what
           this is now. */
        .hero-tab-fill {
          border-radius: 999px;
          background: var(--panel);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.28);
        }
        .hero-tab {
          position: relative;
          z-index: 1;
          flex: 0 0 auto;
          height: 42px;
          padding: 0 18px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          font-family: inherit;
          font-size: 15.5px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--ink-3);
          cursor: pointer;
          transition: color 260ms ease;
        }
        .hero-tab:hover { color: var(--ink-heading); }
        .hero-tab-on { color: var(--ink-heading); }
        ${slidingIndicatorCss}

        /* One 16:9 frame directly in the panel; the three clips stack in it and
           only the active one shows. */
        .hero-body { margin: 0; }
        .hero-stack {
          display: grid;
          border-radius: var(--radius-4);
          border: 1px solid var(--line);
          overflow: hidden;
          background: var(--tile);
          aspect-ratio: 16 / 9;
        }
        .hero-panel {
          grid-area: 1 / 1;
          position: relative;
          opacity: 0;
          visibility: hidden;
          transition: opacity 320ms ease, visibility 0s linear 320ms;
        }
        .hero-panel-on { opacity: 1; visibility: visible; transition: opacity 320ms ease, visibility 0s; }
        .hero-panel video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }

        /* The Creative tab: one full-width clip over a chip row. */
        .hc {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-rows: 1fr auto;
        }
        .hc-stage { position: relative; overflow: hidden; background: var(--tile-2); }
        .hc-stage video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .hc-chips {
          position: relative;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 4px;
          padding: 10px 12px 14px;
        }
        .hc-chip-fill { border-radius: 999px; background: var(--panel); }
        .hc-chip {
          position: relative;
          z-index: 1;
          border: 0;
          border-radius: 999px;
          padding: 0 16px;
          height: 34px;
          background: transparent;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: -0.005em;
          color: var(--ink-3);
          cursor: pointer;
          white-space: nowrap;
          transition: color 260ms ease;
        }
        .hc-chip:hover { color: var(--ink-heading); }
        .hc-chip-on { color: var(--ink-heading); }

        @media (max-width: 880px) {
          .hc-chip { height: 30px; padding: 0 12px; font-size: 12.5px; }
          .hero-mosaic { column-count: 3; }
          .hero-tab { height: 38px; padding: 0 14px; font-size: 14px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-panel { transition: none; }
        }
      `}</style>
    </section>
  );
}
