import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTint } from "@/components/PageTint";
import { Hero } from "@/components/sections/Hero";

/**
 * /hero-1 (Hamza, 7 Oct): the CONTENT / AT SCALE poster hero with the globe
 * in its centre and the use-case picker, parked here while the home page
 * runs the full-bleed planet hero. Light stage, so the nav is `onLight`. It
 * brings the platform strip with it, as the hero always has.
 */
export const metadata: Metadata = {
  title: "Hero 1 — ImagineArt",
  robots: { index: false, follow: false },
};

export default function HeroOnePage() {
  return (
    <>
      <PageTint palette="neutral" />
      <SiteNav variant="onLight" theme="light" />
      <main>
        <Hero />
      </main>
      <SiteFooter />
    </>
  );
}
