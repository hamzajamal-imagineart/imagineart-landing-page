import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTint } from "@/components/PageTint";
import { HeroGlobeSection } from "@/components/sections/HeroGlobeSection";

/**
 * /hero-4 (Hamza, 7 Oct): the home hero with the tiles on a vertical
 * hourglass, wide at the top and foot and pinched in the middle, streaming
 * downward as it turns so images come round to the front. Not indexed.
 */
export const metadata: Metadata = {
  title: "Hero 4 — ImagineArt",
  robots: { index: false, follow: false },
};

export default function HeroFourPage() {
  return (
    <>
      <PageTint palette="neutral" />
      <SiteNav variant="onDark" theme="light" />
      <main>
        <HeroGlobeSection shape="hourglass" />
      </main>
      <SiteFooter />
    </>
  );
}
