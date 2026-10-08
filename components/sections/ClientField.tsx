"use client";

import { useEffect, useRef } from "react";

/**
 * Client formations (Hamza, 8 Oct): one particle field behind the Imagine
 * MCP banner that re-forms for each client, the way GPT-6 Astra has its
 * galaxy. The same COUNT particles flow from one shape to the next when the
 * chip changes, so it reads as one living thing:
 *
 *   claude       a slowly turning burst of rays, after Claude's asterisk
 *   claude-code  the Claude Code pixel mark, assembled from points
 *   cursor       a turning wireframe cube made of points
 *   grok         a tilted accretion ring round a dark centre
 *   manus        particles streaming along curved lines
 *
 * Particles part round the pointer and settle back. Drawn only while on
 * screen; under reduced motion each formation holds still.
 */
const COUNT = 1500;
/** Share of min(width, height) a formation's radius takes. */
const FILL = 0.44;
/** How fast particles chase their targets (per second). */
const FOLLOW = 5;
/** Pointer push: radius (px) and strength. */
const PUSH_R = 90, PUSH = 140;

type Rgb = [number, number, number];
const ORANGE: Rgb = [217, 119, 87];
const ORANGE_HOT: Rgb = [255, 178, 140];
const WHITE: Rgb = [236, 238, 245];
const COOL: Rgb = [196, 212, 255];

/** The Claude Code mark (24×24 pixel art), from the client icon. */
const CLAUDE_CODE_PATH = "M20 4v4h4v4h-4v8h-2v-4h-2v4h-2v-4h-4v4H8v-4H6v4H4v-8H0V8h4V4zm-4 2v2h2V6zM6 8h2V6H6z";

/** Filled cells of a 24×24 path, as centres in -1..1. */
function pixelCells(d: string): [number, number][] {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 24;
  const ctx = cv.getContext("2d");
  if (!ctx) return [];
  ctx.fill(new Path2D(d), "evenodd");
  const px = ctx.getImageData(0, 0, 24, 24).data, out: [number, number][] = [];
  for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) {
    if (px[(y * 24 + x) * 4 + 3] > 128) out.push([(x + 0.5) / 12 - 1, (y + 0.5) / 12 - 1]);
  }
  return out;
}

type Target = { x: number; y: number; s: number; c: Rgb; a: number };
type Formation = (i: number, t: number, u: Float32Array[], R: number, cells: [number, number][]) => Target;

