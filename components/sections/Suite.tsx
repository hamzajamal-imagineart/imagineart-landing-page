"use client";

import { useEffect, useRef, useState } from "react";
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
 * **Layout since 6 Oct: Figma H-Drafts 647:239** (a Lovart reference): the
 * heading on the left and two round pagers on the right on one baseline, then
 * a rail of 320px cards, 32px apart, each a 433px clip on a 12px radius with
 * the title (20px) and one line under it rather than over it. The rail starts
 * on the heading's edge and bleeds off the right; the pagers dim at either
 * end. The eyebrow and lede went, as the frame has neither. The frame's
 * images are Lovart's own UI, so the cards carry our own.
 *
 * **Stills, not clips, since 6 Oct** (Hamza): nine images generated in
 * ImagineArt (Nano Banana Pro, 3:4, the ImagineArt (Official) workspace), one
 * finished-looking output per tool, saved to media/suite/*.jpg at 637 × 854
 * (70–190KB). The old clips stay on disk.
 */
type Tool = { title: string; body: string; image: string; href: string };

const TOOLS: Tool[] = [
  {
    title: "Workflows",
    image: "/media/suite/workflows.jpg",
    href: `${HOME}/workflow`,
    body: "Node-based, multi-step flows that turn a brief into finished assets. The repeatable backbone behind every campaign your team ships.",
  },
  {
    title: "Image / Video Canvas",
    image: "/media/suite/canvas.jpg",
    href: `${HOME}/image`,
    body: "Full editing surfaces for both. Create and refine in the same place, no exports, no handoffs, no drift.",
  },
  {
    title: "Brand Guidelines",
    image: "/media/suite/brand-guidelines.jpg",
    href: `${HOME}/enterprise/brand-kits`,
    body: "Lock in your colors, fonts, and visual identity so every generation stays on-brand.",
  },
  {
    title: "Video Extend",
    image: "/media/suite/video-extend.jpg",
    href: `${HOME}/video`,
    body: "Take any clip and seamlessly extend it, no reshoots, no awkward cuts.",
  },
  {
    title: "Inpaint",
    image: "/media/suite/inpaint.jpg",
    href: `${HOME}/edit/inpaint`,
    body: "Edit precisely. Remove, replace, or refine any part of an image with a brush.",
  },
  {
    title: "AI Influencer / UGC",
    image: "/media/suite/ugc.jpg",
    href: `${HOME}/apps/heygen-avatar`,
    body: "Generate consistent, authentic-feeling creators and user-generated content at scale.",
  },
  {
    title: "Music",
    image: "/media/suite/music.jpg",
    href: `${HOME}/audio/music/elevenlabs-music`,
    body: "Score your content with original, royalty-free tracks generated to fit the moment.",
  },
  {
    title: "Ad Studio",
    image: "/media/suite/ad-studio.jpg",
    href: `${HOME}/ad-studio`,
    body: "Produce performance-ready ad creative in every format and ratio, fast.",
  },
  {
    title: "Fashion Studio",
    image: "/media/suite/fashion-studio.jpg",
    href: `${HOME}/fashion-studio`,
    body: "Bring apparel and product to life with on-model imagery and editorial-grade visuals.",
  },
];

