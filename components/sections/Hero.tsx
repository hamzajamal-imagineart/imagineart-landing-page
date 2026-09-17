"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { DEMO_HREF, START_HREF } from "@/lib/links";
import { SlidingIndicator, slidingIndicatorCss, useSlidingIndicator } from "@/components/primitives/SlidingIndicator";
import { BlurHeading } from "@/components/BlurHeading";

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
  { id: "creative", label: "Creative", video: "https://imagine.animagic.art/imagine-one/home/campaigns/gpt-2.5.mp4" },
  { id: "workflows", label: "Workflows", video: "https://www.imagine.art/business/media/modes/quick-iterations.mp4" },
  { id: "computer", label: "Computer", video: "/media/hero/computer.mp4" },
];

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
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  ref={(el) => { videoRefs.current[i] = el; }}
                  src={withBasePath(l.video)}
                  title={`${l.label} in ImagineArt`}
                  autoPlay={i === 0}
                  muted
                  loop
                  playsInline
                  preload={i === 0 ? "auto" : "metadata"}
                  controls={showControls && i === line}
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                />
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          padding-top: clamp(168px, 20vh, 232px);
          padding-bottom: clamp(40px, 6vh, 72px);
        }
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

        @media (max-width: 880px) {
          .hero-top { grid-template-columns: 1fr; gap: 18px; }
          .hero-copy { padding-top: 0; }
          .hero-tab { height: 44px; font-size: 14px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-panel { transition: none; }
        }
      `}</style>
    </section>
  );
}
