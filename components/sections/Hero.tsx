"use client";

import { withBasePath } from "@/lib/assets";
import { DEMO_HREF, START_HREF } from "@/lib/links";
import { BlurHeading } from "@/components/BlurHeading";
import { SectionGlow, sectionGlowCss } from "@/components/primitives/SectionGlow";

/**
 * Hero, on the ElevenLabs pattern, pared down.
 *
 * Headline left, supporting copy right, two pill buttons, over a full-bleed
 * photograph. At the foot, a clipped rail of portrait cards.
 *
 * The framed panel that used to sit here, a Creative · Workflows · Computer
 * tab bar over one clip each, is gone: no tabs, no video, nothing to play or
 * pause. `hero/computer.mp4` and `hero/creative-suite-image.webm` are unused
 * as a result.
 */
/**
 * The showcase rail at the foot of the hero.
 *
 * A row of portrait cards, bottoms aligned and heights falling away from the
 * middle, so the row reads as an arch. Each card carries its name above it
 * and a small badge in its corner; the rail runs wider than the page and is
 * clipped, so the cards at either end are cut off and the row continues past
 * the edge of the screen.
 *
 * `k` is the card's share of the tallest height, which is what makes the
 * arch. It is written per entry rather than derived from the index so the
 * shape can be tuned by hand and does not have to stay symmetrical.
 *
 * The images are real work. The labels are descriptions of what each one is,
 * not confirmed copy: they say what the piece shows, which is the job the
 * reference's labels were doing, but nobody has signed off on the words.
 *
 * Adding or removing an entry means changing `--ksum` and `--count` in the
 * rail's CSS to match, or the row stops meeting the edges of the page.
 */
const SHOWCASE = [
  { id: "illustration", label: "Illustration", image: "/media/hero/showcase/illustration.jpg", k: 0.54 },
  { id: "editorial", label: "Editorial", image: "/media/hero/showcase/editorial.jpg", k: 0.7 },
  { id: "product", label: "Product", image: "/media/hero/showcase/product.jpg", k: 0.86 },
  { id: "character", label: "Character", image: "/media/hero/showcase/character.jpg", k: 1 },
  { id: "portrait", label: "Portrait", image: "/media/hero/showcase/portrait.jpg", k: 0.86 },
  { id: "album", label: "Album Art", image: "/media/hero/showcase/album-art.jpg", k: 0.7 },
  { id: "fashion", label: "Fashion", image: "/media/hero/showcase/fashion.jpg", k: 0.54 },
];


