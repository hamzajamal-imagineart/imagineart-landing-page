import { withBasePath } from "@/lib/assets";
import { MarkCluster } from "@/components/MarkCluster";
import { BlurHeading } from "@/components/BlurHeading";
import { pluginHref } from "@/lib/links";
import { SectionGuides } from "@/components/primitives/SectionGuides";

/**
 * Workflows as a bento. Five tiles on a three-column grid, the same spans
 * the Enterprise page's Capabilities use: row one is [2, 1], row two is
 * [1, 1, 1]. Node Canvas takes the wide tile because the other four hang
 * off it. Replaces the separate Workflows, Connectors and Plugins sections
 * (Hamza, 16 Sep).
 *
 * Tiles are copy at the top and media pinned to the foot. Connectors keeps
 * the MarkCluster (the Enterprise Integrations tile with its proximity
 * hover); Plugins is a named list, for the reason given above it.
 */
const CONNECTORS = ["googledrive", "dropbox", "pinterest", "facebook", "instagram", "linkedin", "googlesheets"];
/**
 * Plugins are named and linked, not scattered.
 *
 * A connector is a service you reach out to, so a drifting cloud of marks
 * suits it. A plugin is the opposite relationship: ImagineArt turning up
 * inside an application you already have open. A list of applications says
 * that; a second cloud of circles just looked like the Connectors tile again.
 *
 * Marks are the product's own, taken from the live plugins page's assets, so
 * these are the same icons the destination shows. They replace the lettered
 * tiles that stood in for Photoshop, Premiere and After Effects while there
 * was no Simple Icons entry for them.
 */
const PLUGINS = [
  { icon: "photoshop", name: "Photoshop", anchor: "photoshop" },
  { icon: "premiere", name: "Premiere Pro", anchor: "premiere" },
  { icon: "aftereffects", name: "After Effects", anchor: "aftereffects" },
  { icon: "figma", name: "Figma", anchor: "figma" },
  { icon: "framer", name: "Framer", anchor: "framer" },
  { icon: "shopify", name: "Shopify", anchor: "shopify" },
];

