"use client";

import { useEffect, useRef } from "react";
import { withBasePath } from "@/lib/assets";
import { START_HREF, DEMO_HREF } from "@/lib/links";
import { PlatformStrip } from "@/components/sections/Platform";

/**
 * Hero, rebuilt to a reference (Hamza, 6 Oct): a dark stage with the claim
 * set as two huge words in opposite corners — CONTENT top left, AT SCALE
 * bottom right — and a cluster of the product's own work stacked between
 * them as cards at different depths. Small mono notes sit in the other two
 * corners, and the sales action is a chat card rather than a button pair.
 *
 * The stage is dark on a light page on purpose: it is a band, like the studio
 * banners, so its colours are fixed rather than themed. The nav sits over it
 * as `onDark`.
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

/** Drifting dust, positions in % of the stage. */
const DUST = [
  [6, 18], [14, 62], [22, 38], [31, 74], [9, 86], [47, 12], [58, 88],
  [71, 22], [83, 44], [91, 70], [66, 64], [38, 92], [96, 14], [3, 48],
];

export function Hero() {
  const cluster = useRef<HTMLDivElement | null>(null);

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

        <p className="hx-meta">
          <span>ImagineArt for business</span>
          <span>Image · Video · Audio</span>
          <span>50+ models, one workspace</span>
        </p>

        <div className="hx-cluster" ref={cluster} aria-hidden>
          {CARDS.map((c) => (
            <span
              key={c.src}
              className="hx-card"
              style={{
                left: `${c.x}%`, top: `${c.y}%`, width: `${c.w}%`, height: `${c.h}%`,
                ["--z" as string]: c.z,
                zIndex: Math.round(c.z * 10),
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath(`/media/hero/mosaic/${c.src}.jpg`)} alt="" />
            </span>
          ))}
        </div>

        <a className="hx-chat" href={DEMO_HREF} target="_blank" rel="noopener noreferrer">
          <span className="hx-chat-tag">Hey — got a brief?</span>
          <span className="hx-chat-card">
            <span className="hx-chat-av" aria-hidden>
              <svg viewBox="0 0 21.67 20.95"><path fill="#fff" d="M19.7083 8.50305C17.4331 7.9892 14.86 7.82555 15.483 3.80968L20.0842 5.05666L21.6585 5.4265C21.5807 2.41541 19.0346 0 15.9028 0H5.73204C2.563 0 0 2.48415 0 5.54105V10.1984C0 11.7661 0.870133 12.1982 1.96034 12.4436H1.95357C4.22878 12.9608 6.80193 13.1277 6.17896 17.1403L1.57775 15.8933L0.00338573 15.5267C0.0677146 18.528 2.60363 20.9467 5.73204 20.9467H15.9366C19.0989 20.9467 21.6687 18.4625 21.6687 15.4056V10.745C21.6687 9.18709 20.7952 8.74524 19.7083 8.50305ZM10.831 16.813C9.82201 13.8805 7.42152 11.4847 4.27618 10.4733C7.42152 9.46201 9.82201 7.07278 10.831 4.14024C11.8433 7.07278 14.2404 9.46528 17.3891 10.4766C14.2404 11.4912 11.8433 13.8805 10.831 16.813Z" /></svg>
            </span>
            <span className="hx-chat-text">Talk to our team,<br />not a contact form</span>
          </span>
        </a>

        <div className="hx-foot">
          <ul className="hx-list">
            <li>Campaign creative</li>
            <li>Product imagery</li>
            <li>Brand films</li>
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
        /* The stage. Fixed dark in either theme: it is a band on the page,
           like the studio banners, not the page itself. */
        .hx {
          --hx-ink: #f2f2f0;
          --hx-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
          --hx-pad: clamp(16px, 2.2vw, 36px);
          position: relative;
          isolation: isolate;
          overflow: hidden;
          height: max(100svh, 720px);
          max-height: 1080px;
          background:
            radial-gradient(60% 50% at 50% 48%, rgba(255, 255, 255, 0.05), transparent 70%),
            #111112;
          color: var(--hx-ink);
        }

        /* Corner brackets, top left and top right, under the nav. */
        .hx-corner {
          position: absolute;
          top: 92px;
          width: 18px; height: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.28);
          pointer-events: none;
        }
        .hx-corner-l { left: var(--hx-pad); border-left: 1px solid rgba(255, 255, 255, 0.28); }
        .hx-corner-r { right: var(--hx-pad); border-right: 1px solid rgba(255, 255, 255, 0.28); }

        .hx-dust { position: absolute; inset: 0; pointer-events: none; }
        .hx-dust span {
          position: absolute;
          width: 4px; height: 4px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.22);
          animation: hx-drift 9s ease-in-out infinite;
        }
        .hx-dust span:nth-child(3n) { width: 6px; height: 6px; background: rgba(255, 255, 255, 0.14); }
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
          font-size: clamp(64px, 11.2vw, 210px);
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

        .hx-meta, .hx-list, .hx-chat, .hx-go { font-family: var(--hx-mono); }
        .hx-meta {
          position: absolute;
          top: 112px;
          right: var(--hx-pad);
          z-index: 21;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          font-size: 13.5px;
          letter-spacing: 0.02em;
          color: rgba(255, 255, 255, 0.62);
        }

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
          background: #1c1c1e;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.14) inset,
            0 18px 40px rgba(0, 0, 0, 0.55),
            0 4px 10px rgba(0, 0, 0, 0.35);
          filter: brightness(calc(0.55 + var(--z) * 0.45)) saturate(calc(0.8 + var(--z) * 0.2));
          transform:
            translate3d(calc(var(--mx) * var(--z) * 22px), calc(var(--my) * var(--z) * 16px), 0)
            scale(calc(0.94 + var(--z) * 0.06));
          transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .hx-card img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* Sales, as a chat card: a tag above, the card itself the link. */
        .hx-chat {
          position: absolute;
          right: calc(var(--hx-pad) + 2%);
          top: 57%;
          z-index: 22;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0;
          color: var(--hx-ink);
          text-decoration: none;
        }
        .hx-chat-tag {
          position: relative;
          margin-left: -28px;
          margin-bottom: -8px;
          z-index: 1;
          padding: 7px 11px;
          border-radius: 8px 8px 8px 2px;
          background: #ef3b3b;
          color: #fff;
          font-size: 12.5px;
          letter-spacing: 0.01em;
          box-shadow: 0 6px 16px rgba(239, 59, 59, 0.3);
        }
        .hx-chat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 22px 12px 12px;
          border-radius: 14px;
          background: rgba(20, 20, 22, 0.86);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: border-color 220ms ease, transform 220ms ease;
        }
        .hx-chat:hover .hx-chat-card { border-color: rgba(255, 255, 255, 0.24); transform: translateY(-2px); }
        .hx-chat:focus-visible { outline: 2px solid #fff; outline-offset: 4px; border-radius: 14px; }
        .hx-chat-av {
          width: 44px; height: 44px;
          display: grid; place-items: center;
          border-radius: 10px;
          background: #8a3ffc;
          flex: 0 0 auto;
        }
        .hx-chat-av svg { width: 22px; height: 22px; display: block; }
        .hx-chat-text { font-size: 14px; line-height: 1.5; letter-spacing: 0.01em; }

        .hx-foot {
          position: absolute;
          left: var(--hx-pad);
          bottom: calc(var(--hx-pad) + 6px);
          z-index: 21;
        }
        .hx-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .hx-list li { font-size: 15px; letter-spacing: 0.02em; color: rgba(255, 255, 255, 0.7); }
        .hx-go {
          margin-top: 22px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          height: 40px;
          padding: 0 16px;
          border-radius: 10px;
          background: #f2f2f0;
          color: #111112;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: 0.01em;
          text-decoration: none;
          transition: background 200ms ease;
        }
        .hx-go:hover { background: #fff; }
        .hx-go:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

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
          .hx-word, .hx-meta, .hx-cluster, .hx-chat, .hx-foot { position: relative; inset: auto; transform: none; }
          /* The words become items of the column, so the cluster can sit
             between them. */
          .hx-title { display: contents; }
          .hx-word { font-size: clamp(54px, 17vw, 120px); }
          .hx-word-b { align-self: flex-end; order: 3; }
          .hx-word-a { order: 1; }
          .hx-meta { order: 0; align-items: flex-start; margin-bottom: 20px; font-size: 12px; }
          .hx-cluster { order: 2; width: 100%; height: auto; margin: 28px 0 -40px; }
          .hx-chat { order: 4; margin-top: 32px; align-self: flex-end; }
          .hx-chat-tag { margin-left: 0; }
          .hx-foot { order: 5; margin-top: 32px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hx-dust span { animation: none; }
          .hx-card, .hx-chat-card { transition: none; }
        }
      `}</style>
    </>
  );
}
