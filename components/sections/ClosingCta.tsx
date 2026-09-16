import { ButtonLink } from "@/components/Button";
import { withBasePath } from "@/lib/assets";
import { PRICING_HREF, START_HREF } from "@/lib/links";

/**
 * Closing band, un-boxed: a hairline, centred copy, two actions, and a
 * photograph faded in from the bottom with a soft page-coloured scrim behind
 * the copy so the muted heading clause stays legible.
 */
export function ClosingCta() {
  return (
    <section
      className="cta-section relative border-t border-black/[0.08] py-28 md:py-36"
      style={{ ["--cta-bg" as string]: `url(${withBasePath("/media/cta/hills.jpg")})` }}
    >
      <div className="container-page relative z-10 text-center">
        <h2 className="h2 mx-auto">
          Start creating <span className="h-muted">with ImagineArt</span>
        </h2>
        <p className="lede mx-auto mt-6">
          Every creative tool, one platform. Free to start.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href={START_HREF} variant="brand" size="lg">
            Get Started
          </ButtonLink>
          <ButtonLink href={PRICING_HREF} target="_blank" rel="noopener noreferrer" variant="ghost" size="lg">
            See Plans
          </ButtonLink>
        </div>
      </div>

      <style>{`
        .cta-section::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: radial-gradient(
            58% 52% at 50% 40%,
            color-mix(in srgb, var(--page-bg) 94%, transparent) 0%,
            color-mix(in srgb, var(--page-bg) 74%, transparent) 46%,
            transparent 76%
          );
        }
        .cta-section::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: var(--cta-bg);
          background-repeat: no-repeat;
          background-position: center bottom;
          background-size: cover;
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 38%, #000 100%);
          mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 38%, #000 100%);
        }
      `}</style>
    </section>
  );
}
