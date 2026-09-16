/* eslint-disable @next/next/no-img-element */
import { withBasePath } from "@/lib/assets";
import { STUDIO_HREFS } from "@/lib/links";

/**
 * Fashion Studio banner, on the product's own treatment: one campaign clip
 * full-bleed in a rounded band, a dark gradient rising from the foot, and
 * over it the white wordmark, the headline and a glass "Try Now" button on
 * the left, with the supporting paragraph on the right behind a hairline.
 * Copy is the product's own. The clip is the studio's campaign film.
 */
export function FashionStudio() {
  return (
    <section id="fashion-studio" className="relative pb-24 md:pb-32 -mt-14 md:-mt-20">
      <div className="container-page">
        <div className="fb-band">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video className="fb-video" src={withBasePath("/media/studios/fashion/banner.mp4")} autoPlay muted loop playsInline preload="metadata" aria-hidden />
          <span className="fb-scrim" aria-hidden />

          <div className="fb-copy">
            <div className="fb-left">
              <img src={withBasePath("/media/studios/logos/fashion-studio-white.svg")} alt="Fashion Studio" className="fb-logo" />
              <h2 className="fb-h">AI Fashion for Catalog and Editorial Shoots</h2>
              <a href={STUDIO_HREFS.fashion} target="_blank" rel="noopener noreferrer" className="fb-btn glass">
                Try Now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </div>
            <p className="fb-p">
              Choose a model, generate catalog and editorial images. No models to
              book, no lighting setup.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .fb-band {
          position: relative;
          height: var(--studio-band-h);
          border-radius: 24px;
          overflow: hidden;
          background: #0a0a0b;
          color: #fff;
          isolation: isolate;
        }
        .fb-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
        .fb-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(4, 8, 12, 0.78) 0%, rgba(4, 8, 12, 0.35) 38%, transparent 65%);
          pointer-events: none;
        }
        .fb-copy {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          padding: clamp(24px, 3vw, 44px);
        }
        .fb-left { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; min-width: 0; }
        .fb-logo { display: block; height: clamp(36px, 3.6vw, 52px); width: auto; }
        .fb-h {
          font-size: clamp(24px, 2.6vw, 38px);
          line-height: 1.12;
          letter-spacing: -0.02em;
          font-weight: 500;
          color: #fff;
          max-width: 20ch;
          text-wrap: balance;
        }
        .fb-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 254px;
          height: 52px;
          border-radius: 999px;
          font-size: 16px;
          font-weight: 500;
          color: #fff;
          --glass-tint: rgba(255, 255, 255, 0.14);
          transition: transform 0.2s ease;
        }
        .fb-btn:hover { transform: translateY(-1px); }
        .fb-p {
          flex: 0 1 36ch;
          max-width: 36ch;
          padding-left: 24px;
          border-left: 1px solid rgba(255, 255, 255, 0.3);
          font-size: 16px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.9);
        }

        @media (max-width: 900px) {
          .fb-band { height: auto; min-height: 560px; }
          .fb-copy { flex-direction: column; align-items: flex-start; gap: 24px; }
          .fb-p { border-left: 0; padding-left: 0; max-width: 52ch; }
        }
      `}</style>
    </section>
  );
}
