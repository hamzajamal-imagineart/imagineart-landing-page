import { withBasePath } from "@/lib/assets";
import { APP_CATEGORY, appsCategoryHref } from "@/lib/links";
import { BlurHeading } from "@/components/BlurHeading";

/**
 * The creative tools, as one labelled rail per medium.
 *
 * Image, Video and Music and Audio each get a row: the medium on the left, a
 * "See all" into that category of the app gallery on the right, and a
 * horizontal rail of the tools underneath, clipped to the page grid. It
 * replaces the three-column lineup, which could show three tools where the
 * product has dozens.
 *
 * Cards are thumbnail-over-copy rather than the clip filling the card: the
 * rails sit directly on the page wash with no panel around them, and a row of
 * full-bleed clips read as a band of video rather than a set of tools.
 *
 * ASSETS ARE PLACEHOLDERS. Every thumbnail below is a clip already on disk,
 * borrowed from another section and picked only for being the nearest thing
 * to the tool it sits under; the audio row in particular has no footage of
 * its own. Swap the `video` paths as the real ones arrive. Card titles and
 * bodies are written from the tool names and are draft copy (HANDOFF.md §5).
 *
 * Card links point at the row's category page rather than at per-app URLs,
 * which are not confirmed. Give each card its own `href` once they are.
 */
type Tool = { title: string; body: string; video: string };
type Row = { id: string; label: string; seeAll: string; tools: Tool[] };

const ROWS: Row[] = [
  {
    id: "image",
    label: "Image",
    seeAll: appsCategoryHref(APP_CATEGORY.image),
    tools: [
      { title: "Inpaint", body: "Change one part of the image and keep the rest exactly as it was.", video: "/media/capabilities/inpaint.mp4" },
      { title: "Image Upscaler", body: "Sharper and larger, ready for print at full resolution.", video: "/media/capabilities/upscale.mp4" },
      { title: "Sketch to Render", body: "Take a line drawing through to a finished render in one step.", video: "/media/capabilities/sketch-to-render.mp4" },
      { title: "Variate", body: "Explore a direction without losing the frame you started from.", video: "/media/capabilities/variate.mp4" },
      { title: "Outfit Try-on", body: "Dress a model in your garment from a single product photo.", video: "/media/capabilities/outfit-tryon.mp4" },
      { title: "Reframe Presets", body: "One asset, resized for every placement you need to fill.", video: "/media/capabilities/reframe-presets.mp4" },
      { title: "Product Studio", body: "Packshots and lifestyle sets without booking a shoot.", video: "/media/templates/product-studio.mp4" },
    ],
  },
  {
    id: "video",
    label: "Video",
    seeAll: appsCategoryHref(APP_CATEGORY.video),
    tools: [
      { title: "Video Extend", body: "Add seconds to the end of a shot without cutting away.", video: "/media/capabilities/video-extend.mp4" },
      { title: "Video Reframe", body: "Recut a landscape edit for vertical and square placements.", video: "/media/capabilities/video-reframe.mp4" },
      { title: "VFX Shots", body: "Effects work on a shot you already have, no plates needed.", video: "/media/capabilities/vfx.mp4" },
      { title: "Motion Graphics", body: "Type, shapes and transitions moving on your brand system.", video: "/media/use-cases/motion.mp4" },
      { title: "UGC Creator", body: "A creator who speaks your script, in any language you ship.", video: "/media/capabilities/ugc.mp4" },
      { title: "Character Sequence", body: "One character held steady across every shot in the cut.", video: "/media/use-cases/character.mp4" },
      { title: "Ad Campaign", body: "A full set of motion ads from one brief and one product.", video: "/media/templates/ad-campaign.mp4" },
    ],
  },
  {
    id: "music",
    label: "Music and Audio",
    seeAll: appsCategoryHref(APP_CATEGORY.music),
    tools: [
      { title: "Music Generator", body: "A track cut to length, in the style and tempo you name.", video: "/media/capabilities/music.mp4" },
      { title: "Voice and Lip Sync", body: "A read in any voice, matched to the mouth on screen.", video: "/media/capabilities/ugc.mp4" },
      { title: "Sound Effects", body: "Effects placed on cue against the picture you are cutting.", video: "/media/use-cases/film.mp4" },
      { title: "Score to Picture", body: "Music that follows the edit instead of fighting it.", video: "/media/use-cases/motion.mp4" },
    ],
  },
];

