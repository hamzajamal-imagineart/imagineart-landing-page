"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { withBasePath } from "@/lib/assets";

/**
 * Paper birds (Hamza, 8 Oct, an experiment): origami birds generated in
 * ImagineArt (Nano Banana Pro, backgrounds removed) that fly from right to
 * left as you scroll, starting when the section with id START_ID comes up.
 *
 * Scroll-linked, not timed: each bird's x is a function of how far you have
 * scrolled past the start, so scrolling back flies them back. A fixed,
 * click-through layer over the page; under reduced motion it isn't drawn.
 */
const START_ID = "suite";
/** Scroll (px) after the start section's top reaches the bottom of the screen before the first bird enters. */
const LEAD = 120;
/** Overall pace: screen px a bird travels per px scrolled (each bird scales it). */
const PACE = 1.1;
/** Wing beat: how often (px of scroll per beat) and how deep (scaleY swing). */
const FLAP_EVERY = 90, FLAP_DEPTH = 0.12;
/** Up-and-down drift (px) and its period (px of scroll). */
const BOB = 18, BOB_EVERY = 520;
/** How solid the birds are (Hamza, 8 Oct: a bit softer). */
const OPACITY = 0.55;

type Bird = { src: string; size: number; y: number; speed: number; delay: number; phase: number };
const B = (n: string) => `/media/birds/${n}.png`;
/** y: share of the screen height; delay: scroll px before this bird sets off. */
const BIRDS: Bird[] = [
  { src: B("pink"), size: 120, y: 0.22, speed: 1.0, delay: 0, phase: 0 },
  { src: B("lilac"), size: 92, y: 0.3, speed: 1.12, delay: 60, phase: 1.3 },
  { src: B("mint"), size: 104, y: 0.46, speed: 0.95, delay: 140, phase: 2.1 },
  { src: B("butter"), size: 84, y: 0.38, speed: 1.2, delay: 220, phase: 0.6 },
  { src: B("lilac"), size: 64, y: 0.16, speed: 0.85, delay: 300, phase: 2.8 },
  { src: B("mint"), size: 56, y: 0.56, speed: 0.9, delay: 380, phase: 1.9 },
];

export function PaperBirds() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = document.getElementById(START_ID);
    if (!start) return;

    let raf = 0;
    const draw = () => {
      raf = 0;
      const vw = window.innerWidth, vh = window.innerHeight;
      // Scroll travelled since the start section's top met the bottom of the screen.
      const p = vh - start.getBoundingClientRect().top - LEAD;
      BIRDS.forEach((b, i) => {
        const el = refs.current[i];
        if (!el) return;
        const t = p - b.delay;
        const x = vw + 20 - t * PACE * b.speed;
        const on = t > 0 && x > -b.size * 1.5;
        el.style.visibility = on ? "visible" : "hidden";
        if (!on) return;
        const y = b.y * vh + Math.sin(t / BOB_EVERY * Math.PI * 2 + b.phase) * BOB;
        const tilt = Math.cos(t / BOB_EVERY * Math.PI * 2 + b.phase) * 5;
        const flap = 1 - FLAP_DEPTH / 2 + Math.sin(t / FLAP_EVERY * Math.PI * 2 + b.phase) * FLAP_DEPTH / 2;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${tilt}deg) scaleY(${flap})`;
      });
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(draw); };
    draw();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, []);

  return (
    <div className="pb" aria-hidden>
      {BIRDS.map((b, i) => (
        <div key={i} ref={(el) => { refs.current[i] = el; }} className="pb-bird" style={{ width: b.size, height: b.size }}>
          <img src={withBasePath(b.src)} alt="" decoding="async" />
        </div>
      ))}
      <style>{`
        /* Behind the page (Hamza, 8 Oct): z -1 in the root stacking context paints over the page colour but under every section, so cards and copy cover the birds and they show in the gaps. */
        .pb { position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; }
        .pb-bird { position: absolute; left: 0; top: 0; visibility: hidden; will-change: transform; transform-origin: 50% 55%; }
        .pb-bird img { width: 100%; height: 100%; object-fit: contain; display: block; opacity: ${OPACITY}; filter: drop-shadow(0 10px 14px rgba(0, 0, 0, 0.12)); }
        @media (prefers-reduced-motion: reduce) { .pb { display: none; } }
      `}</style>
    </div>
  );
}
