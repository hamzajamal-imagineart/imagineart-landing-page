import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTint } from "@/components/PageTint";
import { HeroGlobeSection } from "@/components/sections/HeroGlobeSection";

/**
 * /hero-3 (Hamza, 7 Oct): the home hero with the tiles wound into a turning
 * spiral disc instead of a globe. Parked for comparison; not indexed.
 */
export const metadata: Metadata = {
  title: "Hero 3 — ImagineArt",
  robots: { index: false, follow: false },
};

export default function HeroThreePage() {
  return (
    <>
      <PageTint palette="neutral" />
      <SiteNav variant="onDark" theme="light" />
      <main>
        <HeroGlobeSection shape="spiral" />
      </main>
      <SiteFooter />
    </>
  );
}
