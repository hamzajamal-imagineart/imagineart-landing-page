import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTint } from "@/components/PageTint";
import { HeroGlobeSection } from "@/components/sections/HeroGlobeSection";

/**
 * /hero-7 (Hamza, 7 Oct): tall cards stacked at both edges that fly into the
 * globe after the pointer rests on the hero for half a second. Not indexed.
 */
export const metadata: Metadata = {
  title: "Hero 7 — ImagineArt",
  robots: { index: false, follow: false },
};

export default function HeroSevenPage() {
  return (
    <>
      <PageTint palette="neutral" />
      <SiteNav variant="onDark" theme="light" />
      <main>
        <HeroGlobeSection morph />
      </main>
      <SiteFooter />
    </>
  );
}
