"use client";

import { useRef, useState } from "react";

/**
 * Realtime collaboration demo: a comment thread on a dotted canvas, with named
 * cursors at rest and a "You" bubble tracking the pointer.
 *
 * The cursors sit in place by default and scatter outward on hover. At rest
 * the card already looks like a canvas other people are working on, which is
 * what most visitors and every touch device sees. There is no screenshot: the
 * canvas is drawn, so it reads as the product surface rather than a picture
 * of one. Cursor colours are the one place colour appears, because they are
 * the product's own presence colours.
 */
const CURSORS = [
  { name: "Nima", color: "#4F7DF3", x: "10%", y: "22%", exit: "translateY(-60px)" },
  { name: "Sophia", color: "#E2574C", x: "80%", y: "18%", exit: "translateX(60px)" },
  { name: "Bogdan", color: "#2F9BE8", x: "78%", y: "74%", exit: "translateX(60px)" },
  { name: "Francisco", color: "#D9A03F", x: "12%", y: "72%", exit: "translateX(-60px)" },
];

export function CollaborationDemo({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [hovered, setHovered] = useState(false);
  const youBubbleRef = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const b = youBubbleRef.current;
    if (!b) return;
    const rect = e.currentTarget.getBoundingClientRect();
    b.style.left = `${e.clientX - rect.left + 14}px`;
    b.style.top = `${e.clientY - rect.top + 6}px`;
  }

  return (
    <div
      className={`collab-demo collab-${tone}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMouseMove}
    >
      <span className="collab-dots" aria-hidden />

      <div className="collab-thread">
        <span className="collab-badge collab-badge-dc" aria-hidden>DC</span>

        <div className="collab-card">
          <div className="collab-card-top">
            <span className="collab-card-title">Comment</span>
            <span className="collab-card-actions" aria-hidden>
              <span className="collab-dot-menu">···</span>
              <span className="collab-icon collab-icon-solid">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="collab-icon">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </span>
            </span>
          </div>

          <span className="collab-avatar" aria-hidden />

          <p className="collab-byline">
            <strong>Daniel Craig</strong> <span>Just now</span>
          </p>
          <p className="collab-body">
            Swap the second shot for the wide take, then re-run the ad cut with
            the new voiceover.
          </p>

          <div className="collab-composer">
            <span className="collab-badge collab-badge-as" aria-hidden>AS</span>
            <span className="collab-input">
              Leave a comment…
              <span className="collab-send" aria-hidden>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
          </div>
        </div>
      </div>

      {CURSORS.map((c, i) => (
        <div
          key={c.name}
          className="collab-cursor"
          style={{
            left: c.x,
            top: c.y,
            opacity: hovered ? 0 : 1,
            transform: hovered ? c.exit : "translate(0,0)",
            transitionDelay: `${i * 65}ms`,
          }}
        >
          <svg width="18" height="22" viewBox="0 0 14 18" fill="none">
            <path d="M0 0L0 14L4 10.5L6.5 16L8 15.5L5.5 10L10.5 10Z" fill={c.color} />
          </svg>
          <span className="collab-name" style={{ background: c.color }}>
            {c.name}
          </span>
        </div>
      ))}

      <div ref={youBubbleRef} className="collab-you" style={{ opacity: hovered ? 1 : 0 }} aria-hidden>
        <span>You</span>
      </div>

      <style>{`
        .collab-demo {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 220px;
          border-radius: 16px;
          overflow: hidden;
          background: var(--cl-bg);
          border: 1px solid var(--cl-line);
          container-type: inline-size;
        }
        .collab-light {
          --cl-bg: #ffffff;
          --cl-line: rgba(0, 0, 0, 0.07);
          --cl-dot: rgba(0, 0, 0, 0.10);
          --cl-card: #ffffff;
          --cl-card-line: rgba(0, 0, 0, 0.07);
          --cl-ink: #16181d;
          --cl-ink-soft: rgba(22, 24, 29, 0.5);
          --cl-field: #f6f7f9;
          --cl-shadow: 0 8px 26px rgba(16, 20, 30, 0.10);
          --cl-you-bg: #16181d;
          --cl-you-fg: #ffffff;
        }
        .collab-dark {
          --cl-bg: #0f0f13;
          --cl-line: rgba(255, 255, 255, 0.05);
          --cl-dot: rgba(255, 255, 255, 0.07);
          --cl-card: #191a20;
          --cl-card-line: rgba(255, 255, 255, 0.08);
          --cl-ink: #f2f3f5;
          --cl-ink-soft: rgba(242, 243, 245, 0.5);
          --cl-field: rgba(255, 255, 255, 0.05);
          --cl-shadow: 0 8px 26px rgba(0, 0, 0, 0.4);
          --cl-you-bg: #ffffff;
          --cl-you-fg: #0a0a0b;
        }

        .collab-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, var(--cl-dot) 1px, transparent 1px);
          background-size: 22px 22px;
        }

        .collab-thread {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: flex-start;
          gap: 8px;
          width: min(78%, 340px);
        }
        .collab-card {
          flex: 1;
          min-width: 0;
          background: var(--cl-card);
          border: 1px solid var(--cl-card-line);
          border-radius: 12px;
          box-shadow: var(--cl-shadow);
          padding: 12px 13px 13px;
          color: var(--cl-ink);
        }
        .collab-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .collab-card-title { font-size: 12.5px; font-weight: 600; letter-spacing: -0.01em; }
        .collab-card-actions { display: flex; align-items: center; gap: 5px; color: var(--cl-ink-soft); }
        .collab-dot-menu { font-size: 12px; line-height: 1; letter-spacing: 0.5px; }
        .collab-icon { width: 17px; height: 17px; border-radius: 999px; display: grid; place-items: center; }
        .collab-icon-solid { background: var(--cl-field); color: var(--cl-ink); }

        .collab-avatar {
          display: block;
          margin-top: 9px;
          width: 20px; height: 20px;
          border-radius: 999px;
          background: linear-gradient(140deg, #8a6a52, #43342a);
        }
        .collab-byline { margin-top: 5px; font-size: 11px; letter-spacing: 0.004em; }
        .collab-byline strong { font-weight: 600; }
        .collab-byline span { color: var(--cl-ink-soft); }
        .collab-body {
          margin-top: 3px;
          font-size: 11px;
          line-height: 1.5;
          letter-spacing: 0.006em;
          color: var(--cl-ink);
        }

        .collab-composer { margin-top: 11px; display: flex; align-items: center; gap: 7px; }
        .collab-input {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          background: var(--cl-field);
          border: 1px solid var(--cl-card-line);
          border-radius: 9px;
          padding: 6px 6px 6px 9px;
          font-size: 10.5px;
          color: var(--cl-ink-soft);
        }
        .collab-send {
          width: 16px; height: 16px;
          border-radius: 999px;
          display: grid; place-items: center;
          background: var(--cl-card);
          border: 1px solid var(--cl-card-line);
          color: var(--cl-ink-soft);
          flex: 0 0 auto;
        }

        .collab-badge {
          flex: 0 0 auto;
          width: 22px; height: 22px;
          border-radius: 999px;
          display: grid; place-items: center;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: #fff;
        }
        .collab-badge-dc { background: #2f6bf3; }
        .collab-badge-as { background: #3f63e0; width: 20px; height: 20px; }

        .collab-cursor {
          position: absolute;
          pointer-events: none;
          transition:
            opacity 420ms cubic-bezier(0.34, 1.56, 0.64, 1),
            transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .collab-name {
          display: inline-block;
          margin-top: 4px;
          margin-left: 4px;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: -0.01em;
          padding: 4px 10px;
          border-radius: 8px;
          white-space: nowrap;
        }

        .collab-you { position: absolute; pointer-events: none; z-index: 20; transition: opacity 200ms ease; }
        .collab-you span {
          display: inline-block;
          background: var(--cl-you-bg);
          color: var(--cl-you-fg);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: -0.01em;
          padding: 4px 10px;
          border-radius: 8px;
          white-space: nowrap;
          box-shadow: var(--cl-shadow);
        }

        @container (max-width: 380px) {
          .collab-thread { width: 86%; }
          .collab-name { font-size: 10px; padding: 3px 8px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .collab-cursor { transition: opacity 200ms ease; transform: none !important; }
        }
      `}</style>
    </div>
  );
}
