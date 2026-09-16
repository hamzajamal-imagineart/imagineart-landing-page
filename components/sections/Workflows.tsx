import { withBasePath } from "@/lib/assets";
import { MarkCluster } from "@/components/MarkCluster";

/**
 * Workflows as a bento. Five tiles on a three-column grid, the same spans
 * the Enterprise page's Capabilities use: row one is [2, 1], row two is
 * [1, 1, 1]. Node Canvas takes the wide tile because the other four hang
 * off it. Replaces the separate Workflows, Connectors and Plugins sections
 * (Hamza, 16 Sep).
 *
 * Tiles are copy at the top and media pinned to the foot. Connectors and
 * Plugins show their marks as a MarkCluster (the Enterprise Integrations tile
 * with its proximity hover) rather than per-item cards.
 */
const CONNECTORS = ["googledrive", "dropbox", "pinterest", "facebook", "instagram", "linkedin", "googlesheets"];
const PLUGINS = ["adobepremierepro", "adobephotoshop", "adobeaftereffects", "framer", "figma", "shopify"];

export function Workflows() {
  return (
    <section id="workflows" className="relative border-t border-black/[0.08] py-24 md:py-32">
      <div className="container-page">
        <div className="mx-auto max-w-[680px] text-center">
          <h2 className="h2">Workflows</h2>
          <p className="lede mx-auto mt-5">Build the pipeline once. Connect it, schedule it, and see what worked.</p>
        </div>

        <div className="wf-bento mt-14">
          <article className="wf-tile wf-wide">
            <h3 className="wf-title">Node canvas.</h3>
            <p className="wf-body">Chain models, tools and connectors into one pipeline.</p>
            <div className="wf-media">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video src={withBasePath("/media/pillars/workflows.mp4")} autoPlay muted loop playsInline preload="auto" aria-hidden />
            </div>
          </article>

          <article className="wf-tile">
            <h3 className="wf-title">Scheduling.</h3>
            <p className="wf-body">Run any workflow on a cadence, delivered on time.</p>
            <div className="wf-media">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video src={withBasePath("/media/capabilities/agents.mp4")} autoPlay muted loop playsInline preload="metadata" aria-hidden />
            </div>
          </article>

          <article className="wf-tile">
            <h3 className="wf-title">Creative Analyser.</h3>
            <p className="wf-body">See what performs, and what to change next.</p>
            <div className="wf-media">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video src={withBasePath("/media/workflows/creative-analyser.mp4")} autoPlay muted loop playsInline preload="metadata" aria-hidden />
            </div>
          </article>

          <article className="wf-tile">
            <h3 className="wf-title">Connectors.</h3>
            <p className="wf-body">Bring assets in, publish results out.</p>
            <div className="wf-cluster">
              <MarkCluster dir="connectors" marks={CONNECTORS} label="Google Drive, Dropbox, Pinterest, Facebook, Instagram, LinkedIn and Google Sheets" />
            </div>
          </article>

          <article className="wf-tile">
            <h3 className="wf-title">Plugins.</h3>
            <p className="wf-body">ImagineArt inside the apps you already use.</p>
            <div className="wf-cluster">
              <MarkCluster dir="plugins" marks={PLUGINS} label="Premiere Pro, Photoshop, After Effects, Framer, Figma and Shopify" />
            </div>
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
          display: flex;
          flex-direction: column;
          padding: clamp(22px, 2.4vw, 32px);
          border-radius: 24px;
          background: var(--panel-2);
          border: 1px solid var(--line);
          min-width: 0;
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
          border-radius: 14px;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }


        .wf-cluster { margin-top: auto; padding-top: 22px; flex: 1; min-height: 200px; display: flex; }

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
