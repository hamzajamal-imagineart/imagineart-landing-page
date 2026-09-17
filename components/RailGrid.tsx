"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assets";

/**
 * Rail and cards.
 *
 * A vertical rail on the left lists groups with an icon, a name and a
 * one-line subtitle; the grid on the right shows the selected group's cards,
 * each a 16:9 frame with a caption row (icon + name) and a tag.
 *
 * Shared by Capabilities and Use cases, so it lives here rather than in
 * either section. The rail is a WAI-ARIA tab list (roving tabindex, arrow
 * keys). Every group's grid renders into the HTML, stacked in one grid cell;
 * inactive grids are aria-hidden and their clips stay at preload="none"
 * until first selected, so nothing is gated on the active index for a
 * crawler and the page does not fetch every clip on load.
 *
 * A card with `href` renders as a link with a hover lift; one without a
 * `video` renders as a titled tile on the group's grain palette.
 *
 * Render one RailGrid per section. Class names are prefixed `rg-` and the
 * stylesheet is emitted by each instance, which is harmless duplication.
 */
export type RailCard = {
  name: string;
  tag: string;
  video?: string;
  /** Copy for a card without footage. */
  body?: string;
  href?: string;
};

export type RailGroup = {
  id: string;
  title: string;
  sub: string;
  icon: React.ReactNode;
  /** Grain palette class for the group's card fills. */
  grain: string;
  cards: RailCard[];
};

