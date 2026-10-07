"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's halftone edges as a live dot field (Hamza, 7 Oct, after
 * kyoso.ai): a plain, even grid of dots in a band down each side of the
 * stage — straight rows and columns, no fade, no drift — where each dot
 * acts on its own (Hamza, 7 Oct): when the cursor comes within CATCH of it,
 * it latches on and follows, trailing at its own pace and sitting at its own
 * spot around the cursor, until the cursor has dragged it past its tether;
 * then it lets go and springs back home.
 *
 * One canvas over the stage, dots only in the two bands (about 2,500 at
 * 1600px), redrawn every frame while the hero is on screen. Colour comes
 * from the canvas's `color`, so it follows the section's theme. Under reduced motion the
 * field is static and does not react.
 */
/* A compact grid, brighter, each dot with its own weight (Hamza, 7 Oct,
   after kyoso.ai). */
const SPACING = 12, DOT = 0.95, BIG = 1.3, ALPHA = 0.22;
/* Latching: a dot within CATCH px of the cursor attaches; it follows with an
   ease of its own (FOLLOW_MIN–MAX), sits up to SPREAD px off the cursor so a
   caught group stays a cluster, and lets go once the cursor is further than
   its tether (TETHER_MIN–MAX px) from its home. RETURN is the spring home. */
const CATCH = 150, SPREAD = 60, FOLLOW_MIN = 0.08, FOLLOW_MAX = 0.26;
const TETHER_MIN = 260, TETHER_MAX = 480, RETURN = 0.08;
/* Sparkle (Hamza, 7 Oct): SPARKLE_PER_S random dots a second flare up to
   SPARKLE_ALPHA and SPARKLE_GROW× their size, then fade over SPARKLE_S. */
const SPARKLE_PER_S = 18, SPARKLE_S = 1.1, SPARKLE_ALPHA = 0.95, SPARKLE_GROW = 1.7;
/* No drift of its own (Hamza, 7 Oct): the field is still until the cursor
   comes near. */
const DRIFT_PX_PER_S = 0;

type Dot = {
  hx: number; hy: number; x: number; y: number; a: number; r: number;
  /** Attached to the cursor; its offset there, follow ease and tether. */
  on: boolean; ox: number; oy: number; k: number; tether: number;
  /** Sparkle progress 0–1, or -1 when not sparkling. */
  sp: number;
};

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

    const build = () => {
      const r = host.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // A third of the old band (Hamza, 7 Oct): about eight columns at 1600px.
      band = Math.max(64, Math.min(w * 0.12, 200)) / 3;
      const narrow = w <= 760;
      if (narrow) band = 16;
      dots = [];
      let i = 0;
      for (let y = 0; y < h + SPACING; y += SPACING) {
        for (let x = 0; x < w + SPACING; x += SPACING) {
          const left = x <= band, right = x >= w - band;
          if (!left && !right) continue;
          // A plain grid: every dot the same weight, straight rows and
          // columns, no fade (Hamza, 7 Oct).
          const ang = Math.random() * Math.PI * 2, off = Math.random() * SPREAD;
          dots.push({
            hx: x, hy: y, x, y, a: 1, r: i++ % 4 === 0 ? BIG : DOT,
            on: false, ox: Math.cos(ang) * off, oy: Math.sin(ang) * off,
            k: FOLLOW_MIN + Math.random() * (FOLLOW_MAX - FOLLOW_MIN),
            tether: TETHER_MIN + Math.random() * (TETHER_MAX - TETHER_MIN),
            sp: -1,
          });
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
      // Light a few random dots this frame (a fractional count carries over
      // as a chance).
      if (!reduced && dots.length) {
        const want = SPARKLE_PER_S * dt;
        let n = Math.floor(want) + (Math.random() < want % 1 ? 1 : 0);
        while (n-- > 0) {
          const d = dots[(Math.random() * dots.length) | 0];
          if (d.sp < 0) d.sp = 0;
        }
      }
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = ink;
      const c2 = CATCH * CATCH;
      for (const d of dots) {
        // Home position, drifting on the diagonal; the left band drifts down
        // and right, the right band the other way, as the CSS grids did.
        const dir = d.hx <= band ? 1 : -1;
        const hx = d.hx + drift * dir, hy = d.hy + drift * dir;
        if (!reduced) {
          if (d.on) {
            // Let go once the cursor has pulled it past its tether.
            const hdx = pointer.x - hx, hdy = pointer.y - hy;
            if (hdx * hdx + hdy * hdy > d.tether * d.tether) d.on = false;
          } else {
            const dx = d.x - pointer.x, dy = d.y - pointer.y;
            if (dx * dx + dy * dy < c2) d.on = true;
          }
        } else d.on = false;
        const tx = d.on ? pointer.x + d.ox : hx, ty = d.on ? pointer.y + d.oy : hy;
        const k = d.on ? d.k : RETURN;
        d.x += (tx - d.x) * (reduced ? 1 : k);
        d.y += (ty - d.y) * (reduced ? 1 : k);
        // A sparkle rises and falls on a sine over SPARKLE_S.
        let glow = 0;
        if (d.sp >= 0) {
          d.sp += dt / SPARKLE_S;
          if (d.sp >= 1) d.sp = -1;
          else glow = Math.sin(d.sp * Math.PI);
        }
        ctx.globalAlpha = d.a * (ALPHA + (SPARKLE_ALPHA - ALPHA) * glow);
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * (1 + (SPARKLE_GROW - 1) * glow), 0, Math.PI * 2);
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
