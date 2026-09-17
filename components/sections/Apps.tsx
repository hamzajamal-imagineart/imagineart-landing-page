"use client";

import { useRef } from "react";
import { withBasePath } from "@/lib/assets";
import { HOME } from "@/lib/links";
import { BlurHeading } from "@/components/BlurHeading";

/**
 * Apps as a horizontal card rail with chevron pagers, the pattern the
 * Enterprise page uses for its suite: dark-toned cards, title and body at the
 * top, a glass arrow, and a 16:9 clip clipped to the card's foot.
 *
 * Hrefs: image-upscaler and heygen-avatar are confirmed from the site
 * footer; the rest are inferred slugs and flagged in HANDOFF.md.
 * No scroll-snap on the rail (it cancels the container gutter), and the
 * track has block padding so the hover scale is not clipped.
 */
type App = { title: string; body: string; href: string; video: string };

const APPS: App[] = [
  { title: "Outfit Try-on", body: "Dress a model in your garment from one photo.", href: `${HOME}/apps/outfit-tryon`, video: "/media/capabilities/outfit-tryon.mp4" },
  { title: "UGC Creator", body: "A creator that speaks your script, in any language.", href: `${HOME}/apps/heygen-avatar`, video: "/media/capabilities/ugc.mp4" },
  { title: "Image Upscaler", body: "Sharper, larger, ready for print.", href: `${HOME}/apps/image-upscaler`, video: "/media/capabilities/upscale.mp4" },
  { title: "Reframe Presets", body: "One asset, every placement size.", href: `${HOME}/apps/reframe`, video: "/media/capabilities/reframe-presets.mp4" },
  { title: "Inpaint", body: "Change one part of the image and keep the rest.", href: `${HOME}/apps/inpaint`, video: "/media/capabilities/inpaint.mp4" },
  { title: "Video Extend", body: "Add seconds to a shot without a cut.", href: `${HOME}/apps/video-extend`, video: "/media/capabilities/video-extend.mp4" },
  { title: "Sketch to Render", body: "From a line drawing to a finished render.", href: `${HOME}/apps/sketch-to-render`, video: "/media/capabilities/sketch-to-render.mp4" },
  { title: "Music", body: "A track to fit the cut, in the style you name.", href: `${HOME}/audio-studio`, video: "/media/capabilities/music.mp4" },
];

const TONES = ["#2b2a28", "#33393e", "#3d3b34", "#24302f", "#141414"];

export function Apps() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollByCards = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".app-card");
    const amount = card ? card.offsetWidth + 14 : el.clientWidth * 0.8;
    const max = el.scrollWidth - el.clientWidth;
    const to = Math.max(0, Math.min(max, el.scrollLeft + dir * amount));
    if (to !== el.scrollLeft) el.scrollLeft = to;
  };

  return (
    <section id="apps" className="relative border-t border-[color:var(--line)] py-24 md:py-32">
      <div className="container-page">
        <div className="mx-auto max-w-[680px] text-center">
          <BlurHeading className="h2" lead="Apps" />
          <p className="lede mx-auto mt-5">
            Focused apps for the jobs you do most, each one tuned to a single task.
          </p>
        </div>
      </div>

      <div ref={trackRef} className="app-track no-scrollbar mt-12">
        {APPS.map((a, i) => (
          <a
            key={a.title}
            href={a.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={a.title}
            className="app-card"
            style={{ backgroundColor: TONES[i % TONES.length] }}
          >
            <h3 className="app-title">{a.title}</h3>
            <p className="app-body">{a.body}</p>
            <span className="app-arrow glass" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="app-mock">
              <div className="app-embed">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video src={withBasePath(a.video)} autoPlay muted loop playsInline preload={i < 3 ? "auto" : "metadata"} aria-hidden />
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="container-page">
        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={() => scrollByCards(-1)} aria-label="Previous apps" className="app-pager">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" onClick={() => scrollByCards(1)} aria-label="Next apps" className="app-pager">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      <style>{`
        .app-track {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          padding-left: max(32px, calc((100vw - 1240px) / 2 + 32px));
          padding-right: max(32px, calc((100vw - 1240px) / 2 + 32px));
          scroll-behavior: smooth;
          padding-block: 12px;
        }
        @media (max-width: 768px) { .app-track { padding-left: 20px; padding-right: 20px; } }
        .app-card {
          position: relative;
          flex: 0 0 auto;
          width: clamp(260px, 27vw, 380px);
          height: clamp(400px, 44vw, 500px);
          border-radius: var(--radius-4);
          padding: 28px 26px 0;
          display: flex;
          flex-direction: column;
          color: #fff;
          overflow: hidden;
          text-decoration: none;
          transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .app-card:hover, .app-card:focus-visible { transform: scale(1.015); }
        .app-title { font-size: 19px; font-weight: 400; letter-spacing: -0.01em; line-height: 1.2; }
        .app-title { padding-right: 48px; }
        .app-body { margin-top: 8px; font-size: 13.5px; line-height: 1.5; color: rgba(255,255,255,0.6); max-width: 26ch; }
        .app-arrow {
          position: absolute;
          top: 22px; right: 22px;
          width: 34px; height: 34px;
          border-radius: 999px;
          display: grid; place-items: center;
          color: #fff;
          flex: 0 0 auto;
        }
        /* The clip fills everything under the copy, down to the card's foot. */
        .app-mock { margin-top: 22px; flex: 1; position: relative; min-height: 0; }
        .app-embed {
          position: absolute;
          inset: 0 0 22px 0;
          border-radius: 12px;
          overflow: hidden;
          background: rgba(255,255,255,0.06);
        }
        .app-embed video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .app-pager {
          width: 38px; height: 38px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: var(--panel);
          color: var(--ink);
          display: grid; place-items: center;
          cursor: pointer;
        }
        @media (prefers-reduced-motion: reduce) {
          .app-card { transition: none; }
          .app-card:hover, .app-card:focus-visible { transform: none; }
          .app-track { scroll-behavior: auto; }
        }
      `}</style>
    </section>
  );
}
