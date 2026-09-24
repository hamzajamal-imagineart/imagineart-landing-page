import { BlurHeading } from "@/components/BlurHeading";
import { withBasePath } from "@/lib/assets";

/**
 * Reviews, as a bento of five (Hamza, 24 Sep, to a reference): three columns,
 * a tall featured card in the middle with footage fading into its copy, and a
 * short and a tall card either side, dark and light alternating so the two
 * outer columns mirror each other.
 *
 * Reviews are real, pulled from the public Trustpilot profile for
 * www.imagine.art on 28 Aug 2026, filtered to five stars. Attributed to the
 * reviewer's own display name and Trustpilot, because that is all the source
 * gives — so the avatar is a monogram, not a photograph, and the line under
 * the name is the source, not a job title. Obvious typos corrected, nothing
 * else changed.
 *
 * The reference's featured card carries two stats ("32% lead generation").
 * There are no real figures to put there, so that row is left out rather
 * than invented; `stats` on a review renders it when there are.
 *
 * The profile's overall score is 3.9, not 5. Showing only five-star reviews is
 * a selected view, so this section makes no aggregate rating claim.
 */
type Review = {
  stars: number;
  quote: string;
  name: string;
  stats?: { value: string; label: string }[];
};

const src = "via Trustpilot";

/** Five, in the order the grid places them: column one top and bottom, the
    featured card, column three top and bottom. */
const [A, B, FEATURED, C, D]: Review[] = [
  { stars: 5, quote: "It's the perfect portal for everything I need in AI. Easy to add credits. Quick and responsive.", name: "Aubrey Kurlansky" },
  { stars: 5, quote: "I love this platform. Very easy to navigate through whatever you need to create, and the pricing is very reasonable.", name: "Robyn Delay" },
  { stars: 5, quote: "I tried multiple tools to create videos but only ImagineArt was able to give me crisp videos as per the prompt.", name: "Uzair Khan" },
  { stars: 5, quote: "ImagineArt was very helpful to me. Their support was extremely responsive to what I needed.", name: "Heidi Anderson" },
  { stars: 5, quote: "I'm really impressed with the quality. It works very well and completely met my expectations.", name: "Ali Haider" },
];

/** A clip the product made, behind the review that is about its video. */
const FEATURED_CLIP = "/media/hero/modes/video/2-fashion.mp4";

const initials = (name: string) =>
  name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

function Stars({ n }: { n: number }) {
  return (
    <span className="rv-stars" role="img" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, s) => (
        <svg key={s} viewBox="0 0 24 24" className={s < n ? "rv-star-on" : "rv-star-off"} aria-hidden>
          <path d="M12 2.6l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.7 6.1 20.8l1.2-6.6L2.5 9.6l6.6-.9L12 2.6z" />
        </svg>
      ))}
    </span>
  );
}

function Person({ name }: { name: string }) {
  return (
    <div className="rv-person">
      <span className="rv-avatar" aria-hidden>{initials(name)}</span>
      <span>
        <span className="rv-name">{name}</span>
        <span className="rv-src">{src}</span>
      </span>
    </div>
  );
}

function Card({ r, tone }: { r: Review; tone: "dark" | "light" }) {
  return (
    <figure className={`rv-card rv-${tone}`}>
      <Stars n={r.stars} />
      <blockquote className="rv-quote">&ldquo;{r.quote}&rdquo;</blockquote>
      <figcaption><Person name={r.name} /></figcaption>
    </figure>
  );
}

