import { withBasePath } from "@/lib/assets";
import { DEMO_HREF, START_HREF } from "@/lib/links";
import { BlurHeading } from "@/components/BlurHeading";

/**
 * Closing band: the photograph full-bleed behind the whole section.
 *
 * Edge to edge rather than a framed card, so the page ends on a full stop
 * instead of one more container. The copy stays on the page grid
 * (`container-page`), left aligned, with the scrim running in from the left,
 * so the arch keeps the clean right-hand side of the frame at any width.
 *
 * No top hairline: the band is dark and full width, which is its own seam.
 *
 * Its own buttons rather than <ButtonLink>: on a dark ground the kit's brand
 * and ghost variants are both wrong, so this takes the white-on-dark pair the
 * studio banners already use.
 */
export function ClosingCta() {
  return (
    <section
      className="cta-section"
      style={{ ["--cta-bg" as string]: `url(${withBasePath("/media/cta/portal.jpg")})` }}
    >
      <div className="container-page cta-inner">
        <div className="cta-copy">
          <BlurHeading as="h2" className="cta-h2" lead="Bring your ideas" muted="to life" />
          <p className="cta-lede">Every creative tool, one platform. Free to start.</p>
          <div className="cta-actions">
            <a href={START_HREF} className="cta-btn cta-btn-light">Get Started</a>
            <a href={DEMO_HREF} target="_blank" rel="noopener noreferrer" className="cta-btn cta-btn-glass">
              Book a demo
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .cta-section {
          position: relative;
          background-color: var(--ground);
          background-image: var(--cta-bg);
          background-size: cover;
          /* The arch sits right of centre, so the frame holds the right of
             the image and the copy takes the darkened left. */
          background-position: 62% center;
          background-repeat: no-repeat;
          isolation: isolate;
        }
        /* Scrim in from the left only, so the picture stays legible on the
           right rather than being flattened under an even wash. */
        .cta-section::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            linear-gradient(to right, rgba(10, 10, 11, 0.86) 0%, rgba(10, 10, 11, 0.62) 32%, rgba(10, 10, 11, 0.1) 60%, transparent 80%),
            linear-gradient(to top, rgba(10, 10, 11, 0.32), transparent 55%);
        }

        .cta-inner {
          position: relative;
          z-index: 2;
          min-height: clamp(400px, 32vw, 520px);
          display: flex;
          align-items: center;
        }
        .cta-copy { max-width: 560px; padding-block: 64px; }

        .cta-h2 {
          color: #fff;
          font-size: clamp(30px, 3.6vw, 48px);
          line-height: 1.1;
          letter-spacing: -0.02em;
          font-weight: 500;
        }
        /* The muted clause takes a white tint here, not the page's own muted
           ink, which disappears against the scrim. -webkit-text-fill-color as
           well as color: the global .h-muted rule sets the fill for the
           gradient headings, and fill wins over color when text is painted. */
        .cta-h2 .h-muted {
          color: rgba(255, 255, 255, 0.66);
          -webkit-text-fill-color: rgba(255, 255, 255, 0.66);
        }
        .cta-lede {
          margin-top: 14px;
          font-size: clamp(15px, 1.2vw, 17px);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.76);
          max-width: 40ch;
        }

        .cta-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
        .cta-btn {
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
        .cta-btn:active { transform: translateY(1px); }
        .cta-btn-light { background: #fff; color: var(--ground); }
        .cta-btn-light:hover { background: rgba(255, 255, 255, 0.88); }
        .cta-btn-glass {
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.24);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .cta-btn-glass:hover { background: rgba(255, 255, 255, 0.2); border-color: rgba(255, 255, 255, 0.4); }

        /* Narrow: the copy can no longer take half the width, so the scrim
           becomes a bottom-up one and the copy sits on the floor of the band. */
        @media (max-width: 720px) {
          .cta-section { background-position: 58% center; }
          .cta-section::before {
            background: linear-gradient(to top, rgba(10, 10, 11, 0.92) 0%, rgba(10, 10, 11, 0.7) 40%, rgba(10, 10, 11, 0.18) 72%, transparent 100%);
          }
          .cta-inner { align-items: flex-end; min-height: 460px; }
          .cta-copy { max-width: none; padding-block: 48px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cta-btn { transition: none; }
        }
      `}</style>
    </section>
  );
}
