import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTint } from "@/components/PageTint";
import { Wash } from "@/components/Wash";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PaperBirds } from "@/components/PaperBirds";
import { FAQSection } from "@/components/FAQSection";
import { ReviewsSection } from "@/components/ReviewsSection";

import { HeroGlobeSection } from "@/components/sections/HeroGlobeSection";
import { ModelMarquee } from "@/components/sections/ModelMarquee";
import { Partners } from "@/components/sections/Partners";
import { Suite } from "@/components/sections/Suite";
import { Outcomes } from "@/components/sections/Outcomes";
import { Industries } from "@/components/sections/Industries";
import { Workflows } from "@/components/sections/Workflows";
import { Models } from "@/components/sections/Models";
import { Security } from "@/components/sections/Security";
import { ClosingCta } from "@/components/sections/ClosingCta";

// Kept in sync with layout.tsx's metadata. The FAQ emits its own FAQPage
// schema, so it is not duplicated here.
const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ImagineArt",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

/**
 * The ImagineArt product overview.
 *
 * Order follows the funnel: what it is (hero, which carries the platform
 * strip and with it the MCP panel), what is in it (the suite rail, from the
 * Enterprise page), what it makes (outcomes, from Figma 644:4317), who it is for (industries, also from the Enterprise page), how to put it on rails (workflows, with its connectors and
 * plugins), what to do instead of building one (the agent), what to start
 * from (use cases), what powers it (models), whether it is safe to put work
 * into (security), who vouches for it (reviews), what people ask (FAQ), then
 * the closing action.
 *
 * <Apps>, <StudioReel>, <Mcp>, <CreativeTools> and <Agent> are pulled, not deleted: all five are still
 * on disk, so recovering any is one import and one line here. MCP is not
 * gone from the page — the hero's MCP chip carries the same panel, which is
 * why the section came out.
 */
export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      {/* Dark mode for this page (Hamza, 8 Oct). The dark tokens key off
          :root[data-theme="dark"] (globals.css), and the body takes its colour
          from them, so the attribute goes on <html>, set inline so it lands
          before first paint. Other routes stay light. */}
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.setAttribute('data-theme','dark')" }} />
      <PageTint palette="neutral" />
      <SiteNav variant="onDark" theme="dark" />

      <main>
        {/* Orbit hero (Hamza, 8 Oct), from the "Controllable content at
            scale" page. The drift fly-through that ran here is parked at
            /hero-2, the corridor at /hero-9. */}
        <HeroGlobeSection orbit beforeStrip={<ModelMarquee />} />
        {/* Logos back under the platform strip (Hamza, 8 Oct). */}
        <Partners />
        <Suite />
        {/* Pastel wash behind Models (Hamza, 7 Oct); the one behind Outcomes came off on 8 Oct. */}
        <Outcomes />
        <Industries />
        <Workflows />
        <Wash variant="b"><Models /></Wash>
        <Security />
        <ReviewsSection />
        <FAQSection />
        <ClosingCta />
      </main>

      <SiteFooter />
      <ScrollReveal />
      {/* Experiment (Hamza, 8 Oct): origami birds fly right to left on scroll from the suite on. */}
      <PaperBirds />
    </>
  );
}
