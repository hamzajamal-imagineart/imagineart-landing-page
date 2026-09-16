"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { PRICING_HREF, START_HREF } from "@/lib/links";

/**
 * Hero, on the ElevenLabs pattern, pared down.
 *
 * Headline left, supporting copy right, two pill buttons. Below, one framed
 * panel: a three-way tab bar (Creative · Workflows · Computer) and one 16:9
 * clip per tab. Nothing else in the panel.
 *
 * All three clips render into the HTML, stacked in one cell; only the visible
 * one plays. Clips are placeholders for real product footage per line.
 */
const LINES = [
  { id: "creative", label: "Creative", video: "/media/pillars/creative.mp4" },
  { id: "workflows", label: "Workflows", video: "/media/pillars/workflows.mp4" },
  { id: "computer", label: "Computer", video: "/media/hero/computer.mp4" },
];

export function Hero() {
  const [line, setLine] = useState(0);
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
            <h1 className="display hero-h1">
              <span className="hero-h1-light">Bringing</span><br />imagination to life
            </h1>
            <div className="hero-actions">
              <a href={START_HREF} className="hero-btn hero-btn-dark">Get Started</a>
              <a href={PRICING_HREF} target="_blank" rel="noopener noreferrer" className="hero-btn hero-btn-ghost">See Plans</a>
            </div>
          </div>
          <p className="hero-copy">
            Creative tools, Workflows and Imagine Computer, on 50+ frontier
            models. For creators, teams and developers.
          </p>
        </div>

        <div className="hero-frame">
          <div className="hero-tabs" role="tablist" aria-label="Product lines" onKeyDown={onTabKey}>
            {LINES.map((l, i) => (
              <button
                key={l.id}
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
            <div className="hero-stack">
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
                  autoPlay={i === 0}
                  muted
                  loop
                  playsInline
                  preload={i === 0 ? "auto" : "metadata"}
                  aria-hidden
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
          padding-top: clamp(120px, 15vh, 170px);
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
          color: var(--ink-2);
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
        .hero-btn-dark { background: var(--ink); color: #fff; }
        .hero-btn-dark:hover { background: #2a2a2c; }
        .hero-btn-ghost { background: var(--panel); color: var(--ink); border: 1px solid var(--line-strong); }
        .hero-btn-ghost:hover { border-color: var(--ink-3); }

        .hero-frame {
          margin-top: clamp(36px, 5vh, 56px);
          border: 1px solid var(--line);
          border-radius: 26px;
          background: #dce4ee;
          overflow: hidden;
        }
        .hero-tabs { display: flex; gap: 6px; padding: 6px; }
        .hero-tab {
          flex: 1 1 0;
          height: 50px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          font-family: inherit;
          font-size: 15.5px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--ink-3);
          cursor: pointer;
          transition: color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }
        .hero-tab:hover { color: var(--ink-heading); }
        .hero-tab-on {
          color: var(--ink-heading);
          background: var(--panel);
          box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 4px 14px rgba(16,20,30,0.06);
        }

        /* One 16:9 frame directly in the panel; the three clips stack in it and
           only the active one shows. */
        .hero-body { margin: 0 6px 6px; }
        .hero-stack {
          display: grid;
          border-radius: 20px;
          border: 1px solid rgba(0, 0, 0, 0.1);
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
