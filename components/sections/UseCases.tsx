import { RailGrid, type RailGroup } from "@/components/RailGrid";
import { ButtonLink } from "@/components/Button";
import { templateHref } from "@/lib/links";
import {
  IconBox, IconCamera, IconClapper, IconCompass, IconHanger, IconMegaphone, IconPalette, IconPerson, IconPlay,
} from "@/components/icons";

/**
 * Use cases and templates, on the shared rail-and-cards layout: the rail
 * lists the use cases, the grid shows the templates and examples for the
 * selected one. Every card links into the template gallery, filtered where a
 * confirmed category exists (advertising, cinematic, fashion, branding) and
 * unfiltered otherwise, rather than to a category that misdescribes it.
 *
 * Several clips serve more than one use case (ugc, upscale, sketch-to-render,
 * the studio films). Deliberate: a card is an example of the use case, and
 * the same piece of work is a fair example of two of them.
 */
const t = (category?: string) => templateHref(category);

const USE_CASES: RailGroup[] = [
  {
    id: "ads", title: "Ads", sub: "Static and motion, every format", icon: <IconMegaphone />, grain: "grain-charcoal",
    cards: [
      { name: "Ad Campaign", tag: "Template", video: "/media/templates/ad-campaign.mp4", href: t("advertising") },
      { name: "Product Ad", tag: "Use case", video: "/media/use-cases/advertising.mp4", href: t("advertising") },
      { name: "UGC Product Review", tag: "Template", video: "/media/capabilities/ugc.mp4", href: t("advertising") },
      { name: "Reframe for Placements", tag: "Use case", video: "/media/capabilities/reframe-presets.mp4", href: t("advertising") },
    ],
  },
  {
    id: "explainers", title: "Explainer Videos", sub: "Script to motion", icon: <IconPlay />, grain: "grain-steel",
    cards: [
      { name: "Motion Graphics", tag: "Use case", video: "/media/use-cases/motion.mp4", href: t() },
      { name: "Presenter Explainer", tag: "Template", video: "/media/studios/avatar-studio.mp4", href: t() },
      { name: "Concept Walkthrough", tag: "Use case", video: "/media/use-cases/concepting.mp4", href: t() },
    ],
  },
  {
    id: "film", title: "Film & Drama", sub: "Scenes, VFX and sound", icon: <IconClapper />, grain: "grain-teal",
    cards: [
      { name: "VFX Scene", tag: "Template", video: "/media/use-cases/film.mp4", href: t("cinematic") },
      { name: "Character Sequence", tag: "Use case", video: "/media/use-cases/character.mp4", href: t("cinematic") },
      { name: "VFX Shots", tag: "Use case", video: "/media/capabilities/vfx.mp4", href: t("cinematic") },
      { name: "Film Studio Cut", tag: "Template", video: "/media/studios/film-studio.mp4", href: t("cinematic") },
    ],
  },
  {
    id: "fashion", title: "Fashion", sub: "Lookbooks without the shoot", icon: <IconHanger />, grain: "grain-sand",
    cards: [
      { name: "Fashion Try-on", tag: "Template", video: "/media/templates/fashion-tryon.mp4", href: t("fashion") },
      { name: "Editorial", tag: "Use case", video: "/media/use-cases/fashion.mp4", href: t("fashion") },
      { name: "Fashion Studio Set", tag: "Template", video: "/media/studios/fashion-studio.mp4", href: t("fashion") },
      { name: "Outfit Try-on", tag: "Use case", video: "/media/capabilities/outfit-tryon.mp4", href: t("fashion") },
    ],
  },
  {
    id: "avatars", title: "Avatars", sub: "Presenters and characters", icon: <IconPerson />, grain: "grain-olive",
    cards: [
      { name: "Consistent Character", tag: "Template", video: "/media/use-cases/avatars.mp4", href: t() },
      { name: "UGC Creator", tag: "Use case", video: "/media/capabilities/ugc.mp4", href: t() },
      { name: "Presenter", tag: "Use case", video: "/media/studios/avatar-studio.mp4", href: t() },
    ],
  },
  {
    id: "product", title: "Product", sub: "Packshots to lifestyle", icon: <IconBox />, grain: "grain-mineral",
    cards: [
      { name: "Product Studio", tag: "Template", video: "/media/templates/product-studio.mp4", href: t() },
      { name: "Product Shots", tag: "Use case", video: "/media/use-cases/product.mp4", href: t() },
      { name: "Sketch to Render", tag: "Use case", video: "/media/capabilities/sketch-to-render.mp4", href: t() },
      { name: "Packshot Upscale", tag: "Use case", video: "/media/capabilities/upscale.mp4", href: t() },
    ],
  },
  {
    id: "branding", title: "Branding", sub: "Identity that stays on system", icon: <IconPalette />, grain: "grain-charcoal",
    cards: [
      { name: "Brand Kit", tag: "Template", video: "/media/templates/brand-kit.mp4", href: t("branding") },
      { name: "Identity Explorations", tag: "Use case", video: "/media/use-cases/branding.mp4", href: t("branding") },
      { name: "Brand Kit Sync", tag: "Use case", video: "/media/capabilities/brand-kits.mp4", href: t("branding") },
    ],
  },
  {
    id: "photography", title: "Photography", sub: "Editorial and commercial stills", icon: <IconCamera />, grain: "grain-steel",
    cards: [
      { name: "Editorial Stills", tag: "Use case", video: "/media/use-cases/photography.mp4", href: t() },
      { name: "Retouch and Inpaint", tag: "Use case", video: "/media/capabilities/inpaint.mp4", href: t() },
      { name: "Variations", tag: "Use case", video: "/media/capabilities/variate.mp4", href: t() },
    ],
  },
  {
    id: "concept", title: "Concept & Architecture", sub: "Worlds, props and spaces", icon: <IconCompass />, grain: "grain-teal",
    cards: [
      { name: "Concept Art", tag: "Use case", video: "/media/use-cases/concepting.mp4", href: t() },
      { name: "Architecture", tag: "Use case", video: "/media/use-cases/architecture.mp4", href: t() },
      { name: "Sketch to Render", tag: "Use case", video: "/media/capabilities/sketch-to-render.mp4", href: t() },
    ],
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="relative border-t border-black/[0.08] py-24 md:py-32">
      <div className="container-page">
        <div className="uc-head">
          <div className="mx-auto max-w-[680px] text-center">
            <h2 className="h2">Use Cases and Templates</h2>
            <p className="lede mx-auto mt-5">
              Working pipelines for the jobs teams do most.
            </p>
          </div>
          <ButtonLink href={templateHref()} target="_blank" rel="noopener noreferrer" variant="ghost" size="md">
            Browse all templates
          </ButtonLink>
        </div>

        <div className="mt-12">
          <RailGrid idPrefix="uc" label="Use cases" groups={USE_CASES} />
        </div>
      </div>

      <style>{`
        .uc-head {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }
      `}</style>
    </section>
  );
}
