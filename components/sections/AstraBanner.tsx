"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { GalaxyCanvas, StarsCanvas, GALAXY_DENSITY } from "@/components/sections/astra-galaxy";

/**
 * GPT-6 Astra banner (Hamza, 8 Oct): ported from imagine.art's home page
 * banner, above Industries. A dark rounded panel over a starfield, the
 * Imagine MCP mark, GPT-6 / ASTRA, one line and a "Connect
 * Imagine MCP" pill; on wide screens a fanned 3D carousel of example clips on
 * the right. The front card plays its clip; a side card or the arrow brings
 * the next one forward. Media streams from imagine.art's own CDN.
 *
 * Behind it, the site's own star field and spiral galaxy (astra-galaxy.js);
 * its soft glow overlay is left off (Hamza, 8 Oct).
 */
const CDN = "https://cdn-imagine.vyro.ai/imagine-one/home/astra/gallery";
const CONNECT_HREF = "https://www.imagine.art/mcp#chatgpt";

/** The ring, in the order the site shows it (01 appears twice so five slots fill). */
const ITEMS = [
  { n: "01", genre: "GAMING" },
  { n: "02", genre: "3D MODELING" },
  { n: "03", genre: "3D MODELING" },
  { n: "01", genre: "GAMING" },
  { n: "04", genre: "3D MODELING" },
];

/** Card pose by distance from the front: x shift (px), scale, rotateY (deg), opacity, brightness, blur. */
const POSE: Record<number, [number, number, number, number, number, number]> = {
  0: [0, 1, 0, 1, 1, 0],
  1: [60, 0.84, -24, 0.65, 0.75, 0],
  2: [120, 0.68, -38, 0.38, 0.55, 1],
};

