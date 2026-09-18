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
      <div className="container-page">
        {/* One centred column: heading, copy, actions. */}
        <div className="hero-top">
          <BlurHeading
            as="h1"
            className="display hero-h1"
            lead="Bringing"
            muted="imagination to life"
            mutedClassName=""
            lineBreak
          />
          <p className="hero-copy">
            ImagineArt is the best AI creative suite that generates images, videos,
            shorts, and voice from text prompt. Built for creators, teams and the
            developers shipping alongside them.
          </p>
          <div className="hero-actions">
            <a href={START_HREF} className="hero-btn hero-btn-dark">Get Started</a>
            <a href={DEMO_HREF} target="_blank" rel="noopener noreferrer" className="hero-btn hero-btn-ghost">Book a demo</a>
          </div>
        </div>

        {/* The tab bar stands on the page between the actions and the panel,
            rather than sitting inside the panel's own chrome. */}
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
        /* Hosts a <SectionGlow> at z-index -1. */
        .hero-section {
          position: relative;
          isolation: isolate;
          padding-top: clamp(168px, 20vh, 232px);
          padding-bottom: clamp(40px, 6vh, 72px);
        }
        ${sectionGlowCss}
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
          margin-top: clamp(20px, 3vh, 32px);
          border: 1px solid var(--line);
          border-radius: var(--radius-6);
          background: var(--tile);
          overflow: hidden;
          padding: 6px;
        }
        /* Standing on the page rather than inside the panel, so it is centred
           and each tab is only as wide as its label: a row of three that
           stretched to the page would read as a segmented control. */
        .hero-tabs {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 4px;
          position: relative;
          margin-top: clamp(30px, 5vh, 52px);
        }
        /* Tabs are squarer than the pill buttons on purpose: the radius is
           what separates a tab from a button at a glance. No border either,
           the fill and its shadow carry it. */
        .hero-tab-fill {
          border-radius: 999px;
          background: var(--tile);
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
          .hero-tab { height: 38px; padding: 0 14px; font-size: 14px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-panel { transition: none; }
        }
      `}</style>
    </section>
  );
}
