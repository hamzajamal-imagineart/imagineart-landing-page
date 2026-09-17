import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTint } from "@/components/PageTint";
import { FAQSection } from "@/components/FAQSection";
import { ReviewsSection } from "@/components/ReviewsSection";

import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { CreativeTools } from "@/components/sections/CreativeTools";
import { Workflows } from "@/components/sections/Workflows";
import { Mcp } from "@/components/sections/Mcp";
import { AdStudio } from "@/components/sections/AdStudio";
import { FashionStudio } from "@/components/sections/FashionStudio";
import { FilmStudio } from "@/components/sections/FilmStudio";
import { UseCases } from "@/components/sections/UseCases";
import { Models } from "@/components/sections/Models";
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
 * Order follows the funnel: what it is and how it is organised (hero, with
 * its Creative · Workflows · Computer tabs), what it can do (creative tools),
 * how to put it on rails (workflows, with its connectors and plugins), where
 * to do the work (the three studio banners), what to start from (use cases),
 * how it plugs into your own agents (MCP), what powers it (models), who
 * vouches for it (reviews), what people ask (FAQ), then the closing action.
 *
 * <Apps> is pulled for now, not deleted: the component and its data are still
 * in components/sections/Apps.tsx, so recovering it is one import and one
 * line here, plus its nav entry if it earns one.
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
        <Workflows />
        <AdStudio />
        <FashionStudio />
        <FilmStudio />
        <UseCases />
        <Mcp />
        <Models />
        <ReviewsSection />
        <FAQSection />
        <ClosingCta />
      </main>

      <SiteFooter />
    </>
  );
}
