/* eslint-disable @next/next/no-img-element */
import { withBasePath } from "@/lib/assets";
import { SectionGuides } from "@/components/primitives/SectionGuides";

/**
 * "Trusted by": the customer marks in a still grid (Hamza, 7 Oct), seven
 * across on desktop. The model partners' row that sat under it was removed;
 * those marks are still in public/media/partners.
 *
 * The only section on the page that keeps the kit's SectionGuides (the
 * container-edge rules and corner dots), by request.
 *
 * The set and heights come from the AI Ad Studio page
 * (hamzajamal-imagineart/ai-ad-studio, assets/brand-logos): grey
 * single-colour SVGs, each with its own cap so they read at one optical size.
 */
const CUSTOMERS: { name: string; h: number }[] = [
  { name: "Unilever", h: 30 }, { name: "Knorr", h: 28 }, { name: "Kayali", h: 28 },
  { name: "Pega", h: 19 }, { name: "Ashley", h: 22 }, { name: "Buzzlab", h: 18 },
  { name: "Crumble", h: 18 }, { name: "DAP", h: 30 }, { name: "Framon", h: 18 },
  { name: "Komodo", h: 20 }, { name: "ROLLEMAN", h: 15 }, { name: "Smarters", h: 16 },
  { name: "mnsaj", h: 30 }, { name: "xolour", h: 13 },
];

export function Partners() {
  return (
    <section className="relative border-t border-[color:var(--line)] py-16 md:py-20 lg:border-t-0">
      <SectionGuides edge="top" />
      <div className="container-page">
        <p className="pt-cap">Trusted by the brands you benchmark against</p>
        {/* A still grid (Hamza, 7 Oct): no marquee. */}
        <ul className="pt-grid mt-10">
          {CUSTOMERS.map((c) => (
            <li key={c.name} className="pt-cell">
              <img src={withBasePath(`/media/brand-logos/${c.name}.svg`)} alt={c.name} loading="lazy" decoding="async" style={{ maxHeight: c.h }} />
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .pt-cap { text-align: center; font-size: 13px; line-height: 1.5; color: var(--ink-3); }
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
        .pt-cell { display: flex; align-items: center; justify-content: center; height: 40px; }
        .pt-cell img { display: block; width: auto; height: auto; max-width: 100%; }
      `}</style>
    </section>
  );
}
