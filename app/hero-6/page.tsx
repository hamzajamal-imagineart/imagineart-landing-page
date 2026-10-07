import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTint } from "@/components/PageTint";
import { HeroGlobeSection } from "@/components/sections/HeroGlobeSection";

/**
 * /hero-6 (Hamza, 7 Oct): the home globe held open, its tiles parted into two
 * wings either side of the copy, which sits on clear ground. Not indexed.
 */
export const metadata: Metadata = {
  title: "Hero 6 — ImagineArt",
  robots: { index: false, follow: false },
};

export default function HeroSixPage() {
  return (
    <>
      <PageTint palette="neutral" />
      <SiteNav variant="onDark" theme="light" />
      <main>
        <HeroGlobeSection parted />
      </main>
      <SiteFooter />
    </>
  );
}
