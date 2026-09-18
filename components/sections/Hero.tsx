"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assets";
import { START_HREF } from "@/lib/links";
import { SlidingIndicator, slidingIndicatorCss, useSlidingIndicator } from "@/components/primitives/SlidingIndicator";
import { BlurHeading } from "@/components/BlurHeading";

/**
 * Hero, on the ElevenLabs pattern, pared down.
 *
 * Headline left, supporting copy right, two pill buttons. Below, one framed
 * panel: a three-way tab bar (Creative · Workflows · Computer) and one 16:9
 * clip per tab. Nothing else in the panel.
 *
 * All three clips render into the HTML, stacked in one cell; only the visible
 * one plays, and the visible one shows native controls while the pointer is
 * over the frame. Creative and Workflows stream real footage; Computer is
 * still a placeholder.
 */
/**
 * The Creative tab's carousel.
 *
 * Five tools, one card each, the selected one brought forward and the rest
 * held back at reduced scale. The chips below are the control: they are the
 * same five names, so there is no caption under the card repeating them.
 *
 * **Every entry is currently the same clip**, while the shape of the section
 * is being tried out, so picking a chip does not change what is playing. Give
 * each entry its own `video` when the real footage exists and that starts
 * working on its own.
 */
const PLACEHOLDER = "/media/hero/creative-suite-image.webm";

const CREATIVE = [
  { id: "image", label: "Image Generator", video: PLACEHOLDER },
  { id: "upscale", label: "Upscaler", video: PLACEHOLDER },
  { id: "variations", label: "Variations", video: PLACEHOLDER },
  { id: "relight", label: "Relight", video: PLACEHOLDER },
  { id: "angles", label: "Camera Angles", video: PLACEHOLDER },
];


/**
 * The Creative tab: one clip, full width, and a chip row under it.
 *
 * The chips select a tool and the clip is the selected tool's own footage.
 * While the section is being tried out every chip points at the same file, so
 * the clip does not change when you pick one; give each entry in CREATIVE its
 * own `video` and this starts working with no other change.
 *
 * Single-source, so there is nothing here to load twice: the earlier version
 * showed five cards at once, which meant five <video> elements on one URL
 * firing five range requests in the same millisecond, none of them able to
 * hit the cache the others were still filling.
 */
