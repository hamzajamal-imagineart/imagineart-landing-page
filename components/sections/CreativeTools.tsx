import { withBasePath } from "@/lib/assets";
import { APP_CATEGORY, appsCategoryHref } from "@/lib/links";
import { BlurHeading } from "@/components/BlurHeading";

/**
 * The creative tools, as one labelled rail per medium.
 *
 * Image, Video and Music and Audio each get a row: the medium on the left, a
 * "See all" into that category of the app gallery on the right, and a
 * horizontal rail of the tools underneath. It replaces the three-column
 * lineup, which could show three tools where the product has dozens.
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
    <section id="tools" className="relative border-t border-black/[0.08] py-24 md:py-32">
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
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <video
                      className="ct-video"
                      src={withBasePath(t.video)}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload={r === 0 && i < 3 ? "auto" : "none"}
                      aria-hidden
                    />
                    <span className="ct-veil" aria-hidden />
                    <span className="ct-go" aria-hidden>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <div className="ct-meta">
                      <h4 className="ct-name">{t.title}</h4>
                      {/* 0fr to 1fr so the description opens to its own
                          height without a hard-coded max-height. */}
                      <div className="ct-reveal">
                        <p className="ct-body">{t.body}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <style>{`
        /* The rails deliberately run past the container on both sides. */
        #tools { overflow-x: hidden; overflow-x: clip; }

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
          font-size: 14px;
          font-weight: 500;
          color: var(--ink-3);
          white-space: nowrap;
          transition: color 200ms ease;
        }
        .ct-all:hover { color: var(--ink); }

        /* The rail runs to the edges of the window, not the container, so
           the row reads as continuing past the screen. The padding puts the
           first card back on the page grid. The section clips the overflow so
           the document never widens. */
        .ct-rail {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          margin-inline: calc(50% - 50vw);
          padding-inline: calc(50vw - 50%);
          padding-block: 6px 14px;
          scrollbar-width: none;
        }
        .ct-rail::-webkit-scrollbar { display: none; }

        /* The card is the clip. Title always showing, description on hover. */
        .ct-card {
          position: relative;
          flex: 0 0 282px;
          width: 282px;
          aspect-ratio: 3 / 4;
          display: block;
          overflow: hidden;
          border-radius: 20px;
          background-color: var(--tile);
          color: #fff;
          text-decoration: none;
          transition: transform 340ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 340ms ease;
        }
        .ct-card:hover, .ct-card:focus-visible {
          transform: translateY(-4px);
          box-shadow: 0 14px 34px rgba(16, 20, 30, 0.16);
        }

        .ct-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        /* Enough at rest to carry the title, deeper on hover to carry the
           description as well. */
        .ct-veil {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8, 11, 16, 0.82) 0%, rgba(8, 11, 16, 0.34) 32%, transparent 62%);
          transition: background 340ms ease;
        }
        .ct-card:hover .ct-veil, .ct-card:focus-visible .ct-veil {
          background: linear-gradient(to top, rgba(8, 11, 16, 0.9) 0%, rgba(8, 11, 16, 0.6) 46%, rgba(8, 11, 16, 0.18) 100%);
        }

        .ct-meta {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          padding: 18px;
        }
        .ct-name {
          font-size: 17px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: #fff;
        }
        /* max-height rather than the 0fr-to-1fr grid trick: a bare 0fr keeps
           an automatic min-content floor so it never closes, and minmax(0,1fr)
           closes but then has no minimum to open against in an auto-height
           container, so it never opens. max-height does both. The value only
           has to clear the tallest body, which is three lines. */
        .ct-reveal {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 340ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease;
        }
        .ct-card:hover .ct-reveal, .ct-card:focus-visible .ct-reveal {
          max-height: 140px;
          opacity: 1;
        }
        .ct-body {
          /* Padding, not margin: it has to be inside the clipped box or it
             props the closed row open. */
          padding-top: 7px;
          font-size: 14px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.82);
        }

        .ct-go {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 32px; height: 32px;
          border-radius: 999px;
          display: grid; place-items: center;
          background: rgba(255, 255, 255, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.26);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #fff;
          transition: background 240ms ease, transform 240ms ease;
        }
        .ct-card:hover .ct-go { background: rgba(255, 255, 255, 0.28); transform: scale(1.06); }

        /* No hover to reveal with, so the description simply stays open. */
        @media (hover: none) {
          .ct-reveal { max-height: 140px; opacity: 1; }
          .ct-veil { background: linear-gradient(to top, rgba(8, 11, 16, 0.9) 0%, rgba(8, 11, 16, 0.6) 46%, rgba(8, 11, 16, 0.18) 100%); }
        }

        @media (max-width: 560px) {
          .ct-card { flex-basis: 238px; width: 238px; }
          .ct-rows { gap: 40px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ct-card, .ct-go, .ct-veil, .ct-reveal { transition: none; }
          .ct-card:hover, .ct-card:focus-visible { transform: none; }
        }
      `}</style>
    </section>
  );
}
