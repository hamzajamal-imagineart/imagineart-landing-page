"use client";

import { useEffect } from "react";

/**
 * Drifts the hero corridor's vanishing point with the pointer: writes the
 * pointer's offset from the centre of the hero (-1 to 1) to --px / --py on
 * .hc-stage, which its perspective-origin reads (eased by a CSS transition).
 * Renders nothing. Off on touch screens and under reduced motion.
 */
export function CorridorDrift() {
  useEffect(() => {
    const stage = document.querySelector<HTMLElement>(".hc-stage");
    const hero = document.getElementById("top");
    if (!stage || !hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        stage.style.setProperty("--px", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        stage.style.setProperty("--py", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      });
    };
    const onLeave = () => { stage.style.setProperty("--px", "0"); stage.style.setProperty("--py", "0"); };
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return null;
}
