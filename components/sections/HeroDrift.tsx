"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { withBasePath } from "@/lib/assets";
import { MORPH_IMAGES } from "@/components/sections/HeroGlobe";

/**
 * Drift (/hero-9; Hamza, 8 Oct): flying through space. Stills sit at depths
 * along rays out of a vanishing point behind the copy, and the camera moves
 * forward through them: each one starts as a speck near the centre, grows
 * and speeds up as it nears (true perspective, size and spread are 1 / z),
 * and sweeps past the edge of the frame. Then it is sent back to the far
 * end on a new ray with a new image, so the field never thins out.
 *
 * Rays begin a little out from the centre (INNER), so the specks open in
 * a ring around the copy rather than on top of it.
 *
 * Plain DOM in one rAF loop, not WebGL: the stills stay sharp <img>s.
 * Under reduced motion the field holds still.
 */
const COUNT = 18;
/** Depth range: cards are born at Z_FAR and leave at Z_NEAR (1 = full size, at the ray's radius). */
const Z_FAR = 9, Z_NEAR = 0.45;
/** Forward speed, depth units per second. */
const SPEED = 0.6;
/** Card width at z = 1, px at 1440 wide (scaled with the viewport). */
const W_BASE = 230;
/** Shapes a card can take (w / h). */
const ASPECTS = [3 / 4, 4 / 5, 4 / 3, 16 / 10];
/** How far out a ray runs, as shares of the hero's half-width/half-height at
 *  z = 1. Above ~0.45 a card is clear of the copy by the time it's large. */
const R_MIN = 0.5, R_MAX = 1.05;
/** Fade in over this much depth after birth, and out below FADE_NEAR. */
const FADE_IN = 2.2, FADE_NEAR = 0.9;
/** Rays start this far out from the centre (share of the hero's half-size),
 *  so specks appear in a ring around the copy, not on it. */
const INNER = 0.32;

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Each still's 5s clip (Kling 2.6 Pro from the same still, 8 Oct), played
 *  only while the pointer is on its card. /media/hero/cards/x.jpg →
 *  /media/hero/clips/x.mp4. */
const clipFor = (still: string) => still.replace("/cards/", "/clips/").replace(/\.jpg$/, ".mp4");

type Card = { z: number; ax: number; ay: number; dx: number; dy: number; aspect: number; src: string };

export function HeroDrift() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const showing = new Set<string>();

    const pickImage = () => {
      const free = MORPH_IMAGES.filter((s) => !showing.has(s));
      const src = free[Math.floor(Math.random() * free.length)] ?? MORPH_IMAGES[0];
      showing.add(src);
      return src;
    };

    const stopClip = (el: HTMLElement) => {
      const v = el.querySelector("video")!;
      el.classList.remove("hd-playing");
      if (!v.paused) v.pause();
    };
    const playClip = (el: HTMLElement) => {
      const v = el.querySelector("video")!;
      const src = el.dataset.clip;
      if (!src) return;
      if (v.dataset.src !== src) { v.src = src; v.dataset.src = src; }
      v.currentTime = 0;
      v.play().then(() => el.classList.add("hd-playing")).catch(() => {});
    };
    const enter = (e: Event) => playClip(e.currentTarget as HTMLElement);
    const leave = (e: Event) => stopClip(e.currentTarget as HTMLElement);
    for (const el of cardRefs.current) {
      el?.addEventListener("pointerenter", enter);
      el?.addEventListener("pointerleave", leave);
    }
    const unbind = () => {
      for (const el of cardRefs.current) {
        el?.removeEventListener("pointerenter", enter);
        el?.removeEventListener("pointerleave", leave);
      }
    };

    /** A new ray, a new image and a new shape for card i, at depth z. */
    const spawn = (i: number, z: number, old?: Card): Card => {
      if (old) showing.delete(old.src);
      const a = rand(0, Math.PI * 2), r = rand(R_MIN, R_MAX);
      const c: Card = { z, ax: Math.cos(a) * r, ay: Math.sin(a) * r, dx: Math.cos(a), dy: Math.sin(a), aspect: ASPECTS[Math.floor(Math.random() * ASPECTS.length)], src: pickImage() };
      const el = cardRefs.current[i];
      if (el) {
        el.querySelector("img")!.src = withBasePath(c.src);
        el.dataset.aspect = String(c.aspect);
        el.dataset.clip = withBasePath(clipFor(c.src));
        stopClip(el);
      }
      return c;
    };

    // Spread the first cards through the whole depth so the field starts full.
    const cards = Array.from({ length: COUNT }, (_, i) => spawn(i, Z_NEAR + ((i + Math.random()) / COUNT) * (Z_FAR - Z_NEAR)));

    let W = 0, H = 0, base = W_BASE;
    const measure = () => {
      const r = host.getBoundingClientRect();
      W = r.width; H = r.height;
      base = W_BASE * Math.min(1.2, Math.max(0.6, W / 1440));
      cards.forEach((c, i) => {
        const el = cardRefs.current[i];
        if (el) { el.style.width = `${base}px`; el.style.height = `${base / c.aspect}px`; }
      });
    };
    measure();
    window.addEventListener("resize", measure);

    const draw = () => {
      cards.forEach((c, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const s = 1 / c.z;
        const x = W / 2 + (c.dx * INNER + c.ax * s) * (W / 2) - base / 2;
        const y = H / 2 + (c.dy * INNER + c.ay * s) * (H / 2) - base / c.aspect / 2;
        const fadeIn = Math.min(1, (Z_FAR - c.z) / FADE_IN);
        const fadeOut = Math.min(1, (c.z - Z_NEAR) / (FADE_NEAR - Z_NEAR));
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
        el.style.opacity = String(Math.max(0, Math.min(fadeIn, fadeOut)));
        el.style.zIndex = String(Math.round(1000 - c.z * 100));
      });
    };

    if (reduced) {
      draw();
      return () => { window.removeEventListener("resize", measure); unbind(); };
    }

    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      cards.forEach((c, i) => {
        c.z -= SPEED * dt;
        if (c.z <= Z_NEAR) {
          cards[i] = spawn(i, Z_FAR, c);
          const el = cardRefs.current[i];
          if (el) el.style.height = `${base / cards[i].aspect}px`;
        }
      });
      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      unbind();
    };
  }, []);

  return (
    <div ref={hostRef} className="hd" aria-hidden>
      {Array.from({ length: COUNT }, (_, i) => (
        <div key={i} ref={(el) => { cardRefs.current[i] = el; }} className="hd-card">
          <img alt="" decoding="async" />
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video className="hd-clip" muted loop playsInline preload="none" />
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
        /* The stage ignores the pointer; the cards take it back for hover. */
        .hd-card { pointer-events: auto; }
        .hd-clip { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.25s ease; }
        .hd-playing .hd-clip { opacity: 1; }
      `}</style>
    </div>
  );
}
