"use client";

import { useState } from "react";
import { START_HREF } from "@/lib/links";
import { PlatformStrip } from "@/components/sections/Platform";
import { HeroGlobe } from "@/components/sections/HeroGlobe";

/**
 * Hero, rebuilt to a reference (Hamza, 6 Oct): a dark stage with the claim
 * set as two huge words in opposite corners — CONTENT top left, AT SCALE
 * bottom right — and a cluster of the product's own work stacked between
 * them as cards at different depths, and a list with the primary action in
 * the bottom-left corner. The top-right notes and the chat-card sales action
 * came out on 6 Oct (Hamza).
 *
 * The stage takes the page's tokens (light again since 7 Oct, Hamza), and
 * the nav sits over it as `onLight`.
 *
 * The list bottom-left is the Use Cases section's categories, merged into
 * two groups (Hamza, 7 Oct). Each is a button: an arrow appears on hover,
 * and choosing one retextures the globe with that group's 33 images. The
 * folders mirror sections/UseCases; they are named here rather than imported
 * so the client hero does not pull the server section in.
 *
 * Between the words sits the planet of work from sections/HeroGlobe (Hamza,
 * 7 Oct), in the box the card cluster used to fill; the globe handles its
 * own pointer parallax and reduced-motion behaviour.
 *
 * Under the stage, the platform strip (`sections/Platform`), on the page.
 */

/** The list bottom-left: the Use Cases categories merged into two groups
    (Hamza, 7 Oct), so each click textures the globe with 33 images rather
    than 11 and the tiles repeat less. Each folder holds eleven stills: the
    four from sections/UseCases plus seven generated for the hero (6 Oct;
    Nano Banana Pro, 3:4, unbranded, no text). The first group is the
    default. */
const GROUPS: { title: string; dirs: string[] }[] = [
  { title: "Brand, product & photography", dirs: ["photography", "branding", "product"] },
  { title: "Fashion, interiors & style", dirs: ["try-on", "architecture", "style-transfer"] },
];
/** Images per folder (the globe cycles them over its tiles). */
const PER_DIR = 11;
const groupImages = (g: { dirs: string[] }) =>
  g.dirs.flatMap((dir) => Array.from({ length: PER_DIR }, (_, n) => `/media/use-cases/${dir}/${n + 1}.jpg`));

/** Drifting dust, positions in % of the stage. */
const DUST = [
  [6, 18], [14, 62], [22, 38], [31, 74], [9, 86], [47, 12], [58, 88],
  [71, 22], [83, 44], [91, 70], [66, 64], [38, 92], [96, 14], [3, 48],
];

export function Hero() {
  const [active, setActive] = useState(0);
  /* The chosen group's 33 images texture the globe. */
  const images = groupImages(GROUPS[active]);

  return (
    <>
      <section id="top" className="hx">
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

        {/* The planet of work (sections/HeroGlobe), in the box the card
            cluster used to fill (Hamza, 7 Oct), textured with the chosen
            category's images; no clips here. */}
        <div className="hx-cluster" aria-hidden>
          <HeroGlobe images={images} clips={[]} distance={82} />
        </div>

        <div className="hx-foot">
          <ul className="hx-list" aria-label="Use cases">
            {GROUPS.map((g, i) => (
              <li key={g.title}>
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
        /* The stage, on the page's own tokens: light on the light page, and
           still dark if the theme flips back. */
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

        /* The globe's box in the middle of the stage: the same box the card
           cluster filled, so it scales as one. The canvas fills it. */
        .hx-cluster {
          position: absolute;
          left: 50%;
          top: 55%;
          height: min(62%, 660px);
          aspect-ratio: 560 / 600;
          transform: translate(-50%, -50%);
          z-index: 10;
          pointer-events: none;
        }
        .hx-cluster .hg-host { position: absolute; inset: 0; }
        .hx-cluster .hg-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }

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

        /* The primary action in the brand purple the hero carried before
           (Hamza, 7 Oct): the radial, a 4px lip along the foot, a violet
           glow; white type. */
        .hx-go {
          margin-top: 22px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          height: 48px;
          padding: 0 22px 4px;
          border-radius: calc(19px * var(--corner));
          font-size: 15px;
          font-weight: 500;
          letter-spacing: -0.005em;
          white-space: nowrap;
          text-decoration: none;
          color: #fff;
          background: radial-gradient(63% 261% at 50% 50%, #8A3FFC 30.29%, #8A3FFC 63.46%, #491D8B 100%);
          box-shadow:
            0 6px 12px rgba(138, 63, 252, 0.15),
            0 12px 24px rgba(138, 63, 252, 0.15),
            inset 0 -4px 0 #491D8B;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hx-go:hover {
          box-shadow:
            0 8px 16px rgba(138, 63, 252, 0.26),
            0 16px 32px rgba(138, 63, 252, 0.22),
            inset 0 -4px 0 #491D8B;
        }
        .hx-go:active { transform: translateY(1px); }
        .hx-go:focus-visible { outline: 2px solid #8a3ffc; outline-offset: 3px; }

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
          .hx-pick-arrow { transition: none; }
        }
      `}</style>
    </>
  );
}
