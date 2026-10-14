/* eslint-disable @next/next/no-img-element */
import { withBasePath } from "@/lib/assets";
import { SectionGuides } from "@/components/primitives/SectionGuides";
import { SectionGlow, sectionGlowCss } from "@/components/primitives/SectionGlow";

/**
 * "Trusted by": the customer marks in a still grid (Hamza, 7 Oct), seven
 * across on desktop. The model partners' row that sat under it was removed;
 * those marks are still in public/media/partners.
 *
 * The only section on the page that keeps the kit's SectionGuides (the
 * container-edge rules and corner dots), by request.
 *
 * Set, order and heights match the Business page (Hamza, 9 Oct: Khaadi in,
 * mnsaj out). They first came from the AI Ad Studio page
 * (hamzajamal-imagineart/ai-ad-studio, assets/brand-logos): grey
 * single-colour SVGs, each with its own cap so they read at one optical size.
 */
/** Display names for the hover label, where the file name isn't the brand's spelling. */
const LABEL: Record<string, string> = { Buzzlab: "Buzz Lab", ROLLEMAN: "Rolleman", xolour: "Xolour", Framon: "Framon Group" };

const CUSTOMERS: { name: string; h: number }[] = [
  { name: "Unilever", h: 30 }, { name: "Knorr", h: 28 }, { name: "Kayali", h: 28 },
  { name: "Pega", h: 19 }, { name: "Ashley", h: 22 }, { name: "Buzzlab", h: 18 },
  { name: "Crumble", h: 18 }, { name: "DAP", h: 30 }, { name: "Framon", h: 18 },
  { name: "Komodo", h: 20 }, { name: "ROLLEMAN", h: 15 }, { name: "Smarters", h: 16 },
  { name: "Khaadi", h: 18 }, { name: "xolour", h: 13 },
];

export function Partners() {
  return (
    <section className="pt-section relative border-t border-[color:var(--line)] pt-24 pb-16 md:pt-32 md:pb-20 lg:border-t-0" /* more room above, under the hero (8 Oct) */>
      {/* Under the hero again, where the model logos were (Hamza, 8 Oct):
          closed at both ends, since the platform strip below has no guides,
          and pulled in off the hero's foot. */}
      <SectionGuides edge="both" insetTop={56} />
      {/* The same pool of light as behind Models (Hamza, 8 Oct), centred on the logos. */}
      <SectionGlow position="50% 25%" />
      <div className="container-page">
        <p className="pt-cap">Trusted by the world's leading organizations</p>
        {/* A still grid (Hamza, 7 Oct): no marquee. */}
        <ul className="pt-grid mt-10">
          {CUSTOMERS.map((c) => (
            <li key={c.name} className="pt-cell">
              <img src={withBasePath(`/media/brand-logos/${c.name}.svg`)} alt={LABEL[c.name] ?? c.name} loading="lazy" decoding="async" style={{ maxHeight: c.h }} />
              {/* The brand's name fades in under its mark on hover (Hamza, 14 Oct). */}
              <span className="pt-name" aria-hidden>{LABEL[c.name] ?? c.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        ${sectionGlowCss}
        .pt-section { isolation: isolate; }
        .pt-section .sg { opacity: 0.6; } /* softer than Models' (Hamza, 8 Oct) */
        .pt-cap { text-align: center; font-size: var(--fs-sm); line-height: 1.5; color: var(--ink-3); }
        .pt-grid {
          list-style: none;
          margin-left: auto; margin-right: auto;
          max-width: 1080px;
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          row-gap: 36px;
          column-gap: 24px;
        }
        @media (max-width: 1023px) { .pt-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
        @media (max-width: 639px) { .pt-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); row-gap: 28px; } }
        .pt-cell { position: relative; display: flex; align-items: center; justify-content: center; height: 40px; }
        .pt-name { position: absolute; left: 50%; top: calc(100% + 8px); transform: translate(-50%, -4px); white-space: nowrap; font-size: var(--fs-xs); font-weight: 500; letter-spacing: 0.02em; color: var(--ink-2); opacity: 0; pointer-events: none; transition: opacity 0.25s ease, transform 0.3s var(--ease-out); }
        .pt-cell:hover .pt-name { opacity: 1; transform: translate(-50%, 0); }
        .pt-cell img { display: block; width: auto; height: auto; max-width: 100%; transition: filter 0.25s ease, transform 0.3s var(--ease-out); }
        /* Hover (Hamza, 8 Oct): the grey mark goes to ink and grows a touch. */
        .pt-cell:hover img { filter: brightness(0.15); transform: scale(1.08); }
        [data-theme="dark"] .pt-cell:hover img { filter: brightness(1.8); }
        @media (prefers-reduced-motion: reduce) { .pt-cell img { transition: filter 0.25s ease; } .pt-cell:hover img { transform: none; } .pt-name, .pt-cell:hover .pt-name { transform: translate(-50%, 0); } }
      `}</style>
    </section>
  );
}
