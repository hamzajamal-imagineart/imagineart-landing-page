"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A tab list that walks itself.
 *
 * Holds the selected index and moves it on every `intervalMs`, which is also
 * the duration the tab's progress fill is drawn over, so the fill completing
 * and the tab changing are the same moment.
 *
 * `epoch` changes on every advance, manual or automatic. Feed it to the
 * progress fill as a key so the fill restarts from zero each time, including
 * when someone picks a tab by hand partway through a cycle.
 *
 * Stops while `paused` (hover, focus) and does not run under reduced motion,
 * where content that moves on its own is exactly what the setting is asking
 * you not to do.
 */
export function useAutoAdvance(count: number, intervalMs: number) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [motion, setMotion] = useState(true);
  const [epoch, setEpoch] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotion(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || !motion || count < 2) return;
    timer.current = setTimeout(() => {
      setActive((i) => (i + 1) % count);
      setEpoch((e) => e + 1);
    }, intervalMs);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [paused, motion, count, intervalMs, epoch]);

  /** Select by hand; restarts the cycle from the chosen tab. */
  const pick = useCallback((i: number) => {
    setActive(i);
    setEpoch((e) => e + 1);
  }, []);

  /** Bind to the element that should stop the walk while it is being used. */
  const hold = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocusCapture: () => setPaused(true),
    onBlurCapture: () => setPaused(false),
  };

  return { active, pick, epoch, paused, running: motion && count > 1, hold };
}
