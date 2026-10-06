"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { START_HREF } from "@/lib/links";
import { PlatformStrip } from "@/components/sections/Platform";

/**
 * Hero, rebuilt to a reference (Hamza, 6 Oct): a dark stage with the claim
 * set as two huge words in opposite corners — CONTENT top left, AT SCALE
 * bottom right — and a cluster of the product's own work stacked between
 * them as cards at different depths, and a list with the primary action in
 * the bottom-left corner. The top-right notes and the chat-card sales action
 * came out on 6 Oct (Hamza).
 *
 * The stage is dark on the light page (Hamza, 6 Oct): it carries
 * data-theme="dark", which globals.css honours on any element, and the nav
 * sits over it as `onDark`.
 *
 * The list bottom-left is the Use Cases section's six categories (Hamza,
 * 6 Oct). Each is a button: an arrow appears on hover, and choosing one puts
 * that category's eleven images on the eleven cards. The titles and the
 * first four files mirror sections/UseCases; they are repeated here rather
 * than imported so the client hero does not pull the server section in.
 *
 * The cluster moves with the pointer: each card carries a depth (`--z`) and
 * shifts by that much of the pointer's offset from the centre, so the front
 * cards travel further than the back ones. Off under reduced motion and on
 * touch, where there is no pointer to follow.
 *
 * Under the stage, the platform strip (`sections/Platform`), on the page.
 */

type Card = { src: string; x: number; y: number; w: number; h: number; z: number };

/** Positions in % of the cluster box (560 × 600 design units); z is depth,
    0 at the back to 1 at the front. Back cards are smaller and dimmer. */
const CARDS: Card[] = [
  { src: "m3", x: 4, y: 15, w: 22, h: 35, z: 0.15 },
  { src: "m17", x: 22, y: 6, w: 27, h: 39, z: 0.5 },
  { src: "m12", x: 42, y: 3, w: 27, h: 41, z: 0.75 },
  { src: "m18", x: 63, y: 9, w: 23, h: 40, z: 0.35 },
  { src: "m1", x: 80, y: 28, w: 14, h: 34, z: 0.1 },
  { src: "m14", x: 0, y: 49, w: 20, h: 36, z: 0.3 },
  { src: "m13", x: 16, y: 45, w: 28, h: 42, z: 0.95 },
  { src: "m9", x: 42, y: 42, w: 27, h: 44, z: 0.85 },
  { src: "m11", x: 65, y: 46, w: 21, h: 37, z: 0.45 },
  { src: "m4", x: 28, y: 84, w: 26, h: 14, z: 0.05 },
  { src: "m6", x: 52, y: 84, w: 22, h: 13, z: 0.05 },
];

/** The Use Cases categories, each with eleven images, one per card: the
    four from sections/UseCases plus seven more generated for the hero
    (Hamza, 6 Oct; Nano Banana Pro, 3:4, unbranded, no text). The first is
    the default. */
const GROUPS: { title: string; dir: string }[] = [
  { title: "Photography", dir: "photography" },
  { title: "Branding", dir: "branding" },
  { title: "Interior Design", dir: "architecture" },
  { title: "Try On", dir: "try-on" },
  { title: "Product", dir: "product" },
  { title: "Style Transfer", dir: "style-transfer" },
];
const PER_GROUP = CARDS.length;
const groupImages = (g: { dir: string }) => Array.from({ length: PER_GROUP }, (_, n) => `/media/use-cases/${g.dir}/${n + 1}.jpg`);
/** Cards from front to back, so the chosen category lands on the front. */
const CARDS_BY_DEPTH = CARDS.map((c, i) => ({ ...c, i })).sort((a, b) => b.z - a.z);

/** Drifting dust, positions in % of the stage. */
const DUST = [
  [6, 18], [14, 62], [22, 38], [31, 74], [9, 86], [47, 12], [58, 88],
  [71, 22], [83, 44], [91, 70], [66, 64], [38, 92], [96, 14], [3, 48],
];

