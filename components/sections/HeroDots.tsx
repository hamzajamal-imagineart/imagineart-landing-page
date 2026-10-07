"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's halftone edges as a live dot field (Hamza, 7 Oct, after
 * kyoso.ai): a grid of dots in a band down each side of the stage, fading
 * toward the middle and patchy along their length as the old CSS grids were,
 * still drifting slowly on the diagonal, but each dot now answers the
 * pointer like a filing to a magnet: within a radius it is drawn toward the
 * cursor, closer ones more strongly, and springs back home when it leaves.
 *
 * One canvas over the stage, dots only in the two bands (about 2,500 at
 * 1600px), redrawn every frame while the hero is on screen. Colour comes
 * from the canvas's `color`, so it follows the section's theme. Under reduced motion the
 * field is static and does not react.
 */
const SPACING = 12, DOT = 1.1, BIG = 1.6;
/* The pull: dots within RADIUS move toward the pointer by up to PULL of
   their distance (closer ones more), like filings to a magnet. */
const RADIUS = 140, PULL = 0.75, EASE = 0.16, RETURN = 0.08;
const DRIFT_PX_PER_S = SPACING / 5; // one cell every 5s, as the CSS grid did

type Dot = { hx: number; hy: number; x: number; y: number; a: number; r: number };

export function HeroDots({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const host = canvas.parentElement!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hover = window.matchMedia("(hover: hover)").matches;

    let dots: Dot[] = [];
    let w = 0, h = 0, dpr = 1, band = 0;
    const pointer = { x: -1e4, y: -1e4 };

    /* Alpha for a dot at (x, y): the band's horizontal fade, times the
       patchiness along its length the old masks drew. */
    const alphaAt = (x: number, y: number, left: boolean) => {
      const across = left ? x / band : (w - x) / band; // 0 at the edge, 1 at the band's inner end
      const fade = across < 0.45 ? 1 - across * (0.5 / 0.45) : Math.max(0, 0.5 * (1 - (across - 0.45) / 0.55));
      const t = y / h;
      const along = left
        ? (t < 0.12 ? t / 0.12 : t < 0.4 ? 1 - ((t - 0.12) / 0.28) * 0.65 : t < 0.62 ? 0.35 + ((t - 0.4) / 0.22) * 0.65 : 1 - (t - 0.62) / 0.38)
        : (t < 0.3 ? 1 - (t / 0.3) * 0.65 : t < 0.55 ? 0.35 + ((t - 0.3) / 0.25) * 0.65 : t < 0.8 ? 1 - ((t - 0.55) / 0.25) * 0.8 : 0.2 + ((t - 0.8) / 0.2) * 0.8);
      return Math.max(0, fade) * Math.max(0, along);
    };

    const build = () => {
      const r = host.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      band = Math.max(64, Math.min(w * 0.12, 200));
      const narrow = w <= 760;
      if (narrow) band = 48;
      dots = [];
      let i = 0;
      for (let y = 0; y < h + SPACING; y += SPACING) {
        for (let x = 0; x < w + SPACING; x += SPACING) {
          const left = x <= band, right = x >= w - band;
          if (!left && !right) continue;
          const a = alphaAt(x, y, left);
          if (a <= 0.02) continue;
          dots.push({ hx: x, hy: y, x, y, a, r: i++ % 3 === 0 ? BIG : DOT });
        }
      }
    };
    build();

    // The canvas's own color, not the host's: the host inherits the page's
    // ink, while the canvas's `color` is set from the section's theme tokens.
    const color = () => getComputedStyle(canvas).color;
    let ink = color();
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    };
    const onLeave = () => { pointer.x = -1e4; pointer.y = -1e4; };
    if (hover && !reduced) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
    }
    const ro = new ResizeObserver(() => { build(); ink = color(); });
    ro.observe(host);

    let inView = true, running = false, frame = 0, last = performance.now(), drift = 0;
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); });
    io.observe(host);

    const draw = (now: number) => {
      if (!running) return;
      frame = requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!reduced) drift = (drift + DRIFT_PX_PER_S * dt) % SPACING;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = ink;
      const r2 = RADIUS * RADIUS;
      for (const d of dots) {
        // Home position, drifting on the diagonal; the left band drifts down
        // and right, the right band the other way, as the CSS grids did.
        const dir = d.hx <= band ? 1 : -1;
        const hx = d.hx + drift * dir, hy = d.hy + drift * dir;
        let tx = hx, ty = hy;
        if (!reduced) {
          const dx = hx - pointer.x, dy = hy - pointer.y, dd = dx * dx + dy * dy;
          if (dd < r2 && dd > 0.01) {
            const dist = Math.sqrt(dd), f = 1 - dist / RADIUS, pull = dist * PULL * f * f;
            tx = hx - (dx / dist) * pull; ty = hy - (dy / dist) * pull;
          }
        }
        const k = tx === hx && ty === hy ? RETURN : EASE;
        d.x += (tx - d.x) * (reduced ? 1 : k);
        d.y += (ty - d.y) * (reduced ? 1 : k);
        ctx.globalAlpha = d.a * 0.32;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (reduced) { running = false; cancelAnimationFrame(frame); }
    };
    function sync() {
      if (inView && !running) { running = true; last = performance.now(); frame = requestAnimationFrame(draw); }
      else if (!inView && running) { running = false; cancelAnimationFrame(frame); }
    }
    sync();

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