export function Workflows() {
  return (
    <section id="workflows" className="relative border-t border-[color:var(--line)] py-24 md:py-32 lg:border-t-0">
      <SectionGuides edge="top" />
      <div className="container-page">
        <div className="mx-auto max-w-[680px] text-center">
          <BlurHeading className="h2" lead="Workflows" />
          <p className="lede mx-auto mt-5">
            Build the pipeline once, connect your tools to it, schedule the runs, and see what worked.
          </p>
        </div>

        <div className="wf-bento mt-14">
          <article className="wf-tile wf-wide">
            <span className="wf-bg" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath("/media/workflows/bg/blue.jpg")} alt="" />
            </span>
            <h3 className="wf-title">Node canvas.</h3>
            <p className="wf-body">Chain models, tools and connectors into one pipeline.</p>
            <div className="wf-media">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video src={withBasePath("/media/pillars/workflows.mp4")} autoPlay muted loop playsInline preload="auto" aria-hidden />
            </div>
          </article>

          <article className="wf-tile">
            <span className="wf-bg" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath("/media/workflows/bg/amber.jpg")} alt="" />
            </span>
            <h3 className="wf-title">Brand Guidelines.</h3>
            <p className="wf-body">Every output on brand, without re-briefing it each time.</p>
            <div className="wf-media">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video src="https://www.imagine.art/business/media/brandkit/brand-kits.mp4" autoPlay muted loop playsInline preload="metadata" aria-hidden />
            </div>
          </article>

          <article className="wf-tile">
            <span className="wf-bg" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath("/media/workflows/bg/green.jpg")} alt="" />
            </span>
            <h3 className="wf-title">Creative Analyser.</h3>
            <p className="wf-body">See what performs, and what to change next.</p>
            <div className="wf-media">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video src={withBasePath("/media/workflows/creative-analyser.mp4")} autoPlay muted loop playsInline preload="metadata" aria-hidden />
            </div>
          </article>

          <article className="wf-tile">
            <span className="wf-bg" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath("/media/workflows/bg/gold.jpg")} alt="" />
            </span>
            <h3 className="wf-title">Connectors.</h3>
            <p className="wf-body">Bring assets in, publish results out.</p>
            <div className="wf-cluster">
              <MarkCluster dir="connectors" marks={CONNECTORS} label="Google Drive, Dropbox, Pinterest, Facebook, Instagram, LinkedIn and Google Sheets" />
            </div>
          </article>

          <article className="wf-tile">
            <span className="wf-bg" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath("/media/workflows/bg/violet.jpg")} alt="" />
            </span>
            <h3 className="wf-title">Plugins.</h3>
            <p className="wf-body">ImagineArt inside the apps you already use.</p>
            <ul className="wf-plugins">
              {PLUGINS.map((pg) => (
                <li key={pg.icon}>
                  <a className="wf-pg" href={pluginHref(pg.anchor)} target="_blank" rel="noopener noreferrer">
                    <span className="wf-pg-mark">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={withBasePath(`/media/plugins/${pg.icon}.svg`)} alt="" aria-hidden />
                    </span>
                    <span className="wf-pg-name">{pg.name}</span>
                    <span className="wf-pg-go" aria-hidden>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>

      <style>{`

        .wf-bento {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          grid-auto-rows: minmax(460px, auto);
          gap: 16px;
        }
        .wf-wide { grid-column: span 2; }
        .wf-tile {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: clamp(22px, 2.4vw, 32px);
          border-radius: var(--radius-5);
          background: var(--tile);
          min-width: 0;
        }
        /* The tile's ground, where it has one. The copy sits at the top of
           the tile and the media covers the foot, so this reads mainly behind
           the title and body, which is exactly where it has to be scrimmed:
           the gradients carry bright oranges and greens and the title is
           near-white. The scrim is heaviest at the top for that reason and
           lets the picture through lower down, where only the media sits. */
        .wf-bg {
          position: absolute;
          inset: 0;
          z-index: -1;
          overflow: hidden;
        }
        .wf-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .wf-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(rgba(10, 10, 12, 0.42), rgba(10, 10, 12, 0.42)),
            linear-gradient(
              to bottom,
              rgba(10, 10, 12, 0.66) 0%,
              rgba(10, 10, 12, 0.46) 34%,
              rgba(10, 10, 12, 0.3) 60%,
              rgba(10, 10, 12, 0.3) 100%
            );
        }
        .wf-title { font-size: clamp(20px, 1.8vw, 26px); line-height: 1.2; letter-spacing: -0.015em; color: var(--ink-heading); }
        .wf-body { margin-top: 10px; font-size: 15px; line-height: 1.6; color: var(--ink-2); max-width: 34ch; }
        .wf-wide .wf-body { max-width: 52ch; }

        .wf-media {
          position: relative;
          margin-top: auto;
          padding-top: 22px;
          flex: 1;
          min-height: 180px;
        }
        .wf-media video {
          position: absolute;
          inset: 22px 0 0 0;
          width: 100%;
          height: calc(100% - 22px);
          object-fit: cover;
          display: block;
          border-radius: var(--radius-3);
          border: 1px solid var(--line);
        }


        .wf-cluster { margin-top: auto; padding-top: 22px; flex: 1; min-height: 200px; display: flex; }

        /* A stack, deliberately the opposite shape to the Connectors cloud.
           Square mark tiles rather than the cluster's circles, so the two
           tiles do not read as the same component twice. */
        .wf-plugins {
          list-style: none;
          margin-top: auto;
          padding-top: 22px;
          flex: 1;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 2px;
        }
        .wf-pg {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 10px;
          border-radius: 12px;
          color: inherit;
          text-decoration: none;
          transition: background 240ms ease;
        }
        .wf-plugins li + li .wf-pg { box-shadow: inset 0 1px 0 var(--line); }
        .wf-pg:hover, .wf-pg:focus-visible { background: var(--hover-wash); box-shadow: none; }
        .wf-pg-mark {
          width: 32px; height: 32px;
          border-radius: 9px;
          flex: 0 0 auto;
          display: grid; place-items: center;
          background: var(--tile-2);
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
        }
        .wf-pg-mark img { width: 18px; height: 18px; display: block; object-fit: contain; }
        .wf-pg-name {
          font-size: 14.5px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--ink);
          min-width: 0;
        }
        /* Quiet until the row is hovered or focused: six arrows all shouting
           at once would out-weigh the names they sit beside. */
        .wf-pg-go {
          margin-left: auto;
          width: 28px; height: 28px;
          border-radius: 999px;
          flex: 0 0 auto;
          display: grid; place-items: center;
          background: var(--ink-heading);
          color: var(--page-bg);
          opacity: 0.28;
          transform: translateX(-2px);
          transition: opacity 240ms ease, transform 240ms ease;
        }
        .wf-pg:hover .wf-pg-go, .wf-pg:focus-visible .wf-pg-go {
          opacity: 1;
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .wf-pg, .wf-pg-go { transition: none; }
        }

        @media (max-width: 900px) {
          .wf-bento { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: minmax(380px, auto); }
          .wf-wide { grid-column: span 2; }
        }
        @media (max-width: 560px) {
          .wf-bento { grid-template-columns: 1fr; }
          .wf-wide { grid-column: span 1; }
        }
      `}</style>
    </section>
  );
}