const FORMATIONS: Record<string, Formation> = {
  claude: (i, t, [u1, u2, u3], R) => {
    if (u3[i] < 0.14) {
      // A little loose dust between the rays.
      const ang = u1[i] * Math.PI * 2 + t * 0.03, r = R * Math.sqrt(u2[i]) * 1.05;
      return { x: Math.cos(ang) * r, y: Math.sin(ang) * r, s: 0.7, c: ORANGE, a: 0.28 };
    }
    const K = 12, k = i % K;
    const along = Math.pow(u2[i], 0.85);
    let r = R * (0.1 + 0.9 * along);
    r *= 1 + 0.045 * Math.sin(t * 1.4 - along * 7);
    const ang = (k / K) * Math.PI * 2 + t * 0.07 + (u1[i] - 0.5) * (0.05 + 0.1 * along);
    const hot = along < 0.25 || u1[i] > 0.92;
    return { x: Math.cos(ang) * r, y: Math.sin(ang) * r, s: 0.7 + 1.8 * (1 - along), c: hot ? ORANGE_HOT : ORANGE, a: 0.55 + 0.45 * (1 - along) };
  },

  "claude-code": (i, t, [u1, u2], R, cells) => {
    const [cx, cy] = cells[i % cells.length] ?? [0, 0];
    const cs = 1 / 12;
    const x = (cx + (u1[i] - 0.5) * cs * 0.82) * R * 0.95;
    const y = (cy + (u2[i] - 0.5) * cs * 0.82) * R * 0.95;
    // A soft scanline running down the mark.
    const scan = 0.5 + 0.5 * Math.sin(cy * 6 - t * 2.2);
    return { x, y, s: 0.9 + 0.6 * scan, c: scan > 0.85 ? ORANGE_HOT : ORANGE, a: 0.55 + 0.45 * scan };
  },

  cursor: (i, t, [u1], R) => {
    const V = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
    const E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    const [a, b] = E[i % 12], s = u1[i];
    let x = V[a][0] + (V[b][0] - V[a][0]) * s, y = V[a][1] + (V[b][1] - V[a][1]) * s, z = V[a][2] + (V[b][2] - V[a][2]) * s;
    const ry = t * 0.35, rx = 0.55 + Math.sin(t * 0.21) * 0.18;
    [x, z] = [x * Math.cos(ry) + z * Math.sin(ry), -x * Math.sin(ry) + z * Math.cos(ry)];
    [y, z] = [y * Math.cos(rx) - z * Math.sin(rx), y * Math.sin(rx) + z * Math.cos(rx)];
    const p = 1 / (1 + z * 0.22), k = R * 0.5 * p;
    return { x: x * k, y: y * k, s: 0.6 + 1.1 * p * p, c: WHITE, a: 0.35 + 0.6 * (1 - (z + 1.7) / 3.4) };
  },

  grok: (i, t, [u1, u2, u3], R) => {
    const tilt = -0.22;
    if (u3[i] < 0.12) {
      // The thin bright ring hugging the dark centre.
      const ang = u1[i] * Math.PI * 2 + t * 1.1, r = R * 0.3;
      return { x: Math.cos(ang) * r, y: Math.sin(ang) * r, s: 1, c: WHITE, a: 0.85 };
    }
    const rr = 0.36 + 0.64 * Math.pow(u2[i], 1.6), r = R * rr;
    const ang = u1[i] * Math.PI * 2 + t * (0.35 / rr);
    const ex = Math.cos(ang) * r, ey = Math.sin(ang) * r * 0.3;
    const front = Math.sin(ang) > 0;
    return {
      x: ex * Math.cos(tilt) - ey * Math.sin(tilt),
      y: ex * Math.sin(tilt) + ey * Math.cos(tilt),
      s: 0.6 + 1.4 * (1 - rr),
      c: rr < 0.5 ? WHITE : COOL,
      a: (front ? 0.9 : 0.45) * (0.4 + 0.6 * (1 - rr)),
    };
  },

  manus: (i, t, [u1, u2], R) => {
    const L = 7, l = i % L;
    const s = (u1[i] + t * 0.045 * (1 + l * 0.08)) % 1;
    const x = (s * 2 - 1) * R * 1.25;
    const y = Math.sin(s * Math.PI * 1.6 + l * 0.85 + t * 0.35) * R * 0.32 + (l - (L - 1) / 2) * R * 0.1 + (u2[i] - 0.5) * R * 0.03;
    return { x, y, s: 0.6 + 0.9 * u2[i], c: WHITE, a: 0.85 * Math.sin(s * Math.PI) };
  },
};

