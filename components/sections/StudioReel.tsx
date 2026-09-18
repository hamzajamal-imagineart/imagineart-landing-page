"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { STUDIO_HREFS } from "@/lib/links";
import { BlurHeading } from "@/components/BlurHeading";
import { SectionGuides } from "@/components/primitives/SectionGuides";

/**
 * The studios, as a coverflow of their own work.
 *
 * Three clips on a ring: the selected one flat and centred, its neighbours
 * turned away on either side and cut by the edges of the section. Chevrons
 * step it; the dots say where you are. Each card is a link into its studio,
 * and carries a tag naming the kind of work rather than the studio: the
 * section heading above already names all three, and the link is what says
 * where the card goes.
 *
 * With three items every step wraps one card from one end of the ring to the
 * other, and it is left to animate the long way on purpose: the selected card
 * sits above its neighbours, so the wrapping card passes behind it and comes
 * out the far side. That costs nothing and needs no special case — the
 * alternative, teleporting it, is what reads as a glitch.
 *
 * Film Studio streams its clip rather than serving it: the local
 * `studios/film-studio.mp4` is the right footage and 14MB of it, which this
 * section would have carried for one card of three. `withBasePath()` passes an
 * absolute URL through untouched, so it needs no local copy.
 */
/** The same CDN the Ad Studio banner streams its marquee from. */
const AD_CDN = "https://cdn-imagine.vyro.ai/imagine-one/marketingstudio/home";

const REELS = [
  {
    id: "ad",
    label: "Ad Studio",
    href: STUDIO_HREFS.ad,
    tag: "Advertising",
    /* Three at once, because an ad is a vertical and three of them fill a
       16:9 card where one would sit in a letterbox. They are posterless
       elsewhere on the page but not here: the CDN carries a .webp per clip,
       so the card is never three black rectangles while it loads. */
    videos: [`${AD_CDN}/UGC_1.mp4`, `${AD_CDN}/Unboxing_4.mp4`, `${AD_CDN}/Tutorial_And_Review_2.mp4`],
    posters: [`${AD_CDN}/UGC_1.webp`, `${AD_CDN}/Unboxing_4.webp`, `${AD_CDN}/Tutorial_And_Review_2.webp`],
  },
  { id: "fashion", label: "Fashion Studio", href: STUDIO_HREFS.fashion, tag: "Fashion", videos: ["/media/studios/fashion-studio.mp4"] },
  { id: "film", label: "Film Studio", href: STUDIO_HREFS.film, tag: "Filmmaking", videos: ["https://imagine.animagic.art/imagine-one/film-studio/video/27.mp4"] },
];

