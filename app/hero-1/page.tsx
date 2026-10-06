import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTint } from "@/components/PageTint";
import { HeroGlobeSection } from "@/components/sections/HeroGlobeSection";

/**
 * /hero-1 (Hamza, 6 Oct): the three.js planet hero, parked on its own route
 * when the home page went back to the CONTENT / AT SCALE poster. The section
 * is dark on a light page, so the nav sits over it as `onDark`. It brings the
 * platform strip with it, as the hero always has.
 */
export const metadata: Metadata = {
  title: "Hero 1 — ImagineArt",
  robots: { index: false, follow: false },
};

export default function HeroOnePage() {
  return (
    <>
      <PageTint palette="neutral" />
      <SiteNav variant="onDark" theme="light" />
      <main>
        <HeroGlobeSection />
      </main>
      <SiteFooter />
    </>
  );
}
