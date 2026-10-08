import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTint } from "@/components/PageTint";
import { HeroGlobeSection } from "@/components/sections/HeroGlobeSection";

/**
 * /hero-8 (Hamza, 8 Oct): the home page's globe hero as it was until the
 * corridor replaced it there: always open, parting further after 1s of
 * hover. Parked for comparison; not indexed.
 */
export const metadata: Metadata = {
  title: "Hero 8 — ImagineArt",
  robots: { index: false, follow: false },
};

export default function HeroEightPage() {
  return (
    <>
      <PageTint palette="neutral" />
      <SiteNav variant="onDark" theme="light" />
      <main>
        <HeroGlobeSection alwaysOpen />
      </main>
      <SiteFooter />
    </>
  );
}
