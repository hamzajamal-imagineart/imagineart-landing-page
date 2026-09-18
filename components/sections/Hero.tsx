"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { DEMO_HREF, START_HREF } from "@/lib/links";
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
 * Only `upscale` and `variate` are that tool's own footage. The other three
 * are stand-ins from the clips already on disk, since no Image Generator,
 * Relight or Camera Angles clip exists yet. Swap them before shipping.
 */
const CREATIVE = [
  { id: "image", label: "Image Generator", video: "/media/pillars/creative.mp4" },
  { id: "upscale", label: "Upscaler", video: "/media/capabilities/upscale.mp4" },
  { id: "variations", label: "Variations", video: "/media/capabilities/variate.mp4" },
  { id: "relight", label: "Relight", video: "/media/use-cases/photography.mp4" },
  { id: "angles", label: "Camera Angles", video: "/media/capabilities/reframe-presets.mp4" },
];

/**
 * How far either side of the selected card the ring reaches. With five cards
 * that is two, and the pair at exactly two is the staging area: they are the
 * cards that have to cross from one end to the other, so they are held at
 * zero opacity and make that jump unseen.
 */
const HALF = Math.floor(CREATIVE.length / 2);

/**
 * A row of five clips with the selected one brought forward.
 *
 * The track is centred on the selected card by translating it by that card's
 * own offset, so the arithmetic is one line of CSS rather than a measurement:
 * every card is the same width, and the active one only *scales*, which
 * changes what you see without moving what is underneath it.
 *
 * All five play. They are small local clips, together under 2MB, and a
 * paused card shows a black rectangle unless it has a poster, which none of
 * these have.
 */
