"use client";

import { useEffect } from "react";

/**
 * Fades each section in as it scrolls into view.
 *
 * Mounted once, next to <main>, rather than wrapping every section: a wrapper
 * element around a full-bleed band or a sticky rail is a layout risk, and the
 * sections already are the elements we want to animate.
 *
 * Two things keep it out of the trap the heading animation fell into:
 *
 * - It fails open. The hidden state is set from JS, so a page whose script
 *   never runs renders every section visible, and nothing about the static
 *   export changes.
 * - It only arms sections that are below the fold at mount. Anything already
 *   on screen is left alone, so the hero never paints and then blanks.
 *
 * Reduced motion skips the whole thing.
 */
export function SectionReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const main = document.querySelector("main");
    if (!main) return;

    const armed = Array.from(main.children).filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight * 0.9,
    );
    if (armed.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-reveal", "in");
          observer.unobserve(entry.target);
        }
      },
      // A little of the section has to be on screen, so a tall band does not
      // start its fade while it is still a sliver at the bottom edge.
      { rootMargin: "0px 0px -12% 0px" },
    );

    for (const el of armed) {
      el.setAttribute("data-reveal", "");
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
