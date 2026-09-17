/* eslint-disable @next/next/no-img-element */
import { withBasePath } from "@/lib/assets";
import { SectionGuides } from "@/components/primitives/SectionGuides";

/**
 * Partner marks, ported from the Enterprise page.
 *
 * The supplied SVGs are single-colour paths, so they are painted via CSS mask
 * plus background: the mask takes the glyph's alpha and the background gives
 * the colour, which is what lets a flat file carry Kling's gradient. Real
 * brand marks are the one sanctioned exception to the monochrome rule. Wan
 * and fal are PNGs and render as images.
 *
 * The only section on the page that keeps the kit's SectionGuides (the
 * container-edge rules and corner dots), by request.
 */
type Brand = { name: string; logo: string; paint?: string };

const BRANDS: Brand[] = [
  { name: "ByteDance", logo: "/media/partners/bytedance.svg", paint: "#325AB4" },
  { name: "Kling AI", logo: "/media/partners/kling.svg", paint: "linear-gradient(135deg, #6D4AE0 0%, #8B5CF6 55%, #A78BFA 100%)" },
  { name: "MINIMAX", logo: "/media/partners/minimax.svg", paint: "#EB0045" },
  { name: "Wan", logo: "/media/partners/wan.png" },
  { name: "fal", logo: "/media/partners/fal.png" },
  { name: "Grok", logo: "/media/partners/grok.svg", paint: "#0A0A0A" },
];

export function Partners() {
  return (
    <section className="relative border-t border-[color:var(--line)] py-16 md:py-20 lg:border-t-0">
      <SectionGuides edge="top" />
      <div className="container-page">
        <p className="pt-cap">Trusted by the brands you benchmark against</p>
        <div className="pt-row mt-8">
          {BRANDS.map((b) => (
            <span key={b.name} className="pt-brand">
              {b.paint ? (
                <span aria-hidden className="pt-logo" style={{ ["--logo" as string]: `url(${withBasePath(b.logo)})`, background: b.paint }} />
              ) : (
                <img src={withBasePath(b.logo)} alt="" aria-hidden className="pt-img" />
              )}
              <span className="pt-name">{b.name}</span>
            </span>
          ))}
        </div>
        <p className="pt-cap mt-8">Partnering with global industry leaders to power your creative output</p>
      </div>

      <style>{`
        .pt-cap { text-align: center; font-size: 13px; line-height: 1.5; color: var(--ink-3); }
        .pt-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: clamp(28px, 5vw, 56px);
        }
        .pt-brand { display: inline-flex; align-items: center; gap: 10px; }
        .pt-name { font-size: clamp(15px, 1.3vw, 18px); font-weight: 500; letter-spacing: -0.01em; color: var(--ink); white-space: nowrap; }
        .pt-img { display: block; width: clamp(22px, 2.1vw, 27px); height: clamp(22px, 2.1vw, 27px); object-fit: contain; }
        .pt-logo {
          display: block;
          width: clamp(22px, 2.1vw, 27px);
          height: clamp(22px, 2.1vw, 27px);
          -webkit-mask-image: var(--logo); mask-image: var(--logo);
          -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
          -webkit-mask-position: center; mask-position: center;
          -webkit-mask-size: contain; mask-size: contain;
        }
      `}</style>
    </section>
  );
}
