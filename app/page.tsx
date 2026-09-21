import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTint } from "@/components/PageTint";
import { FAQSection } from "@/components/FAQSection";
import { ReviewsSection } from "@/components/ReviewsSection";

import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { CreativeTools } from "@/components/sections/CreativeTools";
import { Workflows } from "@/components/sections/Workflows";
import { AdStudio } from "@/components/sections/AdStudio";
import { FashionStudio } from "@/components/sections/FashionStudio";
import { FilmStudio } from "@/components/sections/FilmStudio";
import { Agent } from "@/components/sections/Agent";
import { UseCases } from "@/components/sections/UseCases";
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
 * Order follows the funnel: what it is (hero, which also carries the MCP
 * panel), what it can do (creative tools), where to do the work (the three
 * studio banners), how to put it on rails (workflows, with its connectors and
 * plugins), what to do instead of building one (the agent), what to start
 * from (use cases), what powers it (models), whether it is safe to put work
 * into (security), who vouches for it (reviews), what people ask (FAQ), then
 * the closing action.
 *
 * <Apps>, <StudioReel> and <Mcp> are pulled, not deleted: all three are still
 * on disk, so recovering any is one import and one line here. MCP is not
 * gone from the page — the hero's MCP chip carries the same panel, which is
 * why the section came out.
 */
export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <PageTint palette="slate" />
      <SiteNav variant="onLight" />

      <main>
        <Hero />
        <Partners />
        <CreativeTools />
        <AdStudio />
        <FashionStudio />
        <FilmStudio />
        <Workflows />
        <Agent />
        <UseCases />
        <Models />
        <Security />
        <ReviewsSection />
        <FAQSection />
        <ClosingCta />
      </main>

      <SiteFooter />
    </>
  );
}