export function StudioReel() {
  const [active, setActive] = useState(0);
  const clips = useRef<(HTMLVideoElement | null)[][]>([]);

  // Only the selected clip plays. Three at once is three decoders running for
  // two pictures nobody is looking straight at.
  useEffect(() => {
    clips.current.forEach((card, i) => {
      card?.forEach((v) => {
        if (!v) return;
        if (i === active) void v.play().catch(() => {});
        else v.pause();
      });
    });
  }, [active]);

  const step = (d: number) => setActive((a) => (a + d + REELS.length) % REELS.length);

  return (
    <section id="studio-reel" className="relative border-t border-[color:var(--line)] py-24 md:py-32 lg:border-t-0">
      <SectionGuides edge="top" />
      <div className="container-page">
        <div className="mx-auto max-w-[680px] text-center">
          <BlurHeading className="h2" lead="Made in the studios" />
          <p className="lede mx-auto mt-5">
            Campaign films, catalogue shoots and trailers, each one finished in
            the studio built for it.
          </p>
        </div>
      </div>

      <div className="sr-stage">
        {REELS.map((r, i) => {
          const d = ((i - active + 1 + REELS.length) % REELS.length) - 1;
          return (
            <a
              key={r.id}
              className={`sr-card ${d === 0 ? "sr-card-on" : ""}`}
              style={{ ["--d" as string]: d }}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-hidden={d !== 0}
              tabIndex={d === 0 ? 0 : -1}
            >
              <span className={`sr-media ${r.videos.length > 1 ? "sr-media-split" : ""}`}>
                {r.videos.map((v, j) => (
                  /* eslint-disable-next-line jsx-a11y/media-has-caption */
                  <video
                    key={v}
                    ref={(el) => {
                      clips.current[i] = clips.current[i] ?? [];
                      clips.current[i][j] = el;
                    }}
                    src={withBasePath(v)}
                    poster={r.posters?.[j]}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    disablePictureInPicture
                  />
                ))}
              </span>
              <span className="sr-tag">{r.tag}</span>
            </a>
          );
        })}
      </div>

      <div className="sr-controls">
        <button type="button" className="sr-arrow" onClick={() => step(-1)} aria-label="Previous studio">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span className="sr-dots">
          {REELS.map((r, i) => (
            <button
              key={r.id}
              type="button"
              className={`sr-dot ${i === active ? "sr-dot-on" : ""}`}
              onClick={() => setActive(i)}
              aria-label={r.label}
              aria-current={i === active}
            />
          ))}
        </span>
        <button type="button" className="sr-arrow" onClick={() => step(1)} aria-label="Next studio">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <style>{`
        /* The stage is wider than the page and clipped, which is what cuts the
           turned cards at the edges. The perspective lives here, so every card
           is turned against the same vanishing point. */
        .sr-stage {
          position: relative;
          margin-top: clamp(36px, 5vw, 56px);
          height: clamp(260px, 42vw, 620px);
          perspective: 1800px;
          overflow: hidden;
        }
        .sr-card {
          position: absolute;
          top: 50%;
          left: 50%;
          width: min(1060px, 74vw);
          aspect-ratio: 16 / 9;
          margin: 0;
          border-radius: var(--radius-5);
          overflow: hidden;
          background: var(--tile);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
          /* The neighbours are turned away and pushed out; the selected card
             is flat, centred and above them, which is also what hides the
             card wrapping from one end of the ring to the other.

             The sign matters and it is easy to get backwards. A positive
             rotateY brings an element's right edge toward the viewer, so
             --d * 30deg turns the left card's outer edge forward and its
             inner edge away, which is the concave arrangement in the
             reference. Negating it gives the convex one, where the cards lean
             in toward the middle: the same angle, read inside out. */
          transform:
            translate(-50%, -50%)
            translateX(calc(var(--d) * 62%))
            rotateY(calc(var(--d) * 30deg))
            scale(0.82);
          opacity: 0.62;
          z-index: 1;
          transition:
            transform 620ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 480ms ease;
        }
        .sr-card-on {
          transform: translate(-50%, -50%) rotateY(0deg) scale(1);
          opacity: 1;
          z-index: 2;
        }
        .sr-media { position: absolute; inset: 0; display: block; }
        .sr-media video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        /* Three verticals side by side, filling the card between them. They
           keep a hairline between them rather than a gap, so the card still
           reads as one picture. */
        .sr-media-split {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255, 255, 255, 0.1);
        }
        .sr-media-split video { position: relative; inset: auto; }
        /* The tag names the work, not the studio: a card showing an ad says
           Advertising. The studio itself is where the card goes, which the
           link carries, and the section above already names all three. */
        .sr-tag {
          position: absolute;
          top: clamp(14px, 2.4%, 26px);
          left: clamp(14px, 2.4%, 26px);
          display: inline-flex;
          align-items: center;
          height: 32px;
          padding: 0 14px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: #fff;
          background: rgba(10, 10, 11, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.14);
        }

        .sr-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: clamp(20px, 3vw, 32px);
          padding: 5px;
          width: max-content;
          margin-inline: auto;
          border-radius: 999px;
          background: var(--track);
        }
        .sr-arrow {
          width: 36px;
          height: 36px;
          border: 0;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: transparent;
          color: var(--ink-2);
          cursor: pointer;
          transition: background 200ms ease, color 200ms ease;
        }
        .sr-arrow:hover { background: var(--panel); color: var(--ink-heading); }
        .sr-dots { display: inline-flex; align-items: center; gap: 7px; padding: 0 10px; }
        .sr-dot {
          width: 7px;
          height: 7px;
          padding: 0;
          border: 0;
          border-radius: 999px;
          background: var(--ink-3);
          opacity: 0.5;
          cursor: pointer;
          transition: width 320ms ease, opacity 200ms ease, background 200ms ease;
        }
        .sr-dot-on { width: 22px; opacity: 1; background: var(--ink-heading); }

        @media (max-width: 880px) {
          .sr-card { width: 84vw; }
          .sr-tag { height: 28px; padding: 0 11px; font-size: 11.5px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sr-card { transition: none; }
        }
      `}</style>
    </section>
  );
}
