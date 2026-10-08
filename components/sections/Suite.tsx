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
 * **Back to the Business page's own layout, 6 Oct** (Hamza: "use the same
 * imagine business section here"): the eyebrow and heading top-left in a
 * 640px column with its lede, then the rail of dark-toned cards
 * — the title and one line at the top, a glass arrow, and the tool's clip in a
 * 16:9 frame anchored at the foot — with the two pagers under the rail on
 * the right. The Figma 647:239 still-image rail and the ImagineArt-generated
 * stills (media/suite/*.jpg) are set aside, not deleted.
 */
type Tool = { title: string; body: string; clip: string; href: string };

/* Order (Hamza, 7 Oct): Workflows, Image / Video, Music, then the tools,
   then the studios last. */
const TOOLS: Tool[] = [
  // Create image / video / audio lead the rail, then Workflows (Hamza, 8 Oct:
  // titles and lines to his cards; they replace "Image / Video" and "Music").
  {
    title: "Create image",
    clip: "/media/hero/modes/image/1-text-to-image.mp4",
    href: `${HOME}/ai-image-generator`,
    body: "Any style, any model. Reference a product, lock a face and get the whole set, not one render.",
  },
  {
    title: "Create video",
    clip: "/media/hero/modes/video/1-prompt.mp4",
    href: `${HOME}/ai-video-generator`,
    body: "Text or image to motion with Kling, Seedance, Veo and more. Extend, relight and reframe the result.",
  },
  {
    title: "Create audio",
    clip: "/media/tools/ai-voiceover.mp4",
    href: `${HOME}/audio-studio`,
    body: "Voices, speech and sound for every clip. Clone a voice once and narrate in any language.",
  },
  {
    title: "Workflows",
    clip: "/media/suite/workflows.mp4",
    href: `${HOME}/workflow`,
    body: "Node-based, multi-step flows that turn a brief into finished assets. The repeatable backbone behind every campaign your team ships.",
  },
  {
    title: "Brand Guidelines",
    clip: "/media/capabilities/brand-kits.mp4",
    href: `${HOME}/enterprise/brand-kits`,
    body: "Lock in your colors, fonts, and visual identity so every generation stays on-brand.",
  },
  {
    title: "Video Extend",
    clip: "/media/capabilities/video-extend.mp4",
    href: `${HOME}/video`,
    body: "Take any clip and seamlessly extend it, no reshoots, no awkward cuts.",
  },
  {
    title: "Inpaint",
    clip: "/media/capabilities/inpaint.mp4",
    href: `${HOME}/edit/inpaint`,
    body: "Edit precisely. Remove, replace, or refine any part of an image with a brush.",
  },
  {
    title: "AI Influencer / UGC",
    clip: "/media/capabilities/ugc.mp4",
    href: `${HOME}/apps/heygen-avatar`,
    body: "Generate consistent, authentic-feeling creators and user-generated content at scale.",
  },
  {
    title: "Ad Studio",
    clip: "/media/studios/ad-studio.mp4",
    href: `${HOME}/ad-studio`,
    body: "Produce performance-ready ad creative in every format and ratio, fast.",
  },
  {
    // Added 8 Oct (Hamza): the third studio, between Ad and Fashion.
    title: "Film Studio",
    clip: "/media/studios/film-studio.mp4",
    href: `${HOME}/ai-film-studio`,
    body: "Characters, storyboards and scenes, carried from first concept to the final frame.",
  },
  {
    title: "Fashion Studio",
    clip: "/media/studios/fashion-studio.mp4",
    href: `${HOME}/fashion-studio`,
    body: "Bring apparel and product to life with on-model imagery and editorial-grade visuals.",
  },
];

/* A grainy gradient behind every card (Hamza, 7 Oct), after two reference
   wallpapers: one muted colour filling the card, lighter low and toward the
   middle, falling to near-black at the top and corners, with fine even
   grain. Nine colours, generated in ImagineArt as one set so the rail reads
   as one family; all dark at the top, where the white title sits. */
// Purple, blue and green under the three Create cards, as in Hamza's reference (8 Oct).
const CARD_BG = ["plum", "indigo", "sage", "teal", "terracotta", "ochre", "rose", "slate", "olive", "teal", "plum"]
  .map((n) => `/media/suite/field-${n}.jpg`);
/** A flat black wash over each still, to sit them a step darker (Hamza, 7 Oct). */
const CARD_DARKEN = 0.52;

export function Suite() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Animated by `scroll-behavior: smooth` on the track. Assigning scrollLeft
  // rather than calling scrollBy({behavior}), which some engines ignore.
  const scrollByCards = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".suite-card");
    const gap = 14;
    const amount = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    const max = el.scrollWidth - el.clientWidth;
    const to = Math.max(0, Math.min(max, el.scrollLeft + dir * amount));
    if (to === el.scrollLeft) return;
    el.scrollLeft = to;
  };

  return (
    <section id="suite" className="relative border-t border-[color:var(--line)] py-24 md:py-32 lg:border-t-0">
      <SectionGuides edge="both" />
      <div className="container-page">
        {/* Chevrons top right, level with the lede (Hamza, 8 Oct). */}
        <div className="flex items-end justify-between gap-8">
        <div className="max-w-[640px]">
          <p className="eyebrow">The suite</p>
          <BlurHeading className="h2 mt-4" lead="Everything your team" muted="needs to create" />
          <p className="lede mt-5">
            A full suite of tools that take you from idea to finished asset, no
            stitching together five different products.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button type="button" onClick={() => scrollByCards(-1)} aria-label="Previous tools" className="suite-pager">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" onClick={() => scrollByCards(1)} aria-label="Next tools" className="suite-pager">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        </div>
      </div>

      {/* A rail rather than a grid. Nine tools over four columns left a final
          row of one card and three empty cells, which read as a mistake. */}
      <div ref={trackRef} className="suite-track no-scrollbar">
        {TOOLS.map((t, i) => (
          <a
            key={t.title}
            href={t.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.title}
            className={`suite-card suite-tone-${(i % 5) + 1} suite-bg`}
            style={CARD_BG[i] ? { backgroundImage: `linear-gradient(rgba(0, 0, 0, ${CARD_DARKEN}), rgba(0, 0, 0, ${CARD_DARKEN})), url(${withBasePath(CARD_BG[i])})` } : undefined}
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
                <video className="suite-media" src={withBasePath(t.clip)} autoPlay muted loop playsInline preload={i < 3 ? "auto" : "metadata"} aria-hidden />
              </div>
            </div>
          </a>
        ))}
      </div>


      <style>{`
        /* Gutters match .container-page so the first card lines up with the
           heading above it rather than hugging the viewport edge. */
        .suite-track {
          margin-top: 56px;
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
        /* The Business page's card: a dark tone, copy at the top, a glass
           arrow, and the media clipped to the card's foot. */
        .suite-card {
          position: relative;
          flex: 0 0 auto;
          width: clamp(260px, 27vw, 380px);
          height: clamp(420px, 46vw, 520px);
          border-radius: calc(20px * var(--corner));
          padding: 28px 26px 0;
          display: flex;
          flex-direction: column;
          color: var(--on-media);
          overflow: hidden;
          text-decoration: none;
          transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .suite-card:hover,
        .suite-card:focus-visible { transform: scale(1.015); }
        .suite-card:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; }
        @media (prefers-reduced-motion: reduce) {
          .suite-card { transition: none; }
          .suite-card:hover, .suite-card:focus-visible { transform: none; }
        }
        .suite-tone-1 { background-color: #2b2a28; }
        .suite-tone-2 { background-color: #33393e; }
        .suite-tone-3 { background-color: #3d3b34; }
        .suite-tone-4 { background-color: #24302f; }
        .suite-tone-5 { background-color: #141414; }
        /* Every card on a grainy gradient (see CARD_BG); the tone colour
           shows only until the still loads. */
        .suite-bg { background-size: cover; background-position: center; background-repeat: no-repeat; }

        .suite-card-title {
          font-size: 19px;
          font-weight: 400;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        /* The arrow sits in the card's top-right corner (Hamza, 6 Oct). */
        .suite-arrow {
          position: absolute;
          top: 20px; right: 20px;
          width: 34px; height: 34px;
          border-radius: var(--radius-pill);
          display: grid; place-items: center;
          color: var(--on-media);
        }
        .suite-card-title { padding-right: 48px; }
        .suite-card-body {
          margin-top: 8px;
          font-size: 13.5px;
          line-height: 1.5;
          color: var(--on-media-3);
          max-width: 24ch;
        }
        /* One frame per card, bottom-anchored, so the media lines up
           across the rail whatever each source's own ratio is. */
        .suite-mock { margin-top: auto; flex: 1; position: relative; min-height: 0; }
        /* Larger than the Business page's (Hamza, 6 Oct): the frame bleeds
           past the copy's side padding to 12px from the card's edges and runs
           4:3 rather than 16:9, so it fills most of the card's lower half. */
        .suite-embed {
          position: absolute;
          left: -14px; right: -14px; bottom: 12px;
          aspect-ratio: 4 / 3;
          border-radius: calc(12px * var(--corner));
          overflow: hidden;
        }
        .suite-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        .suite-pager {
          width: 38px; height: 38px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--line);
          background: var(--page-bg);
          color: var(--ink);
          display: grid; place-items: center;
          cursor: pointer;
        }
        .suite-pager:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
      `}</style>
    </section>
  );
}
