import { withBasePath } from "@/lib/assets";
import { BlurHeading } from "@/components/BlurHeading";
import { ButtonLink } from "@/components/Button";
import { START_HREF, DEMO_HREF } from "@/lib/links";
import { SectionGuides } from "@/components/primitives/SectionGuides";

/**
 * Agents, between Workflows and Use Cases.
 *
 * Workflows is the pipeline you build yourself; the use cases are the things
 * to start from. The agent is the case where you build neither: you describe
 * the outcome and it assembles the run. That is why it sits between them.
 *
 * **Rebuilt to carry more weight** (Hamza, 21 Sep). It was a split panel with
 * three numbered rows beside a clip, which read as a feature tile rather than
 * as one of the page's claims. The section now leads with an eyebrow and a
 * two-clause heading, puts the recording full width in a band of its own with
 * the claim over its foot, and lays the three steps out as a rail underneath
 * with the numbers as large quiet marks. The action is a real pair of buttons
 * rather than a text link.
 *
 * The clip is `capabilities/agents.mp4` (581KB), not the hero's
 * `hero/modes/agent.mp4` (11MB). The hero's only loads when its chip is
 * picked; a section clip autoplays for everyone who scrolls past.
 */
const STEPS = [
  {
    n: "01",
    title: "Brief it once",
    body: "Say what you need in plain language. No node graph, no prompt engineering.",
  },
  {
    n: "02",
    title: "It plans the run",
    body: "The agent breaks the brief into steps, then picks the models and tools each one needs.",
  },
  {
    n: "03",
    title: "It delivers, then iterates",
    body: "Work comes back finished and on brand. Ask for a change and it reruns only what moved.",
  },
];

export function Agent() {
  return (
    <section id="agents" className="relative border-t border-[color:var(--line)] py-24 md:py-32 lg:border-t-0">
      <SectionGuides edge="top" />
      <div className="container-page">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="eyebrow">Agents</p>
          <BlurHeading
            className="h2 mt-4"
            lead="Describe the outcome."
            muted="The agent runs the job."
          />
          <p className="lede mx-auto mt-5">
            Not a faster way to work the tools. A way to hand the work over.
          </p>
        </div>

        {/* The recording full width, with the claim over its foot. A band
            rather than a tile: it is the evidence for the heading, and the
            steps under it are the explanation. */}
        <div className="ag-band mt-14">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            className="ag-video"
            src={withBasePath("/media/capabilities/agents.mp4")}
            title="An agent run in ImagineArt"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
          <span className="ag-scrim" aria-hidden />
          <div className="ag-over">
            <p className="ag-claim">One brief, a whole campaign back.</p>
            <div className="ag-actions">
              <ButtonLink href={START_HREF} variant="white" size="lg" target="_blank" rel="noopener noreferrer">
                Put an agent to work
              </ButtonLink>
              <ButtonLink href={DEMO_HREF} variant="ghost" size="lg" target="_blank" rel="noopener noreferrer" className="ag-ghost">
                Book a demo
              </ButtonLink>
            </div>
          </div>
        </div>

        <ol className="ag-rail">
          {STEPS.map((s) => (
            <li key={s.n} className="ag-step">
              <span className="ag-n" aria-hidden>{s.n}</span>
              <h3 className="ag-title">{s.title}</h3>
              <p className="ag-body">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <style>{`
        .ag-band {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          border-radius: var(--radius-6);
          /* The same hairline the studio banners carry, and fixed white for
             the same reason: this is a dark surface in either theme. */
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: var(--ground);
          aspect-ratio: 21 / 9;
          min-height: 340px;
          color: #fff;
        }
        .ag-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        /* Rises from the foot, where the claim and the buttons are, and
           leaves the top two thirds of the recording alone. */
        .ag-scrim {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            to top,
            rgba(6, 7, 9, 0.9) 0%,
            rgba(6, 7, 9, 0.66) 26%,
            rgba(6, 7, 9, 0.2) 52%,
            transparent 74%
          );
        }
        .ag-over {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          padding: clamp(22px, 3vw, 40px);
        }
        .ag-claim {
          font-size: clamp(22px, 2.4vw, 34px);
          line-height: 1.2;
          font-weight: 500;
          letter-spacing: -0.02em;
          max-width: 18ch;
        }
        .ag-actions { display: flex; flex-wrap: wrap; gap: 10px; }
        /* The ghost variant takes the page's ink, which is wrong on footage. */
        .ag-ghost {
          color: #fff;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.34);
        }
        .ag-ghost:hover { box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.6); }

        /* Three steps as a rail, not a list: equal columns with a hairline
           between them, and the number as a large quiet mark rather than a
           bullet. */
        .ag-rail {
          list-style: none;
          margin-top: clamp(28px, 3.5vw, 48px);
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(20px, 3vw, 48px);
        }
        .ag-step { position: relative; padding-top: 22px; border-top: 1px solid var(--line-strong); }
        .ag-n {
          display: block;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
        }
        .ag-title {
          margin-top: 14px;
          font-size: clamp(18px, 1.5vw, 22px);
          line-height: 1.25;
          font-weight: 500;
          letter-spacing: -0.015em;
          color: var(--ink-heading);
        }
        .ag-body {
          margin-top: 8px;
          font-size: 15px;
          line-height: 1.6;
          color: var(--ink-2);
          max-width: 34ch;
        }

        @media (max-width: 900px) {
          .ag-band { aspect-ratio: 4 / 3; }
          .ag-over { align-items: flex-start; flex-direction: column; }
          .ag-rail { grid-template-columns: minmax(0, 1fr); gap: 0; }
          .ag-step { padding: 20px 0; }
          .ag-step + .ag-step { border-top: 1px solid var(--line); }
          .ag-body { max-width: none; }
        }
      `}</style>
    </section>
  );
}
