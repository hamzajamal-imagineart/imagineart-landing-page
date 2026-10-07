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
 * each with a title and a line over the image's foot. **Images generated in
 * ImagineArt for this section** (Hamza, 6 Oct; Nano Banana Pro at 2K, the
 * ImagineArt (Official) workspace), one per card from its own line, saved to
 * media/outcomes/ as JPEG: three 3:4 at 1100px wide, the Filmmaking card 21:9
 * at 2400px. They replaced the frame's own images, which were Magnific's.
 *
 * The scrim is heavier than the frame's 25%: white type over a photograph
 * needs a floor under it, not a tint.
 *
 * Studio marks: the cards carried studio wordmarks top-left until 7 Oct
 * (Hamza: removed). A card can still take an optional `logo`, which brings
 * its own light scrim at the top.
 */
type Logo = { src: string; alt: string; h: number };
const CARDS: { title: string; body: string; image: string; logo?: Logo }[] = [
  {
    title: "Advertising",
    body: "Brief to final asset. No vendor chain, no waiting. Just the work.",
    image: "/media/outcomes/advertising.jpg",
  },
  {
    title: "Product shots",
    body: "AI-powered photoshoots. No studio. No crew. No scheduling.",
    image: "/media/outcomes/product.jpg",
  },
  { title: "Brand campaigns", body: "On-brand visuals, video, and audio at any scale, any format.", image: "/media/outcomes/brand.jpg" },
];
const WIDE = {
  title: "Filmmaking",
  body: "Characters, storyboards, and concepts to explore. Cinematic tools made for the final frame.",
  image: "/media/outcomes/film.jpg",
  /* Footage behind the card (Hamza, 7 Oct): the Film Studio clip, streamed
     from the same CDN the old studio reel used, with the still as poster. */
  video: "https://imagine.animagic.art/imagine-one/film-studio/video/27.mp4",
};

function Card({ title, body, image, video, logo, wide }: { title: string; body: string; image: string; video?: string; logo?: Logo; wide?: boolean }) {
  return (
    <div className={`oc-card ${wide ? "oc-wide" : ""}`}>
      {video ? (
        <video className="oc-media" src={withBasePath(video)} poster={withBasePath(image)} autoPlay muted loop playsInline preload="metadata" aria-hidden />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="oc-media" src={withBasePath(image)} alt="" loading="lazy" />
      )}
      <span className={`oc-scrim ${logo ? "oc-scrim-top" : ""}`} aria-hidden />
      {logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="oc-logo" src={withBasePath(logo.src)} alt={logo.alt} style={{ height: logo.h }} />
      )}
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
          border-radius: var(--radius-2);
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
          border-radius: var(--radius-3);
          height: clamp(420px, 37vw, 526px);
          background: var(--media-ground);
          isolation: isolate;
        }
        .oc-wide { grid-column: 1 / -1; height: clamp(300px, 28vw, 405px); }
        .oc-media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; z-index: -2; }
        /* A floor under the type, not the frame's 25% tint: white over live
           footage needs it. */
        .oc-scrim {
          position: absolute;
          inset: 0;
          z-index: -1;
          background: linear-gradient(to top, var(--scrim-1) 0%, var(--scrim-2) 30%, rgba(0, 0, 0, 0) 60%);
        }
        /* A light floor at the top too, only on cards that carry a mark. */
        .oc-scrim-top {
          background:
            linear-gradient(to bottom, var(--scrim-3) 0%, rgba(0, 0, 0, 0) 26%),
            linear-gradient(to top, var(--scrim-1) 0%, var(--scrim-2) 30%, rgba(0, 0, 0, 0) 60%);
        }
        .oc-logo { position: absolute; top: 24px; left: 24px; width: auto; display: block; filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25)); }
        .oc-copy { position: absolute; left: 24px; right: 24px; bottom: 24px; color: var(--on-media); }
        .oc-wide .oc-copy { right: auto; max-width: 512px; }
        .oc-title { font-size: 24px; line-height: 1.3; font-weight: 600; letter-spacing: -0.01em; }
        .oc-body { margin-top: 8px; font-size: 16px; line-height: 1.6; color: var(--on-media-2); }

        @media (max-width: 900px) {
          .oc-grid { grid-template-columns: minmax(0, 1fr); }
          .oc-card { height: 440px; }
          .oc-wide { height: 360px; }
        }
      `}</style>
    </section>
  );
}