export function ClientField({ client, className }: { client: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const clientRef = useRef(client);
  clientRef.current = client;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rnd = () => Float32Array.from({ length: COUNT }, () => Math.random());
    const u = [rnd(), rnd(), rnd()];
    const cells = pixelCells(CLAUDE_CODE_PATH);
    const px = new Float32Array(COUNT), py = new Float32Array(COUNT);
    const ox = new Float32Array(COUNT), oy = new Float32Array(COUNT);
    const col = new Float32Array(COUNT * 3), alp = new Float32Array(COUNT);
    let W = 0, H = 0, dpr = 1, raf = 0, on = false, last = performance.now(), t = 0;
    let shown = clientRef.current, switchedAt = -10, seeded = false;
    const mouse = { x: -1e4, y: -1e4 };

    const size = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height;
      cv.width = Math.max(1, Math.round(W * dpr)); cv.height = Math.max(1, Math.round(H * dpr));
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduce) t += dt;
      if (clientRef.current !== shown) { shown = clientRef.current; switchedAt = t; }
      const f = FORMATIONS[shown];
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (!f || W <= 0) return;
      const R = Math.min(W, H) * FILL, cx = W / 2, cy = H / 2;
      const morphing = t - switchedAt < 1.6;
      const k = 1 - Math.exp(-FOLLOW * dt), kc = 1 - Math.exp(-3 * dt);
      // First formation: particles gather out of a small cloud at the centre.
      if (!seeded && !reduce) for (let i = 0; i < COUNT; i++) { px[i] = cx + (u[0][i] - 0.5) * R * 0.3; py[i] = cy + (u[1][i] - 0.5) * R * 0.3; alp[i] = 0; }
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < COUNT; i++) {
        const g = f(i, t, u, R, cells);
        const tx = cx + g.x, ty = cy + g.y;
        if (reduce) { px[i] = tx; py[i] = ty; col[i * 3] = g.c[0]; col[i * 3 + 1] = g.c[1]; col[i * 3 + 2] = g.c[2]; alp[i] = g.a; }
        else {
          // A wrap inside a formation (a stream restarting) jumps; anything else glides.
          if (seeded && !morphing && Math.abs(tx - px[i]) + Math.abs(ty - py[i]) > R * 0.8) { px[i] = tx; py[i] = ty; }
          else { px[i] += (tx - px[i]) * k; py[i] += (ty - py[i]) * k; }
          col[i * 3] += (g.c[0] - col[i * 3]) * kc; col[i * 3 + 1] += (g.c[1] - col[i * 3 + 1]) * kc; col[i * 3 + 2] += (g.c[2] - col[i * 3 + 2]) * kc;
          alp[i] += (g.a - alp[i]) * kc;
        }
        // Part round the pointer, then drift back.
        const dx = px[i] + ox[i] - mouse.x, dy = py[i] + oy[i] - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < PUSH_R * PUSH_R) { const d = Math.sqrt(d2) || 1, f2 = (1 - d / PUSH_R) * PUSH * dt; ox[i] += (dx / d) * f2; oy[i] += (dy / d) * f2; }
        ox[i] *= 1 - Math.min(1, 2.2 * dt); oy[i] *= 1 - Math.min(1, 2.2 * dt);
        const x = px[i] + ox[i], y = py[i] + oy[i], a = Math.max(0, Math.min(1, alp[i]));
        if (a < 0.02) continue;
        const rgb = `${col[i * 3] | 0},${col[i * 3 + 1] | 0},${col[i * 3 + 2] | 0}`;
        if (g.s > 1.6) { ctx.fillStyle = `rgba(${rgb},${(a * 0.12).toFixed(3)})`; ctx.beginPath(); ctx.arc(x, y, g.s * 3.2, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = `rgba(${rgb},${a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(x, y, g.s, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      seeded = true;
    };
    const loop = (now: number) => { frame(now); raf = on ? requestAnimationFrame(loop) : 0; };

    size();
    frame(performance.now());
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting && !reduce;
      cancelAnimationFrame(raf);
      if (on) { last = performance.now(); raf = requestAnimationFrame(loop); }
    });
    io.observe(cv);
    const ro = new ResizeObserver(() => { size(); frame(performance.now()); });
    ro.observe(cv);
    const host = cv.parentElement ?? cv;
    const move = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const leave = () => { mouse.x = mouse.y = -1e4; };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    // Dev only: step frames by hand where rAF doesn't run (a hidden preview).
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __cf?: { step: (n: number) => void } }).__cf = {
        step: (n) => { let now = performance.now(); for (let j = 0; j < n; j++) { now += 16; frame(now); } },
      };
    }
    // Under reduced motion, redraw once on each switch.
    let poll = 0;
    if (reduce) poll = window.setInterval(() => { if (clientRef.current !== shown) frame(performance.now()); }, 200);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); window.clearInterval(poll);
      host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