export function Hero() {
  return (
    <section id="top" className="hero-section">
      {/* Lower than the sections further down: the hero opens under a fixed
          bar and a pool at 0% would sit behind it, so it is centred on the
          headline instead. */}
      <SectionGlow position="50% 20%" />
      {/* The hero photograph, full bleed behind everything. It is its own
          element rather than a background-image so it can be object-fit and
          carry its own scrim; the scrim is what keeps the headline over it at
          AA and lands the foot of the section on --page-bg, so the seam into
          Partners stays invisible. */}
      <div className="hero-bg" aria-hidden>
        <img src={withBasePath("/media/hero/backdrop-mirrors.jpg")} alt="" />
        <span className="hero-bg-scrim" />
      </div>
      <div className="container-page">
        {/* Heading, then body, then the actions: one column, in that order. */}
        <div className="hero-top">
          <BlurHeading
            as="h1"
            className="display hero-h1"
            lead="Bringing"
            muted="imagination to life"
            mutedClassName=""
            lineBreak
          />
          <p className="hero-copy">
            ImagineArt is the best AI creative suite that generates images, videos,
            shorts, and voice from text prompt. Built for creators, teams and the
            developers shipping alongside them.
          </p>
          <div className="hero-actions">
            <a href={START_HREF} className="hero-btn hero-btn-dark">Get Started</a>
            <a href={DEMO_HREF} target="_blank" rel="noopener noreferrer" className="hero-btn hero-btn-ghost">Book a demo</a>
          </div>
        </div>

      </div>

      {/* Outside .container-page on purpose: the rail is wider than the page
          and clipped, which is what cuts the cards at either end. */}
      <div className="hs" role="list" aria-label="Made with ImagineArt">
        <div className="hs-rail">
          {SHOWCASE.map((c) => (
            <div key={c.id} className="hs-item" role="listitem" style={{ ["--k" as string]: c.k }}>
              <p className="hs-label">{c.label}</p>
              <div className="hs-card">
                <img src={withBasePath(c.image)} alt="" loading="lazy" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* Hosts a <SectionGlow> at z-index -1, and the photograph below it.

           One viewport tall, in svh rather than vh so a phone's collapsing
           address bar does not make it taller than the screen. The copy takes
           the space the rail leaves and centres in it, so everything inside
           is sized against the height as well as the width: see --hfit. */
        .hero-section {
          position: relative;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          min-height: 100svh;
          padding-top: clamp(72px, 11svh, 140px);
          padding-bottom: clamp(20px, 3svh, 40px);
        }
        ${sectionGlowCss}
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: -2;
          overflow: hidden;
          pointer-events: none;
        }
        .hero-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          /* The face sits a little above centre, so the crop holds it as the
             section gets taller than the picture. */
          object-position: 50% 42%;
          display: block;
        }
        .hero-bg-scrim {
          position: absolute;
          inset: 0;
          background:
            /* A flat wash over the whole photograph first. The gradients
               below shape it, but on their own they left the copy sitting on
               whatever the picture happened to be doing behind it. */
            linear-gradient(rgba(8, 4, 5, 0.2), rgba(8, 4, 5, 0.2)),
            /* Then the top, where the headline and copy are. */
            linear-gradient(
              to bottom,
              rgba(8, 4, 5, 0.72) 0%,
              rgba(8, 4, 5, 0.58) 38%,
              rgba(8, 4, 5, 0.3) 62%,
              rgba(8, 4, 5, 0) 80%
            ),
            /* And down into the page, so the band ends on --page-bg rather
               than a cut. */
            linear-gradient(to bottom, transparent 46%, var(--page-bg) 97%);
        }
        .hero-section .container-page {
          position: relative;
          z-index: 1;
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 0;
        }
        .hero-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0;
        }
        /* Sized off whichever axis is tighter, so a short laptop screen gets
           a smaller headline rather than a hero that will not fit. */
        .hero-h1 {
          font-size: clamp(32px, min(4.6vw, 7.4svh), 62px);
          line-height: 1.04;
          text-align: center;
          text-wrap: initial;
          font-weight: 500;
        }
        /* Flat, not the page's gradient heading: one ink, one weight. The
           fill has to be set as well as the colour, since .display paints its
           text transparent for the gradient, and the halo goes with it. */
        .hero-h1, .hero-h1 span {
          font-weight: 500;
          color: var(--ink-heading);
          background: none;
          -webkit-text-fill-color: var(--ink-heading);
          text-shadow: none;
        }
        .hero-copy {
          font-size: clamp(16px, 1.25vw, 18px);
          line-height: 1.6;
          color: var(--ink);
          max-width: 58ch;
          margin-top: clamp(12px, 2svh, 22px);
          margin-inline: auto;
        }
        .hero-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: clamp(16px, 3svh, 30px); }
        .hero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 46px;
          padding: 0 22px;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: -0.005em;
          white-space: nowrap;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
        .hero-btn:active { transform: translateY(1px); }
        .hero-btn-dark { background: var(--ink); color: var(--page-bg); }
        .hero-btn-dark:hover { background: var(--ink-2); }
        .hero-btn-ghost { background: var(--panel); color: var(--ink); border: 1px solid var(--line-strong); }
        .hero-btn-ghost:hover { border-color: var(--ink-3); }

        /* The showcase rail.
           Bottoms align and each card takes its own share --k of the tallest
           height, which is what draws the arch; the width follows from the
           3:4 ratio, so one number per card sets both. */
        /* The showcase rail.
           Bottoms align and each card takes its own share --k of the tallest
           height, which is what draws the arch; the width follows from the
           3:4 ratio, so one number per card sets both.

           --peak is solved so the row fills the page exactly: every card is
           0.75 * --peak * its own k wide, so the widths add up to
           0.75 * --peak * --ksum, and that plus the gaps has to be the page.
           Change SHOWCASE and --ksum has to change with it.

           The width comes from cqw, not vw: 100vw counts the vertical
           scrollbar, so on any platform that reserves space for one the row
           would be a few pixels wider than the page and give the whole
           document a horizontal scrollbar.

           --fit caps that by the viewport's height, because the hero is one
           screen tall and the rail is the part that has to give. On a tall
           screen the width solve wins and the row meets both edges; on a
           short one the height cap wins, the cards come down with it and the
           row sits inset instead. That trade is the point: a row that always
           filled the width would push the copy off a laptop screen. */
        .hs {
          container-type: inline-size;
          --ksum: 5.2;
          --gap: clamp(6px, 0.7vw, 14px);
          --fill: calc((100cqw - (var(--count) - 1) * var(--gap)) / (0.75 * var(--ksum)));
          --fit: 36svh;
          --peak: min(var(--fill), var(--fit));
          --count: 7;
          flex: 0 0 auto;
          margin-top: clamp(14px, 3svh, 44px);
          overflow-x: auto;
          overflow-y: hidden;
          overscroll-behavior-x: contain;
          scrollbar-width: none;
          /* Rails on this page need headroom rather than margins, or the
             scroll container clips what sits above the cards. */
          padding-block: 4px 2px;
        }
        .hs::-webkit-scrollbar { display: none; }
        .hs-rail {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: var(--gap);
          min-width: max-content;
        }
        .hs-item {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 10px;
          flex: 0 0 auto;
        }
        .hs-label {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: -0.005em;
          color: var(--ink-2);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
        .hs-card {
          position: relative;
          height: calc(var(--peak) * var(--k));
          aspect-ratio: 3 / 4;
          border-radius: var(--radius-3);
          overflow: hidden;
          background: var(--tile);
        }
        .hs-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
        @media (max-width: 880px) {
          .hc-chip { height: 30px; padding: 0 12px; font-size: 12.5px; }
          .hero-top { grid-template-columns: 1fr; gap: 18px; }
          .hero-copy { padding-top: 0; }
          /* Eight cards across a phone would be slivers, so the rail stops
             solving for the page width and goes back to scrolling. */
          .hs { --fill: clamp(190px, 46vw, 300px); --fit: 30svh; }
          .hs-rail { justify-content: flex-start; padding-inline: 16px; }
          .hs-label { font-size: 12px; }
        }
      `}</style>
    </section>
  );
}
