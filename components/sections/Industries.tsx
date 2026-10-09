"use client";

import { useRef } from "react";
import { SectionGuides } from "@/components/primitives/SectionGuides";
import { BlurHeading } from "@/components/BlurHeading";
import { withBasePath } from "@/lib/assets";

/**
 * Industries: ten industry cards in a grid, ported from the Enterprise page's
 * `IndustriesSection` (Hamza, 24 Sep) into the slot Creative Tools held.
 * Copy, card bodies, gallery links and footage are that section's, verbatim;
 * the clips came across into media/industries/ (8.1MB). The only changes are
 * the heading, which uses this page's BlurHeading, and the hairline, which
 * takes the page's --line.
 *
 * <CreativeTools> is pulled, not deleted.
 */
/* The cards are not links (Hamza, 7 Oct: they won't redirect). They used to
   deep-link into the template gallery (enterprise/template?category=…); the
   `category` on each entry is that slug, kept in case the links come back. */
const INDUSTRIES = [
  /* Bodies cut to one short line each (Hamza, 8 Oct). Earlier: card copy rewritten as plain sentences for an enterprise reader
     (Hamza, 7 Oct): what the team makes, then why it matters, with the
     shorthand (PDP, POS, DVC/TVC) spelled out. */
  { name: "Fashion & Apparel", video: "/media/industries/fashion.mp4", category: "fashion", body: "Product imagery, lookbooks and fashion films,\nfrom design to launch." },
  { name: "CPG", video: "/media/industries/cpg.mp4", category: "fmcg", body: "Full campaigns in-house,\nfrom ads to TV spots." },
  { name: "Food & Beverage", video: "/media/industries/food-beverage.mp4", category: "fmcg", body: "Appetising food and drink,\ncarried into every campaign." },
  { name: "Furniture / Home Décor", video: "/media/industries/furniture.mp4", body: "Every piece in a styled room,\nno shoot needed." },
  { name: "Electronics", video: "/media/industries/electronics.mp4", body: "Launch-ready product and lifestyle renders\nfor every channel." },
  { name: "Beauty & Cosmetics", video: "/media/industries/beauty.mp4", category: "fmcg", body: "Campaigns and trend-led video\nat the category's pace." },
  { name: "Automotive", video: "/media/industries/automotive.mp4", category: "cinematic", body: "Launch films and ads\nthat sell the model." },
  { name: "Telecom", video: "/media/industries/telecom.mp4", category: "advertising", body: "Fresh offers across\nsocial, ads and stores." },
  { name: "E-commerce / Marketplaces", video: "/media/industries/ecommerce.mp4", category: "advertising", body: "Listing-ready images and motion\nfor every seller." },
];

export function Industries() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Chevrons, as on the suite rail: one card per click, animated by
  // `scroll-behavior: smooth` on the track.
  const scrollByCards = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".ind-card");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 20;
    const amount = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    const max = el.scrollWidth - el.clientWidth;
    const to = Math.max(0, Math.min(max, el.scrollLeft + dir * amount));
    if (to !== el.scrollLeft) el.scrollLeft = to;
  };

  return (
    <section
      id="industries"
      className="relative border-t border-[color:var(--line)] py-24 md:py-32 lg:border-t-0"
    >
      <SectionGuides edge="top" />
      <div className="container-page">
        {/* Chevrons top right, level with the lede (Hamza, 8 Oct). */}
        <div className="flex items-end justify-between gap-8">
        <div className="max-w-[640px]">
          <p className="eyebrow">Industries</p>
          <BlurHeading className="h2 mt-4" lead="Built for" muted="your industry" />
          <p className="lede mt-5">
            One platform, every sector. Use cases mapped to how your team
            already works, not how a tool wishes you did. Find yours below.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button type="button" onClick={() => scrollByCards(-1)} aria-label="Previous industries" className="ind-pager">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" onClick={() => scrollByCards(1)} aria-label="Next industries" className="ind-pager">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        </div>
      </div>

      {/* Card shape (Hamza, 8 Oct, after the "Controllable content" page):
          footage in a rounded frame, title and copy underneath, on a
          sideways-scrolling rail. */}
      <div ref={trackRef} className="ind-track mt-12">
        {INDUSTRIES.map((i, n) => (
          <div key={i.name} className="ind-card">
            <div className="ind-media">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video src={withBasePath(i.video)} autoPlay muted loop playsInline preload={n < 3 ? "auto" : "metadata"} aria-hidden />
            </div>
            <h3 className="ind-title">{i.name}</h3>
            <p className="ind-body">{i.body}</p>
          </div>
        ))}
      </div>

      <style>{`
        /* Horizontal rail (Hamza, 8 Oct): runs to the viewport edges, with
           three cards in view and the rest overflowing to the right,
           snapping to a card. The first card lines up with .container-page.
           Cards sit above the section's guide lines on the page colour, so a
           line never runs through a card's copy as it scrolls past. */
        .ind-track {
          --ind-gutter: max(32px, calc((100vw - 1240px) / 2 + 32px));
          position: relative;
          z-index: 1;
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: calc((min(100vw, 1240px) - 64px - 40px) / 3);
          gap: 20px;
          overflow-x: auto;
          overscroll-behavior-x: contain;
          scroll-snap-type: x mandatory;
          scroll-padding-left: var(--ind-gutter);
          padding-left: var(--ind-gutter);
          padding-right: var(--ind-gutter);
          scrollbar-width: none;
          scroll-behavior: smooth;
        }
        .ind-track::-webkit-scrollbar { display: none; }
        .ind-card { scroll-snap-align: start; background: var(--page-bg); }
        @media (max-width: 999px) { .ind-track { grid-auto-columns: 44vw; } }
        @media (max-width: 768px) { .ind-track { --ind-gutter: 20px; gap: 14px; } }
        @media (max-width: 639px) { .ind-track { grid-auto-columns: 78vw; } }
        .ind-media { position: relative; aspect-ratio: 4 / 5; border-radius: 16px; overflow: hidden; background: var(--tile); }
        .ind-media video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .ind-title { margin-top: 18px; font-size: 20px; line-height: 28px; font-weight: 500; letter-spacing: -0.01em; color: var(--ink-heading); }
        /* Two lines on every card (Hamza, 8 Oct): each body carries its own
           break (\n, kept by pre-line), clamped at two on narrow cards. */
        .ind-body { margin-top: 6px; min-height: calc(2 * 1.55em); font-size: 15px; line-height: 1.55; color: var(--ink-2); white-space: pre-line; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .ind-pager { width: var(--btn-icon-md); height: var(--btn-icon-md); border-radius: var(--radius-pill); border: 1px solid var(--line); background: var(--page-bg); color: var(--ink); display: grid; place-items: center; cursor: pointer; }
        .ind-pager:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
      `}</style>

    </section>
  );
}
