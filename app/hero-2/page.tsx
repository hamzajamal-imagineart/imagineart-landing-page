import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTint } from "@/components/PageTint";
import { HeroGlobeSection } from "@/components/sections/HeroGlobeSection";

/**
 * /hero-2 (Hamza, 8 Oct): the drift fly-through, the home hero until the
 * orbit hero took its place, with the platform strip it carries. Stills
 * grow out of a ring around the copy and play their clip on hover. Not
 * indexed. (The light globe that was here before is `<HeroGlobeSection light />`.)
 */
export const metadata: Metadata = {
  title: "Hero 2 — ImagineArt",
  robots: { index: false, follow: false },
};

export default function HeroTwoPage() {
  return (
    <>
      <PageTint palette="neutral" />
      <SiteNav variant="onDark" theme="light" />
      <main>
        <HeroGlobeSection drift />
      </main>
      <SiteFooter />
    </>
  );
}
