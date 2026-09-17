"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * One fill that slides between the tabs of a tab list.
 *
 * Every tab list on this page had the same flaw: the selected tab toggled its
 * own background, border and shadow, so a switch read as one tab flashing off
 * and another flashing on, and any property left out of the transition list
 * (a border colour, usually) snapped. Moving the fill onto a single element
 * that travels turns that into one continuous motion, and leaves each tab
 * with nothing to animate but its text colour.
 *
 * Usage: put `containerRef` on the element with `position: relative`, collect
 * the tab elements in `itemRefs`, and render <SlidingIndicator> as the
 * container's first child with a class carrying the fill. Tabs need
 * `position: relative` so they paint above it.
 *
 * Pass a negative `active` for "nothing selected" and the fill is not
 * rendered at all.
 */
export type IndicatorBox = { x: number; y: number; w: number; h: number };

export function useSlidingIndicator<T extends HTMLElement>(active: number) {
  const containerRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(T | null)[]>([]);
  const [box, setBox] = useState<IndicatorBox | null>(null);
  const [ready, setReady] = useState(false);

  const measure = useCallback(() => {
    const host = containerRef.current;
    const item = active < 0 ? null : itemRefs.current[active];
    if (!host || !item) { setBox(null); return; }
    setBox({
      x: item.offsetLeft - host.scrollLeft,
      y: item.offsetTop - host.scrollTop,
      w: item.offsetWidth,
      h: item.offsetHeight,
    });
  }, [active]);

  useLayoutEffect(() => { measure(); }, [measure]);

  useEffect(() => {
    // The first placement happens with no transition, so the fill does not
    // fly in from the corner; every move after it animates. Armed from a
    // passive effect rather than requestAnimationFrame, which is suspended
    // while the tab is in the background and would leave the whole page's
    // tab lists snapping until it was next looked at.
    if (box && !ready) setReady(true);
  }, [box, ready]);

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    itemRefs.current.forEach((el) => el && ro.observe(el));
    host.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    // Tab widths move when the webfont lands.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      ro.disconnect();
      host.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return { containerRef, itemRefs, box, ready };
}

export function SlidingIndicator({
  box,
  ready,
  className,
  progress,
}: {
  box: IndicatorBox | null;
  ready: boolean;
  /** Carries the fill: background, border, radius, shadow. */
  className: string;
  /**
   * Draws a fill across the tab over `durationMs`, as the dwell before the
   * list advances. `key` restarts it: give it the epoch from useAutoAdvance
   * so a manual pick resets the cycle too.
   */
  progress?: { key: number; durationMs: number; paused?: boolean };
}) {
  if (!box) return null;
  return (
    <span
      aria-hidden
      className={`sl-ind ${className} ${ready ? "sl-ind-ready" : ""}`}
      style={{ transform: `translate3d(${box.x}px, ${box.y}px, 0)`, width: box.w, height: box.h }}
    >
      {progress && (
        <span
          key={progress.key}
          className="sl-progress"
          style={{
            animationDuration: `${progress.durationMs}ms`,
            animationPlayState: progress.paused ? "paused" : "running",
          }}
        />
      )}
    </span>
  );
}

/** Emitted once per tab list; duplicated rules are harmless. */
export const slidingIndicatorCss = `
  .sl-ind {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }
  /* The dwell, drawn as a fill sweeping across the selected tab. It reaches
     the far edge exactly as the list moves on. Kept very faint: it only has
     to be noticed when someone is already looking at the tab, so it reads as
     a shade passing over rather than a bar filling up. */
  .sl-progress {
    position: absolute;
    inset: 0;
    right: auto;
    width: 0;
    background: rgba(47, 67, 88, 0.045);
    animation-name: sl-fill;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }
  @keyframes sl-fill { from { width: 0; } to { width: 100%; } }
  .sl-ind-ready {
    transition:
      transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
      width 420ms cubic-bezier(0.22, 1, 0.36, 1),
      height 420ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  @media (prefers-reduced-motion: reduce) {
    .sl-ind-ready { transition: none; }
    .sl-progress { display: none; }
  }
`;
