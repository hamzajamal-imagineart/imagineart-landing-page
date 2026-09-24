"use client";

import { useEffect, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { START_HREF, DEMO_HREF } from "@/lib/links";
import { BlurHeading } from "@/components/BlurHeading";

/**
 * Hero: the claim and the two actions, over a mosaic of work.
 *
 * **The mode strip moved out** (Hamza, 24 Sep) to `sections/Platform`, one
 * fold down. The COO read the page as an image generator, and this was why:
 * a headline over a panel showing one tool working. What is left is what the
 * company is and what to do about it.
 */
const MOSAIC = Array.from({ length: 18 }, (_, i) => `/media/hero/mosaic/m${i + 1}.jpg`);

export function Hero() {
  /**
   * The mosaic is sharp at the top of the page and blurs once you move.
   *
   * At rest the work should be legible as work; the moment the page starts
   * scrolling it is only a ground, and the blur takes the hard edges out from
   * under the copy. Armed from a passive effect and seeded from the current
   * scroll position, so a reload partway down starts blurred; never from
   * requestAnimationFrame, which is suspended in a background tab (§4). With
   * no JS at all the mosaic simply stays sharp, which is the state that needs
   * no explanation.
   */
  const [moved, setMoved] = useState(false);

  /** One passive listener, for the mosaic's blur. */
  useEffect(() => {
    const onScroll = () => {
      setMoved(window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <section id="top" className="hero-section">
      {/* No <SectionGlow> here. It sat above the mosaic and poured white
          light into the middle of the section, which is exactly where the
          headline is: it was working against the scrim. The mosaic gives the
          section its interest now. */}
      {/* The ground, and the scrim that makes the copy legible over it. */}
      <div className="hero-bg" aria-hidden>
        <div className={`hero-mosaic ${moved ? "hero-mosaic-soft" : ""}`}>
          {MOSAIC.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={withBasePath(src)} alt="" />
          ))}
        </div>
        <span className="hero-bg-scrim" />
      </div>
      <div className="container-page">
        {/* One centred column: heading, copy, actions. */}
        <div className="hero-top">
          <BlurHeading
            as="h1"
            className="display hero-h1"
            lead="Imagine, design, animate,"
            muted="edit. One platform."
            mutedClassName=""
            lineBreak
          />
          <p className="hero-copy">
            ImagineArt is the best AI creative suite that generates images, videos,
            shorts, and voice from text prompt. Built for creators, teams and the
            developers shipping alongside them.
          </p>
          {/* Two actions now (Hamza, 24 Sep): the app for anyone who wants to
              try it, and sales for the buyer the page is aimed at. The second
              is the demo booking the footer and closing band already use,
              since the page still has no contact form. */}
          <div className="hero-actions">
            <a href={START_HREF} className="hero-cta">
              Start creating for free
              <svg className="hero-cta-go" width="13" height="12" viewBox="0 0 12 11" fill="none" aria-hidden>
                <path d="M11.17 5.5H1M7.75 10l3.585-3.97c.53-.53.54-.52 0-1.06L7.75 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </a>
            <a href={DEMO_HREF} target="_blank" rel="noopener noreferrer" className="hero-cta2">
              Contact sales
            </a>
          </div>
        </div>

      </div>

      <style>{`
        /* Hosts the mosaic at z-index -2. */
        .hero-section {
          position: relative;
          isolation: isolate;
          padding-top: clamp(168px, 20vh, 232px);
          padding-bottom: clamp(40px, 6vh, 72px);
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: -2;
          overflow: hidden;
          pointer-events: none;
        }
        .hero-mosaic {
          column-count: 6;
          column-gap: 8px;
          padding: 8px;
          /* Taller than the section so the columns are always cut off rather
             than running out partway down and leaving a bald foot. */
          height: 130%;
          /* The scale is not decoration: a blurred layer samples transparent
             past its own edges, so without it the mosaic haloes along every
             edge of the section once .hero-mosaic-soft is on. It stays on at
             all times rather than arriving with the blur, so nothing shifts
             at the moment the blur does. */
          transform: scale(1.09);
          transform-origin: center top;
          transition: filter 420ms ease;
        }
        /* Set by <Hero> once the page has moved: sharp at rest so the work
           reads as work, soft the moment it becomes only a ground. What the
           blur buys for legibility is smaller than the scrim's pool below —
           swept against the real mosaic, blurring from 9px to 24px moved the
           worst case behind the headline by 0.3, where widening the pool
           moved it by 2 — but it is what stops hard edges cutting through the
           letterforms. */
        .hero-mosaic-soft { filter: blur(14px); }
        .hero-mosaic img {
          display: block;
          width: 100%;
          margin-bottom: 8px;
          border-radius: 10px;
          break-inside: avoid;
        }
        /* Heavy, because the tiles are faces and bright grounds and the copy
           is centred right over the middle of them. Three layers: a flat wash
           over the whole mosaic, a heavier pool behind the copy, and the fade
           to --page-bg that lands the foot of the section on the page so the
           seam into Partners stays invisible. */
        .hero-bg-scrim {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(rgba(9, 9, 11, 0.46), rgba(9, 9, 11, 0.46)),
            /* Wide on purpose. Sweeping this against the real mosaic, the
               pool's size is what carries legibility and the blur barely
               registers: 64%x48% gave 11.2:1 behind the headline, 80%x62%
               gave 13.2:1 and halved the variation across the text box, while
               blurring 9px to 24px moved the worst case by 0.3. The pool has
               to be wider than the copy, not tighter. */
            radial-gradient(80% 62% at 50% 32%, rgba(9, 9, 11, 0.86) 0%, rgba(9, 9, 11, 0.52) 62%, rgba(9, 9, 11, 0.12) 100%),
            linear-gradient(to bottom, rgba(9, 9, 11, 0.46) 0%, rgba(9, 9, 11, 0.18) 28%, rgba(9, 9, 11, 0.55) 72%, var(--page-bg) 98%);
        }
        .hero-section .container-page { position: relative; z-index: 1; }
        .hero-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .hero-h1 {
          font-size: clamp(36px, 5.2vw, 72px);
          line-height: 1.04;
          letter-spacing: -0.025em;
          text-align: center;
          text-wrap: initial;
        }
        /* Flat white, not the page's gradient heading: one ink at one weight,
           as the rest of the hero now is. .display paints its text
           transparent to carry that gradient, so the fill has to be set as
           well as the colour, and the halo goes with it. */
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
          color: var(--ink-2);
          max-width: 56ch;
          margin-top: 20px;
        }
        .hero-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 28px; }
        /* The CTA, built from the supplied SVG rather than approximated.
           The shape is 48 tall on an 18 radius; the fill is that SVG's radial
           gradient, whose rx and ry were 161.58 and 125.29 against a 255x48
           button, so 63% and 261%; the two glows are its drop shadows, both
           #8A3FFC at 15% (stdDeviation 6 and 12, which is 12px and 24px of
           CSS blur); and the lip is its inner shadow, offset up 4 with no
           blur, which lands as a 4px band inside the bottom edge. */
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          height: 56px;
          /* The 4px lip eats the bottom of the button, so the visible face is
             the top 52px. Centring on the box put the label below the middle
             of what you actually see; this pads it back up. */
          padding: 0 32px 4px;
          border-radius: 21px;
          font-size: 16.5px;
          font-weight: 500;
          letter-spacing: -0.005em;
          white-space: nowrap;
          color: #fff;
          background: radial-gradient(63% 261% at 50% 50%, #8A3FFC 30.29%, #8A3FFC 63.46%, #491D8B 100%);
          box-shadow:
            0 6px 12px rgba(138, 63, 252, 0.15),
            0 12px 24px rgba(138, 63, 252, 0.15),
            inset 0 -4px 0 #491D8B;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hero-cta:hover {
          box-shadow:
            0 8px 16px rgba(138, 63, 252, 0.26),
            0 16px 32px rgba(138, 63, 252, 0.22),
            inset 0 -4px 0 #491D8B;
        }
        .hero-cta:active { transform: translateY(1px); }
        .hero-cta-go { flex: 0 0 auto; }

        /* The second action: a quiet outline beside the brand pill, so the
           two read as primary and secondary rather than as a pair. Fixed
           white, since this sits on the mosaic and not on the page wash. */
        .hero-cta2 {
          display: inline-flex;
          align-items: center;
          height: 56px;
          padding: 0 28px;
          border-radius: 21px;
          font-size: 16.5px;
          font-weight: 500;
          letter-spacing: -0.005em;
          white-space: nowrap;
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: background 200ms ease, box-shadow 200ms ease;
        }
        .hero-cta2:hover {
          background: rgba(255, 255, 255, 0.14);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 880px) {
          .hero-mosaic { column-count: 3; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-mosaic { transition: none; }
        }
      `}</style>
    </section>
  );
}