export function ReviewsSection() {
  return (
    <section id="reviews" className="relative border-t border-[color:var(--line)] py-24 md:py-32">
      <div className="container-page relative z-10">
        <div className="max-w-[640px]">
          <BlurHeading className="h2" lead="Reviews" />
          <p className="lede mt-5">From solo creators to studios, in their own words.</p>
        </div>

        <div className="rv-grid mt-12">
          <div className="rv-col rv-col-a">
            <Card r={A} tone="dark" />
            <Card r={B} tone="light" />
          </div>

          <figure className="rv-card rv-featured">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              className="rv-media"
              src={withBasePath(FEATURED_CLIP)}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
            />
            <span className="rv-scrim" aria-hidden />
            <div className="rv-featured-copy">
              <Stars n={FEATURED.stars} />
              <blockquote className="rv-quote">&ldquo;{FEATURED.quote}&rdquo;</blockquote>
              {FEATURED.stats && (
                <dl className="rv-stats">
                  {FEATURED.stats.map((s) => (
                    <div key={s.label}>
                      <dt>{s.value}</dt>
                      <dd>{s.label}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <figcaption><Person name={FEATURED.name} /></figcaption>
            </div>
          </figure>

          <div className="rv-col rv-col-c">
            <Card r={C} tone="light" />
            <Card r={D} tone="dark" />
          </div>
        </div>
      </div>

      <style>{`
        /* Three columns; the outer two split short over tall and tall over
           short, so the seams sit at different heights either side of the
           featured card, as in the reference. */
        .rv-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr) minmax(0, 1fr);
          gap: 14px;
          min-height: clamp(520px, 44vw, 620px);
        }
        .rv-col { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
        .rv-col-a > :first-child, .rv-col-c > :last-child { flex: 1 1 0; }
        .rv-col-a > :last-child, .rv-col-c > :first-child { flex: 1.3 1 0; }

        .rv-card {
          position: relative;
          display: flex;
          flex-direction: column;
          margin: 0;
          padding: clamp(20px, 1.9vw, 28px);
          border-radius: var(--radius-4);
          min-width: 0;
        }
        /* Two shades of dark, not dark and white (Hamza, 24 Sep): the page
           ships dark and a white card read as a hole in it. The alternation
           stays, as a lift of one step rather than a flip. */
        .rv-dark {
          background: #141416;
          color: #fff;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
          --rv-2: rgba(255, 255, 255, 0.78);
          --rv-3: rgba(255, 255, 255, 0.55);
          --rv-avatar: rgba(255, 255, 255, 0.08);
          --rv-star-off: rgba(255, 255, 255, 0.18);
        }
        .rv-light {
          background: #232327;
          color: #fff;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
          --rv-2: rgba(255, 255, 255, 0.82);
          --rv-3: rgba(255, 255, 255, 0.58);
          --rv-avatar: rgba(255, 255, 255, 0.1);
          --rv-star-off: rgba(255, 255, 255, 0.2);
        }

        .rv-stars { display: inline-flex; gap: 3px; }
        .rv-stars svg { width: 15px; height: 15px; display: block; }
        .rv-star-on { fill: #f06a3c; }
        .rv-star-off { fill: var(--rv-star-off); }

        .rv-quote {
          margin: 16px 0 0;
          font-size: 15px;
          line-height: 1.6;
          color: var(--rv-2);
          max-width: 42ch;
        }

        /* The person sits at the card's foot, whatever the quote's length. */
        .rv-card figcaption { margin-top: auto; padding-top: 24px; }
        .rv-person { display: flex; align-items: center; gap: 12px; }
        .rv-avatar {
          width: 38px; height: 38px;
          flex: 0 0 auto;
          display: grid; place-items: center;
          border-radius: 8px;
          background: var(--rv-avatar);
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .rv-name { display: block; font-size: 14.5px; font-weight: 500; letter-spacing: -0.01em; }
        .rv-src { display: block; margin-top: 2px; font-size: 12.5px; color: var(--rv-3); }

        /* Featured: footage over the top, fading down into the copy. */
        .rv-featured {
          overflow: hidden;
          justify-content: flex-end;
          padding: 0;
          background: #0e0e10;
          color: #fff;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
          --rv-2: rgba(255, 255, 255, 0.84);
          --rv-3: rgba(255, 255, 255, 0.58);
          --rv-avatar: rgba(255, 255, 255, 0.14);
          --rv-star-off: rgba(255, 255, 255, 0.24);
        }
        .rv-media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
        .rv-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(14, 14, 16, 0) 0%,
            rgba(14, 14, 16, 0.2) 30%,
            rgba(14, 14, 16, 0.86) 58%,
            #0e0e10 78%
          );
        }
        .rv-featured-copy {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: clamp(20px, 1.9vw, 28px);
        }
        .rv-featured figcaption { margin-top: 0; padding-top: 24px; }
        .rv-stats {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin: 22px 0 0;
        }
        .rv-stats > div { padding-bottom: 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.14); }
        .rv-stats dt { font-size: 28px; font-weight: 500; letter-spacing: -0.02em; }
        .rv-stats dd { margin: 4px 0 0; font-size: 13px; color: var(--rv-3); }

        @media (max-width: 1000px) {
          /* Two columns: the featured card across the top, the four under it. */
          .rv-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); min-height: 0; }
          .rv-featured { grid-column: 1 / -1; grid-row: 1; min-height: 460px; }
          .rv-col > * { flex: 0 0 auto !important; min-height: 220px; }
        }
        @media (max-width: 640px) {
          .rv-grid { grid-template-columns: minmax(0, 1fr); }
          .rv-featured { min-height: 440px; }
          .rv-col > * { min-height: 0; }
        }
      `}</style>
    </section>
  );
}
