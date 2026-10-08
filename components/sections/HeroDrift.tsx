"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { withBasePath } from "@/lib/assets";
import { MORPH_IMAGES } from "@/components/sections/HeroGlobe";

/**
 * Drift (/hero-9; Hamza, 8 Oct, after a reference): rounded stills scattered
 * around the copy that come toward you. Each one appears small at a random
 * spot clear of the copy, grows and drifts outward as if moving forward,
 * then fades, and a new still takes its place somewhere else. SLOTS of them
 * run at once on staggered clocks, so the field never pulses together.
 *
 * Plain DOM and the Web Animations API, not WebGL: the stills stay sharp
 * <img>s, and each card is one animation. Under reduced motion the cards
 * sit still at their first spots.
 */
const SLOTS = 9;
/** One card's life, ms (random between), and how much it grows over it. */
const LIFE_MIN = 6500, LIFE_MAX = 9500, SCALE_FROM = 0.55, SCALE_TO = 1.12;
/** How far a card drifts outward from the centre over its life (share of its offset). */
const DRIFT = 0.18;
/** Card width range, px at 1440 wide (scaled with the viewport). */
const W_MIN = 170, W_MAX = 250;
/** Shapes a card can take (w / h). */
const ASPECTS = [3 / 4, 4 / 5, 4 / 3, 16 / 10];
/** The copy's box, as shares of the hero, which cards keep out of. */
const CLEAR = { x0: 0.26, x1: 0.74, y0: 0.26, y1: 0.76 };

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function HeroDrift() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const showing = new Set<string>();
    const anims: Animation[] = [];
    let alive = true;

    const pickImage = () => {
      const free = MORPH_IMAGES.filter((s) => !showing.has(s));
      const src = free[Math.floor(Math.random() * free.length)] ?? MORPH_IMAGES[0];
      showing.add(src);
      return src;
    };
    /** A random spot (as shares of the hero) outside the copy's box. */
    const pickSpot = () => {
      for (let i = 0; i < 40; i++) {
        const x = rand(0.04, 0.96), y = rand(0.1, 0.94);
        if (x > CLEAR.x0 && x < CLEAR.x1 && y > CLEAR.y0 && y < CLEAR.y1) continue;
        return { x, y };
      }
      return { x: 0.1, y: 0.2 };
    };

    const run = (i: number, delay: number) => {
      const el = cardRefs.current[i];
      if (!el || !alive) return;
      const img = el.querySelector("img")!;
      const old = img.dataset.src;
      if (old) showing.delete(old);
      const src = pickImage();
      img.dataset.src = src;
      img.src = withBasePath(src);

      const { width: W, height: H } = host.getBoundingClientRect();
      const k = Math.min(1.2, Math.max(0.6, W / 1440));
      const w = rand(W_MIN, W_MAX) * k, aspect = ASPECTS[Math.floor(Math.random() * ASPECTS.length)];
      el.style.width = `${w}px`;
      el.style.height = `${w / aspect}px`;
      const { x, y } = pickSpot();
      // Centre the card on its spot; drift away from the hero's centre.
      const px = x * W - w / 2, py = y * H - w / aspect / 2;
      const dx = (x - 0.5) * W * DRIFT, dy = (y - 0.5) * H * DRIFT;

      if (reduced) {
        el.style.transform = `translate(${px}px, ${py}px)`;
        el.style.opacity = "1";
        return;
      }
      const a = el.animate(
        [
          { transform: `translate(${px}px, ${py}px) scale(${SCALE_FROM})`, opacity: 0 },
          { opacity: 1, offset: 0.18 },
          { opacity: 1, offset: 0.72 },
          { transform: `translate(${px + dx}px, ${py + dy}px) scale(${SCALE_TO})`, opacity: 0 },
        ],
        { duration: rand(LIFE_MIN, LIFE_MAX), delay, easing: "cubic-bezier(0.3, 0, 0.6, 1)", fill: "both" },
      );
      anims[i] = a;
      a.onfinish = () => run(i, rand(0, 600));
    };

    for (let i = 0; i < SLOTS; i++) run(i, reduced ? 0 : (i / SLOTS) * LIFE_MIN + rand(0, 400));
    return () => {
      alive = false;
      anims.forEach((a) => a?.cancel());
    };
  }, []);

  return (
    <div ref={hostRef} className="hd" aria-hidden>
      {Array.from({ length: SLOTS }, (_, i) => (
        <div key={i} ref={(el) => { cardRefs.current[i] = el; }} className="hd-card">
          <img alt="" decoding="async" />
        </div>
      ))}
      <style>{`
        .hd { position: absolute; inset: 0; overflow: hidden; }
        .hd-card {
          position: absolute; left: 0; top: 0;
          opacity: 0;
          border-radius: calc(14px * var(--corner));
          overflow: hidden;
          background: #141416;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
          will-change: transform, opacity;
          transform-origin: center;
        }
        .hd-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
      `}</style>
    </div>
  );
}
