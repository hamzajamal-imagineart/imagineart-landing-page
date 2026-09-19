import { withBasePath } from "@/lib/assets";
import { BlurHeading } from "@/components/BlurHeading";
import { START_HREF } from "@/lib/links";
import { SectionGuides } from "@/components/primitives/SectionGuides";

/**
 * The agent, sat between Workflows and Use Cases.
 *
 * Workflows is the pipeline you build yourself; the use cases are the things
 * to start from. The agent is the case where you build neither: you describe
 * the outcome and it assembles the run. That is why it sits between them.
 *
 * Shape is deliberately not another bento — Workflows above it is a
 * five-tile grid and Use Cases below it is a centred wheel, so this is a
 * split: the three steps on the left, one clip filling the panel on the
 * right. At `lg` and under it stacks, copy first.
 *
 * The clip is `capabilities/agents.mp4` (581KB), not the hero's
 * `hero/modes/agent.mp4` (11MB). The hero's only loads when its chip is
 * picked; a section clip autoplays for everyone who scrolls past.
 */
const STEPS = [
  {
    n: "01",
    title: "Brief it once.",
    body: "Say what you need in plain language. No node graph, no prompt engineering.",
  },
  {
    n: "02",
    title: "It plans the run.",
    body: "The agent breaks the brief into steps and picks the models and tools each one needs.",
  },
  {
    n: "03",
    title: "It delivers, then iterates.",
    body: "Work comes back finished and on brand. Ask for a change and it reruns only what moved.",
  },
];

export function Agent() {
  return (
    <section id="agents" className="relative border-t border-[color:var(--line)] py-24 md:py-32 lg:border-t-0">
      <SectionGuides edge="top" />
      <div className="container-page">
        <div className="mx-auto max-w-[680px] text-center">
          <BlurHeading className="h2" lead="Agents" />
          <p className="lede mx-auto mt-5">
            Describe the outcome and the agent runs the whole job for you.
          </p>
        </div>

        <div className="ag-split mt-14">
          <div className="ag-panel ag-steps">
            <ol>
              {STEPS.map((s) => (
                <li key={s.n}>
                  <span className="ag-n" aria-hidden>{s.n}</span>
                  <div className="ag-step-copy">
                    <h3 className="ag-title">{s.title}</h3>
                    <p className="ag-body">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a className="ag-go" href={START_HREF}>
              Put the agent to work
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div className="ag-panel ag-media">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={withBasePath("/media/capabilities/agents.mp4")}
              title="An agent run in ImagineArt"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
            />
          </div>
        </div>
      </div>

      <style>{`
        /* Media wider than the copy: the steps are three short rows and the
           clip is the thing worth looking at. */
        .ag-split {
          display: grid;
          grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
          gap: 16px;
          align-items: stretch;
        }
        .ag-panel {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-5);
          background: var(--tile);
          min-width: 0;
        }
        .ag-steps {
          display: flex;
          flex-direction: column;
          padding: clamp(24px, 2.6vw, 36px);
        }
        .ag-steps ol { list-style: none; display: flex; flex-direction: column; gap: 4px; }
        .ag-steps li {
          display: flex;
          gap: 18px;
          padding: 18px 0;
        }
        .ag-steps li + li { box-shadow: inset 0 1px 0 var(--line); }
        /* The number is a marker, not a heading: it sits at the ink the body
           uses so the step's title stays the first thing read. */
        .ag-n {
          flex: 0 0 auto;
          width: 34px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.04em;
          line-height: 1.5;
          padding-top: 2px;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
        }
        .ag-step-copy { min-width: 0; }
        .ag-title { font-size: clamp(17px, 1.4vw, 20px); line-height: 1.25; letter-spacing: -0.015em; color: var(--ink-heading); }
        .ag-body { margin-top: 8px; font-size: 15px; line-height: 1.6; color: var(--ink-2); max-width: 42ch; }

        .ag-go {
          margin-top: auto;
          padding-top: 24px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          align-self: flex-start;
          font-size: 14.5px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--ink-heading);
          transition: opacity 240ms ease;
        }
        .ag-go:hover { opacity: 0.72; }

        /* The clip fills its panel edge to edge; the panel's own radius and
           overflow do the framing, so there is no inner border to double up
           against the tile's edge. */
        .ag-media { min-height: 420px; }
        .ag-media video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        @media (max-width: 1024px) {
          .ag-split { grid-template-columns: minmax(0, 1fr); }
          .ag-media { min-height: 0; aspect-ratio: 16 / 9; }
        }
      `}</style>
    </section>
  );
}