function CreativeCarousel({ live }: { live: boolean }) {
  const [card, setCard] = useState(0);
  const chips = useSlidingIndicator<HTMLButtonElement>(card);
  const clip = useRef<HTMLVideoElement | null>(null);

  // The autoplay attribute only fires when the element first enters the
  // document, so a clip paused because the tab moved away never restarts.
  // Drive it from the tab's state instead, as the other two panels are.
  useEffect(() => {
    const v = clip.current;
    if (!v) return;
    if (live) void v.play().catch(() => {});
    else v.pause();
  }, [live]);

  const onChipKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (card + d + CREATIVE.length) % CREATIVE.length;
    setCard(next);
    document.getElementById(`hero-chip-${CREATIVE[next].id}`)?.focus();
  };

  return (
    <div className="hc">
      <div className="hc-stage" id={`hero-card-${CREATIVE[card].id}`}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={clip}
          src={withBasePath(CREATIVE[card].video)}
          title={`${CREATIVE[card].label} in ImagineArt`}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
        />
      </div>

      <div
        className="hc-chips"
        role="tablist"
        aria-label="Creative tools"
        onKeyDown={onChipKey}
        ref={chips.containerRef as React.Ref<HTMLDivElement>}
      >
        <SlidingIndicator box={chips.box} ready={chips.ready} className="hc-chip-fill" />
        {CREATIVE.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => { chips.itemRefs.current[i] = el; }}
            id={`hero-chip-${c.id}`}
            role="tab"
            type="button"
            aria-selected={i === card}
            aria-controls={`hero-card-${c.id}`}
            tabIndex={i === card ? 0 : -1}
            className={`hc-chip ${i === card ? "hc-chip-on" : ""}`}
            onClick={() => setCard(i)}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * The hero's ground: a mosaic of work, run edge to edge behind the copy.
 *
 * The tiles are eighteen pieces of work, downscaled to 440px wide in
 * `hero/mosaic/` — 568KB for the set, where the originals are several MB and
 * would render at a fraction of their size. Rebuild with `sips -Z 440` if the
 * set changes, and update MOSAIC's length to match.
 *
 * Laid out in CSS columns rather than a grid: the tiles are a mix of 1:1,
 * 3:4 and 9:16, and columns let each keep its own ratio and pack, which is
 * what makes the edges ragged rather than a tidy grid of equal boxes.
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
  const frame = useRef<HTMLDivElement | null>(null);

  /**
   * One listener for both scroll effects: the mosaic's blur, and the panel
   * growing to full size as the page moves.
   *
   * The growth is written straight to the element as a custom property rather
   * than held in state, so a scroll does not re-render the section on every
   * frame. The panel starts a tenth under size and reaches full size half a
   * screen down; with no JS it simply stays at its starting size, which is a
   * slightly smaller panel and not a broken one.
   */
  useEffect(() => {
    const onScroll = () => {
      setMoved(window.scrollY > 24);
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.5)));
      frame.current?.style.setProperty("--grow", String(0.9 + 0.1 * p));
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
          <div className="hero-actions">
            <a href={START_HREF} className="hero-cta">
              Start creating for free
              <svg className="hero-cta-go" width="13" height="12" viewBox="0 0 12 11" fill="none" aria-hidden>
                <path d="M11.17 5.5H1M7.75 10l3.585-3.97c.53-.53.54-.52 0-1.06L7.75 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </a>
          </div>
        </div>

        <div className="hero-frame" ref={frame}>
          <CreativeCarousel live />
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

        /* The clip fills the frame: no padding, no inner chrome. The chips
           float on top of it rather than sitting on a band below, which is
           what was eating the bottom of the panel. */
        .hero-frame {
          position: relative;
          margin-top: clamp(20px, 3vh, 36px);
          /* A wide white rule at 20%: the frame reads as a lit edge around
             the clip rather than a hairline. border-box keeps the panel's
             outer size, so the clip loses 8px a side rather than the layout
             moving. */
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-6);
          background: var(--tile);
          overflow: hidden;
          aspect-ratio: 16 / 9;
          /* Set by <Hero> from the scroll position. Transform rather than
             width, so the panel grows without reflowing the section under it
             on every frame; the origin is the top so it opens downward into
             the page rather than pushing back up under the copy. */
          --grow: 0.9;
          transform: scale(var(--grow));
          transform-origin: center top;
          will-change: transform;
        }
        ${slidingIndicatorCss}



        /* One clip filling the panel, with the chips floating over it. */
        .hc { position: absolute; inset: 0; }
        .hc-stage { position: absolute; inset: 0; overflow: hidden; background: var(--tile-2); }
        .hc-stage video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        /* A solid dark bar on the clip, not glass: frosting it let whatever
           the video was doing show through the control, which read as noise
           under the labels. The hairline is what keeps its edge legible over
           a light frame as well as a dark one. */
        .hc-chips {
          position: absolute;
          left: 50%;
          bottom: clamp(12px, 2.2%, 22px);
          transform: translateX(-50%);
          max-width: calc(100% - 24px);
          display: flex;
          justify-content: center;
          gap: 4px;
          padding: 5px;
          border-radius: 999px;
          background: rgba(10, 10, 11, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.36);
          overflow-x: auto;
          scrollbar-width: none;
        }
        .hc-chips::-webkit-scrollbar { display: none; }
        .hc-chip-fill {
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
        }
        /* Fixed white rather than a token: these sit on the clip, not on the
           page, so they do not follow the theme. The selected one takes the
           ground colour against the near-white fill, per the pairing rule in
           §4. */
        .hc-chip {
          position: relative;
          z-index: 1;
          flex: 0 0 auto;
          border: 0;
          border-radius: 999px;
          padding: 0 16px;
          height: 34px;
          background: transparent;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: -0.005em;
          color: rgba(255, 255, 255, 0.72);
          cursor: pointer;
          white-space: nowrap;
          transition: color 260ms ease;
        }
        .hc-chip:hover { color: #fff; }
        .hc-chip-on, .hc-chip-on:hover { color: #0b0b0c; }

        @media (max-width: 880px) {
          .hc-chip { height: 30px; padding: 0 12px; font-size: 12.5px; }
          .hero-mosaic { column-count: 3; }
          .hc-chip { height: 30px; padding: 0 12px; font-size: 12.5px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-mosaic { transition: none; }
          .hero-frame { transform: none; }
          .hero-mosaic { transition: none; }
        }
      `}</style>
    </section>
  );
}
