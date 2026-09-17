/* eslint-disable @next/next/no-img-element */
import { withBasePath } from "@/lib/assets";
import { STUDIO_HREFS } from "@/lib/links";

/**
 * Film Studio banner, on the product's own treatment: a dark band with a
 * continuous reel of film thumbnails behind, blurred at the edges and under
 * a frosted disc at the centre, and over it "ImagineArt presents", the Film
 * Studio logo, and a pill to the studio.
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
          <span className="fm-edge fm-edge-l" aria-hidden />
          <span className="fm-edge fm-edge-r" aria-hidden />
          <span className="fm-disc" aria-hidden />

          <span className="fm-presents">
            <span className="fm-brand">ImagineArt</span>
            <span className="fm-sub">Presents</span>
          </span>
          <img src={withBasePath("/media/studios/film/logo.webp")} alt="Film Studio" className="fm-logo" />
          <span className="fm-pill">See studio in action</span>
        </a>
      </div>

      <style>{`
        .fm-band {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
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
          -webkit-mask-image: linear-gradient(to right, transparent 0, #000 56px, #000 calc(100% - 56px), transparent 100%);
          mask-image: linear-gradient(to right, transparent 0, #000 56px, #000 calc(100% - 56px), transparent 100%);
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
        .fm-edge-l { left: 0; -webkit-mask-image: linear-gradient(to right, #000, transparent); mask-image: linear-gradient(to right, #000, transparent); }
        .fm-edge-r { right: 0; -webkit-mask-image: linear-gradient(to left, #000, transparent); mask-image: linear-gradient(to left, #000, transparent); }
        /* Frosted disc behind the logo, so it reads over the reel. */
        .fm-disc {
          position: absolute;
          left: 50%; top: 50%;
          width: clamp(340px, 42vw, 560px);
          height: clamp(260px, 28vw, 360px);
          transform: translate(-50%, -50%);
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.26);
          -webkit-backdrop-filter: blur(32px);
          backdrop-filter: blur(32px);
          -webkit-mask-image: radial-gradient(closest-side, #000 60%, transparent 100%);
          mask-image: radial-gradient(closest-side, #000 60%, transparent 100%);
          z-index: 2;
          pointer-events: none;
        }

        .fm-presents, .fm-logo, .fm-pill { position: relative; z-index: 3; }
        .fm-presents { display: flex; flex-direction: column; align-items: center; gap: 4px; text-transform: uppercase; letter-spacing: 3px; }
        .fm-brand { font-size: 12px; font-weight: 600; }
        .fm-sub { font-size: 10.5px; color: rgba(255, 255, 255, 0.55); }
        .fm-logo { display: block; width: clamp(260px, 30vw, 400px); height: auto; }
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

        @media (prefers-reduced-motion: reduce) { .fm-track { animation: none; } }
      `}</style>
    </section>
  );
}
