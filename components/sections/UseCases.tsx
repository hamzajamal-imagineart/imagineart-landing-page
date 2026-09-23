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
 * Several clips serve more than one use case (ugc, upscale, sketch-to-render,
 * the studio films). Deliberate: a card is an example of the use case, and
 * the same piece of work is a fair example of two of them.
 */
const t = (category?: string) => templateHref(category);

const USE_CASES: WheelGroup[] = [
  {
    id: "explainers", href: t(), title: "Explainer Videos",
    cards: [
      { name: "Motion Graphics", video: "/media/use-cases/motion.mp4", href: t() },
      { name: "Presenter Explainer", video: "/media/studios/avatar-studio.mp4", href: t() },
      { name: "Concept Walkthrough", video: "/media/use-cases/concepting.mp4", href: t() },
      { name: "Product Explainer", video: "/media/use-cases/product.mp4", href: t() },
    ],
  },
  {
    id: "avatars", href: t(), title: "Avatars",
    cards: [
      { name: "Consistent Character", video: "/media/use-cases/avatars.mp4", href: t() },
      { name: "UGC Creator", video: "/media/capabilities/ugc.mp4", href: t() },
      { name: "Presenter", video: "/media/studios/avatar-studio.mp4", href: t() },
      { name: "Character Turnaround", video: "/media/use-cases/character.mp4", href: t() },
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
    id: "branding", href: t("branding"), title: "Branding",
    cards: [
      { name: "Brand Kit", video: "/media/templates/brand-kit.mp4", href: t("branding") },
      { name: "Identity Explorations", video: "/media/use-cases/branding.mp4", href: t("branding") },
      { name: "Brand Kit Sync", video: "/media/capabilities/brand-kits.mp4", href: t("branding") },
      { name: "Brand Campaign", video: "/media/templates/ad-campaign.mp4", href: t("branding") },
    ],
  },
  {
    id: "photography", href: t(), title: "Photography",
    cards: [
      { name: "Editorial Stills", video: "/media/use-cases/photography.mp4", href: t() },
      { name: "Retouch and Inpaint", video: "/media/capabilities/inpaint.mp4", href: t() },
      { name: "Variations", video: "/media/capabilities/variate.mp4", href: t() },
      { name: "Upscale to Print", video: "/media/capabilities/upscale.mp4", href: t() },
    ],
  },
  {
    id: "concept", href: t(), title: "Concept & Architecture",
    /* The only group of stills on the wheel (Hamza, 23 Sep): four
       architectural photographs, downscaled to 640 for a card 240 wide. */
    cards: [
      { name: "Interior Concept", image: "/media/use-cases/architecture/1.jpg", href: t() },
      { name: "Desert Residence", image: "/media/use-cases/architecture/2.jpg", href: t() },
      { name: "Concrete Massing", image: "/media/use-cases/architecture/3.jpg", href: t() },
      { name: "Interior Render", image: "/media/use-cases/architecture/4.jpg", href: t() },
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
