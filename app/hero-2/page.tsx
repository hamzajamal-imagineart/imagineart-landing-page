import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTint } from "@/components/PageTint";
import { HeroGlobeSection } from "@/components/sections/HeroGlobeSection";

/**
 * /hero-2 (Hamza, 7 Oct): the home page's globe hero in light mode, with the
 * platform strip it carries. Parked for comparison; not indexed.
 */
export const metadata: Metadata = {
  title: "Hero 2 — ImagineArt",
  robots: { index: false, follow: false },
};

export default function HeroTwoPage() {
  return (
    <>
      <PageTint palette="neutral" />
      <SiteNav variant="onLight" theme="light" />
      <main>
        <HeroGlobeSection light />
      </main>
      <SiteFooter />
    </>
  );
}
