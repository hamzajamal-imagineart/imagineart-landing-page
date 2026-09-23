import { UseCaseWheel, type WheelGroup } from "@/components/UseCaseWheel";
import { ButtonLink } from "@/components/Button";
import { templateHref } from "@/lib/links";
import { BlurHeading } from "@/components/BlurHeading";
import { SectionGlow, sectionGlowCss } from "@/components/primitives/SectionGlow";

/**
 * Use cases and templates, on the wheel: a centred list of use cases that
 * advances on its own, the active one in a pill with a link into the gallery,
 * its work scattered either side. Every link lands in the template gallery,
 * filtered where a confirmed category exists (advertising, cinematic,
 * fashion, branding) and unfiltered otherwise, rather than on a category
 * that misdescribes it.
 *
 * **Six groups, in this order** (Hamza, 23 Sep): Photography, Branding,
 * Interior Design, Try On, Product, Style Transfer. Explainer Videos and
 * Avatars came out; Concept & Architecture became Interior Design; Try On and
 * Style Transfer are new and built from footage already on the page.
 *
 * **The first three are stills**, not clips, which is what `WheelCard.image`
 * is for. The Branding four are one brand across packaging, kitchen, merch
 * and signage, rather than four unrelated pieces.
 *
 * Several clips serve more than one group (upscale, sketch-to-render, the
 * studio films). Deliberate: a card is an example of the use case, and the
 * same piece of work is a fair example of two of them.
 */
const t = (category?: string) => templateHref(category);

const USE_CASES: WheelGroup[] = [
  {
    id: "photography", href: t(), title: "Photography",
    cards: [
      { name: "Product Still Life", image: "/media/use-cases/photography/1.jpg", href: t() },
      { name: "Fashion Editorial", image: "/media/use-cases/photography/2.jpg", href: t() },
      { name: "Studio Portrait", image: "/media/use-cases/photography/3.jpg", href: t() },
      { name: "Packshot", image: "/media/use-cases/photography/4.jpg", href: t() },
    ],
  },
  {
    id: "branding", href: t("branding"), title: "Branding",
    /* One brand across four surfaces — packaging, kitchen, merch, signage —
       rather than four unrelated pieces, which is the claim the group is
       making. */
    cards: [
      { name: "Packaging", image: "/media/use-cases/branding/1.jpg", href: t("branding") },
      { name: "Brand Photography", image: "/media/use-cases/branding/2.jpg", href: t("branding") },
      { name: "Merch", image: "/media/use-cases/branding/3.jpg", href: t("branding") },
      { name: "Signage", image: "/media/use-cases/branding/4.jpg", href: t("branding") },
    ],
  },
  {
    id: "interiors", href: t(), title: "Interior Design",
    /* Two of the four are exteriors, which is what the pictures are. */
    cards: [
      { name: "Interior Concept", image: "/media/use-cases/architecture/1.jpg", href: t() },
      { name: "Desert Residence", image: "/media/use-cases/architecture/2.jpg", href: t() },
      { name: "Concrete Facade", image: "/media/use-cases/architecture/3.jpg", href: t() },
      { name: "Living Room Render", image: "/media/use-cases/architecture/4.jpg", href: t() },
    ],
  },
  {
    id: "try-on", href: t("fashion"), title: "Try On",
    cards: [
      { name: "Outfit Try-on", video: "/media/capabilities/outfit-tryon.mp4", href: t("fashion") },
      { name: "Catalog Look", video: "/media/templates/fashion-tryon.mp4", href: t("fashion") },
      { name: "Model Swap", video: "/media/use-cases/fashion.mp4", href: t("fashion") },
      { name: "Campaign Shot", video: "/media/studios/fashion-studio.mp4", href: t("fashion") },
    ],
  },
  {
    id: "product", href: t(), title: "Product",
    cards: [
      { name: "Product Studio", video: "/media/templates/product-studio.mp4", href: t() },
      { name: "Product Shots", video: "/media/use-cases/product.mp4", href: t() },
      { name: "Sketch to Render", video: "/media/capabilities/sketch-to-render.mp4", href: t() },
      { name: "Packshot Upscale", video: "/media/capabilities/upscale.mp4", href: t() },
    ],
  },
  {
    id: "style-transfer", href: t(), title: "Style Transfer",
    cards: [
      { name: "Variations", video: "/media/capabilities/variate.mp4", href: t() },
      { name: "Effects", video: "/media/capabilities/vfx.mp4", href: t() },
      { name: "Brand Kit Styling", video: "/media/capabilities/brand-kits.mp4", href: t("branding") },
      { name: "Concept Restyle", video: "/media/use-cases/concepting.mp4", href: t() },
    ],
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="relative border-t border-[color:var(--line)] py-24 md:py-32">
      <SectionGlow position="50% 8%" />
      <div className="container-page">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="uc-eyebrow">Use Cases</p>
          <BlurHeading className="h2 uc-title" lead="One-click skills" muted="for every creative task" />
        </div>

        <div className="mt-12">
          <UseCaseWheel label="Use cases" groups={USE_CASES} />
        </div>

        <div className="uc-foot">
          <ButtonLink href={templateHref()} target="_blank" rel="noopener noreferrer" variant="ghost" size="md">
            Browse all templates
          </ButtonLink>
        </div>
      </div>

      <style>{`
        /* Hosts a <SectionGlow> at z-index -1. */
        #use-cases { isolation: isolate; }
        ${sectionGlowCss}


        /* Narrow, the wheel's cards deliberately run past the container on
           both sides. Clipped at the section rather than left to widen the
           document, so the page still never scrolls sideways. */
        #use-cases { overflow-x: hidden; overflow-x: clip; }

        /* The only heading on the page meant to break across two lines, so it
           opts out of the global .h2 nowrap rather than running to 840px. */
        .h2.uc-title { white-space: normal; text-wrap: balance; max-width: 15ch; margin-inline: auto; }

        /* The page's one eyebrow. Every other section goes straight to its
           heading, but this heading no longer names its own section. */
        .uc-eyebrow {
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin-bottom: 14px;
        }

        .uc-foot {
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }
      `}</style>
    </section>
  );
}
