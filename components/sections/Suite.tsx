"use client";

import { useRef } from "react";
import { withBasePath } from "@/lib/assets";
import { BlurHeading } from "@/components/BlurHeading";
import { SectionGuides } from "@/components/primitives/SectionGuides";
import { HOME } from "@/lib/links";

/**
 * The suite: nine tools on a card rail with pagers, ported from the Enterprise
 * page's `platform/Suite` + `SuiteRail` (Hamza, 24 Sep) and set directly
 * under the partner logos.
 *
 * Copy, destinations and footage are the Enterprise page's `BUSINESS_TOOLS`,
 * verbatim. Seven of the nine clips were already here under other names
 * (capabilities/, studios/); only Workflows and Image / Video Canvas came
 * across, into media/suite/. One client component rather than the source's
 * server + client split: that split existed so other server components could
 * slice the tool arrays, and nothing here does.
 *
 * Re-toned for dark: the pagers take the page's tokens rather than white, and
 * the cards carry the 12% white hairline the studio banners use.
 */
type Tool = { title: string; body: string; video: string; href: string };

const TOOLS: Tool[] = [
  {
    title: "Workflows",
    video: "/media/suite/workflows.mp4",
    href: `${HOME}/workflow`,
    body: "Node-based, multi-step flows that turn a brief into finished assets. The repeatable backbone behind every campaign your team ships.",
  },
  {
    title: "Image / Video Canvas",
    video: "/media/suite/canvas.mp4",
    href: `${HOME}/image`,
    body: "Full editing surfaces for both. Create and refine in the same place, no exports, no handoffs, no drift.",
  },
  {
    title: "Brand Guidelines",
    video: "/media/capabilities/brand-kits.mp4",
    href: `${HOME}/enterprise/brand-kits`,
    body: "Lock in your colors, fonts, and visual identity so every generation stays on-brand.",
  },
  {
    title: "Video Extend",
    video: "/media/capabilities/video-extend.mp4",
    href: `${HOME}/video`,
    body: "Take any clip and seamlessly extend it, no reshoots, no awkward cuts.",
  },
  {
    title: "Inpaint",
    video: "/media/capabilities/inpaint.mp4",
    href: `${HOME}/edit/inpaint`,
    body: "Edit precisely. Remove, replace, or refine any part of an image with a brush.",
  },
  {
    title: "AI Influencer / UGC",
    video: "/media/capabilities/ugc.mp4",
    href: `${HOME}/apps/heygen-avatar`,
    body: "Generate consistent, authentic-feeling creators and user-generated content at scale.",
  },
  {
    title: "Music",
    video: "/media/capabilities/music.mp4",
    href: `${HOME}/audio/music/elevenlabs-music`,
    body: "Score your content with original, royalty-free tracks generated to fit the moment.",
  },
  {
    title: "Ad Studio",
    video: "/media/studios/ad-studio.mp4",
    href: `${HOME}/ad-studio`,
    body: "Produce performance-ready ad creative in every format and ratio, fast.",
  },
  {
    title: "Fashion Studio",
    video: "/media/studios/fashion-studio.mp4",
    href: `${HOME}/fashion-studio`,
    body: "Bring apparel and product to life with on-model imagery and editorial-grade visuals.",
  },
];

