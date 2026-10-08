import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTint } from "@/components/PageTint";
import { HeroGlobeSection } from "@/components/sections/HeroGlobeSection";

/**
 * /hero-9 (Hamza, 8 Oct): the corridor, the home hero before the drift
 * took its place. Two walls of tiles stream out of a vanishing point behind
 * the copy. Not indexed.
 */
export const metadata: Metadata = {
  title: "Hero 9 — ImagineArt",
  robots: { index: false, follow: false },
};

export default function HeroNinePage() {
  return (
    <>
      <PageTint palette="neutral" />
      <SiteNav variant="onDark" theme="light" />
      <main>
        <HeroGlobeSection shape="corridor" />
      </main>
      <SiteFooter />
    </>
  );
}
