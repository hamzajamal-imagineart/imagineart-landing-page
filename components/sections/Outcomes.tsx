"use client";

import { withBasePath } from "@/lib/assets";
import { BlurHeading } from "@/components/BlurHeading";
import { START_HREF } from "@/lib/links";
import { PointsTimeline, CONTROL_POINTS, type TimelinePoint } from "@/components/sections/Control";

/**
 * Outcomes: "From product shot to viral phenomenon". Built from Figma
 * H-Drafts 644:4317 (Hamza, 6 Oct), above Industries.
 *
 * Heading, line and "Start creating" action are the frame's. Under them,
 * since 8 Oct, the three control points as a timeline (PointsTimeline in
 * Control.tsx), replacing the frame's three-plus-one card grid. The four
 * outcome entries are kept in code but not shown. **Images generated in
 * ImagineArt for this section** (Hamza, 6 Oct; Nano Banana Pro at 2K, the
 * ImagineArt (Official) workspace), one per card from its own line, saved to
 * media/outcomes/ as JPEG: three 3:4 at 1100px wide, the Filmmaking card 21:9
 * at 2400px. They replaced the frame's own images, which were Magnific's.
 *
 * The scrim is heavier than the frame's 25%: white type over a photograph
 * needs a floor under it, not a tint.
 *
 * Studio marks top-left (back on 8 Oct, Hamza): Ad Studio on Advertising,
 * Fashion Studio on Brand campaigns, Film Studio on Filmmaking, each over a
 * light scrim at the top so the white mark holds on a bright image.
 */
type Logo = { src: string; alt: string; h: number };
const CARDS: { title: string; body: string; image: string; logo?: Logo }[] = [
  {
    title: "Advertising",
    body: "Brief to final asset. No vendor chain, no waiting. Just the work.",
    image: "/media/outcomes/advertising.jpg",
    logo: { src: "/media/studios/logos/ad-studio-white.svg", alt: "Ad Studio", h: 24 },
  },
  {
    title: "Product shots",
    body: "AI-powered photoshoots. No studio. No crew. No scheduling.",
    image: "/media/outcomes/product.jpg",
  },
  {
    title: "Brand campaigns",
    body: "On-brand visuals, video, and audio at any scale, any format.",
    image: "/media/outcomes/brand.jpg",
    logo: { src: "/media/studios/logos/fashion-studio-white.svg", alt: "Fashion Studio", h: 32 },
  },
];
const WIDE = {
  title: "Filmmaking",
  body: "Characters, storyboards, and concepts to explore. Cinematic tools made for the final frame.",
  image: "/media/outcomes/film.jpg",
  /* Footage behind the card (Hamza, 7 Oct): the Film Studio clip, streamed
     from the same CDN the old studio reel used, with the still as poster. */
  video: "https://imagine.animagic.art/imagine-one/film-studio/video/27.mp4",
  logo: { src: "/media/studios/logos/film-studio.png", alt: "Film Studio", h: 32 },
};

/** An outcome's visual in the timeline: the still (or clip), its studio
 *  mark top-left over a light scrim. The title and line moved to the list. */
function OutcomeVisual({ image, video, logo }: { image: string; video?: string; logo?: Logo }) {
  return (
    <>
      {video ? (
        <video className="cm-bg" src={withBasePath(video)} poster={withBasePath(image)} autoPlay muted loop playsInline preload="metadata" aria-hidden />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="cm-bg" src={withBasePath(image)} alt="" loading="lazy" />
      )}
      {logo && (
        <>
          <span className="oc-scrim-top" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="oc-logo" src={withBasePath(logo.src)} alt={logo.alt} style={{ height: logo.h }} />
        </>
      )}
    </>
  );
}

/* One timeline under the heading (Hamza, 8 Oct). */
// Outcome points 01–04 dropped (Hamza, 8 Oct); CARDS, WIDE and
// OutcomeVisual stay so they can come back as one spread line.
const POINTS: TimelinePoint[] = [...CONTROL_POINTS];

export function Outcomes() {
  return (
    <section id="outcomes" className="relative py-24 md:py-32" /* no guide lines or rule (Hamza, 8 Oct) */>
      <div className="container-page">
        <div className="max-w-[680px]">
          <BlurHeading className="h2" lead="From product shot to viral phenomenon" />
          <p className="lede mt-5">
            Global on-brand campaigns, product shots, and top-tier filmmaking. Everything a brand
            needs to show up at the highest level, in every format, every time.
          </p>
          <a href={START_HREF} className="oc-cta mt-7">
            Start creating
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="oc-timeline">
          <PointsTimeline points={POINTS} />
        </div>
      </div>

      <style>{`
        .oc-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 50px;
          padding: 0 24px;
          border-radius: var(--radius-2);
          background: var(--ink-heading);
          color: var(--page-bg);
          font-size: 16px;
          font-weight: 500;
          transition: opacity 200ms ease;
        }
        .oc-cta:hover { opacity: 0.86; }
        .oc-cta:focus-visible { outline: 2px solid var(--ink-heading); outline-offset: 3px; }

        .oc-timeline { margin-top: 64px; }
        /* A light floor at the top of a visual that carries a studio mark,
           so the white mark holds on a bright image. */
        .oc-scrim-top { position: absolute; inset: 0; background: linear-gradient(to bottom, var(--scrim-3) 0%, rgba(0, 0, 0, 0) 26%); }
        .oc-logo { position: absolute; top: 24px; left: 24px; width: auto; display: block; filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25)); }
      `}</style>
    </section>
  );
}
