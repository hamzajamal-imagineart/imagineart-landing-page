import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTint } from "@/components/PageTint";
import { Wash } from "@/components/Wash";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PaperBirds } from "@/components/PaperBirds";
import { FAQSection } from "@/components/FAQSection";
import { ReviewsSection } from "@/components/ReviewsSection";

import { HeroGlobeSection } from "@/components/sections/HeroGlobeSection";
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
      <PageTint palette="neutral" />
      <SiteNav variant="onDark" theme="light" />

      <main>
        {/* Drift (Hamza, 8 Oct): flying through space, stills grow out of
            a ring around the copy. The corridor that ran here before is
            parked at /hero-9, the always-open globe at /hero-8. */}
        <HeroGlobeSection drift />
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