export function Suite() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /* The pagers dim at either end, as in the frame, rather than wrapping. */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const sync = () => {
      setAtStart(el.scrollLeft <= 2);
      setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2);
    };
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => { el.removeEventListener("scroll", sync); window.removeEventListener("resize", sync); };
  }, []);

  // Animated by `scroll-behavior: smooth` on the track. Assigning scrollLeft
  // rather than calling scrollBy({behavior}), which some engines ignore.
  const scrollByCards = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".suite-card");
    const amount = card ? (card.offsetWidth + 32) * 2 : el.clientWidth * 0.8;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollLeft = Math.max(0, Math.min(max, el.scrollLeft + dir * amount));
    // Re-check the ends once the smooth scroll settles, in case the browser
    // coalesced the scroll events away.
    window.setTimeout(() => el.dispatchEvent(new Event("scroll")), 520);
  };

  return (
    <section id="suite" className="relative border-t border-[color:var(--line)] py-24 md:py-32 lg:border-t-0">
      <SectionGuides edge="top" />
      <div className="container-page">
        {/* Heading left, pagers right, both sitting on the same baseline. */}
        <div className="suite-head">
          <BlurHeading className="h2" lead="Everything your team" muted="needs to create" />
          <div className="suite-pagers">
            <button type="button" onClick={() => scrollByCards(-1)} aria-label="Previous tools" className="suite-pager" disabled={atStart}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button type="button" onClick={() => scrollByCards(1)} aria-label="Next tools" className="suite-pager" disabled={atEnd}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div ref={trackRef} className="suite-track no-scrollbar">
        {TOOLS.map((t, i) => (
          <a key={t.title} href={t.href} target="_blank" rel="noopener noreferrer" className="suite-card">
            <span className="suite-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath(t.image)} alt="" loading={i < 4 ? "eager" : "lazy"} width={637} height={854} />
            </span>
            <span className="suite-text">
              <h3 className="suite-card-title">{t.title}</h3>
              <p className="suite-card-body">{t.body}</p>
            </span>
          </a>
        ))}
      </div>

      <style>{`
        .suite-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }
        .suite-pagers { display: flex; gap: 12px; flex: 0 0 auto; }
        .suite-pager {
          width: 48px; height: 48px;
          border-radius: var(--radius-pill);
          border: 0;
          background: var(--hover-wash);
          box-shadow: inset 0 0 0 1px var(--line);
          color: var(--ink);
          display: grid; place-items: center;
          cursor: pointer;
          transition: background 160ms ease, opacity 160ms ease;
        }
        .suite-pager:hover:not(:disabled) { background: var(--tile-2); }
        .suite-pager:disabled { opacity: 0.4; cursor: default; }
        .suite-pager:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

        /* Starts on the heading's left edge and bleeds off the right, as the
           frame does. overflow-x: auto coerces overflow-y to auto, so the
           card's hover lift needs a little headroom. */
        .suite-track {
          margin-top: 56px;
          display: flex;
          gap: 32px;
          overflow-x: auto;
          padding-left: max(32px, calc((100vw - 1240px) / 2 + 32px));
          padding-right: max(32px, calc((100vw - 1240px) / 2 + 32px));
          padding-block: 6px;
          scroll-behavior: smooth;
          scroll-padding-left: max(32px, calc((100vw - 1240px) / 2 + 32px));
          scroll-snap-type: x proximity;
        }
        @media (max-width: 768px) {
          .suite-track { padding-left: 20px; padding-right: 20px; gap: 20px; scroll-padding-left: 20px; }
          .suite-pagers { display: none; }
        }
        .suite-card {
          flex: 0 0 auto;
          width: 320px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          color: inherit;
          text-decoration: none;
          scroll-snap-align: start;
        }
        .suite-media {
          position: relative;
          display: block;
          height: 433px;
          border-radius: var(--radius-3);
          overflow: hidden;
          background: var(--tile);
        }
        .suite-media img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .suite-card:hover .suite-media img { transform: scale(1.03); }
        .suite-card:focus-visible { outline: 2px solid var(--ink); outline-offset: 6px; border-radius: var(--radius-3); }
        .suite-text { display: flex; flex-direction: column; gap: 8px; padding: 0 8px; }
        .suite-card-title {
          font-size: 20px;
          line-height: 1.2;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--ink-heading);
        }
        .suite-card-body { font-size: 14px; line-height: 1.5; color: var(--ink-2); }
        @media (max-width: 768px) {
          .suite-card { width: 272px; }
          .suite-media { height: 368px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .suite-media img { transition: none; }
          .suite-card:hover .suite-media img { transform: none; }
        }
      `}</style>
    </section>
  );
}
