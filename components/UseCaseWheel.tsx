"use client";

import { useRef } from "react";
import { withBasePath } from "@/lib/assets";
import { SlidingIndicator, slidingIndicatorCss, useSlidingIndicator } from "@/components/primitives/SlidingIndicator";
import { useAutoAdvance } from "@/components/primitives/useAutoAdvance";

/**
 * Use cases as a wheel.
 *
 * A centred vertical list of use-case names scrolls so the active one sits on
 * the middle line in a pill, its neighbours fading out by distance; four
 * portrait cards are scattered either side and swap to the active group's
 * work. The list advances on its own so the section plays without being
 * touched, which a rail of tabs never did.
 *
 * Rotation pauses while the pointer is inside the stage or focus is within
 * it, restarts from the current item after a manual pick, and does not run at
 * all under prefers-reduced-motion. Only the active group's clips are in the
 * DOM: nine groups of four would be thirty-six videos on one page.
 *
 * The rail is a WAI-ARIA tab list with a roving tabindex and arrow keys, as
 * the rail it replaces was.
 */
export type WheelCard = { name: string; video: string; href: string };
export type WheelGroup = { id: string; title: string; href: string; cards: WheelCard[] };

const ROTATE_MS = 3000;

export function UseCaseWheel({ groups, label }: { groups: WheelGroup[]; label: string }) {
  const walk = useAutoAdvance(groups.length, ROTATE_MS);
  const { active, pick } = walk;
  const tabRefs = useRef<(HTMLElement | null)[]>([]);
  const pill = useSlidingIndicator<HTMLElement>(active);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const delta = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (active + delta + groups.length) % groups.length;
    pick(next);
    tabRefs.current[next]?.focus();
  };

  const group = groups[active];

  return (
    <div className="uw" {...walk.hold}>
      <div className="uw-cards" key={group.id} aria-hidden>
        {group.cards.slice(0, 4).map((c, i) => (
          <figure key={c.name} className={`uw-card uw-s${i}`} style={{ animationDelay: `${i * 70}ms` }}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video src={withBasePath(c.video)} autoPlay muted loop playsInline preload="auto" />
            <figcaption>{c.name}</figcaption>
          </figure>
        ))}
      </div>

      <div className="uw-wheel">
        <div
          className="uw-track"
          role="tablist"
          aria-orientation="vertical"
          aria-label={label}
          onKeyDown={onKeyDown}
          ref={pill.containerRef as React.Ref<HTMLDivElement>}
        >
          <SlidingIndicator
            box={pill.box}
            ready={pill.ready}
            className="uw-pill"
            progress={walk.running ? { key: walk.epoch, durationMs: ROTATE_MS, paused: walk.paused } : undefined}
          />
          {groups.map((g, i) => {
            const on = i === active;
            return (
              <div key={g.id} className="uw-row">
                {/* Every row is a real link to its template gallery, not just
                    the selected one. A button would leave eight of the nine
                    use cases with no way out of the page at all when the
                    script does not run, and nothing for a crawler to follow.
                    With JS, a click on an inactive row selects it instead of
                    navigating, which is what the wheel has always done. */}
                <a
                  ref={(el) => { tabRefs.current[i] = el; pill.itemRefs.current[i] = el; }}
                  role="tab"
                  aria-selected={on}
                  tabIndex={on ? 0 : -1}
                  className={`uw-name ${on ? "uw-on" : ""}`}
                  href={g.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={on ? undefined : (e) => { e.preventDefault(); pick(i); }}
                >
                  {g.title}
                  {on && (
                    <span className="uw-arrow" aria-hidden>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  )}
                </a>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .uw {
          --uw-row: 54px;
          position: relative;
          display: grid;
          place-items: center;
          min-height: 640px;
        }

        .uw-wheel { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; }
        /* Every use case stays legible at full strength. Nothing travels and
           nothing is masked: the list stands still and the pill moves down it,
           which is what a fade and a sliding track were only approximating. */
        .uw-track {
          position: relative;
          width: 340px;
          display: flex;
          flex-direction: column;
        }
        .uw-row {
          height: var(--uw-row);
          flex: 0 0 var(--uw-row);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .uw-name {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: inherit;
          font-size: 18px;
          font-weight: 500;
          letter-spacing: -0.01em;
          /* The light tint of the page's own hue: further back than --ink-3,
             so the selected pill carries the section on its own. */
          color: var(--heading-muted);
          background: transparent;
          border: 0;
          border-radius: 16px;
          padding: 9px 18px;
          min-height: 42px;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          position: relative;
          z-index: 1;
          transition: color 380ms ease;
        }
        .uw-on {
          padding: 6px 6px 6px 20px;
          color: var(--ink);
        }
        /* Squarer than a button, and unbordered, to match the other tab
           lists on the page. */
        .uw-pill {
          border-radius: 16px;
          background: var(--tile-2);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 6px 18px rgba(16, 20, 30, 0.07);
        }
        /* A filled disc, but riding inside the pill rather than sitting
           beside it as its own button. */
        .uw-arrow {
          width: 28px; height: 28px;
          border-radius: 999px;
          display: grid; place-items: center;
          background: var(--ink-heading);
          color: var(--page-bg);
          flex: 0 0 auto;
          animation: uw-pop 360ms cubic-bezier(0.22, 1, 0.36, 1) both;
          transition: transform 0.2s ease;
        }
        .uw-on:hover .uw-arrow { transform: scale(1.07); }
        @keyframes uw-pop { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: none; } }

        .uw-sub {
          margin-top: 18px;
          font-size: 15px;
          color: var(--ink-3);
          text-align: center;
          animation: uw-fade 500ms ease both;
        }
        @keyframes uw-fade { from { opacity: 0; } to { opacity: 1; } }

        /* Four portrait cards scattered either side of the wheel. The inner
           pair is larger and comes first, so a group with only three cards
           still fills both sides. */
        .uw-cards { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        /* Every group carries four cards so the scatter is always two a side;
           a three-card group left the stage visibly lopsided. */
        .uw-card {
          position: absolute;
          margin: 0;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--line);
          background-color: var(--tile);
          box-shadow: 0 10px 30px rgba(16, 20, 30, 0.1);
          animation: uw-in 620ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .uw-card video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .uw-card figcaption {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          padding: 26px 12px 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: #fff;
          background: linear-gradient(to top, rgba(10, 14, 20, 0.72), transparent);
        }
        @keyframes uw-in { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: none; } }

        .uw-s0 { left: 10%;  top: 27%;  width: 240px; height: 320px; }
        .uw-s1 { right: 10%; top: 23%;  width: 240px; height: 320px; }
        .uw-s2 { left: 0;    top: 2%;   width: 198px; height: 264px; }
        .uw-s3 { right: 0;   top: 0;    width: 198px; height: 264px; }

        @media (max-width: 1100px) {
          .uw-s0 { left: 4%; width: 208px; height: 278px; }
          .uw-s1 { right: 4%; width: 208px; height: 278px; }
          .uw-s2, .uw-s3 { width: 164px; height: 219px; }
        }

        /* Narrow: the scatter holds, but the cards run off both edges and
           sit in the four corners with the wheel down the middle. Captions
           go, since half of each card is past the viewport. */
        @media (max-width: 900px) {
          /* The pairs go hard to the top and bottom corners so the wheel gets
             a clear band of its own down the middle. Overlapping them the way
             the desktop scatter does would put the longest use-case names on
             top of the imagery, which at this width there is no room to
             avoid. */
          .uw { --uw-row: 50px; min-height: 900px; }
          .uw-card { box-shadow: 0 8px 22px rgba(16, 20, 30, 0.1); }
          .uw-card figcaption { display: none; }
          .uw-s0, .uw-s1, .uw-s2, .uw-s3 { width: 172px; height: 272px; }
          .uw-s0 { left: -40px;  top: 0; }
          .uw-s1 { right: -40px; top: 0; }
          .uw-s2 { left: -40px;  top: auto; bottom: 0; }
          .uw-s3 { right: -40px; top: auto; bottom: 0; }
        }
        @media (max-width: 560px) {
          .uw { min-height: 940px; }
          .uw-name { font-size: 17px; }
          .uw-s0, .uw-s1, .uw-s2, .uw-s3 { width: 152px; height: 252px; }
          .uw-s0, .uw-s2 { left: -44px; }
          .uw-s1, .uw-s3 { right: -44px; }
        }

        ${slidingIndicatorCss}

        @media (prefers-reduced-motion: reduce) {
          .uw-name, .uw-arrow { transition: none; }
          .uw-card, .uw-arrow { animation: none; }
        }
      `}</style>
    </div>
  );
}