export function CreativeTools() {
  return (
    <section id="tools" className="relative border-t border-[color:var(--line)] py-24 md:py-32">
      <div className="container-page">
        {/* Wider than the page's usual 680px heading block: .h2 is nowrap
            above 880px and this is a multi-word heading. */}
        <div className="mx-auto max-w-[820px] text-center">
          <BlurHeading className="h2" lead="Creative tools" muted="for every medium" />
          <p className="lede mx-auto mt-5">
            Image, video, music and audio in one place, on the latest models from every
            major lab, with the editing tools that take a first result to a finished one.
          </p>
        </div>

        <div className="ct-rows mt-16">
          {ROWS.map((row, r) => (
            <section key={row.id} className="ct-row" aria-labelledby={`ct-${row.id}`}>
              <header className="ct-head">
                <h3 id={`ct-${row.id}`} className="ct-label">{row.label}</h3>
                <a className="ct-all" href={row.seeAll} target="_blank" rel="noopener noreferrer">
                  See all
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </header>

              <div className="ct-rail">
                {row.tools.map((t, i) => (
                  <a
                    key={t.title}
                    className="ct-card"
                    href={row.seeAll}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="ct-thumb">
                      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                      <video
                        src={withBasePath(t.video)}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload={r === 0 && i < 3 ? "auto" : "none"}
                        aria-hidden
                      />
                    </div>
                    <h4 className="ct-name">{t.title}</h4>
                    <p className="ct-body">{t.body}</p>
                    <span className="ct-go" aria-hidden>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <style>{`
        .ct-rows { display: flex; flex-direction: column; gap: 48px; }

        .ct-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }
        .ct-label {
          font-size: 21px;
          font-weight: 500;
          letter-spacing: -0.015em;
          color: var(--ink-heading);
        }
        .ct-all {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink-3);
          white-space: nowrap;
          transition: color 200ms ease;
        }
        .ct-all svg { flex: 0 0 auto; transition: transform 200ms ease; }
        .ct-all:hover { color: var(--ink); }
        .ct-all:hover svg { transform: translateX(2px); }

        /* The rail is the container, and cuts off at its edges: as a scroll
           container it clips its own overflow, so a card leaving the row
           disappears on the page grid rather than running out to the window. */
        .ct-rail {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding-block: 6px 14px;
          scrollbar-width: none;
        }
        .ct-rail::-webkit-scrollbar { display: none; }

        /* Card, not a clip: thumbnail, title, two lines, arrow. */
        .ct-card {
          position: relative;
          flex: 0 0 304px;
          width: 304px;
          display: flex;
          flex-direction: column;
          padding: 12px 12px 18px;
          border-radius: var(--radius-4);
          background: var(--panel);
          border: 1px solid var(--line);
          color: inherit;
          text-decoration: none;
          transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 320ms ease;
        }
        .ct-card:hover, .ct-card:focus-visible {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(16, 20, 30, 0.1);
        }

        .ct-thumb {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: var(--radius-3);
          overflow: hidden;
          background-color: var(--tile);
        }
        .ct-thumb video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }

        .ct-name {
          margin: 16px 5px 0;
          font-size: 16.5px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--ink);
        }
        /* Two lines, so every card in a rail is the same height whatever the
           copy runs to. */
        .ct-body {
          margin: 7px 5px 0;
          font-size: 14.5px;
          line-height: 1.5;
          color: var(--ink-3);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: calc(14.5px * 1.5 * 2);
          padding-right: 38px;
        }
        .ct-go {
          position: absolute;
          right: 14px;
          bottom: 14px;
          width: 28px; height: 28px;
          border-radius: 999px;
          display: grid; place-items: center;
          background: var(--ink-heading);
          color: #fff;
          transition: transform 200ms ease;
        }
        .ct-card:hover .ct-go { transform: scale(1.06); }

        @media (max-width: 560px) {
          .ct-card { flex-basis: 252px; width: 252px; }
          .ct-rows { gap: 40px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ct-card, .ct-go { transition: none; }
          .ct-card:hover, .ct-card:focus-visible { transform: none; }
        }
      `}</style>
    </section>
  );
}