export function RailGrid({
  idPrefix,
  label,
  groups,
}: {
  /** Unique per instance; used for the tab and panel element ids. */
  idPrefix: string;
  /** Accessible name of the tab list. */
  label: string;
  groups: RailGroup[];
}) {
  const [active, setActive] = useState(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  /**
   * One indicator slides between tabs instead of each tab toggling its own
   * fill: toggling made selection read as two separate flashes. Measured
   * from the live element so it follows the rail in both orientations
   * (vertical above 880px, a horizontal scroller below).
   */
  const [ind, setInd] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [ready, setReady] = useState(false);

  const measure = useCallback(() => {
    const rail = railRef.current;
    const tab = tabRefs.current[active];
    if (!rail || !tab) return;
    setInd({
      x: tab.offsetLeft - rail.scrollLeft,
      y: tab.offsetTop - rail.scrollTop,
      w: tab.offsetWidth,
      h: tab.offsetHeight,
    });
  }, [active]);

  useLayoutEffect(() => { measure(); }, [measure]);

  useEffect(() => {
    // Skip the transition on the first placement, so the indicator does not
    // fly in from the corner on load.
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const ro = new ResizeObserver(measure);
    ro.observe(rail);
    rail.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      rail.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useEffect(() => {
    panelRefs.current.forEach((panel, i) => {
      panel?.querySelectorAll("video").forEach((v) => {
        if (i === active) void v.play().catch(() => {});
        else v.pause();
      });
    });
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const delta = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (active + delta + groups.length) % groups.length;
    setActive(next);
    document.getElementById(`${idPrefix}-tab-${groups[next].id}`)?.focus();
  };

  return (
    <div className="rg">
      <div className="rg-rail" ref={railRef} role="tablist" aria-orientation="vertical" aria-label={label} onKeyDown={onKeyDown}>
        {ind && (
          <span
            className={`rg-ind ${ready ? "rg-ind-ready" : ""}`}
            aria-hidden
            style={{ transform: `translate3d(${ind.x}px, ${ind.y}px, 0)`, width: ind.w, height: ind.h }}
          />
        )}
        {groups.map((g, i) => (
          <button
            key={g.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            id={`${idPrefix}-tab-${g.id}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`${idPrefix}-panel-${g.id}`}
            tabIndex={i === active ? 0 : -1}
            className={`rg-tab ${i === active ? "rg-tab-on" : ""}`}
            onClick={() => setActive(i)}
          >
            <span className="rg-tab-icon" aria-hidden>{g.icon}</span>
            <span className="rg-tab-text">
              <span className="rg-tab-title">{g.title}</span>
              <span className="rg-tab-sub">{g.sub}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="rg-stack">
        {groups.map((g, i) => {
          const on = i === active;
          return (
            <div
              key={g.id}
              id={`${idPrefix}-panel-${g.id}`}
              ref={(el) => { panelRefs.current[i] = el; }}
              role="tabpanel"
              aria-labelledby={`${idPrefix}-tab-${g.id}`}
              aria-hidden={!on}
              className={`rg-panel ${on ? "rg-on" : ""}`}
            >
              <div className="rg-grid">
                {g.cards.map((card) => {
                  const Tag = card.href ? "a" : "article";
                  return (
                    <Tag
                      key={card.name}
                      {...(card.href ? { href: card.href, target: "_blank", rel: "noopener noreferrer", tabIndex: on ? 0 : -1 } : {})}
                      className="rg-card"
                    >
                      <div className={`rg-media grain ${g.grain} ${card.video ? "rg-has-video" : ""}`}>
                        {card.video ? (
                          // eslint-disable-next-line jsx-a11y/media-has-caption
                          <video
                            className="rg-video"
                            src={withBasePath(card.video)}
                            autoPlay={i === 0}
                            muted
                            loop
                            playsInline
                            preload={i === 0 ? "auto" : "none"}
                            aria-hidden
                          />
                        ) : (
                          <p className="rg-tile-body">{card.body}</p>
                        )}
                      </div>
                      <div className="rg-cap">
                        <span className="rg-cap-name">
                          <span className="rg-cap-icon" aria-hidden>{g.icon}</span>
                          {card.name}
                        </span>
                        <span className="rg-cap-tag">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
                          </svg>
                          {card.tag}
                        </span>
                      </div>
                    </Tag>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .rg {
          display: grid;
          grid-template-columns: 280px minmax(0, 1fr);
          gap: 24px;
          align-items: start;
          min-width: 0;
        }

        .rg-rail {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px;
          border-radius: 20px;
          background: #dce4ee;
          border: 1px solid var(--line);
          position: sticky;
          top: 112px;
        }
        .rg-ind {
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 14px;
          background: #f3f5f8;
          border: 1px solid var(--line);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 4px 14px rgba(16, 20, 30, 0.05);
          pointer-events: none;
          z-index: 0;
        }
        .rg-ind-ready {
          transition:
            transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
            width 420ms cubic-bezier(0.22, 1, 0.36, 1),
            height 420ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .rg-tab {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 12px;
          border: 1px solid transparent;
          border-radius: 14px;
          background: transparent;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          color: var(--ink-2);
          transition: color 260ms ease;
        }
        .rg-tab::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          /* Kept well short of the selected fill (#f3f5f8): at 0.45 this
             resolved to ~#ecf0f6 and hover was indistinguishable from
             selection. */
          background: rgba(255, 255, 255, 0.22);
          opacity: 0;
          transition: opacity 240ms ease;
          pointer-events: none;
        }
        .rg-tab:hover::before { opacity: 1; }
        .rg-tab-on::before,
        .rg-tab-on:hover::before { opacity: 0; }
        .rg-tab:hover { color: var(--ink); }
        .rg-tab-on { color: var(--ink); }
        /* Icon tiles read as recessed wells: an inset top highlight and a
           soft inner shadow, the light-ground reading of the reference's
           inner glow. The selected tile fills with the page's own hue
           (--ink-heading) rather than an accent colour, so the rail stays
           monochrome and inside the palette. */
        .rg-tab-icon {
          width: 36px; height: 36px;
          border-radius: 11px;
          display: grid; place-items: center;
          background: var(--shade-2);
          color: var(--ink-heading);
          flex: 0 0 auto;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            inset 0 0 10px rgba(255, 255, 255, 0.5),
            inset 0 -1px 2px rgba(16, 20, 30, 0.1);
          transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
        }
        .rg-tab-icon svg { width: 17px; height: 17px; }
        .rg-tab:hover .rg-tab-icon {
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.88),
            inset 0 0 12px rgba(255, 255, 255, 0.58),
            inset 0 -1px 2px rgba(16, 20, 30, 0.12);
        }
        .rg-tab-on .rg-tab-icon {
          background: var(--ink-heading);
          color: #fff;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.22),
            0 2px 8px rgba(47, 67, 88, 0.28);
        }
        .rg-tab-text { display: flex; flex-direction: column; min-width: 0; }
        .rg-tab-title { font-size: 15px; font-weight: 500; letter-spacing: -0.01em; line-height: 1.25; }
        .rg-tab-sub { font-size: 12.5px; color: var(--ink-3); line-height: 1.3; margin-top: 2px; }
        .rg-tab-sub { transition: color 260ms ease; }
        .rg-tab-on .rg-tab-sub { color: var(--ink-2); }

        .rg-stack { display: grid; min-width: 0; }
        .rg-panel {
          grid-area: 1 / 1;
          min-width: 0;
          opacity: 0;
          visibility: hidden;
          transform: translateY(6px);
          transition: opacity 320ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1), visibility 0s linear 320ms;
        }
        .rg-on {
          opacity: 1;
          visibility: visible;
          transform: none;
          transition: opacity 320ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1), visibility 0s;
        }

        .rg-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px 20px;
        }
        .rg-card {
          display: flex;
          flex-direction: column;
          min-width: 0;
          text-decoration: none;
          color: inherit;
        }
        a.rg-card .rg-media { transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1); }
        a.rg-card:hover .rg-media,
        a.rg-card:focus-visible .rg-media { transform: scale(1.015); }

        .rg-media {
          position: relative;
          aspect-ratio: 16 / 9;
          border-radius: 16px;
          padding: clamp(18px, 2vw, 28px);
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }
        .rg-has-video::after { content: none; }
        .rg-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .rg-tile-body {
          font-size: 15px;
          line-height: 1.55;
          max-width: 34ch;
          opacity: 0.85;
        }

        .rg-cap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 12px;
          padding: 0 2px;
        }
        .rg-cap-name {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--ink);
          min-width: 0;
        }
        .rg-cap-icon {
          width: 28px; height: 28px;
          border-radius: 8px;
          display: grid; place-items: center;
          background: var(--panel-2);
          color: var(--ink);
          flex: 0 0 auto;
        }
        .rg-cap-icon svg { width: 14px; height: 14px; }
        .rg-cap-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--ink-3);
          white-space: nowrap;
        }

        @media (max-width: 1024px) {
          .rg { grid-template-columns: 240px minmax(0, 1fr); }
        }
        @media (max-width: 880px) {
          .rg { grid-template-columns: 1fr; gap: 20px; }
          .rg-rail {
            position: static;
            flex-direction: row;
            overflow-x: auto;
            border-radius: 16px;
            scrollbar-width: none;
          }
          .rg-rail::-webkit-scrollbar { display: none; }
          .rg-tab { width: auto; flex: 0 0 auto; padding: 8px 12px 8px 8px; }
          .rg-tab-sub { display: none; }
          .rg-tab-icon { width: 30px; height: 30px; }
          .rg-grid { grid-template-columns: 1fr; gap: 20px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rg-panel, .rg-on, a.rg-card .rg-media { transition: none; transform: none; }
          .rg-ind-ready { transition: none; }
        }
      `}</style>
    </div>
  );
}
