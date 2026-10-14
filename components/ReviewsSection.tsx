import { BlurHeading } from "@/components/BlurHeading";
import { withBasePath } from "@/lib/assets";

/**
 * Testimonials (Hamza, 14 Oct), in the words of the revamped homepage copy,
 * nothing added (the H2 is Hamza's: "How enterprise brands scale creative with ImagineArt", 14 Oct). Every panel is
 * its client's case-study image as the background (public/media/reviews,
 * from the Business page's case-study cards) under a dark scrim, text always
 * white: the Unilever feature (quote left, its three figures right with
 * "Read the case study"), then six quote cards, logo top left, quote and
 * attribution at the foot; each links to its case study.
 */
type Testimonial = {
  quote: string;
  /** What changed, under the quote (Framon only, so far). */
  result?: string;
  name: string;
  role?: string;
  slug: string;
  /** The client's mark (public/media/brand-logos, grey single-colour SVG) and its height. */
  logo?: string;
  logoH?: number;
};

const CASE = "https://www.imagine.art/business/case-studies";

/** Six, in the order the grid places them: column one top to bottom, then column three. */
const SIDE: Testimonial[] = [
  {
    quote: "Reduce time and costs: that\u2019s exactly what it delivers.",
    result: "Custom project turnaround went from a full day to a few hours, with no freelancers.",
    name: "Sales Manager",
    role: "Framon Group",
    slug: "framon", logo: "Framon", logoH: 22,
  },
  { quote: "The ROI and time savings strongly validated the subscription value.", name: "Buzz Lab", slug: "buzz-lab", logo: "Buzzlab", logoH: 22 },
  { quote: "We can now experiment, iterate, and launch premium visuals without waiting, or wasting budget.", name: "Mnsaj", slug: "mnsaj", logo: "mnsaj", logoH: 36 },
  {
    quote: "It\u2019s like having an extra pair of hands that skips the tedious searching and jumps straight to the creative work.",
    name: "7Routes",
    slug: "7routes", logo: "7Routes", logoH: 52,
  },
  { quote: "You cannot be model chasing at this stage of the AI development curve.", name: "Co-founder", role: "Noise2Signal", slug: "noise2signal" },
  {
    quote: "Instead of waiting for a designer to turn around every concept, we can quickly generate different styles, layouts, and campaign directions ourselves.",
    name: "Marketing team",
    role: "USA Home Improvement",
    slug: "usa-home-improvement", logo: "USAHomeImprovement", logoH: 30,
  },
];

const FEATURED: Testimonial = {
  quote:
    "ImagineArt changed how our division produces creative. In six weeks, three teams shipped 1,200 static assets and 300 video reels, with images 25x cheaper and 7x faster, and every one of them stayed on-brand across markets. Senior leadership now sends our highest-priority campaigns straight to the platform.",
  name: "Humza Mahfooz",
  role: "Unilever",
  slug: "unilever", logo: "Unilever", logoH: 64,
};

/** The Unilever stat strip, verbatim from the copy; the figure set large, the rest of its phrase under it. */
const STATS = [
  { value: "8x", label: "more output with the same team and budget" },
  { value: "25x", label: "lower image production cost" },
  { value: "1,200", label: "static assets and 300 video reels" },
];

/** A panel's background: the client's image under a scrim, the logo top left. */
function Backdrop({ t }: { t: Testimonial }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="rv-bg" src={withBasePath(`/media/reviews/${t.slug}.jpg`)} alt="" aria-hidden loading="lazy" />
      <span className="rv-scrim" aria-hidden />
    </>
  );
}