export function Hero() {
  const cluster = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  /* One image per card from the chosen category alone, the strongest four
     on the four front cards, so a switch changes every card. */
  const images = groupImages(GROUPS[active]);
  const srcFor = new Map(CARDS_BY_DEPTH.map((c, k) => [c.i, images[k]]));

  /**
   * Pointer parallax. One listener on the stage writes the pointer's offset
   * from the centre (-1 to 1) to two custom properties on the cluster; each
   * card's transform reads them times its own depth, so the browser does the
   * per-card work and React never re-renders.
   */
  useEffect(() => {
    const el = cluster.current;
    const stage = el?.closest(".hx") as HTMLElement | null;
    if (!el || !stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    };
    const onLeave = () => { el.style.setProperty("--mx", "0"); el.style.setProperty("--my", "0"); };
    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <section id="top" className="hx" data-theme="dark">
        <span className="hx-corner hx-corner-l" aria-hidden />
        <span className="hx-corner hx-corner-r" aria-hidden />
        <div className="hx-dust" aria-hidden>
          {DUST.map(([x, y], i) => (
            <span key={i} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${(i % 7) * -1.3}s` }} />
          ))}
        </div>

        {/* One heading, two corners. Each word is placed on its own, but they
            are one h1 so the claim reads as "Content at scale". */}
        <h1 className="hx-title">
          <span className="hx-word hx-word-a">Content</span>{" "}
          <span className="hx-word hx-word-b">At Scale</span>
        </h1>

        <div className="hx-cluster" ref={cluster} aria-hidden>
          {CARDS.map((c, i) => (
            <span
              key={c.src}
              className="hx-card"
              style={{
                left: `${c.x}%`, top: `${c.y}%`, width: `${c.w}%`, height: `${c.h}%`,
                ["--z" as string]: c.z,
                zIndex: Math.round(c.z * 10),
              }}
            >
              {/* Keyed on the file so a change remounts and fades in. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={srcFor.get(i)} src={withBasePath(srcFor.get(i)!)} alt="" />
            </span>
          ))}
        </div>

        <div className="hx-foot">
          <ul className="hx-list" aria-label="Use cases">
            {GROUPS.map((g, i) => (
              <li key={g.dir}>
                <button type="button" className={`hx-pick ${i === active ? "hx-pick-on" : ""}`} aria-pressed={i === active} onClick={() => setActive(i)}>
                  <span className="hx-pick-arrow" aria-hidden>
                    <svg width="12" height="11" viewBox="0 0 12 11" fill="none"><path d="M11.17 5.5H1M7.75 10l3.585-3.97c.53-.53.54-.52 0-1.06L7.75 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                  </span>
                  {g.title}
                </button>
              </li>
            ))}
          </ul>
          <a className="hx-go" href={START_HREF}>
            Start creating for free
            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" aria-hidden>
              <path d="M11.17 5.5H1M7.75 10l3.585-3.97c.53-.53.54-.52 0-1.06L7.75 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </a>
        </div>
      </section>

      <div className="hx-strip">
        <div className="container-page">
          <PlatformStrip />
        </div>
      </div>

      <style>{`
        /* The stage. Dark on the light page via data-theme="dark" on the
           section (Hamza, 6 Oct), so every token inside is the dark set. */
        .hx {
          --hx-ink: var(--ink-heading);
          --hx-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
          --hx-pad: clamp(16px, 2.2vw, 36px);
          position: relative;
          isolation: isolate;
          overflow: hidden;
          height: max(100svh, 720px);
          max-height: 1080px;
          background: var(--page-bg);
          color: var(--hx-ink);
        }

        /* Corner brackets, top left and top right, under the nav. */
        .hx-corner {
          position: absolute;
          top: 92px;
          width: 18px; height: 18px;
          border-top: 1px solid var(--line-strong);
          pointer-events: none;
        }
        .hx-corner-l { left: var(--hx-pad); border-left: 1px solid var(--line-strong); }
        .hx-corner-r { right: var(--hx-pad); border-right: 1px solid var(--line-strong); }

        .hx-dust { position: absolute; inset: 0; pointer-events: none; }
        .hx-dust span {
          position: absolute;
          width: 4px; height: 4px;
          border-radius: 999px;
          background: var(--ink-heading);
          opacity: 0.16;
          animation: hx-drift 9s ease-in-out infinite;
        }
        .hx-dust span:nth-child(3n) { width: 6px; height: 6px; opacity: 0.1; }
        @keyframes hx-drift {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(6px, -10px); }
        }

        /* The two words. Heavy, tight, and placed in opposite corners; the
           bottom one sits in front of the cluster, as in the reference. */
        .hx-title { margin: 0; font-weight: 400; }
        .hx-word {
          position: absolute;
          z-index: 20;
          /* A step down from 11.2vw / 210px (Hamza, 6 Oct). */
          font-size: clamp(56px, 9.6vw, 180px);
          line-height: 0.8;
          font-weight: 800;
          letter-spacing: -0.045em;
          text-transform: uppercase;
          color: var(--hx-ink);
          white-space: nowrap;
          pointer-events: none;
        }
        .hx-word-a { left: calc(var(--hx-pad) - 0.04em); top: 104px; }
        .hx-word-b { right: calc(var(--hx-pad) - 0.02em); bottom: calc(var(--hx-pad) + 6px); }

        /* The list and the action in the page's face, Google Sans Flex,
           not the mono they had (Hamza, 6 Oct). */
        .hx-list, .hx-go { font-family: var(--font-sans); }

        /* The cluster: a box in the middle of the stage, cards placed in it
           by percentage, so it scales as one. */
        .hx-cluster {
          --mx: 0; --my: 0;
          position: absolute;
          left: 50%;
          /* Low enough that the top cards clear CONTENT's baseline; the
             bottom ones run under AT SCALE, as ATELIER does in the reference. */
          top: 55%;
          height: min(62%, 660px);
          aspect-ratio: 560 / 600;
          transform: translate(-50%, -50%);
          z-index: 10;
        }
        .hx-card {
          position: absolute;
          border-radius: 14px;
          overflow: hidden;
          background: var(--tile);
          box-shadow:
            0 18px 40px rgba(0, 0, 0, 0.16),
            0 4px 10px rgba(0, 0, 0, 0.08);
          /* Full opacity front to back (Hamza, 6 Oct); depth comes from
             size, overlap and parallax alone. */
          transform:
            translate3d(calc(var(--mx) * var(--z) * 22px), calc(var(--my) * var(--z) * 16px), 0)
            scale(calc(0.94 + var(--z) * 0.06));
          transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .hx-card img { width: 100%; height: 100%; object-fit: cover; display: block; }


        .hx-foot {
          position: absolute;
          left: var(--hx-pad);
          bottom: calc(var(--hx-pad) + 6px);
          z-index: 21;
        }
        .hx-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        /* Each category is a button: muted at rest, full ink with an arrow
           on hover and when chosen. The arrow slides in from the left. */
        .hx-pick {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-left: -20px;
          padding: 2px 0;
          border: 0;
          background: none;
          font: inherit;
          font-size: 15px;
          letter-spacing: 0.01em;
          color: var(--ink-2);
          cursor: pointer;
          transition: color 160ms ease;
        }
        .hx-pick-arrow { width: 12px; display: inline-flex; opacity: 0; transform: translateX(-6px); transition: opacity 160ms ease, transform 200ms cubic-bezier(0.22, 1, 0.36, 1); }
        .hx-pick:hover, .hx-pick-on { color: var(--ink-heading); }
        .hx-pick:hover .hx-pick-arrow, .hx-pick-on .hx-pick-arrow { opacity: 1; transform: none; }
        .hx-pick:focus-visible { outline: 2px solid var(--ink-heading); outline-offset: 3px; border-radius: 4px; }
        @keyframes hx-card-in { from { opacity: 0; } to { opacity: 1; } }
        .hx-card img { animation: hx-card-in 420ms ease both; }
        .hx-go {
          margin-top: 22px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          height: 40px;
          padding: 0 16px;
          border-radius: 10px;
          background: var(--ink-heading);
          color: var(--page-bg);
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: 0.01em;
          text-decoration: none;
          transition: opacity 200ms ease;
        }
        .hx-go:hover { opacity: 0.86; }
        .hx-go:focus-visible { outline: 2px solid var(--ink-heading); outline-offset: 3px; }

        .hx-strip { padding-top: clamp(48px, 6vw, 80px); padding-bottom: clamp(40px, 6vh, 72px); }

        /* Narrow: the stage stops being a poster and becomes a column —
           word, cluster, word, then the notes and actions in flow. */
        @media (max-width: 880px) {
          .hx {
            height: auto;
            max-height: none;
            display: flex;
            flex-direction: column;
            padding: 112px var(--hx-pad) 32px;
          }
          .hx-corner { top: 84px; }
          .hx-word, .hx-cluster, .hx-foot { position: relative; inset: auto; transform: none; }
          /* The words become items of the column, so the cluster can sit
             between them. */
          .hx-title { display: contents; }
          .hx-word { font-size: clamp(54px, 17vw, 120px); }
          .hx-word-b { align-self: flex-end; order: 3; }
          .hx-word-a { order: 1; }
          .hx-cluster { order: 2; width: 100%; height: auto; margin: 28px 0 -40px; }
          .hx-foot { order: 5; margin-top: 32px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hx-dust span { animation: none; }
          .hx-card { transition: none; }
          .hx-card img { animation: none; }
          .hx-pick-arrow { transition: none; }
        }
      `}</style>
    </>
  );
}
