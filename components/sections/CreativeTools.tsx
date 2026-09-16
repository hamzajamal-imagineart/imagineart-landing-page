import { withBasePath } from "@/lib/assets";
import { CREATIVE_HREF, HOME } from "@/lib/links";

/**
 * Creative tools as a Z-fold: three rows, alternating visual and copy, one
 * clip each for image, video, and music and audio. The page's only Z-fold.
 */
type Row = { name: string; title: string; body: string; points: string[]; href: string; video: string };

const ROWS: Row[] = [
  {
    name: "Image",
    title: "Stills from any model.",
    body: "Generate, inpaint, upscale and vary, in one place.",
    points: ["50+ image models", "Inpaint and outpaint in place", "Upscale to print size"],
    href: CREATIVE_HREF,
    video: "/media/templates/product-studio.mp4",
  },
  {
    name: "Video",
    title: "Generate, extend, reframe.",
    body: "Text and image to video, across the latest models.",
    points: ["Text and image to video", "Extend a shot without a cut", "Reframe for every placement"],
    href: `${HOME}/video`,
    video: "/media/capabilities/vfx.mp4",
  },
  {
    name: "Music and Audio",
    title: "Sound to fit the cut.",
    body: "Music, voice and effects, made alongside the visuals.",
    points: ["Music in the style you name", "Voice with lip sync", "Sound effects on cue"],
    href: `${HOME}/audio-studio`,
    video: "/media/capabilities/music.mp4",
  },
];

export function CreativeTools() {
  return (
    <section id="tools" className="relative border-t border-black/[0.08] py-24 md:py-32">
      <div className="container-page">
        <div className="mx-auto max-w-[680px] text-center">
          <h2 className="h2">Creative Tools</h2>
          <p className="lede mx-auto mt-5">Image, video, music and audio, from any model.</p>
        </div>

        <div className="ct-fold mt-16">
          {ROWS.map((r, i) => (
            <div key={r.name} className={`ct-row ${i % 2 === 1 ? "ct-flip" : ""}`}>
              <div className="ct-visual">
                <div className="ct-frame">
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video src={withBasePath(r.video)} autoPlay muted loop playsInline preload={i === 0 ? "auto" : "metadata"} aria-hidden />
                </div>
              </div>
              <div className="ct-copy">
                <p className="ct-name">{r.name}</p>
                <h3 className="h3 mt-3">{r.title}</h3>
                <p className="lede mt-4">{r.body}</p>
                <ul className="ct-points mt-6">
                  {r.points.map((pt) => (
                    <li key={pt}>
                      <span className="ct-tick" aria-hidden>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
                <a href={r.href} target="_blank" rel="noopener noreferrer" className="ct-link mt-7">
                  Open {r.name}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M6 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ct-fold { display: flex; flex-direction: column; gap: clamp(56px, 7vw, 96px); }
        .ct-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 6vw, 96px);
          align-items: center;
        }
        .ct-flip .ct-visual { order: 2; }
        .ct-flip .ct-copy { order: 1; }

        .ct-visual { min-width: 0; }
        .ct-frame {
          position: relative;
          aspect-ratio: 16 / 10;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.1);
          background: var(--tile);
        }
        .ct-frame video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }

        .ct-name { font-size: 13px; font-weight: 500; letter-spacing: -0.005em; color: var(--ink-3); }
        .ct-copy .lede { max-width: 40ch; }
        .ct-points { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .ct-points li { display: flex; align-items: center; gap: 12px; font-size: 15.5px; color: var(--ink); letter-spacing: -0.01em; }
        .ct-tick {
          width: 22px; height: 22px;
          border-radius: 999px;
          display: grid; place-items: center;
          background: var(--panel-2);
          color: var(--ink);
          flex: 0 0 auto;
        }
        .ct-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 500;
          color: var(--ink);
          border-bottom: 1px solid var(--line-strong);
          padding-bottom: 2px;
          transition: border-color 0.2s ease, gap 0.2s ease;
        }
        .ct-link:hover { border-color: var(--ink); gap: 12px; }

        @media (max-width: 880px) {
          .ct-row { grid-template-columns: 1fr; gap: 24px; }
          .ct-flip .ct-visual, .ct-flip .ct-copy { order: 0; }
        }
      `}</style>
    </section>
  );
}
