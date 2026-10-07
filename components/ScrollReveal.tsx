"use client";

import { useEffect } from "react";

/**
 * Scroll reveal (Hamza, 7 Oct): every block inside a section's container
 * fades and rises in as it enters the viewport, and fades back out as it
 * leaves, scrolling either way. Plain CSS transitions on a class this
 * toggles (see .reveal in globals.css): ease-out coming in, ease-in going
 * out. The hero is left alone. Nothing is hidden until this runs, so the
 * page is whole without JavaScript, and reduced motion turns it off.
 */
const TARGETS = "main section:not(#top) .container-page > *";

export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Skip anything that already has a transform of its own, which the
    // reveal's would replace.
    const els = Array.from(document.querySelectorAll<HTMLElement>(TARGETS)).filter(
      (el) => getComputedStyle(el).transform === "none",
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle("is-in", e.isIntersecting);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    for (const el of els) {
      // Already on screen at load: shown at once, no entrance.
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in");
      el.classList.add("reveal");
      io.observe(el);
    }
    return () => {
      io.disconnect();
      for (const el of els) el.classList.remove("reveal", "is-in");
    };
  }, []);
  return null;
}