export function AstraBanner() {
  const [front, setFront] = useState(0);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const n = ITEMS.length;

  // The site's density: lighter under 1024px.
  const [density, setDensity] = useState<number>(GALAXY_DENSITY);
  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) setDensity(2);
  }, []);

  // Only the front card plays.
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === front) { v.currentTime = 0; v.play().catch(() => {}); }
      else v.pause();
    });
  }, [front]);

  return (
    <section id="imagine-mcp" className="relative py-24 md:py-32">
      <div className="container-page">
      {/* The Imagine MCP wordmark and the MCP section's line above the banner
          (Hamza, 8 Oct), centred (Hamza, 8 Oct). */}
      <div className="mx-auto flex max-w-[680px] flex-col items-center text-center">
        <h2 className="mcp-head" aria-label="Imagine MCP">
          {/* The wordmark's letters are a fixed #0F0F0F, so dark mode has its own file (as in the MCP section). */}
          <img className="mcp-head-light" src={withBasePath("/media/mcp/imagine-mcp-logo.svg")} alt="Imagine MCP" />
          {/* Dark page: imagine.art's current lockup, the white "Imagine" word
              and "MCP" in the brand purple (#A56EFF → #8A3FFC; Hamza, 8 Oct). */}
          <span className="mcp-head-dark mcp-lockup" aria-hidden>
            <img src={withBasePath("/media/mcp/imagine-word-light.svg")} alt="" />
            <img src={withBasePath("/media/mcp/mcp-word-purple.svg")} alt="" />
          </span>
        </h2>
        <p className="lede mx-auto mt-5">
          Every ImagineArt tool inside the agent you already use, connected once and ready in a minute.
        </p>
      </div>
      <div className="astra mt-12" role="region" aria-label="GPT-6 Astra on Imagine MCP">
        {/* imagine.art's own canvases (astra-galaxy.js): background stars, then the galaxy that parts round the pointer. */}
        <StarsCanvas className="astra-stars" />
        <GalaxyCanvas interactionMode="repel" density={density} className="astra-galaxy" />

        <div className="astra-copy">
          {/* The Imagine MCP mark is in the section head above, so not repeated here (Hamza, 8 Oct). */}
          <div className="astra-title">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path fill="currentColor" d="M19.813 10.367a4.43 4.43 0 0 0-.39-3.683 4.61 4.61 0 0 0-3.986-2.277q-.488 0-.965.1a4.5 4.5 0 0 0-1.535-1.113A4.6 4.6 0 0 0 11.073 3h-.039C9.04 3 7.273 4.27 6.66 6.14A4.54 4.54 0 0 0 3.62 8.316 4.5 4.5 0 0 0 3 10.592c0 1.124.423 2.207 1.186 3.041a4.43 4.43 0 0 0 .39 3.683 4.61 4.61 0 0 0 3.987 2.277q.487 0 .964-.1c.427.473.95.853 1.536 1.113s1.221.394 1.864.394h.04c1.994 0 3.762-1.27 4.374-3.142a4.54 4.54 0 0 0 3.039-2.175 4.485 4.485 0 0 0-.566-5.316m-6.856 9.456h-.005a3.44 3.44 0 0 1-2.184-.78l.108-.06 3.632-2.071a.59.59 0 0 0 .299-.506v-5.057l1.535.875a.05.05 0 0 1 .03.042v4.184c-.002 1.86-1.53 3.37-3.415 3.373M5.61 16.728a3.33 3.33 0 0 1-.408-2.26l.108.063 3.633 2.07a.6.6 0 0 0 .596 0l4.435-2.526v1.75a.05.05 0 0 1-.022.046l-3.672 2.091a3.46 3.46 0 0 1-3.417 0 3.4 3.4 0 0 1-1.253-1.234m-.955-7.824a3.4 3.4 0 0 1 1.78-1.48l-.003.124v4.144a.58.58 0 0 0 .298.506l4.435 2.526-1.535.875a.06.06 0 0 1-.052.005L5.907 13.51a3.4 3.4 0 0 1-1.25-1.236 3.34 3.34 0 0 1-.001-3.37M17.27 11.8l-4.435-2.526 1.535-.875a.06.06 0 0 1 .052-.004l3.672 2.091a3.37 3.37 0 0 1 1.71 2.922 3.38 3.38 0 0 1-2.238 3.166v-4.269a.58.58 0 0 0-.296-.505m1.528-2.27-.108-.063-3.633-2.07a.6.6 0 0 0-.596 0l-4.435 2.527V8.17a.05.05 0 0 1 .022-.043l3.672-2.09a3.46 3.46 0 0 1 1.708-.451c1.888 0 3.42 1.51 3.42 3.373q-.001.287-.05.57M9.19 12.65l-1.535-.875a.05.05 0 0 1-.03-.041V7.548c0-1.862 1.532-3.371 3.42-3.371.798 0 1.572.276 2.187.78q-.056.03-.108.061l-3.633 2.07a.59.59 0 0 0-.298.507v.003zm.834-1.774 1.976-1.126 1.975 1.125v2.25L12 14.25l-1.976-1.125z" />
            </svg>
            <h2>
              <span className="astra-gpt">GPT-6</span>
              <span className="astra-serif">ASTRA</span>
            </h2>
          </div>
          <p className="astra-line">
            <span>Build games, motion graphics, &amp; interactive 3D</span>
            <span>experiences with Imagine MCP.</span>
          </p>
          <a className="astra-cta" href={CONNECT_HREF} target="_blank" rel="noopener noreferrer">
            Connect Imagine MCP
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" aria-hidden>
              <path stroke="currentColor" strokeLinecap="round" d="M18.559 12H5m9 6 4.78-5.293c.706-.707.72-.694 0-1.414L14 6" />
            </svg>
          </a>
        </div>

        <div className="astra-stage" aria-hidden>
          {ITEMS.map((it, i) => {
            // Signed distance from the front, wrapped round the ring: -2..2.
            let d = (i - front + n) % n;
            if (d > n / 2) d -= n;
            const [x, s, r, o, b, bl] = POSE[Math.abs(d)];
            const sign = d < 0 ? -1 : 1;
            return (
              <div
                key={i}
                className={`astra-card${d === 0 ? " is-front" : ""}`}
                style={{
                  transform: d === 0 ? "none" : `translateX(${sign * x}px) scale(${s}) rotateY(${sign * r}deg)`,
                  opacity: o,
                  filter: `brightness(${b}) blur(${bl}px)`,
                  zIndex: 30 - Math.abs(d) * 10,
                }}
                onClick={() => d !== 0 && setFront(i)}
              >
                <img src={`${CDN}/thumbnail${it.n}.webp`} alt="" draggable={false} />
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  ref={(el) => { videos.current[i] = el; }}
                  src={d === 0 ? `${CDN}/video${it.n}.mp4` : undefined}
                  poster={`${CDN}/thumbnail${it.n}.webp`}
                  muted
                  loop
                  playsInline
                  preload="none"
                />
                <span className="astra-tag">
                  <img src={`${CDN}/avatar01.webp`} alt="" />
                  <i>Genre:</i>
                  {it.genre}
                </span>
              </div>
            );
          })}
        </div>
        <button type="button" className="astra-next" aria-label="Show next example" onClick={() => setFront((f) => (f + 1) % n)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" aria-hidden>
            <path d="m8 20 7.756-7.434a.777.777 0 0 0 0-1.132L8 4" stroke="currentColor" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      </div>

      <style>{`
        .mcp-head { margin: 0; line-height: 0; }
        .mcp-head img { display: block; height: clamp(36px, 3.6vw, 48px); width: auto; }
        .mcp-head-dark { display: none !important; }
        :root[data-theme="dark"] .mcp-head-light { display: none !important; }
        :root[data-theme="dark"] .mcp-head-dark { display: inline-flex !important; }
        /* Proportions from the site's lockup: the gap is 8.8 / 50 of the height, nudged down 8%. */
        .mcp-lockup { --logo-h: clamp(36px, 3.6vw, 48px); height: var(--logo-h); align-items: center; gap: calc(var(--logo-h) * 8.8 / 50); transform: translateY(calc(var(--logo-h) * 0.08)); }
        .mcp-lockup img { height: 100% !important; width: auto; display: block; }
        .astra {
          position: relative; isolation: isolate; overflow: hidden;
          display: flex; align-items: center;
          height: 560px; width: 100%;
          border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); /* tighter corners (8 Oct; was 32) */
          /* No fill (Hamza, 8 Oct): the stars sit on the page itself; the hairline keeps the shape. */
          background: transparent; color: #fff;
        }
        @media (min-width: 768px) { .astra { height: 440px; } }
        /* Out to the container's edges (its 1240px frame and guide lines), past .container-page's 32px gutter (Hamza, 8 Oct). */
        @media (min-width: 769px) { .astra { width: calc(100% + 64px); margin-left: -32px; margin-right: -32px; } }
        @media (min-width: 1024px) { .astra { height: 516px; } }
        .astra-stars { position: absolute; inset: 0; }
        /* As on the site: full width on phones, the right half on small desktops, full width again on large ones. */
        .astra-galaxy { position: absolute; inset: 0; display: block; width: 100%; height: 100%; }
        @media (min-width: 1024px) { .astra-galaxy { left: 50%; width: 50%; } }
        @media (min-width: 1280px) { .astra-galaxy { left: 0; width: 100%; } }

        .astra-copy { position: relative; z-index: 10; pointer-events: none; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; width: 100%; height: 100%; padding: 0 24px; text-align: center; }
        @media (min-width: 1100px) { .astra-copy { align-items: flex-start; text-align: left; padding: 0 32px 0 48px; } }
        .astra-logo { height: 37px; width: auto; display: block; }
        .astra-title { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        @media (min-width: 1100px) { .astra-title { align-items: flex-start; } }
        .astra-title h2 { display: flex; flex-wrap: wrap; align-items: center; gap: 0 12px; margin: 0; }
        .astra-gpt { font-size: clamp(36px, 4.4vw, 56px); line-height: 1.1; font-weight: 600; letter-spacing: -0.02em; white-space: nowrap; text-shadow: 0 4px 8px rgba(176,175,175,0.2); }
        .astra-serif { font-family: var(--font-instrument-serif), Georgia, serif; font-size: clamp(36px, 4.4vw, 56px); line-height: 1.1; font-weight: 400; white-space: nowrap; }
        .astra-line { margin: 0; font-size: 18px; line-height: 1.45; letter-spacing: -0.005em; }
        .astra-line span { display: block; }
        .astra-cta { pointer-events: auto; display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 14px; border-radius: 999px; background: #fff; color: #000; font-size: 15px; font-weight: 500; white-space: nowrap; transition: background 0.3s; }
        .astra-cta:hover { background: #ececec; }
        .astra-cta:active { transform: translateY(1px); }

        .astra-stage { display: none; position: absolute; top: 50%; right: 48px; z-index: 10; width: 454px; height: 420px; transform: translateY(-50%); perspective: 1400px; pointer-events: none; }
        @media (min-width: 1100px) { .astra-stage { display: block; } }
        .astra-card {
          position: absolute; top: 50%; left: 50%; width: 315px; height: 420px; margin: -210px 0 0 -157.5px;
          border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); clip-path: inset(0 round 16px);
          transform-style: preserve-3d; pointer-events: auto; cursor: pointer; user-select: none;
          transition: transform 0.6s cubic-bezier(.22,1,.36,1), opacity 0.6s, filter 0.6s;
        }
        .astra-card.is-front { cursor: default; }
        .astra-card > img, .astra-card video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
        .astra-tag {
          position: absolute; left: 12px; bottom: 12px; display: flex; align-items: center; gap: 6px; padding: 6px 16px 6px 6px; border-radius: 999px;
          background: rgba(0,0,0,0.4); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px);
          font-size: 12px; font-weight: 500; letter-spacing: 0.02em; color: #fff; white-space: nowrap; opacity: 0; transition: opacity 0.5s;
        }
        .astra-card.is-front .astra-tag { opacity: 1; }
        .astra-tag img { width: 24px; height: 24px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); object-fit: cover; }
        .astra-tag i { font-style: normal; color: rgba(255,255,255,0.6); }
        .astra-next {
          display: none; position: absolute; top: 50%; right: 31px; z-index: 20; transform: translateY(-50%);
          width: 32px; height: 32px; align-items: center; justify-content: center; border-radius: 50%;
          background: #fff; color: #000; border: 1px solid rgba(0,0,0,0.1); cursor: pointer; opacity: 0; transition: opacity 0.3s;
        }
        @media (min-width: 1100px) { .astra-next { display: flex; } }
        .astra:hover .astra-next, .astra-next:focus-visible { opacity: 1; }
        @media (hover: none) { .astra-next { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .astra-card { transition: none; } }
      `}</style>
    </section>
  );
}
