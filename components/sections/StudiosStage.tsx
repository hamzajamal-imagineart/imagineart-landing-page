"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { withBasePath } from "@/lib/assets";
import { STUDIO_HREFS } from "@/lib/links";

/**
 * The Studios tab of the platform strip (Hamza, 7 Oct): one studio's footage
 * fills the stage, and a row of chips along the foot, each carrying that
 * studio's mark, switches between them over a dark overlay that keeps the
 * marks legible.
 *
 * Ad Studio's work is vertical, so it plays three ads side by side (as the
 * old studio reel did) rather than one in a letterbox; Fashion and Film are
 * single 16:9 clips. Only the chosen studio's videos are mounted.
 */
const AD_CDN = "https://cdn-imagine.vyro.ai/imagine-one/marketingstudio/home";

type Studio = { id: string; name: string; href: string; logo: string; logoH: number; videos: string[]; posters?: string[] };

const STUDIOS: Studio[] = [
  {
    id: "ad", name: "Ad Studio", href: STUDIO_HREFS.ad, logo: "/media/studios/logos/ad-studio-white.svg", logoH: 26,
    videos: [`${AD_CDN}/UGC_1.mp4`, `${AD_CDN}/Unboxing_4.mp4`, `${AD_CDN}/Tutorial_And_Review_2.mp4`],
    posters: [`${AD_CDN}/UGC_1.webp`, `${AD_CDN}/Unboxing_4.webp`, `${AD_CDN}/Tutorial_And_Review_2.webp`],
  },
  { id: "fashion", name: "Fashion Studio", href: STUDIO_HREFS.fashion, logo: "/media/studios/logos/fashion-studio-white.svg", logoH: 32, videos: ["/media/studios/fashion/banner.mp4"] },
  { id: "film", name: "Film Studio", href: STUDIO_HREFS.film, logo: "/media/studios/logos/film-studio.png", logoH: 32, videos: ["https://imagine.animagic.art/imagine-one/film-studio/video/27.mp4"] },
];

export function StudiosStage() {
  const [on, setOn] = useState(0);
  const s = STUDIOS[on];

  return (
    <div className="st">
      <div key={s.id} className={`st-media ${s.videos.length > 1 ? "st-multi" : ""}`}>
        {s.videos.map((v, i) => (
          <video
            key={v}
            className="st-video"
            src={withBasePath(v)}
            poster={s.posters?.[i]}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden
          />
        ))}
      </div>
      <span className="st-scrim" aria-hidden />

      {/* Out to the chosen studio (Hamza, 7 Oct). */}
      <a href={s.href} className="st-go" aria-label={`Open ${s.name}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      <div className="st-chips" role="group" aria-label="Studios">
        {STUDIOS.map((x, i) => (
          <button
            key={x.id}
            type="button"
            className={`st-chip ${i === on ? "st-chip-on" : ""}`}
            aria-pressed={i === on}
            aria-label={x.name}
            onClick={() => setOn(i)}
          >
            <img src={withBasePath(x.logo)} alt="" style={{ height: x.logoH }} />
          </button>
        ))}
      </div>

      <style>{`
        .st { position: absolute; inset: 0; background: #0b0b0c; }
        .st-media { position: absolute; inset: 0; display: flex; animation: st-in 420ms ease both; }
        .st-video { flex: 1 1 0; min-width: 0; height: 100%; object-fit: cover; display: block; }
        .st-multi { gap: 2px; }
        @keyframes st-in { from { opacity: 0; } to { opacity: 1; } }
        /* A floor under the chips: dark along the foot, gone by 40%. */
        .st-scrim {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.62) 0%, rgba(0, 0, 0, 0.28) 20%, rgba(0, 0, 0, 0) 40%);
        }
        /* The chips in a row along the foot, centred (Hamza, 7 Oct). */
        .st-chips {
          position: absolute;
          left: 50%;
          bottom: clamp(12px, 4%, 28px);
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          max-width: calc(100% - 24px);
        }
        .st-chip {
          display: flex; align-items: center; justify-content: center;
          height: 64px;
          padding: 0 30px;
          border-radius: var(--radius-pill);
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(10, 10, 11, 0.42);
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
          cursor: pointer;
          opacity: 0.62;
          transition: opacity 200ms ease, background 200ms ease, border-color 200ms ease;
        }
        .st-chip img { display: block; width: auto; }
        .st-go {
          position: absolute;
          top: clamp(12px, 3%, 24px);
          right: clamp(12px, 2%, 24px);
          width: 48px; height: 48px;
          border-radius: var(--radius-pill);
          display: grid; place-items: center;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: rgba(10, 10, 11, 0.42);
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
          transition: background 200ms ease, transform 200ms ease;
        }
        .st-go:hover { background: rgba(255, 255, 255, 0.2); transform: translate(1px, -1px); }
        .st-go:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
        .st-chip:hover { opacity: 0.9; }
        .st-chip-on { opacity: 1; background: rgba(255, 255, 255, 0.16); border-color: rgba(255, 255, 255, 0.4); }
        .st-chip:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
        @media (max-width: 640px) {
          .st-chips { left: 12px; right: 12px; transform: none; gap: 6px; }
          .st-chip { flex: 1; min-width: 0; height: 44px; padding: 0 10px; }
          .st-chip img { max-height: 18px; max-width: 100%; }
          .st-go { width: 40px; height: 40px; }
        }
        @media (prefers-reduced-motion: reduce) { .st-media { animation: none; } }
      `}</style>
    </div>
  );
}
