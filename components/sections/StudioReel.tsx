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
 * step it; the dots say where you are. Each clip carries its studio's name
 * and mark in the corner, and the whole card is a link into that studio.
 *
 * With three items every step wraps one card from one end of the ring to the
 * other, and it is left to animate the long way on purpose: the selected card
 * sits above its neighbours, so the wrapping card passes behind it and comes
 * out the far side. That costs nothing and needs no special case — the
 * alternative, teleporting it, is what reads as a glitch.
 *
 * Film Studio plays `use-cases/film.mp4`, not `studios/film-studio.mp4`. The
 * latter is the right footage and 14MB of it; this section would have carried
 * that weight for one of three cards.
 */
const REELS = [
  { id: "ad", label: "Ad Studio", href: STUDIO_HREFS.ad, video: "/media/studios/ad-studio.mp4", logo: "/media/studios/logos/ad-studio-white.svg" },
  { id: "fashion", label: "Fashion Studio", href: STUDIO_HREFS.fashion, video: "/media/studios/fashion-studio.mp4", logo: "/media/studios/logos/fashion-studio-white.svg" },
  { id: "film", label: "Film Studio", href: STUDIO_HREFS.film, video: "/media/use-cases/film.mp4", logo: "/media/studios/film/logo.webp" },
];

export function StudioReel() {
  const [active, setActive] = useState(0);
  const clips = useRef<(HTMLVideoElement | null)[]>([]);

  // Only the selected clip plays. Three at once is three decoders running for
  // two pictures nobody is looking straight at.
  useEffect(() => {
    clips.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) void v.play().catch(() => {});
      else v.pause();
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
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                ref={(el) => { clips.current[i] = el; }}
                src={withBasePath(r.video)}
                muted
                loop
                playsInline
                preload="metadata"
                disablePictureInPicture
              />
              <span className="sr-tag">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={withBasePath(r.logo)} alt="" aria-hidden />
                {r.label}
              </span>
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
             card wrapping from one end of the ring to the other. */
          transform:
            translate(-50%, -50%)
            translateX(calc(var(--d) * 62%))
            rotateY(calc(var(--d) * -30deg))
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
        .sr-card video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .sr-tag {
          position: absolute;
          top: 16px;
          left: 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 34px;
          padding: 0 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: -0.005em;
          color: #fff;
          background: rgba(10, 10, 11, 0.44);
          border: 1px solid rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(18px) saturate(150%);
          -webkit-backdrop-filter: blur(18px) saturate(150%);
        }
        .sr-tag img { height: 13px; width: auto; display: block; }

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
          .sr-tag { height: 30px; padding: 0 11px; font-size: 12px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sr-card { transition: none; }
        }
      `}</style>
    </section>
  );
}
