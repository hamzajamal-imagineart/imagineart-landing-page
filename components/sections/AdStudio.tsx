/* eslint-disable @next/next/no-img-element */
import { withBasePath } from "@/lib/assets";
import { STUDIO_HREFS } from "@/lib/links";
import { BlurHeading } from "@/components/BlurHeading";

/**
 * Ad Studio banner, on the product's own treatment: a dark band filled with
 * columns of 9:16 ad clips scrolling vertically at different speeds, and a
 * frosted panel on the left with "ImagineArt presents", the Ad Studio
 * wordmark in white, one line, and a glass button to the studio.
 *
 * Clips and posters stream from the Imagine CDN (the product's own marketing
 * studio set); each column is a CSS marquee with its track duplicated. Clips
 * are preload="none" with a poster, so the band costs the posters until they
 * play. A dark surface on the page, by request.
 */
const CDN = "https://cdn-imagine.vyro.ai/imagine-one/marketingstudio/home";

const COLUMNS: { speed: number; clips: string[] }[] = [
  { speed: 46, clips: ["football_tvc_1", "Asmr_4", "Unboxing_4", "Virtual_Try_ON_7", "Asmr_6", "UGC_1"] },
  { speed: 60, clips: ["Pro_Virtual_Try_ON_7", "football_tvc_4", "UGC_4", "Hyper_Motion_Product_Ad_1", "Unboxing_7", "Asmr_2"] },
  { speed: 49, clips: ["football_tvc_2", "Unboxing_5", "Pro_Virtual_Try_ON_2", "Tutorial_And_Review_2", "Asmr_5", "UGC_3"] },
  { speed: 64, clips: ["Hyper_Motion_Product_Ad_5", "football_tvc_5", "UGC_6", "Asmr_3", "Pro_Virtual_Try_ON_4", "Virtual_Try_ON_3"] },
  { speed: 40, clips: ["football_tvc_3", "UGC_5", "Tutorial_And_Review_3", "Virtual_Try_ON_1", "Hyper_Motion_Product_Ad_7", "UGC_7"] },
];

export function AdStudio() {
  return (
    <section id="studios" className="relative border-t border-[color:var(--line)] py-24 md:py-32">
      <div className="container-page">
        <div className="mx-auto max-w-[680px] text-center">
          <BlurHeading className="h2" lead="Studios" />
          <p className="lede mx-auto mt-5">
            Purpose-built spaces for ads, fashion and film, each with the models and presets that job needs.
          </p>
        </div>
        <div className="ad-band mt-14">
          <div className="ad-cols" aria-hidden>
            {COLUMNS.map((col, ci) => (
              <div key={ci} className={`ad-col ${ci >= 3 ? "ad-col-wide" : ""} ${ci === 4 ? "ad-col-xl" : ""}`}>
                <div className="ad-track" style={{ animationDuration: `${col.speed}s` }}>
                  {[...col.clips, ...col.clips].map((c, i) => (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video
                      key={`${c}-${i}`}
                      className="ad-clip"
                      src={`${CDN}/${c}.mp4`}
                      poster={`${CDN}/${c}.webp`}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="none"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="ad-panel">
            <span className="ad-presents">ImagineArt presents</span>
            <img src={withBasePath("/media/studios/logos/ad-studio-white.svg")} alt="Ad Studio" className="ad-logo" />
            <p className="ad-line">Ship your next ad in 1 minute.</p>
            <a href={STUDIO_HREFS.ad} target="_blank" rel="noopener noreferrer" className="ad-btn glass">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden><path d="M7.96 7.3l2.37-.86.86-2.38c.17-.45.81-.45.98 0l.86 2.38 2.38.86c.45.17.45.81 0 .98l-2.38.86-.86 2.38c-.17.45-.81.45-.98 0l-.86-2.38-2.37-.86c-.46-.17-.46-.81 0-.98zM2.59 12.04l1.76-.64.64-1.75c.16-.46.81-.46.97 0l.64 1.75 1.76.64c.45.17.45.81 0 .98l-1.76.64-.64 1.75c-.16.46-.81.46-.97 0l-.64-1.75-1.76-.64c-.45-.17-.45-.81 0-.98zM2.59 4.09l1.1-.4.4-1.1c.17-.46.81-.46.98 0l.4 1.1 1.1.4c.46.17.46.81 0 .98l-1.1.4-.4 1.1c-.17.46-.81.46-.98 0l-.4-1.1-1.1-.4c-.46-.17-.46-.81 0-.98z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Try Ad Studio
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .ad-band {
          position: relative;
          height: var(--studio-band-h);
          border-radius: var(--radius-6);
          overflow: hidden;
          background: var(--ground);
          border: 1px solid var(--line);
          isolation: isolate;
        }
        .ad-cols { position: absolute; inset: 0; display: flex; gap: 8px; }
        .ad-col { position: relative; flex: 1; height: 100%; overflow: hidden; min-width: 0; }
        .ad-col-wide { display: none; }
        .ad-track {
          display: flex;
          flex-direction: column;
          gap: 8px;
          animation: ad-scroll linear infinite;
          will-change: transform;
        }
        @keyframes ad-scroll {
          from { transform: translateY(0); }
          to   { transform: translateY(calc(-50% - 4px)); }
        }
        .ad-clip {
          display: block;
          width: 100%;
          aspect-ratio: 9 / 16;
          object-fit: cover;
          border-radius: 8px;
          background: #1a1a1c;
        }

        /* Frosted panel: full height on the left at desktop, a top band on
           phones. */
        .ad-panel {
          position: absolute;
          z-index: 2;
          left: 0; top: 0; bottom: 0;
          width: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 24px;
          text-align: center;
          color: #fff;
          background: linear-gradient(135deg, rgba(120, 90, 220, 0.25), transparent 50%, rgba(120, 90, 220, 0.12)), rgba(255, 255, 255, 0.1);
          -webkit-backdrop-filter: blur(40px);
          backdrop-filter: blur(40px);
        }
        .ad-presents { font-size: 12.5px; font-weight: 500; letter-spacing: 0.02em; text-transform: uppercase; }
        .ad-logo { display: block; width: 220px; height: auto; }
        .ad-line { font-size: clamp(22px, 2vw, 28px); line-height: 1.25; font-weight: 500; letter-spacing: -0.015em; max-width: 12ch; }
        .ad-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 240px;
          height: 48px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          color: #fff;
          --glass-tint: rgba(255, 255, 255, 0.14);
        }

        @media (min-width: 900px) { .ad-col-wide { display: block; } }
        @media (max-width: 1200px) { .ad-col-xl { display: none; } }
        @media (max-width: 768px) {
          .ad-band { height: 640px; }
          .ad-panel { right: 0; bottom: auto; width: auto; height: 380px; border-radius: 0 0 24px 24px; }
        }
        @media (prefers-reduced-motion: reduce) { .ad-track { animation: none; } }
      `}</style>
    </section>
  );
}
