import { withBasePath } from "@/lib/assets";
import { BlurHeading } from "@/components/BlurHeading";
import { SectionGuides } from "@/components/primitives/SectionGuides";
import { START_HREF } from "@/lib/links";

/**
 * Outcomes: "From product shot to viral phenomenon". Built from Figma
 * H-Drafts 644:4317 (Hamza, 6 Oct), above Industries.
 *
 * Layout and copy are the frame's: heading, one line, a white "Start
 * creating" action, three tall cards in a row and one wide card under them,
 * each with a title and a line over the media's foot. **The frame's images
 * are Magnific's own** (it is a Magnific page, one is their magazine cover),
 * so every card carries our footage instead — the use-case gallery's clips,
 * which were otherwise unused, so nothing repeats from Industries below.
 *
 * The scrim is heavier than the frame's 25%: white type over live footage
 * needs a floor under it, not a tint.
 */
const CARDS = [
  { title: "Advertising", body: "Brief to final asset. No vendor chain, no waiting. Just the work.", video: "/media/use-cases/advertising.mp4" },
  { title: "Product shots", body: "AI-powered photoshoots. No studio. No crew. No scheduling.", video: "/media/use-cases/product.mp4" },
  { title: "Brand campaigns", body: "On-brand visuals, video, and audio at any scale, any format.", video: "/media/use-cases/fashion.mp4" },
];
const WIDE = {
  title: "Filmmaking",
  body: "Characters, storyboards, and concepts to explore. Cinematic tools made for the final frame.",
  video: "/media/hero/modes/video/1-prompt.mp4",
};

function Card({ title, body, video, wide }: { title: string; body: string; video: string; wide?: boolean }) {
  return (
    <div className={`oc-card ${wide ? "oc-wide" : ""}`}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video className="oc-media" src={withBasePath(video)} autoPlay muted loop playsInline preload="metadata" aria-hidden />
      <span className="oc-scrim" aria-hidden />
      <div className="oc-copy">
        <h3 className="oc-title">{title}</h3>
        <p className="oc-body">{body}</p>
      </div>
    </div>
  );
}

export function Outcomes() {
  return (
    <section id="outcomes" className="relative border-t border-[color:var(--line)] py-24 md:py-32 lg:border-t-0">
      <SectionGuides edge="top" />
      <div className="container-page">
        <div className="max-w-[680px]">
          <BlurHeading className="h2" lead="From product shot to viral phenomenon" />
          <p className="lede mt-5">
            Global on-brand campaigns, product shots, and top-tier filmmaking. Everything a brand
            needs to show up at the highest level, in every format, every time.
          </p>
          <a href={START_HREF} className="oc-cta mt-7">
            Start creating
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="oc-grid">
          {CARDS.map((c) => <Card key={c.title} {...c} />)}
          <Card {...WIDE} wide />
        </div>
      </div>

      <style>{`
        .oc-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 50px;
          padding: 0 24px;
          border-radius: 8px;
          background: var(--ink-heading);
          color: var(--page-bg);
          font-size: 16px;
          font-weight: 500;
          transition: opacity 200ms ease;
        }
        .oc-cta:hover { opacity: 0.86; }
        .oc-cta:focus-visible { outline: 2px solid var(--ink-heading); outline-offset: 3px; }

        .oc-grid {
          margin-top: 56px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        .oc-card {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          height: clamp(420px, 37vw, 526px);
          background: #141416;
          isolation: isolate;
        }
        .oc-wide { grid-column: 1 / -1; height: clamp(300px, 28vw, 405px); }
        .oc-media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; z-index: -2; }
        .oc-wide .oc-media { object-position: center 30%; }
        /* A floor under the type, not the frame's 25% tint: white over live
           footage needs it. */
        .oc-scrim {
          position: absolute;
          inset: 0;
          z-index: -1;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.86) 0%, rgba(0, 0, 0, 0.52) 30%, rgba(0, 0, 0, 0) 60%);
        }
        .oc-copy { position: absolute; left: 24px; right: 24px; bottom: 24px; color: #fff; }
        .oc-wide .oc-copy { right: auto; max-width: 512px; }
        .oc-title { font-size: 24px; line-height: 1.3; font-weight: 600; letter-spacing: -0.01em; }
        .oc-body { margin-top: 8px; font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.78); }

        @media (max-width: 900px) {
          .oc-grid { grid-template-columns: minmax(0, 1fr); }
          .oc-card { height: 440px; }
          .oc-wide { height: 360px; }
        }
      `}</style>
    </section>
  );
}