export function Suite() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Animated by `scroll-behavior: smooth` on the track. Assigning scrollLeft
  // rather than calling scrollBy({behavior}), which some engines ignore.
  const scrollByCards = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".suite-card");
    const amount = card ? card.offsetWidth + 14 : el.clientWidth * 0.8;
    const max = el.scrollWidth - el.clientWidth;
    const to = Math.max(0, Math.min(max, el.scrollLeft + dir * amount));
    if (to !== el.scrollLeft) el.scrollLeft = to;
  };

  return (
    <section id="suite" className="relative border-t border-[color:var(--line)] py-24 md:py-32 lg:border-t-0">
      <SectionGuides edge="top" />
      <div className="container-page">
        <div className="max-w-[640px]">
          <p className="eyebrow">The suite</p>
          <BlurHeading className="h2 mt-4" lead="Everything your team" muted="needs to create" />
          <p className="lede mt-5">
            A full suite of tools that take you from idea to finished asset, no
            stitching together five different products.
          </p>
        </div>
      </div>

      {/* A rail rather than a grid: nine over four columns leaves a last row
          of one card and three empty cells. */}
      <div ref={trackRef} className="suite-track no-scrollbar mt-14">
        {TOOLS.map((t, i) => (
          <a
            key={t.title}
            href={t.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.title}
            className={`suite-card suite-tone-${(i % 5) + 1}`}
          >
            <h3 className="suite-card-title">{t.title}</h3>
            <p className="suite-card-body">{t.body}</p>
            <span className="suite-arrow glass" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>

            <div className="suite-mock">
              <div className="suite-embed">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  className="suite-media"
                  src={withBasePath(t.video)}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload={i < 3 ? "auto" : "metadata"}
                  aria-hidden
                />
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="container-page">
        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={() => scrollByCards(-1)} aria-label="Previous tools" className="suite-pager">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" onClick={() => scrollByCards(1)} aria-label="Next tools" className="suite-pager">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      <style>{`
        /* Gutters match .container-page so the first card lines up with the
           heading above it rather than hugging the viewport edge. */
        .suite-track {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          padding-left: max(32px, calc((100vw - 1240px) / 2 + 32px));
          padding-right: max(32px, calc((100vw - 1240px) / 2 + 32px));
          scroll-behavior: smooth;
          min-width: 0;
          /* overflow-x: auto coerces overflow-y to auto, so the hover scale
             needs headroom or the card is clipped. */
          padding-block: 12px;
        }
        @media (max-width: 768px) {
          .suite-track { padding-left: 20px; padding-right: 20px; }
        }
        .suite-card {
          position: relative;
          flex: 0 0 auto;
          width: clamp(260px, 27vw, 380px);
          height: clamp(420px, 46vw, 520px);
          border-radius: 20px;
          padding: 28px 26px 0;
          display: flex;
          flex-direction: column;
          color: #fff;
          overflow: hidden;
          text-decoration: none;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
          transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .suite-card:hover,
        .suite-card:focus-visible { transform: scale(1.015); }
        @media (prefers-reduced-motion: reduce) {
          .suite-card { transition: none; }
          .suite-card:hover, .suite-card:focus-visible { transform: none; }
        }
        .suite-tone-1 { background-color: #2b2a28; }
        .suite-tone-2 { background-color: #33393e; }
        .suite-tone-3 { background-color: #3d3b34; }
        .suite-tone-4 { background-color: #24302f; }
        .suite-tone-5 { background-color: #1a1a1b; }

        .suite-card-title {
          font-size: 19px;
          font-weight: 400;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .suite-card-body {
          margin-top: 8px;
          font-size: 13.5px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.64);
          max-width: 24ch;
        }
        .suite-arrow {
          margin-top: 16px;
          width: 34px; height: 34px;
          border-radius: 999px;
          display: grid; place-items: center;
          color: #fff;
          flex: 0 0 auto;
        }
        /* One 16:9 frame per card, bottom-anchored, so the media lines up
           across the rail whatever each source's own ratio is. */
        .suite-mock { margin-top: auto; flex: 1; position: relative; min-height: 0; }
        .suite-embed {
          position: absolute;
          left: 0; right: 0; bottom: 22px;
          aspect-ratio: 16 / 9;
          border-radius: 12px;
          overflow: hidden;
        }
        .suite-media { width: 100%; height: 100%; object-fit: cover; display: block; }
        .suite-pager {
          width: 38px; height: 38px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: var(--tile);
          color: var(--ink);
          display: grid; place-items: center;
          cursor: pointer;
          transition: background 160ms ease;
        }
        .suite-pager:hover { background: var(--hover-wash); }
        .suite-pager:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
      `}</style>
    </section>
  );
}
