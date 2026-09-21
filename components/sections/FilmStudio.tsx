/* eslint-disable @next/next/no-img-element */
import { withBasePath } from "@/lib/assets";
import { STUDIO_HREFS } from "@/lib/links";

/**
 * Film Studio banner: a dark band with a continuous reel of film thumbnails
 * running behind it, and a left-hand block carrying "ImagineArt presents",
 * the Film Studio logo, one line and a pill to the studio.
 *
 * **Left, not centred** (Hamza, 21 Sep). It was a centred stack over a
 * frosted disc, with the logo at up to 400px — the logo read as the banner
 * rather than as a mark on it, and the disc punched a hole in the middle of
 * the reel it was meant to sit on. The copy now sits where Ad Studio's panel
 * and Fashion's block sit, the logo is half the size, and the disc is gone in
 * favour of a scrim raked in from the left, which lets the reel run
 * uninterrupted across the rest of the band.
 *
 * The reel is a CSS marquee (track duplicated, translated by half), not the
 * original's per-tile 3D transform, so it costs no JS. Thumbnails and logo
 * are the studio's real assets, saved locally (thumbnails downscaled to
 * 576px JPEG from 2752px sources). This is a third dark surface
 * on the page, by request; the kit's rule allows two.
 */
const THUMBS = [1, 2, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 29, 30];

export function FilmStudio() {
  const reel = [...THUMBS, ...THUMBS];
  return (
    <section id="film-studio" className="relative pb-24 md:pb-32 -mt-14 md:-mt-20">
      <div className="container-page">
        <a href={STUDIO_HREFS.film} target="_blank" rel="noopener noreferrer" className="fm-band" aria-label="Film Studio, see the studio in action">
          <div className="fm-reel" aria-hidden>
            <div className="fm-track">
              {reel.map((n, i) => (
                <img key={i} src={withBasePath(`/media/studios/film/t${n}.jpg`)} alt="" loading="lazy" className="fm-thumb" />
              ))}
            </div>
          </div>
          <span className="fm-edge fm-edge-r" aria-hidden />
          <span className="fm-scrim" aria-hidden />

          <div className="fm-panel">
            <span className="fm-presents">ImagineArt presents</span>
            <img src={withBasePath("/media/studios/film/logo.webp")} alt="Film Studio" className="fm-logo" />
            <p className="fm-line">Script to scenes to a finished cut.</p>
            <span className="fm-pill">See studio in action</span>
          </div>
        </a>
      </div>

      <style>{`
        .fm-band {
          position: relative;
          display: block;
          height: var(--studio-band-h);
          border-radius: var(--radius-6);
          overflow: hidden;
          background:
            radial-gradient(60% 120% at 6% 100%, rgba(120, 80, 210, 0.55), transparent 60%),
            radial-gradient(70% 120% at 55% 0%, rgba(40, 120, 100, 0.55), transparent 60%),
            linear-gradient(90deg, #2a2440 0%, #1f2626 45%, #1b2f2b 70%, #262626 100%);
          color: #fff;
          isolation: isolate;
        }
        .fm-reel {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          overflow: hidden;
          /* Only the right edge fades now: the left is under the scrim, and
             fading it as well left a pale notch where the two met. */
          -webkit-mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 56px), transparent 100%);
          mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 56px), transparent 100%);
        }
        .fm-track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: fm-scroll 90s linear infinite;
          will-change: transform;
        }
        .fm-band:hover .fm-track { animation-play-state: paused; }
        @keyframes fm-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-50% - 8px)); }
        }
        .fm-thumb {
          flex: 0 0 auto;
          width: clamp(240px, 24vw, 340px);
          aspect-ratio: 16 / 9;
          object-fit: cover;
          border-radius: 10px;
          display: block;
          opacity: 0.85;
        }

        .fm-edge {
          position: absolute;
          top: 0; bottom: 0;
          width: 56px;
          z-index: 2;
          -webkit-backdrop-filter: blur(24px);
          backdrop-filter: blur(24px);
          pointer-events: none;
        }
        .fm-edge-r { right: 0; -webkit-mask-image: linear-gradient(to left, #000, transparent); mask-image: linear-gradient(to left, #000, transparent); }
        /* Raked in from the left, so the copy has a ground and the reel still
           runs clear across the rest of the band. Wider than the panel on
           purpose: a scrim tight to the text reads as a panel edge. */
        .fm-scrim {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          /* Near solid where the copy sits, then away quickly. The reel is
             photographs of films — bright faces and posters — and a scrim
             that merely darkens them leaves the thumbnails reading through
             the wordmark. Over the block's width the ground is effectively
             flat, so the copy's contrast does not depend on which frame
             happens to be passing behind it. */
          background: linear-gradient(
            to right,
            rgba(8, 9, 12, 0.97) 0%,
            rgba(8, 9, 12, 0.95) 30%,
            rgba(8, 9, 12, 0.6) 46%,
            rgba(8, 9, 12, 0.14) 68%,
            transparent 100%
          );
        }

        /* The same left block Ad Studio uses, at the same inset, so the three
           banners read as one family stacked. */
        .fm-panel {
          position: absolute;
          z-index: 3;
          left: clamp(28px, 4vw, 56px);
          top: 50%;
          transform: translateY(-50%);
          max-width: min(46%, 460px);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 14px;
        }
        .fm-presents {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.62);
        }
        /* Half what it was: a mark on the banner, not the banner itself. */
        .fm-logo { display: block; width: clamp(180px, 17vw, 232px); height: auto; }
        .fm-line {
          font-size: clamp(19px, 1.7vw, 25px);
          line-height: 1.25;
          font-weight: 500;
          letter-spacing: -0.015em;
          max-width: 18ch;
          color: #fff;
        }
        .fm-pill {
          display: inline-flex;
          align-items: center;
          padding: 7px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-size: 10.5px;
          letter-spacing: 3px;
          text-transform: uppercase;
          transition: border-color 0.2s ease;
        }
        .fm-band:hover .fm-pill { border-color: rgba(255, 255, 255, 0.55); }

        /* On a phone the band is short and the reel is the whole picture, so
           the block sits at the foot rather than beside nothing. */
        @media (max-width: 720px) {
          .fm-panel {
            left: 20px; right: 20px;
            top: auto; bottom: 22px;
            transform: none;
            max-width: none;
            gap: 10px;
          }
          .fm-scrim {
            /* Near solid up past the block's head, for the same reason the
               desktop scrim is: the block sits on the reel, and its ground
               should not change with whichever poster is passing. */
            background: linear-gradient(to top, rgba(8, 9, 12, 0.97) 0%, rgba(8, 9, 12, 0.95) 52%, rgba(8, 9, 12, 0.45) 78%, transparent 100%);
          }
          .fm-logo { width: 164px; }
        }
        @media (prefers-reduced-motion: reduce) { .fm-track { animation: none; } }
      `}</style>
    </section>
  );
}
