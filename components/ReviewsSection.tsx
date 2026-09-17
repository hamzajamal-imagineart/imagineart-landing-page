import { BlurHeading } from "@/components/BlurHeading";


/**
 * Reviews: a summary column on the left that sticks while a stacked column of
 * reviews scrolls past it on the right.
 *
 * Reviews are real, pulled from the public Trustpilot profile for
 * www.imagine.art on 28 Aug 2026, filtered to five stars. Attributed to the
 * reviewer's own display name and Trustpilot, because that is all the source
 * gives. Obvious typos corrected, nothing else changed.
 *
 * The profile's overall score is 3.9, not 5. Showing only five-star reviews is
 * a selected view, so this section makes no aggregate rating claim.
 */
type Review = { stars: number; quote: string; source: string };

const REVIEWS: Review[] = [
  { stars: 5, quote: "I tried multiple tools to create videos but only ImagineArt was able to give me crisp videos as per the prompt.", source: "Uzair Khan, via Trustpilot" },
  { stars: 5, quote: "I love this platform. Very easy to navigate through whatever you need to create, and the pricing is very reasonable.", source: "Robyn Delay, via Trustpilot" },
  { stars: 5, quote: "ImagineArt was very helpful to me. Their support was extremely responsive to what I needed.", source: "Heidi Anderson, via Trustpilot" },
  { stars: 5, quote: "It's the perfect portal for everything I need in AI. Easy to add credits. Quick and responsive.", source: "Aubrey Kurlansky, via Trustpilot" },
  { stars: 5, quote: "Easy to generate. Everything you need is here, and one clip and the task is completed.", source: "Event House, via Trustpilot" },
  { stars: 5, quote: "I'm really impressed with the quality. It works very well and completely met my expectations.", source: "Ali Haider, via Trustpilot" },
  { stars: 5, quote: "Love it. It's my go-to re-imaging tool.", source: "Karen Golding, via Trustpilot" },
  { stars: 5, quote: "Excellent results every time. Just loved it.", source: "Verified reviewer, via Trustpilot" },
  { stars: 5, quote: "Very nice work on this project, and the art is amazing.", source: "Giwrgos Avdiu, via Trustpilot" },
  { stars: 5, quote: "A great and comprehensive application.", source: "Bud Brure, via Trustpilot" },
];

export function ReviewsSection() {
  return (
    <section id="reviews" className="relative border-t border-[color:var(--line)] py-24 md:py-32">
      <div className="container-page relative z-10">
        <div className="rv-split">
          <div className="rv-summary">
            <BlurHeading className="h2" lead="Reviews" />
            <p className="lede mt-5" style={{ maxWidth: "36ch" }}>
              From solo creators to studios, in their own words.
            </p>
          </div>

          <div className="rv-viewport">
            <ul className="rv-track">
              {[...REVIEWS, ...REVIEWS].map((r, i) => (
                <li key={i} className="rv-card" aria-hidden={i >= REVIEWS.length}>
                  <span className="rv-stars" aria-label={`${r.stars} out of 5`}>
                    {Array.from({ length: 5 }).map((_, s) => (
                      <IconStar key={s} on={s < r.stars} />
                    ))}
                  </span>
                  <p className="rv-quote">{r.quote}</p>
                  <p className="rv-source">{r.source}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .rv-split {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: clamp(32px, 6vw, 88px);
          align-items: start;
        }
        .rv-summary { position: sticky; top: 120px; }

        .rv-viewport {
          position: relative;
          height: clamp(420px, 62vh, 620px);
          overflow: hidden;
          -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 12%, #000 88%, transparent 100%);
          mask-image: linear-gradient(to bottom, transparent 0, #000 12%, #000 88%, transparent 100%);
        }
        .rv-track {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
          animation: rv-scroll 38s linear infinite;
          will-change: transform;
        }
        .rv-viewport:hover .rv-track { animation-play-state: paused; }

        @keyframes rv-scroll {
          from { transform: translateY(0); }
          to   { transform: translateY(calc(-50% - 7px)); }
        }

        @media (prefers-reduced-motion: reduce) {
          .rv-track { animation: none; }
          .rv-viewport { height: auto; overflow: visible; -webkit-mask-image: none; mask-image: none; }
        }
        .rv-card {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: var(--radius-4);
          padding: 22px 24px;
        }
        .rv-stars { display: inline-flex; gap: 3px; }
        .rv-stars svg { width: 14px; height: 14px; }
        .rv-quote { margin-top: 14px; font-size: 15.5px; line-height: 1.6; color: var(--ink-2); }
        .rv-source {
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid var(--line);
          font-size: 13.5px;
          color: var(--ink-3);
        }

        @media (max-width: 900px) {
          .rv-split { grid-template-columns: 1fr; gap: 32px; }
          .rv-summary { position: static; }
        }
      `}</style>
    </section>
  );
}

/* Trustpilot's star is the one third-party mark here, so it keeps its colour. */
function IconStar({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={on ? "#F5A524" : "rgba(0,0,0,0.14)"} aria-hidden>
      <path d="M12 2.6l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.7 6.1 20.8l1.2-6.6L2.5 9.6l6.6-.9L12 2.6z" />
    </svg>
  );
}