function Logo({ t }: { t: Testimonial }) {
  if (!t.logo) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="rv-logo" src={withBasePath(`/media/brand-logos/${t.logo}.svg`)} alt={t.role?.split(",").pop()?.trim() ?? t.name} style={{ height: t.logoH }} />
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Card({ t }: { t: Testimonial }) {
  return (
    <a className="rv-card" href={`${CASE}/${t.slug}`} target="_blank" rel="noopener noreferrer">
      <Backdrop t={t} />
      <figure className="rv-fig">
        <div className="rv-logo-row">
          <Logo t={t} />
          <Arrow className="rv-go" />
        </div>
        <span className="rv-qm" aria-hidden>&ldquo;</span>
        <blockquote className="rv-quote">{t.quote}</blockquote>
        {/* Who said it, then the result, revealed on hover or focus (Hamza, 14 Oct); always shown on touch. */}
        <div className="rv-reveal">
          <div className="rv-reveal-in">
            <figcaption className="rv-by">
              <span className="rv-name">{t.name}</span>
              {t.role && <span className="rv-role">{t.role}</span>}
            </figcaption>
            {t.result && <p className="rv-result">{t.result}</p>}
          </div>
        </div>
      </figure>
    </a>
  );
}

export function ReviewsSection() {
  return (
    <section id="reviews" className="relative border-t border-[color:var(--line)] py-24 md:py-32">
      <div className="container-page relative z-10">
        <div className="max-w-[720px]">
          <BlurHeading className="h2" lead="How enterprise brands" muted="scale creative with ImagineArt" lineBreak />
        </div>

        <div className="rv-feature mt-12">
          <Backdrop t={FEATURED} />
          <figure className="rv-feature-main">
            <Logo t={FEATURED} />
            <span className="rv-qm rv-qm-lg" aria-hidden>&ldquo;</span>
            <blockquote className="rv-feature-quote">{FEATURED.quote}</blockquote>
            <figcaption className="rv-by">
              <span className="rv-name">{FEATURED.name}</span>
              <span className="rv-role">{FEATURED.role}</span>
            </figcaption>
          </figure>
          <div className="rv-feature-side">
            <dl className="rv-stats">
              {STATS.map((x) => (
                <div key={x.value}>
                  <dt>{x.value}</dt>
                  <dd>{x.label}</dd>
                </div>
              ))}
            </dl>
            <a className="rv-case" href={`${CASE}/${FEATURED.slug}`} target="_blank" rel="noopener noreferrer">
              Read the case study
              <Arrow />
            </a>
          </div>
        </div>

        <div className="rv-grid mt-4">
          {SIDE.map((t) => <Card key={t.slug} t={t} />)}
        </div>
      </div>

      <style>{`
        /* Panels: the image fills, a scrim holds the text, a 1px edge drawn above both. */
        .rv-feature, .rv-card {
          position: relative; isolation: isolate; overflow: hidden;
          border-radius: var(--radius-4); background: #0e0e10; color: #fff;
        }
        .rv-feature::after, .rv-card::after {
          content: ""; position: absolute; inset: 0; z-index: 2; border-radius: inherit; pointer-events: none;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1); transition: box-shadow 0.25s;
        }
        .rv-bg { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
        .rv-scrim { position: absolute; inset: 0; z-index: -1; }
        .rv-logo { display: block; flex-shrink: 0; align-self: flex-start; width: auto; max-width: 190px; filter: brightness(0) invert(1); }
        .rv-name { display: block; font-size: var(--fs-sm); font-weight: 500; letter-spacing: -0.01em; color: #fff; }
        .rv-role { display: block; margin-top: 2px; font-size: var(--fs-sm); color: rgba(255, 255, 255, 0.66); }

        /* Unilever: quote left over the darkest part, figures right. */
        .rv-feature { display: grid; grid-template-columns: minmax(0, 1fr) clamp(240px, 26%, 320px); min-height: clamp(440px, 38vw, 540px); }
        .rv-feature .rv-bg { object-position: 62% 50%; }
        .rv-feature .rv-scrim { background: linear-gradient(90deg, rgba(8, 8, 10, 0.92) 0%, rgba(8, 8, 10, 0.78) 45%, rgba(8, 8, 10, 0.5) 75%, rgba(8, 8, 10, 0.7) 100%); }
        .rv-feature-main { margin: 0; display: flex; flex-direction: column; padding: clamp(28px, 3.6vw, 56px); }
        /* The opening quote as the typeface's own glyph, large and muted, set
           just above the first line and nudged left so its edge lines up
           with the text (14 Oct); it replaces the typed quotation marks. */
        .rv-qm {
          display: block; align-self: flex-start; height: 0.42em; margin: 24px 0 0 -0.06em;
          font-size: var(--fs-display-xl); line-height: 1; font-weight: 500; letter-spacing: 0;
          color: rgba(255, 255, 255, 0.35); user-select: none;
        }
        .rv-qm-lg { font-size: 112px; margin-top: 36px; }
        .rv-feature-quote {
          margin: 14px 0 0; max-width: 32em;
          font-size: clamp(var(--fs-xl), 2vw, var(--fs-h4)); line-height: 1.42; letter-spacing: -0.015em; font-weight: 400; color: #fff; text-wrap: pretty;
        }
        .rv-feature-main .rv-by { margin-top: auto; padding-top: 32px; }
        .rv-feature-side {
          display: flex; flex-direction: column; justify-content: space-between; gap: 28px;
          padding: clamp(28px, 3.6vw, 56px) clamp(24px, 2.6vw, 40px);
          border-left: 1px solid rgba(255, 255, 255, 0.14);
        }
        .rv-stats { margin: 0; display: flex; flex-direction: column; }
        .rv-stats > div { padding: 22px 0; border-top: 1px solid rgba(255, 255, 255, 0.14); }
        .rv-stats > div:first-child { padding-top: 0; border-top: 0; }
        .rv-stats dt { font-size: clamp(var(--fs-h2), 3.4vw, var(--fs-display-lg)); line-height: 1; font-weight: 500; letter-spacing: -0.035em; color: #fff; font-variant-numeric: tabular-nums; }
        .rv-stats dd { margin: 10px 0 0; font-size: var(--fs-sm); line-height: 1.45; color: rgba(255, 255, 255, 0.7); }
        .rv-case {
          align-self: flex-start; display: inline-flex; align-items: center; gap: 6px;
          font-size: var(--fs-sm); font-weight: 500; color: #fff; text-decoration: none;
          padding-bottom: 2px; border-bottom: 1px solid rgba(255, 255, 255, 0.4); transition: border-color 0.2s;
        }
        .rv-case:hover { border-bottom-color: #fff; }

        /* Six cards: logo top left, quote and attribution at the foot. */
        .rv-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        .rv-card { display: flex; min-height: clamp(380px, 31vw, 460px); text-decoration: none; }
        .rv-card .rv-scrim { background: linear-gradient(to top, rgba(8, 8, 10, 0.92) 0%, rgba(8, 8, 10, 0.72) 42%, rgba(8, 8, 10, 0.28) 72%, rgba(8, 8, 10, 0.45) 100%); }
        .rv-card:hover .rv-bg { transform: scale(1.04); }
        .rv-card:hover::after { box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.24); }
        .rv-card:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
        .rv-fig { display: flex; flex-direction: column; flex: 1; margin: 0; padding: clamp(22px, 2vw, 28px); }
        /* Logos top-aligned on one line at the card's inset, whatever their height; the arrow on the same line. */
        .rv-logo-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: auto; }
        .rv-go { flex-shrink: 0; margin-left: auto; color: rgba(255, 255, 255, 0.7); transition: color 0.2s, transform 0.25s cubic-bezier(0.22, 1, 0.36, 1); }
        .rv-card:hover .rv-go, .rv-card:focus-visible .rv-go { color: #fff; transform: translate(2px, -2px); }
        .rv-quote { margin: 10px 0 0; font-size: var(--fs-xl); line-height: 1.45; letter-spacing: -0.005em; color: #fff; text-wrap: pretty; }
        .rv-result { margin: 12px 0 0; font-size: var(--fs-sm); line-height: 1.5; color: rgba(255, 255, 255, 0.7); }
        .rv-card .rv-by { margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.16); }
        .rv-card .rv-result { margin-top: 10px; }
        /* Collapsed at rest where there is hover; opens on hover or keyboard focus. */
        @media (hover: hover) and (pointer: fine) {
          .rv-reveal { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease; }
          .rv-reveal-in { min-height: 0; overflow: hidden; }
          .rv-card:hover .rv-reveal, .rv-card:focus-visible .rv-reveal { grid-template-rows: 1fr; opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) { .rv-reveal { transition: none; } }

        @media (max-width: 1000px) {
          .rv-feature { grid-template-columns: minmax(0, 1fr); }
          .rv-feature .rv-scrim { background: linear-gradient(to top, rgba(8, 8, 10, 0.92) 0%, rgba(8, 8, 10, 0.8) 55%, rgba(8, 8, 10, 0.55) 100%); }
          .rv-feature-side { border-left: 0; border-top: 1px solid rgba(255, 255, 255, 0.14); }
          .rv-stats { flex-direction: row; gap: 24px; }
          .rv-stats > div, .rv-stats > div:first-child { flex: 1; padding: 0; border: 0; }
          .rv-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 640px) {
          .rv-stats { flex-direction: column; gap: 18px; }
          .rv-grid { grid-template-columns: minmax(0, 1fr); }
        }
        @media (prefers-reduced-motion: reduce) { .rv-bg, .rv-go { transition: none; } .rv-card:hover .rv-bg { transform: none; } }
      `}</style>
    </section>
  );
}
