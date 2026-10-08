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
/* Field mode (Hamza, 8 Oct): the dots spread over the whole hero, behind
   the globe, rather than in two edge bands; a wider pitch and a quieter
   tone so a full screen of them reads as texture. */
const FIELD_SPACING = 18, FIELD_ALPHA = 0.16;
/* Latching: a dot within CATCH px of the cursor attaches; it follows with an
   ease of its own (FOLLOW_MIN–MAX), sits up to SPREAD px off the cursor so a
   caught group stays a cluster, and lets go once the cursor is further than
   its tether (TETHER_MIN–MAX px) from its home. RETURN is the spring home. */
const CATCH = 150, SPREAD = 60, FOLLOW_MIN = 0.08, FOLLOW_MAX = 0.26;
const TETHER_MIN = 260, TETHER_MAX = 480, RETURN = 0.08;
/* Sparkle (Hamza, 7 Oct: rarer, and less cheap): SPARKLE_PER_S random dots a
   second brighten to SPARKLE_ALPHA and SPARKLE_GROW× their size inside a soft
   halo HALO px across at HALO_ALPHA. Each rises over the first SPARKLE_RISE
   of SPARKLE_S and eases out over the rest, like a glint, not a blink. */
const SPARKLE_PER_S = 7, SPARKLE_S = 2.2, SPARKLE_RISE = 0.22;
const SPARKLE_ALPHA = 0.8, SPARKLE_GROW = 1.25, HALO = 14, HALO_ALPHA = 0.35;
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

export function HeroDots({ className, field = false }: { className?: string; field?: boolean }) {
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
      const pitch = field ? FIELD_SPACING : SPACING;
      for (let y = 0; y < h + pitch; y += pitch) {
        for (let x = 0; x < w + pitch; x += pitch) {
          const left = x <= band, right = x >= w - band;
          if (!field && !left && !right) continue;
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
    // The halo sprite: a soft radial falloff in the ink colour, drawn once.
    let halo: HTMLCanvasElement | null = null;
    const makeHalo = () => {
      const c = document.createElement("canvas"), n = 64;
      c.width = c.height = n;
      const g = c.getContext("2d");
      if (!g) return null;
      const grad = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
      const [r, gr, b] = (ink.match(/[\d.]+/g) ?? ["255", "255", "255"]).map(Number);
      grad.addColorStop(0, `rgba(${r}, ${gr}, ${b}, 1)`);
      grad.addColorStop(0.35, `rgba(${r}, ${gr}, ${b}, 0.35)`);
      grad.addColorStop(1, `rgba(${r}, ${gr}, ${b}, 0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, n, n);
      return c;
    };
    halo = makeHalo();
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    };
    const onLeave = () => { pointer.x = -1e4; pointer.y = -1e4; };
    if (hover && !reduced) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
    }
    const ro = new ResizeObserver(() => { build(); ink = color(); halo = makeHalo(); });
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
        // A glint: a smooth rise, then a long ease-out.
        let glow = 0;
        if (d.sp >= 0) {
          d.sp += dt / SPARKLE_S;
          if (d.sp >= 1) d.sp = -1;
          else if (d.sp < SPARKLE_RISE) { const t = d.sp / SPARKLE_RISE; glow = t * t * (3 - 2 * t); }
          else { const t = 1 - (d.sp - SPARKLE_RISE) / (1 - SPARKLE_RISE); glow = t * t * t; }
        }
        if (glow > 0.01 && halo) {
          ctx.globalAlpha = HALO_ALPHA * glow;
          const hs = HALO * (0.6 + 0.4 * glow);
          ctx.drawImage(halo, d.x - hs / 2, d.y - hs / 2, hs, hs);
        }
        const base = field ? FIELD_ALPHA : ALPHA;
        ctx.globalAlpha = d.a * (base + (SPARKLE_ALPHA - base) * glow);
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
  }, [field]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