function CreativeCarousel({ live }: { live: boolean }) {
  const [card, setCard] = useState(0);
  const chips = useSlidingIndicator<HTMLButtonElement>(card);
  const clips = useRef<(HTMLVideoElement | null)[]>([]);

  // The autoplay attribute alone is not enough: it only fires when the
  // element first enters the document, so a clip that was paused because the
  // tab moved away never restarts. Drive them from the tab's state instead,
  // the way the three panel clips already are.
  useEffect(() => {
    clips.current.forEach((v) => {
      if (!v) return;
      if (live) void v.play().catch(() => {});
      else v.pause();
    });
  }, [live]);
  const step = (d: number) => setCard((c) => (c + d + CREATIVE.length) % CREATIVE.length);

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
      <div className="hc-stage">
        <div className="hc-track">
          {CREATIVE.map((c, i) => {
            // Where this card sits relative to the selected one, the short way
            // round: -2 -1 0 1 2 for five cards. This is what makes the row a
            // ring rather than a strip: the card before the first is the last
            // one, so a step left from the first slides the fifth in from the
            // left instead of running the whole row back.
            const d = ((i - card + HALF + CREATIVE.length) % CREATIVE.length) - HALF;
            return (
            <figure
              key={c.id}
              id={`hero-card-${c.id}`}
              className={`hc-card ${d === 0 ? "hc-card-on" : ""} ${Math.abs(d) === HALF ? "hc-card-off" : ""}`}
              style={{ ["--d" as string]: d }}
              aria-hidden={i !== card}
            >
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                ref={(el) => { clips.current[i] = el; }}
                src={withBasePath(c.video)}
                title={`${c.label} in ImagineArt`}
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
              />
            </figure>
            );
          })}
        </div>

        <button type="button" className="hc-arrow hc-arrow-l" onClick={() => step(-1)} aria-label="Previous tool">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" className="hc-arrow hc-arrow-r" onClick={() => step(1)} aria-label="Next tool">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
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
      {/* The hero photograph, full bleed behind everything. It is its own
          element rather than a background-image so it can be object-fit and
          carry its own scrim; the scrim is what keeps the headline over it at
          AA and lands the foot of the section on --page-bg, so the seam into
          Partners stays invisible. */}
      <div className="hero-bg" aria-hidden>
        <img src={withBasePath("/media/hero/backdrop-veil.jpg")} alt="" />
        <span className="hero-bg-scrim" />
      </div>
      <div className="container-page">
        <div className="hero-top">
          <div>
            <BlurHeading
              as="h1"
              className="display hero-h1"
              lead="Bringing"
              leadClassName="hero-h1-light"
              muted="imagination to life"
              mutedClassName=""
              lineBreak
            />
            <div className="hero-actions">
              <a href={START_HREF} className="hero-btn hero-btn-dark">Get Started</a>
              <a href={DEMO_HREF} target="_blank" rel="noopener noreferrer" className="hero-btn hero-btn-ghost">Book a demo</a>
            </div>
          </div>
          <p className="hero-copy">
            ImagineArt is the best AI creative suite that generates images, videos,
            shorts, and voice from text prompt. Built for creators, teams and the
            developers shipping alongside them.
          </p>
        </div>

        <div className="hero-frame">
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
        /* Hosts a <SectionGlow> at z-index -1, and the photograph below it. */
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
        .hero-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          /* The subject is centred and top-weighted, so the crown stays in
             frame as the section gets shorter. */
          object-position: 50% 12%;
          display: block;
        }
        .hero-bg-scrim {
          position: absolute;
          inset: 0;
          background:
            /* Under the headline and copy, so both hold AA over the red. */
            linear-gradient(to bottom, rgba(10, 4, 6, 0.62) 0%, rgba(10, 4, 6, 0.28) 34%, rgba(10, 4, 6, 0) 52%),
            /* And down into the page, so the band ends on --page-bg rather
               than a cut. */
            linear-gradient(to bottom, transparent 40%, var(--page-bg) 96%);
        }
        .hero-section .container-page { position: relative; z-index: 1; }
        .hero-top {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(24px, 4vw, 64px);
          align-items: start;
        }
        .hero-h1 { font-size: clamp(34px, 4vw, 52px); text-align: left; text-wrap: initial; }
        .hero-h1-light { font-weight: 400; }
        .hero-copy {
          font-size: clamp(16px, 1.25vw, 18px);
          line-height: 1.6;
          color: var(--ink);
          max-width: 46ch;
          padding-top: 10px;
        }
        .hero-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
        .hero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 46px;
          padding: 0 22px;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: -0.005em;
          white-space: nowrap;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
        .hero-btn:active { transform: translateY(1px); }
        .hero-btn-dark { background: var(--ink); color: var(--page-bg); }
        .hero-btn-dark:hover { background: var(--ink-2); }
        .hero-btn-ghost { background: var(--panel); color: var(--ink); border: 1px solid var(--line-strong); }
        .hero-btn-ghost:hover { border-color: var(--ink-3); }

        .hero-frame {
          margin-top: clamp(36px, 5vh, 56px);
          border: 1px solid var(--line);
          border-radius: var(--radius-6);
          background: var(--tile);
          overflow: hidden;
        }
        .hero-tabs { display: flex; gap: 6px; padding: 6px; position: relative; }
        /* Tabs are squarer than the pill buttons on purpose: the radius is
           what separates a tab from a button at a glance. No border either,
           the fill and its shadow carry it. */
        .hero-tab-fill {
          border-radius: 16px;
          background: var(--panel);
          box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 4px 14px rgba(16,20,30,0.06);
        }
        .hero-tab {
          position: relative;
          z-index: 1;
          flex: 1 1 0;
          height: 50px;
          border: 0;
          border-radius: 16px;
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
        .hero-body { margin: 0 6px 6px; }
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

        /* The Creative carousel, laid out as a ring.
           Every card is placed from the centre of the stage by its own
           circular offset --d, rather than a strip being scrolled: that is
           what lets the row wrap, so the card before the first is the last
           one. The pair at the far edge (|--d| = 2) is the staging area,
           hidden, which is where the crossing from one end to the other
           happens unseen. */
        .hc {
          /* One card width and one gap. Both are used to place every card, so
             they have to stay lengths, not percentages. */
          --cw: clamp(220px, 44vw, 620px);
          --gap: clamp(12px, 1.6vw, 24px);
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-rows: 1fr auto;
        }
        .hc-stage { position: relative; overflow: hidden; }
        .hc-track { position: absolute; inset: 0; }
        .hc-card {
          position: absolute;
          top: 50%;
          left: 50%;
          width: var(--cw);
          aspect-ratio: 16 / 9;
          margin: 0;
          border-radius: var(--radius-4);
          overflow: hidden;
          background: var(--tile-2);
          opacity: 0.4;
          transform:
            translate(calc(-50% + var(--d) * (var(--cw) + var(--gap))), -50%)
            scale(0.86);
          transition:
            transform 520ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 420ms ease;
        }
        .hc-card-on {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.42);
        }
        /* The two cards waiting at the ends, hidden. They keep the same
           transition as the rest: the card crossing the ring each step is at
           zero opacity at both ends, so its run across the stage is never
           seen, and the one merely leaving the edge fades out as it goes
           instead of snapping. */
        .hc-card-off {
          opacity: 0;
          pointer-events: none;
        }
        .hc-card video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
        .hc-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: var(--panel);
          color: var(--ink);
          cursor: pointer;
          opacity: 0.85;
          transition: opacity 200ms ease, transform 200ms ease;
        }
        .hc-arrow:hover { opacity: 1; }
        .hc-arrow:active { transform: translateY(-50%) scale(0.94); }
        .hc-arrow-l { left: 14px; }
        .hc-arrow-r { right: 14px; }
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
          .hc { --cw: min(78vw, 360px); --gap: 10px; }
          .hc-arrow { display: none; }
          .hc-chip { height: 30px; padding: 0 12px; font-size: 12.5px; }
          .hero-top { grid-template-columns: 1fr; gap: 18px; }
          .hero-copy { padding-top: 0; }
          .hero-tab { height: 44px; font-size: 14px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-panel, .hc-card { transition: none; }
        }
      `}</style>
    </section>
  );
}
